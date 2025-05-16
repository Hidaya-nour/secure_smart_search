import axios from 'axios';

const API_URL = 'http://localhost:3000/api/search';

describe('AI-Powered Search Features', () => {
  // Test basic search functionality
  test('Basic search works without AI', async () => {
    const response = await axios.get(API_URL, {
      params: {
        query: 'react typescript',
        'x-api-key': 'test-key'
      }
    });

    expect(response.status).toBe(200);
    expect(response.data.items).toBeDefined();
    expect(Array.isArray(response.data.items)).toBe(true);
  });

  // Test query enhancement
  test('Search query is enhanced with AI', async () => {
    const response = await axios.get(API_URL, {
      params: {
        query: 'react typescript',
        'x-api-key': 'test-key'
      }
    });

    expect(response.data.enhancedQuery).toBeDefined();
    expect(response.data.enhancedQuery).not.toBe('react typescript');
    expect(response.data.isEnhanced).toBe(true);
  });

  // Test semantic analysis
  test('Results include AI analysis', async () => {
    const response = await axios.get(API_URL, {
      params: {
        query: 'react typescript',
        'x-api-key': 'test-key'
      }
    });

    const firstResult = response.data.items[0];
    expect(firstResult.aiAnalysis).toBeDefined();
    expect(firstResult.aiAnalysis.relevance).toBeGreaterThanOrEqual(0);
    expect(firstResult.aiAnalysis.relevance).toBeLessThanOrEqual(1);
    expect(Array.isArray(firstResult.aiAnalysis.categories)).toBe(true);
    expect(Array.isArray(firstResult.aiAnalysis.keyFeatures)).toBe(true);
  });

  // Test relevance scoring
  test('Results are sorted by relevance', async () => {
    const response = await axios.get(API_URL, {
      params: {
        query: 'react typescript',
        'x-api-key': 'test-key'
      }
    });

    const items = response.data.items;
    for (let i = 1; i < items.length; i++) {
      expect(items[i-1].aiAnalysis.relevance).toBeGreaterThanOrEqual(items[i].aiAnalysis.relevance);
    }
  });

  // Test AI features metadata
  test('Response includes AI features metadata', async () => {
    const response = await axios.get(API_URL, {
      params: {
        query: 'react typescript',
        'x-api-key': 'test-key'
      }
    });

    expect(response.data.aiFeatures).toBeDefined();
    expect(response.data.aiFeatures.queryEnhancement).toBe(true);
    expect(response.data.aiFeatures.semanticAnalysis).toBe(true);
    expect(response.data.aiFeatures.relevanceScoring).toBe(true);
    expect(response.data.aiFeatures.categorization).toBe(true);
  });

  // Test error handling
  test('Handles API errors gracefully', async () => {
    try {
      await axios.get(API_URL, {
        params: {
          query: 'invalid query with special chars !@#$%',
          'x-api-key': 'test-key'
        }
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toBeDefined();
    }
  });
}); 