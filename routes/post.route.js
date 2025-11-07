import express from "express";
import {
  createPost,
  fetchOtherUserPost,
  fetchUserPost,
} from "../controllers/post.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { uploadMedia } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, uploadMedia, createPost);
router.get("/", authenticateToken, fetchUserPost);
router.get("/user/:userId", authenticateToken, fetchOtherUserPost);

export default router;
