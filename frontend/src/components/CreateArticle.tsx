import { useState } from 'react';
import { Send } from 'lucide-react';
import { Article } from '../types';

interface CreateArticleProps {
  onArticleCreated: (article: Article) => void;
}

export function CreateArticle({ onArticleCreated }: CreateArticleProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const article = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      author: formData.get('author') as string,
      published_date: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:8000/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });

      if (!response.ok) throw new Error('Failed to create article');

      onArticleCreated(article);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error creating article:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 modern-gradient">Create New Article</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input-field w-full"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            required
            className="input-field w-full"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            required
            className="input-field w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white 
                   bg-gradient-to-r from-primary-purple to-primary-blue hover:opacity-90 
                   focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <Send size={16} className="mr-2" />
          {isSubmitting ? 'Publishing...' : 'Publish Article'}
        </button>
      </div>
    </form>
  );
}