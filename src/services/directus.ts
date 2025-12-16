import { DirectusConfig, NewsArticle } from '../types';

class DirectusService {
  private config: DirectusConfig;

  constructor(config: DirectusConfig) {
    this.config = config;
  }

  async getNews(category?: string): Promise<NewsArticle[]> {
    try {
      const url = new URL(`${this.config.url}/items/news`);
      if (category) {
        url.searchParams.set('filter[category][_eq]', category);
      }
      url.searchParams.set('sort', '-date_created');
      url.searchParams.set('limit', '50');

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (this.config.token) {
        headers['Authorization'] = `Bearer ${this.config.token}`;
      }

      const response = await fetch(url.toString(), { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return this.transformDirectusData(data.data || []);
    } catch (error) {
      console.error('Error fetching news from Directus:', error);
      return [];
    }
  }

  async getNewsById(id: string): Promise<NewsArticle | null> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (this.config.token) {
        headers['Authorization'] = `Bearer ${this.config.token}`;
      }

      const response = await fetch(`${this.config.url}/items/news/${id}`, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return this.transformDirectusData([data.data])[0] || null;
    } catch (error) {
      console.error('Error fetching news by ID from Directus:', error);
      return null;
    }
  }

  async searchNews(query: string): Promise<NewsArticle[]> {
    try {
      const url = new URL(`${this.config.url}/items/news`);
      url.searchParams.set('search', query);
      url.searchParams.set('limit', '30');

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (this.config.token) {
        headers['Authorization'] = `Bearer ${this.config.token}`;
      }

      const response = await fetch(url.toString(), { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return this.transformDirectusData(data.data || []);
    } catch (error) {
      console.error('Error searching news in Directus:', error);
      return [];
    }
  }

  async createNews(article: Partial<NewsArticle>): Promise<NewsArticle | null> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (this.config.token) {
        headers['Authorization'] = `Bearer ${this.config.token}`;
      }

      const response = await fetch(`${this.config.url}/items/news`, {
        method: 'POST',
        headers,
        body: JSON.stringify(this.transformToDirectusFormat(article))
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return this.transformDirectusData([data.data])[0] || null;
    } catch (error) {
      console.error('Error creating news in Directus:', error);
      return null;
    }
  }

  private transformDirectusData(items: any[]): NewsArticle[] {
    return items.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      excerpt: item.excerpt || this.createExcerpt(item.content),
      category: item.category,
      tags: item.tags || [],
      publishedAt: item.date_created || item.published_at,
      imageUrl: item.image ? `${this.config.url}/assets/${item.image}` : undefined,
      author: item.author || 'Unknown',
      slug: item.slug || this.createSlug(item.title),
      featured: item.featured || false,
      language: item.language || 'en'
    }));
  }

  private transformToDirectusFormat(article: Partial<NewsArticle>): any {
    return {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags,
      author: article.author,
      slug: article.slug,
      featured: article.featured,
      language: article.language,
      status: 'published'
    };
  }

  private createExcerpt(content: string, maxLength: number = 150): string {
    const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

// Initialize Directus service
const directusConfig: DirectusConfig = {
  url: import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055',
  token: import.meta.env.VITE_DIRECTUS_TOKEN
};

export const directusService = new DirectusService(directusConfig);