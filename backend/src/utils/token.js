import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const TOKEN_TTL_SECONDS = 3 * 24 * 60 * 60; // 3 days

// The JWT signature covers the payload, so a tampered payload fails verification.
export const createSecretToken = (id, username, name) =>
  jwt.sign({ id, username, name }, env.tokenKey, { expiresIn: TOKEN_TTL_SECONDS });

// Returns the decoded payload, or null when the token is missing, expired or forged.
export const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, env.tokenKey);
  } catch {
    return null;
  }
};
