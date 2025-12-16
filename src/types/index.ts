export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: NewsCategory;
  tags: string[];
  publishedAt: string;
  imageUrl?: string;
  author: string;
  slug: string;
  featured: boolean;
  language: "en" | "uk";
  updatedAt?: string;
  link?: string; // ✅ додали
}

export type NewsCategory =
  | "psychology"
  | "politics"
  | "technology"
  | "sports"
  | "business"
  | "health"
  | "lessons"
  | "other"; // додали fallback

export interface Language {
  code: "en" | "uk";
  name: string;
  flag: string;
}

export interface Translation {
  [key: string]: {
    en: string;
    uk: string;
  };
}

export interface DirectusConfig {
  url: string;
  token?: string;
}
