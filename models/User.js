// models/User.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  userId: {
    // 로그인할 때 사용할 ID
    type: String,
    required: true,
    unique: true, // 고유한 값
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // 고유한 값
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    // 사용자 권한 (ex. admin, user)
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
