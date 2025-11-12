const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../api-error");

// Middleware xác thực bắt buộc
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

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next(new ApiError(403, "Chỉ admin mới có quyền truy cập"));
  }
};

// Middleware xác thực không bắt buộc (optional)
// Nếu có token thì decode, không có thì skip
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Không có token - skip (không bắt buộc login)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    // Có token - decode
    const payload = jwt.verify(token, config.app.jwtSecret);
    req.user = payload;
    next();
  } catch (error) {
    // Token invalid - skip (không throw error)
    req.user = null;
    next();
  }
};

module.exports = { auth, isAdmin, optionalAuth };
