const express = require("express");
const { getPosts, createPost, getPostById, deletePost, updatePost } = require("../controllers/postController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// 게시글 목록 조회는 로그인 없이도 가능
router.get("/", getPosts);

// 게시글 작성은 로그인한 사용자만 가능
router.post("/", authenticateToken, createPost);

// 게시글 상세 조회는 로그인 없이도 가능
router.get("/:id", getPostById);

// 게시글 삭제는 로그인한 사용자만 가능 (추가로, 권한을 검사해야 할 수 있음)
router.delete("/:id", authenticateToken, deletePost);

// 게시글 수정은 로그인한 사용자만 가능
router.put("/:id", authenticateToken, updatePost);

module.exports = router;
