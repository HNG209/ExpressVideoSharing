import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import {
  activateOTP,
  generateSecret,
  verifyOTP,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/totp", authenticateToken, generateSecret);
router.post("/totp", authenticateToken, verifyOTP);
router.put("/totp", authenticateToken, activateOTP);

export default router;
