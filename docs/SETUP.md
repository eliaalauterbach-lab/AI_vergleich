# Einrichtung & Live-Schaltung — Schritt für Schritt

Diese Anleitung bringt AI-Vergleich vom Demo-Modus in den echten Betrieb:
Datenbank, Login und Automatisierung. **Kein Vorwissen nötig** — folge einfach
den Schritten der Reihe nach. Alles hier ist mit dem kostenlosen Tarif machbar.

> Solange du nichts einrichtest, läuft die App mit Demo-Daten. Nichts geht
> kaputt — du schaltest die „echten" Funktionen nur nach und nach frei.

---

## Teil 1 · Datenbank & Login (Supabase)

### 1.1 Konto & Projekt anlegen
1. Gehe auf **https://supabase.com** → **Start your project** → mit GitHub oder
   E-Mail anmelden.
2. **New project** klicken.
   - *Name*: `ai-vergleich`
   - *Database Password*: ein sicheres Passwort ausdenken und **notieren**.
   - *Region*: `Central EU (Frankfurt)` (näher = schneller).
3. **Create new project** — die Einrichtung dauert ~2 Minuten.

### 1.2 Das Datenbank-Schema einspielen
1. Im Supabase-Projekt links auf **SQL Editor** → **New query**.
2. Öffne im Code die Datei `supabase/migrations/0001_initial_schema.sql`,
   kopiere den **gesamten** Inhalt, füge ihn im SQL Editor ein → **Run**.
3. Dasselbe mit `supabase/migrations/0002_seed_demo.sql` (Demo-Modelle).
   > Fertig, wenn unten „Success. No rows returned" steht.

### 1.3 Die Zugangs-Schlüssel holen
1. Links auf **Project Settings** (Zahnrad) → **API**.
2. Du brauchst drei Werte (später in Teil 3 eintragen):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
     ⚠️ Der service_role-Schlüssel ist geheim — niemals öffentlich teilen.

### 1.4 Login per E-Mail aktivieren
1. Links auf **Authentication** → **Providers** → **Email** ist standardmäßig an.
   „Confirm email" darf angeschaltet bleiben (Magic Link).
2. Unter **Authentication → URL Configuration**:
   - *Site URL*: später deine Vercel-Adresse (z.B. `https://ai-vergleich.vercel.app`).
     Für lokale Tests: `http://localhost:3000`.
   - *Redirect URLs* zusätzlich eintragen: `http://localhost:3000/auth/callback`
     und (nach dem Deploy) `https://DEINE-ADRESSE.vercel.app/auth/callback`.

---

## Teil 2 · Online stellen (Vercel)

### 2.1 Code zu GitHub
Der Code liegt bereits auf GitHub (dieser Branch). Für den Live-Betrieb sollte
er im Haupt-Branch (`main`) sein — dazu den Pull Request mergen (siehe unten).

### 2.2 Vercel verbinden
1. Gehe auf **https://vercel.com** → mit **GitHub** anmelden.
2. **Add New… → Project** → dein Repository `ai_vergleich` **Import**.
3. Framework wird als **Next.js** erkannt — nichts ändern.
4. **Vor** dem Deploy: unten **Environment Variables** aufklappen und die Werte
   aus Teil 1.3 eintragen (siehe Teil 3). Erst dann **Deploy**.
5. Nach ~1 Minute bekommst du deine Live-Adresse `https://…vercel.app`.
   → Diese Adresse in Supabase (Schritt 1.4) als Site-/Redirect-URL nachtragen.

---

## Teil 3 · Environment-Variablen (die „Schlüssel")

Diese Werte macht die App scharf. In Vercel unter
**Project → Settings → Environment Variables** eintragen (und für lokale
Entwicklung in eine Datei `.env.local` kopieren — Vorlage: `.env.example`):

| Name | Woher | Pflicht |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → API → Project URL | ✅ (Login + DB) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API → anon public | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API → service_role | für Automatisierung |
| `OPENROUTER_API_KEY` | https://openrouter.ai → Keys | für Auto-Sync |
| `HUGGINGFACE_TOKEN` | https://huggingface.co → Settings → Tokens | optional |
| `CRON_SECRET` | selbst ausdenken (langer Zufallstext) | für Auto-Sync |

> Sobald `NEXT_PUBLIC_SUPABASE_URL` + `ANON_KEY` gesetzt sind, schaltet sich der
> **Login** und das **echte Speichern** (Bewertungen, Prompts, Votes)
> automatisch ein — kein weiterer Code-Schritt nötig.

Nach dem Eintragen in Vercel einmal **Redeploy** auslösen
(Deployments → … → Redeploy), damit die Werte aktiv werden.

---

## Teil 4 · Automatisierung (optional, später)

Der tägliche Modell-Sync läuft über `vercel.json` (Cron um 04:00 UTC) und den
Endpunkt `/api/cron/sync-models`. Voraussetzung: `OPENROUTER_API_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` und `CRON_SECRET` sind gesetzt. Vercel ruft den
Endpunkt automatisch auf — du musst nichts weiter tun.

Manuell testen (nach Deploy):
```
curl -H "Authorization: Bearer DEIN_CRON_SECRET" \
  https://DEINE-ADRESSE.vercel.app/api/cron/sync-models
```

---

## Häufige Fragen

**Muss ich programmieren können?** Nein — nur kopieren, einfügen, klicken.

**Kostet das etwas?** Nein, der Start ist auf den Gratis-Tarifen von Supabase
und Vercel möglich. Erst bei viel Traffic entstehen (geringe) Kosten.

**Der Login-Link kommt nicht an?** Prüfe den Spam-Ordner und ob die Redirect-URL
in Supabase (Schritt 1.4) exakt mit deiner Adresse übereinstimmt.

**Ich sehe „Anmeldung noch nicht aktiv".** Dann fehlen die beiden
`NEXT_PUBLIC_SUPABASE_*`-Variablen (Teil 3) oder es wurde nach dem Eintragen
noch nicht neu deployed.
