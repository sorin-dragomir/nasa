const { asyncHandler, successResponse, errorResponse } = require("../shared/utils/helpers");

class ChatbotController {
  constructor(chatbotService) {
    this.chatbotService = chatbotService;
  }

  httpProcessMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return errorResponse(res, new Error("Message is required"), 400);
    }

    // Sanitize input
    const sanitizedMessage = message.trim().substring(0, 500); // Limit length

    const result = await this.chatbotService.getChatbotResponse(sanitizedMessage);

    if (result.success) {
      successResponse(res, {
        response: result.response,
        source: result.source
      }, "Message processed successfully");
    } else {
      errorResponse(res, new Error(result.error), 500);
    }
  });
}

module.exports = { ChatbotController };
