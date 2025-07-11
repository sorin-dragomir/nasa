// Global test setup and configuration for vanilla JavaScript

// Set test timeout
jest.setTimeout(10000);

// Global beforeEach for all tests
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Global afterEach for all tests
afterEach(() => {
  // Restore all mocks after each test
  jest.restoreAllMocks();
});

// Suppress MongoDB memory warnings in tests
process.env.NODE_ENV = 'test';

// Mock environment variables for testing
process.env.MONGO_URL = 'mongodb://localhost:27017/nasa-test';
process.env.PORT = '5001';
process.env.HUGGING_FACE_API_KEY = 'test-key';

// Global test utilities
global.testUtils = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Helper to create mock Express request
  mockRequest: (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides
  }),
  
  // Helper to create mock Express response
  mockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.set = jest.fn().mockReturnValue(res);
    return res;
  }
};
