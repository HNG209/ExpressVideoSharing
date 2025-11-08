import express from "express";
import {
  register,
  login,
  refreshToken,
  getProfile,
  testAuth,
  updateProfile,
  updatePassword,
  searchUser,
  getUserProfile,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";
import { getUserFeed } from "../controllers/feed.controller.js";

const router = express.Router();

router.post("/register", register);
router.put("/profile", authenticateToken, uploadSingle, updateProfile);
router.post("/login", login);
router.get("/search", authenticateToken, searchUser);
router.put("/password", authenticateToken, updatePassword);
router.post("/refresh", refreshToken);
router.get("/me", authenticateToken, getProfile);
router.get("/test", authenticateToken, testAuth);
router.get("/feed", authenticateToken, getUserFeed);
router.get("/:userId", authenticateToken, getUserProfile);

export default router;
