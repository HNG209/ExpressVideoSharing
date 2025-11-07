import express from "express";
import {
  createComment,
  getCommentsByPostId,
} from "../controllers/comment.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", authenticateToken, createComment);
router.get("/post/:postId", authenticateToken, getCommentsByPostId);

export default router;
