"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Trophy, RotateCcw } from "lucide-react";
import type { FinderCandidate, Modality } from "@/types";
import { formatPrice, formatTps, formatTokens } from "@/lib/format";

type Task = { slug: string; label: string; modality: Modality };
type Priority = "quality" | "price" | "speed" | "open";

const TASKS: Task[] = [
  { slug: "text", label: "Texte & Chat", modality: "text" },
  { slug: "code", label: "Programmieren", modality: "code" },
  { slug: "image", label: "Bilder", modality: "image" },
  { slug: "research", label: "Recherche", modality: "text" },
  { slug: "marketing", label: "Marketing", modality: "text" },
];

const PRIORITIES: { slug: Priority; label: string; hint: string }[] = [
  { slug: "quality", label: "Beste Qualität", hint: "Höchste Leistung, Preis egal" },
  { slug: "price", label: "Günstigster Preis", hint: "Möglichst niedrige Kosten" },
  { slug: "speed", label: "Höchste Geschwindigkeit", hint: "Schnelle Antworten" },
  { slug: "open", label: "Open Source", hint: "Selbst hostbar / offen" },
];

export function Finder({ candidates }: { candidates: FinderCandidate[] }) {
  const [task, setTask] = useState<Task | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [longContext, setLongContext] = useState(false);
  const [result, setResult] = useState<ScoredCandidate[] | null>(null);

  const ready = task && priority;

  function recommend() {
    if (!task || !priority) return;
    setResult(scoreCandidates(candidates, task, priority, longContext));
  }

  function reset() {
    setResult(null);
    setTask(null);
    setPriority(null);
    setLongContext(false);
  }

  if (result) {
    return <Result result={result} onReset={reset} />;
  }

  return (
    <div className="space-y-8">
      <Question step={1} title="Wofür brauchst du die KI?">
        <div className="flex flex-wrap gap-2">
          {TASKS.map((t) => (
            <Chip key={t.slug} active={task?.slug === t.slug} onClick={() => setTask(t)}>
              {t.label}
            </Chip>
          ))}
        </div>
      </Question>

      <Question step={2} title="Was ist dir am wichtigsten?">
        <div className="grid gap-2 sm:grid-cols-2">
          {PRIORITIES.map((p) => (
            <button
              key={p.slug}
              onClick={() => setPriority(p.slug)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                priority === p.slug
                  ? "border-accent/50 bg-accent-dim"
                  : "border-border bg-surface hover:bg-elevate"
              }`}
            >
              <div className="font-medium text-white">{p.label}</div>
              <div className="text-xs text-muted">{p.hint}</div>
            </button>
          ))}
        </div>
      </Question>

      <Question step={3} title="Arbeitest du mit langen Texten / Dokumenten?">
        <div className="flex gap-2">
          <Chip active={!longContext} onClick={() => setLongContext(false)}>
            Eher kurz
          </Chip>
          <Chip active={longContext} onClick={() => setLongContext(true)}>
            Ja, lange Inhalte
          </Chip>
        </div>
      </Question>

      <button
        onClick={recommend}
        disabled={!ready}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Sparkles size={16} />
        Empfehlung finden
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empfehlungslogik
// ---------------------------------------------------------------------------
type ScoredCandidate = FinderCandidate & { score: number; reasons: string[] };

function scoreCandidates(
  all: FinderCandidate[],
  task: Task,
  priority: Priority,
  longContext: boolean
): ScoredCandidate[] {
  // 1) nach Aufgabe filtern (Modalität muss passen oder multimodal)
  const pool = all.filter(
    (c) => c.modalities.includes(task.modality) || c.modalities.includes("multimodal")
  );
  const candidates = pool.length ? pool : all;

  // 2) Kennzahlen normalisieren (0..1)
  const maxSpeed = Math.max(...candidates.map((c) => c.throughput_tps ?? 0), 1);
  const maxCtx = Math.max(...candidates.map((c) => c.context_window ?? 0), 1);
  const prices = candidates.map((c) => avgPrice(c)).filter((p) => p > 0);
  const minP = Math.min(...prices, Infinity);
  const maxP = Math.max(...prices, 0);

  const weights = WEIGHTS[priority];

  const scored = candidates.map((c) => {
    const perf = (c.performance_score ?? 0) / 100;
    const speed = (c.throughput_tps ?? 0) / maxSpeed;
    const ctx = (c.context_window ?? 0) / maxCtx;
    const open = c.license === "open_weight" || c.license === "open_source" ? 1 : 0;
    const price = avgPrice(c);
    const priceScore = maxP === minP ? 0.5 : 1 - (price - minP) / (maxP - minP); // günstiger = höher

    let score =
      weights.perf * perf +
      weights.price * priceScore +
      weights.speed * speed +
      weights.open * open +
      (longContext ? 0.25 * ctx : 0);

    return { ...c, score, reasons: buildReasons(c, candidates, priority, longContext) };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

const WEIGHTS: Record<Priority, { perf: number; price: number; speed: number; open: number }> = {
  quality: { perf: 0.75, price: 0.1, speed: 0.1, open: 0.05 },
  price: { perf: 0.25, price: 0.6, speed: 0.1, open: 0.05 },
  speed: { perf: 0.25, price: 0.1, speed: 0.6, open: 0.05 },
  open: { perf: 0.35, price: 0.1, speed: 0.05, open: 0.5 },
};

function avgPrice(c: FinderCandidate): number {
  const vals = [c.price_input_usd, c.price_output_usd].filter((v): v is number => v != null);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

function buildReasons(
  c: FinderCandidate,
  all: FinderCandidate[],
  priority: Priority,
  longContext: boolean
): string[] {
  const reasons: string[] = [];
  const bestPerf = Math.max(...all.map((x) => x.performance_score ?? 0));
  const cheapest = Math.min(...all.map((x) => avgPrice(x)).filter((p) => p > 0));
  const fastest = Math.max(...all.map((x) => x.throughput_tps ?? 0));
  const largestCtx = Math.max(...all.map((x) => x.context_window ?? 0));

  if ((c.performance_score ?? 0) === bestPerf) reasons.push("Beste Gesamtleistung");
  else if ((c.performance_score ?? 0) >= 88) reasons.push("Sehr starke Leistung");
  if (avgPrice(c) === cheapest && avgPrice(c) > 0) reasons.push("Günstigster Preis");
  if ((c.throughput_tps ?? 0) === fastest) reasons.push("Höchste Geschwindigkeit");
  if (c.license === "open_weight" || c.license === "open_source") reasons.push("Open Source / selbst hostbar");
  if (longContext && (c.context_window ?? 0) === largestCtx) reasons.push("Größtes Kontextfenster");
  if (priority === "price" && avgPrice(c) > 0 && avgPrice(c) <= cheapest * 1.5)
    reasons.push("Gutes Preis-Leistungs-Verhältnis");

  return reasons.slice(0, 3);
}

// ---------------------------------------------------------------------------
// Ergebnis
// ---------------------------------------------------------------------------
function Result({ result, onReset }: { result: ScoredCandidate[]; onReset: () => void }) {
  const [top, ...rest] = result;

  return (
    <div className="space-y-6">
      <div className="card border-accent/30 bg-accent-dim p-6">
        <div className="mb-1 flex items-center gap-2 text-sm font-medium text-accent-soft">
          <Trophy size={15} />
          Unsere Empfehlung
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white">{top.name}</h2>
            <p className="text-sm text-muted">{top.provider_name}</p>
          </div>
          <Link
            href={`/models/${top.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            Steckbrief ansehen
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {top.reasons.map((r) => (
            <span key={r} className="chip border-accent/30 text-accent-soft">{r}</span>
          ))}
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-accent/20 pt-4 text-sm">
          <Metric label="Performance" value={top.performance_score != null ? `${top.performance_score.toFixed(0)}/100` : "—"} />
          <Metric label="Preis I/O" value={`${formatPrice(top.price_input_usd)}/${formatPrice(top.price_output_usd)}`} />
          <Metric label="Kontext" value={`${formatTokens(top.context_window)}`} />
        </dl>
      </div>

      {rest.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            Alternativen
          </h3>
          <div className="space-y-2">
            {rest.map((c) => (
              <Link
                key={c.slug}
                href={`/models/${c.slug}`}
                className="card flex items-center justify-between gap-3 p-4 transition-colors hover:bg-elevate"
              >
                <div>
                  <div className="font-semibold text-white">{c.name}</div>
                  <div className="mt-0.5 flex flex-wrap gap-1.5">
                    {c.reasons.slice(0, 2).map((r) => (
                      <span key={r} className="text-xs text-muted">{r}</span>
                    ))}
                  </div>
                </div>
                <span className="text-sm tabular-nums text-muted">
                  {formatTps(c.throughput_tps)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
      >
        <RotateCcw size={14} />
        Neu starten
      </button>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold tabular-nums text-white">{value}</dd>
    </div>
  );
}

function Question({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-elevate text-xs text-accent-soft">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-accent/50 bg-accent-dim text-accent-soft"
          : "border-border bg-surface text-subtle hover:bg-elevate"
      }`}
    >
      {children}
    </button>
  );
}
