import { validateApiKey } from '../utils/security';

interface EnvConfig {
  GITHUB_API_KEY: string;
  DUCKDUCKGO_API_KEY?: string;
  NODE_ENV: 'development' | 'production' | 'test';
  API_BASE_URL: string;
}

function validateEnvConfig(): EnvConfig {
  const config: EnvConfig = {
    GITHUB_API_KEY: process.env.GITHUB_API_KEY || '',
    DUCKDUCKGO_API_KEY: process.env.DUCKDUCKGO_API_KEY,
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    API_BASE_URL: process.env.API_BASE_URL || 'https://api.github.com',
  };

  // Validate required environment variables
  if (!config.GITHUB_API_KEY) {
    throw new Error('GITHUB_API_KEY is required');
  }

  // Validate API key format
  if (!validateApiKey(config.GITHUB_API_KEY)) {
    throw new Error('Invalid GITHUB_API_KEY format');
  }

  if (config.DUCKDUCKGO_API_KEY && !validateApiKey(config.DUCKDUCKGO_API_KEY)) {
    throw new Error('Invalid DUCKDUCKGO_API_KEY format');
  }

  return config;
}

// Export validated environment configuration
export const env = validateEnvConfig();

// Export type for use in other files
export type { EnvConfig }; 