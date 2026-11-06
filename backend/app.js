import { createServer } from "node:http";
import { env, assertRequiredEnv } from "./src/config/env.js";
import { createApp } from "./src/createApp.js";
import { connectDatabaseWithRetry } from "./src/db/connectDatabase.js";
import { connectToSocket } from "./src/socket/index.js";

const start = () => {
  assertRequiredEnv();

  const app = createApp({ clientOrigins: env.clientOrigins });
  const server = createServer(app);
  connectToSocket(server, { clientOrigins: env.clientOrigins });

  server.on("error", (err) => {
    const hint = err.code === "EADDRINUSE" ? ` (port ${env.port} is already in use)` : "";
    console.error(`❌ HTTP server error${hint}:`, err.message);
    process.exit(1);
  });

  // Listen first: an unreachable database must not take signaling down with it.
  server.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port} at http://localhost:${env.port}`);
  });
  connectDatabaseWithRetry(env.mongoUri, env.mongoDbName);
};

try {
  start();
} catch (err) {
  console.error("❌ Server failed to start:", err.message);
  process.exit(1);
}
