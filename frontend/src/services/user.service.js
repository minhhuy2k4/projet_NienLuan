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

  // Thêm truyện yêu thích
  async addFavorite(data) {
    // Interceptor sẽ tự động gắn token
    return (await api.post("/api/users/favorites", data)).data;
  }
}

export default new UserService();
