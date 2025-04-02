import { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';
import { Article } from './types';
import { ArticleCard } from './components/ArticleCard';
import { CreateArticle } from './components/CreateArticle';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const response = await fetch('http://localhost:8000/news');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      setError('Failed to load articles. Please try again later.');
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleArticleCreated(newArticle: Article) {
    setArticles(prev => [newArticle, ...prev]);
  }

  return (
    <div className="min-h-screen bg-light-50">
      <header className="glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-primary-blue animate-float" />
            <h1 className="text-3xl font-bold modern-gradient">Modern News</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section>
              <h2 className="text-2xl font-bold mb-6 modern-gradient">Latest Articles</h2>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-blue border-t-transparent mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading articles...</p>
                </div>
              ) : error ? (
                <div className="glass-card rounded-xl p-4 text-red-600 border-red-200">
                  {error}
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No articles yet. Be the first to publish!
                </div>
              ) : (
                <div className="space-y-6">
                  {articles.map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-1">
            <CreateArticle onArticleCreated={handleArticleCreated} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App