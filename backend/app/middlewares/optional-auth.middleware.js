/**
 * Optional authentication middleware
 * Giống auth.middleware.js nhưng không bắt buộc phải login
 * Nếu có token thì decode, không có thì skip
 */
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  // Không có token - skip (không bắt buộc login)
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    // Có token - decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Token invalid - skip (không throw error)
    req.user = null;
    next();
  }
};
