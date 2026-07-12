import type { Industry, UseCase } from "@/types";

/**
 * Branchen & Aufgaben — die zwei Einstiegsachsen der „Entdecken"-Bibliothek.
 * Ein Nutzer kommt mit einem Problem und findet über Branche oder Aufgabe die
 * passenden Modelle & Agenten.
 */
export const INDUSTRIES: Industry[] = [
  { slug: "software", name: "Software & IT", icon: "Code", description: "Entwicklung, DevOps, Code-Reviews" },
  { slug: "marketing", name: "Marketing & Werbung", icon: "Megaphone", description: "Content, SEO, Kampagnen" },
  { slug: "legal", name: "Recht", icon: "Scale", description: "Verträge, Recherche, Compliance" },
  { slug: "health", name: "Gesundheit & Medizin", icon: "HeartPulse", description: "Dokumentation, Recherche, Diagnostik-Support" },
  { slug: "finance", name: "Finanzen", icon: "Landmark", description: "Analyse, Reporting, Buchhaltung" },
  { slug: "education", name: "Bildung", icon: "GraduationCap", description: "Lernen, Tutoring, Unterricht" },
  { slug: "design", name: "Design & Kreativ", icon: "Palette", description: "Bild, Video, UI, Branding" },
  { slug: "sales", name: "Vertrieb", icon: "TrendingUp", description: "Leads, Outreach, CRM" },
  { slug: "support", name: "Kundensupport", icon: "Headset", description: "Chatbots, Ticket-Automatisierung" },
  { slug: "hr", name: "Personal (HR)", icon: "Users", description: "Recruiting, Onboarding, Screening" },
  { slug: "research", name: "Forschung & Wissenschaft", icon: "FlaskConical", description: "Literatur, Analyse, Zusammenfassungen" },
  { slug: "ecommerce", name: "E-Commerce & Retail", icon: "ShoppingCart", description: "Produkttexte, Empfehlungen" },
  { slug: "media", name: "Medien & Content", icon: "Clapperboard", description: "Journalismus, Video, Podcast" },
  { slug: "realestate", name: "Immobilien", icon: "Building2", description: "Exposés, Bewertung, Leads" },
];

export const USE_CASES: UseCase[] = [
  { slug: "writing", name: "Texte schreiben", icon: "PenLine" },
  { slug: "coding", name: "Programmieren", icon: "Code" },
  { slug: "images", name: "Bilder erzeugen", icon: "Image" },
  { slug: "video", name: "Video", icon: "Video" },
  { slug: "audio", name: "Audio & Musik", icon: "Music" },
  { slug: "research", name: "Recherchieren", icon: "Search" },
  { slug: "data", name: "Daten analysieren", icon: "BarChart3" },
  { slug: "automation", name: "Automatisieren", icon: "Workflow" },
  { slug: "chat", name: "Assistent / Chat", icon: "MessageSquare" },
  { slug: "translation", name: "Übersetzen", icon: "Languages" },
  { slug: "support", name: "Kundensupport", icon: "Headset" },
  { slug: "presentation", name: "Präsentationen", icon: "Presentation" },
];

export const industryBySlug = (slug: string): Industry | undefined =>
  INDUSTRIES.find((i) => i.slug === slug);

export const useCaseBySlug = (slug: string): UseCase | undefined =>
  USE_CASES.find((u) => u.slug === slug);

/** Aufgabe → passende Modell-Modalität (für die Modell-Filterung in der Suche). */
export const TASK_TO_MODALITY: Record<string, string> = {
  writing: "text",
  coding: "code",
  images: "image",
  video: "video",
  audio: "music",
  research: "text",
  data: "text",
  automation: "text",
  chat: "text",
  translation: "text",
  support: "text",
  presentation: "text",
};
