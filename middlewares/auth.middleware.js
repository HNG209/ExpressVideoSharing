import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/appError.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return next(new AppError(401, "Access token required"));

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return next(new AppError(404, "User not found"));
    next();
  } catch (error) {
    next(new AppError(403, "Invalid or expired token"));
  }
};
