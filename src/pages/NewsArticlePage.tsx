import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { NewsArticle } from "../types";
import { RSSService } from "../services/rss";
import { useLanguage } from "../context/LanguageContext";
import { normalizeImageUrl } from "../utils/normalizeImageUrl";

const SITE_URL = "https://psyplay.net";
const FALLBACK_IMAGE = `/images/Block.png`; // 👈 локальний fallback
const API_BASE =
  import.meta.env.VITE_API_URL || "https://cms.sub.mobi-smart.com";

const WIDTHS = [480, 720, 960, 1200, 1600];
const SIZES = "(min-width:1024px) 896px, 100vw";

export const NewsArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentLanguage, t } = useLanguage();
  const { pathname } = useLocation();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const rssService = RSSService.getInstance();

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const rawArticle = await rssService.fetchArticle(
          slug,
          currentLanguage.code,
        );
        if (!rawArticle) throw new Error("Article not found");
        const transformed = rssService.transformToNewsArticle(
          rawArticle,
          currentLanguage.code,
        );
        setArticle(transformed);
      } catch (err) {
        console.error("❌ Error loading article:", err);
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticle();
  }, [slug, currentLanguage.code, rssService]);

  if (isLoading) return <p className="text-center py-20">{t("loading")}...</p>;

  if (!article) {
    const notFoundUrl = `${SITE_URL}${pathname}`;
    return (
      <>
        <Helmet htmlAttributes={{ lang: currentLanguage.code }}>
          <title>Article not found – Psyplay</title>
          <meta name="robots" content="noindex,follow" />
          <link rel="canonical" href={notFoundUrl} />
        </Helmet>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <Link to="/" className="text-mocha-600 hover:text-mocha-700">
            {t("home")}
          </Link>
        </div>
      </>
    );
  }

  const canonicalUrl = `${SITE_URL}${pathname}`;
  const title = `${article.title} – Psyplay`;
  const desc =
    (article.excerpt && article.excerpt.slice(0, 155)) ||
    t("defaultArticleDescription") ||
    "Psyplay article";

  /// Фрагмент для визначення картинки
  const rawImage = normalizeImageUrl(
    article.imageUrl || FALLBACK_IMAGE,
    article.link,
  );

  // перевіряємо, чи зовнішня картинка
  const isExternal = /^https?:\/\//i.test(rawImage);

  // головне зображення
  const imgSrc = isExternal
    ? `${API_BASE}/image-proxy?url=${encodeURIComponent(rawImage)}`
    : rawImage; // 👉 напряму з фронтенду (наприклад /images/Block.png)

  // srcSet — лише для зовнішніх
  const imgSrcSet = isExternal
    ? WIDTHS.map(
        (w) =>
          `${API_BASE}/image-proxy?url=${encodeURIComponent(
            rawImage,
          )}&w=${w} ${w}w`,
      ).join(", ")
    : undefined;

  const imgSizes = SIZES;

  const authorName = article.author || "Psyplay Editors";
  const publishedISO = new Date(article.publishedAt).toISOString();
  const modifiedISO = new Date(
    article.updatedAt || article.publishedAt,
  ).toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: desc,
    image: [imgSrc],
    datePublished: publishedISO,
    dateModified: modifiedISO,
    author: { "@type": "Organization", name: "Psyplay" },
    mainEntityOfPage: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "Psyplay",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-512.png` },
    },
  };

  const formattedDate = new Intl.DateTimeFormat(currentLanguage.code, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(article.publishedAt));

  return (
    <>
      <Helmet htmlAttributes={{ lang: currentLanguage.code }}>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:image" content={imgSrc} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-mocha-600 hover:text-mocha-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("home")}</span>
        </Link>

        <img
          src={imgSrc}
          srcSet={imgSrcSet}
          sizes={imgSizes}
          alt={article.title}
          crossOrigin="anonymous"
          width={1200}
          height={675}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className="w-full h-auto mb-8 rounded-lg object-cover"
        />

        <h1 className="text-3xl font-bold mb-6">{article.title}</h1>

        <div className="flex space-x-6 text-gray-500 mb-8">
          <span className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </span>
          <span className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{authorName}</span>
          </span>
        </div>

        <div
          className="article-content prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.link && (
          <div className="mt-6">
            <span className="font-semibold">{t("source")}: </span>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mocha-600 hover:text-mocha-700 underline break-words"
            >
              {new URL(article.link).hostname.replace("www.", "")}
            </a>
          </div>
        )}
      </article>
    </>
  );
};
