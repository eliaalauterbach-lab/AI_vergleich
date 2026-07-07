import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import type { LeaderboardEntry } from "@/types";
import { StarRating } from "@/components/ui/StarRating";
import { RankBadge } from "./RankBadge";
import { ScoreBar } from "./ScoreBar";
import { formatPrice, formatTps, modalityLabel } from "@/lib/format";

/**
 * Startseiten-Rangliste.
 * Server Component – erhält die bereits geladenen Einträge als Prop.
 * Desktop: dichte Tabelle (Copy-Paste-freundlich).
 * Mobile: gestapelte Karten (App-Feeling).
 */
export function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <section className="card overflow-hidden">
      {/* Kopfzeile (nur Desktop) */}
      <div className="hidden grid-cols-[3.5rem_1fr_10rem_9rem_7rem_6rem] items-center gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted md:grid">
        <span>Rang</span>
        <span>Modell</span>
        <span>Performance</span>
        <span>Community</span>
        <span>Preis I/O</span>
        <span className="text-right">Speed</span>
      </div>

      <ul className="divide-y divide-border">
        {entries.map((entry, i) => (
          <li key={entry.id}>
            <Link
              href={`/models/${entry.slug}`}
              className="group block px-4 py-4 transition-colors hover:bg-elevate md:px-5"
            >
              {/* ---------- Desktop-Zeile ---------- */}
              <div className="hidden grid-cols-[3.5rem_1fr_10rem_9rem_7rem_6rem] items-center gap-4 md:grid">
                <RankBadge rank={i + 1} />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-white">{entry.name}</span>
                    <ChevronRight
                      size={15}
                      className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                    <span>{entry.provider_name ?? "—"}</span>
                    <span className="text-border">·</span>
                    <span className="truncate">
                      {entry.modalities.slice(0, 3).map(modalityLabel).join(" / ")}
                    </span>
                  </div>
                </div>

                <ScoreBar score={entry.performance_score} />
                <StarRating value={entry.rating_avg} count={entry.rating_count} />

                <div className="text-sm tabular-nums text-subtle">
                  {formatPrice(entry.price_input_usd)}
                  <span className="text-muted"> / </span>
                  {formatPrice(entry.price_output_usd)}
                </div>

                <div className="flex items-center justify-end gap-1 text-sm tabular-nums text-subtle">
                  <Zap size={13} className="text-accent-soft" />
                  {formatTps(entry.throughput_tps)}
                </div>
              </div>

              {/* ---------- Mobile-Karte ---------- */}
              <div className="flex items-center gap-3 md:hidden">
                <RankBadge rank={i + 1} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-white">{entry.name}</span>
                    <ScoreBar score={entry.performance_score} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted">{entry.provider_name ?? "—"}</span>
                    <StarRating value={entry.rating_avg} count={entry.rating_count} size={12} />
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs tabular-nums text-muted">
                    <span>{formatPrice(entry.price_input_usd)} / {formatPrice(entry.price_output_usd)}</span>
                    <span className="flex items-center gap-1">
                      <Zap size={11} className="text-accent-soft" />
                      {formatTps(entry.throughput_tps)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
