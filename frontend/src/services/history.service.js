import createApiClient from "./api.service";

class HistoryService {
  constructor(baseUrl = "/api/history") {
    this.api = createApiClient(baseUrl);
  }

  async addHistory(storyId, chapterId = null) {
    return (await this.api.post("/", { storyId, chapterId })).data;
  }

  async getHistory(page = 1, limit = 10) {
    return (await this.api.get("/", { params: { page, limit } })).data;
  }

  async deleteHistory(historyId) {
    return (await this.api.delete(`/${historyId}`)).data;
  }

  async clearHistory() {
    return (await this.api.delete("/clear")).data;
  }
}

export default new HistoryService();
