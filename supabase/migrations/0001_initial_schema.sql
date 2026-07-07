-- =============================================================================
-- AI-Vergleich · Initiales Datenbank-Schema (PostgreSQL / Supabase)
-- Migration 0001
--
-- Deckt die Grundpfeiler ab:
--   1. Performance-Ranglisten (models, benchmarks, model_scores)
--   2. Modell-Steckbriefe (models, model_pros_cons, model_ratings)
--   3. Prompt-Wikipedia (prompts, kategorisiert)
--   4. Community (prompt_votes, prompt forks, comments)
--   5. Automatisierung (source_sync_log, external ids)
--   6. Blind-Test / Elo (arena_matches)
--
-- Konventionen:
--   * UUID Primary Keys (gen_random_uuid)
--   * created_at / updated_at mit Triggern
--   * Referenz auf Supabase auth.users(id) für alle Nutzerdaten
--   * Row Level Security (RLS) am Ende aktiviert
-- =============================================================================

create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "pg_trgm";        -- Fuzzy-Suche / Volltext-Fallback

-- -----------------------------------------------------------------------------
-- Hilfsfunktion: updated_at automatisch pflegen
-- -----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- 0. ENUMS
-- =============================================================================
create type modality      as enum ('text','code','image','video','audio','music','research','marketing','multimodal');
create type license_type   as enum ('proprietary','open_weight','open_source','unknown');
create type prompt_status  as enum ('draft','published','archived');
create type vote_direction as enum ('up','down');

