import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Cron-Endpunkt: hält den Modell-Katalog aktuell.
 * Wird von Vercel Cron aufgerufen (siehe vercel.json). Vercel sendet den
 * Header `Authorization: Bearer $CRON_SECRET`, den wir hier prüfen.
 *
 * Vorgehen (skizziert – die Fetch-Aufrufe sind als TODO markiert):
 *   1. OpenRouter /models -> Preise, Kontextfenster, Namen
 *   2. Hugging Face Models-API -> neue Open-Weight-Modelle
 *   3. Upsert nach `models` (Deduplizierung über openrouter_id / hf_model_id)
 *   4. Ergebnis in `source_sync_log` protokollieren
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  const supabase = createAdminClient();
  let added = 0;
  let updated = 0;

  try {
    // ---- 1) OpenRouter: Preise & Modelle ------------------------------------
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
      // Cache aus – wir wollen frische Daten
      cache: "no-store",
    });

    if (res.ok) {
      const { data } = (await res.json()) as { data: OpenRouterModel[] };

      for (const model of data) {
        const [providerSlug] = model.id.split("/");
        const row = {
          slug: slugify(model.id),
          name: model.name ?? model.id,
          openrouter_id: model.id,
          context_window: model.context_length ?? null,
          price_input_usd: usdPerMillion(model.pricing?.prompt),
          price_output_usd: usdPerMillion(model.pricing?.completion),
          modalities: inferModalities(model),
          source: "openrouter",
          last_synced_at: new Date().toISOString(),
        };

        const { data: up, error } = await supabase
          .from("models")
          .upsert(row, { onConflict: "openrouter_id" })
          .select("id")
          .single();

        if (!error && up) {
          // Grobe Heuristik für added/updated – exakt via RETURNING xmax möglich.
          updated++;
        }
        void providerSlug;
      }
    }

    // ---- 2) Hugging Face: neue Open-Weight-Modelle --------------------------
    // TODO: https://huggingface.co/api/models?sort=trending&limit=50 auswerten
    //       und analog upserten (onConflict: "hf_model_id").

    await supabase.from("source_sync_log").insert({
      source: "openrouter",
      status: "success",
      models_added: added,
      models_updated: updated,
      duration_ms: Date.now() - started,
    });

    return NextResponse.json({ ok: true, added, updated });
  } catch (err) {
    await supabase.from("source_sync_log").insert({
      source: "openrouter",
      status: "error",
      message: err instanceof Error ? err.message : String(err),
      duration_ms: Date.now() - started,
    });
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// --- Helfer -----------------------------------------------------------------
interface OpenRouterModel {
  id: string;
  name?: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string };
  architecture?: { modality?: string };
}

/** OpenRouter liefert Preis pro Token als String -> USD pro 1M Tokens. */
function usdPerMillion(price?: string): number | null {
  if (!price) return null;
  const n = Number(price);
  return Number.isFinite(n) ? Math.round(n * 1_000_000 * 10000) / 10000 : null;
}

function inferModalities(m: OpenRouterModel): string[] {
  const mod = m.architecture?.modality ?? "text";
  if (mod.includes("image")) return ["text", "image", "multimodal"];
  return ["text"];
}

function slugify(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
