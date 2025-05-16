// Mock environment variables for testing
const originalEnv = process.env;

beforeAll(() => {
  process.env = {
    ...originalEnv,
    OPENAI_API_KEY: 'test-key',
    GITHUB_TOKEN: 'test-token'
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Increase timeout for AI operations
jest.setTimeout(30000); 