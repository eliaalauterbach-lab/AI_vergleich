import type { User } from "@supabase/supabase-js";

/** Aktuellen Nutzer serverseitig lesen. Ohne Supabase-Konfiguration → null. */
export async function getUser(): Promise<User | null> {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasSupabase) return null;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** Ob Auth grundsätzlich verfügbar ist (Supabase konfiguriert). */
export function isAuthEnabled(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
