import { User } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/token.util.js";
import { AppError } from "../utils/appError.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const registerUser = async (data) => {
  const { username, email, password } = data;

  const exist = await User.findOne({ username });
  if (exist) throw new AppError(400, "Username already exists");

  const user = await User.create({ username, email, password });
  return { id: user._id, username, email };
};

export const updateProfileService = async (userId, data, file) => {
  let avatarUrl, publicId;

  // Lấy thông tin người dùng hiện tại
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  // Nếu có file mới được tải lên
  if (file && file.buffer) {
    // Xóa avatar cũ nếu có
    if (user.profile.publicId) {
      await cloudinary.uploader.destroy(user.profile.publicId);
    }

    // Upload avatar mới
    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars", resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });

    const result = await uploadFromBuffer(file.buffer);
    avatarUrl = result.secure_url;
    publicId = result.public_id;
  }

  // Cập nhật thông tin người dùng
  const updateObj = {
    profile: data,
  };
  if (avatarUrl) updateObj.profile.avatar = avatarUrl;
  if (publicId) updateObj.profile.publicId = publicId;

  const updatedUser = await User.findByIdAndUpdate(userId, updateObj, {
    new: true,
  }).select("-password");

  return updatedUser;
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
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile,
    },
    accessToken,
    refreshToken,
  };
};

export const updatePasswordService = async (userId, currentPassword, newPassword) => {
  // Lấy thông tin người dùng hiện tại
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  // Kiểm tra mật khẩu hiện tại
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new AppError(401, "Current password is incorrect");

  // Cập nhật mật khẩu mới
  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully" };
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
