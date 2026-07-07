import type { Metadata } from "next";
import { Swords } from "lucide-react";
import { getBattles, getArenaElo } from "@/lib/data/arena";
import { Arena } from "@/components/arena/Arena";
import { ArenaElo } from "@/components/arena/ArenaElo";

export const metadata: Metadata = {
  title: "Blind-Test Arena",
  description:
    "Zwei KI-Modelle, eine Aufgabe, verdeckte Antworten. Stimme blind ab – das beste Modell steigt in der Elo-Rangliste.",
};

export default async function ArenaPage() {
  const [battles, elo] = await Promise.all([getBattles(), getArenaElo()]);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-8 text-center">
        <h1 className="flex items-center justify-center gap-2.5 text-3xl font-bold tracking-tight text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-dim text-accent-soft">
            <Swords size={19} />
          </span>
          Blind-Test Arena
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-muted">
          Zwei Modelle, eine Aufgabe – aber du siehst nicht, welches welches ist.
          Stimme unvoreingenommen ab. Nach dem Vote wird aufgelöst.
        </p>
      </header>

      <Arena battles={battles} />

      <div className="mt-12">
        <ArenaElo entries={elo} />
      </div>
    </main>
  );
}
