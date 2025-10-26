import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controllers/follow.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/follow", authenticateToken, followUser); // Follow một user
router.post("/unfollow", authenticateToken, unfollowUser); // Unfollow một user
router.get("/:userId/followers", authenticateToken, getFollowers); // Lấy danh sách followers
router.get("/:userId/following", authenticateToken, getFollowing); // Lấy danh sách following

export default router;
