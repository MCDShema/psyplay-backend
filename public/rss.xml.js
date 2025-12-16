import { getAllPosts } from "@/lib/posts"; // Функція, яка повертає всі твої статті

export async function GET() {
  const siteUrl = "https://твійсайт.com";

  const posts = await getAllPosts();

  const items = posts
    .map((post) => {
      return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${siteUrl}/posts/${post.slug}</link>
        <description><![CDATA[${post.excerpt || ""}]]></description>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      </item>
    `;
    })
    .join("");

  const rss = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Новини — ${siteUrl}</title>
        <link>${siteUrl}</link>
        <description>Оновлення сайту</description>
        ${items}
      </channel>
    </rss>
  `;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
