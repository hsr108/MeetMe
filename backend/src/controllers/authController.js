import bcrypt from "bcrypt";
import httpStatus from "http-status";
import User from "../models/User.js";
import { createSecretToken } from "../utils/token.js";
import { setAuthCookie, clearAuthCookie } from "../utils/authCookie.js";
import {
  validateLoginInput,
  validateSignupInput,
  isEmail,
} from "../validators/inputValidators.js";

const SALT_ROUNDS = 10;

// Failure responses keep HTTP 200 + { message } because the frontend reads `success`.
const fail = (res, message) => res.json({ message });

const DUPLICATE_KEY = 11000; // MongoDB unique-index violation

const issueSession = (res, user) =>
  setAuthCookie(res, createSecretToken(user._id, user.username, user.name));

const findSignupConflict = async (username, email) => {
  if (await User.exists({ username })) return "User already exists";
  if (await User.exists({ email })) return "Email is already registered";
  return null;
};

// Login accepts either a username or an email address in the `username` field.
const findUserByLogin = (identifier) =>
  isEmail(identifier)
    ? User.findOne({ email: identifier.trim().toLowerCase() })
    : User.findOne({ username: identifier });

const Signup = async (req, res) => {
  try {
    const validationError = validateSignupInput(req.body);
    if (validationError) return fail(res, validationError);

    const { name, username, password } = req.body;
    const email = req.body.email.trim().toLowerCase();
    const conflict = await findSignupConflict(username, email);
    if (conflict) return fail(res, conflict);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({ name, username, email, password: hashedPassword });

    return issueSession(res, newUser)
      .status(httpStatus.CREATED)
      .json({ message: "User signed up successfully", success: true });
  } catch (err) {
    // Two simultaneous sign-ups can both pass the check above; the unique index decides.
    if (err.code === DUPLICATE_KEY) {
      const field = Object.keys(err.keyPattern ?? {})[0];
      return fail(res, field === "email" ? "Email is already registered" : "User already exists");
    }
    console.error("Signup failed:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Signup failed due to internal error" });
  }
};

const Login = async (req, res) => {
  try {
    const validationError = validateLoginInput(req.body);
    if (validationError) return fail(res, validationError);

    const { username, password } = req.body;
    const user = await findUserByLogin(username);
    if (!user) return fail(res, "No user exists with this username or email");

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return fail(res, "Incorrect password or email");

    return issueSession(res.status(httpStatus.OK), user)
      .json({ message: "User logged in successfully", success: true });
  } catch (err) {
    console.error("Login failed:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const Logout = (req, res) => {
  clearAuthCookie(res);
  return res.json({ message: "Logged out successfully", success: true });
};

export { Signup, Login, Logout };
