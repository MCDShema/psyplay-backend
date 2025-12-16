// tailwind.config.js
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./src/node_modules/**",
  ],

  // 👇 гарантуємо, що потрібні утиліти не виріжуться під час білду
  safelist: [
    "flex",
    "inline-flex",
    "items-center",
    "justify-between",
    "justify-center",
    "gap-1",
    "gap-2",
    "gap-3",
    "gap-4",
    "sm:flex",
    "md:flex",
    "lg:flex",
    "xl:flex",
    "2xl:flex",
    "aspect-video",
    "aspect-square",
    "aspect-[16/9]",
  ],

  theme: {
    extend: {
      colors: {
        mocha: {
          50: "#fdfcfb",
          100: "#f4eae3",
          200: "#e8d5c7",
          300: "#dbbfa9",
          400: "#c99f7d",
          500: "#b27c52",
          600: "#9a643d",
          700: "#7d4e30",
          800: "#5f3922",
          900: "#3e2414",
        },
      },
    },
  },

  // 🛡️ щоб tailwind-утиліти мали пріоритет над стороннім CSS
  important: "#root",

  plugins: [typography, aspectRatio],
};
