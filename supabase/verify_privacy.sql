begin;
do $test$
declare before_rows jsonb; after_rows jsonb;
begin
 select jsonb_agg(to_jsonb(b) order by metric,student_level) into before_rows from public.benchmarks b;
 perform public.refresh_benchmarks();
 select jsonb_agg(to_jsonb(b) order by metric,student_level) into after_rows from public.benchmarks b;
 if before_rows is distinct from after_rows then raise exception 'refresh alterou referências sem amostra'; end if;
end;
$test$;
set local role anon;
do $test$
begin
 perform 1 from public.benchmarks limit 1;
 begin perform 1 from public.players limit 1; raise exception 'anon leu players'; exception when insufficient_privilege then null; end;
 begin insert into public.players(nickname) values ('teste-transacional'); raise exception 'anon inseriu players'; exception when insufficient_privilege then null; end;
 begin perform public.refresh_benchmarks(); raise exception 'anon executou refresh'; exception when insufficient_privilege then null; end;
end;
$test$;
reset role;
set local role authenticated;
do $test$
begin
 perform 1 from public.benchmarks limit 1;
 begin perform 1 from public.outcomes limit 1; raise exception 'authenticated leu outcomes'; exception when insufficient_privilege then null; end;
 begin insert into public.sessions(join_code) values ('teste-transacional'); raise exception 'authenticated inseriu sessions'; exception when insufficient_privilege then null; end;
 begin perform public.refresh_benchmarks(); raise exception 'authenticated executou refresh'; exception when insufficient_privilege then null; end;
end;
$test$;
reset role;
rollback;
select 'PASS: acesso restrito e referências preservadas' as verification;
