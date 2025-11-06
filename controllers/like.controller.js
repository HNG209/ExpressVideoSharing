import * as likeService from "../services/like.service.js";

export const likeController = {
  toggleLike: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { targetId, onModel } = req.body;

      const result = await likeService.toggleLikeService(userId, targetId, onModel);
      return res
        .status(200)
        .json({ message: "Toggle like successfully", result });
    } catch (error) {
      next(error);
    }
  },
};
