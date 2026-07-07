"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowBigUp, GitFork } from "lucide-react";
import { togglePromptUpvote } from "@/app/actions";

/**
 * Upvote- & Fork-Aktionen.
 * Upvote gibt optimistisches Feedback; die Persistenz folgt mit dem Auth-Schritt
 * (bis dahin ehrlicher Hinweis statt stiller Fake-Speicherung).
 */
export function PromptActions({
  slug,
  upvotes,
  forkCount,
}: {
  slug: string;
  upvotes: number;
  forkCount: number;
}) {
  const [voted, setVoted] = useState(false);
  const [hint, setHint] = useState("");
  const [pending, startTransition] = useTransition();

  function toggleVote() {
    startTransition(async () => {
      const res = await togglePromptUpvote(slug);
      if (res.ok) {
        setVoted((v) => !v);
        setHint("");
      } else {
        setHint(res.error ?? "Fehler.");
        setTimeout(() => setHint(""), 3000);
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleVote}
          disabled={pending}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
            voted
              ? "border-accent/50 bg-accent/20 text-accent-soft"
              : "border-border bg-surface text-subtle hover:bg-elevate"
          }`}
        >
          <ArrowBigUp size={16} />
          Upvote
          <span className="tabular-nums">{upvotes + (voted ? 1 : 0)}</span>
        </button>

        <Link
          href={`/prompts/neu?fork=${slug}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium text-subtle transition-colors hover:bg-elevate"
        >
          <GitFork size={15} />
          Forken
          <span className="tabular-nums text-muted">{forkCount}</span>
        </Link>
      </div>

      {hint && <p className="text-xs text-accent-soft">{hint}</p>}
    </div>
  );
}
