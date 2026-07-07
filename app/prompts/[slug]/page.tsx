import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, GitFork, Sparkles, User } from "lucide-react";
import { getPrompt, getAllPromptSlugs } from "@/lib/data/prompts";
import { CopyButton } from "@/components/prompts/CopyButton";
import { PromptActions } from "@/components/prompts/PromptActions";

export async function generateStaticParams() {
  const slugs = await getAllPromptSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const prompt = await getPrompt(params.slug);
  if (!prompt) return { title: "Prompt nicht gefunden" };
  return {
    title: prompt.title,
    description: prompt.description ?? `Prompt-Vorlage: ${prompt.title}`,
  };
}

export default async function PromptPage({
  params,
}: {
  params: { slug: string };
}) {
  const prompt = await getPrompt(params.slug);
  if (!prompt) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/prompts"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Zur Bibliothek
      </Link>

      {/* Kopf */}
      <div className="mb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {prompt.category_name && (
            <Link href={`/prompts?cat=${prompt.category_slug}`} className="chip hover:text-foreground">
              {prompt.category_name}
            </Link>
          )}
          {prompt.forked_from_slug && (
            <span className="chip">
              <GitFork size={12} />
              Fork
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{prompt.title}</h1>
        {prompt.description && (
          <p className="mt-2 text-muted">{prompt.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <User size={14} />
            {prompt.author_name ?? "anonym"}
          </span>
          {prompt.recommended_model_name && (
            <Link
              href={`/models/${prompt.recommended_model_slug}`}
              className="flex items-center gap-1.5 text-accent-soft hover:underline"
            >
              <Sparkles size={13} />
              Empfohlen: {prompt.recommended_model_name}
            </Link>
          )}
        </div>
      </div>

      {/* Fork-Herkunft */}
      {prompt.forked_from_slug && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted">
          <GitFork size={14} className="text-accent-soft" />
          Abgewandelt von{" "}
          <Link
            href={`/prompts/${prompt.forked_from_slug}`}
            className="font-medium text-subtle hover:text-foreground hover:underline"
          >
            {prompt.forked_from_title}
          </Link>
        </div>
      )}

      {/* Prompt-Körper */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Prompt
          </span>
          <CopyButton text={prompt.body} />
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap px-5 py-4 font-mono text-sm leading-relaxed text-subtle">
          {prompt.body}
        </pre>
      </section>

      {/* Tags */}
      {prompt.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <span key={tag} className="chip">#{tag}</span>
          ))}
        </div>
      )}

      {/* Aktionen */}
      <div className="mt-6">
        <PromptActions slug={prompt.slug} upvotes={prompt.upvotes} forkCount={prompt.fork_count} />
      </div>
    </main>
  );
}
