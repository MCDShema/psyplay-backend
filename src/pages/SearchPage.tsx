import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { NewsCard } from "../components/NewsCard";
import { NewsArticle } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { TranslationService } from "../services/translation";
import { RSSService } from "../services/rss";

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const { currentLanguage, t } = useLanguage();

  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  const translationService = TranslationService.getInstance();
  const rssService = RSSService.getInstance();

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // 🔹 1. Отримуємо статті з бекенду
        const rawArticles = await rssService.fetchAllNews(currentLanguage.code);
        const articles = rawArticles.map((a) =>
          rssService.transformToNewsArticle(a, currentLanguage.code),
        );

        // 🔹 2. Фільтруємо по title, content, tags
        let results = articles.filter((article) => {
          const q = query.toLowerCase();

          return (
            article.title.toLowerCase().includes(q) ||
            article.content.toLowerCase().includes(q) ||
            (article.description &&
              article.description.toLowerCase().includes(q)) ||
            (article.excerpt && article.excerpt.toLowerCase().includes(q)) ||
            article.tags.some((tag: string) => tag.toLowerCase().includes(q))
          );
        });

        // 🔹 3. Переклад, якщо мова ≠ en
        const needsTranslation = results.some(
          (article) => article.language !== currentLanguage.code,
        );

        if (needsTranslation && results.length > 0) {
          results = await Promise.all(
            results.map((article) =>
              translationService.translateArticle(
                article,
                currentLanguage.code,
              ),
            ),
          );
        }

        setSearchResults(results);
      } catch (error) {
        console.error("❌ Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [query, currentLanguage.code, rssService, translationService]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-mocha-600 hover:text-mocha-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t("home")}</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("searchResults")}
          </h1>

          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mocha-500 focus:border-transparent text-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {query && (
          <div className="mb-8">
            <p className="text-gray-600">
              {isSearching
                ? `${t("loading")}...`
                : `${searchResults.length} ${t("resultsFound")} "${query}"`}
            </p>
          </div>
        )}

        {isSearching ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mocha-600"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((article) => (
              <NewsCard key={article.id} article={article} size="medium" />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t("noResults")}</p>
            <Link
              to="/"
              className="text-mocha-600 hover:text-mocha-700 font-medium"
            >
              {t("browseAll")}
            </Link>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t("enterSearchTerm")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
