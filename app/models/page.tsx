import Link from "next/link";
import type { Metadata } from "next";
import { Boxes, Trophy } from "lucide-react";
import { getLeaderboard } from "@/lib/data/leaderboard";
import { ModelCard } from "@/components/models/ModelCard";

export const metadata: Metadata = {
  title: "Modelle",
  description:
    "Die Bibliothek der KI-Modelle — Text, Code, Bild, Video, Musik & mehr. Mit Steckbriefen, Benchmarks und Community-Bewertung.",
};

const FILTERS = [
  { slug: "", label: "Alle" },
  { slug: "text", label: "Text" },
  { slug: "code", label: "Code" },
  { slug: "image", label: "Bild" },
  { slug: "video", label: "Video" },
  { slug: "music", label: "Musik" },
];

export default async function ModelsPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const active = searchParams.cat ?? "";
  const models = await getLeaderboard(active || undefined);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight text-foreground">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-dim text-accent-soft">
              <Boxes size={19} />
            </span>
            Modelle
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            Die Bibliothek der KI-Modelle. Klick ein Modell für den vollständigen
            Steckbrief mit Stärken, Benchmarks und Live-Kostenrechner.
          </p>
        </div>
        <Link
          href="/ranglisten"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-subtle transition-colors hover:border-accent/40 hover:text-foreground"
        >
          <Trophy size={15} />
          Als Rangliste
        </Link>
      </header>

      <nav className="mb-6 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const isActive = active === f.slug;
          return (
            <Link
              key={f.slug || "all"}
              href={f.slug ? `/models?cat=${f.slug}` : "/models"}
              scroll={false}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-accent/40 bg-accent-dim text-accent-soft"
                  : "border-border bg-surface text-muted hover:bg-elevate hover:text-subtle"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {models.length === 0 ? (
        <p className="py-16 text-center text-muted">Keine Modelle in dieser Kategorie.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      )}
    </main>
  );
}
