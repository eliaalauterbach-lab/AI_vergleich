import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Supabase-Client für Server Components / Route Handlers.
 * Nutzt den anon-Key; RLS schützt die Daten. Für Cron-Scripte stattdessen
 * den Service-Role-Key verwenden (siehe lib/supabase/admin.ts).
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // In Server Components ist set() nicht immer erlaubt – ignorieren.
          }
        },
      },
    }
  );
}
