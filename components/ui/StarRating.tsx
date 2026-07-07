import { Star } from "lucide-react";

/** Kompakte 0-5-Sterne-Anzeige (read-only) für Steckbrief & Leaderboard. */
export function StarRating({
  value,
  count,
  size = 14,
}: {
  value: number;
  count?: number;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <div className="flex items-center gap-1.5" title={`${value.toFixed(1)} / 5`}>
      <div className="relative inline-flex">
        {/* Hintergrund-Sterne */}
        <div className="flex text-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        {/* Füllung nach Wert */}
        <div className="absolute inset-0 flex overflow-hidden text-gold" style={{ width: `${pct}%` }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} className="shrink-0" />
          ))}
        </div>
      </div>
      <span className="text-xs font-medium text-subtle">{value.toFixed(1)}</span>
      {count != null && <span className="text-xs text-muted">({count})</span>}
    </div>
  );
}
