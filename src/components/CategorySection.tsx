import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { NewsCarousel } from "./NewsCarousel";
import { FeaturedNews } from "./FeaturedNews";
import { NewsArticle, NewsCategory } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface CategorySectionProps {
  category: NewsCategory;
  articles: NewsArticle[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  articles,
}) => {
  const { t } = useLanguage();

  // Вибираємо featured
  const featuredArticle = articles.find((article) => article.featured);

  // Беремо решту, обрізаємо до 6 і гарантуємо плаский масив
  const carouselArticles = articles
    .filter((article) => !article.featured)
    .slice(0, 6)
    .flatMap((a) => (Array.isArray(a) ? a : [a]));

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 capitalize">
          {t(category)}
        </h2>
        <Link
          to={`/${category}`}
          className="inline-flex items-center space-x-2 text-mocha-600 hover:text-mocha-700 font-medium transition-colors group"
        >
          <span>{t("seeAll")}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-12">
          <FeaturedNews article={featuredArticle} />
        </div>
      )}

      {/* Carousel */}
      {carouselArticles.length > 0 && (
        <NewsCarousel
          articles={carouselArticles}
          title={`${t("more")} ${t(category)}`}
        />
      )}
    </section>
  );
};
