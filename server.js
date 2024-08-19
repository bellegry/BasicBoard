const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Post = require("./models/Post"); // 모델 파일

const app = express();

// MongoDB 연결
mongoose
  .connect("mongodb://127.0.0.1:27017/BasicBoard", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 미들웨어 설정
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// 기본 경로로 접근 시 index.html 제공
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

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
app.post("/api/posts", async (req, res) => {
  const post = new Post({
    writer: req.body.writer,
    title: req.body.title,
    content: req.body.content,
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

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
