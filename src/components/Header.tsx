import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Globe, Menu, X } from "lucide-react";
import { useLanguage, languages } from "../context/LanguageContext";
import { cn } from "../utils/cn";
import { LogoPsyPlay } from "../svg/LogoPsyPlay";
import { logEvent } from "../utils/analytics"; // ✅ додаємо GA events

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  React.useEffect(() => {
    console.log("App version:", __APP_VERSION__);
  }, []);
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const navigation = [
    { name: t("home"), href: "/", key: "home" },
    { name: t("psychology"), href: "/psychology", key: "psychology" },
    { name: t("technology"), href: "/technology", key: "technology" },
    { name: t("sports"), href: "/sports", key: "sports" },
    { name: t("business"), href: "/business", key: "business" },
    { name: t("health"), href: "/health", key: "health" },
    { name: t("lessons"), href: "/lessons", key: "lessons" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      logEvent("Search", "Search Query", searchQuery); // ✅ GA event
      onSearch(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const handleCategoryClick = (key: string) => {
    logEvent("Navigation", "Category Click", key); // ✅ GA event
  };

  const handleLanguageChange = (code: string, name: string) => {
    logEvent("Settings", "Language Change", code); // ✅ GA event
    setLanguage({
      code,
      name,
      flag: languages.find((l) => l.code === code)?.flag || "🌐",
    });
    setIsLanguageMenuOpen(false);
    setIsMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <LogoPsyPlay className="w-10 h-10 sm:w-12 sm:h-12" />
            <span className="text-lg sm:text-xl font-bold text-mocha-800 whitespace-nowrap">
              {t("psychologyNews")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                onClick={() => handleCategoryClick(item.key)} // ✅ логування
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-mocha-600",
                  isActive(item.href)
                    ? "text-mocha-800 border-b-2 border-mocha-600 pb-1"
                    : "text-gray-700",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search and Language */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mocha-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-4 h-4 text-mocha-600" />
                <span className="text-sm font-medium">
                  {currentLanguage.flag}
                </span>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() =>
                        handleLanguageChange(language.code, language.name)
                      }
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2",
                        currentLanguage.code === language.code &&
                          "bg-mocha-50 text-mocha-800",
                      )}
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  onClick={() => {
                    handleCategoryClick(item.key);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-mocha-100 text-mocha-800"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4 relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mocha-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>

            {/* Mobile Language Switcher */}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Language:</p>
              <div className="flex space-x-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() =>
                      handleLanguageChange(language.code, language.name)
                    }
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2",
                      currentLanguage.code === language.code
                        ? "bg-mocha-100 text-mocha-800"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Close language menu when clicking outside */}
      {isLanguageMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsLanguageMenuOpen(false)}
        />
      )}
    </header>
  );
};
