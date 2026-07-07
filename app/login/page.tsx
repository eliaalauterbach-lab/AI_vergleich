import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isAuthEnabled } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Anmelden" };

export default function LoginPage() {
  const enabled = isAuthEnabled();

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 pb-24 pt-16 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Zur Startseite
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-white">Anmelden</h1>
      <p className="mt-2 text-sm text-muted">
        Melde dich an, um Modelle zu bewerten, Prompts einzureichen und in der
        Arena abzustimmen. Wir schicken dir einen Login-Link per E-Mail –
        kein Passwort nötig.
      </p>

      <div className="mt-6">
        {enabled ? (
          <LoginForm />
        ) : (
          <div className="card p-5 text-sm text-muted">
            <p className="font-medium text-subtle">Anmeldung noch nicht aktiv</p>
            <p className="mt-1.5">
              Die App läuft aktuell im Demo-Modus. Sobald das Supabase-Projekt
              verbunden ist (siehe <code className="text-accent-soft">docs/SETUP.md</code>),
              funktioniert der Login automatisch.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
