import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { Star, GitFork, ExternalLink } from 'lucide-react';

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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
        <article
          key={repo.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                  src={repo.owner.avatar_url}
                  alt={`${repo.owner.login}'s avatar`}
                  fill
                  sizes="48px"
                  className="object-cover"
                  loading="lazy"
                  quality={75}
                  onError={(e) => {
                    // Fallback to a default avatar if the image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(repo.owner.login)}&background=random`;
                  }}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {repo.owner.login}/{repo.name}
                  </a>
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Star className="w-4 h-4 mr-1" />
                    {repo.stargazers_count.toLocaleString()}
                  </span>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {repo.description || 'No description available'}
              </p>
              <div className="mt-2 flex items-center space-x-4">
                {repo.language && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {repo.language}
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
});

export default SearchResults; 