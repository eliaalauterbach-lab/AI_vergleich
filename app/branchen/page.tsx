import Link from "next/link";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { INDUSTRIES } from "@/lib/data/taxonomy";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Branchen",
  description:
    "KI-Modelle und Agenten nach Branche — Software, Marketing, Recht, Gesundheit, Finanzen, Bildung und mehr.",
};

export default function BranchenPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-8">
        <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-dim text-accent-soft">
            <Building2 size={19} />
          </span>
          Nach Branche
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Finde die passenden Modelle und Agenten für deinen Bereich.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map((ind) => (
          <Link
            key={ind.slug}
            href={`/branchen/${ind.slug}`}
            className="card group flex items-start gap-3 p-4 transition-colors hover:border-accent/40 hover:bg-elevate"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-dim text-accent-soft">
              <Icon name={ind.icon} size={20} />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-foreground group-hover:text-accent-soft">
                {ind.name}
              </span>
              <span className="text-sm text-muted">{ind.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
