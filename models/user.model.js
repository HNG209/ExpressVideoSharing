import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const profileSchema = new mongoose.Schema(
  {
    displayName: { type: String, default: "New User" },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dwaldcj4v/image/upload/v1752823047/uploads/image-1752823094483.jpg",
    },
    publicId: String,
    bio: { type: String, default: "" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profile: { type: profileSchema, default: () => ({}) },
    likeCount: { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    secret: {
      value: String,
      verify: { type: Boolean, default: false },
      // default: null,
    },
  },
  { timestamps: true }
);

// hash password trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// so sánh password khi login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
