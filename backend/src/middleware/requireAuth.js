import httpStatus from "http-status";
import User from "../models/User.js";
import { AUTH_COOKIE_NAME } from "../utils/authCookie.js";
import { verifyToken } from "../utils/token.js";

// Resolves the logged-in user from the auth cookie and exposes it as req.user.
const requireAuth = async (req, res, next) => {
  const decoded = verifyToken(req.cookies?.[AUTH_COOKIE_NAME]);
  if (!decoded) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: "Not authenticated" });
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Not authenticated" });
    }
    req.user = user;
    return next();
  } catch (err) {
    console.error("Auth lookup failed:", err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
};

export default requireAuth;
