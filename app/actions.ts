"use server";

import { revalidatePath } from "next/cache";
import { getUser, isAuthEnabled } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: boolean; error?: string };

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  error: "Anmeldung ist noch nicht aktiv (Demo-Modus).",
};
const NOT_LOGGED_IN: ActionResult = {
  ok: false,
  error: "Bitte melde dich zuerst an.",
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Modell mit 1–5 Sternen bewerten (1 Bewertung pro Nutzer/Modell). */
export async function rateModel(
  modelSlug: string,
  stars: number,
  review?: string
): Promise<ActionResult> {
  if (!isAuthEnabled()) return NOT_CONFIGURED;
  const user = await getUser();
  if (!user) return NOT_LOGGED_IN;
  if (stars < 1 || stars > 5) return { ok: false, error: "Ungültige Bewertung." };

  const supabase = createClient();
  const { data: model } = await supabase
    .from("models")
    .select("id")
    .eq("slug", modelSlug)
    .maybeSingle();
  if (!model) return { ok: false, error: "Modell nicht gefunden." };

  const { error } = await supabase
    .from("model_ratings")
    .upsert(
      { model_id: model.id, user_id: user.id, stars, review: review ?? null },
      { onConflict: "model_id,user_id" }
    );
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/models/${modelSlug}`);
  return { ok: true };
}

/** Neuen Prompt einreichen (optional als Fork). */
export async function submitPrompt(input: {
  title: string;
  body: string;
  categorySlug: string;
  description?: string;
  tags?: string[];
  forkOfSlug?: string | null;
}): Promise<ActionResult> {
  if (!isAuthEnabled()) return NOT_CONFIGURED;
  const user = await getUser();
  if (!user) return NOT_LOGGED_IN;
  if (input.title.trim().length < 3 || input.body.trim().length < 10) {
    return { ok: false, error: "Titel und Prompt sind zu kurz." };
  }

  const supabase = createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", input.categorySlug)
    .maybeSingle();

  let forkId: string | null = null;
  if (input.forkOfSlug) {
    const { data: parent } = await supabase
      .from("prompts")
      .select("id")
      .eq("slug", input.forkOfSlug)
      .maybeSingle();
    forkId = parent?.id ?? null;
  }

  const slug = `${slugify(input.title)}-${Math.random().toString(36).slice(2, 7)}`;

  const { error } = await supabase.from("prompts").insert({
    slug,
    title: input.title.trim(),
    body: input.body.trim(),
    description: input.description?.trim() || null,
    author_id: user.id,
    category_id: category?.id ?? null,
    forked_from_id: forkId,
    tags: input.tags ?? [],
    status: "published",
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/prompts");
  return { ok: true };
}

/** Prompt upvoten/Vote zurücknehmen. */
export async function togglePromptUpvote(promptSlug: string): Promise<ActionResult> {
  if (!isAuthEnabled()) return NOT_CONFIGURED;
  const user = await getUser();
  if (!user) return NOT_LOGGED_IN;

  const supabase = createClient();
  const { data: prompt } = await supabase
    .from("prompts")
    .select("id")
    .eq("slug", promptSlug)
    .maybeSingle();
  if (!prompt) return { ok: false, error: "Prompt nicht gefunden." };

  // Bestehenden Vote prüfen
  const { data: existing } = await supabase
    .from("prompt_votes")
    .select("direction")
    .eq("prompt_id", prompt.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("prompt_votes").delete().eq("prompt_id", prompt.id).eq("user_id", user.id);
  } else {
    await supabase
      .from("prompt_votes")
      .insert({ prompt_id: prompt.id, user_id: user.id, direction: "up" });
  }

  revalidatePath(`/prompts/${promptSlug}`);
  return { ok: true };
}
