const ChatbotService = require("../../services/chatbot_services/chatbot.service");
const chatbotSync = require("../../services/chatbot_services/chatbot-sync.service");
const StoryService = require("../../services/story.service");
const CategoryService = require("../../services/category.service");
const AuthorService = require("../../services/author.service");
const MongoDB = require("../../utils/mongodb.util");
const ApiError = require("../../api-error");

exports.handleChat = async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new ApiError(400, "Message is required."));
  }

  try {
    const reply = await ChatbotService.ask(message);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error from Google AI:", error);
    return next(
      new ApiError(
        500,
        "An error occurred while communicating with the AI assistant."
      )
    );
  }
};

exports.syncData = async (req, res, next) => {
  try {
    // Sync stories
    const storyService = new StoryService(MongoDB.client);
    const allStories = await storyService.find({});
    await chatbotSync.syncStories(allStories);

    // Sync categories
    const categoryService = new CategoryService(MongoDB.client);
    const allCategories = await categoryService.find({});
    await chatbotSync.syncCategories(allCategories);

    // Sync authors
    const authorService = new AuthorService(MongoDB.client);
    const allAuthors = await authorService.find({});
    await chatbotSync.syncAuthors(allAuthors);

    // Reload chatbot context sau khi sync xong
    ChatbotService.reloadContext();

    res.status(200).json({
      message: "Đã sync tất cả dữ liệu thành công và reload chatbot context",
      counts: {
        stories: allStories.length,
        categories: allCategories.length,
        authors: allAuthors.length,
      },
    });
  } catch (error) {
    console.error("Error syncing chatbot data:", error);
    return next(new ApiError(500, "Lỗi khi sync dữ liệu chatbot"));
  }
};
