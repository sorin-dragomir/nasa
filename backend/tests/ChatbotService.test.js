const { ChatbotService } = require('../src/services/ChatbotService');

// Mock axios for external API calls
jest.mock('axios');
const axios = require('axios');

// Mock logger
jest.mock('../src/shared/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

describe('ChatbotService', () => {
  let chatbotService;

  beforeEach(() => {
    chatbotService = new ChatbotService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getChatbotResponse', () => {
    it('should return knowledge base response for Mars question', async () => {
      const result = await chatbotService.getChatbotResponse('Tell me about Mars');

      expect(result.success).toBe(true);
      expect(result.source).toBe('knowledge_base');
      expect(result.response).toContain('Mars, the Red Planet');
    });

    it('should return knowledge base response for black hole question', async () => {
      const result = await chatbotService.getChatbotResponse('What is a black hole?');

      expect(result.success).toBe(true);
      expect(result.source).toBe('knowledge_base');
      expect(result.response).toContain('Black holes are among the most fascinating objects');
    });

    it('should return general response for greeting', async () => {
      const result = await chatbotService.getChatbotResponse('Hello');

      expect(result.success).toBe(true);
      expect(result.source).toBe('general');
      expect(result.response).toContain('Hello there, space explorer');
    });

    it('should return general response for thank you', async () => {
      const result = await chatbotService.getChatbotResponse('Thank you');

      expect(result.success).toBe(true);
      expect(result.source).toBe('general');
      expect(result.response).toContain("You're very welcome");
    });

    it('should return general response for unknown question', async () => {
      const result = await chatbotService.getChatbotResponse('What is the weather today?');

      expect(result.success).toBe(true);
      expect(result.source).toBe('general');
      expect(result.response).toContain("That's a fascinating question about space");
    });

    it('should handle AI response when API key is available', async () => {
      // Set up API key
      chatbotService.API_KEY = 'test-api-key';
      
      // Mock successful axios response
      axios.post.mockResolvedValue({
        data: [{
          generated_text: 'AI generated response about quantum physics'
        }]
      });

      const result = await chatbotService.getChatbotResponse('Tell me about quantum physics');

      expect(result.success).toBe(true);
      expect(result.source).toBe('ai');
      expect(result.response).toBe('AI generated response about quantum physics');
    });

    it('should fallback to general response when AI fails', async () => {
      // Set up API key
      chatbotService.API_KEY = 'test-api-key';
      
      // Mock failed axios response
      axios.post.mockRejectedValue(new Error('API error'));

      const result = await chatbotService.getChatbotResponse('Tell me about quantum physics');

      expect(result.success).toBe(true);
      expect(result.source).toBe('general');
      expect(result.response).toContain("That's a fascinating question about space");
    });

    it('should handle service error gracefully', async () => {
      // Force an error by making the findBestResponse method throw
      jest.spyOn(chatbotService, 'findBestResponse').mockImplementation(() => {
        throw new Error('Service error');
      });

      const result = await chatbotService.getChatbotResponse('test message');

      expect(result.success).toBe(false);
      expect(result.source).toBe('error');
      expect(result.error).toContain('Sorry, I encountered an error');
    });
  });

  describe('findBestResponse', () => {
    it('should find Mars-related keywords', () => {
      const response = chatbotService.findBestResponse('Tell me about the red planet');
      expect(response).toContain('Mars, the Red Planet');
    });

    it('should find ISS-related keywords', () => {
      const response = chatbotService.findBestResponse('What is the International Space Station?');
      expect(response).toContain('International Space Station (ISS)');
    });

    it('should return null for unknown topics', () => {
      const response = chatbotService.findBestResponse('What is the weather?');
      expect(response).toBeNull();
    });
  });

  describe('getAIResponse', () => {
    it('should return null when no API key is set', async () => {
      chatbotService.API_KEY = null;
      
      const result = await chatbotService.getAIResponse('test message');
      expect(result).toBeNull();
    });

    it('should make API call when API key is available', async () => {
      chatbotService.API_KEY = 'test-key';
      
      axios.post.mockResolvedValue({
        data: [{
          generated_text: 'AI response'
        }]
      });

      const result = await chatbotService.getAIResponse('test message');
      
      expect(axios.post).toHaveBeenCalledWith(
        chatbotService.HUGGING_FACE_API,
        expect.objectContaining({
          inputs: 'test message',
          parameters: expect.objectContaining({
            max_length: 200,
            temperature: 0.7,
            do_sample: true
          })
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-key',
            'Content-Type': 'application/json'
          }),
          timeout: 10000
        })
      );
      
      expect(result).toBe('AI response');
    });

    it('should return null when API call fails', async () => {
      chatbotService.API_KEY = 'test-key';
      
      axios.post.mockRejectedValue(new Error('API error'));

      const result = await chatbotService.getAIResponse('test message');
      expect(result).toBeNull();
    });
  });
});
