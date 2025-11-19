import createApiClient from "./api.service";

class ChapterService {
  constructor(baseUrl = "/api/chapters") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async getByStory(storyId) {
    return (await this.api.get(`/story/${storyId}`)).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
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

  async uploadAudio(storyId, chapterNumber, audioFile) {
    const formData = new FormData();
    formData.append("chapterAudio", audioFile);
    return (
      await this.api.post(
        `/upload-audio/${storyId}/${chapterNumber}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
    ).data;
  }
}

export default new ChapterService();
