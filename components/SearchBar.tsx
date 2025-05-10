import { useState, FormEvent } from 'react';
import { FiSearch } from 'react-icons/fi';
import { validateSearchQuery } from '../src/utils/security';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validatedQuery = validateSearchQuery(query);
    if (validatedQuery) {
      onSearch(validatedQuery);
    } else {
      setError('Invalid search query. Please check your input and try again.');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl mx-auto"
      role="search"
      aria-label="GitHub repository search"
    >
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          Search GitHub repositories
        </label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError(null);
          }}
          placeholder="Search GitHub repositories..."
          className={`w-full px-4 py-3 pl-12 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border ${
            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-colors duration-200`}
          aria-label="Search GitHub repositories"
          aria-busy={isLoading}
          aria-invalid={!!error}
          aria-describedby={error ? 'search-error' : undefined}
          disabled={isLoading}
          required
          minLength={1}
          maxLength={100}
        />
        <FiSearch 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          aria-hidden="true"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
          disabled={isLoading}
          aria-label={isLoading ? 'Searching...' : 'Search repositories'}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && (
        <p 
          id="search-error" 
          className="mt-2 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
} 