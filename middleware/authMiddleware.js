const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length); // 'Bearer ' 부분 제거
  }

  // 미들웨어에서 user 확인
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    console.log("Decoded JWT:", decoded); // 여기에 id가 있는지 확인
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
