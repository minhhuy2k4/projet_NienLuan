import createApiClient from "./api.service";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const api = createApiClient(baseURL);

class ChapterService {
  async getAll() {
    return (await api.get("/api/chapters")).data;
  }

  async getByStory(storyId) {
    return (await api.get(`/api/chapters/story/${storyId}`)).data;
  }

  async get(id) {
    return (await api.get(`/api/chapters/${id}`)).data;
  }

  async create(data) {
    return (await api.post("/api/chapters", data)).data;
  }

  async update(id, data) {
    return (await api.put(`/api/chapters/${id}`, data)).data;
  }

  async delete(id) {
    return (await api.delete(`/api/chapters/${id}`)).data;
  }

  async uploadAudio(storyId, chapterNumber, audioFile) {
    const formData = new FormData();
    formData.append("chapterAudio", audioFile);

    return (
      await api.post(
        `/api/chapters/upload-audio/${storyId}/${chapterNumber}`,
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
