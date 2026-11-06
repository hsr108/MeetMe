import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../features/auth/LoginForm.jsx";
import SignupForm from "../features/auth/SignupForm.jsx";
import { ROUTES } from "../config/routes.js";
import "../features/auth/styles/authShell.css";
import "../features/auth/styles/authForm.css";

// Rendered standalone at /auth (full-page gradient) and inside the landing-page modal,
// where modalhandler closes it. Standalone, the close button goes back to the landing page.
function AuthenticationPage({ modalhandler }) {
  // Login first: people sign up once but log in every time.
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();
  const isModal = Boolean(modalhandler);
  const toggleForm = () => setShowSignup((prev) => !prev);
  const handleClose = isModal ? modalhandler : () => navigate(ROUTES.landing);

  const card = (
    <div className="auth-card">
      <button type="button" className="auth-close-btn" onClick={handleClose} aria-label="Close">
        <i className="fa-solid fa-xmark"></i>
      </button>
      {showSignup ? (
        <SignupForm handleForm={toggleForm} />
      ) : (
        <LoginForm handleForm={toggleForm} />
      )}
    </div>
  );

  return isModal ? card : <div className="auth-page">{card}</div>;
}

export default AuthenticationPage;
