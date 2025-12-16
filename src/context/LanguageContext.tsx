import React, { createContext, useContext, useState, ReactNode } from "react";
import { Language } from "../types";

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
];

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0],
  );

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem("preferred-language", language.code);
  };

  const t = (key: string): string => {
    const translations = {
      about: { en: "About", uk: "Про нас" },
      aboutUs: { en: "About Us", uk: "Сторінка про нас" },
      articlesFound: { en: "articles found", uk: "знайдені статті" },
      contact: { en: "Contact", uk: "Контакти" },
      categories: { en: "Categories", uk: "Категорії" },
      privacyPolicy: { en: "Privacy Policy", uk: "Політика конфіденційності" },
      home: { en: "Home", uk: "Головна" },
      politics: { en: "Politics", uk: "Політика" },
      technology: { en: "Technology", uk: "Технології" },
      sports: { en: "Sports", uk: "Спорт" },
      business: { en: "Business", uk: "Бізнес" },
      health: { en: "Health", uk: "Здоров'я" },
      lessons: { en: "Lessons", uk: "Уроки" },
      search: { en: "Search news...", uk: "Пошук новин..." },
      psychology: { en: "Psychology", uk: "Психологія" },
      other: { en: "Other", uk: "Інше" },
      latestNews: { en: "Latest News", uk: "Останні новини" },
      featuredNews: { en: "Featured News", uk: "Головні новини" },
      hotGossip: { en: "Hot Gossip", uk: "Гарячі новини" },
      readMore: { en: "Read More", uk: "Читати далі" },
      share: { en: "Share", uk: "Поділитися" },
      sortByDate: { en: "Sort by Date", uk: "По Даті" },
      sortByTitle: { en: "Sort by Title", uk: "По Назві" },
      publishedOn: { en: "Published on", uk: "Опубліковано" },
      more: { en: "More", uk: "Усі новини" },
      by: { en: "by", uk: "автор" },
      seeAll: { en: "See All", uk: "Дивитись всі" },
      noResults: { en: "No results found", uk: "Результатів не знайдено" },
      loading: { en: "Loading...", uk: "Завантаження..." },
      psychologyNews: { en: "Psychology News", uk: "Психологічні новини" },
      searchPlaceholder: { en: "Search articles...", uk: "Шукати статті..." },
      searchResults: { en: "Search Results", uk: "Результати пошуку" },
      // Великий текст
      footerSlogan: {
        en: "Your trusted source for psychology news, research, and insights from around the world.",
        uk: "Ваше надійне джерело новин, досліджень та ідей з психології з усього світу.",
      },
      categoryPage: {
        en: "Latest articles and insights in",
        uk: "Найновіші статті та аналітичні матеріали в",
      },
      topNewsSlogan: {
        en: "Discover the latest insights in psychology, mental health, and human behavior",
        uk: "Відкрийте для себе найновіші дослідження в галузі психології, психічного здоров'я та людської поведінки",
      },
    };

    return (
      translations[key as keyof typeof translations]?.[currentLanguage.code] ||
      key
    );
  };

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language");
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { languages };
