// models/User.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs"); // 비밀번호 해시를 위한 bcrypt

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

// 비밀번호 해시화
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 비밀번호 확인
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
