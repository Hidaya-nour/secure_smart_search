import { useState } from 'react';

interface SearchFiltersProps {
  onFilterChange: (filters: { language: string; minStars: string }) => void;
}

const popularLanguages = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'C#'
];

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [language, setLanguage] = useState('');
  const [minStars, setMinStars] = useState('');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    onFilterChange({ language: newLanguage, minStars });
  };

  const handleStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinStars = e.target.value;
    setMinStars(newMinStars);
    onFilterChange({ language, minStars: newMinStars });
  };

  return (
    <div 
      className="flex flex-wrap gap-4 mt-4"
      role="group"
      aria-label="Search filters"
    >
      <div className="flex-1 min-w-[200px]">
        <label 
          htmlFor="language" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Programming Language
        </label>
        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          className="w-full px-3 py-1.9 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          aria-label="Filter by programming language"
        >
          <option value="">Any Language</option>
          {popularLanguages.map((lang) => (
            <option key={lang} value={lang.toLowerCase()}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label 
          htmlFor="minStars" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Minimum Stars
        </label>
        <input
          type="number"
          id="minStars"
          value={minStars}
          onChange={handleStarsChange}
          placeholder="e.g., 1000"
          min="0"
          className="w-full px-3 py-1.9 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          aria-label="Filter by minimum number of stars"
        />
      </div>
    </div>
  );
} 