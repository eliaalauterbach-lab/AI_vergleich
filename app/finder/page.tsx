import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { getFinderCandidates } from "@/lib/data/finder";
import { Finder } from "@/components/finder/Finder";

export const metadata: Metadata = {
  title: "AI Finder",
  description:
    "Beantworte drei kurze Fragen und finde das passende KI-Modell für deinen Anwendungsfall.",
};

export default async function FinderPage() {
  const candidates = await getFinderCandidates();

  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-8">
        <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-dim text-accent-soft">
            <Compass size={19} />
          </span>
          AI Finder
        </h1>
        <p className="mt-2 text-muted">
          Nicht sicher, welches Modell du brauchst? Drei kurze Fragen — wir
          empfehlen dir das passende.
        </p>
      </header>

      <Finder candidates={candidates} />
    </main>
  );
}
