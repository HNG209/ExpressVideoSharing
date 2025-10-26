import * as followService from "../services/follow.service.js";

export const followUser = async (req, res, next) => {
  try {
    const followerId = req.user._id; // Lấy user từ token
    const { followingId } = req.body; // ID của user được theo dõi

    const result = await followService.followUserService(
      followerId,
      followingId
    );
    res.status(201).json({ message: "Followed successfully", result });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user._id; // Lấy user từ token
    const { followingId } = req.body; // ID của user được bỏ theo dõi

    const result = await followService.unfollowUserService(
      followerId,
      followingId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const userId = req.params.userId; // ID của user cần lấy danh sách followers

    const result = await followService.getFollowersService(userId);
    res
      .status(200)
      .json({ message: "Followers retrieved successfully", result });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const userId = req.params.userId; // ID của user cần lấy danh sách following

    const result = await followService.getFollowingService(userId);
    res
      .status(200)
      .json({ message: "Following retrieved successfully", result });
  } catch (error) {
    next(error);
  }
};
