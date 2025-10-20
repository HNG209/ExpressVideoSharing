import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Video Sharing App API");
});

// xử lý lỗi chung
app.use(errorHandler);

export default app;
