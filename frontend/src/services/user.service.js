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
}

export default new UserService();
