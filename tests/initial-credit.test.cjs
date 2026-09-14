const test=require('node:test'),assert=require('node:assert/strict');
const initial=require('../initial-credit'),adapter=require('../finance-adapter');
test('initial debt records included capital exactly once in all modes',()=>{
 for(const multiplier of [1,1.5])for(const extremeMode of [false,true])for(const kind of ['publicBank','family','ngo','informal']){
  const game={turn:1,funderCashMult:multiplier,extremeMode,funder:{brKind:kind},brLoans:[],metrics:{cash:0},log(){}};
  const q=initial.quote(game,kind);game.metrics.cash=q.total;initial.apply(game);
  assert.equal(game.metrics.cash,q.total);assert.equal(game.brLoans[0].principalCents,Math.round(q.principal*100000));
  assert.throws(()=>initial.apply(game),/já registrado/);
  adapter.settleQuarter(game,1);assert.equal(game.metrics.cash,q.total);
  adapter.settleQuarter(game,2);assert.ok(Math.abs(game.metrics.cash-(q.total-q.firstPayment))<1e-8);
 }
});
test('initial sources cannot grant shares or activate legacy personal debt charges',()=>{
 const original={cash:350,equity:0,stage:'bootstrap',apMod:-1,bonus:{}};
 for(const id of ['brPublic','brFamily','brNgo','brInformal']){
  const f=initial.source(id,original);assert.equal(f.equity,0);assert.equal(f.hasDebt,false);assert.equal(f.cash,430);
 }
 assert.equal(initial.source('toString',original),null);assert.equal(original.cash,350);
});
test('preflight rejects double selection, source changes and ineligible NGO before mutation',()=>{
 const game={turn:1,brLoans:[],company:{},metrics:{cash:410,hr:51}};
 assert.equal(initial.begin(game,'brNgo'),false);assert.equal(game.brInitialSelected,undefined);
 assert.equal(initial.begin(game,'brFamily'),true);const before=JSON.stringify(game);
 for(const id of ['brFamily','brPublic','personalSavings']){assert.equal(initial.begin(game,id),false);assert.equal(JSON.stringify(game),before);}
});
