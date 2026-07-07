"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Star, Check, Loader2 } from "lucide-react";
import { rateModel } from "@/app/actions";

/**
 * Interaktive Sterne-Eingabe. Speichert die Bewertung über eine Server-Action
 * (sobald Auth aktiv ist). Ohne Login → Hinweis mit Login-Link.
 */
export function RateModel({
  slug,
  canRate,
  authEnabled,
}: {
  slug: string;
  canRate: boolean;
  authEnabled: boolean;
}) {
  const [hover, setHover] = useState(0);
  const [value, setValue] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (!authEnabled) {
    return (
      <p className="text-xs text-muted">
        Bewerten wird aktiv, sobald die Anmeldung verbunden ist (Demo-Modus).
      </p>
    );
  }

  if (!canRate) {
    return (
      <p className="text-xs text-muted">
        <Link href="/login" className="text-accent-soft hover:underline">
          Melde dich an
        </Link>{" "}
        , um dieses Modell zu bewerten.
      </p>
    );
  }

  function submit(stars: number) {
    setValue(stars);
    setError("");
    startTransition(async () => {
      const res = await rateModel(slug, stars);
      if (res.ok) setSaved(true);
      else setError(res.error ?? "Fehler beim Speichern.");
    });
  }

  return (
    <div>
      <p className="mb-2 text-sm text-subtle">Deine Bewertung:</p>
      <div className="flex items-center gap-2">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => {
            const n = i + 1;
            const active = (hover || value) >= n;
            return (
              <button
                key={n}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => submit(n)}
                disabled={pending}
                className="p-0.5 disabled:opacity-50"
                aria-label={`${n} Sterne`}
              >
                <Star
                  size={22}
                  className={active ? "text-gold" : "text-border"}
                  fill="currentColor"
                  strokeWidth={0}
                />
              </button>
            );
          })}
        </div>
        {pending && <Loader2 size={15} className="animate-spin text-muted" />}
        {saved && !pending && (
          <span className="flex items-center gap-1 text-sm text-emerald-400">
            <Check size={15} />
            Gespeichert
          </span>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-rose-400">{error}</p>}
    </div>
  );
}
