import { useCallback, useEffect, useState } from "react";
import { verifyUserRequest } from "../api/authApi.js";

// The logged-in user ({ username, name }) or null, read from GET /auth/verify_user.
// `isAuthReady` is false until the first check finishes, so UI can avoid flashing the wrong state.
export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Resolves to the verify response's status (true when the auth cookie is valid).
  const refreshCurrentUser = useCallback(async () => {
    try {
      const data = await verifyUserRequest();
      setCurrentUser(data.status ? { username: data.user, name: data.name || data.user } : null);
      return Boolean(data.status);
    } catch {
      setCurrentUser(null);
      return false;
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  const clearCurrentUser = useCallback(() => setCurrentUser(null), []);

  useEffect(() => {
    refreshCurrentUser();
  }, [refreshCurrentUser]);

  return { currentUser, isAuthReady, refreshCurrentUser, clearCurrentUser };
};
