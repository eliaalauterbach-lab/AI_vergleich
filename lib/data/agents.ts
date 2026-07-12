import type { AgentSummary, AgentDetail, ProCon } from "@/types";

/**
 * Agenten-Verzeichnis: fertige KI-Tools/Assistenten auf Basis von Modellen.
 * Aktuell Demo-Daten; später aus Supabase (Tabelle `agents`) + Community-Beiträge.
 * `source: "custom"` ist für später selbst gebaute Agenten vorgesehen.
 */
export async function getAgents(filter?: {
  industry?: string;
  task?: string;
  type?: string;
}): Promise<AgentSummary[]> {
  let list = DEMO_AGENTS;
  if (filter?.industry) list = list.filter((a) => a.industries.includes(filter.industry!));
  if (filter?.task) list = list.filter((a) => a.tasks.includes(filter.task!));
  if (filter?.type) list = list.filter((a) => a.agent_type === filter.type);
  return [...list].sort((a, b) => b.rating_avg - a.rating_avg);
}

export async function getAgent(slug: string): Promise<AgentDetail | null> {
  return DEMO_AGENT_DETAILS[slug] ?? null;
}

export async function getAgentSlugs(): Promise<string[]> {
  return DEMO_AGENTS.map((a) => a.slug);
}

export async function getAgentTypes(): Promise<string[]> {
  return [...new Set(DEMO_AGENTS.map((a) => a.agent_type))];
}

// ---------------------------------------------------------------------------
// Demo-Daten
// ---------------------------------------------------------------------------
const A = (
  slug: string,
  name: string,
  tagline: string,
  agent_type: string,
  base_model: string,
  pricing: AgentSummary["pricing"],
  price_note: string,
  industries: string[],
  tasks: string[],
  rating_avg: number,
  rating_count: number,
  website_url: string
): AgentSummary => ({
  id: slug,
  slug,
  name,
  tagline,
  agent_type,
  base_model,
  pricing,
  price_note,
  industries,
  tasks,
  rating_avg,
  rating_count,
  website_url,
  logo_url: null,
  source: "tool",
});

export const DEMO_AGENTS: AgentSummary[] = [
  A("cursor", "Cursor", "KI-Code-Editor, der ganze Projekte versteht und umschreibt.",
    "Coding", "Claude / GPT", "freemium", "kostenlos, Pro ab $20/M",
    ["software"], ["coding", "automation"], 4.8, 1240, "https://cursor.com"),
  A("github-copilot", "GitHub Copilot", "Code-Vervollständigung & Chat direkt in der IDE.",
    "Coding", "GPT", "paid", "ab $10/M",
    ["software"], ["coding"], 4.5, 2100, "https://github.com/features/copilot"),
  A("perplexity", "Perplexity", "Antwort-Suchmaschine mit Quellen – Recherche in Sekunden.",
    "Research", "Mehrere", "freemium", "kostenlos, Pro ab $20/M",
    ["research", "legal", "finance", "media"], ["research", "chat"], 4.7, 3400, "https://perplexity.ai"),
  A("jasper", "Jasper", "Marketing-Copilot für Kampagnen, Blogs und Markenstimme.",
    "Marketing", "Mehrere", "paid", "ab $39/M",
    ["marketing", "ecommerce"], ["writing"], 4.2, 890, "https://jasper.ai"),
  A("harvey", "Harvey", "KI-Assistent für Juristen: Verträge, Recherche, Entwürfe.",
    "Legal", "GPT", "paid", "Enterprise",
    ["legal"], ["research", "writing"], 4.4, 210, "https://harvey.ai"),
  A("elicit", "Elicit", "Research-Assistent für wissenschaftliche Literatur.",
    "Research", "Mehrere", "freemium", "kostenlos, Plus ab $12/M",
    ["research", "health", "education"], ["research", "data"], 4.5, 560, "https://elicit.com"),
  A("gamma", "Gamma", "Erstellt Präsentationen & Dokumente aus einem Stichwort.",
    "Productivity", "Mehrere", "freemium", "kostenlos, Pro ab $10/M",
    ["marketing", "education", "sales"], ["presentation", "writing"], 4.4, 1120, "https://gamma.app"),
  A("intercom-fin", "Intercom Fin", "KI-Support-Agent, der Kundenanfragen autonom löst.",
    "Support", "Claude", "paid", "pro Lösung abgerechnet",
    ["support", "ecommerce", "software"], ["support", "automation"], 4.3, 470, "https://intercom.com/fin"),
  A("devin", "Devin", "Autonomer Software-Engineer-Agent für ganze Tickets.",
    "Coding", "Eigen", "paid", "ab $500/M",
    ["software"], ["coding", "automation"], 4.0, 180, "https://devin.ai"),
  A("notion-ai", "Notion AI", "Schreib- & Wissens-Assistent direkt im Arbeitsbereich.",
    "Productivity", "Mehrere", "freemium", "ab $10/M je Nutzer",
    ["marketing", "hr", "sales", "education"], ["writing", "chat"], 4.3, 1560, "https://notion.so/product/ai"),
  A("midjourney-tool", "Midjourney", "Hochwertige Bildgenerierung für Design & Kreativ.",
    "Design", "Eigen", "paid", "ab $10/M",
    ["design", "marketing", "media"], ["images"], 4.6, 4200, "https://midjourney.com"),
  A("synthesia", "Synthesia", "KI-Avatar-Videos aus Text – für Schulung & Marketing.",
    "Design", "Eigen", "paid", "ab $18/M",
    ["media", "education", "marketing"], ["video"], 4.2, 730, "https://synthesia.io"),
];

