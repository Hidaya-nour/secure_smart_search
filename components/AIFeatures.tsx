import { Sparkles } from 'lucide-react';

interface AIAnalysis {
  relevance: number;
  categories: string[];
  keyFeatures: string[];
}

interface AIFeaturesProps {
  enhancedQuery?: string;
  isEnhanced?: boolean;
  aiAnalysis?: AIAnalysis;
}

export default function AIFeatures({ enhancedQuery, isEnhanced, aiAnalysis }: AIFeaturesProps) {
  if (!isEnhanced || !aiAnalysis) return null;

  // Only show if we have meaningful categories or features
  const hasMeaningfulContent = 
    (aiAnalysis.categories.length > 0 && aiAnalysis.categories.some(c => c.length > 0)) ||
    (aiAnalysis.keyFeatures.length > 0 && aiAnalysis.keyFeatures.some(f => f.length > 0));

  if (!hasMeaningfulContent) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {aiAnalysis.categories.map((category, index) => (
        <span
          key={`category-${index}`}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
        >
          {category}
        </span>
      ))}
      {aiAnalysis.keyFeatures.map((feature, index) => (
        <span
          key={`feature-${index}`}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
        >
          {feature}
        </span>
      ))}
    </div>
  );
} 