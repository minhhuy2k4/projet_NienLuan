import createApiClient from "./api.service";

const api = createApiClient();

class BannerService {
  // Lấy tất cả banners (Admin)
  getAll() {
    return api.get("/api/banners");
  }

  // Lấy chỉ banners đang active (Public)
  getActive() {
    return api.get("/api/banners/active");
  }

  // Lấy banner theo ID
  getById(id) {
    return api.get(`/api/banners/${id}`);
  }

  // Tạo banner mới
  create(bannerData) {
    return api.post("/api/banners", bannerData);
  }

  // Cập nhật banner
  update(id, bannerData) {
    return api.put(`/api/banners/${id}`, bannerData);
  }

  // Xóa banner
  delete(id) {
    return api.delete(`/api/banners/${id}`);
  }

  // Toggle active status
  toggleActive(id) {
    return api.patch(`/api/banners/${id}/toggle`);
  }

  // Upload banner image
  uploadImage(file) {
    const formData = new FormData();
    formData.append("banner", file);
    return api.post("/api/banners/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new BannerService();
