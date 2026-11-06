import { Server } from "socket.io";
import { createRoomStore } from "./roomStore.js";
import { registerSocketHandlers } from "./registerSocketHandlers.js";
import { createCallSessionRecorder } from "./callSessionRecorder.js";

const connectToSocket = (server, { clientOrigins }) => {
  const io = new Server(server, {
    cors: {
      origin: clientOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const store = createRoomStore();
  const recorder = createCallSessionRecorder();

  io.on("connection", (socket) => {
    registerSocketHandlers(io, socket, store, recorder);
  });

  return io;
};

export { connectToSocket };
