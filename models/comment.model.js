import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

commentSchema.index({ author: 1 }); // tăng tốc tìm kiếm comment của user

export const Comment = mongoose.model("Comment", commentSchema);
