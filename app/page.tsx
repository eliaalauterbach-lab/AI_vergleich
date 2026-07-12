import Link from "next/link";
import { ArrowRight, Boxes, Bot } from "lucide-react";
import { getLeaderboard } from "@/lib/data/leaderboard";
import { getAgents } from "@/lib/data/agents";
import { INDUSTRIES, USE_CASES } from "@/lib/data/taxonomy";
import { SearchHero } from "@/components/discover/SearchHero";
import { Icon } from "@/components/ui/Icon";
import { ModelCard } from "@/components/models/ModelCard";
import { AgentCard } from "@/components/agents/AgentCard";

export default async function HomePage() {
  const [models, agents] = await Promise.all([
    getLeaderboard(),
    getAgents(),
  ]);
  const topModels = models.slice(0, 4);
  const topAgents = agents.slice(0, 4);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6">
      {/* -------------------- Hero: Problem-Suche -------------------- */}
      <section className="mb-14 text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Finde die richtige{" "}
          <span className="bg-gradient-to-r from-accent-soft to-accent bg-clip-text text-transparent">
            KI
          </span>{" "}
          für dein Problem
        </h1>
        <p className="mx-auto mb-8 mt-4 max-w-xl text-balance text-muted">
          Die Bibliothek für KI-Modelle und Agenten — für jede Branche und jede
          Aufgabe. Beschreibe, was du erreichen willst, und wir zeigen dir das
          passende Werkzeug.
        </p>
        <SearchHero />
      </section>

      {/* -------------------- Nach Branche -------------------- */}
      <Section title="Nach Branche entdecken" href="/branchen" linkLabel="Alle Branchen">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {INDUSTRIES.slice(0, 8).map((ind) => (
            <Link
              key={ind.slug}
              href={`/branchen/${ind.slug}`}
              className="card group flex items-start gap-3 p-4 transition-colors hover:border-accent/40 hover:bg-elevate"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-dim text-accent-soft">
                <Icon name={ind.icon} size={18} />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-foreground group-hover:text-accent-soft">
                  {ind.name}
                </span>
                <span className="line-clamp-1 text-xs text-muted">{ind.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* -------------------- Nach Aufgabe -------------------- */}
      <Section title="Nach Aufgabe entdecken">
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc) => (
            <Link
              key={uc.slug}
              href={`/suche?task=${uc.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-subtle transition-colors hover:border-accent/40 hover:text-foreground"
            >
              <Icon name={uc.icon} size={15} />
              {uc.name}
            </Link>
          ))}
        </div>
      </Section>

      {/* -------------------- Top-Modelle -------------------- */}
      <Section title="Top-Modelle" href="/models" linkLabel="Alle Modelle" icon={<Boxes size={18} />}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topModels.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      </Section>

      {/* -------------------- Top-Agenten -------------------- */}
      <Section title="Top-Agenten" href="/agents" linkLabel="Alle Agenten" icon={<Bot size={18} />}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topAgents.map((a) => (
            <AgentCard key={a.id} agent={a} />
          ))}
        </div>
      </Section>
    </main>
  );
}

function Section({
  title,
  href,
  linkLabel,
  icon,
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          {icon && <span className="text-accent-soft">{icon}</span>}
          {title}
        </h2>
        {href && linkLabel && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
          >
            {linkLabel}
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
