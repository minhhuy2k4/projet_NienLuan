import createApiClient from "./api.service";

const api = createApiClient(
  import.meta.env.VITE_API_URL || "http://localhost:3000"
);

class UploadService {
  /**
   * Upload file audio
   * @param {FormData} formData - Đối tượng FormData chứa file
   */
  async uploadAudio(formData) {
    return (
      await api.post("/api/upload/audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  /**
   * Upload ảnh bìa cho truyện
   * @param {string} storyId - ID của truyện
   * @param {FormData} formData - Đối tượng FormData chứa file ảnh
   */
  async uploadCover(storyId, formData) {
    return (
      await api.post(`/api/stories/upload-cover/${storyId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }
}

export default new UploadService();
