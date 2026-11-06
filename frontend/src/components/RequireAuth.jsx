import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { ROUTES } from "../config/routes.js";

// Renders children only after the backend confirms the auth cookie; otherwise redirects.
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      let status = false;
      try {
        status = await isAuthenticated();
      } catch {
        status = false;
      }
      if (cancelled) return;
      // Redirect before flipping state so protected content never flashes.
      if (!status) {
        navigate(ROUTES.auth, { replace: true });
        return;
      }
      setIsVerified(true);
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, navigate]);

  if (!isVerified) return <h1>Checking authentication...</h1>;
  return children;
}

export default RequireAuth;
