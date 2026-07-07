import Link from "next/link";
import { Trophy, Search, Sparkles, GitFork } from "lucide-react";
import { getLeaderboard } from "@/lib/data/leaderboard";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";

const CATEGORIES = [
  { slug: "", label: "Gesamt" },
  { slug: "text", label: "Text" },
  { slug: "code", label: "Code" },
  { slug: "image", label: "Bild" },
  { slug: "video", label: "Video" },
  { slug: "music", label: "Musik" },
  { slug: "research", label: "Research" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const active = searchParams.cat ?? "";
  const entries = await getLeaderboard(active || undefined);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6">
      {/* ---------------- Hero ---------------- */}
      <header className="mb-10 text-center">
        <span className="chip mx-auto mb-4 w-fit">
          <Sparkles size={13} className="text-accent-soft" />
          Automatisch aktuell · via Hugging Face &amp; OpenRouter
        </span>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Die Rangliste der{" "}
          <span className="bg-gradient-to-r from-accent-soft to-accent bg-clip-text text-transparent">
            KI-Modelle
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-muted">
          Gerankt rein nach Leistung — nicht nach Popularität. Text, Code, Bild,
          Video, Musik &amp; Research in einer schlichten Übersicht.
        </p>

        {/* Sekundäre Einstiege */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <QuickLink href="/finder" icon={<Search size={14} />} label="AI Finder" />
          <QuickLink href="/arena" icon={<Trophy size={14} />} label="Blind-Test Arena" />
          <QuickLink href="/prompts" icon={<GitFork size={14} />} label="Prompt-Bibliothek" />
        </div>
      </header>

      {/* ---------------- Kategorie-Filter ---------------- */}
      <nav className="mb-5 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => {
          const isActive = active === c.slug;
          return (
            <Link
              key={c.slug || "all"}
              href={c.slug ? `/?cat=${c.slug}` : "/"}
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

      {/* ---------------- Leaderboard ---------------- */}
      <Leaderboard entries={entries} />

      <p className="mt-4 text-center text-xs text-muted">
        Performance-Score = normalisierter Durchschnitt aus MMLU, HumanEval &amp;
        Arena-Elo (0–100). Bewertungen stammen aus der Community.
      </p>
    </main>
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-subtle transition-colors hover:border-accent/40 hover:text-foreground"
    >
      {icon}
      {label}
    </Link>
  );
}
