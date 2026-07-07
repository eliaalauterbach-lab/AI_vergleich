"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Kopiert Text in die Zwischenablage mit kurzem visuellen Feedback. */
export function CopyButton({
  text,
  label = "Prompt kopieren",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Zwischenablage nicht verfügbar – still ignorieren */
    }
  }

  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
        copied
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
          : "border-accent/40 bg-accent-dim text-accent-soft hover:bg-accent/20"
      }`}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Kopiert!" : label}
    </button>
  );
}
