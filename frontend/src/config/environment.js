const IS_LOCALHOST =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// VITE_API_URL overrides everything.
// Dev server: same origin; vite.config.js proxies /users, /auth and /socket.io to the backend,
//   so it works from other devices (http://<LAN-IP>:5173) and over dev HTTPS.
// Production build: Render backend, or the local backend when opened on localhost.
const PROD_API_URL = "https://meetme-backend-85an.onrender.com/";
const LOCAL_API_URL = "http://localhost:5001/";

const resolveServer = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV) return `${window.location.origin}/`;
  return IS_LOCALHOST ? LOCAL_API_URL : PROD_API_URL;
};

const server = resolveServer();

export default server;
