const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const { getAvatarUrl } = require("../middlewares/file-upload.middleware");

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

exports.updateProfile = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const { name } = req.body;
    const userId = req.user.id;

    const updatedUser = await userService.updateProfile(userId, { name });
    res.send({ message: "Cập nhật thông tin thành công", user: updatedUser });
  } catch (error) {
    next(new ApiError(500, "Lỗi khi cập nhật thông tin"));
  }
};

exports.updateAvatar = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const userId = req.user.id;

    let avatarUrl;

    // Nếu upload file
    if (req.file) {
      avatarUrl = getAvatarUrl(req, req.file.filename);
    }
    // Nếu gửi URL từ body
    else if (req.body.avatar) {
      avatarUrl = req.body.avatar;
    } else {
      return next(new ApiError(400, "Vui lòng upload ảnh hoặc cung cấp URL"));
    }

    const updatedUser = await userService.updateProfile(userId, {
      avatar: avatarUrl,
    });
    res.send({ message: "Cập nhật avatar thành công", user: updatedUser });
  } catch (error) {
    next(new ApiError(500, "Lỗi khi cập nhật avatar"));
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const result = await userService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    if (!result) {
      return next(new ApiError(400, "Mật khẩu hiện tại không đúng"));
    }

    res.send({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    next(new ApiError(500, "Lỗi khi đổi mật khẩu"));
  }
};
