import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";

export const createCommentService = async (data, userId) => {
  try {
    const comment = new Comment({ ...data, author: userId });
    // tăng lượt comment cho bài viết
    await Post.findByIdAndUpdate(data.post, { $inc: { commentCount: 1 } });
    await comment.save();
    return comment;
  } catch (error) {
    throw error;
  }
};

export const getCommentsByPostIdService = async (postId) => {
  try {
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "profile.displayName profile.avatar"
    );
    return comments;
  } catch (error) {
    throw error;
  }
};
