const jwt = require("jsonwebtoken");

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("authHeader: " + authHeader);
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token 형식
  console.log("token : " + token);

  if (!token) {
    console.log("인증 토큰 없음"); // 토큰이 없을 때 로그
    return res.status(401).json({ message: "인증 토큰이 없습니다." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // `user` 대신 `decoded`로 변경
    if (err) {
      console.log("유효하지 않은 토큰", err); // 토큰 검증 실패 로그
      return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    }

    console.log("토큰의 payload:", decoded); // 토큰이 유효한 경우, payload 출력

    // decoded 페이로드에서 필요한 정보를 req.user에 할당
    req.user = decoded; // decoded된 payload를 req.user에 저장
    console.log("Middleware - req.user:", req.user);
    next(); // 다음 미들웨어 또는 라우트로 이동
  });
};

module.exports = authenticateToken;
