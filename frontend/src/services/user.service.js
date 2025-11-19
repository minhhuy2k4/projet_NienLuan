import createApiClient from "./api.service";

class UserService {
  constructor(baseUrl = "/api/users") {
    this.api = createApiClient(baseUrl);
  }

  // Lấy thông tin cá nhân
  async getProfile() {
    return (await this.api.get(`/me`)).data;
  }

  // Cập nhật thông tin cá nhân
  async updateProfile(data) {
    return (await this.api.put(`/profile`, data)).data;
  }

  // Cập nhật avatar
  async updateAvatar(avatar) {
    return (await this.api.put(`/avatar`, { avatar })).data;
  }

  // Upload avatar file
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    return (
      await this.api.put(`/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  // Đổi mật khẩu
  async changePassword(currentPassword, newPassword) {
    return (await this.api.put(`/password`, { currentPassword, newPassword }))
      .data;
  }

  // Thêm truyện yêu thích
  async addFavorite(data) {
    return (await this.api.post(`/favorites`, data)).data;
  }

  // --- Admin Methods ---
  // Lấy danh sách người dùng (có phân trang và tìm kiếm)
  async getAllUsers(page = 1, limit = 10, search = "") {
    const params = { page, limit };
    if (search) {
      params.search = search;
    }
    return (await this.api.get(`/admin/users`, { params })).data;
  }

  // Tạo người dùng mới
  async createUser(userData) {
    return (await this.api.post(`/admin/users`, userData)).data;
  }

  // Cập nhật người dùng
  async updateUser(userId, updates) {
    return (await this.api.put(`/admin/users/${userId}`, updates)).data;
  }

  // Xóa người dùng
  async deleteUser(userId) {
    return (await this.api.delete(`/admin/users/${userId}`)).data;
  }

  // Reset mật khẩu người dùng
  async resetPassword(userId, newPassword) {
    return (
      await this.api.post(`/admin/users/${userId}/reset-password`, {
        newPassword,
      })
    ).data;
  }
}

export default new UserService();
