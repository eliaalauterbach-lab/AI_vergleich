import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getPrompt } from "@/lib/data/prompts";
import { SubmitPromptForm } from "@/components/prompts/SubmitPromptForm";

export const metadata: Metadata = {
  title: "Prompt einreichen",
};

// searchParams -> keine statische Generierung
export const dynamic = "force-dynamic";

export default async function NewPromptPage({
  searchParams,
}: {
  searchParams: { fork?: string };
}) {
  const forkSlug = searchParams.fork;
  const original = forkSlug ? await getPrompt(forkSlug) : null;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/prompts"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Zur Bibliothek
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-white">
        {original ? "Prompt forken" : "Prompt einreichen"}
      </h1>
      <p className="mt-2 text-muted">
        {original
          ? `Wandle „${original.title}" ab und teile deine Version mit der Community.`
          : "Teile einen bewährten Prompt mit der Community."}
      </p>

      <div className="mt-6">
        <SubmitPromptForm
          initialTitle={original ? `${original.title} (Fork)` : ""}
          initialBody={original?.body ?? ""}
          initialCategory={original?.category_slug ?? ""}
          forkOf={original ? { slug: original.slug, title: original.title } : null}
        />
      </div>
    </main>
  );
}
