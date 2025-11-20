import createApiClient from "./api.service";

class AdService {
  constructor(baseUrl = "/api/ads") {
    this.api = createApiClient(baseUrl);
  }

  async getAll(page = 1, limit = 5, search = "") {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    return this.api.get(`/?${params}`);
  }

  async getByPosition(position) {
    return this.api.get(`/position/${position}`);
  }

  async getById(id) {
    return this.api.get(`/${id}`);
  }

  async create(adData) {
    return this.api.post("/", adData);
  }

  async update(id, adData) {
    return this.api.put(`/${id}`, adData);
  }

  async delete(id) {
    return this.api.delete(`/${id}`);
  }

  async toggleActive(id) {
    return this.api.patch(`/${id}/toggle`);
  }

  async trackView(id) {
    try {
      await this.api.post(`/${id}/view`);
    } catch (error) {
      console.error("Track view error:", error);
    }
  }

  async trackClick(id) {
    try {
      await this.api.post(`/${id}/click`);
    } catch (error) {
      console.error("Track click error:", error);
    }
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("ad", file);
    return this.api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new AdService();
