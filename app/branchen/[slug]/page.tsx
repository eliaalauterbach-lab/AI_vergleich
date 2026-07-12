import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Check, Bot, Boxes, Library, Compass, ArrowRight } from "lucide-react";
import { getIndustryPage, getIndustrySlugs } from "@/lib/data/industry";
import { useCaseBySlug } from "@/lib/data/taxonomy";
import { Icon } from "@/components/ui/Icon";
import { AgentCard } from "@/components/agents/AgentCard";
import { ModelCard } from "@/components/models/ModelCard";
import { PromptCard } from "@/components/prompts/PromptCard";

export async function generateStaticParams() {
  return getIndustrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await getIndustryPage(params.slug);
  if (!page) return { title: "Branche nicht gefunden" };
  return {
    title: `KI für ${page.industry.name}`,
    description: page.content.intro.slice(0, 155),
  };
}

export default async function IndustryPage({ params }: { params: { slug: string } }) {
  const page = await getIndustryPage(params.slug);
  if (!page) notFound();
  const { industry, content, agents, models, prompts } = page;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/branchen"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Alle Branchen
      </Link>

      {/* Hero */}
      <header className="mb-10">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-dim text-accent-soft">
            <Icon name={industry.icon} size={24} />
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            KI für {industry.name}
          </h1>
        </div>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">{content.intro}</p>

        {content.highlights.length > 0 && (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {content.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-subtle">
                <Check size={16} className="mt-0.5 shrink-0 text-accent-soft" />
                {h}
              </li>
            ))}
          </ul>
        )}

        {content.taskSlugs.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Typische Aufgaben:</span>
            {content.taskSlugs.map((t) => {
              const uc = useCaseBySlug(t);
              return (
                <Link
                  key={t}
                  href={`/suche?branche=${industry.slug}&task=${t}`}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-subtle transition-colors hover:border-accent/40 hover:text-foreground"
                >
                  {uc?.name ?? t}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Empfohlene Agenten */}
      {agents.length > 0 && (
        <IndustrySection title="Empfohlene Agenten" icon={<Bot size={18} />} href="/agents" linkLabel="Alle Agenten">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.slice(0, 6).map((a) => (
              <AgentCard key={a.id} agent={a} />
            ))}
          </div>
        </IndustrySection>
      )}

      {/* Empfohlene Modelle */}
      <IndustrySection title="Passende Modelle" icon={<Boxes size={18} />} href="/models" linkLabel="Alle Modelle">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      </IndustrySection>

      {/* Passende Prompts */}
      {prompts.length > 0 && (
        <IndustrySection title="Passende Prompts" icon={<Library size={18} />} href="/prompts" linkLabel="Zur Bibliothek">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        </IndustrySection>
      )}

      {/* CTA */}
      <div className="card mt-4 flex flex-col items-center gap-3 p-8 text-center">
        <Compass size={26} className="text-accent-soft" />
        <p className="font-medium text-foreground">Nicht sicher, was am besten passt?</p>
        <p className="max-w-md text-sm text-muted">
          Der AI Finder gibt dir in drei Fragen eine konkrete Empfehlung für deinen Fall.
        </p>
        <Link
          href="/finder"
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          Zum AI Finder
          <ArrowRight size={15} />
        </Link>
      </div>
    </main>
  );
}

function IndustrySection({
  title,
  icon,
  href,
  linkLabel,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="text-accent-soft">{icon}</span>
          {title}
        </h2>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          {linkLabel}
          <ArrowRight size={14} />
        </Link>
      </div>
      {children}
    </section>
  );
}
