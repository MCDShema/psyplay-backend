import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { NewsArticle } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HotNewsProps {
  articles: NewsArticle[];
}

export const HotNews: React.FC<HotNewsProps> = ({ articles }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-mocha-50 to-orange-50 rounded-2xl p-8 border border-mocha-100">
      <div className="flex items-center space-x-2 mb-6">
        <Flame className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">{t('hotGossip')}</h2>
      </div>

      <div className="space-y-4">
        {articles.slice(0, 5).map((article, index) => (
          <Link
            key={article.id}
            to={`/news/${article.slug}`}
            className="block group"
          >
            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200">
              {/* Index */}
              <div className="flex-shrink-0 w-8 h-8 bg-mocha-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-mocha-600 transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h3>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(article.publishedAt), 'MMM dd')}</span>
                  </div>
                  <span className="px-2 py-1 bg-mocha-100 text-mocha-800 rounded">
                    {t(article.category)}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};