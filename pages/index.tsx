import { useState } from 'react'; import Layout from '../components/Layout'; 
import SearchBar from '../components/SearchBar';
 import SearchResults from '../components/SearchResults'; 
 import axios from 'axios';

interface Repository { id: number; name: string;
   description: string; 
   owner: { login: string; avatar_url: string; }
   ; stargazers_count: number; html_url: string;
    language: string;
   }

export default function Home() {
   const [results, setResults] = useState<Repository[]>([]);
    const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

const handleSearch = async (query: string) => { setIsLoading(true); 
  setError(null);

try {
  const response = await axios.get('/api/search', {
    params: { query }
  });

  setResults(response.data.items || []);
} catch (err) {
  setError('Failed to fetch repositories. Please try again later.');
  console.error('Search error:', err);
} finally {
  setIsLoading(false);
}
};

return ( <Layout> <div className="max-w-4xl mx-auto"> <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8"> GitHub Repository Search </h1> <p className="text-center text-gray-600 dark:text-gray-400 mb-8"> Search through millions of GitHub repositories </p>

    <SearchBar onSearch={handleSearch} isLoading={isLoading} />

    {error && (
      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
        {error}
      </div>
    )}

    <SearchResults results={results} isLoading={isLoading} />
  </div>
</Layout>
); }