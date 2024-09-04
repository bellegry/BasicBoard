const express = require("express");
const { getPosts, createPost, getPostById, deletePost, updatePost } = require("../controllers/postController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPosts);
router.post("/", authenticateToken, createPost);
router.get("/:id", getPostById);
router.delete("/:id", deletePost);
router.put("/:id", authenticateToken, updatePost);

module.exports = router;
