-- Referências históricas britânicas que já existiam no projeto em 07/09/2026.
-- Não são resultados brasileiros, dados atuais de mercado ou dados de participantes desta edição.
-- Preserva qualquer linha existente para a mesma chave.
begin;
insert into public.benchmarks(student_level, metric, p25, p50, p75, sample_size, updated_at)
values
('all','final_turn',4,5,7,260,'2026-09-07T11:38:30.335715+00:00'),
('all','final_valuation',0,0,500000,260,'2026-09-07T11:38:30.335715+00:00'),
('all','milestones_completed',0,0,1,260,'2026-09-07T11:38:30.335715+00:00'),
('all','num_funding_rounds',1,2,3,260,'2026-09-07T11:38:30.335715+00:00'),
('all','peak_valuation',500000,1500000,3000000,260,'2026-09-07T11:38:30.335715+00:00'),
('all','total_funding_raised',300000,800000,2000000,260,'2026-09-07T11:38:30.335715+00:00')
on conflict (student_level, metric) do nothing;
commit;
