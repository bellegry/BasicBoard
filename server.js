require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

// Routes 경로
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const indexRoutes = require("./routes/indexRoutes");

const app = express();

// MongoDB 연결
connectDB();

// 미들웨어 설정
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// 라우팅 설정
app.use("/", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

// 서버 시작
const PORT = process.env.PORT || 2450;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
