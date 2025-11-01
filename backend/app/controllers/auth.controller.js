const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

exports.register = async (req, res, next) => {
  if (!req.body?.name || !req.body?.email || !req.body?.password) {
    return next(new ApiError(400, "Tên, email, và mật khẩu là bắt buộc"));
  }
  try {
    console.log("Register request body:", req.body);
    console.log(
      "MongoDB client:",
      MongoDB.client ? "Connected" : "Not connected"
    );

    const userService = new UserService(MongoDB.client);
    const user = await userService.register(req.body);

    console.log("User registration result:", user);

    if (!user) {
      return next(new ApiError(409, "Email đã tồn tại"));
    }

    res.status(201).send({ message: "Đăng ký thành công", user });
  } catch (error) {
    console.error("Register controller error:", error);
    next(new ApiError(500, "Lỗi khi đăng ký: " + error.message));
  }
};

exports.login = async (req, res, next) => {
  if (!req.body?.email || !req.body?.password) {
    return next(new ApiError(400, "Email và mật khẩu là bắt buộc"));
  }
  try {
    const userService = new UserService(MongoDB.client);
    const user = await userService.findByEmail(req.body.email);
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return next(new ApiError(401, "Sai email hoặc mật khẩu"));
    }
    const payload = { id: user._id, name: user.name, role: user.role };
    const token = jwt.sign(payload, config.app.jwtSecret, { expiresIn: "3d" });
    delete user.password;
    res.send({ message: "Đăng nhập thành công", user, token });
  } catch (error) {
    console.error("Login controller error:", error);
    next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

// Google OAuth Login - redirect to Google
exports.googleLogin = async (req, res, next) => {
  try {
    // Google sẽ callback về FRONTEND port 3001
    const redirectUri = "http://localhost:3001/auth/google/callback";
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${config.app.googleClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=offline&` +
      `prompt=consent`;

    console.log("Redirecting to Google:", googleAuthUrl);
    res.redirect(googleAuthUrl);
  } catch (error) {
    console.error("Google login error:", error);
    next(new ApiError(500, "Lỗi khi chuyển đến Google"));
  }
};

// Backend endpoint để xử lý Google code từ frontend
exports.googleCallback = async (req, res, next) => {
  const { code } = req.body; // Frontend gửi code qua POST request

  if (!code) {
    return next(new ApiError(400, "Authorization code is required"));
  }

  try {
    // Frontend redirect URI
    const redirectUri = "http://localhost:3001/auth/google/callback";

    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: config.app.googleClientId,
        client_secret: config.app.googleClientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user profile from Google
    const profileResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );
    const googleProfile = profileResponse.data;

    console.log("Google profile received:", googleProfile);

    if (!googleProfile) {
      return next(new ApiError(400, "Failed to get Google profile"));
    }

    // Tạo hoặc cập nhật user trong database
    const userService = new UserService(MongoDB.client);
    const user = await userService.createOrUpdateGoogleUser(googleProfile);

    if (!user) {
      return next(new ApiError(500, "Failed to create/update user"));
    }

    // Tạo JWT token
    const payload = { id: user._id, name: user.name, role: user.role };
    const jwtToken = jwt.sign(payload, config.app.jwtSecret, {
      expiresIn: "3d",
    });

    // Trả về token và user cho frontend
    res.json({
      message: "Google login successful",
      user,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google callback error:", error);
    next(new ApiError(500, "Google authentication failed"));
  }
};
