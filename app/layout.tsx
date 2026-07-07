import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "Modelist · Die Rangliste der KI-Modelle",
    template: "%s · Modelist",
  },
  description:
    "Modelist – performance-basiertes Vergleichssystem für KI-Modelle: Text, Code, Bild, Video, Musik & Research. Ranglisten, Steckbriefe, Prompt-Bibliothek und Blind-Test-Arena.",
  manifest: "/manifest.webmanifest",
  applicationName: "Modelist",
  appleWebApp: { capable: true, title: "Modelist", statusBarStyle: "default" },
  openGraph: {
    title: "Modelist · Die Rangliste der KI-Modelle",
    description: "Modelle rein nach Leistung gerankt. Kategorien, Steckbriefe & Prompt-Wikipedia.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Läuft vor dem ersten Paint → kein Aufblitzen des falschen Themes.
// Standard = Geräte-Einstellung; manuelle Wahl überschreibt via localStorage.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
