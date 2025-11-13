import createApiClient from "./api.service";

const api = createApiClient();

class AdService {
  // Get all ads (admin only)
  async getAll(page = 1, limit = 5) {
    return api.get(`/api/ads?page=${page}&limit=${limit}`);
  }

  // Get ads by position (public)
  async getByPosition(position) {
    return api.get(`/api/ads/position/${position}`);
  }

  // Get ad by id (admin only)
  async getById(id) {
    return api.get(`/api/ads/${id}`);
  }

  // Create new ad (admin only)
  async create(adData) {
    return api.post("/api/ads", adData);
  }

  // Update ad (admin only)
  async update(id, adData) {
    return api.put(`/api/ads/${id}`, adData);
  }

  // Delete ad (admin only)
  async delete(id) {
    return api.delete(`/api/ads/${id}`);
  }

  // Toggle ad active status (admin only)
  async toggleActive(id) {
    return api.patch(`/api/ads/${id}/toggle`);
  }

  // Track ad view (public)
  async trackView(id) {
    try {
      await api.post(`/api/ads/${id}/view`);
    } catch (error) {
      // Không làm gì nếu track view thất bại
      console.error("Track view error:", error);
    }
  }

  // Track ad click (public)
  async trackClick(id) {
    try {
      await api.post(`/api/ads/${id}/click`);
    } catch (error) {
      // Không làm gì nếu track click thất bại
      console.error("Track click error:", error);
    }
  }

  // Upload ad image
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("ad", file);

    return api.post("/api/ads/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new AdService();
