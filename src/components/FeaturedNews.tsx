// src/components/FeaturedNews.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { NewsArticle } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { normalizeImageUrl } from "../utils/normalizeImageUrl";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://cms.sub.mobi-smart.com";

export const FeaturedNews: React.FC<{ article: NewsArticle }> = ({
  article,
}) => {
  const { t } = useLanguage();

  // нормалізуємо URL
  const rawImage = normalizeImageUrl(
    article.imageUrl || "/images/Block.png",
    article.link,
  );

  // визначаємо, чи зовнішня
  const isExternal = /^https?:\/\//i.test(rawImage);

  // головне зображення
  const imgSrc = isExternal
    ? `${API_BASE}/image-proxy?url=${encodeURIComponent(rawImage)}`
    : rawImage; // напряму з фронтенду

  return (
    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden group border border-gray-100">
      <div className="md:flex">
        {/* Image */}
        <div className="md:w-1/2">
          <div className="h-64 md:h-96 overflow-hidden">
            <img
              src={imgSrc}
              alt={article.title}
              crossOrigin="anonymous"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* Category */}
          <div className="mb-4">
            <Link
              to={`/${article.category}`}
              className="inline-block px-4 py-2 text-sm font-semibold text-mocha-800 bg-mocha-100 rounded-full hover:bg-mocha-200 transition-colors"
            >
              {t(article.category)}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(article.publishedAt), "MMMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
          </div>

          {/* Read More */}
          <Link
            to={`/news/${article.slug}`}
            className="group/button inline-flex items-center gap-2 rounded-lg bg-mocha-600 px-6 py-3 !text-white hover:bg-mocha-700 hover:!text-white transition-colors no-underline"
          >
            <span className="font-medium !text-white">{t("readMore")}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/button:translate-x-1 !text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
};
