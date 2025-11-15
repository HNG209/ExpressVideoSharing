import * as authService from "../services/auth.service.js";

export const generateSecret = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const email = req.user.email;

    const result = await authService.generateSecretService(userId, email);

    return res.status(200).json({
      message: "Secret generated",
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const token = req.body.token;

    const result = await authService.verifyOTPService(userId, token);

    return res.status(200).json({
      message: "OTP verified",
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const disableTOTP = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const token = req.params.token;

    const result = await authService.disableTOTPService(userId, token);

    return res.status(200).json({
      message: "TOTP disabled",
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const enableTOTP = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const token = req.body.token;

    const result = await authService.enableTOTPService(userId, token);

    return res.status(200).json({
      message: "TOTP enabled",
      result,
    });
  } catch (error) {
    next(error);
  }
};
