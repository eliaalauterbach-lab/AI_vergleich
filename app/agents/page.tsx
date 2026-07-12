import Link from "next/link";
import type { Metadata } from "next";
import { Bot } from "lucide-react";
import { getAgents, getAgentTypes } from "@/lib/data/agents";
import { AgentCard } from "@/components/agents/AgentCard";

export const metadata: Metadata = {
  title: "Agenten",
  description:
    "Das Verzeichnis der KI-Agenten & -Tools — fertige Assistenten für Coding, Recherche, Marketing, Support und mehr. Für jede Branche.",
};

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const active = searchParams.type ?? "";
  const [agents, types] = await Promise.all([
    getAgents(active ? { type: active } : undefined),
    getAgentTypes(),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-6">
        <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-dim text-accent-soft">
            <Bot size={19} />
          </span>
          Agenten &amp; Tools
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Fertige KI-Assistenten, die auf Modellen aufbauen und konkrete Aufgaben
          erledigen — von Coding über Recherche bis Kundensupport.
        </p>
      </header>

      <nav className="mb-6 flex flex-wrap items-center gap-2">
        <TypeChip href="/agents" label="Alle" active={!active} />
        {types.map((t) => (
          <TypeChip key={t} href={`/agents?type=${encodeURIComponent(t)}`} label={t} active={active === t} />
        ))}
      </nav>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((a) => (
          <AgentCard key={a.id} agent={a} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Du kennst einen guten Agenten, der fehlt? Bald kannst du Agenten
        vorschlagen und eigene zusammenstellen.
      </p>
    </main>
  );
}

function TypeChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-accent/40 bg-accent-dim text-accent-soft"
          : "border-border bg-surface text-muted hover:bg-elevate hover:text-subtle"
      }`}
    >
      {label}
    </Link>
  );
}
