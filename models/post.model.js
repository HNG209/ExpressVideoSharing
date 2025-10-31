import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    tags: [{ type: String }],
    media: {
      // chỉ nhận 1 video duy nhất
      publicId: String,
      url: String,
    },
    viewCount: { type: Number, default: 0 }, // lượng view
    likeCount: { type: Number, default: 0 }, // lượng like
    commentCount: { type: Number, default: 0 }, // lượng comment
    saveCount: { type: Number, default: 0 }, // lượt lưu
  },
  { timestamps: true }
);

postSchema.index({ author: 1 }); // tăng tốc tìm kiếm post của user

export const Post = mongoose.model("Post", postSchema);
