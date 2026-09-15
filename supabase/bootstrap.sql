-- Retrato do esquema consultado em 15/09/2026 no projeto slingshot-pt-br.
-- Apenas para recriação em projeto Supabase vazio. Não executar no projeto existente.
-- Falha se as tabelas já existirem; não apaga, substitui ou mescla dados.
-- Após este arquivo, executar privacy.sql e, opcionalmente, seed-reference.sql.
begin;
create table public.sessions (
  id uuid not null default gen_random_uuid(),
  join_code text,
  student_level text,
  created_at timestamptz not null default now(),
  constraint sessions_pkey primary key (id),
  constraint sessions_join_code_key unique (join_code)
);
create table public.players (
  id uuid not null default gen_random_uuid(),
  session_id uuid,
  nickname text,
  student_level text,
  finished boolean not null default false,
  created_at timestamptz not null default now(),
  constraint players_pkey primary key (id),
  constraint players_session_id_fkey foreign key (session_id) references public.sessions(id)
);
create table public.outcomes (
  id bigint generated always as identity not null,
  player_id uuid,
  founder_type text,
  sector text,
  location text,
  funding_path text,
  end_reason text,
  final_turn integer,
  final_cash numeric,
  milestones_completed integer,
  total_funding_raised numeric,
  num_funding_rounds integer,
  peak_valuation numeric,
  final_valuation numeric,
  final_revenue numeric,
  final_customers numeric,
  final_staff numeric,
  engagement_mins integer,
  engagement_score integer,
  detail jsonb,
  created_at timestamptz not null default now(),
  constraint outcomes_pkey primary key (id),
  constraint outcomes_player_id_fkey foreign key (player_id) references public.players(id)
);
create table public.benchmarks (
  student_level text not null,
  metric text not null,
  p25 numeric,
  p50 numeric,
  p75 numeric,
  sample_size integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint benchmarks_pkey primary key (student_level, metric)
);
create index idx_players_session_id on public.players(session_id);
create index idx_outcomes_player_id on public.outcomes(player_id);

-- Fecha o acesso desde a criação, inclusive em projetos com grants automáticos.
alter table public.sessions enable row level security;
alter table public.players enable row level security;
alter table public.outcomes enable row level security;
alter table public.benchmarks enable row level security;
revoke all on table public.sessions, public.players, public.outcomes, public.benchmarks from public, anon, authenticated;
revoke all on sequence public.outcomes_id_seq from public, anon, authenticated;
grant all on table public.sessions, public.players, public.outcomes, public.benchmarks to service_role;
grant all on sequence public.outcomes_id_seq to service_role;
commit;
