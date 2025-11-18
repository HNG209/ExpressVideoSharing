import { User } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/token.util.js";
import { AppError } from "../utils/appError.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { Follow } from "../models/follow.model.js";
import { verifyOTPService } from "./auth.service.js";
import ErrorCode from "../enums/ErrorCode.js";

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
  const { username, password, otp } = data;

  const user = await User.findOne({ username });
  if (!user)
    throw new AppError(
      404,
      "Tài khoản không tồn tại",
      ErrorCode.USER_NOT_FOUND
    );

  const isMatch = await user.matchPassword(password);
  if (!isMatch)
    throw new AppError(
      401,
      "Mật khẩu không chính xác",
      ErrorCode.INVALID_PASSWORD
    );

  if (user.secret.verify) {
    // Nếu secret đã được verify thì bắt buộc có OTP
    if (!otp) {
      throw new AppError(403, "Required OTP", ErrorCode.OTP_REQUIRED);
    }

    const isValid = await verifyOTPService(user._id, otp);

    if (!isValid)
      throw new AppError(401, "OTP không hợp lệ", ErrorCode.OTP_ERROR);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const updatePasswordService = async (
  userId,
  currentPassword,
  newPassword
) => {
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

export const getUserProfileService = async (userId, currentUserId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new AppError(404, "User not found");

  // thêm trạng thái theo dõi isFollower và isFollowed
  const isFollowed = await Follow.exists({
    follower: currentUserId,
    following: userId,
  });

  const isFollower = await Follow.exists({
    follower: userId,
    following: currentUserId,
  });

  user._doc.isFollowed = isFollowed ? true : false;
  user._doc.isFollower = isFollower ? true : false;

  return user;
};

export const searchUserService = async (
  currentUserId,
  query,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  // Tìm kiếm user theo username hoặc displayName, loại bỏ người dùng hiện tại
  const users = await User.find({
    _id: { $ne: currentUserId }, // Loại bỏ người dùng hiện tại
    $or: [
      { username: { $regex: query, $options: "i" } },
      { "profile.displayName": { $regex: query, $options: "i" } },
    ],
  })
    .skip(skip)
    .limit(limit)
    .select("username profile"); // Chỉ lấy các trường cần thiết

  // Lấy danh sách những người mà currentUser đang theo dõi
  const following = await Follow.find({ follower: currentUserId }).select(
    "following"
  );
  const followingIds = following.map((f) => f.following.toString());

  // Lấy danh sách những người đang theo dõi currentUser
  const followers = await Follow.find({ following: currentUserId }).select(
    "follower"
  );
  const followerIds = followers.map((f) => f.follower.toString());

  // Gắn trạng thái follow vào từng user
  const usersWithFollowStatus = users.map((user) => ({
    ...user.toObject(),
    isFollowed: followingIds.includes(user._id.toString()), // Kiểm tra xem user có được currentUser theo dõi không
    isFollower: followerIds.includes(user._id.toString()), // Kiểm tra xem user có đang theo dõi currentUser không
  }));

  // Tính tổng số kết quả
  const total = await User.countDocuments({
    _id: { $ne: currentUserId },
    $or: [
      { username: { $regex: query, $options: "i" } },
      { "profile.displayName": { $regex: query, $options: "i" } },
    ],
  });

  return {
    users: usersWithFollowStatus,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const refreshAccessToken = async (token) => {
  if (!token) throw new AppError(401, "Refresh token required");

  let decoded;
  try {
    decoded = verifyToken(token, "refresh");
  } catch {
    throw new AppError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError(404, "User not found");

  const newAccessToken = generateAccessToken(user);
  return { accessToken: newAccessToken };
};
