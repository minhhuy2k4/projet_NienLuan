import createApiClient from "./api.service";

class UploadService {
  constructor(baseUrl = "/api/upload") {
    this.api = createApiClient(baseUrl);
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
}

export default new UploadService();
