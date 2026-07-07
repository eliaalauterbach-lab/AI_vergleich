import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase-Client für Client Components (Browser).
 * Gibt null zurück, solange keine ENV-Variablen gesetzt sind – so bleibt der
 * Demo-Modus ohne konfigurierte DB funktionsfähig.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
