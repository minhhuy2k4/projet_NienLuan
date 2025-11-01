import createApiClient from "./api.service";

class ChatbotService {
  constructor(baseUrl = "/api/chatbot") {
    this.api = createApiClient(baseUrl);
  }

  async sendMessage(message) {
    return (await this.api.post("/", { message })).data;
  }
}

export default new ChatbotService();
