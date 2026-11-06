import "../styles/NavCss.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuth } from "../hooks/useAuth.js";
import { ROUTES } from "../config/routes.js";
import { BRAND_ORANGE } from "../config/theme.js";
import NavUserMenu from "./NavUserMenu.jsx";

const linkStyle = { textDecoration: "none", color: "white" };

// Logged out: Guest + Login/Signup (modalMethod opens the auth modal).
// Logged in: History, Logout and "Hello, <username>!".
function Navbar({ modalMethod }) {
  const { currentUser, isAuthReady } = useAuth();

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-logo">
          <Link to={currentUser ? ROUTES.home : ROUTES.landing} style={linkStyle}>
            <h1>
              <span style={{ color: BRAND_ORANGE }}>Meet</span>
              <span>Me</span>
            </h1>
          </Link>
        </div>
        {/* Rendered only after the login check, so the wrong buttons never flash. */}
        {isAuthReady && (
          <div className="nav-links">
            {currentUser ? (
              <NavUserMenu />
            ) : (
              <>
                <li>
                  <Link className="nav-text-btn" to={ROUTES.guest}>
                    Guest
                  </Link>
                </li>
                <li>
                  <Button
                    onClick={modalMethod}
                    variant="contained"
                    sx={{ textTransform: "none", backgroundColor: BRAND_ORANGE, height: "2.2rem" }}
                  >
                    <i className="fa-solid fa-user"></i>Login/Signup
                  </Button>
                </li>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
