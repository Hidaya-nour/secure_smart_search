import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import OpenAI from 'openai';
import { z } from 'zod';

// Input validation schema
const searchQuerySchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query is too long')
    .regex(/^[a-zA-Z0-9\s\-_.,]+$/, 'Invalid characters in search query'),
  language: z.string()
    .regex(/^[a-zA-Z0-9#+]+$/, 'Invalid language format')
    .optional()
    .transform(val => val || undefined), // Convert empty string to undefined
  minStars: z.string()
    .optional()
    .transform(val => {
      if (!val) return undefined;
      const num = parseInt(val, 10);
      if (isNaN(num)) throw new Error('Stars must be a number');
      if (num < 0) throw new Error('Stars must be positive');
      return num;
    })
});

// Check if required API keys are configured
if (!process.env.GITHUB_TOKEN) {
  console.warn('GitHub token is not configured. API rate limits will be restricted.');
}

if (!process.env.OPENAI_API_KEY) {
  console.warn('OpenAI API key is not configured. AI-powered search will be disabled.');
}

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Sanitize input string
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

async function enhanceSearchQuery(query: string): Promise<string> {
  // If OpenAI is not configured, return the original query
  if (!openai) {
    return query;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a search query enhancer specialized in GitHub repository search. Your task is to:
1. Add relevant technical terms and filters
2. Include common frameworks and libraries related to the search
3. Add quality indicators (stars, forks, etc.)
4. Keep the enhanced query concise and focused
5. Maintain the original intent of the search`
        },
        {
          role: "user",
          content: `Enhance this GitHub repository search query to find more relevant results: "${query}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    return sanitizeInput(completion.choices[0].message.content || query);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return query;
  }
}

// Add semantic analysis of repository descriptions
async function analyzeRepository(repo: any): Promise<{
  relevance: number;
  categories: string[];
  keyFeatures: string[];
}> {
  if (!openai) {
    return {
      relevance: 1,
      categories: [],
      keyFeatures: []
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Analyze this GitHub repository and provide:
1. A relevance score (0-1) based on the description and metadata
2. Main categories/tags that describe the repository
3. Key features or technologies mentioned
Keep the response concise and structured.`
        },
        {
          role: "user",
          content: `Repository: ${repo.name}
Description: ${repo.description}
Language: ${repo.language}
Stars: ${repo.stargazers_count}
Topics: ${repo.topics?.join(', ') || 'none'}`
        }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    return {
      relevance: analysis.relevance || 1,
      categories: analysis.categories || [],
      keyFeatures: analysis.keyFeatures || []
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      relevance: 1,
      categories: [],
      keyFeatures: []
    };
  }
}

interface Repository {
  id: number;
  name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  stargazers_count: number;
  html_url: string;
  language: string;
  topics?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validate and sanitize input
    const validatedData = searchQuerySchema.parse({
      query: sanitizeInput(req.query.query as string),
      language: req.query.language ? sanitizeInput(req.query.language as string) : undefined,
      minStars: req.query.minStars
    });

    // Enhance the search query using OpenAI
    const enhancedQuery = await enhanceSearchQuery(validatedData.query);

    // Build the search query with filters
    let searchQuery = enhancedQuery;
    if (validatedData.language) {
      searchQuery += ` language:${validatedData.language}`;
    }
    if (validatedData.minStars) {
      searchQuery += ` stars:>=${validatedData.minStars}`;
    }

    // Prepare GitHub API headers
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Secure-Smart-Search'
    };

    // Add GitHub token if available
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get('https://api.github.com/search/repositories', {
      params: {
        q: searchQuery,
        per_page: 10,
        sort: 'stars',
        order: 'desc'
      },
      headers
    });

    // Validate response data
    if (!response.data || !Array.isArray(response.data.items)) {
      throw new Error('Invalid response format from GitHub API');
    }

    // Enhance results with AI analysis
    const enhancedResults = await Promise.all(
      response.data.items.map(async (item: Repository) => {
        const analysis = await analyzeRepository(item);
        return {
          ...item,
          aiAnalysis: analysis
        };
      })
    );

    // Sort results by AI relevance score if available
    enhancedResults.sort((a, b) => 
      (b.aiAnalysis?.relevance || 0) - (a.aiAnalysis?.relevance || 0)
    );

    return res.status(200).json({
      items: enhancedResults,
      total_count: response.data.total_count,
      originalQuery: validatedData.query,
      enhancedQuery: searchQuery,
      isEnhanced: !!openai,
      aiFeatures: {
        queryEnhancement: !!openai,
        semanticAnalysis: !!openai,
        relevanceScoring: !!openai,
        categorization: !!openai
      }
    });
  } catch (error: any) {
    console.error('Search error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid input',
        errors: error.errors
      });
    }
    
    // Handle specific error cases
    if (error.response?.status === 403) {
      return res.status(429).json({ 
        message: 'GitHub API rate limit exceeded. Please try again later.' 
      });
    }
    
    if (error.response?.status === 422) {
      return res.status(400).json({ 
        message: 'Invalid search query. Please try different keywords.' 
      });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({ 
        message: 'GitHub API authentication failed. Please check your configuration.' 
      });
    }

    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        message: 'Unable to connect to GitHub API. Please try again later.' 
      });
    }

    return res.status(500).json({ 
      message: 'Error fetching repositories. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 