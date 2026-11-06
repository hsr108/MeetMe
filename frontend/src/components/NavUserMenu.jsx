import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { ROUTES } from "../config/routes.js";
import ConfirmDialog from "./ConfirmDialog.jsx";

// Right side of the navbar for a logged-in user: History, Logout and the greeting.
function NavUserMenu() {
  const { currentUser, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const closeConfirm = useCallback(() => setIsConfirmOpen(false), []);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      const data = await handleLogout();
      if (data.success) navigate(ROUTES.landing, { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <li>
        <Link to={ROUTES.home} className="nav-text-btn">
          Home
        </Link>
      </li>
      <li>
        <Link to={ROUTES.history} className="nav-text-btn">
          History
        </Link>
      </li>
      <li>
        <button type="button" className="nav-text-btn" onClick={() => setIsConfirmOpen(true)}>
          Logout
        </button>
      </li>
      <li>
        <Link className="nav-greeting" to={ROUTES.home}>
          Hello, <span>{currentUser.username}</span>!
        </Link>
      </li>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Log out?"
        message="You will need to log in again to see your home page and meeting history."
        confirmLabel={isLoggingOut ? "Logging out…" : "Log out"}
        onConfirm={confirmLogout}
        onCancel={closeConfirm}
        isBusy={isLoggingOut}
      />
    </>
  );
}

export default NavUserMenu;
