import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import followRoutes from "./routes/follow.route.js";
import postRoutes from "./routes/post.route.js";
import likeRoutes from "./routes/like.route.js";
import commentRoutes from "./routes/comment.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

app.use("/api/comments", commentRoutes);
app.use("/api", followRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/likes", likeRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Video Sharing App API");
});

// xử lý lỗi chung
app.use(errorHandler);

export default app;
