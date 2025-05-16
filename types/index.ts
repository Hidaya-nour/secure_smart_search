export interface AIAnalysis {
  relevance: number;
  categories: string[];
  keyFeatures: string[];
}

export interface Repository {
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
  aiAnalysis?: AIAnalysis;
} 