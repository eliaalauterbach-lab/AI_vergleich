/** Zentrale Domänen-Typen (spiegeln das SQL-Schema wider). */

export type Modality =
  | "text" | "code" | "image" | "video"
  | "audio" | "music" | "research" | "marketing" | "multimodal";

export interface LeaderboardEntry {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  modalities: Modality[];
  provider_name: string | null;
  provider_slug: string | null;
  provider_logo_url: string | null;
  performance_score: number | null;   // 0-100
  benchmark_count: number;
  rating_avg: number;                  // 0-5
  rating_count: number;
  price_input_usd: number | null;      // USD / 1M Tokens
  price_output_usd: number | null;
  throughput_tps: number | null;       // Tokens/Sekunde
}

export interface BenchmarkScore {
  benchmark_slug: string;
  benchmark_name: string;
  unit: string | null;
  raw_score: number;
  normalized: number | null;           // 0-100
}

export interface ProCon {
  kind: "pro" | "con";
  text: string;
}

export interface ModelDetail extends LeaderboardEntry {
  description: string | null;
  license: string;                     // proprietary | open_weight | ...
  context_window: number | null;       // Tokens
  release_date: string | null;
  latency_ms: number | null;
  pros_cons: ProCon[];
  scores: BenchmarkScore[];
}

export interface PromptCategory {
  slug: string;
  name: string;
  count: number;
}

export interface PromptSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category_slug: string | null;
  category_name: string | null;
  author_name: string | null;
  upvotes: number;
  fork_count: number;
  score: number;                       // upvotes - downvotes
  tags: string[];
  created_at: string;
}

export interface PromptDetail extends PromptSummary {
  body: string;                        // der eigentliche Prompt-Text
  recommended_model_slug: string | null;
  recommended_model_name: string | null;
  forked_from_slug: string | null;
  forked_from_title: string | null;
}
