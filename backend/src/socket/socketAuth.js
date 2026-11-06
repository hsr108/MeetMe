import { AUTH_COOKIE_NAME } from "../utils/authCookie.js";
import { verifyToken } from "../utils/token.js";

const readCookie = (cookieHeader, name) => {
  if (!cookieHeader) return undefined;
  const entry = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined;
};

// The logged-in user ({ username, name }) behind a socket, from the auth cookie sent with
// the Socket.IO handshake; null for guests. No database lookup: the JWT carries both fields.
export const getSocketUser = (socket) => {
  const token = readCookie(socket.handshake?.headers?.cookie, AUTH_COOKIE_NAME);
  const decoded = verifyToken(token);
  return decoded ? { username: decoded.username, name: decoded.name } : null;
};
