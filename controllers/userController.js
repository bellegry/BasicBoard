const jwt = require("jsonwebtoken"); // jwt 모듈을 불러옴
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 프로필 정보 조회
// 프로필 정보 조회
exports.getUserProfile = async (req, res) => {
  try {
    const { _id } = req.user; // JWT에서 추출한 사용자 ID 사용
    console.log("Controller - req.user:", req.user); // 디버깅용

    // DB에서 최신 사용자 정보 조회
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 최신 사용자 정보를 응답으로 반환
    res.json({
      _id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "프로필 정보를 가져오는 중 오류가 발생했습니다." });
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
    const { _id } = req.user; // JWT로부터 받은 사용자 ID (_id)
    console.log("JWT에서 설정된 사용자 ID:", req.user._id);
    const { name, email, phone, newPassword, confirmPassword } = req.body;

    // 데이터베이스에서 사용자를 찾음
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 이메일 중복 체크 (현재 이메일과 다를 경우에만 중복 체크)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });
      }
    }

    // 사용자 정보 업데이트
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // 비밀번호 업데이트 (두 비밀번호가 같을 경우에만 처리)
    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      }
      user.password = await bcrypt.hash(newPassword, 10); // 새로운 비밀번호 암호화
    }

    const updatedUser = await user.save(); // 사용자 정보 저장

    // 새로운 토큰 생성 (필요한 정보를 포함)
    const token = jwt.sign(
      { _id: updatedUser._id, userId: updatedUser.userId, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "프로필이 성공적으로 업데이트되었습니다.",
      token, // 새로운 JWT 토큰을 반환
    });
  } catch (err) {
    console.error("프로필 업데이트 오류:", err);
    res.status(500).json({ message: "프로필 업데이트 중 오류가 발생했습니다." });
  }
};

// 회원 탈퇴
exports.deleteUserProfile = async (req, res) => {
  try {
    const { _id } = req.user; // JWT로부터 받은 사용자 ID

    // 데이터베이스에서 사용자를 삭제
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (err) {
    console.error("회원 탈퇴 오류:", err);
    res.status(500).json({ message: "회원 탈퇴 중 오류가 발생했습니다." });
  }
};
