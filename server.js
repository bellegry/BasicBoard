require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Post = require("./models/Post");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

// 환경 변수에서 MongoDB 연결 URI를 가져오기
const mongoURI = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

// MongoDB 연결
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB Atlas connection error:", err));

// 미들웨어 설정
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// 미들웨어로 토큰 인증
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 기본 경로로 접근 시 index.html 제공
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

///////////////////////로그인///////////////////////

// 로그인 후 토큰 발급
app.post("/api/login", async (req, res) => {
  const { userId, password } = req.body;
  console.log("req Body : ", req.body);

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("비밀번호가 일치하는가?:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.userId, name: user.name }, jwtSecret, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 회원가입
app.post("/api/signup", async (req, res) => {
  const { userId, name, password, email, phone, role } = req.body;

  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userId,
      name,
      password: hashedPassword,
      email,
      phone,
      role,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ message: "Registration failed", error: err.message });
  }
});

// ID 중복 확인 API
app.get("/api/users/check-id", async (req, res) => {
  const { userId } = req.query;

  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists" });
    }
    res.json({ message: "User ID is available" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// 이메일 중복 확인 API
app.get("/api/users/check-email", async (req, res) => {
  const { email } = req.query;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.json({ message: "Email is available" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

///////////////////////게시판///////////////////////

// 글 목록 조회
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 글 작성
app.post("/api/posts", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { title, content } = req.body;

  const post = new Post({
    userId,
    title,
    content,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 특정 글 조회
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 글 삭제
app.delete("/api/posts/:id", async (req, res) => {
  try {
    // ObjectId가 유효한 형식인지 확인
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    // Post를 바로 삭제
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// 글 수정 (update)
app.put("/api/posts/:id", authenticateToken, async (req, res) => {
  try {
    // ObjectId가 유효한 형식인지 확인
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    // 업데이트할 필드를 가져옴
    const { writer, title, content } = req.body;

    // 게시글 업데이트
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { writer, title, content },
      { new: true, runValidators: true } // new: true 옵션은 업데이트된 값을 반환
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
