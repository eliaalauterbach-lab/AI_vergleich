/** Rang-Abzeichen: Top-3 metallisch, danach schlicht nummeriert. */
export function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, string> = {
    1: "bg-gold/15 text-gold border-gold/30",
    2: "bg-silver/15 text-silver border-silver/30",
    3: "bg-bronze/15 text-bronze border-bronze/30",
  };
  const cls = styles[rank] ?? "bg-elevate text-muted border-border";

  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold tabular-nums ${cls}`}
    >
      {rank}
    </span>
  );
}
