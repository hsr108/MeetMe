import {
  isValidRoomId,
  isValidSignal,
  isValidChatMessage,
  normalizeSender,
} from "./socketValidators.js";
import { getSocketUser } from "./socketAuth.js";

// Socket events (contract shared with frontend/src/features/meeting/signaling):
//   in:  join-call(roomId, displayName) | signal(toId, json) | chat-message(text, sender)
//   out: user-joined(id, members, namesById) | user-left(id) | signal(fromId, json)
//        chat-message(text, sender, senderSocketId)

// Persistence hooks (see callSessionRecorder.js); a no-op by default, e.g. in tests.
const NO_RECORDER = { onParticipantJoined: () => {}, onSessionEnded: () => {} };

const replayChatHistory = (socket, messages) => {
  messages.forEach((message) => {
    socket.emit("chat-message", message.data, message.sender, message["socket-id-sender"]);
  });
};

export const registerSocketHandlers = (io, socket, store, recorder = NO_RECORDER) => {
  // Tells the rest of the room someone left, or closes the session if nobody is left.
  const handleLeft = (left) => {
    if (!left) return;
    if (left.remaining.length > 0) io.to(left.remaining).emit("user-left", socket.id);
    else recorder.onSessionEnded(left.sessionId);
  };

  socket.on("join-call", (roomId, displayName) => {
    if (!isValidRoomId(roomId)) return;

    const name = normalizeSender(displayName);
    const { members, names, sessionId, left } = store.join(roomId, socket.id, name);
    handleLeft(left);
    io.to(members).emit("user-joined", socket.id, members, names);
    replayChatHistory(socket, store.getMessages(roomId));

    const user = getSocketUser(socket);
    recorder.onParticipantJoined({ sessionId, roomId, name, username: user?.username ?? null });
  });

  // Relay WebRTC offers/answers/ICE only between members of the same room.
  socket.on("signal", (toId, message) => {
    if (!isValidSignal(toId, message)) return;
    if (!store.areInSameRoom(socket.id, toId)) return;
    io.to(toId).emit("signal", socket.id, message);
  });

  // Broadcasts to everyone in the room, including the sender (the client relies on this echo).
  socket.on("chat-message", (data, sender) => {
    const roomId = store.getRoom(socket.id);
    if (roomId === undefined || !isValidChatMessage(data)) return;

    const senderName = normalizeSender(sender);
    store.addMessage(roomId, { sender: senderName, data, "socket-id-sender": socket.id });
    io.to(store.getMembers(roomId)).emit("chat-message", data, senderName, socket.id);
  });

  socket.on("disconnect", () => {
    handleLeft(store.leave(socket.id));
  });
};
