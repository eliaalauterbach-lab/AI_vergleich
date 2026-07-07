import type { ModelDetail, BenchmarkScore, ProCon } from "@/types";
import { DEMO_LEADERBOARD } from "./leaderboard";

/**
 * Lädt einen Modell-Steckbrief per Slug.
 * Nutzt Supabase, wenn konfiguriert – sonst angereicherte Demo-Daten,
 * damit die Detailseite auch ohne DB rendert.
 */
export async function getModel(slug: string): Promise<ModelDetail | null> {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasSupabase) return getDemoModel(slug);

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();

  // Basisdaten aus der Leaderboard-View + Stammdaten aus models
  const [{ data: lb }, { data: m }, { data: pc }, { data: sc }] = await Promise.all([
    supabase.from("v_leaderboard").select("*").eq("slug", slug).maybeSingle(),
    supabase
      .from("models")
      .select("id, description, license, context_window, release_date, latency_ms")
      .eq("slug", slug)
      .maybeSingle(),
    supabase
      .from("model_pros_cons")
      .select("kind, text, model:models!inner(slug)")
      .eq("model.slug", slug)
      .order("sort_order"),
    supabase
      .from("model_scores")
      .select("raw_score, normalized, benchmark:benchmarks!inner(slug, name, unit), model:models!inner(slug)")
      .eq("model.slug", slug),
  ]);

  if (!lb || !m) return getDemoModel(slug);

  return {
    ...(lb as any),
    description: m.description,
    license: m.license,
    context_window: m.context_window,
    release_date: m.release_date,
    latency_ms: m.latency_ms,
    pros_cons: (pc ?? []).map((r: any) => ({ kind: r.kind, text: r.text })),
    scores: (sc ?? []).map((r: any) => ({
      benchmark_slug: r.benchmark.slug,
      benchmark_name: r.benchmark.name,
      unit: r.benchmark.unit,
      raw_score: r.raw_score,
      normalized: r.normalized,
    })),
  };
}

/** Für generateStaticParams / Sitemap. */
export async function getAllModelSlugs(): Promise<string[]> {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasSupabase) return DEMO_LEADERBOARD.map((m) => m.slug);

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();
  const { data } = await supabase.from("models").select("slug").eq("is_active", true);
  return (data ?? []).map((r) => r.slug as string);
}

// ---------------------------------------------------------------------------
// Demo-Anreicherung (Steckbrief-Texte pro Modell)
// ---------------------------------------------------------------------------
type Enrichment = {
  description: string;
  license: string;
  context_window: number;
  release_date: string;
  latency_ms: number;
  pros: string[];
  cons: string[];
  scores: BenchmarkScore[];
};

const bench = (
  slug: string,
  name: string,
  unit: string,
  raw: number,
  norm: number
): BenchmarkScore => ({
  benchmark_slug: slug,
  benchmark_name: name,
  unit,
  raw_score: raw,
  normalized: norm,
});

