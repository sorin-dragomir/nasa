// Chatbot Controller Mocks

const chatbotMockRequest = (body, params, query) => ({
  body: body || {},
  params: params || {},
  query: query || {}
});

const chatbotMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Sample chatbot data for testing
const mockChatbotMessage = {
  message: "Tell me about Mars"
};

const mockChatbotInvalidMessage = {
  message: ""
};

const mockChatbotLongMessage = {
  message: "A".repeat(600) // Message longer than 500 characters
};

const mockChatbotSuccessResponse = {
  success: true,
  response: "Mars, the Red Planet, is one of our most studied neighbors! It's red due to iron oxide (rust) on its surface. Currently, NASA's Perseverance rover is exploring Jezero Crater, searching for signs of ancient microbial life.",
  source: "knowledge_base"
};

const mockChatbotAIResponse = {
  success: true,
  response: "Mars is fascinating! It has two small moons and the largest volcano in the solar system.",
  source: "ai"
};

const mockChatbotGeneralResponse = {
  success: true,
  response: "That's a fascinating question about space! While I specialize in astronomy and space exploration topics, I'd love to help you explore the cosmos.",
  source: "general"
};

const mockChatbotErrorResponse = {
  success: false,
  error: "Sorry, I encountered an error processing your question. Please try again!"
};

const mockProcessedResponse = {
  response: "Mars, the Red Planet, is one of our most studied neighbors! It's red due to iron oxide (rust) on its surface. Currently, NASA's Perseverance rover is exploring Jezero Crater, searching for signs of ancient microbial life.",
  source: "knowledge_base"
};

module.exports = {
  chatbotMockRequest,
  chatbotMockResponse,
  mockChatbotMessage,
  mockChatbotInvalidMessage,
  mockChatbotLongMessage,
  mockChatbotSuccessResponse,
  mockChatbotAIResponse,
  mockChatbotGeneralResponse,
  mockChatbotErrorResponse,
  mockProcessedResponse
};
