import mongoose from "mongoose";

const RETRY_DELAY_MS = 10_000;
const CONNECTED = 1; // mongoose.ConnectionStates.connected

export const isDatabaseConnected = () => mongoose.connection.readyState === CONNECTED;

// Keeps retrying instead of exiting, so the HTTP/Socket.IO server stays up
// (meetings work without MongoDB; only auth and history need it).
export const connectDatabaseWithRetry = async (uri, dbName, retryDelayMs = RETRY_DELAY_MS) => {
  for (;;) {
    try {
      await mongoose.connect(uri, { dbName });
      console.log(`✅ MongoDB connected (database "${dbName}")`);
      return;
    } catch (err) {
      console.error(`❌ MongoDB connection failed (${err.code ?? err.name}): ${err.message}`);
      console.error(`   Retrying in ${retryDelayMs / 1000}s. Check MONGO_URI in backend/.env.`);
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
};
