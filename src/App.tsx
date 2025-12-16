import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { NewsArticlePage } from "./pages/NewsArticlePage";
import { SearchPage } from "./pages/SearchPage";
import { Footer } from "./components/Footer";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { initGA, logPageView, logEvent } from "./utils/analytics";
import { saveUTMParams, getUTMParams } from "./utils/utmTracker";

// === Відстеження переходів між сторінками + UTM ===
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initGA(); // ініціалізуємо GA один раз
  }, []);

  useEffect(() => {
    saveUTMParams();
    logPageView(location.pathname + location.search);

    // === Автоматичне визначення кампанії ===
    let campaign = "general";
    if (location.pathname === "/") {
      campaign = "homepage";
    } else if (location.pathname.startsWith("/news/")) {
      const slug = location.pathname.split("/news/")[1];
      campaign = `news-${slug}`;
    } else if (
      location.pathname !== "/search" &&
      location.pathname !== "/privacy-policy"
    ) {
      // беремо назву категорії (без "/")
      campaign = location.pathname.replace("/", "") || "homepage";
    }

    const utm = getUTMParams() || {};
    logEvent("Traffic", "UTM Source", utm.utm_source || "direct");
    logEvent("Traffic", "UTM Medium", utm.utm_medium || "none");
    logEvent("Traffic", "UTM Campaign", utm.utm_campaign || campaign);
  }, [location]);

  return null;
}

function AppContent() {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:category" element={<CategoryPage />} />
        <Route path="/news/:slug" element={<NewsArticlePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AnalyticsTracker />
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;
