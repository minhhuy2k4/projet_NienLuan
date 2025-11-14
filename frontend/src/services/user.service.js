import createApiClient from "./api.service";

const api = createApiClient(
  import.meta.env.VITE_API_URL || "http://localhost:3000"
);

class UserService {
  // Lấy thông tin cá nhân
  async getProfile() {
    // Interceptor sẽ tự động gắn token
    return (await api.get("/api/users/me")).data;
  }

  // Cập nhật thông tin cá nhân
  async updateProfile(data) {
    return (await api.put("/api/users/profile", data)).data;
  }

  // Cập nhật avatar
  async updateAvatar(avatar) {
    return (await api.put("/api/users/avatar", { avatar })).data;
  }

  // Upload avatar file
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    return (
      await api.put("/api/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  // Đổi mật khẩu
  async changePassword(currentPassword, newPassword) {
    return (
      await api.put("/api/users/password", { currentPassword, newPassword })
    ).data;
  }

  // Thêm truyện yêu thích
  async addFavorite(data) {
    // Interceptor sẽ tự động gắn token
    return (await api.post("/api/users/favorites", data)).data;
  }

  // --- Admin Methods ---
  // Lấy danh sách người dùng (có phân trang và tìm kiếm)
  async getAllUsers(page = 1, limit = 10, search = "") {
    const params = { page, limit };
    if (search) {
      params.search = search;
    }
    return (await api.get("/api/users/admin/users", { params })).data;
  }

  // Tạo người dùng mới
  async createUser(userData) {
    return (await api.post("/api/users/admin/users", userData)).data;
  }

  // Cập nhật người dùng
  async updateUser(userId, updates) {
    return (await api.put(`/api/users/admin/users/${userId}`, updates)).data;
  }

  // Xóa người dùng
  async deleteUser(userId) {
    return (await api.delete(`/api/users/admin/users/${userId}`)).data;
  }

  // Reset mật khẩu người dùng
  async resetPassword(userId, newPassword) {
    return (
      await api.post(`/api/users/admin/users/${userId}/reset-password`, {
        newPassword,
      })
    ).data;
  }
}

export default new UserService();
