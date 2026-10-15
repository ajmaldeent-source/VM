import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#070b14", 900: "#0b1220", 800: "#121a2b", 700: "#1c2740" },
        safety: { 400: "#ff8a3d", 500: "#ff6a00", 600: "#e05a00" },
        volt: { 400: "#4cc3ff", 500: "#1aa7ff" },
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-arabic)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "var(--font-arabic)", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: { marquee: "marquee 40s linear infinite" },
    },
  },
  plugins: [],
};

export default config;
