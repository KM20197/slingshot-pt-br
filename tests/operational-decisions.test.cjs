const test=require('node:test');
const assert=require('node:assert/strict');
const operations=require('../operations-runtime');
const decisions=require('../operational-decisions-runtime');
const fs=require('node:fs');
const patch=require('../tools/operational-decisions-patch.cjs');
const game=id=>({company:{id},turn:1,metrics:{dev:24,hr:20,mkt:30},choices:{},log(){}});

test('L3g exposes exactly three non-employment operational fronts for the representative trio',()=>{
 for(const id of ['avam','dream','quant']){
  const g=game(id);assert.equal(decisions.enabled(g),true);assert.equal(decisions.select(g),true);
  assert.deepEqual(Object.keys(g.currentEvents).sort(),['comercial','controle','operacao']);
  for(const event of Object.values(g.currentEvents))assert.equal(event.event.choices.length,3);
 }
 assert.equal(decisions.enabled(game('aether')),false);
});

test('L3h extends the same bounded operational decisions only to the approved retail group',()=>{
 for(const id of ['vanguard','legal','arene']){
  const g=game(id);assert.equal(decisions.enabled(g),true);assert.equal(decisions.select(g),true);
  assert.deepEqual(Object.keys(g.currentEvents).sort(),['comercial','controle','operacao']);
  for(const event of Object.values(g.currentEvents))assert.equal(event.event.choices.length,3);
 }
 assert.equal(decisions.enabled(game('aether')),false);
});

test('operational choices queue only a one-quarter typed effect and preserve the employment model',()=>{
 const g=game('avam');operations.init(g);decisions.select(g);
 assert.equal(decisions.confirm(g,'operacao',1),true);
 assert.equal(decisions.confirm(g,'controle',1),true);
 assert.equal(decisions.confirm(g,'comercial',1),true);
 assert.equal(decisions.allChosen(g),true);
 assert.equal(decisions.apply(g),6);
 assert.equal(decisions.apply(g),0);
 assert.equal(g.brOperations.decisionEffects.demand,1.1);assert.ok(Math.abs(g.brOperations.decisionEffects.capacity-1.0815)<1e-9);assert.equal(g.brOperations.decisionEffects.quality,1.08);assert.equal(g.brOperations.decisionEffects.inventoryTarget,1.15);
 assert.equal(g.team,undefined);
 operations.advance(g);
 assert.deepEqual(g.brOperations.decisionEffects,{demand:1,capacity:1,quality:1,inventoryTarget:1});
});

test('operational decision state survives validation and malformed decision multipliers are refused',()=>{
 const g=game('dream');operations.init(g);operations.advance(g);g.turn=2;decisions.select(g);decisions.confirm(g,'operacao',1);decisions.apply(g);
 const saved={companyId:'dream',turn:2,brOperations:structuredClone(g.brOperations)};
 assert.equal(operations.validate(saved),true);
  saved.brOperations.decisionEffects.demand=0;
  assert.throws(()=>operations.validate(saved));
 saved.brOperations.decisionEffects.demand=1;saved.brOperations.decisionVersion=2;
 assert.throws(()=>operations.validate(saved));
 saved.brOperations.decisionVersion=1;saved.brOperations.decisionsAppliedQuarter=3;
 assert.throws(()=>operations.validate(saved));
});

test('L3g bypasses callers that would otherwise stop the turn for legacy market shifts or shocks',()=>{
 const html=patch.apply(fs.readFileSync(require.resolve('../source/index.original.html'),'utf8'));
 assert.match(html,/if \(!SlingshotOperationalDecisions\.enabled\(this\) && this\.pendingMarketShift\.length > 0 && this\.milestone\)/);
 assert.match(html,/if \(!SlingshotOperationalDecisions\.enabled\(this\) && !_msImminent && this\.turn >= 2/);
});
