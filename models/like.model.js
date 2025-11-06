import mongoose from "mongoose";

const Schema = mongoose.Schema;

const likeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },

    // Tham chiếu động: có thể là post hoặc comment
    target: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "onModel",
    },

    // Tên model được tham chiếu: 'post' hoặc 'comment'
    onModel: {
      type: String,
      required: true,
      enum: ["post", "comment"],
    },
  },
  {
    timestamps: true,
  }
);

// Một user chỉ được like 1 lần cho 1 đối tượng
likeSchema.index({ user: 1, target: 1, onModel: 1 }, { unique: true });

// Tăng tốc độ tìm kiếm like
likeSchema.index({ target: 1, onModel: 1 });

const Like = mongoose.model("like", likeSchema);

export default Like;
