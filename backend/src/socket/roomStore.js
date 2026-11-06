import { randomUUID } from "node:crypto";

export const MAX_MESSAGES_PER_ROOM = 200;

// In-memory room membership, display names and chat history. State is per process and lost
// on restart. A "session" is one continuous call: it starts when the first person joins an
// empty room and ends when the last one leaves.
export const createRoomStore = ({ createSessionId = randomUUID } = {}) => {
  const roomMembers = new Map(); // roomId -> socketId[] (join order)
  const socketRoom = new Map(); // socketId -> roomId
  const socketNames = new Map(); // socketId -> display name
  const roomSessions = new Map(); // roomId -> sessionId
  const roomMessages = new Map(); // roomId -> { sender, data, "socket-id-sender" }[]

  const getRoom = (socketId) => socketRoom.get(socketId);

  const getMembers = (roomId) => roomMembers.get(roomId) ?? [];

  const getMessages = (roomId) => roomMessages.get(roomId) ?? [];

  // { socketId: displayName } for everyone currently in the room.
  const getNames = (roomId) =>
    Object.fromEntries(getMembers(roomId).map((id) => [id, socketNames.get(id)]));

  // Returns { roomId, remaining, sessionId } or null; remaining = [] means the call ended.
  const leave = (socketId) => {
    const roomId = socketRoom.get(socketId);
    if (roomId === undefined) return null;

    const sessionId = roomSessions.get(roomId);
    socketRoom.delete(socketId);
    socketNames.delete(socketId);
    const remaining = getMembers(roomId).filter((id) => id !== socketId);
    if (remaining.length === 0) {
      roomMembers.delete(roomId);
      roomMessages.delete(roomId);
      roomSessions.delete(roomId);
    } else {
      roomMembers.set(roomId, remaining);
    }
    return { roomId, remaining, sessionId };
  };

  const join = (roomId, socketId, name) => {
    const currentRoom = socketRoom.get(socketId);
    const left = currentRoom !== undefined && currentRoom !== roomId ? leave(socketId) : null;

    if (!roomSessions.has(roomId)) roomSessions.set(roomId, createSessionId());
    const members = getMembers(roomId);
    if (!members.includes(socketId)) {
      roomMembers.set(roomId, [...members, socketId]);
    }
    socketRoom.set(socketId, roomId);
    if (name !== undefined) socketNames.set(socketId, name);
    return {
      members: getMembers(roomId),
      names: getNames(roomId),
      sessionId: roomSessions.get(roomId),
      left,
    };
  };

  const addMessage = (roomId, message) => {
    const history = [...getMessages(roomId), message].slice(-MAX_MESSAGES_PER_ROOM);
    roomMessages.set(roomId, history);
  };

  const areInSameRoom = (socketIdA, socketIdB) => {
    const roomId = socketRoom.get(socketIdA);
    return roomId !== undefined && roomId === socketRoom.get(socketIdB);
  };

  return { join, leave, getRoom, getMembers, getNames, getMessages, addMessage, areInSameRoom };
};
