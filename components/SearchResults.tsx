import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { Repository } from '../types';
import AIFeatures from './AIFeatures';

interface SearchResultsProps {
  results: Repository[];
  isLoading: boolean;
}

const SearchResults = memo(function SearchResults({ results, isLoading }: SearchResultsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((repo) => (
        <div key={repo.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <img
              src={repo.owner.avatar_url}
              alt={`${repo.owner.login}'s avatar`}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repo.owner.login}/{repo.name}
                </a>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {repo.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    {repo.language}
                  </span>
                )}
              </div>
              
              {/* AI Analysis */}
              {repo.aiAnalysis && (
                <AIFeatures
                  isEnhanced={true}
                  aiAnalysis={repo.aiAnalysis}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default SearchResults; 