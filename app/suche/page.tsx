import Link from "next/link";
import type { Metadata } from "next";
import { Boxes, Bot, SearchX } from "lucide-react";
import { search } from "@/lib/data/search";
import { industryBySlug, useCaseBySlug } from "@/lib/data/taxonomy";
import { ModelCard } from "@/components/models/ModelCard";
import { AgentCard } from "@/components/agents/AgentCard";

export const metadata: Metadata = { title: "Suche" };
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; branche?: string; task?: string };
}) {
  const { q, branche, task } = searchParams;
  const { models, agents } = await search({ q, industry: branche, task });

  const industry = branche ? industryBySlug(branche) : undefined;
  const useCase = task ? useCaseBySlug(task) : undefined;

  const heading = q
    ? `Ergebnisse für „${q}"`
    : industry
    ? `KI für ${industry.name}`
    : useCase
    ? `KI zum Thema ${useCase.name}`
    : "Entdecken";

  const total = models.length + agents.length;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{heading}</h1>
        <p className="mt-2 text-muted">
          {total} passende {total === 1 ? "Empfehlung" : "Empfehlungen"} — Modelle
          und Agenten für deine Aufgabe.
        </p>
        {(industry || useCase) && (
          <p className="mt-3 text-sm text-muted">
            Tipp: Über den{" "}
            <Link href="/finder" className="text-accent-soft hover:underline">
              AI Finder
            </Link>{" "}
            bekommst du eine geführte Empfehlung.
          </p>
        )}
      </header>

      {total === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-12 text-center">
          <SearchX size={28} className="text-muted" />
          <p className="text-subtle">Nichts Passendes gefunden.</p>
          <p className="text-sm text-muted">
            Versuch es allgemeiner oder stöbere in{" "}
            <Link href="/models" className="text-accent-soft hover:underline">Modellen</Link> und{" "}
            <Link href="/agents" className="text-accent-soft hover:underline">Agenten</Link>.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {agents.length > 0 && (
            <ResultSection title="Agenten & Tools" icon={<Bot size={18} />}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {agents.map((a) => (
                  <AgentCard key={a.id} agent={a} />
                ))}
              </div>
            </ResultSection>
          )}

          {models.length > 0 && (
            <ResultSection title="Modelle" icon={<Boxes size={18} />}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {models.map((m) => (
                  <ModelCard key={m.id} model={m} />
                ))}
              </div>
            </ResultSection>
          )}
        </div>
      )}
    </main>
  );
}

function ResultSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
        <span className="text-accent-soft">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
