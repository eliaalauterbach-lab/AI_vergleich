/**
 * Redaktionelle Inhalte je Branche für die Landingpages (/branchen/[slug]).
 * Agenten & Modelle werden automatisch aus den Daten gezogen; hier stehen der
 * einleitende Text, „So hilft KI"-Punkte, typische Aufgaben und die passende
 * Prompt-Kategorie.
 */
export interface IndustryContent {
  intro: string;
  highlights: string[];
  taskSlugs: string[];
  promptCategory: string | null;
}

export const INDUSTRY_CONTENT: Record<string, IndustryContent> = {
  software: {
    intro:
      "KI hat die Softwareentwicklung grundlegend verändert: von intelligenter Code-Vervollständigung über automatische Reviews bis zu autonomen Agenten, die ganze Tickets abarbeiten. Die richtigen Werkzeuge beschleunigen dein Team spürbar.",
    highlights: [
      "Code schneller schreiben mit KI-Editoren und Autovervollständigung",
      "Automatische Code-Reviews und Bug-Erkennung",
      "Autonome Agenten für Routine-Aufgaben und Refactoring",
    ],
    taskSlugs: ["coding", "automation", "data"],
    promptCategory: "code",
  },
  marketing: {
    intro:
      "Von der ersten Kampagnenidee bis zum fertigen Post: KI erstellt Inhalte in Markenstimme, optimiert für SEO und skaliert die Produktion über alle Kanäle. So bleibt mehr Zeit für Strategie.",
    highlights: [
      "Content in Markenstimme für Blog, Social und Ads",
      "SEO-optimierte Texte und Gliederungen in Minuten",
      "Bilder und Videos für Kampagnen ohne Design-Team",
    ],
    taskSlugs: ["writing", "images", "presentation"],
    promptCategory: "marketing",
  },
  legal: {
    intro:
      "Juristische Arbeit heißt lesen, prüfen, formulieren – genau hier spart KI Stunden: Vertragsanalyse, Recherche mit Quellen und erste Entwürfe. Wichtig sind Genauigkeit und Vertraulichkeit.",
    highlights: [
      "Verträge und Dokumente schnell analysieren",
      "Rechtsrecherche mit nachprüfbaren Quellen",
      "Entwürfe und Schriftsätze vorbereiten",
    ],
    taskSlugs: ["research", "writing"],
    promptCategory: "research",
  },
  health: {
    intro:
      "Im Gesundheitswesen unterstützt KI vor allem bei Dokumentation, Recherche und der Aufbereitung von Fachwissen – als Assistenz, nicht als Ersatz für ärztliche Entscheidungen.",
    highlights: [
      "Dokumentation und Berichte schneller erstellen",
      "Aktuelle Fachliteratur zusammenfassen",
      "Patientenkommunikation verständlich formulieren",
    ],
    taskSlugs: ["research", "writing", "chat"],
    promptCategory: "research",
  },
  finance: {
    intro:
      "Zahlen verstehen und erklären: KI analysiert Berichte, fasst Marktdaten zusammen und automatisiert wiederkehrende Auswertungen – schneller und mit weniger Fehlern.",
    highlights: [
      "Finanzberichte und Daten analysieren",
      "Markt- und Research-Zusammenfassungen",
      "Wiederkehrende Reportings automatisieren",
    ],
    taskSlugs: ["data", "research", "automation"],
    promptCategory: "research",
  },
  education: {
    intro:
      "KI wird zum persönlichen Tutor und zur Vorbereitungshilfe: Lerninhalte erklären, Übungen erstellen, Feedback geben – individuell auf Niveau und Tempo abgestimmt.",
    highlights: [
      "Konzepte einfach und auf Niveau erklären",
      "Übungen, Quizze und Materialien erstellen",
      "Persönliches Feedback und Tutoring",
    ],
    taskSlugs: ["chat", "writing", "presentation"],
    promptCategory: "text",
  },
  design: {
    intro:
      "Von der Idee zum Bild in Sekunden: KI erzeugt Grafiken, Moodboards, Videos und UI-Entwürfe – ein kreativer Verstärker für Design- und Kreativteams.",
    highlights: [
      "Hochwertige Bilder und Illustrationen erzeugen",
      "Moodboards und Konzepte schnell visualisieren",
      "Video und Motion ohne großes Team",
    ],
    taskSlugs: ["images", "video"],
    promptCategory: "image",
  },
  sales: {
    intro:
      "Mehr Zeit für Gespräche, weniger für Fleißarbeit: KI recherchiert Leads, personalisiert Outreach und hält das CRM sauber – so steigt die Schlagzahl.",
    highlights: [
      "Leads recherchieren und qualifizieren",
      "Personalisierte Outreach-Nachrichten",
      "CRM-Pflege und Follow-ups automatisieren",
    ],
    taskSlugs: ["writing", "automation", "research"],
    promptCategory: "marketing",
  },
  support: {
    intro:
      "Kundensupport rund um die Uhr: KI-Agenten beantworten wiederkehrende Anfragen selbstständig, schlagen Antworten vor und entlasten das Team für die kniffligen Fälle.",
    highlights: [
      "Wiederkehrende Anfragen autonom lösen",
      "Antwortvorschläge für Support-Teams",
      "Tickets automatisch kategorisieren und weiterleiten",
    ],
    taskSlugs: ["support", "chat", "automation"],
    promptCategory: "text",
  },
  hr: {
    intro:
      "Von der Stellenausschreibung bis zum Onboarding: KI beschleunigt Recruiting, screent Bewerbungen vor und beantwortet Mitarbeiterfragen – fair und konsistent.",
    highlights: [
      "Stellenanzeigen und Job-Texte erstellen",
      "Bewerbungen vorstrukturieren und sichten",
      "Onboarding- und Mitarbeiterfragen beantworten",
    ],
    taskSlugs: ["writing", "chat"],
    promptCategory: "text",
  },
  research: {
    intro:
      "Wissen schneller erschließen: KI durchsucht Literatur, fasst Papers zusammen und hilft, Ergebnisse einzuordnen – mit Quellen, damit du prüfen kannst.",
    highlights: [
      "Wissenschaftliche Literatur durchsuchen",
      "Papers strukturiert zusammenfassen",
      "Daten und Ergebnisse einordnen",
    ],
    taskSlugs: ["research", "data"],
    promptCategory: "research",
  },
  ecommerce: {
    intro:
      "Mehr verkaufen mit weniger Aufwand: KI schreibt Produkttexte, erstellt Bilder und personalisiert Empfehlungen – skalierbar über tausende Artikel.",
    highlights: [
      "Produktbeschreibungen in Serie erstellen",
      "Produktbilder und Varianten generieren",
      "Personalisierte Empfehlungen und Support",
    ],
    taskSlugs: ["writing", "images", "support"],
    promptCategory: "marketing",
  },
  media: {
    intro:
      "Content-Produktion im großen Stil: KI unterstützt bei Recherche, Text, Video und Audio – von der Idee bis zum fertigen Beitrag.",
    highlights: [
      "Recherche und Faktensammlung beschleunigen",
      "Video- und Audio-Content erstellen",
      "Beiträge für verschiedene Kanäle anpassen",
    ],
    taskSlugs: ["writing", "video", "audio"],
    promptCategory: "text",
  },
  realestate: {
    intro:
      "Objekte schneller vermarkten: KI schreibt Exposés, unterstützt bei Bewertungen und qualifiziert Anfragen – mehr Abschlüsse mit weniger Aufwand.",
    highlights: [
      "Ansprechende Exposés und Objekttexte",
      "Anfragen automatisch beantworten und qualifizieren",
      "Marktdaten und Bewertungen aufbereiten",
    ],
    taskSlugs: ["writing", "automation", "data"],
    promptCategory: "marketing",
  },
};
