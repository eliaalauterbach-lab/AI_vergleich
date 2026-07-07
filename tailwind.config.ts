import type { Config } from "tailwindcss";

/**
 * Dark-Mode-first Design-System.
 * Farbpalette bewusst reduziert: tiefes Neutral-Grau + ein Akzent (Indigo/Violet).
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hintergrund-Ebenen – theme-abhängig über CSS-Variablen
        base:    "rgb(var(--c-base) / <alpha-value>)",     // App-Hintergrund
        surface: "rgb(var(--c-surface) / <alpha-value>)",  // Karten
        elevate: "rgb(var(--c-elevate) / <alpha-value>)",  // Hover / erhöht
        border:  "rgb(var(--c-border) / <alpha-value>)",
        // Text
        muted:      "rgb(var(--c-muted) / <alpha-value>)",
        subtle:     "rgb(var(--c-subtle) / <alpha-value>)",
        foreground: "rgb(var(--c-foreground) / <alpha-value>)", // starke Überschriften
        // Akzent (Violett bleibt in beiden Themes gleich)
        accent: {
          DEFAULT: "#7c6cf4",
          soft:    "rgb(var(--c-accent-soft) / <alpha-value>)",
          dim:     "rgb(124 108 244 / 0.12)",
        },
        // Rang-Metallik
        gold:   "#e8b64c",
        silver: "#c2c7cf",
        bronze: "#cd8b5c",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
