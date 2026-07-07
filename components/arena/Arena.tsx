"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swords, RotateCcw, Trophy, Check } from "lucide-react";
import type { ArenaBattle, ArenaContender } from "@/types";

type Choice = "left" | "right" | "tie" | "bad";

/**
 * Blind-Test-Arena: zwei anonyme Antworten, Nutzer stimmt ab, danach werden
 * die Modelle aufgelöst. Links/rechts wird pro Duell zufällig getauscht, damit
 * kein Positions-Bias entsteht.
 */
export function Arena({ battles }: { battles: ArenaBattle[] }) {
  const [index, setIndex] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);

  const battle = battles[index];

  // Reihenfolge erst nach dem Mounten würfeln (vermeidet Hydration-Mismatch)
  useEffect(() => {
    setSwapped(Math.random() < 0.5);
  }, [index]);

  const left = swapped ? battle.b : battle.a;
  const right = swapped ? battle.a : battle.b;
  const revealed = choice !== null;

  function vote(c: Choice) {
    if (!revealed) setChoice(c);
  }

  function next() {
    setChoice(null);
    setIndex((i) => (i + 1) % battles.length);
  }

  const leftWon = choice === "left";
  const rightWon = choice === "right";

  return (
    <div>
      {/* Prompt */}
      <div className="card mb-5 p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
          <Swords size={14} className="text-accent-soft" />
          Duell · {battle.category_name}
        </div>
        <p className="text-lg font-medium text-foreground">{battle.prompt}</p>
      </div>

      {/* Antworten */}
      <div className="grid gap-4 md:grid-cols-2">
        <AnswerCard label="A" contender={left} revealed={revealed} won={leftWon} />
        <AnswerCard label="B" contender={right} revealed={revealed} won={rightWon} />
      </div>

      {/* Voting / Auflösung */}
      {!revealed ? (
        <div className="mt-5">
          <p className="mb-3 text-center text-sm text-muted">Welche Antwort ist besser?</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <VoteButton onClick={() => vote("left")}>👈 A ist besser</VoteButton>
            <VoteButton onClick={() => vote("right")}>B ist besser 👉</VoteButton>
            <VoteButton onClick={() => vote("tie")}>🤝 Unentschieden</VoteButton>
            <VoteButton onClick={() => vote("bad")}>👎 Beide schlecht</VoteButton>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-dim px-4 py-2.5 text-sm text-accent-soft">
            <Check size={15} />
            {choice === "tie"
              ? "Unentschieden gewertet."
              : choice === "bad"
              ? "Beide als schwach gewertet."
              : `Du hast für ${(choice === "left" ? left : right).name} gestimmt.`}
          </div>
          <button
            onClick={next}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            <RotateCcw size={15} />
            Nächstes Duell
          </button>
          <p className="text-xs text-muted">
            Votes fließen in die Arena-Elo ein, sobald das Backend live ist.
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link href="#elo" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <Trophy size={14} />
          Zur Arena-Rangliste
        </Link>
      </div>
    </div>
  );
}

function AnswerCard({
  label,
  contender,
  revealed,
  won,
}: {
  label: string;
  contender: ArenaContender;
  revealed: boolean;
  won: boolean;
}) {
  return (
    <div
      className={`card flex flex-col p-5 transition-colors ${
        won ? "border-accent/50 bg-accent-dim" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-elevate text-sm font-semibold text-subtle">
          {label}
        </span>
        {revealed ? (
          <Link
            href={`/models/${contender.slug}`}
            className={`text-sm font-medium hover:underline ${won ? "text-accent-soft" : "text-subtle"}`}
          >
            {contender.name}
          </Link>
        ) : (
          <span className="text-sm text-muted">verdeckt</span>
        )}
      </div>
      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-subtle">
        {contender.response}
      </pre>
    </div>
  );
}

function VoteButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-medium text-subtle transition-colors hover:border-accent/40 hover:bg-elevate hover:text-foreground"
    >
      {children}
    </button>
  );
}
