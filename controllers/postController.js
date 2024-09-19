const Post = require("../models/Post");
const mongoose = require("mongoose");

// 게시글 목록 읽기
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find(_id);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 글 작성
exports.createPost = async (req, res) => {
  const userId = req.user.userId;
  const { title, content } = req.body;

  const post = new Post({ userId, title, content });

  try {
    const newPost = await post.save();
    res.status(201).json({
      _id: newPost._id, // 생성된 게시글의 ID를 반환
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 게시글 상세 조회
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 게시글 작성자와 로그인한 사용자를 비교하는 함수
async function verifyPostOwner(req, res, _id) {
  try {
    const post = await Post.findById(_id);

    if (!post) {
      return { error: res.status(404).json({ message: "게시글을 찾을 수 없습니다." }) };
    }

    // 게시글 작성자와 로그인한 사용자가 같은지 확인
    if (post.userId.toString() !== req.user.userId) {
      return { error: res.status(403).json({ message: "권한이 없습니다." }) };
    }

    return { post }; // 문제 없으면 게시글 반환
  } catch (err) {
    return { error: res.status(500).json({ message: "서버 오류가 발생했습니다." }) };
  }
}

// 게시글 삭제
exports.deletePost = async (req, res) => {
  const { post, error } = await verifyPostOwner(req, res, req.params.id);
  if (error) return; // 에러가 발생한 경우 함수를 중단

  try {
    await post.remove();
    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    console.error("게시글 삭제 오류:", err);
    res.status(500).json({ message: "게시글 삭제 중 오류가 발생했습니다." });
  }
};
// exports.deletePost = async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ message: "Invalid Post ID" });
//     }

//     const deletedPost = await Post.findByIdAndDelete(req.params.id);
//     if (!deletedPost) return res.status(404).json({ message: "Post not found" });

//     res.json({ message: "게시글이 삭제되었습니다." });
//   } catch (err) {
//     console.error("Error deleting post:", err);
//     res.status(500).json({ message: "Server error: " + err.message });
//   }
// };

// 게시글 수정
exports.updatePost = async (req, res) => {
  const { post, error } = await verifyPostOwner(req, res, req.params.id);
  if (error) return; // 에러가 발생한 경우 함수를 중단

  try {
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    const updatedPost = await post.save();
    res.json({ message: "게시글이 수정되었습니다.", post: updatedPost });
  } catch (err) {
    console.error("게시글 수정 오류:", err);
    res.status(500).json({ message: "게시글 수정 중 오류가 발생했습니다." });
  }
};
// exports.updatePost = async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ message: "Invalid Post ID" });
//     }

//     const { writer, title, content } = req.body;

//     const updatedPost = await Post.findByIdAndUpdate(req.params.id, { writer, title, content }, { new: true, runValidators: true });

//     if (!updatedPost) return res.status(404).json({ message: "Post not found" });

//     res.json(updatedPost);
//   } catch (err) {
//     console.error("Error updating post:", err);
//     res.status(500).json({ message: "Server error: " + err.message });
//   }
// };
