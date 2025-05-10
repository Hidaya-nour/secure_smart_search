# Secure & Smart Search Portal

A privacy-focused search engine for academic papers and research. Find relevant repositories with AI-powered search capabilities.

## Features

- 🔍 Advanced GitHub repository search
- 🤖 AI-powered query enhancement
- 🔒 Privacy-focused design
- 🌙 Dark mode support
- 📱 Responsive design
- ⚡ Fast and efficient search results
- 🎯 Smart filtering options

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **API Integration**: GitHub API
- **AI Integration**: OpenAI API
- **Authentication**: GitHub OAuth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- GitHub account
- OpenAI API key (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/secure-smart-search.git
   cd secure-smart-search
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   GITHUB_TOKEN=your_github_token
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | Yes |
| `OPENAI_API_KEY` | OpenAI API Key | No |

## API Routes

- `GET /api/search` - Search GitHub repositories
  - Query Parameters:
    - `query`: Search term
    - `language`: Filter by programming language
    - `minStars`: Minimum number of stars

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GitHub API](https://docs.github.com/en/rest)
- [OpenAI API](https://openai.com/api/)

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/secure-smart-search](https://github.com/yourusername/secure-smart-search)
