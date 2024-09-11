const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(400).json({ message: "아이디가 존재하지 않습니다." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });

    // JWT 생성 시 user._id를 포함해 생성
    const token = jwt.sign(
      { _id: user._id, userId: user.userId, name: user.name, password: user.password, email: user.email, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.signup = [
  // 유효성 검사
  body("userId")
    .notEmpty()
    .withMessage("ID를 입력해주세요.")
    .custom(async (userId) => {
      const existingUser = await User.findOne({ userId });
      if (existingUser) {
        throw new Error("이미 존재하는 ID입니다.");
      }
    }),
  body("email")
    .notEmpty()
    .withMessage("Email을 입력해주세요.")
    .isEmail()
    .withMessage("이메일 형식이 아닙니다.")
    .custom(async (email) => {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        throw new Error("이미 사용중인 이메일입니다.");
      }
    }),
  body("password").notEmpty().withMessage("비밀번호를 입력해주세요."),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    return true;
  }),

  // 유효성 검사 결과 처리
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, name, password, email, phone, role } = req.body;

    try {
      const existingUser = await User.findOne({ userId });
      if (existingUser) return res.status(400).json({ message: "User ID already exists" });

      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ userId, name, password: hashedPassword, email, phone, role });

      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(400).json({ message: "Registration failed", error: err.message });
    }
  },
];
