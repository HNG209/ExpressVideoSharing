import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/appError.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const createPostService = async (userId, { caption, tags }, file) => {
  if (!file || !file.buffer) throw new AppError(400, "Video file is required");

  // Upload video lên Cloudinary
  const uploadFromBuffer = (buffer) =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "videos" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });

  const result = await uploadFromBuffer(file.buffer);

  // Tạo post mới
  const post = await Post.create({
    author: userId,
    caption,
    tags,
    media: {
      publicId: result.public_id,
      url: result.secure_url,
    },
  });

  return post;
};

export const fetchUserPostService = async (userId) => {
  const posts = await Post.find({ author: userId });

  return posts;
};
