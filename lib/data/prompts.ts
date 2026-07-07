import type { PromptSummary, PromptDetail, PromptCategory } from "@/types";

function hasSupabase() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Prompt-Bibliothek: Liste (optional nach Kategorie gefiltert),
 * sortiert nach Score. Demo-Fallback ohne DB.
 */
export async function getPrompts(category?: string): Promise<PromptSummary[]> {
  if (!hasSupabase()) {
    const all = DEMO_PROMPTS.filter((p) => !category || p.category_slug === category);
    return [...all].sort((a, b) => b.score - a.score);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();

  let query = supabase
    .from("prompts")
    .select("id, slug, title, description, upvotes, fork_count, score, tags, created_at, category:categories(slug, name), author:profiles(username)")
    .eq("status", "published")
    .order("score", { ascending: false });

  if (category) query = query.eq("category.slug", category);

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map(mapSummary);
}

export async function getPromptCategories(): Promise<PromptCategory[]> {
  if (!hasSupabase()) {
    const counts = new Map<string, PromptCategory>();
    for (const p of DEMO_PROMPTS) {
      if (!p.category_slug || !p.category_name) continue;
      const entry = counts.get(p.category_slug) ?? {
        slug: p.category_slug,
        name: p.category_name,
        count: 0,
      };
      entry.count++;
      counts.set(p.category_slug, entry);
    }
    return [...counts.values()].sort((a, b) => b.count - a.count);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();
  const { data } = await supabase.rpc("prompt_category_counts");
  return (data ?? []) as PromptCategory[];
}

export async function getPrompt(slug: string): Promise<PromptDetail | null> {
  if (!hasSupabase()) {
    return DEMO_PROMPT_DETAILS[slug] ?? null;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("id, slug, title, description, body, upvotes, fork_count, score, tags, created_at, category:categories(slug, name), author:profiles(username), recommended:models(slug, name), forked:prompts!forked_from_id(slug, title)")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  const d = data as any;
  return {
    ...mapSummary(d),
    body: d.body,
    recommended_model_slug: d.recommended?.slug ?? null,
    recommended_model_name: d.recommended?.name ?? null,
    forked_from_slug: d.forked?.slug ?? null,
    forked_from_title: d.forked?.title ?? null,
  };
}

export async function getAllPromptSlugs(): Promise<string[]> {
  if (!hasSupabase()) return DEMO_PROMPTS.map((p) => p.slug);
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();
  const { data } = await supabase.from("prompts").select("slug").eq("status", "published");
  return (data ?? []).map((r) => r.slug as string);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSummary(d: any): PromptSummary {
  return {
    id: d.id,
    slug: d.slug,
    title: d.title,
    description: d.description,
    category_slug: d.category?.slug ?? null,
    category_name: d.category?.name ?? null,
    author_name: d.author?.username ?? null,
    upvotes: d.upvotes ?? 0,
    fork_count: d.fork_count ?? 0,
    score: d.score ?? 0,
    tags: d.tags ?? [],
    created_at: d.created_at,
  };
}

// ---------------------------------------------------------------------------
// Demo-Daten
// ---------------------------------------------------------------------------
const P = (
  slug: string,
  title: string,
  category_slug: string,
  category_name: string,
  description: string,
  upvotes: number,
  fork_count: number,
  tags: string[],
  author = "promptsmith"
): PromptSummary => ({
  id: slug,
  slug,
  title,
  description,
  category_slug,
  category_name,
  author_name: author,
  upvotes,
  fork_count,
  score: upvotes,
  tags,
  created_at: "2026-06-01T00:00:00Z",
});

export const DEMO_PROMPTS: PromptSummary[] = [
  P("senior-code-reviewer", "Senior Code-Reviewer", "code", "Code",
    "Lässt das Modell wie ein erfahrener Reviewer präzises, umsetzbares Feedback zu deinem Code geben.",
    342, 28, ["review", "engineering", "qualität"]),
  P("stichpunkte-zu-email", "Stichpunkte → professionelle E-Mail", "marketing", "Marketing",
    "Verwandelt lose Stichpunkte in eine klar strukturierte, höfliche Geschäfts-E-Mail.",
    289, 41, ["e-mail", "business", "schreiben"]),
  P("code-reviewer-security", "Code-Reviewer mit Security-Fokus", "code", "Code",
    "Fork des Senior Code-Reviewers – priorisiert Sicherheitslücken und Angriffsvektoren.",
    197, 6, ["review", "security", "engineering"], "sec_dev"),
  P("blog-outline-seo", "SEO-Blog-Gliederung", "marketing", "Marketing",
    "Erzeugt eine SEO-optimierte Gliederung inkl. Keywords, H2/H3 und Meta-Beschreibung.",
    256, 19, ["seo", "content", "blog"]),
  P("research-summarizer", "Wissenschaftliche Paper zusammenfassen", "research", "Research",
    "Fasst ein Paper in Kernaussage, Methode, Ergebnissen und Limitationen zusammen.",
    221, 15, ["research", "zusammenfassung", "wissenschaft"]),
  P("sql-erklaerer", "SQL-Query erklären & optimieren", "code", "Code",
    "Erklärt eine komplexe SQL-Abfrage Schritt für Schritt und schlägt Optimierungen vor.",
    178, 9, ["sql", "datenbank", "optimierung"]),
  P("bildprompt-fotorealistisch", "Fotorealistischer Bild-Prompt", "image", "Bild",
    "Baut aus einer simplen Idee einen detaillierten Prompt für fotorealistische Bildgeneratoren.",
    203, 22, ["bild", "kreativ", "midjourney"]),
  P("interview-vorbereitung", "Interview-Vorbereitung als Coach", "text", "Text",
    "Das Modell agiert als Karriere-Coach und simuliert ein Bewerbungsgespräch mit Feedback.",
    164, 11, ["karriere", "coaching", "gespräch"]),
];

const body = (s: string) => s.trim();

function detail(
  summary: PromptSummary,
  b: string,
  extras: Partial<PromptDetail> = {}
): PromptDetail {
  return {
    ...summary,
    body: body(b),
    recommended_model_slug: extras.recommended_model_slug ?? null,
    recommended_model_name: extras.recommended_model_name ?? null,
    forked_from_slug: extras.forked_from_slug ?? null,
    forked_from_title: extras.forked_from_title ?? null,
  };
}

const bySlug = (slug: string) => DEMO_PROMPTS.find((p) => p.slug === slug)!;

export const DEMO_PROMPT_DETAILS: Record<string, PromptDetail> = {
  "senior-code-reviewer": detail(
    bySlug("senior-code-reviewer"),
    `Du bist ein erfahrener Senior-Software-Engineer mit 15 Jahren Erfahrung.
Reviewe den folgenden Code. Gehe dabei vor wie in einem echten Pull-Request-Review:

1. Nenne zuerst die drei wichtigsten Probleme (Priorität: Korrektheit > Sicherheit > Lesbarkeit).
2. Gib zu jedem Punkt ein konkretes Code-Beispiel für die Verbesserung.
3. Schließe mit einem kurzen Gesamturteil (Merge / Änderungen nötig / Ablehnen).

Sei direkt und konkret, keine Floskeln.

Code:
"""
{HIER CODE EINFÜGEN}
"""`,
    { recommended_model_slug: "claude-opus", recommended_model_name: "Claude Opus" }
  ),
  "code-reviewer-security": detail(
    bySlug("code-reviewer-security"),
    `Du bist ein erfahrener Security-Engineer und Code-Auditor.
Reviewe den folgenden Code mit klarem Fokus auf Sicherheit:

1. Identifiziere alle potenziellen Sicherheitslücken (Injection, Auth, Secrets, Deserialisierung ...).
2. Bewerte jede Lücke nach Schweregrad (kritisch / hoch / mittel / niedrig).
3. Gib für jede Lücke einen konkreten Fix mit Code-Beispiel an.
4. Erst danach: allgemeine Qualitäts-Hinweise.

Code:
"""
{HIER CODE EINFÜGEN}
"""`,
    {
      recommended_model_slug: "claude-opus",
      recommended_model_name: "Claude Opus",
      forked_from_slug: "senior-code-reviewer",
      forked_from_title: "Senior Code-Reviewer",
    }
  ),
  "stichpunkte-zu-email": detail(
    bySlug("stichpunkte-zu-email"),
    `Formuliere aus den folgenden Stichpunkten eine professionelle, höfliche Geschäfts-E-Mail auf Deutsch.

Vorgaben:
- Tonfall: freundlich, aber verbindlich.
- Struktur: Betreff, Anrede, Kernanliegen, klarer Call-to-Action, Grußformel.
- Maximal 150 Wörter.

Stichpunkte:
- {STICHPUNKT 1}
- {STICHPUNKT 2}
- {STICHPUNKT 3}`
  ),
  "blog-outline-seo": detail(
    bySlug("blog-outline-seo"),
    `Erstelle eine SEO-optimierte Gliederung für einen Blogartikel zum Thema "{THEMA}".

Liefere:
- 5 Titel-Vorschläge (klickstark, < 60 Zeichen).
- Eine Meta-Beschreibung (< 155 Zeichen).
- Eine Gliederung mit H2- und H3-Überschriften.
- Pro H2 die wichtigsten Keywords, die abgedeckt werden sollten.

Zielgruppe: {ZIELGRUPPE}. Suchintention: {informational/transactional}.`
  ),
  "research-summarizer": detail(
    bySlug("research-summarizer"),
    `Fasse das folgende wissenschaftliche Paper strukturiert zusammen.

Gliederung:
1. **Kernaussage** (1 Satz)
2. **Problem & Motivation**
3. **Methode** (in einfachen Worten)
4. **Wichtigste Ergebnisse** (als Stichpunkte)
5. **Limitationen & offene Fragen**
6. **Relevanz** – für wen ist das interessant?

Text:
"""
{HIER PAPER-TEXT EINFÜGEN}
"""`,
    { recommended_model_slug: "gemini-pro", recommended_model_name: "Gemini Pro" }
  ),
  "sql-erklaerer": detail(
    bySlug("sql-erklaerer"),
    `Erkläre die folgende SQL-Abfrage.

1. Beschreibe Schritt für Schritt, was die Query macht (in einfachen Worten).
2. Nenne mögliche Performance-Probleme.
3. Schlage eine optimierte Version vor und erkläre die Änderungen.

Query:
"""
{HIER SQL EINFÜGEN}
"""`
  ),
  "bildprompt-fotorealistisch": detail(
    bySlug("bildprompt-fotorealistisch"),
    `Wandle die folgende Idee in einen detaillierten Prompt für einen fotorealistischen Bildgenerator um.

Berücksichtige: Motiv, Bildkomposition, Licht/Stimmung, Kameraperspektive, Objektiv/Brennweite, Detailgrad, Stil-Stichworte.
Gib den Prompt in einer Zeile aus, danach 3 alternative Varianten.

Idee: {DEINE IDEE}`
  ),
  "interview-vorbereitung": detail(
    bySlug("interview-vorbereitung"),
    `Du bist ein erfahrener Karriere-Coach. Führe mit mir ein simuliertes Bewerbungsgespräch für die Position "{POSITION}".

Ablauf:
1. Stelle mir eine typische Interview-Frage.
2. Warte auf meine Antwort.
3. Gib konstruktives Feedback (Stärken + 1 konkreter Verbesserungstipp).
4. Stelle die nächste, etwas schwierigere Frage.

Beginne jetzt mit der ersten Frage.`
  ),
};
