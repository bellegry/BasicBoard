const express = require("express");
const { getUserProfile, checkId, checkEmail, updateUserProfile } = require("../controllers/userController");

const router = express.Router();

// 프로필 조회
router.get("/profile", getUserProfile); // 확인

// ID 중복 확인
router.get("/check-id", checkId); // 확인

// 이메일 중복 확인
router.get("/check-email", checkEmail); // 확인

// 프로필 수정
router.put("/profile", updateUserProfile); // 확인

module.exports = router;
