import User from "../models/User.js";
import { AUTH_COOKIE_NAME } from "../utils/authCookie.js";
import { verifyToken } from "../utils/token.js";

// GET /auth/verify_user → { status: boolean, user?: username, name?: display name }
const userVerification = async (req, res) => {
  const decoded = verifyToken(req.cookies?.[AUTH_COOKIE_NAME]);
  if (!decoded) return res.json({ status: false });

  try {
    const user = await User.findById(decoded.id);
    if (user) return res.json({ status: true, user: user.username, name: user.name });
    return res.json({ status: false });
  } catch (err) {
    console.error("User verification failed:", err);
    return res.json({ status: false });
  }
};

export default userVerification;
