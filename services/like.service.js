import Like from "../models/like.model.js";
import { AppError } from "../utils/appError.js";

export const toggleLikeService = async (userId, targetId, onModel) => {
  // Kiểm tra đã like chưa
  const existingLike = await Like.findOne({
    user: userId,
    target: targetId,
    onModel,
  });

  if (existingLike) {
    // Nếu đã like thì thực hiện unlike
    await existingLike.deleteOne();
    return { liked: false };
  } else {
    // Nếu chưa like thì thực hiện like
    const newLike = await Like.create({
      user: userId,
      target: targetId,
      onModel,
    });
    return { liked: true };
  }
};
