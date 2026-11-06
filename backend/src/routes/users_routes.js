import { Router } from "express";
const router = Router();
import { getUserHistory, addToHistory } from "../controllers/history.js"; 
import { Signup, Login, Logout } from "../controllers/Auth.js";

// /users/...

router.post("/signup", Signup);

router.post("/login", Login);

router.get("/logout", Logout);

router.get("/get_all_activity",getUserHistory);


router.post("/add_to_activity", addToHistory);








export default router;
