const express = require("express");
const { getUserProfile, checkId, checkEmail, updateUserProfile, deleteUserProfile } = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// 프로필 조회
router.get("/profile", authenticateToken, getUserProfile);

// ID 중복 확인
router.get("/check-id", checkId);

// 이메일 중복 확인
router.get("/check-email", checkEmail);

// 프로필 수정
router.put("/profile", authenticateToken, updateUserProfile);

// 회원 탈퇴
router.delete("/profile", authenticateToken, deleteUserProfile);

module.exports = router;
