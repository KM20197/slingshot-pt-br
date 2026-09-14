-- Privacidade aprovada: sem coleta de participantes; referências preservadas.
begin;
revoke all on table public.sessions, public.players, public.outcomes, public.benchmarks from public, anon, authenticated;
revoke all on sequence public.outcomes_id_seq from public, anon, authenticated;
alter table public.sessions enable row level security;
alter table public.players enable row level security;
alter table public.outcomes enable row level security;
alter table public.benchmarks enable row level security;
drop policy if exists sessions_select_anon on public.sessions;
drop policy if exists players_select_anon on public.players;
drop policy if exists players_insert_anon on public.players;
drop policy if exists players_update_anon on public.players;
drop policy if exists outcomes_select_anon on public.outcomes;
drop policy if exists outcomes_insert_anon on public.outcomes;
drop policy if exists benchmarks_select_anon on public.benchmarks;
grant select on public.benchmarks to anon, authenticated;
drop policy if exists benchmarks_read_reference on public.benchmarks;
create policy benchmarks_read_reference on public.benchmarks for select to anon, authenticated using (true);
create or replace function public.refresh_benchmarks()
returns void language plpgsql security invoker set search_path = '' as $body$
declare
  m text;
  metrics constant text[] := array['milestones_completed','final_turn','peak_valuation','total_funding_raised','num_funding_rounds','final_valuation'];
begin
  -- Não apaga os dados de referência quando não há amostra válida.
  foreach m in array metrics loop
    insert into public.benchmarks(student_level,metric,p25,p50,p75,sample_size,updated_at)
    select grouped.level, m,
      percentile_cont(0.25) within group (order by grouped.value),
      percentile_cont(0.50) within group (order by grouped.value),
      percentile_cont(0.75) within group (order by grouped.value),
      count(grouped.value)::integer, now()
    from (
      select 'all'::text as level, (to_jsonb(o)->>m)::numeric as value from public.outcomes o
      union all
      select p.student_level, (to_jsonb(o)->>m)::numeric
      from public.outcomes o join public.players p on p.id=o.player_id
      where p.student_level is not null and p.student_level <> 'all'
    ) grouped
    where grouped.value is not null
    group by grouped.level
    having count(grouped.value)>0
    on conflict (student_level,metric) do update set
      p25=excluded.p25,p50=excluded.p50,p75=excluded.p75,
      sample_size=excluded.sample_size,updated_at=excluded.updated_at;
  end loop;
end;
$body$;
revoke all on function public.refresh_benchmarks() from public, anon, authenticated;
grant execute on function public.refresh_benchmarks() to service_role;
comment on function public.refresh_benchmarks() is 'Operação administrativa; o jogo brasileiro não coleta partidas. Preserva referências sem amostra.';
commit;
