import { Calendar, User } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const date = new Date(article.published_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 modern-gradient">{article.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{article.content}</p>
        <div className="flex items-center text-sm text-gray-500 gap-4">
          <div className="flex items-center gap-1">
            <User size={16} className="text-primary-blue" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} className="text-primary-purple" />
            <time>{date}</time>
          </div>
        </div>
      </div>
    </article>
  );
}