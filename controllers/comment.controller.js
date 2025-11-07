import * as commentService from "../services/comment.service.js";
const { createCommentService, getCommentsByPostIdService } = commentService;

export const createComment = async (req, res, next) => {
  try {
    const { post, content } = req.body;
    const comment = await createCommentService({ post, content }, req.user._id);
    return res.status(201).json({
      message: "Comment created successfully",
      result: {
        ...comment.toObject(),
        author: {
          _id: req.user._id,
          profile: {
            // username: req.user.profile.username,
            avatar: req.user.profile.avatar,
            displayName: req.user.profile.displayName,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await getCommentsByPostIdService(postId);

    return res
      .status(200)
      .json({ message: "Comments retrieved successfully", result: comments });
  } catch (error) {
    next(error);
  }
};
