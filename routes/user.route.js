import express from "express";
import {
  register,
  login,
  refreshToken,
  getProfile,
  testAuth,
  updateProfile,
  updatePassword,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/register", register);
router.put("/profile", authenticateToken, uploadSingle, updateProfile);
router.post("/login", login);
router.put("/password", authenticateToken, updatePassword);
router.post("/refresh", refreshToken);
router.get("/me", authenticateToken, getProfile);
router.get("/test", authenticateToken, testAuth);

export default router;
