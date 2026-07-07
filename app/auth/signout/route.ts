import { NextResponse } from "next/server";
import { isAuthEnabled } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  if (isAuthEnabled()) {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(`${origin}/`, { status: 303 });
}
