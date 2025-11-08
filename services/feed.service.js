import { Follow } from "../models/follow.model.js";
import { Post } from "../models/post.model.js";

export const fetchUserFeedService = async (userId, page = 1, limit = 10) => {
  // Lấy danh sách những người mà user đang theo dõi
  const following = await Follow.find({ follower: userId }).select("following");

  // Lấy danh sách bài viết của những người mà user đang theo dõi
  const posts = await Post.find({ author: { $in: following } })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "username profile");

  return posts;
};
