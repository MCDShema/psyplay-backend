// src/pages/CategoryPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Filter } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { NewsCard } from "../components/NewsCard";
import { NewsArticle } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { TranslationService } from "../services/translation";
import { RSSService } from "../services/rss";
import { cn } from "../utils/cn";
import { normalizeImageUrl } from "../utils/normalizeImageUrl";

const SITE_URL = "https://psyplay.net";
const ARTICLES_PER_PAGE = 9;
const API_BASE =
  import.meta.env.VITE_API_URL || "https://cms.sub.mobi-smart.com";

const WIDTHS = [360, 540, 720, 960, 1200];
const SIZES = "(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw";

export const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { currentLanguage, t } = useLanguage();
  const { pathname } = useLocation();

  const [baseNews, setBaseNews] = useState<NewsArticle[]>([]);
  const [translatedNews, setTranslatedNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const sortSelectAriaLabel =
    currentLanguage.code === "uk" ? "Сортувати статті" : "Sort articles";

  const translationService = TranslationService.getInstance();
  const rssService = RSSService.getInstance();

  // 1) тягнемо і перетворюємо без перекладу
  useEffect(() => {
    let alive = true;
    if (!category) return;
    (async () => {
      setIsLoading(true);
      try {
        const raw = await rssService.fetchAllNews(currentLanguage.code);
        const all = raw.map((a) =>
          rssService.transformToNewsArticle(a, currentLanguage.code),
        );
        const filtered = all.filter((a) => a.category === category);
        if (!alive) return;
        setBaseNews(filtered);
        setTranslatedNews(filtered);
        setCurrentPage(1);
      } catch (e) {
        console.error("Category fetch error:", e);
        if (alive) {
          setBaseNews([]);
          setTranslatedNews([]);
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [category, currentLanguage.code, rssService]);

  // сортування
  const sortedNews = useMemo(() => {
    const src = currentLanguage.code === "en" ? baseNews : translatedNews;
    const copy = [...src];
    if (sortBy === "date") {
      copy.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
    } else {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    }
    return copy;
  }, [baseNews, translatedNews, currentLanguage.code, sortBy]);

  // пагінація
  const totalPages = Math.ceil(sortedNews.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedNews = sortedNews.slice(
    startIndex,
    startIndex + ARTICLES_PER_PAGE,
  );

  // 2) перекладаємо лише видиму сторінку
  useEffect(() => {
    if (paginatedNews.length === 0) return;

    const needsTranslation = paginatedNews.some(
      (article) => article.language !== currentLanguage.code,
    );

    if (!needsTranslation) return;

    let alive = true;
    (async () => {
      try {
        const translatedSlice = await Promise.all(
          paginatedNews.map((a) =>
            translationService.translateArticle(a, currentLanguage.code),
          ),
        );
        if (!alive) return;
        const map = new Map(translatedSlice.map((a) => [a.id, a]));
        setTranslatedNews((prev) => {
          const base = prev.length ? prev : baseNews;
          return base.map((a) => map.get(a.id) ?? a);
        });
      } catch (e) {
        console.error("translation page slice error", e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [baseNews, currentLanguage.code, paginatedNews, translationService]);

  // LCP-картинка — перша в гріді (preload через той самий проксі та ті ж розміри)
  const firstImageRaw = normalizeImageUrl(
    paginatedNews[0]?.imageUrl || "/images/Block.png",
    paginatedNews[0]?.link,
  );
  const isExternalFirst = /^https?:\/\//i.test(firstImageRaw);
  const lcpSrc = isExternalFirst
    ? `${API_BASE}/image-proxy?url=${encodeURIComponent(firstImageRaw)}`
    : firstImageRaw;
  const lcpSrcSet = isExternalFirst
    ? WIDTHS.map(
        (w) =>
          `${API_BASE}/image-proxy?url=${encodeURIComponent(
            firstImageRaw,
          )}&w=${w} ${w}w`,
      ).join(", ")
    : undefined;

  // канонікал/тексти
  const canonicalUrl = `${SITE_URL}${pathname}`;
  const isEmpty = !isLoading && paginatedNews.length === 0;
  const categoryName = t(category || "");
  const pageTitle = `${categoryName} – Psyplay`;
  const pageDesc = isEmpty
    ? `${categoryName}: ${t("categoryPreparing") || "розділ готується"}`
    : `${categoryName}: ${t("categoryIntro") || "останні статті, огляди та новини."}`;

  // хост для preconnect/dns-prefetch
  const lcpHost = (() => {
    try {
      return lcpSrc ? new URL(lcpSrc).origin : null;
    } catch {
      return null;
    }
  })();

  if (isLoading) {
    return (
      <>
        <Helmet htmlAttributes={{ lang: currentLanguage.code }}>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <link rel="canonical" href={canonicalUrl} />
          {/* попередньо встановлюємо з’єднання */}
          {lcpHost && <link rel="preconnect" href={lcpHost} crossOrigin="" />}
          {lcpHost && <link rel="dns-prefetch" href={lcpHost} />}
        </Helmet>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mocha-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("loading")}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet htmlAttributes={{ lang: currentLanguage.code }}>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        {isEmpty && <meta name="robots" content="noindex,follow" />}

        {/* правильний preload */}
        {lcpSrc && (
          <link
            rel="preload"
            as="image"
            href={lcpSrc}
            imageSrcSet={lcpSrcSet}
            imageSizes={SIZES}
            crossOrigin="anonymous"
          />
        )}

        {/* швидкі з’єднання */}
        {lcpHost && (
          <link rel="preconnect" href={lcpHost} crossOrigin="anonymous" />
        )}
        {lcpHost && <link rel="dns-prefetch" href={lcpHost} />}
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-mocha-600 to-mocha-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-mocha-100 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>{t("home")}</span>
              </Link>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold capitalize mb-2">
              {categoryName}
            </h1>
            <p className="text-mocha-100 text-lg">
              {t("categoryPage")} {categoryName}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "title")}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mocha-500 focus:border-transparent"
                aria-label={sortSelectAriaLabel}
              >
                <option value="date">{t("sortByDate")} </option>
                <option value="title">{t("sortByTitle")} </option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {sortedNews.length} {t("articlesFound")}
            </div>
          </div>

          {/* News Grid */}
          {paginatedNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedNews.map((article, idx) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  size="medium"
                  isLCP={idx === 0} // перша картка = LCP
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t("noResults")}</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-white text-gray-700 hover:bg-mocha-50 border border-gray-300 disabled:opacity-50"
              >
                ←
              </button>

              {(() => {
                const items: (number | string)[] = [];
                items.push(1);
                if (currentPage > 2) items.push("…");
                if (currentPage > 1 && currentPage < totalPages)
                  items.push(currentPage);
                if (currentPage + 1 < totalPages) items.push(currentPage + 1);
                if (currentPage < totalPages - 2) items.push("…");
                if (totalPages > 1) items.push(totalPages);
                return items.map((p, idx) =>
                  p === "…" ? (
                    <span
                      key={`dots-${idx}`}
                      className="px-2 text-gray-400 select-none"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={`p-${p}`}
                      onClick={() => setCurrentPage(p as number)}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-colors",
                        currentPage === p
                          ? "bg-mocha-600 text-white"
                          : "bg-white text-gray-700 hover:bg-mocha-50 border border-gray-300",
                      )}
                    >
                      {p}
                    </button>
                  ),
                );
              })()}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-white text-gray-700 hover:bg-mocha-50 border border-gray-300 disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
