const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {PGlite}=require('@electric-sql/pglite');
const sql=name=>fs.readFileSync('supabase/'+name+'.sql','utf8');
async function setup(){
 const db=new PGlite();
 await db.exec('create role anon; create role authenticated; create role service_role bypassrls; grant usage on schema public to anon, authenticated, service_role;');
 // Simula inclusive o padrão antigo do Supabase, que concedia acesso automaticamente.
 await db.exec('alter default privileges in schema public grant all on tables to anon, authenticated; alter default privileges in schema public grant all on sequences to anon, authenticated;');
 await db.exec(sql('bootstrap'));
 return db;
}
async function asRole(db,role,fn){await db.exec('set role '+role);try{return await fn();}finally{await db.exec('reset role');}}
const denied=promise=>assert.rejects(promise,error=>error.code==='42501');
test('bootstrap reproduces columns, identity, keys, indexes and denies early client access',async()=>{
 const db=await setup();try{
  const reference=JSON.parse(fs.readFileSync('supabase/schema-reference.json','utf8'));
  const actual=(await db.query(sql('inspect-schema'))).rows[0].snapshot;
  for(const category of ['columns','constraints','indexes'])assert.deepEqual(actual[category],reference[category],category);
  const {rows}=await db.query("select table_name,count(*)::int as columns from information_schema.columns where table_schema='public' group by table_name order by table_name");
  assert.deepEqual(rows,[{table_name:'benchmarks',columns:7},{table_name:'outcomes',columns:21},{table_name:'players',columns:6},{table_name:'sessions',columns:4}]);
  assert.equal((await db.query("select identity_generation from information_schema.columns where table_schema='public' and table_name='outcomes' and column_name='id'")).rows[0].identity_generation,'ALWAYS');
  assert.equal((await db.query("select count(*)::int as n from pg_indexes where schemaname='public'")).rows[0].n,7);
  const rls=await db.query("select relname,relrowsecurity from pg_class where oid in ('public.sessions'::regclass,'public.players'::regclass,'public.outcomes'::regclass,'public.benchmarks'::regclass)");
  assert.equal(rls.rows.length,4);assert.ok(rls.rows.every(r=>r.relrowsecurity));
  for(const role of ['anon','authenticated'])await asRole(db,role,()=>denied(db.query('select * from public.benchmarks')));
  // Reexecutar bootstrap não pode substituir dados de um banco existente.
  await db.exec("insert into public.sessions(join_code) values ('local-only')");
  await assert.rejects(db.exec(sql('bootstrap')),error=>error.code==='42P07');await db.exec('rollback');
  assert.equal((await db.query('select count(*)::int as n from public.sessions')).rows[0].n,1);
 }finally{await db.close();}
});
test('recreated privacy policies deny client writes, participant reads, sequence access and refresh',async()=>{
 const db=await setup();try{
  await db.exec(sql('privacy'));await db.exec(sql('seed-reference'));
  for(const role of ['anon','authenticated'])await asRole(db,role,async()=>{
   assert.equal((await db.query('select * from public.benchmarks')).rows.length,6);
   for(const table of ['sessions','players','outcomes','benchmarks']){
    if(table!=='benchmarks')await denied(db.query('select * from public.'+table));
    await denied(db.query('insert into public.'+table+' default values'));
    await denied(db.query('delete from public.'+table+' where false'));
    const timestamp=table==='benchmarks'?'updated_at':'created_at';
    await denied(db.query('update public.'+table+' set '+timestamp+'=now() where false'));
    await denied(db.query('truncate public.'+table));
   }
   await denied(db.query("select nextval('public.outcomes_id_seq')"));
   await denied(db.query('select public.refresh_benchmarks()'));
  });
  const fn=(await db.query("select prosecdef,proconfig from pg_proc where oid='public.refresh_benchmarks()'::regprocedure")).rows[0];
  assert.equal(fn.prosecdef,false);assert.ok(fn.proconfig.some(item=>item.startsWith('search_path=')));
  assert.equal((await db.query("select count(*)::int as n from pg_policies where schemaname='public'")).rows[0].n,1);
  await db.exec(sql('verify_privacy'));
 }finally{await db.close();}
});
test('RLS still blocks participant rows if table grants are mistakenly restored',async()=>{
 const db=await setup();try{
  await db.exec(sql('privacy'));await db.exec("insert into public.players(nickname) values ('synthetic'); grant select,insert on public.players to anon");
  await asRole(db,'anon',async()=>{
   assert.equal((await db.query('select * from public.players')).rows.length,0);
   await denied(db.query("insert into public.players(nickname) values ('blocked')"));
  });
 }finally{await db.close();}
});
test('refresh preserves empty-sample references and computes aggregate and level percentiles locally',async()=>{
 const db=await setup();try{
  await db.exec(sql('privacy'));await db.exec(sql('seed-reference'));
  const before=(await db.query('select * from public.benchmarks order by metric,student_level')).rows;
  await asRole(db,'service_role',()=>db.query('select public.refresh_benchmarks()'));
  assert.deepEqual((await db.query('select * from public.benchmarks order by metric,student_level')).rows,before);
  await db.exec(sql('privacy'));await db.exec(sql('seed-reference'));
  assert.deepEqual((await db.query('select * from public.benchmarks order by metric,student_level')).rows,before);
  await db.exec("insert into public.players(id,student_level) values ('00000000-0000-0000-0000-000000000001','grad'); insert into public.outcomes(player_id,milestones_completed,final_turn) select '00000000-0000-0000-0000-000000000001',n,n+1 from generate_series(0,3) n");
  await asRole(db,'service_role',()=>db.query('select public.refresh_benchmarks()'));
  const sample=(await db.query("select student_level,p25,p50,p75,sample_size from public.benchmarks where metric='milestones_completed' order by student_level")).rows;
  assert.equal(sample.length,2);
  for(const row of sample){assert.equal(Number(row.p25),0.75);assert.equal(Number(row.p50),1.5);assert.equal(Number(row.p75),2.25);assert.equal(row.sample_size,4);}
  const untouched=(await db.query("select sample_size from public.benchmarks where metric='peak_valuation'")).rows[0];assert.equal(untouched.sample_size,260);
  // Reaplicar referências não pode sobrescrever estatística calculada.
  await db.exec(sql('seed-reference'));
  assert.equal((await db.query("select sample_size from public.benchmarks where metric='milestones_completed' and student_level='all'")).rows[0].sample_size,4);
 }finally{await db.close();}
});
