// src/utils/normalizeImageUrl.ts
export function normalizeImageUrl(url?: string, baseLink?: string): string {
  if (!url) return "/images/Block.png";

  let finalUrl = url.trim();
  try {
    // 🔹 WordPress CDN → прибираємо зайве
    if (finalUrl.includes("i0.wp.com") || finalUrl.includes("i1.wp.com")) {
      finalUrl = finalUrl.replace(/^https?:\/\/i\d\.wp\.com\//, "https://");
      finalUrl = finalUrl.split("?")[0];
    }

    // 🔹 якщо починається з /images → залишаємо як є (локальний шлях)
    if (finalUrl.startsWith("/images")) {
      return finalUrl;
    }

    // 🔹 якщо вже абсолютний http(s) URL → повертаємо як є
    if (/^https?:\/\//i.test(finalUrl)) {
      return finalUrl;
    }

    // 🔹 якщо відносний → перетворюємо в абсолютний
    return new URL(finalUrl, baseLink).href;
  } catch {
    return "/images/Block.png";
  }
}
