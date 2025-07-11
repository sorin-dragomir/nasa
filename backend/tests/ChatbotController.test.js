const { ChatbotController } = require('../src/controllers/ChatbotController');
const {
  chatbotMockRequest,
  chatbotMockResponse,
  mockChatbotMessage,
  mockChatbotInvalidMessage,
  mockChatbotLongMessage,
  mockChatbotSuccessResponse,
  mockChatbotErrorResponse,
  mockProcessedResponse
} = require('./mocks/chatbotMocks');

// Mock the chatbot service
const mockChatbotService = {
  getChatbotResponse: jest.fn()
};

// Mock the helper functions
jest.mock('../src/shared/utils/helpers', () => ({
  asyncHandler: (fn) => fn,
  successResponse: jest.fn(),
  errorResponse: jest.fn()
}));

const { successResponse, errorResponse } = require('../src/shared/utils/helpers');

describe('ChatbotController', () => {
  let chatbotController;

  beforeEach(() => {
    chatbotController = new ChatbotController(mockChatbotService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('httpProcessMessage', () => {
    it('should process a valid message successfully', async () => {
      const req = chatbotMockRequest(mockChatbotMessage);
      const res = chatbotMockResponse();

      mockChatbotService.getChatbotResponse.mockResolvedValue(mockChatbotSuccessResponse);

      await chatbotController.httpProcessMessage(req, res);

      expect(mockChatbotService.getChatbotResponse).toHaveBeenCalledWith("Tell me about Mars");
      expect(successResponse).toHaveBeenCalledWith(
        res,
        mockProcessedResponse,
        "Message processed successfully"
      );
    });

    it('should handle empty message', async () => {
      const req = chatbotMockRequest(mockChatbotInvalidMessage);
      const res = chatbotMockResponse();

      await chatbotController.httpProcessMessage(req, res);

      expect(mockChatbotService.getChatbotResponse).not.toHaveBeenCalled();
      expect(errorResponse).toHaveBeenCalledWith(
        res,
        new Error("Message is required"),
        400
      );
    });

    it('should handle missing message field', async () => {
      const req = chatbotMockRequest({});
      const res = chatbotMockResponse();

      await chatbotController.httpProcessMessage(req, res);

      expect(mockChatbotService.getChatbotResponse).not.toHaveBeenCalled();
      expect(errorResponse).toHaveBeenCalledWith(
        res,
        new Error("Message is required"),
        400
      );
    });

    it('should handle non-string message', async () => {
      const req = chatbotMockRequest({ message: 123 });
      const res = chatbotMockResponse();

      await chatbotController.httpProcessMessage(req, res);

      expect(mockChatbotService.getChatbotResponse).not.toHaveBeenCalled();
      expect(errorResponse).toHaveBeenCalledWith(
        res,
        new Error("Message is required"),
        400
      );
    });

    it('should sanitize and truncate long messages', async () => {
      const req = chatbotMockRequest(mockChatbotLongMessage);
      const res = chatbotMockResponse();

      mockChatbotService.getChatbotResponse.mockResolvedValue(mockChatbotSuccessResponse);

      await chatbotController.httpProcessMessage(req, res);

      // Message should be truncated to 500 characters
      const expectedMessage = "A".repeat(500);
      expect(mockChatbotService.getChatbotResponse).toHaveBeenCalledWith(expectedMessage);
      expect(successResponse).toHaveBeenCalledWith(
        res,
        mockProcessedResponse,
        "Message processed successfully"
      );
    });

    it('should handle service error', async () => {
      const req = chatbotMockRequest(mockChatbotMessage);
      const res = chatbotMockResponse();

      mockChatbotService.getChatbotResponse.mockResolvedValue(mockChatbotErrorResponse);

      await chatbotController.httpProcessMessage(req, res);

      expect(mockChatbotService.getChatbotResponse).toHaveBeenCalledWith("Tell me about Mars");
      expect(errorResponse).toHaveBeenCalledWith(
        res,
        new Error(mockChatbotErrorResponse.error),
        500
      );
    });

    it('should handle service throwing an error', async () => {
      const req = chatbotMockRequest(mockChatbotMessage);
      const res = chatbotMockResponse();
      const error = new Error('Service unavailable');

      mockChatbotService.getChatbotResponse.mockRejectedValue(error);

      await expect(chatbotController.httpProcessMessage(req, res)).rejects.toThrow('Service unavailable');
      expect(mockChatbotService.getChatbotResponse).toHaveBeenCalledWith("Tell me about Mars");
    });

    it('should trim whitespace from messages', async () => {
      const req = chatbotMockRequest({ message: '   Tell me about Mars   ' });
      const res = chatbotMockResponse();

      mockChatbotService.getChatbotResponse.mockResolvedValue(mockChatbotSuccessResponse);

      await chatbotController.httpProcessMessage(req, res);

      expect(mockChatbotService.getChatbotResponse).toHaveBeenCalledWith("Tell me about Mars");
      expect(successResponse).toHaveBeenCalledWith(
        res,
        mockProcessedResponse,
        "Message processed successfully"
      );
    });
  });
});
