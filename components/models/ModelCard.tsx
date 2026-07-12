import Link from "next/link";
import { Boxes } from "lucide-react";
import type { LeaderboardEntry } from "@/types";
import { StarRating } from "@/components/ui/StarRating";
import { modalityLabel } from "@/lib/format";

/** Modell-Kachel für die Bibliothek, Suche und Branchen-Seiten. */
export function ModelCard({ model }: { model: LeaderboardEntry }) {
  return (
    <Link
      href={`/models/${model.slug}`}
      className="card group flex flex-col p-4 transition-colors hover:border-accent/40 hover:bg-elevate"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-dim text-accent-soft">
            <Boxes size={16} />
          </span>
          <span className="font-semibold text-foreground transition-colors group-hover:text-accent-soft">
            {model.name}
          </span>
        </span>
        {model.performance_score != null && (
          <span className="chip">{model.performance_score.toFixed(0)}/100</span>
        )}
      </div>

      <p className="text-sm text-muted">
        {model.provider_name} · {model.modalities.slice(0, 3).map(modalityLabel).join(" / ")}
      </p>

      <div className="mt-auto pt-3">
        <StarRating value={model.rating_avg} count={model.rating_count} size={13} />
      </div>
    </Link>
  );
}
