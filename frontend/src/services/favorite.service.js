import createApiClient from "./api.service";

class FavoriteService {
  constructor(baseUrl = "/api/favorites") {
    this.api = createApiClient(baseUrl);
  }

  async toggleFavorite(storyId) {
    return (await this.api.post("/toggle", { storyId })).data;
  }

  async getFavorites() {
    return (await this.api.get("/")).data;
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
