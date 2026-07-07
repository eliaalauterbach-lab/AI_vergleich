/** Performance-Score (0-100) als schlichter Balken mit Zahl. */
export function ScoreBar({ score }: { score: number | null }) {
  if (score == null) {
    return <span className="text-sm text-muted">—</span>;
  }
  return (
    <div className="flex items-center gap-2.5">
      <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-elevate sm:block">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="w-9 text-right text-sm font-semibold tabular-nums text-subtle">
        {score.toFixed(0)}
      </span>
    </div>
  );
}
