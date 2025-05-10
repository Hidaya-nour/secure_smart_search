import { useState } from 'react';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import SearchFilters from '../components/SearchFilters';
import axios from 'axios';
import { GithubIcon, SearchIcon, AlertCircle } from 'lucide-react';

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
}

interface SearchResponse {
  items: Repository[];
  total_count: number;
  originalQuery: string;
  enhancedQuery: string;
  isEnhanced: boolean;
}

export default function Home() {
  const [results, setResults] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ language: '', minStars: '' });
  const [hasSearched, setHasSearched] = useState(false);
  const [searchInfo, setSearchInfo] = useState<{ original: string; enhanced: string; isEnhanced: boolean } | null>(null);

  const handleSearch = async (query: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchInfo(null);

    try {
      const searchParams = {
        query,
        ...(filters.language ? { language: filters.language } : {}),
        ...(filters.minStars ? { minStars: filters.minStars } : {})
      };

      const response = await axios.get<SearchResponse>('/api/search', {
        params: searchParams
      });

      if (!response.data || !Array.isArray(response.data.items)) {
        throw new Error('Invalid response format from server');
      }

      setResults(response.data.items);
      setSearchInfo({
        original: response.data.originalQuery,
        enhanced: response.data.enhancedQuery,
        isEnhanced: response.data.isEnhanced
      });
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to fetch repositories. Please try again later.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: { language: string; minStars: string }) => {
    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
                <GithubIcon className="h-8 w-8 text-gray-900 dark:text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              GitHub Repository Search
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Discover millions of open source projects across the GitHub ecosystem
            </p>

            {/* Search Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4 transition-all duration-200 hover:shadow-xl">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              <div className="mt-3">
                <SearchFilters onFilterChange={handleFilterChange} />
              </div>
            </div>

            {/* Search Info */}
            {searchInfo && (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {searchInfo.isEnhanced ? (
                  <p>
                    Enhanced search: <span className="font-medium">{searchInfo.enhanced}</span>
                  </p>
                ) : (
                  <p>
                    Search query: <span className="font-medium">{searchInfo.original}</span>
                  </p>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 py-4 px-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {!hasSearched && !isLoading && (
              <div className="text-center py-8">
                <SearchIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search for GitHub repositories
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter keywords above to find repositories
                </p>
              </div>
            )}
            
            <SearchResults results={results} isLoading={isLoading} />
            
            {hasSearched && results.length === 0 && !isLoading && !error && (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No repositories found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try different keywords or adjust your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}