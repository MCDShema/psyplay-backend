import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// Тексти
import { privacyPolicyEn } from "../content/privacyPolicy.en";
import { privacyPolicyUk } from "../content/privacyPolicy.uk";

export const PrivacyPolicyPage: React.FC = () => {
  const { currentLanguage, t } = useLanguage();

  const content =
    currentLanguage.code === "uk" ? privacyPolicyUk : privacyPolicyEn;

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-mocha-600 hover:text-mocha-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("home")}</span>
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">{t("privacyPolicy")}</h1>

      {/* Content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
};
