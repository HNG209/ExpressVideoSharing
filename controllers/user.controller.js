import * as userService from "../services/user.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ message: "User created", data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await userService.loginUser(req.body);
    res.status(200).json({ message: "Login successful", data: result });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshAccessToken(req.body.refreshToken);
    res
      .status(200)
      .json({ message: "Token refreshed successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res
      .status(200)
      .json({ message: "User profile retrieved successfully", data: req.user });
  } catch (error) {
    next(error);
  }
};
