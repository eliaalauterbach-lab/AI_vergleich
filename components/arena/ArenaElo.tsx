import Link from "next/link";
import type { ArenaEloEntry } from "@/types";
import { RankBadge } from "@/components/leaderboard/RankBadge";

/** Elo-Rangliste aus den Blind-Test-Duellen (community-basiert). */
export function ArenaElo({ entries }: { entries: ArenaEloEntry[] }) {
  return (
    <section id="elo" className="card overflow-hidden scroll-mt-20">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">Arena-Rangliste (Elo)</h2>
        <p className="text-xs text-muted">Aus anonymen Blind-Test-Duellen der Community.</p>
      </div>
      <ul className="divide-y divide-border">
        {entries.map((e, i) => (
          <li key={e.slug}>
            <Link
              href={`/models/${e.slug}`}
              className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-elevate"
            >
              <RankBadge rank={i + 1} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-foreground">{e.name}</div>
                <div className="text-xs text-muted">{e.provider_name ?? "—"}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold tabular-nums text-accent-soft">{Math.round(e.rating)}</div>
                <div className="text-xs text-muted">{e.games.toLocaleString("de-DE")} Duelle</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
