import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/appError.js";

// Follow một user
export const followUserService = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new AppError(400, "You cannot follow yourself");
  }

  // Kiểm tra xem user được theo dõi có tồn tại không
  const userToFollow = await User.findById(followingId);
  if (!userToFollow) {
    throw new AppError(404, "User to follow not found");
  }

  // Tạo follow record
  const follow = await Follow.create({
    follower: followerId,
    following: followingId,
  });
  return follow;
};

// Unfollow một user
export const unfollowUserService = async (followerId, followingId) => {
  const result = await Follow.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });
  if (!result) {
    throw new AppError(404, "Follow relationship not found");
  }
  return { message: "Unfollowed successfully" };
};

// Lấy danh sách người đang theo dõi
export const getFollowersService = async (userId) => {
  const followers = await Follow.find({ following: userId }).populate(
    "follower",
    "username profile"
  );
  return followers;
};

// Lấy danh sách người đang được theo dõi
export const getFollowingService = async (userId) => {
  const following = await Follow.find({ follower: userId }).populate(
    "following",
    "username profile"
  );
  return following;
};
