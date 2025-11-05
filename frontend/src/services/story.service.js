import createApiClient from "./api.service";

class StoryService {
  constructor(baseUrl = "/api/stories") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async getBySlug(slug) {
    return (await this.api.get(`/slug/${slug}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async uploadCover(storyId, formData) {
    return (
      await this.api.post(`/upload-cover/${storyId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  async search(query, categoryId = null, authorId = null) {
    const params = {};
    if (query) params.q = query;
    if (categoryId) params.category = categoryId;
    if (authorId) params.author = authorId;

    return (await this.api.get("/search", { params })).data;
  }
}

export default new StoryService();
