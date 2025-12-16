import React from "react";
import { Link } from "react-router-dom";
import { LogoPsyPlay } from "../svg/LogoPsyPlay";
import { useLanguage } from "../context/LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const navigation = [
    { name: t("psychology"), href: "/psychology", key: "psychology" },
    { name: t("technology"), href: "/technology", key: "technology" },
    { name: t("sports"), href: "/sports", key: "sports" },
    { name: t("business"), href: "/business", key: "business" },
    { name: t("health"), href: "/health", key: "health" },
    { name: t("lessons"), href: "/lessons", key: "lessons" },
  ];

  return (
    <footer className="bg-mocha-800 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            {/* Logo як в хедері */}
            <Link
              to="/"
              className="flex items-center space-x-2 flex-shrink-0 mb-4"
            >
              <LogoPsyPlay className="w-10 h-10 sm:w-12 sm:h-12" />
              <span className="text-lg sm:text-xl font-bold text-white whitespace-nowrap">
                {t("psychologyNews")}
              </span>
            </Link>

            <p className="text-mocha-200">{t("footerSlogan")}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("categories")}</h3>
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className="block text-mocha-200 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("about")}</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-mocha-200 hover:text-white transition-colors"
              >
                {t("aboutUs")}
              </a>
              <a
                href="#"
                className="block text-mocha-200 hover:text-white transition-colors"
              >
                {t("contact")}
              </a>
              <a
                href="/privacy-policy"
                className="block text-mocha-200 hover:text-white transition-colors"
              >
                {t("privacyPolicy")}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-mocha-700 mt-8 pt-8 text-center text-mocha-200">
          <p>&copy; 2025 Psychology News. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
