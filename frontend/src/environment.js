const IS_PROD = typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

// Use VITE_API_URL env var if set, otherwise fall back to port 5001 (matches backend .env PORT=5001)
const server = IS_PROD
  ? (import.meta.env.VITE_API_URL || "https://meetme-backend-85an.onrender.com/")
  : (import.meta.env.VITE_API_URL || "http://localhost:5001/");

export default server;