import { Translation } from "../types";

export const translations: Translation = {
  home: {
    en: "Home",
    uk: "Головна",
  },
  politics: {
    en: "Politics",
    uk: "Політика",
  },
  technology: {
    en: "Technology",
    uk: "Технології",
  },
  sports: {
    en: "Sports",
    uk: "Спорт",
  },
  business: {
    en: "Business",
    uk: "Бізнес",
  },
  health: {
    en: "Health",
    uk: "Здоров'я",
  },
  lessons: {
    en: "Lessons",
    uk: "Уроки",
  },
  search: {
    en: "Search news...",
    uk: "Пошук новин...",
  },
  latestNews: {
    en: "Latest News",
    uk: "Останні новини",
  },
  featuredNews: {
    en: "Featured News",
    uk: "Головні новини",
  },
  hotGossip: {
    en: "Hot Gossip",
    uk: "Гарячі новини",
  },
  readMore: {
    en: "Read More",
    uk: "Читати далі",
  },
  more: {
    en: "More",
    uk: "Усе про",
  },
  share: {
    en: "Share",
    uk: "Поділитися",
  },
  publishedOn: {
    en: "Published on",
    uk: "Опубліковано",
  },
  by: {
    en: "by",
    uk: "автор",
  },
  seeAll: {
    en: "See All",
    uk: "Дивитись всі",
  },
  noResults: {
    en: "No results found",
    uk: "Результатів не знайдено",
  },
  loading: {
    en: "Loading...",
    uk: "Завантаження...",
  },
};

export const getTranslation = (key: string, language: "en" | "uk"): string => {
  return translations[key]?.[language] || key;
};
