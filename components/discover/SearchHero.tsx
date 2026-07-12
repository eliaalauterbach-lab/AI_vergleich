"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

const EXAMPLES = [
  "Verträge prüfen",
  "Blog schreiben",
  "Code reviewen",
  "Bilder für Werbung",
  "Daten analysieren",
];

/** Problem-zuerst-Suche: Freitext → Ergebnisseite mit Modellen & Agenten. */
export function SearchHero() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/suche?q=${encodeURIComponent(query)}` : "/suche");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={submit} className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Was möchtest du erreichen? z.B. „Kundenmails automatisch beantworten“"
          className="w-full rounded-2xl border border-border bg-surface py-4 pl-12 pr-28 text-base text-foreground shadow-card placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          Finden
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-muted">Beliebt:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => router.push(`/suche?q=${encodeURIComponent(ex)}`)}
            className="rounded-full border border-border bg-surface px-3 py-1 text-subtle transition-colors hover:border-accent/40 hover:text-foreground"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
