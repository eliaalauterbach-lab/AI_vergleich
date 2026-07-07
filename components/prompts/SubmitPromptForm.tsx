"use client";

import { useState } from "react";
import { GitFork, Info } from "lucide-react";

const CATEGORIES = [
  { slug: "text", name: "Text" },
  { slug: "code", name: "Code" },
  { slug: "image", name: "Bild" },
  { slug: "video", name: "Video" },
  { slug: "research", name: "Research" },
  { slug: "marketing", name: "Marketing" },
  { slug: "music", name: "Musik" },
];

/**
 * Einreich-/Fork-Formular. Die Felder sind voll funktionsfähig; das
 * tatsächliche Speichern wird mit dem Auth-Schritt aktiviert (Supabase Insert
 * unter RLS). Bis dahin gibt der Submit ehrliches Feedback.
 */
export function SubmitPromptForm({
  initialTitle,
  initialBody,
  initialCategory,
  forkOf,
}: {
  initialTitle: string;
  initialBody: string;
  initialCategory: string;
  forkOf: { slug: string; title: string } | null;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState(initialCategory);
  const [description, setDescription] = useState("");
  const [body, setBody] = useState(initialBody);
  const [tags, setTags] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const valid = title.trim().length > 2 && body.trim().length > 10 && category;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {forkOf && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted">
          <GitFork size={14} className="text-accent-soft" />
          Fork von <span className="font-medium text-subtle">{forkOf.title}</span>
        </div>
      )}

      <Field label="Titel">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="z.B. Senior Code-Reviewer"
          className={inputCls}
        />
      </Field>

      <Field label="Kategorie">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
          <option value="">Bitte wählen …</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </Field>

      <Field label="Kurzbeschreibung" hint="Wofür ist der Prompt gut?">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Eine Zeile, die den Nutzen erklärt"
          className={inputCls}
        />
      </Field>

      <Field label="Prompt">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          placeholder="Der eigentliche Prompt-Text. Platzhalter in {GESCHWEIFTEN KLAMMERN} markieren."
          className={`${inputCls} resize-y font-mono`}
        />
      </Field>

      <Field label="Tags" hint="kommagetrennt">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="review, engineering, qualität"
          className={inputCls}
        />
      </Field>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={!valid}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {forkOf ? "Fork veröffentlichen" : "Prompt veröffentlichen"}
        </button>
        {!valid && (
          <span className="text-xs text-muted">Titel, Kategorie und Prompt ausfüllen.</span>
        )}
      </div>

      {submitted && (
        <div className="flex items-start gap-2 rounded-xl border border-accent/30 bg-accent-dim px-4 py-3 text-sm text-accent-soft">
          <Info size={15} className="mt-0.5 shrink-0" />
          <span>
            Alles bereit! Das Speichern wird mit der Anmeldung aktiviert (nächster
            Entwicklungsschritt). Dann landet dein Prompt direkt in der Bibliothek.
          </span>
        </div>
      )}
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/40";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-subtle">
        {label}
        {hint && <span className="text-xs font-normal text-muted">· {hint}</span>}
      </span>
      {children}
    </label>
  );
}
