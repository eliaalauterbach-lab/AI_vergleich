# AI-Vergleich

Performance-basiertes Vergleichssystem für KI-Modelle jeder Art — **Text, Code,
Bild, Video, Musik, Research & Marketing**. Ranglisten nach Leistung,
Modell-Steckbriefe mit Community-Bewertung, eine „Wikipedia für Prompts" mit
Forking, sowie Blind-Test-Arena und AI-Finder.

> Serverless · Dark-Mode · PWA · hält sich über APIs selbst aktuell.

## Tech-Stack

**Next.js 14 (App Router)** · **Vercel** (Hosting + Cron) · **Supabase /
PostgreSQL** (DB + Auth + RLS) · **Tailwind CSS** · **lucide-react**.

Ausführliche Begründung: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Schnellstart (lokal)

```bash
# 1. Abhängigkeiten
npm install

# 2. Environment vorbereiten
cp .env.example .env.local
#   -> Supabase-URL & Keys eintragen (ohne DB läuft es mit Demo-Daten)

# 3. Dev-Server
npm run dev            # http://localhost:3000
```

Die Startseite rendert das Leaderboard **auch ohne konfigurierte Datenbank**
(Fallback-Demodaten in `lib/data/leaderboard.ts`), damit du das Design sofort
siehst.

## Datenbank aufsetzen (Supabase)

```bash
# Migrationen im Supabase SQL-Editor oder via CLI ausführen:
supabase db push
#   0001_initial_schema.sql  -> Tabellen, Trigger, RLS, v_leaderboard
#   0002_seed_demo.sql       -> Demo-Modelle & Scores
```

## Automatisierung

`app/api/cron/sync-models/route.ts` wird täglich (04:00 UTC) von Vercel Cron
aufgerufen (`vercel.json`) und synchronisiert Modelle/Preise von OpenRouter und
Hugging Face. Absicherung über `CRON_SECRET` (Bearer-Token).

## Live schalten (Konten & Deploy)

Schritt-für-Schritt-Anleitung ohne Vorwissen (Supabase + Vercel + Login +
Automatisierung): **[`docs/SETUP.md`](docs/SETUP.md)**.

Sobald die beiden `NEXT_PUBLIC_SUPABASE_*`-Variablen gesetzt sind, schalten sich
Login und echtes Speichern (Bewertungen, Prompts, Votes) automatisch ein.

## Funktionsumfang

- **Rangliste** (`/`) — performance-basiert, mit Kategorie-Filter
- **Steckbriefe** (`/models/[slug]`) — Stärken/Schwächen, Benchmarks,
  Community-Sterne, Live-Kosten-/Speed-Rechner
- **Prompt-Bibliothek** (`/prompts`) — kategorisiert, Kopieren, Forking, Upvote,
  Einreichen
- **Blind-Test-Arena** (`/arena`) — anonymes Voting + Elo-Rangliste
- **AI-Finder** (`/finder`) — geführte Modell-Empfehlung
- **Login** (`/login`) — Magic Link (Supabase Auth)
- **PWA** — installierbar auf Desktop & Smartphone

## Projektstatus

Voll funktionsfähiges Frontend mit Demo-Daten; Auth und Schreibpfade sind
verdrahtet und aktivieren sich mit der Supabase-Verbindung. Roadmap &
Architektur in `docs/ARCHITECTURE.md`.
