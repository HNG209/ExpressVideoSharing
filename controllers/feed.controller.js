import * as feedService from "../services/feed.service.js";

export const getUserFeed = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log("Fetching feed for user:", userId);
    const { page, limit } = req.query;
    const posts = await feedService.fetchUserFeedService(userId, page, limit);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