export const DEMO_ENRICHMENT: Record<string, Enrichment> = {
  "claude-opus": {
    description:
      "Flaggschiff-Modell mit herausragender Leistung bei komplexem Reasoning, langen Kontexten und Code. Gilt als besonders zuverlässig bei vielschichtigen Aufgaben und liefert nuancierte, gut strukturierte Antworten.",
    license: "proprietary", context_window: 200000, release_date: "2025-05-01", latency_ms: 480,
    pros: ["Bestes Reasoning bei komplexen Aufgaben", "Sehr großes Kontextfenster (200k)", "Zuverlässig bei Code & Refactoring", "Nuancierte, gut formatierte Antworten"],
    cons: ["Höherer Output-Preis", "Etwas langsamer als leichtere Modelle"],
    scores: [bench("mmlu", "MMLU", "%", 88, 94), bench("humaneval", "HumanEval", "%", 92, 96), bench("arena-elo", "LMSYS Arena", "elo", 1287, 93)],
  },
  "gpt-flagship": {
    description:
      "Vielseitiges Allround-Flaggschiff mit starker multimodaler Fähigkeit und großem Ökosystem. Gute Balance aus Geschwindigkeit, Preis und Qualität.",
    license: "proprietary", context_window: 128000, release_date: "2025-04-10", latency_ms: 320,
    pros: ["Sehr ausgereiftes Ökosystem & Tooling", "Starke multimodale Fähigkeiten", "Gute Geschwindigkeit", "Breite Sprachabdeckung"],
    cons: ["Kleineres Kontextfenster als Spitzenreiter", "Gelegentlich zu selbstsicher bei Fehlern"],
    scores: [bench("mmlu", "MMLU", "%", 86.5, 91), bench("humaneval", "HumanEval", "%", 90, 93), bench("arena-elo", "LMSYS Arena", "elo", 1265, 90)],
  },
  "gemini-pro": {
    description:
      "Modell mit extrem großem Kontextfenster (bis 1 Mio. Tokens) und starker Integration ins Google-Ökosystem. Ideal für die Verarbeitung sehr langer Dokumente.",
    license: "proprietary", context_window: 1000000, release_date: "2025-03-20", latency_ms: 300,
    pros: ["Riesiges Kontextfenster (1 Mio. Tokens)", "Schnell & günstig", "Gute Google-Integration", "Stark bei langen Dokumenten"],
    cons: ["Reasoning knapp hinter der Spitze", "Qualität schwankt je nach Aufgabe"],
    scores: [bench("mmlu", "MMLU", "%", 85, 89), bench("humaneval", "HumanEval", "%", 84, 87), bench("arena-elo", "LMSYS Arena", "elo", 1248, 88)],
  },
  "mistral-large": {
    description:
      "Leistungsstarkes europäisches Open-Weight-Modell mit gutem Preis-Leistungs-Verhältnis. Selbst hostbar und stark bei mehrsprachigen Aufgaben.",
    license: "open_weight", context_window: 128000, release_date: "2025-02-15", latency_ms: 260,
    pros: ["Open Weight – selbst hostbar", "Sehr gutes Preis-Leistungs-Verhältnis", "Stark bei europäischen Sprachen", "Datenschutzfreundlich (EU)"],
    cons: ["Reasoning hinter den Flaggschiffen", "Kleineres Ökosystem"],
    scores: [bench("mmlu", "MMLU", "%", 81, 82), bench("humaneval", "HumanEval", "%", 79, 80), bench("arena-elo", "LMSYS Arena", "elo", 1198, 81)],
  },
  "llama-large": {
    description:
      "Populärstes offenes Modell mit riesiger Community und breiter Tooling-Unterstützung. Kostenlos selbst hostbar, ideal als Basis für Feintuning.",
    license: "open_weight", context_window: 128000, release_date: "2025-01-25", latency_ms: 240,
    pros: ["Vollständig offen & kostenlos hostbar", "Riesige Community & viele Feintunes", "Sehr günstig im Betrieb", "Breite Framework-Unterstützung"],
    cons: ["Qualität hinter proprietären Spitzenmodellen", "Selbst-Hosting erfordert Infrastruktur"],
    scores: [bench("mmlu", "MMLU", "%", 79, 78), bench("humaneval", "HumanEval", "%", 74, 74), bench("arena-elo", "LMSYS Arena", "elo", 1176, 76)],
  },
};

function getDemoModel(slug: string): ModelDetail | null {
  const base = DEMO_LEADERBOARD.find((m) => m.slug === slug);
  const extra = DEMO_ENRICHMENT[slug];
  if (!base || !extra) return null;

  const pros_cons: ProCon[] = [
    ...extra.pros.map((text) => ({ kind: "pro" as const, text })),
    ...extra.cons.map((text) => ({ kind: "con" as const, text })),
  ];

  return {
    ...base,
    description: extra.description,
    license: extra.license,
    context_window: extra.context_window,
    release_date: extra.release_date,
    latency_ms: extra.latency_ms,
    pros_cons,
    scores: extra.scores,
  };
}
