// vite.config.ts
import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";
import { visualizer } from "rollup-plugin-visualizer";

const HOSTNAME = "https://psyplay.net";

const NAV_PATHS: string[] = [
  "/",
  "/psychology",
  "/technology",
  "/sports",
  "/business",
  "/health",
  "/lessons",
  "/politics",
  "/other",
  "/privacy-policy",
  "/news/",
];

export default defineConfig(({ command }) => ({
  plugins: [
    react(),

    // Sitemap + robots.txt
    Sitemap({
      hostname: HOSTNAME,
      dynamicRoutes: NAV_PATHS,
      exclude: ["/admin", "/private"],
      generateRobotsTxt: false,
      robots: [{ userAgent: "*", allow: "/" }],
    }),

    // Опційно: ANALYZE=1 npm run build → dist/stats.html
    process.env.ANALYZE
      ? (visualizer({
          filename: "dist/stats.html",
          gzipSize: true,
          brotliSize: true,
          open: false,
        }) as unknown as PluginOption)
      : undefined,
  ].filter(Boolean),

  define: {
    __APP_VERSION__: JSON.stringify(new Date().toISOString()),
  },

  server: {
    port: 4000,
  },

  build: {
    outDir: "./dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("lucide-react")) return "icons";
            return "vendor";
          }
        },
      },
    },
  },
}));
