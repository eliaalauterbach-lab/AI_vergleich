import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Bot, ExternalLink, Boxes, Plug } from "lucide-react";
import { getAgentOrFallback, getAgentSlugs } from "@/lib/data/agents";
import { StarRating } from "@/components/ui/StarRating";
import { ProsCons } from "@/components/models/ProsCons";
import { industryBySlug, useCaseBySlug } from "@/lib/data/taxonomy";
import { pricingLabel } from "@/lib/format";

export async function generateStaticParams() {
  const slugs = await getAgentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const agent = await getAgentOrFallback(params.slug);
  if (!agent) return { title: "Agent nicht gefunden" };
  return { title: `${agent.name} – Agent-Steckbrief`, description: agent.tagline };
}

export default async function AgentPage({ params }: { params: { slug: string } }) {
  const agent = await getAgentOrFallback(params.slug);
  if (!agent) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/agents"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Zu den Agenten
      </Link>

      {/* Kopf */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-dim text-accent-soft">
            <Bot size={24} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{agent.name}</h1>
              <span className="chip">{agent.agent_type}</span>
            </div>
            <p className="mt-1 max-w-xl text-muted">{agent.tagline}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StarRating value={agent.rating_avg} count={agent.rating_count} size={18} />
          {agent.website_url && (
            <a
              href={agent.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              Zur Website
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        {/* Hauptspalte */}
        <div className="space-y-6">
          {agent.description && (
            <section className="card p-5">
              <p className="leading-relaxed text-subtle">{agent.description}</p>
            </section>
          )}

          {agent.pros_cons.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Stärken &amp; Schwächen
              </h2>
              <ProsCons items={agent.pros_cons} />
            </section>
          )}

          {agent.tasks.length > 0 && (
            <section className="card p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Wofür geeignet
              </h2>
              <div className="flex flex-wrap gap-2">
                {agent.tasks.map((t) => {
                  const uc = useCaseBySlug(t);
                  return (
                    <Link key={t} href={`/suche?task=${t}`} className="chip hover:text-foreground">
                      {uc?.name ?? t}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Seitenleiste */}
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Eckdaten</h2>
            <dl className="space-y-3 text-sm">
              <Fact label="Preis" value={`${pricingLabel(agent.pricing)}${agent.price_note ? ` · ${agent.price_note}` : ""}`} />
              {agent.base_model && (
                <Fact icon={<Boxes size={14} />} label="Basis-Modell" value={agent.base_model} />
              )}
            </dl>
          </div>

          {agent.industries.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Branchen</h2>
              <div className="flex flex-wrap gap-2">
                {agent.industries.map((i) => {
                  const ind = industryBySlug(i);
                  return (
                    <Link key={i} href={`/suche?branche=${i}`} className="chip hover:text-foreground">
                      {ind?.name ?? i}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {agent.integrations.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted">
                <Plug size={13} /> Integrationen
              </h2>
              <div className="flex flex-wrap gap-2">
                {agent.integrations.map((x) => (
                  <span key={x} className="chip">{x}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-muted">
        {icon}
        {label}
      </dt>
      <dd className="text-right font-medium text-subtle">{value}</dd>
    </div>
  );
}
