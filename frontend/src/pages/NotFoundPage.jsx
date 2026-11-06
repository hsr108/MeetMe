import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { ROUTES } from "../config/routes.js";
import "../styles/landing_page.css";
import "../styles/notFound.css";

// Shown for any address that is not a page and not a valid meeting code (e.g. /89hcvh7).
function NotFoundPage() {
  const { currentUser } = useAuth();

  return (
    <div className="Landing-Page-Container">
      <Navbar />
      <main className="not-found">
        {/* Decorative: the "0" is cracked into two halves with smoke rising from the crack. */}
        <p className="not-found-code" aria-hidden="true">
          4
          <span className="broken-zero">
            <span className="zero-half zero-left">0</span>
            <span className="zero-half zero-right">0</span>
            <span className="zero-smoke">
              <i />
              <i />
              <i />
              <i />
            </span>
          </span>
          4
        </p>
        <h1>This page doesn&apos;t exist</h1>
        <p className="not-found-text">
          The link may be broken, or the meeting code is wrong. Meeting codes look like
          <code> abc-123-xyz</code>.
        </p>
        <Link className="not-found-btn" to={currentUser ? ROUTES.home : ROUTES.landing}>
          {currentUser ? "Back to home" : "Go to MeetMe"}
        </Link>
      </main>
    </div>
  );
}

export default NotFoundPage;
