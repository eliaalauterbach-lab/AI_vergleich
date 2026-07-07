import type { LeaderboardEntry, Modality } from "@/types";

/**
 * Lädt das Leaderboard aus der Supabase-View `v_leaderboard`.
 * Fällt auf Demo-Daten zurück, solange keine ENV-Variablen gesetzt sind –
 * so rendert die Startseite auch ohne konfigurierte DB (lokale Erst-Ansicht).
 */
export async function getLeaderboard(
  category?: string
): Promise<LeaderboardEntry[]> {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasSupabase) return DEMO_LEADERBOARD;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();

  let query = supabase
    .from("v_leaderboard")
    .select("*")
    .order("performance_score", { ascending: false, nullsFirst: false });

  if (category) query = query.contains("modalities", [category]);

  const { data, error } = await query;
  if (error || !data) return DEMO_LEADERBOARD;

  return data as LeaderboardEntry[];
}

// ---------------------------------------------------------------------------
// Fallback-Demo-Daten (identisch zu supabase/migrations/0002_seed_demo.sql)
// ---------------------------------------------------------------------------
const m = (mods: string[]) => mods as Modality[];

export const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "1", slug: "claude-opus", name: "Claude Opus", logo_url: null,
    modalities: m(["text", "code", "multimodal"]),
    provider_name: "Anthropic", provider_slug: "anthropic", provider_logo_url: null,
    performance_score: 95, benchmark_count: 2, rating_avg: 4.8, rating_count: 214,
    price_input_usd: 15, price_output_usd: 75, throughput_tps: 62,
  },
  {
    id: "2", slug: "gpt-flagship", name: "GPT Flagship", logo_url: null,
    modalities: m(["text", "code", "multimodal"]),
    provider_name: "OpenAI", provider_slug: "openai", provider_logo_url: null,
    performance_score: 92, benchmark_count: 2, rating_avg: 4.6, rating_count: 331,
    price_input_usd: 10, price_output_usd: 30, throughput_tps: 80,
  },
  {
    id: "3", slug: "gemini-pro", name: "Gemini Pro", logo_url: null,
    modalities: m(["text", "code", "multimodal"]),
    provider_name: "Google", provider_slug: "google", provider_logo_url: null,
    performance_score: 88, benchmark_count: 2, rating_avg: 4.4, rating_count: 189,
    price_input_usd: 7, price_output_usd: 21, throughput_tps: 95,
  },
  {
    id: "4", slug: "mistral-large", name: "Mistral Large", logo_url: null,
    modalities: m(["text", "code"]),
    provider_name: "Mistral AI", provider_slug: "mistral", provider_logo_url: null,
    performance_score: 81, benchmark_count: 2, rating_avg: 4.2, rating_count: 96,
    price_input_usd: 2, price_output_usd: 6, throughput_tps: 110,
  },
  {
    id: "5", slug: "llama-large", name: "Llama Large", logo_url: null,
    modalities: m(["text", "code"]),
    provider_name: "Meta", provider_slug: "meta", provider_logo_url: null,
    performance_score: 76, benchmark_count: 2, rating_avg: 4.1, rating_count: 142,
    price_input_usd: 0.9, price_output_usd: 0.9, throughput_tps: 120,
  },
];
