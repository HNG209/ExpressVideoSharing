import express from "express";
import { createPost } from "../controllers/post.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { uploadMedia } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, uploadMedia, createPost);

export default router;
