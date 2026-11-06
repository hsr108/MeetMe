import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "./authContext.js";
import { signupRequest, loginRequest, logoutRequest } from "../api/authApi.js";
import { fetchMeetingHistory, addMeetingToHistory } from "../api/historyApi.js";
import { getErrorMessage } from "../api/apiClient.js";
import { useCurrentUser } from "../hooks/useCurrentUser.js";

const REDIRECT_DELAY_MS = 1500;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser, isAuthReady, refreshCurrentUser, clearCurrentUser } = useCurrentUser();

  // Shared by signup and login: toast the outcome, load the user and go to /home on success.
  const runAuthRequest = useCallback(
    async (request, { successText, failureText }) => {
      try {
        const data = await request();
        if (data.success === true) {
          toast.success(successText);
          await refreshCurrentUser();
          setTimeout(() => navigate("/home"), REDIRECT_DELAY_MS);
        } else {
          toast.error(data.message || failureText);
        }
      } catch (err) {
        toast.error(getErrorMessage(err, `${failureText}. Please try again.`));
        throw err;
      }
    },
    [navigate, refreshCurrentUser]
  );

  const handleSignup = useCallback(
    (name, username, email, password) =>
      runAuthRequest(() => signupRequest(name, username, email, password), {
        successText: "Account created successfully! Redirecting...",
        failureText: "Signup failed",
      }),
    [runAuthRequest]
  );

  const handleLogin = useCallback(
    (username, password) =>
      runAuthRequest(() => loginRequest(username, password), {
        successText: "Login successful! Redirecting...",
        failureText: "Login failed",
      }),
    [runAuthRequest]
  );

  const handleLogout = useCallback(async () => {
    const data = await logoutRequest();
    if (data.success) clearCurrentUser();
    return data;
  }, [clearCurrentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthReady,
      handleSignup,
      handleLogin,
      handleLogout,
      getHistoryOfUser: fetchMeetingHistory,
      addToUserHistory: addMeetingToHistory,
      // RequireAuth uses this; it also refreshes currentUser.
      isAuthenticated: refreshCurrentUser,
    }),
    [currentUser, isAuthReady, handleSignup, handleLogin, handleLogout, refreshCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
