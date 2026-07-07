import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "AI-Vergleich · Die Rangliste der KI-Modelle",
    template: "%s · AI-Vergleich",
  },
  description:
    "Performance-basiertes Vergleichssystem für KI-Modelle – Text, Code, Bild, Video, Musik & Research. Ranglisten, Steckbriefe, Prompt-Bibliothek und Blind-Test-Arena.",
  manifest: "/manifest.webmanifest",
  applicationName: "AI-Vergleich",
  appleWebApp: { capable: true, title: "AI-Vergleich", statusBarStyle: "black-translucent" },
  openGraph: {
    title: "AI-Vergleich · Die Rangliste der KI-Modelle",
    description: "Modelle rein nach Leistung gerankt. Kategorien, Steckbriefe & Prompt-Wikipedia.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="dark">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
