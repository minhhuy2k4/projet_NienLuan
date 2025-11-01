import createApiClient from "./api.service";

class HistoryService {
  constructor(baseUrl = "http://localhost:3000/api/history") {
    this.api = createApiClient(baseUrl);
  }

  async addHistory(storyId, chapterId = null) {
    return (await this.api.post("/", { storyId, chapterId })).data;
  }

  async getHistory() {
    return (await this.api.get("/")).data;
  }

  async deleteHistory(historyId) {
    return (await this.api.delete(`/${historyId}`)).data;
  }

  async clearHistory() {
    return (await this.api.delete("/clear")).data;
  }
}

export default new HistoryService();
