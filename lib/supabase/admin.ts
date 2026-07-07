import { createClient } from "@supabase/supabase-js";

/**
 * Admin-Client mit Service-Role-Key – umgeht RLS.
 * NUR serverseitig verwenden (Cron-Jobs, Sync-Scripte). Niemals im Browser bündeln.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
