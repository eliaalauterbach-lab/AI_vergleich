import type { BenchmarkScore } from "@/types";

/** Benchmark-Ergebnisse als beschriftete Balken (normalisiert 0–100). */
export function BenchmarkList({ scores }: { scores: BenchmarkScore[] }) {
  if (scores.length === 0) {
    return <p className="text-sm text-muted">Noch keine Benchmark-Daten.</p>;
  }

  return (
    <div className="space-y-3.5">
      {scores.map((s) => (
        <div key={s.benchmark_slug}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-subtle">{s.benchmark_name}</span>
            <span className="tabular-nums text-muted">
              {s.raw_score}
              {s.unit === "%" ? "%" : s.unit === "elo" ? " Elo" : ""}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-elevate">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft"
              style={{ width: `${s.normalized ?? 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