-- =============================================================================
-- 1. PROFILES  (1:1 zu auth.users, öffentlich sichtbares Nutzerprofil)
-- =============================================================================
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null,
  display_name text,
  avatar_url   text,
  bio          text,
  reputation   integer not null default 0,          -- steigt durch Upvotes / Beiträge
  role         text not null default 'user'          -- 'user' | 'moderator' | 'admin'
                 check (role in ('user','moderator','admin')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- =============================================================================
-- 2. KATEGORIEN  (gemeinsame Taxonomie für Modelle UND Prompts)
--    Selbstreferenzierend -> Baumstruktur (z.B. Text > Coding > Refactoring)
-- =============================================================================
create table categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  modality    modality,                              -- optionale Haupt-Modalität
  parent_id   uuid references categories(id) on delete set null,
  icon        text,                                  -- Lucide-Icon-Name o.ä.
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index idx_categories_parent on categories(parent_id);

-- =============================================================================
-- 3. PROVIDERS  (OpenAI, Anthropic, Google, Meta, Mistral ...)
-- =============================================================================
create table providers (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  website_url text,
  logo_url    text,
  created_at  timestamptz not null default now()
);

-- =============================================================================
-- 4. MODELS  (Steckbrief-Kern + Automatisierungs-Metadaten)
-- =============================================================================
create table models (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name              text not null,
  provider_id       uuid references providers(id) on delete set null,
  description       text,
  modalities        modality[] not null default '{}',
  license           license_type not null default 'unknown',
  release_date      date,
  context_window    integer,                          -- Tokens
  -- Live-Kosten-/Speed-Rechner (Preise in USD pro 1M Tokens)
  price_input_usd   numeric(10,4),
  price_output_usd  numeric(10,4),
  throughput_tps    numeric(10,2),                    -- Tokens/Sekunde (Median)
  latency_ms        numeric(10,2),                    -- Time-to-first-token
  -- Community-Aggregat (denormalisiert, per Trigger aus model_ratings gepflegt)
  rating_avg        numeric(3,2) not null default 0,  -- 0.00 - 5.00
  rating_count      integer not null default 0,
  logo_url          text,
  is_active         boolean not null default true,
  -- Automatisierung: externe IDs damit Sync-Scripte deduplizieren können
  hf_model_id       text,                             -- Hugging Face
  openrouter_id     text,                             -- OpenRouter
  source            text not null default 'manual',   -- 'manual' | 'huggingface' | 'openrouter'
  last_synced_at    timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (hf_model_id),
  unique (openrouter_id)
);
create trigger trg_models_updated before update on models
  for each row execute function set_updated_at();
create index idx_models_modalities on models using gin (modalities);
create index idx_models_provider   on models(provider_id);
create index idx_models_name_trgm  on models using gin (name gin_trgm_ops);

-- Verknüpfung Modell <-> Kategorie (n:m)
create table model_categories (
  model_id    uuid references models(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (model_id, category_id)
);

-- Stärken / Schwächen (Steckbrief)
create table model_pros_cons (
  id        uuid primary key default gen_random_uuid(),
  model_id  uuid not null references models(id) on delete cascade,
  kind      text not null check (kind in ('pro','con')),
  text      text not null,
  sort_order integer not null default 0
);
create index idx_pros_cons_model on model_pros_cons(model_id);

-- =============================================================================
-- 5. BENCHMARKS & SCORES  (Grundlage der performance-basierten Rangliste)
-- =============================================================================
create table benchmarks (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,                          -- z.B. "MMLU", "HumanEval", "LMSYS Arena"
  description text,
  category_id uuid references categories(id) on delete set null,
  unit        text,                                   -- '%', 'elo', 'pass@1' ...
  higher_is_better boolean not null default true,
  max_value   numeric,                                -- für Normalisierung (optional)
  created_at  timestamptz not null default now()
);

create table model_scores (
  id            uuid primary key default gen_random_uuid(),
  model_id      uuid not null references models(id) on delete cascade,
  benchmark_id  uuid not null references benchmarks(id) on delete cascade,
  raw_score     numeric not null,
  normalized    numeric,                              -- 0-100, per Sync-Script berechnet
  measured_at   date,
  source        text not null default 'manual',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (model_id, benchmark_id, measured_at)
);
create trigger trg_scores_updated before update on model_scores
  for each row execute function set_updated_at();
create index idx_scores_benchmark on model_scores(benchmark_id);
create index idx_scores_model      on model_scores(model_id);

-- =============================================================================
-- 6. MODEL RATINGS  (Community 0-5 Sterne, 1 Bewertung pro Nutzer/Modell)
-- =============================================================================
create table model_ratings (
  id         uuid primary key default gen_random_uuid(),
  model_id   uuid not null references models(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  stars      smallint not null check (stars between 1 and 5),
  review     text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (model_id, user_id)
);
create trigger trg_ratings_updated before update on model_ratings
  for each row execute function set_updated_at();

-- Aggregat auf models neu berechnen (Trigger)
create or replace function refresh_model_rating()
returns trigger language plpgsql as $$
declare
  target uuid := coalesce(new.model_id, old.model_id);
begin
  update models m set
    rating_avg = coalesce((select round(avg(stars)::numeric, 2) from model_ratings where model_id = target), 0),
    rating_count = (select count(*) from model_ratings where model_id = target)
  where m.id = target;
  return null;
end;
$$;
create trigger trg_refresh_rating
  after insert or update or delete on model_ratings
  for each row execute function refresh_model_rating();

-- =============================================================================
-- 7. PROMPTS  ("Wikipedia für Prompts" + Forking + Status)
-- =============================================================================
create table prompts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  body          text not null,                        -- der eigentliche Prompt
  description   text,                                 -- Erläuterung / Use-Case
  author_id     uuid references auth.users(id) on delete set null,
  category_id   uuid references categories(id) on delete set null,
  -- Empfohlenes Modell für diesen Prompt (optional)
  recommended_model_id uuid references models(id) on delete set null,
  -- Forking: Verweis auf den Ur-Prompt
  forked_from_id uuid references prompts(id) on delete set null,
  fork_count    integer not null default 0,
  status        prompt_status not null default 'published',
  -- Community-Aggregate (per Trigger gepflegt)
  upvotes       integer not null default 0,
  downvotes     integer not null default 0,
  score         integer not null default 0,           -- upvotes - downvotes (für Sortierung)
  tags          text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger trg_prompts_updated before update on prompts
  for each row execute function set_updated_at();
create index idx_prompts_category on prompts(category_id);
create index idx_prompts_author   on prompts(author_id);
create index idx_prompts_forked   on prompts(forked_from_id);
create index idx_prompts_tags      on prompts using gin (tags);
create index idx_prompts_search    on prompts using gin (title gin_trgm_ops);

-- Fork-Zähler pflegen
create or replace function bump_fork_count()
returns trigger language plpgsql as $$
begin
  if new.forked_from_id is not null then
    update prompts set fork_count = fork_count + 1 where id = new.forked_from_id;
  end if;
  return new;
end;
$$;
create trigger trg_bump_fork after insert on prompts
  for each row execute function bump_fork_count();

-- =============================================================================
-- 8. PROMPT VOTES  (Upvote/Downvote, 1 Stimme pro Nutzer/Prompt)
-- =============================================================================
create table prompt_votes (
  prompt_id  uuid not null references prompts(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  direction  vote_direction not null,
  created_at timestamptz not null default now(),
  primary key (prompt_id, user_id)
);

create or replace function refresh_prompt_score()
returns trigger language plpgsql as $$
declare
  target uuid := coalesce(new.prompt_id, old.prompt_id);
begin
  update prompts p set
    upvotes   = (select count(*) from prompt_votes where prompt_id = target and direction = 'up'),
    downvotes = (select count(*) from prompt_votes where prompt_id = target and direction = 'down'),
    score     = (select count(*) filter (where direction='up') - count(*) filter (where direction='down')
                 from prompt_votes where prompt_id = target)
  where p.id = target;
  return null;
end;
$$;
create trigger trg_refresh_prompt_score
  after insert or update or delete on prompt_votes
  for each row execute function refresh_prompt_score();

-- =============================================================================
-- 9. COMMENTS  (Community-Austausch: an Modellen ODER Prompts, verschachtelt)
-- =============================================================================
create table comments (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references auth.users(id) on delete cascade,
  body       text not null,
  parent_id  uuid references comments(id) on delete cascade,   -- Threads
  model_id   uuid references models(id)  on delete cascade,
  prompt_id  uuid references prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- exakt ein Ziel (Modell ODER Prompt)
  check ((model_id is not null)::int + (prompt_id is not null)::int = 1)
);
create trigger trg_comments_updated before update on comments
  for each row execute function set_updated_at();
create index idx_comments_model  on comments(model_id);
create index idx_comments_prompt on comments(prompt_id);

-- =============================================================================
-- 10. ARENA / BLIND-TEST  (Elo wie LMSYS)
-- =============================================================================
create table arena_matches (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid references categories(id) on delete set null,
  prompt_text  text not null,
  model_a_id   uuid not null references models(id) on delete cascade,
  model_b_id   uuid not null references models(id) on delete cascade,
  response_a   text,
  response_b   text,
  -- 'a' | 'b' | 'tie' | 'both_bad'
  winner       text check (winner in ('a','b','tie','both_bad')),
  voter_id     uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);
create index idx_arena_models on arena_matches(model_a_id, model_b_id);

-- Elo-Rating je Modell/Kategorie (vom Batch-Script aktualisiert)
create table model_elo (
  model_id    uuid not null references models(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  rating      numeric not null default 1000,
  games       integer not null default 0,
  updated_at  timestamptz not null default now(),
  primary key (model_id, category_id)
);

-- =============================================================================
-- 11. SYNC-LOG  (Nachvollziehbarkeit der Cloud-Automatisierung)
-- =============================================================================
create table source_sync_log (
  id          uuid primary key default gen_random_uuid(),
  source      text not null,                          -- 'huggingface' | 'openrouter' ...
  status      text not null,                          -- 'success' | 'error' | 'partial'
  models_added   integer not null default 0,
  models_updated integer not null default 0,
  message     text,
  duration_ms integer,
  created_at  timestamptz not null default now()
);
create index idx_sync_log_created on source_sync_log(created_at desc);

-- =============================================================================
-- 12. VIEW: Leaderboard (aggregiert für die Startseite)
--     Durchschnitt der normalisierten Benchmark-Scores pro Modell.
-- =============================================================================
create or replace view v_leaderboard as
select
  m.id,
  m.slug,
  m.name,
  m.logo_url,
  m.modalities,
  m.rating_avg,
  m.rating_count,
  m.price_input_usd,
  m.price_output_usd,
  m.throughput_tps,
  p.name  as provider_name,
  p.slug  as provider_slug,
  p.logo_url as provider_logo_url,
  round(avg(s.normalized), 1) as performance_score,   -- 0-100
  count(distinct s.benchmark_id) as benchmark_count
from models m
left join providers p    on p.id = m.provider_id
left join model_scores s on s.model_id = m.id and s.normalized is not null
where m.is_active
group by m.id, p.name, p.slug, p.logo_url;

-- =============================================================================
-- 13. ROW LEVEL SECURITY
--     Öffentlicher Lesezugriff auf Katalogdaten, Schreiben nur für Eigentümer.
--     Service-Role (Cron-Scripte) umgeht RLS automatisch.
-- =============================================================================
alter table profiles        enable row level security;
alter table models          enable row level security;
alter table prompts         enable row level security;
alter table model_ratings   enable row level security;
alter table prompt_votes    enable row level security;
alter table comments        enable row level security;
alter table arena_matches   enable row level security;

-- Lesen für alle
create policy "public read profiles" on profiles for select using (true);
create policy "public read models"   on models   for select using (true);
create policy "public read prompts"  on prompts  for select using (status = 'published' or author_id = auth.uid());

-- Profile: nur sich selbst bearbeiten
create policy "own profile upsert" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Ratings: eigene verwalten, alle lesen
create policy "read ratings"   on model_ratings for select using (true);
create policy "own ratings"    on model_ratings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Prompts: Autor darf schreiben
create policy "insert own prompt" on prompts
  for insert with check (auth.uid() = author_id);
create policy "update own prompt" on prompts
  for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "delete own prompt" on prompts
  for delete using (auth.uid() = author_id);

-- Votes: eigene verwalten, alle lesen
create policy "read votes" on prompt_votes for select using (true);
create policy "own votes"  on prompt_votes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Kommentare: lesen alle, schreiben eingeloggt & Eigentümer
create policy "read comments"   on comments for select using (true);
create policy "insert comment"  on comments for insert with check (auth.uid() = author_id);
create policy "update comment"  on comments for update using (auth.uid() = author_id);
create policy "delete comment"  on comments for delete using (auth.uid() = author_id);

-- Arena: jeder darf Votes abgeben (anonym erlaubt), lesen alle
create policy "read arena"   on arena_matches for select using (true);
create policy "insert arena" on arena_matches for insert with check (true);
