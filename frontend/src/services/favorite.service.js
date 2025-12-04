import createApiClient from "./api.service";

class FavoriteService {
  constructor(baseUrl = "/api/favorites") {
    this.api = createApiClient(baseUrl);
  }

  async toggleFavorite(storyId) {
    return (await this.api.post("/toggle", { storyId })).data;
  }

  async getFavorites(page = 1, limit = 12) {
    return (await this.api.get("/", { params: { page, limit } })).data;
  }

  async checkFavorite(storyId) {
    return (await this.api.get(`/check/${storyId}`)).data;
  }

  async addFavorite(storyId) {
    return (await this.api.post("/", { storyId })).data;
  }

  async removeFavorite(storyId) {
    return (await this.api.delete(`/${storyId}`)).data;
  }
}

export default new FavoriteService();
