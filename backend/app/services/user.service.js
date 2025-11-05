const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class UserService {
  constructor(client) {
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
      };

      const result = await this.User.insertOne(userData);
      return await this.findById(result.insertedId);
    }
  }
}

module.exports = UserService;
