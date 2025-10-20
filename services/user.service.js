import { User } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/token.util.js";
import { AppError } from "../utils/appError.js";

export const registerUser = async (data) => {
  const { username, email, password } = data;

  const exist = await User.findOne({ username });
  if (exist) throw new AppError(400, "Username already exists");

  const user = await User.create({ username, email, password });
  return { id: user._id, username, email };
};

export const loginUser = async (data) => {
  const { username, password } = data;

  const user = await User.findOne({ username });
  if (!user) throw new AppError(404, "User not found");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new AppError(401, "Invalid password");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: { id: user._id, username: user.username, email: user.email },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (token) => {
  if (!token) throw new AppError(401, "Refresh token required");

  let decoded;
  try {
    decoded = verifyToken(token, "refresh");
  } catch {
    throw new AppError(403, "Invalid refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError(404, "User not found");

  const newAccessToken = generateAccessToken(user);
  return { accessToken: newAccessToken };
};
