const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.addFavorite = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const { storyId } = req.body;
    const userId = req.user.id; // Lấy từ auth.middleware.js
    await userService.addFavorite(userId, storyId);
    res.status(200).send({ message: "Đã thêm vào yêu thích" });
  } catch (error) {
    next(new ApiError(500, "Lỗi khi thêm yêu thích"));
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const { storyId } = req.body; // Giả sử storyId được gửi trong body
    const userId = req.user.id;
    await userService.removeFavorite(userId, storyId);
    res.status(200).send({ message: "Đã xóa khỏi yêu thích" });
  } catch (error) {
    next(new ApiError(500, "Lỗi khi xóa yêu thích"));
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const user = await userService.findById(req.user.id);
    res.send(user);
  } catch (error) {
    next(new ApiError(500, "Lỗi khi lấy thông tin người dùng"));
  }
};
