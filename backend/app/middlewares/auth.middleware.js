const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../api-error");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Yêu cầu xác thực"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, config.app.jwtSecret);
    req.user = payload; // Gắn thông tin user (id, name, role) vào request
    next();
  } catch (error) {
    return next(new ApiError(401, "Token không hợp lệ"));
  }
};

module.exports = auth;
