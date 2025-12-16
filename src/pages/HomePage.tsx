import React, { useState, useEffect } from "react";
import { FeaturedNews } from "../components/FeaturedNews";
import { HotNews } from "../components/HotNews";
import { CategorySection } from "../components/CategorySection";
import { NewsArticle, NewsCategory } from "../types";
import { RSSService } from "../services/rss";
import { useLanguage } from "../context/LanguageContext";

export const HomePage: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const rssService = RSSService.getInstance();

  const categories: NewsCategory[] = [
    "psychology",
    "technology",
    "sports",
    "business",
    "health",
    "lessons",
    "politics",
    "other",
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const rawArticles = await rssService.fetchAllNews(currentLanguage.code);
        const articles = rawArticles.map((a) =>
          rssService.transformToNewsArticle(a, currentLanguage.code),
        );
        setNews(articles);
      } catch (err) {
        console.error("Error loading news:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [currentLanguage.code]);

  const featuredNews =
    news.filter((a) => a.featured).length > 0
      ? news.filter((a) => a.featured)
      : news.length > 0
        ? [news[0]]
        : [];

  const latestNews = news
    .filter((a) => !featuredNews.some((f) => f.id === a.id))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 8);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mocha-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mocha-50 to-mocha-100 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-mocha-800 mb-4">
              {t("psychologyNews")}
            </h1>
            <p className="text-xl text-mocha-600 max-w-3xl mx-auto">
              {t("topNewsSlogan")}
            </p>
          </div>

          {featuredNews.length > 0 && (
            <div className="mb-12">
              <FeaturedNews article={featuredNews[0]} />
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Categories */}
          <div className="lg:col-span-2 space-y-16">
            {categories.map((category) => {
              const categoryNews = news.filter(
                (article) => article.category === category,
              );
              if (categoryNews.length === 0) return null;

              return (
                <CategorySection
                  key={category}
                  category={category}
                  articles={categoryNews}
                />
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <HotNews articles={latestNews} />
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("latestNews")}
              </h2>
              <div className="space-y-4">
                {latestNews.slice(0, 5).map((article) => (
                  <div
                    key={article.id}
                    className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                  >
                    <h3 className="font-semibold text-gray-900 hover:text-mocha-600 transition-colors mb-2 line-clamp-2">
                      <a href={`/news/${article.slug}`}>{article.title}</a>
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()} •{" "}
                      {article.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
