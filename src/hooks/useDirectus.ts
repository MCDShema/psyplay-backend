import { useState, useEffect } from 'react';
import { directusService } from '../services/directus';
import { NewsArticle } from '../types';

export const useDirectusNews = (category?: string) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await directusService.getNews(category);
        setNews(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  return { news, loading, error, refetch: () => fetchNews };
};

export const useDirectusSearch = (query: string) => {
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchNews = async () => {
      try {
        setLoading(true);
        const data = await directusService.searchNews(query);
        setResults(data);
        setError(null);
      } catch (err) {
        setError('Failed to search news');
        console.error('Error searching news:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchNews, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, loading, error };
};