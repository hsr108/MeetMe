import { useCallback, useEffect, useRef } from "react";
import io from "socket.io-client";
import server from "../../../config/environment.js";
import { SIGNALING_EVENTS, getCurrentRoomId } from "../signaling/signalingEvents.js";

// Owns the Socket.IO connection. Events are forwarded to handlersRef.current so the
// listeners are registered once and still see the latest handlers.
export const useSignaling = (enabled, handlersRef) => {
  const socketRef = useRef(null);
  const selfIdRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    // withCredentials sends the auth cookie, so the server knows which account joined.
    const socket = io.connect(server, { secure: server.startsWith("https"), withCredentials: true });
    socketRef.current = socket;
    const forward = (name) => (...args) => handlersRef.current[name]?.(...args);

    // Fires again after every automatic reconnect, with a new socket id.
    socket.on("connect", () => {
      const previousId = selfIdRef.current;
      selfIdRef.current = socket.id;
      handlersRef.current.onConnect?.(previousId);
      socket.emit(SIGNALING_EVENTS.joinCall, getCurrentRoomId(), handlersRef.current.displayName);
    });
    socket.on(SIGNALING_EVENTS.signal, forward("onSignal"));
    socket.on(SIGNALING_EVENTS.userJoined, forward("onUserJoined"));
    socket.on(SIGNALING_EVENTS.userLeft, forward("onUserLeft"));
    socket.on(SIGNALING_EVENTS.chatMessage, forward("onChatMessage"));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, handlersRef]);

  const sendSignal = useCallback((toId, payload) => {
    socketRef.current?.emit(SIGNALING_EVENTS.signal, toId, JSON.stringify(payload));
  }, []);

  const sendChatMessage = useCallback((text, sender) => {
    socketRef.current?.emit(SIGNALING_EVENTS.chatMessage, text, sender);
  }, []);

  return { selfIdRef, sendSignal, sendChatMessage };
};
