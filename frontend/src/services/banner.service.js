import createApiClient from "./api.service";

class BannerService {
  constructor(baseUrl = "/api/banners") {
    this.api = createApiClient(baseUrl);
  }

  getAll(page = 1, limit = 5, search = "") {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    return this.api.get(`/?${params}`);
  }

  getActive() {
    return this.api.get("/active");
  }

  getById(id) {
    return this.api.get(`/${id}`);
  }

  create(bannerData) {
    return this.api.post("/", bannerData);
  }

  update(id, bannerData) {
    return this.api.put(`/${id}`, bannerData);
  }

  delete(id) {
    return this.api.delete(`/${id}`);
  }

  toggleActive(id) {
    return this.api.patch(`/${id}/toggle`);
  }

  uploadImage(file) {
    const formData = new FormData();
    formData.append("banner", file);
    return this.api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new BannerService();
