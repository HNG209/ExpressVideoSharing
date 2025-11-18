import { authenticator } from "otplib";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/appError.js";
import ErrorCode from "../enums/ErrorCode.js";

const APP_NAME = "VideoSharingApp";

export const generateSecretService = async (userId, email) => {
  const secret = authenticator.generateSecret(); // Tạo khoá bí mật

  const keyUri = authenticator.keyuri(email, APP_NAME, secret); // Tạo OTP url

  await User.findByIdAndUpdate(userId, {
    "secret.value": secret,
    "secret.uri": keyUri,
    "secret.verify": false,
  });

  return { secret, keyUri };
};

export const verifyOTPService = async (userId, token) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  if (!user.secret) return false;
  return authenticator.check(token, user.secret.value);
};

export const enableTOTPService = async (userId, token) => {
  if (!verifyOTPService(userId, token))
    throw new AppError(401, "OTP không hợp lệ", ErrorCode.OTP_ERROR);

  await User.findByIdAndUpdate(userId, { "secret.verify": true });

  return true;
};

export const disableTOTPService = async (userId, token) => {
  const user = await User.findById(userId);
  if (!user)
    throw new AppError(
      404,
      "Không tìm thấy người dùng.",
      ErrorCode.USER_NOT_FOUND
    );

  if (!user.secret.verify) {
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: { secret: "" }, // $unset: { fieldName: "" } sẽ xóa field đó
      },
      { new: true } // Tùy chọn: trả về tài liệu sau khi cập nhật
    );
    return true;
  }

  if (!(await verifyOTPService(userId, token)))
    throw new AppError(401, "OTP không hợp lệ", ErrorCode.OTP_ERROR);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $unset: { secret: "" }, // $unset: { fieldName: "" } sẽ xóa field đó
    },
    { new: true } // Tùy chọn: trả về tài liệu sau khi cập nhật
  );

  // Kiểm tra nếu người dùng không tồn tại
  if (!updatedUser) {
    throw new AppError(
      404,
      "Không tìm thấy người dùng.",
      ErrorCode.USER_NOT_FOUND
    );
  }

  return true;
};
