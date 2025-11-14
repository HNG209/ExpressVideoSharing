import { authenticator } from "otplib";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/appError.js";

const APP_NAME = "VideoSharingApp";

export const generateSecretService = async (userId, email) => {
  const secret = authenticator.generateSecret(); // Tạo khoá bí mật

  const keyUri = authenticator.keyuri(email, APP_NAME, secret); // Tạo OTP url

  await User.findByIdAndUpdate(userId, {
    "secret.value": secret,
    "secret.verify": false,
  });

  return { secret, keyUri };
};

export const verifyOTPService = async (userId, token) => {
  const user = User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  if (!user.secret) return false;
  return authenticator.check(token, user.secret.value);
};

export const activateTOTPService = async (userId, token) => {
  if (!verifyOTP(userId, token)) throw new AppError(401, "Token error");

  await User.findByIdAndUpdate(userId, { "secret.verify": true });

  return true;
};
