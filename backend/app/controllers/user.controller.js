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

// --- Admin Controllers ---
exports.getAllUsers = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const { page = 1, limit = 10, search = "" } = req.query;

    const result = await userService.getAllUsers(
      parseInt(page),
      parseInt(limit),
      search
    );

    res.send(result);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    next(new ApiError(500, "Lỗi khi lấy danh sách người dùng"));
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const userData = req.body;

    const newUser = await userService.createUser(userData);
    res
      .status(201)
      .send({ message: "Tạo người dùng thành công", user: newUser });
  } catch (error) {
    console.error("Error in createUser:", error);
    if (error.message === "Email đã tồn tại") {
      return next(new ApiError(400, error.message));
    }
    next(new ApiError(500, "Lỗi khi tạo người dùng"));
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await userService.updateUser(id, updates);
    res.send({ message: "Cập nhật người dùng thành công", user: updatedUser });
  } catch (error) {
    console.error("Error in updateUser:", error);
    if (error.message === "Email đã tồn tại") {
      return next(new ApiError(400, error.message));
    }
    next(new ApiError(500, "Lỗi khi cập nhật người dùng"));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const { id } = req.params;

    // Không cho phép xóa chính mình
    if (id === req.user.id) {
      return next(new ApiError(400, "Không thể xóa tài khoản của chính bạn"));
    }

    const success = await userService.deleteUser(id);
    if (!success) {
      return next(new ApiError(404, "Không tìm thấy người dùng"));
    }

    res.send({ message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    next(new ApiError(500, "Lỗi khi xóa người dùng"));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return next(new ApiError(400, "Mật khẩu phải có ít nhất 6 ký tự"));
    }

    await userService.resetPassword(id, newPassword);
    res.send({ message: "Reset mật khẩu thành công" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    if (error.message === "Không thể reset mật khẩu cho tài khoản Google") {
      return next(new ApiError(400, error.message));
    }
    if (error.message === "Không tìm thấy người dùng") {
      return next(new ApiError(404, error.message));
    }
    next(new ApiError(500, "Lỗi khi reset mật khẩu"));
  }
};
