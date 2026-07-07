"use client";

import { useState } from "react";
import { Calculator, Clock } from "lucide-react";

/**
 * Live-Kosten-/Speed-Rechner.
 * Nutzer gibt Input-/Output-Tokens ein → Kosten (USD) und geschätzte
 * Generierungszeit werden sofort berechnet.
 */
export function CostCalculator({
  priceInput,
  priceOutput,
  throughputTps,
}: {
  priceInput: number | null;
  priceOutput: number | null;
  throughputTps: number | null;
}) {
  const [inputK, setInputK] = useState(2); // in 1.000 Tokens
  const [outputK, setOutputK] = useState(1);

  const inTokens = inputK * 1000;
  const outTokens = outputK * 1000;

  const cost =
    ((priceInput ?? 0) * inTokens + (priceOutput ?? 0) * outTokens) / 1_000_000;

  const seconds = throughputTps ? outTokens / throughputTps : null;

  return (
    <div className="card p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
        <Calculator size={15} className="text-accent-soft" />
        Kosten- &amp; Speed-Rechner
      </h3>

      <div className="space-y-4">
        <Slider
          label="Input"
          valueK={inputK}
          onChange={setInputK}
          hint={`${inTokens.toLocaleString("de-DE")} Tokens`}
        />
        <Slider
          label="Output"
          valueK={outputK}
          onChange={setOutputK}
          hint={`${outTokens.toLocaleString("de-DE")} Tokens`}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <Stat
          label="Kosten / Anfrage"
          value={cost > 0 ? `$${cost.toFixed(4)}` : "—"}
        />
        <Stat
          label="Generierungszeit"
          value={seconds != null ? `${seconds.toFixed(1)} s` : "—"}
          icon={<Clock size={12} />}
        />
      </div>

      <p className="mt-3 text-xs text-muted">
        Schätzung auf Basis von Listenpreisen &amp; medianem Durchsatz.
      </p>
    </div>
  );
}

function Slider({
  label,
  valueK,
  onChange,
  hint,
}: {
  label: string;
  valueK: number;
  onChange: (v: number) => void;
  hint: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-subtle">{label}</span>
        <span className="tabular-nums text-muted">{hint}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={valueK}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-elevate accent-accent"
      />
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-elevate/60 p-3">
      <div className="flex items-center gap-1 text-xs text-muted">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tabular-nums text-white">
        {value}
      </div>
    </div>
  );
}
