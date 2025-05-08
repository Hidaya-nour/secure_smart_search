import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const response = await axios.get('https://api.github.com/search/repositories', {
      params: {
        q: query,
        per_page: 10,
        sort: 'stars',
        order: 'desc'
      }
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('GitHub API error:', error);
    return res.status(500).json({ message: 'Error fetching repositories' });
  }
} 