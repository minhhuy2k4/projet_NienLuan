const ChatbotService = require("../../services/chatbot_services/chatbot.service");
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
