-- Consulta somente metadados, sem ler registros de participantes.
select jsonb_build_object(
 'columns',(
  select jsonb_agg(jsonb_build_object(
   'table',r.relname,'column',a.attname,'type',format_type(a.atttypid,a.atttypmod),
   'nullable',not a.attnotnull,'default',pg_get_expr(d.adbin,d.adrelid),'identity',a.attidentity
  ) order by r.relname,a.attnum)
  from pg_attribute a join pg_class r on r.oid=a.attrelid
  join pg_namespace n on n.oid=r.relnamespace
  left join pg_attrdef d on d.adrelid=r.oid and d.adnum=a.attnum
  where n.nspname='public' and r.relname in ('sessions','players','outcomes','benchmarks')
   and a.attnum>0 and not a.attisdropped
 ),
 'constraints',(
  select jsonb_agg(jsonb_build_object('table',r.relname,'name',c.conname,'definition',pg_get_constraintdef(c.oid)) order by r.relname,c.conname)
  from pg_constraint c join pg_class r on r.oid=c.conrelid join pg_namespace n on n.oid=r.relnamespace
  -- NOT NULL também aparece neste catálogo em versões recentes do PostgreSQL.
  -- A equivalência dessa propriedade é conferida em columns.nullable acima.
  where n.nspname='public' and r.relname in ('sessions','players','outcomes','benchmarks') and c.contype <> 'n'
 ),
 'indexes',(
  select jsonb_agg(indexdef order by tablename,indexname) from pg_indexes
  where schemaname='public' and tablename in ('sessions','players','outcomes','benchmarks')
 )
) as snapshot;
