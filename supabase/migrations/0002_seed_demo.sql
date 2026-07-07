-- =============================================================================
-- AI-Vergleich · Demo-Seed (Migration 0002)
-- Minimaldatensatz, damit Leaderboard & Steckbriefe sofort etwas anzeigen.
-- In Produktion werden diese Daten vom Sync-Script (HF/OpenRouter) überschrieben.
-- =============================================================================

insert into providers (slug, name, website_url) values
  ('openai',    'OpenAI',    'https://openai.com'),
  ('anthropic', 'Anthropic', 'https://anthropic.com'),
  ('google',    'Google',    'https://deepmind.google'),
  ('meta',      'Meta',      'https://ai.meta.com'),
  ('mistral',   'Mistral AI','https://mistral.ai')
on conflict (slug) do nothing;

insert into categories (slug, name, modality, icon, sort_order) values
  ('text',      'Text & Chat',   'text',      'MessageSquare', 1),
  ('code',      'Code',          'code',      'Code',          2),
  ('image',     'Bildgenerierung','image',    'Image',         3),
  ('video',     'Video',         'video',     'Video',         4),
  ('research',  'Research',      'research',  'FlaskConical',  5),
  ('marketing', 'Marketing',     'marketing', 'Megaphone',     6),
  ('music',     'Musik',         'music',     'Music',         7)
on conflict (slug) do nothing;

insert into benchmarks (slug, name, unit, higher_is_better, max_value) values
  ('mmlu',       'MMLU',        '%',   true, 100),
  ('humaneval',  'HumanEval',   '%',   true, 100),
  ('arena-elo',  'LMSYS Arena', 'elo', true, null)
on conflict (slug) do nothing;

-- Modelle
insert into models (slug, name, provider_id, modalities, license, context_window,
                    price_input_usd, price_output_usd, throughput_tps, logo_url, source)
values
  ('claude-opus',   'Claude Opus',    (select id from providers where slug='anthropic'),
     '{text,code,multimodal}', 'proprietary', 200000, 15.0, 75.0, 62, null, 'manual'),
  ('gpt-flagship',  'GPT Flagship',   (select id from providers where slug='openai'),
     '{text,code,multimodal}', 'proprietary', 128000, 10.0, 30.0, 80, null, 'manual'),
  ('gemini-pro',    'Gemini Pro',     (select id from providers where slug='google'),
     '{text,code,multimodal}', 'proprietary', 1000000, 7.0, 21.0, 95, null, 'manual'),
  ('llama-large',   'Llama Large',    (select id from providers where slug='meta'),
     '{text,code}', 'open_weight', 128000, 0.9, 0.9, 120, null, 'manual'),
  ('mistral-large', 'Mistral Large',  (select id from providers where slug='mistral'),
     '{text,code}', 'open_weight', 128000, 2.0, 6.0, 110, null, 'manual')
on conflict (slug) do nothing;

-- Scores (normalized 0-100) für die Leaderboard-View
insert into model_scores (model_id, benchmark_id, raw_score, normalized, measured_at, source)
select m.id, b.id, v.raw, v.norm, current_date, 'seed'
from (values
  ('claude-opus',   'mmlu',      88.0, 94.0),
  ('claude-opus',   'humaneval', 92.0, 96.0),
  ('gpt-flagship',  'mmlu',      86.5, 91.0),
  ('gpt-flagship',  'humaneval', 90.0, 93.0),
  ('gemini-pro',    'mmlu',      85.0, 89.0),
  ('gemini-pro',    'humaneval', 84.0, 87.0),
  ('mistral-large', 'mmlu',      81.0, 82.0),
  ('mistral-large', 'humaneval', 79.0, 80.0),
  ('llama-large',   'mmlu',      79.0, 78.0),
  ('llama-large',   'humaneval', 74.0, 74.0)
) as v(model_slug, bench_slug, raw, norm)
join models m     on m.slug = v.model_slug
join benchmarks b on b.slug = v.bench_slug
on conflict (model_id, benchmark_id, measured_at) do nothing;
