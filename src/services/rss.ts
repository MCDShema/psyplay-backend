export class RSSService {
  private static instance: RSSService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl =
      import.meta.env.VITE_API_URL || "https://cms.sub.mobi-smart.com";
  }

  static getInstance(): RSSService {
    if (!RSSService.instance) {
      RSSService.instance = new RSSService();
    }
    return RSSService.instance;
  }

  // ✅ Отримати всі новини з урахуванням мови
  async fetchAllNews(lang: string): Promise<any[]> {
    try {
      const res = await fetch(`${this.baseUrl}/news?lang=${lang}`);
      if (!res.ok) {
        console.error("Backend error:", res.statusText);
        return [];
      }
      const data = await res.json();
      return data.items || [];
    } catch (err) {
      console.error("Fetch news error:", err);
      return [];
    }
  }

  // ✅ Окрема стаття
  async fetchArticle(slug: string, lang: string): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/news/${slug}?lang=${lang}`);
      if (!res.ok) {
        console.error("Backend error:", res.statusText);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error("Fetch article error:", err);
      return null;
    }
  }

  transformToNewsArticle(article: any, langOverride?: string): any {
    return {
      id: article.id || article.guid,
      title: article.title, // ✅ вже з БД у потрібній мові
      content: article.content || article.description || "",
      excerpt:
        article.excerpt ||
        this.createExcerpt(article.description || article.content || ""),
      category: article.category || "other",
      tags: typeof article.tags === "string" ? article.tags.split(",") : [],
      publishedAt: article.pub_date
        ? new Date(article.pub_date).toISOString()
        : null,
      imageUrl:
        article.image_url && article.image_url.trim() !== ""
          ? article.image_url
          : "/images/Block.png",
      author: article.author || "other",
      slug: article.slug,
      featured: false,
      language: langOverride || article.lang || "en",
      updatedAt: article.updated_at || article.updatedAt || article.pub_date,
      link: article.link || "",
    };
  }

  private createExcerpt(c: string, max = 150) {
    const t = (c || "").replace(/<[^>]*>/g, "");
    return t.length > max ? t.substring(0, max) + "..." : t;
  }
}
