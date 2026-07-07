# Modelist · Architektur & Tech-Stack

Serverless, Pay-per-Use, kosteneffizient. Kein eigener Server, keine Fixkosten
im Leerlauf — skaliert von 0 bis viral.

## 1. Cloud- & Tech-Stack (Empfehlung)

| Schicht | Wahl | Warum |
|---|---|---|
| **Framework** | **Next.js 14 (App Router)** | Server Components → schnelle, SEO-starke Seiten (wichtig für Desktop/Copy-Paste); API-Routes für Backend-Logik; native PWA-Unterstützung. |
| **Hosting** | **Vercel** | Zero-Config-Deploy, globales CDN/Edge, Pay-per-Use (großzügiges Free-Tier). Cron-Jobs inklusive. |
| **DB + Auth** | **Supabase (PostgreSQL)** | Managed Postgres, Row Level Security, Auth (Magic Link / OAuth), Storage für Logos, Realtime für Community-Features. Free-Tier deckt den Start. |
| **Automatisierung** | **Vercel Cron → Next.js Route Handler** | Täglicher Sync gegen OpenRouter/Hugging Face. Kein separater Worker nötig. |
| **Styling** | **Tailwind CSS** | Schlichtes, konsistentes Dark-Mode-Design ohne CSS-Wildwuchs. |
| **Icons** | **lucide-react** | Leichtgewichtig, einheitlicher Strichstil. |
| **PWA** | **Web Manifest + Service Worker** | Installierbar auf dem Smartphone, offline-fähige Shell. |

**Kostenlogik:** Vercel + Supabase starten kostenlos und rechnen danach nach
Nutzung ab. Keine Server, die 24/7 Geld kosten. Externe APIs (HF/OpenRouter)
werden nur 1×/Tag vom Cron-Job abgefragt → minimaler Verbrauch.

### Warum diese Kombination die 6 Grundpfeiler trägt
1. **Performance-Rangliste** → View `v_leaderboard` aggregiert normalisierte Benchmark-Scores.
2. **Steckbriefe** → `models` + `model_pros_cons` + `model_ratings` (0–5 Sterne, RLS-geschützt).
3. **Prompt-Wikipedia** → `prompts` mit `categories`-Baum + Volltext (pg_trgm).
4. **Community** → `prompt_votes` (Upvote), `forked_from_id` (Forking), `comments` (Austausch).
5. **Automatisierung** → Cron-Route + `source_sync_log`, Dedup über `openrouter_id`/`hf_model_id`.
6. **Design** → Tailwind Dark-Mode-Tokens (`base`/`surface`/`accent`).

## 2. Datenmodell (Kurzüberblick)

```
auth.users ─1:1─ profiles
providers ─1:n─ models ─n:m─ categories
                 models ─1:n─ model_pros_cons
                 models ─1:n─ model_scores ─n:1─ benchmarks   → v_leaderboard
                 models ─1:n─ model_ratings (0–5 ⭐)
                 models ─1:n─ model_elo (Arena)
categories ─1:n─ prompts ─1:n─ prompt_votes
                 prompts ─self─ forked_from_id (Forking)
                 prompts ─1:n─ comments
arena_matches (Blind-Test / Elo)
source_sync_log (Automatisierungs-Audit)
```

Vollständiges SQL: `supabase/migrations/0001_initial_schema.sql`.
Aggregate (`rating_avg`, `score`, `fork_count`) werden per **DB-Trigger**
gepflegt — die App muss nie manuell nachzählen.

## 3. Verzeichnisstruktur

```
app/
  layout.tsx            Root-Layout + Metadaten/PWA
  page.tsx              Startseite: Hero + Kategorie-Filter + Leaderboard
  api/cron/sync-models  Vercel-Cron-Endpunkt (Automatisierung)
components/
  leaderboard/          Leaderboard, RankBadge, ScoreBar
  ui/                   StarRating (wiederverwendbar)
lib/
  supabase/             server.ts (RLS) · admin.ts (Service-Role für Cron)
  data/leaderboard.ts   Daten-Layer mit Demo-Fallback
  format.ts             UI-Formatierung
supabase/migrations/    Schema + Seed
types/                  Domänen-Typen
```

## 4. Nächste Schritte (Roadmap)
- [ ] Modell-Steckbrief-Seite `app/models/[slug]/page.tsx`
- [ ] Auth-Flow (Supabase Magic Link) + Sterne-Bewertung schreiben
- [ ] Prompt-Bibliothek + Forking-UI
- [ ] Blind-Test-Arena mit Elo-Berechnung (Cron-Batch)
- [ ] AI-Finder-Assistent (LLM-gestützte Empfehlung)
- [ ] Service Worker für vollständige PWA-Offline-Shell
```
