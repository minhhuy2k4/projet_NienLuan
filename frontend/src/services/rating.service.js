import createApiClient from "./api.service";

class RatingService {
  constructor(baseUrl = "http://localhost:3000/api/ratings") {
    this.api = createApiClient(baseUrl);
  }

  async addOrUpdateRating(storyId, rating, comment = "") {
    return (await this.api.post("/", { storyId, rating, comment })).data;
  }

  async getUserRating(storyId) {
    return (await this.api.get(`/user/${storyId}`)).data;
  }

  async getRatingsByStory(storyId, limit = 50, skip = 0) {
    return (await this.api.get(`/story/${storyId}?limit=${limit}&skip=${skip}`))
      .data;
  }

  async getRatingStats(storyId) {
    return (await this.api.get(`/stats/${storyId}`)).data;
  }

  async deleteRating(storyId) {
    return (await this.api.delete(`/${storyId}`)).data;
  }

  // Admin methods
  async getAllRatings(limit = 50, skip = 0, filters = {}) {
    const params = new URLSearchParams({ limit, skip, ...filters });
    return (await this.api.get(`/admin/all?${params}`)).data;
  }

  async deleteRatingById(ratingId) {
    return (await this.api.delete(`/admin/${ratingId}`)).data;
  }
}

export default new RatingService();
