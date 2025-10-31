import * as postService from "../services/post.service.js";

export const createPost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { caption, tags } = req.body;
    const file = req.file;

    // tags có thể là chuỗi hoặc mảng, chuyển về mảng nếu cần
    let tagsArray = [];
    if (typeof tags === "string") {
      try {
        tagsArray = JSON.parse(tags);
      } catch {
        tagsArray = tags.split(",").map((t) => t.trim());
      }
    } else if (Array.isArray(tags)) {
      tagsArray = tags;
    }

    const post = await postService.createPostService(
      userId,
      { caption, tags: tagsArray },
      file
    );
    res
      .status(201)
      .json({ message: "Post created successfully", result: post });
  } catch (error) {
    next(error);
  }
};

export const fetchUserPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await postService.fetchUserPostService(userId);

    res.status(200).json({ message: "Post retrieved", result });
  } catch (error) {
    next(error);
  }
};
