import express from "express";
import {
  register,
  login,
  refreshToken,
  getProfile,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/profile", authenticateToken, getProfile);

export default router;
