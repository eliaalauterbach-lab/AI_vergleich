import Link from "next/link";
import type { Metadata } from "next";
import { Library, Plus } from "lucide-react";
import { getPrompts, getPromptCategories } from "@/lib/data/prompts";
import { PromptCard } from "@/components/prompts/PromptCard";

export const metadata: Metadata = {
  title: "Prompt-Bibliothek",
  description:
    "Die Wikipedia für Prompts: bewährte, kategorisierte Prompts zum Kopieren, Upvoten und Forken.",
};

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const active = searchParams.cat ?? "";
  const [prompts, categories] = await Promise.all([
    getPrompts(active || undefined),
    getPromptCategories(),
  ]);
  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6">
      {/* Kopf */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-dim text-accent-soft">
              <Library size={19} />
            </span>
            Prompt-Bibliothek
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            Die Wikipedia für Prompts — bewährte Vorlagen zum Kopieren, Upvoten
            und Forken. Von der Community, für die Community.
          </p>
        </div>
        <Link
          href="/prompts/neu"
          className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent-dim px-3.5 py-2 text-sm font-medium text-accent-soft transition-colors hover:bg-accent/20"
        >
          <Plus size={16} />
          Prompt einreichen
        </Link>
      </header>

      {/* Kategorie-Filter */}
      <nav className="mb-6 flex flex-wrap items-center gap-2">
        <FilterChip href="/prompts" label="Alle" count={total} active={!active} />
        {categories.map((c) => (
          <FilterChip
            key={c.slug}
            href={`/prompts?cat=${c.slug}`}
            label={c.name}
            count={c.count}
            active={active === c.slug}
          />
        ))}
      </nav>

      {/* Grid */}
      {prompts.length === 0 ? (
        <p className="py-16 text-center text-muted">
          Noch keine Prompts in dieser Kategorie. Reiche den ersten ein!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
        </div>
      )}
    </main>
  );
}

function FilterChip({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-accent/40 bg-accent-dim text-accent-soft"
          : "border-border bg-surface text-muted hover:bg-elevate hover:text-subtle"
      }`}
    >
      {label}
      <span className="text-xs text-muted">{count}</span>
    </Link>
  );
}
