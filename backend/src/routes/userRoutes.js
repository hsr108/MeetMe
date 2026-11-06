import { Router } from "express";
import { getUserHistory, addToHistory } from "../controllers/historyController.js";
import { Signup, Login, Logout } from "../controllers/authController.js";
import requireAuth from "../middleware/requireAuth.js";

// Mounted at /users
const router = Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/get_all_activity", requireAuth, getUserHistory);
router.post("/add_to_activity", requireAuth, addToHistory);

export default router;
