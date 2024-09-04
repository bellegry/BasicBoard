const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 프로필 정보 조회
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ID 중복 확인
exports.checkId = async (req, res) => {
  const { userId } = req.query;
  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "이미 사용중인 ID입니다." });
    }
    res.json({ message: "사용가능한 ID입니다." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 이메일 중복 확인
exports.checkEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "이미 사용중인 Email입니다." });
    }
    res.json({ message: "사용가능한 Email입니다." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 회원 정보 수정
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
