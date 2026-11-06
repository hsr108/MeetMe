import { normalizeMeetingCode } from "../../join/meetingCode.js";

// Socket.IO event names shared with backend/src/socket/registerSocketHandlers.js
export const SIGNALING_EVENTS = {
  joinCall: "join-call",
  signal: "signal",
  chatMessage: "chat-message",
  userJoined: "user-joined",
  userLeft: "user-left",
};

// The room id is the normalized meeting code from the path (/abc123xyz), NOT the full URL:
// people opening the app via localhost, a LAN IP, http or https must land in the same room.
export const getCurrentRoomId = () =>
  normalizeMeetingCode(decodeURIComponent(window.location.pathname.replace(/^\/+/, "")));
