export const SOCKET_LIMITS = {
  roomIdMaxLength: 2048,
  messageMaxLength: 2000,
  senderMaxLength: 100,
  signalMaxLength: 100_000,
};

const isBoundedString = (value, maxLength) =>
  typeof value === "string" && value.length > 0 && value.length <= maxLength;

export const isValidRoomId = (roomId) => isBoundedString(roomId, SOCKET_LIMITS.roomIdMaxLength);

export const isValidSignal = (toId, message) =>
  typeof toId === "string" && isBoundedString(message, SOCKET_LIMITS.signalMaxLength);

export const isValidChatMessage = (data) =>
  isBoundedString(data, SOCKET_LIMITS.messageMaxLength) && data.trim().length > 0;

export const normalizeSender = (sender) =>
  typeof sender === "string" && sender.trim()
    ? sender.trim().slice(0, SOCKET_LIMITS.senderMaxLength)
    : "Guest";
