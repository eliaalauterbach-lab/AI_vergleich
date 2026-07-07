"use client";

import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/** Magic-Link-Login: E-Mail eingeben, Login-Link erhalten. */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    setStatus("sending");
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="card flex items-start gap-3 p-5">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
          <Check size={16} />
        </span>
        <div className="text-sm">
          <p className="font-medium text-white">Prüfe dein Postfach</p>
          <p className="mt-1 text-muted">
            Wir haben einen Login-Link an <strong className="text-subtle">{email}</strong>{" "}
            geschickt. Klicke ihn an, um dich anzumelden.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-subtle">E-Mail-Adresse</span>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="du@beispiel.de"
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/40"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
        Login-Link senden
      </button>

      {status === "error" && <p className="text-sm text-rose-400">{error}</p>}
    </form>
  );
}
