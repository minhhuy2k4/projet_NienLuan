const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

class ChatbotService {
  constructor() {
    // Lấy API key từ biến môi trường
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables.");
    }
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    this.baseContext = this.loadContextFromFiles();
  }

  loadContextFromFiles() {
    const dataDir = path.join(__dirname, "..", "..", "..", "chatbot_data");
    let context = "";
    try {
      const files = fs
        .readdirSync(dataDir)
        .filter((file) => file.endsWith(".txt"));
      for (const file of files) {
        context += fs.readFileSync(path.join(dataDir, file), "utf-8") + "\n\n";
      }
    } catch (error) {
      context = `Bạn là một trợ lý ảo thân thiện tên là "AudioBot".`; // Fallback context
    }
    return context;
  }

  /**
   * Reload context từ các file txt mà không cần restart server
   */
  reloadContext() {
    this.baseContext = this.loadContextFromFiles();
    return this.baseContext;
  }

  /**
   * Tạo prompt định hướng cho AI, giúp nó hiểu bối cảnh và vai trò.
   * @param {string} userQuestion - Câu hỏi của người dùng.
   * @returns {string} - Prompt hoàn chỉnh để gửi đến AI.
   */
  createPrompt(userQuestion) {
    return `${this.baseContext}\n\nCâu hỏi của người dùng: "${userQuestion}"\n\nCâu trả lời của bạn:`;
  }

  /**
   * Gửi câu hỏi đến Google AI và nhận câu trả lời.
   * @param {string} userQuestion - Câu hỏi từ người dùng.
   */
  async ask(userQuestion) {
    const prompt = this.createPrompt(userQuestion);
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}

module.exports = new ChatbotService();
