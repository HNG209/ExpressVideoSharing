import * as userService from "../services/user.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ message: "User created", result: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const id = req.user._id;

    const result = await userService.updateProfileService(
      id,
      req.body,
      req.file
    );

    return res.json({ message: "Updated", result });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Upload failed", error: err.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await userService.loginUser(req.body);
    res.status(200).json({ message: "Login successful", result });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user._id; // Lấy user từ token
    const { currentPassword, newPassword } = req.body;

    const result = await userService.updatePasswordService(
      userId,
      currentPassword,
      newPassword
    );

    res.status(200).json({ message: "Change password successful", result });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshAccessToken(req.body.refreshToken);
    console.log("Refreshed token:", result);
    res.status(200).json({ message: "Token refreshed successfully", result });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "User profile retrieved successfully",
      result: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const searchUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { query } = req.query; // Lấy từ khóa tìm kiếm từ query string
    const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
    const limit = parseInt(req.query.limit) || 10; // Số lượng bản ghi mỗi trang (mặc định là 10)

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const result = await userService.searchUserService(id, query, page, limit);
    res.status(200).json({ message: "Users retrieved successfully", result });
  } catch (error) {
    next(error);
  }
};

export const testAuth = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "User profile retrieved successfully",
      result: req.user,
    });
  } catch (error) {
    next(error);
  }
};
