import { Router } from "express";
import userVerification from "../controllers/verifyController.js";

// Mounted at /auth
const router = Router();

router.get("/verify_user", userVerification);

export default router;
