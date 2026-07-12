import Link from "next/link";
import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { getLeaderboard } from "@/lib/data/leaderboard";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";

export const metadata: Metadata = {
  title: "Ranglisten",
  description:
    "KI-Modelle rein nach Leistung gerankt — in verschiedenen Kategorien. Performance-Score aus MMLU, HumanEval & Arena-Elo.",
};

const CATEGORIES = [
  { slug: "", label: "Gesamt" },
  { slug: "text", label: "Text" },
  { slug: "code", label: "Code" },
  { slug: "image", label: "Bild" },
  { slug: "video", label: "Video" },
  { slug: "music", label: "Musik" },
  { slug: "research", label: "Research" },
];

export default async function RanglistenPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const active = searchParams.cat ?? "";
  const entries = await getLeaderboard(active || undefined);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-6">
        <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-dim text-accent-soft">
            <Trophy size={19} />
          </span>
          Ranglisten
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Modelle rein nach Leistung gerankt — nicht nach Popularität. Wähle eine
          Kategorie.
        </p>
      </header>

      <nav className="mb-5 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => {
          const isActive = active === c.slug;
          return (
            <Link
              key={c.slug || "all"}
              href={c.slug ? `/ranglisten?cat=${c.slug}` : "/ranglisten"}
              scroll={false}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-accent/40 bg-accent-dim text-accent-soft"
                  : "border-border bg-surface text-muted hover:bg-elevate hover:text-subtle"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </nav>

      <Leaderboard entries={entries} />

      <p className="mt-4 text-center text-xs text-muted">
        Performance-Score = normalisierter Durchschnitt aus MMLU, HumanEval &amp;
        Arena-Elo (0–100). Bewertungen stammen aus der Community.
      </p>
    </main>
  );
}
