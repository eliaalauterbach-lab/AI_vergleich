import type { FinderCandidate } from "@/types";
import { DEMO_LEADERBOARD } from "./leaderboard";
import { DEMO_ENRICHMENT } from "./models";

/**
 * Kandidatenliste für den AI-Finder: die Fakten, auf denen die
 * Empfehlungslogik (clientseitig) rechnet. Demo-Fallback ohne DB.
 */
export async function getFinderCandidates(): Promise<FinderCandidate[]> {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasSupabase) {
    return DEMO_LEADERBOARD.map((e) => {
      const ex = DEMO_ENRICHMENT[e.slug];
      return {
        slug: e.slug,
        name: e.name,
        provider_name: e.provider_name,
        modalities: e.modalities,
        license: ex?.license ?? "unknown",
        performance_score: e.performance_score,
        price_input_usd: e.price_input_usd,
        price_output_usd: e.price_output_usd,
        throughput_tps: e.throughput_tps,
        context_window: ex?.context_window ?? null,
      };
    });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_leaderboard")
    .select("slug, name, provider_name, modalities, performance_score, price_input_usd, price_output_usd, throughput_tps, model:models!inner(license, context_window)");

  if (error || !data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((d: any) => ({
    slug: d.slug,
    name: d.name,
    provider_name: d.provider_name,
    modalities: d.modalities,
    license: d.model?.license ?? "unknown",
    performance_score: d.performance_score,
    price_input_usd: d.price_input_usd,
    price_output_usd: d.price_output_usd,
    throughput_tps: d.throughput_tps,
    context_window: d.model?.context_window ?? null,
  }));
}
