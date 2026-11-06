import dotenv from "dotenv";

dotenv.config();

const DEFAULT_CLIENT_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://meetme-frontend.onrender.com",
];

const parseOrigins = (value) =>
  value
    ? value.split(",").map((origin) => origin.trim()).filter(Boolean)
    : DEFAULT_CLIENT_ORIGINS;

export const env = {
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGO_URI,
  // Own database so MeetMe never shares collections (e.g. `users`) with other apps on the
  // same cluster. Overrides any database name in MONGO_URI (which otherwise defaults to "test").
  mongoDbName: process.env.MONGO_DB_NAME || "meetme",
  tokenKey: process.env.TOKEN_KEY,
  isProduction: process.env.NODE_ENV === "production",
  clientOrigins: parseOrigins(process.env.CLIENT_ORIGINS),
};

// Fail fast instead of starting a server that cannot authenticate or persist data.
export const assertRequiredEnv = () => {
  const missing = [];
  if (!env.mongoUri) missing.push("MONGO_URI");
  if (!env.tokenKey) missing.push("TOKEN_KEY");
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};
