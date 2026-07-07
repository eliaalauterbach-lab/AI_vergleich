import Link from "next/link";
import { ArrowBigUp, GitFork } from "lucide-react";
import type { PromptSummary } from "@/types";

/** Kompakte Prompt-Kachel für die Bibliotheks-Übersicht. */
export function PromptCard({ prompt }: { prompt: PromptSummary }) {
  return (
    <Link
      href={`/prompts/${prompt.slug}`}
      className="card group flex flex-col p-4 transition-colors hover:border-accent/40 hover:bg-elevate"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        {prompt.category_name && (
          <span className="chip">{prompt.category_name}</span>
        )}
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-0.5 font-medium text-subtle">
            <ArrowBigUp size={15} className="text-accent-soft" />
            {prompt.upvotes}
          </span>
          <span className="flex items-center gap-0.5">
            <GitFork size={13} />
            {prompt.fork_count}
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-white transition-colors group-hover:text-accent-soft">
        {prompt.title}
      </h3>
      {prompt.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted">{prompt.description}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
        {prompt.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs text-muted">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
