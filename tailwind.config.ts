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
        // Hintergrund-Ebenen (edel, schlicht)
        base:    "#0a0a0b",   // App-Hintergrund
        surface: "#141416",   // Karten
        elevate: "#1c1c20",   // Hover / erhöhte Elemente
        border:  "#26262b",
        // Text
        muted:   "#8a8a94",
        subtle:  "#b4b4be",
        // Akzent
        accent: {
          DEFAULT: "#7c6cf4",
          soft:    "#a99bff",
          dim:     "rgba(124,108,244,0.12)",
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
