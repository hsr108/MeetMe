import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { ROUTES } from "../config/routes.js";

// For pages only logged-out users need (e.g. /auth): logged-in users go to /home instead.
// Renders nothing until the login check finishes, so the form never flashes.
function RedirectIfLoggedIn({ children }) {
  const { currentUser, isAuthReady } = useAuth();

  if (!isAuthReady) return null;
  if (currentUser) return <Navigate to={ROUTES.home} replace />;
  return children;
}

export default RedirectIfLoggedIn;
