import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, Tag } from "lucide-react";
import { NewsArticle } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { cn } from "../utils/cn";
import { logEvent } from "../utils/analytics";
import { normalizeImageUrl } from "../utils/normalizeImageUrl";

interface NewsCardProps {
  article: NewsArticle;
  size?: "small" | "medium" | "large";
  className?: string;
  isLCP?: boolean;
}

// API базовий URL
const API_BASE =
  import.meta.env.VITE_API_URL || "https://cms.sub.mobi-smart.com";

// розміри для srcSet
const WIDTHS = [360, 540, 720, 960, 1200];
const SIZES = "(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw";

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  size = "medium",
  className,
  isLCP = false,
}) => {
  const { t, currentLanguage } = useLanguage();

  const handleReadMoreClick = () => {
    logEvent("News", "Read More Click", article.slug);
  };

  // нормалізуємо URL
  const rawImage = normalizeImageUrl(article.imageUrl, article.link);

  // перевіряємо чи зовнішня
  const isExternal = /^https?:\/\//i.test(rawImage);

  // головне зображення
  const imgSrc = isExternal
    ? `${API_BASE}/image-proxy?url=${encodeURIComponent(rawImage)}`
    : rawImage; // якщо локальне — напряму

  // srcSet (для зовнішніх)
  const imgSrcSet = isExternal
    ? WIDTHS.map(
        (w) =>
          `${API_BASE}/image-proxy?url=${encodeURIComponent(
            rawImage,
          )}&w=${w} ${w}w`,
      ).join(", ")
    : undefined; // якщо локальне — не використовуємо srcSet

  // для <img> width/height
  const baseW = 800;
  const baseH = 450;

  const formattedDate = new Intl.DateTimeFormat(currentLanguage.code, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(article.publishedAt));

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 w-full",
        className,
      )}
    >
      {rawImage && (
        <div className="relative overflow-hidden bg-gray-100 aspect-[16/9]">
          <img
            src={imgSrc}
            srcSet={imgSrcSet}
            sizes={SIZES}
            alt={article.title}
            crossOrigin="anonymous"
            width={baseW}
            height={baseH}
            decoding="async"
            loading={isLCP ? "eager" : "lazy"}
            // @ts-expect-error підтримується у браузерах
            fetchpriority={isLCP ? "high" : "auto"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-mocha-800 bg-mocha-100 rounded-full">
            {t(article.category)}
          </span>
        </div>

        {/* Title */}
        <Link to={`/news/${article.slug}`} onClick={handleReadMoreClick}>
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-mocha-600 transition-colors">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
              >
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{article.author}</span>
            </div>
          </div>

          <Link
            to={`/news/${article.slug}`}
            onClick={handleReadMoreClick}
            className="text-mocha-600 hover:text-mocha-700 font-medium transition-colors"
          >
            {t("readMore")}
          </Link>
        </div>
      </div>
    </div>
  );
};
