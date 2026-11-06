import { usersClient, authClient } from "./apiClient.js";

// Each call resolves with the backend's JSON body.

export const signupRequest = async (name, username, email, password) =>
  (await usersClient.post("/signup", { name, username, email, password })).data;

export const loginRequest = async (username, password) =>
  (await usersClient.post("/login", { username, password })).data;

export const logoutRequest = async () => (await usersClient.get("/logout")).data;

export const verifyUserRequest = async () => (await authClient.get("/verify_user")).data;
