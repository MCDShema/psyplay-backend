import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewsCard } from "./NewsCard";
import { NewsArticle } from "../types";
import { cn } from "../utils/cn";

interface NewsCarouselProps {
  articles: NewsArticle[];
  title: string;
  className?: string;
}

export const NewsCarousel: React.FC<NewsCarouselProps> = ({
  articles,
  title,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1280) setItemsPerView(2);
      else setItemsPerView(3);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const visibleItems = Math.min(itemsPerView, articles.length);
  const maxIndex = Math.max(0, articles.length - visibleItems);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const goToPrevious = () => setCurrentIndex(Math.max(0, currentIndex - 1));
  const goToNext = () => setCurrentIndex(Math.min(maxIndex, currentIndex + 1));

  // свайп
  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStartX(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    setTouchEndX(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) (diff > 0 ? goToNext : goToPrevious)();
    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (articles.length === 0) return null;

  // одна висота слайду (трохи менша, щоб тінь не впиралась у край)
  const slideHeight = "h-[400px] md:h-[420px] xl:h-[400px]";

  // ширина одного слайду у % від в’юпорта
  const itemBasis = useMemo(() => 100 / visibleItems, [visibleItems]);

  return (
    <div className={cn("relative", className)}>
      {/* Заголовок + кнопки */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {articles.length > visibleItems && (
          <div className="flex space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg border border-gray-300 hover:bg-mocha-50 hover:border-mocha-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className="p-2 rounded-lg border border-gray-300 hover:bg-mocha-50 hover:border-mocha-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* В’юпорт: обрізаємо лише по X, додаємо вертикальний відступ для тіні */}
      <div
        className="overflow-x-hidden py-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Трек: рухаємо рівно на 100/visibleItems % за крок */}
        <div
          className="flex transition-transform duration-300 ease-in-out will-change-transform"
          style={{ transform: `translateX(-${currentIndex * itemBasis}%)` }}
        >
          {articles.map((article) => (
            <div
              key={article.id}
              // слайд: не обрізаємо по осях (щоб тінь була видима), даємо внутрішні гаттери
              className={cn("flex-shrink-0 px-3 overflow-visible", slideHeight)}
              style={{
                flexBasis: `${itemBasis}%`,
                maxWidth: `${itemBasis}%`,
              }}
            >
              {/* картка заповнює слайд по висоті, тінь не зрізана завдяки px-3/py-2 в контейнері */}
              <NewsCard
                article={article}
                size="medium"
                className="w-full max-w-none h-full flex flex-col"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Індикатори */}
      {articles.length > visibleItems && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentIndex ? "bg-mocha-600" : "bg-gray-300",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
