import { env } from "../config/env.js";
import { TOKEN_TTL_SECONDS } from "./token.js";

export const AUTH_COOKIE_NAME = "token";

// secure:false on localhost (HTTP); sameSite "none" requires secure:true, so use "lax" locally.
const baseCookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? "none" : "lax",
});

export const setAuthCookie = (res, token) =>
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...baseCookieOptions(),
    expires: new Date(Date.now() + TOKEN_TTL_SECONDS * 1000),
  });

// Must use the same attributes as setAuthCookie or the browser keeps the old cookie.
export const clearAuthCookie = (res) =>
  res.cookie(AUTH_COOKIE_NAME, "", { ...baseCookieOptions(), expires: new Date(0) });
