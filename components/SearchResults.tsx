import { FiExternalLink, FiStar } from 'react-icons/fi';

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

export default function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="mt-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Searching repositories...</p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
        No repositories found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {results.map((repo) => (
        <article
          key={repo.id}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-2">
            <img
              src={repo.owner.avatar_url}
              alt={`${repo.owner.login}'s avatar`}
              className="w-8 h-8 rounded-full"
            />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {repo.name}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {repo.description || 'No description available'}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
              {repo.owner.login}
            </span>
            {repo.language && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                {repo.language}
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 flex items-center">
              <FiStar className="mr-1" />
              {repo.stargazers_count.toLocaleString()}
            </span>
          </div>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <FiExternalLink className="mr-1" />
            View Repository
          </a>
        </article>
      ))}
    </div>
  );
} 