function detail(
  s: AgentSummary,
  description: string,
  pros: string[],
  cons: string[],
  integrations: string[]
): AgentDetail {
  const pros_cons: ProCon[] = [
    ...pros.map((text) => ({ kind: "pro" as const, text })),
    ...cons.map((text) => ({ kind: "con" as const, text })),
  ];
  return { ...s, description, pros_cons, integrations };
}

const bySlug = (slug: string) => DEMO_AGENTS.find((a) => a.slug === slug)!;

export const DEMO_AGENT_DETAILS: Record<string, AgentDetail> = {
  cursor: detail(
    bySlug("cursor"),
    "Cursor ist ein KI-nativer Code-Editor (Fork von VS Code), der den gesamten Projektkontext versteht. Er kann über mehrere Dateien hinweg umschreiben, Fehler beheben und ganze Features nach einer Beschreibung generieren – auf Basis führender Modelle wie Claude und GPT.",
    ["Versteht das ganze Projekt, nicht nur einzelne Dateien", "Sehr schnelle Multi-Datei-Änderungen", "Vertraute VS-Code-Oberfläche", "Wählbares Basis-Modell"],
    ["Beste Funktionen nur im Pro-Tarif", "Cloud-Verarbeitung – für sehr sensiblen Code prüfen"],
    ["VS Code", "GitHub", "Terminal", "Model-APIs"]
  ),
  perplexity: detail(
    bySlug("perplexity"),
    "Perplexity kombiniert Websuche mit KI-Antworten und liefert zu jeder Aussage Quellen. Ideal für schnelle, belegte Recherche in Beruf und Studium – deutlich verlässlicher als reine Chatbots ohne Quellen.",
    ["Antworten mit nachprüfbaren Quellen", "Immer aktuelle Web-Informationen", "Guter kostenloser Tarif", "Fokus-Modi für Akademik, Finanzen etc."],
    ["Für sehr lange Analysen weniger geeignet", "Pro nötig für stärkste Modelle"],
    ["Web", "iOS/Android", "Chrome-Extension", "API"]
  ),
  jasper: detail(
    bySlug("jasper"),
    "Jasper ist ein Marketing-fokussierter KI-Assistent mit Markenstimme, Vorlagen und Kampagnen-Workflows. Teams nutzen ihn für konsistente Inhalte über Blog, Social und Ads hinweg.",
    ["Markenstimme über alle Inhalte konsistent", "Viele Marketing-Vorlagen", "Team-Funktionen & Workflows"],
    ["Vergleichsweise teuer", "Für Einzelpersonen oft Overkill"],
    ["Browser", "Chrome-Extension", "Surfer SEO", "API"]
  ),
  harvey: detail(
    bySlug("harvey"),
    "Harvey ist ein spezialisierter KI-Assistent für Kanzleien und Rechtsabteilungen: Vertragsanalyse, juristische Recherche und Entwurfserstellung – mit Fokus auf Genauigkeit und Vertraulichkeit.",
    ["Auf juristische Aufgaben trainiert", "Hohe Vertraulichkeitsstandards", "Spart Stunden bei Vertragsarbeit"],
    ["Nur als Enterprise erhältlich", "Kein Selbstbedienungs-Tarif"],
    ["Word", "iManage", "SharePoint"]
  ),
  gamma: detail(
    bySlug("gamma"),
    "Gamma erstellt aus einem Stichwort oder einer Gliederung fertige, ansprechende Präsentationen, Dokumente und Websites – inklusive Design. Spart enorm Zeit bei Pitches und Reports.",
    ["Präsentation in Minuten statt Stunden", "Automatisches, gutes Design", "Export als PPT/PDF"],
    ["Feinschliff manchmal nötig", "Weniger Kontrolle als klassische Tools"],
    ["Web", "PowerPoint-Export", "PDF"]
  ),
  "midjourney-tool": detail(
    bySlug("midjourney-tool"),
    "Midjourney erzeugt einige der hochwertigsten KI-Bilder für Design, Werbung und Kreativprojekte. Bekannt für seinen ästhetischen, stimmungsvollen Stil.",
    ["Herausragende Bildqualität & Ästhetik", "Große kreative Kontrolle über Parameter", "Aktive Community mit Inspiration"],
    ["Bedienung anfangs gewöhnungsbedürftig", "Kein kostenloser Tarif"],
    ["Discord", "Web-App"]
  ),
};

/** Fallback-Detail aus der Summary bauen, falls kein ausführlicher Text existiert. */
export async function getAgentOrFallback(slug: string): Promise<AgentDetail | null> {
  const full = DEMO_AGENT_DETAILS[slug];
  if (full) return full;
  const s = DEMO_AGENTS.find((a) => a.slug === slug);
  if (!s) return null;
  return { ...s, description: s.tagline, pros_cons: [], integrations: [] };
}
