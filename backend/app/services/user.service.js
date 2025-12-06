const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

class UserService {
  constructor(client) {
    this.client = client;
    this.User = client.db().collection("users");
  }

  extractUserData(payload) {
    const user = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role || "user",
      favorites: [],
      // Thêm các trường cho Google OAuth
      googleId: payload.googleId,
      avatar: payload.avatar,
      provider: payload.provider || "local", // "local" hoặc "google"
      createdAt: payload.createdAt || new Date(),
    };
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  async register(payload) {
    const userData = this.extractUserData(payload);
    if (await this.User.findOne({ email: userData.email })) {
      return null; // Báo hiệu email đã tồn tại
    }
    // Chỉ hash password nếu đăng ký bằng local (không phải Google)
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const result = await this.User.insertOne(userData);
    return await this.findById(result.insertedId);
  }

  async findById(id) {
    return await this.User.findOne(
      { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
      { projection: { password: 0 } } // Loại bỏ mật khẩu
    );
  }

  async findByEmail(email) {
    return await this.User.findOne({ email }); // Giữ mật khẩu để so sánh
  }

  // --- User Actions ---
  async addFavorite(userId, storyId) {
    return await this.User.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { favorites: new ObjectId(storyId) } } // $addToSet để tránh trùng lặp
    );
  }

  async removeFavorite(userId, storyId) {
    return await this.User.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { favorites: new ObjectId(storyId) } }
    );
  }

  async updateProfile(userId, updates) {
    const allowedUpdates = {};
    if (updates.name !== undefined) allowedUpdates.name = updates.name;
    if (updates.avatar !== undefined) allowedUpdates.avatar = updates.avatar;

    await this.User.updateOne(
      { _id: new ObjectId(userId) },
      { $set: allowedUpdates }
    );

    return await this.findById(userId);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.User.findOne({ _id: new ObjectId(userId) });

    if (!user.password) {
      // User đăng nhập bằng Google, không có password
      return false;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return false;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.User.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );

    return true;
  }

  // --- Google OAuth Methods ---
  async findByGoogleId(googleId) {
    return await this.User.findOne(
      { googleId },
      { projection: { password: 0 } }
    );
  }

  async createOrUpdateGoogleUser(googleProfile) {
    // Xử lý cả profile từ ID token và từ API
    const googleId = googleProfile.sub || googleProfile.id;
    const email = googleProfile.email;
    const name = googleProfile.name;
    const picture = googleProfile.picture;

    // Tìm user theo Google ID hoặc email
    let user = await this.User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      // Cập nhật thông tin nếu user đã tồn tại
      const updateData = {
        googleId,
        avatar: picture,
        name,
        provider: "google",
      };

      await this.User.updateOne({ _id: user._id }, { $set: updateData });

      return await this.findById(user._id);
    } else {
      // Tạo user mới nếu chưa tồn tại
      const userData = {
        name,
        email,
        googleId,
        avatar: picture,
        provider: "google",
        role: "user",
        favorites: [],
        createdAt: new Date(),
      };

      const result = await this.User.insertOne(userData);
      return await this.findById(result.insertedId);
    }
  }

  // --- Admin Methods ---
  async getAllUsers(page = 1, limit = 5, searchQuery = "") {
    const skip = (page - 1) * limit;

    let filter = {};
    if (searchQuery) {
      filter = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const users = await this.User.find(filter, { projection: { password: 0 } })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.User.countDocuments(filter);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUser(userId, updates) {
    // Kiểm tra email đã tồn tại chưa (trừ chính user đó)
    if (updates.email) {
      const existingUser = await this.User.findOne({
        email: updates.email,
        _id: { $ne: new ObjectId(userId) },
      });
      if (existingUser) {
        throw new Error("Email đã tồn tại");
      }
    }

    // Sử dụng extractUserData để lọc và chuẩn hóa dữ liệu
    const userData = this.extractUserData(updates);

    // Loại bỏ các trường không cho phép update
    delete userData.password; // Không update password ở đây (dùng changePassword hoặc resetPassword)
    delete userData.googleId; // Không cho phép thay đổi googleId
    delete userData.favorites; // Không update favorites ở đây

    await this.User.updateOne(
      { _id: new ObjectId(userId) },
      { $set: userData }
    );

    return await this.findById(userId);
  }

  async deleteUser(userId) {
    // Lấy thông tin user trước khi xóa để lấy avatar path
    const user = await this.findById(userId);

    // Xóa avatar file nếu là local file (không phải URL từ Google)
    if (user && user.avatar && !user.avatar.startsWith("http")) {
      const avatarPath = path.join(__dirname, "../../public", user.avatar);
      if (fs.existsSync(avatarPath)) {
        try {
          fs.unlinkSync(avatarPath);
        } catch (error) {}
      }
    }

    // Xóa tất cả lịch sử đọc của user
    const HistoryService = require("./history.service");
    const historyService = new HistoryService(this.client);
    await historyService.deleteByUserId(userId);

    // Xóa tất cả comments của user
    const CommentService = require("./comment.service");
    const commentService = new CommentService(this.client);
    const Comment = this.client.db().collection("comments");
    await Comment.deleteMany({ userId: new ObjectId(userId) });

    // Xóa tất cả ratings của user
    const Rating = this.client.db().collection("ratings");
    await Rating.deleteMany({ userId: new ObjectId(userId) });

    // Favorites tự động bị xóa khi xóa user (vì nằm trong user document)
    const result = await this.User.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount > 0;
  }

  async resetPassword(userId, newPassword) {
    // Kiểm tra user có phải local account không
    const user = await this.User.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    if (user.provider === "google") {
      throw new Error("Không thể reset mật khẩu cho tài khoản Google");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.User.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );

    return true;
  }

  async createUser(userData) {
    // Kiểm tra email đã tồn tại
    if (await this.User.findOne({ email: userData.email })) {
      throw new Error("Email đã tồn tại");
    }

    // Sử dụng extractUserData để nhất quán với register()
    const newUser = this.extractUserData({
      ...userData,
      provider: "local", // Force provider là local cho admin tạo user
    });

    // Hash password
    if (newUser.password) {
      newUser.password = await bcrypt.hash(newUser.password, 10);
    }

    const result = await this.User.insertOne(newUser);
    return await this.findById(result.insertedId);
  }
}

module.exports = UserService;
