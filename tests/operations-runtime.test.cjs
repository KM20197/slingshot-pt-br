const test=require('node:test');
const assert=require('node:assert/strict');
const operations=require('../operations-runtime');
const isolation=require('../market-isolation');
const data=require('../locales/operating-models.pt-BR.json');
const game=id=>({company:{id},turn:1,metrics:{dev:24,hr:20,mkt:30},location:{id:'br_metropole'},revenueHistory:[]});
const preservedModels={avam:[9,10,6,2,12,16,.2],dream:[28,42,1.4,.78,56,72,.12],quant:[13,17,4.8,1.65,26,38,.3],vanguard:[20,28,3.5,2.1,42,58,.24],legal:[24,34,1.8,.95,50,66,.1],arene:[18,26,2.8,1.45,44,62,.12],voed:[22,30,2.2,1.05,38,52,.06],aether:[18,24,3.4,1.2,undefined,undefined,.18],edu:[20,32,2.6,.72,undefined,undefined,.1],cyber:[16,22,4.1,1.45,30,44,.26],terra:[14,19,4.6,1.7,28,40,.3]};
test('adding sorgente preserves the approved parameters of the eleven earlier operating models',()=>{for(const [id,values] of Object.entries(preservedModels)){const m=operations.models()[id];assert.deepEqual([m.baseDemand,m.baseCapacity,m.unitPrice,m.unitVariableCost,m.initialInventory,m.targetInventory,m.receivableShare],values,id);}});

test('operations-v1 is limited to the approved representative, retail and restaurant enterprises',()=>{
 assert.deepEqual(Object.keys(operations.models()).sort(),['aether','arene','avam','cyber','dream','edu','legal','quant','sorgente','terra','vanguard','voed']);
 for(const id of ['avam','dream','quant','vanguard','legal','arene','voed','aether','edu','cyber','terra','sorgente'])assert.equal(operations.enabled(game(id)),true);
 assert.deepEqual(isolation.operatingIds().sort(),Object.keys(operations.models()).sort());
});

test('each operating family preserves its resource invariant and separates earned revenue from delayed receipts',()=>{
 for(const id of ['avam','dream','quant','vanguard','legal','arene','voed','aether','edu','cyber','terra','sorgente']){
  const g=game(id),state=operations.init(g),first=operations.advance(g);
  const m=data.models[id];assert.equal(state.version,m.stateVersion||data.version);assert.equal(state.engine,m.engine||'operations-v1');
  assert.ok(first.gross>=0);assert.ok(first.variable>=0);assert.ok(first.units>=0);
  if(m.family==='service_recurring'){assert.equal(g.brOperations.service.idleCapacity,g.brOperations.service.capacity-g.brOperations.service.usedCapacity);if(m.serviceMode==='aggregate_membership')assert.ok(g.brOperations.service.usedCapacity<=g.brOperations.service.activeBase);}else assert.ok(g.brOperations.inventory>=0);
  assert.equal(operations.revenue(g).gross,first.gross);
  const before=JSON.stringify(g.brOperations);assert.deepEqual(operations.advance(g),first);assert.equal(JSON.stringify(g.brOperations),before);
  g.turn=2;const second=operations.advance(g);assert.ok(second.cashReceived>=0);assert.equal(g.revenueHistory.length,2);
 }
});

test('restaurant model uses the approved aggregated-portion parameters and milestones',()=>{
 const m=operations.models().voed;
 assert.deepEqual({family:m.family,baseDemand:m.baseDemand,baseCapacity:m.baseCapacity,unitPrice:m.unitPrice,unitVariableCost:m.unitVariableCost,initialInventory:m.initialInventory,targetInventory:m.targetInventory,receivableShare:m.receivableShare},{family:'retail_inventory',baseDemand:22,baseCapacity:30,unitPrice:2.2,unitVariableCost:1.05,initialInventory:38,targetInventory:52,receivableShare:.06});
 assert.deepEqual(m.milestones.m1.map(x=>x.operatingThreshold.completed),[32,46,60]);
 assert.equal(m.milestones.m2[0].operatingThreshold.completed,74);
 assert.equal(m.milestones.m3[0].operatingThreshold.completed,100);
 const g=game('voed'),first=operations.advance(g),remaining=g.brOperations.inventory;
 assert.ok(first.units<=Math.min(30,38));assert.ok(first.losses>=0);assert.ok(remaining>=0);
});

test('garment production uses the approved manufacture-to-order parameters and records aggregate scrap',()=>{
 const m=operations.models().cyber;
 assert.deepEqual({family:m.family,baseDemand:m.baseDemand,baseCapacity:m.baseCapacity,unitPrice:m.unitPrice,unitVariableCost:m.unitVariableCost,initialInventory:m.initialInventory,targetInventory:m.targetInventory,receivableShare:m.receivableShare},{family:'manufacture_to_order',baseDemand:16,baseCapacity:22,unitPrice:4.1,unitVariableCost:1.45,initialInventory:30,targetInventory:44,receivableShare:.26});
 assert.deepEqual(m.milestones.m1.map(x=>x.operatingThreshold.completed),[22,34,46]);assert.equal(m.milestones.m2[0].operatingThreshold.completed,58);assert.equal(m.milestones.m3[0].operatingThreshold.completed,80);
 const g=game('cyber');operations.init(g);g.brOperations.inventory=100;const first=operations.advance(g);
 assert.ok(first.losses>=0);assert.ok(first.units+first.losses<=Math.min(22,100));assert.equal(first.gross,Math.round(first.units*m.unitPrice));assert.ok(g.brOperations.inventory>=0);
 const saved={companyId:'cyber',turn:1,brOperations:operations.save(g)},restored=game('cyber');restored.turn=2;operations.restore(restored,saved);g.turn=2;assert.deepEqual(operations.advance(restored),operations.advance(g));
});

test('institutional fictional production uses approved parameters and remains isolated from frozen-food operations',()=>{
 const m=operations.models().terra;
 assert.deepEqual({family:m.family,baseDemand:m.baseDemand,baseCapacity:m.baseCapacity,unitPrice:m.unitPrice,unitVariableCost:m.unitVariableCost,initialInventory:m.initialInventory,targetInventory:m.targetInventory,receivableShare:m.receivableShare},{family:'manufacture_to_order',baseDemand:14,baseCapacity:19,unitPrice:4.6,unitVariableCost:1.7,initialInventory:28,targetInventory:40,receivableShare:.3});
 assert.deepEqual(m.milestones.m1.map(x=>x.operatingThreshold.completed),[20,30,42]);assert.equal(m.milestones.m2[0].operatingThreshold.completed,54);assert.equal(m.milestones.m3[0].operatingThreshold.completed,74);
 const g=game('terra');operations.init(g);g.brOperations.inventory=100;const first=operations.advance(g);assert.ok(first.losses>0);assert.ok(g.brOperations.inventory<100-first.units);assert.equal(first.gross,Math.round(first.units*m.unitPrice));
 const deferred=g.brOperations.receivables[0].amount;assert.ok(deferred>0);const saved={companyId:'terra',turn:1,brOperations:operations.save(g)},restored=game('terra');restored.turn=2;operations.restore(restored,saved);g.turn=2;const resumed=operations.advance(restored),second=operations.advance(g);assert.deepEqual(resumed,second);assert.equal(second.cashReceived,Math.round(deferred+second.units*m.unitPrice*(1-m.receivableShare)));
});

test('fictional convenience production uses manufacture-to-order with aggregate scrap and deferred receipts',()=>{
 const m=operations.models().sorgente;assert.deepEqual({family:m.family,baseDemand:m.baseDemand,baseCapacity:m.baseCapacity,initialInventory:m.initialInventory,targetInventory:m.targetInventory,receivableShare:m.receivableShare},{family:'manufacture_to_order',baseDemand:17,baseCapacity:23,initialInventory:32,targetInventory:46,receivableShare:.22});
 const g=game('sorgente');operations.init(g);g.brOperations.inventory=100;const first=operations.advance(g);assert.ok(first.losses>0);assert.ok(g.brOperations.inventory<100-first.units);assert.equal(first.gross,Math.round(first.units*m.unitPrice));const deferred=g.brOperations.receivables[0].amount;
 const saved={companyId:'sorgente',turn:1,brOperations:operations.save(g)},restored=game('sorgente');restored.turn=2;operations.restore(restored,saved);g.turn=2;const resumed=operations.advance(restored),second=operations.advance(g);assert.deepEqual(resumed,second);assert.equal(second.cashReceived,Math.round(deferred+second.units*m.unitPrice*(1-m.receivableShare)));
});

test('restaurant state restores deterministically and records aggregate discard without revenue',()=>{
 const g=game('voed');operations.init(g);g.brOperations.inventory=100;
 const first=operations.advance(g),afterDiscard=g.brOperations.inventory;
 assert.ok(first.losses>0);assert.equal(first.gross,Math.round(first.units*operations.models().voed.unitPrice));
 assert.equal(afterDiscard,100-first.units-first.losses);
 const saved={companyId:'voed',turn:1,brOperations:operations.save(g)};
 assert.equal(operations.validate(saved),true);
 const restored=game('voed');restored.turn=2;operations.restore(restored,saved);
 g.turn=2;assert.deepEqual(operations.advance(restored),operations.advance(g));
});

test('aggregate ambulatory service uses v3 capacity without inventory or a recurring member base',()=>{
 const m=operations.models().aether;
 assert.deepEqual({stateVersion:m.stateVersion,engine:m.engine,family:m.family,serviceMode:m.serviceMode,baseDemand:m.baseDemand,baseCapacity:m.baseCapacity,unitPrice:m.unitPrice,unitVariableCost:m.unitVariableCost,receivableShare:m.receivableShare},{stateVersion:3,engine:'operations-v2-service',family:'service_recurring',serviceMode:'aggregate_attendance',baseDemand:18,baseCapacity:24,unitPrice:3.4,unitVariableCost:1.2,receivableShare:.18});
 const g=game('aether'),state=operations.init(g),first=operations.advance(g);
 assert.equal(state.version,3);assert.equal(state.engine,'operations-v2-service');assert.equal(Object.hasOwn(state,'inventory'),false);
 assert.deepEqual(Object.keys(state.service).sort(),['capacity','idleCapacity','usedCapacity']);
 assert.ok(state.service.usedCapacity<=state.service.capacity);assert.equal(state.service.idleCapacity,state.service.capacity-state.service.usedCapacity);
 assert.equal(first.gross,Math.round(first.units*m.unitPrice));assert.equal(first.losses,0);
 const saved={companyId:'aether',turn:1,brOperations:operations.save(g)};assert.equal(operations.validate(saved),true);
 for(const field of ['activeBase','entries','exits','patients']){const bad=structuredClone(saved);bad.brOperations.service[field]=field==='patients'?[]:1;assert.throws(()=>operations.validate(bad));}
 const restored=game('aether');restored.turn=2;operations.restore(restored,saved);g.turn=2;assert.deepEqual(operations.advance(restored),operations.advance(g));
 for(const pivot of ['customer','problem','tech','niche','pivot']){const p=game('aether');operations.init(p);assert.equal(operations.applyPivot(p,{id:pivot}),true);assert.equal(Object.hasOwn(p.brOperations,'inventory'),false);const snapshot={companyId:'aether',turn:1,brOperations:operations.save(p)};assert.equal(operations.validate(snapshot),true);}
});

test('aggregate membership keeps the active-base equation and rejects attendance-only service shapes',()=>{
 const m=operations.models().edu;
 assert.deepEqual({stateVersion:m.stateVersion,engine:m.engine,family:m.family,serviceMode:m.serviceMode,initialActiveBase:m.initialActiveBase,entryRate:m.entryRate,exitRate:m.exitRate},{stateVersion:3,engine:'operations-v2-service',family:'service_recurring',serviceMode:'aggregate_membership',initialActiveBase:18,entryRate:.16,exitRate:.08});
 const g=game('edu'),state=operations.init(g),first=operations.advance(g),v=state.service;
 assert.deepEqual(Object.keys(v).sort(),['activeBase','capacity','entries','exits','idleCapacity','usedCapacity']);
 assert.equal(v.activeBase,18-v.exits+v.entries);assert.ok(v.activeBase<=m.baseCapacity);assert.ok(v.usedCapacity<=v.activeBase);assert.equal(v.idleCapacity,v.capacity-v.usedCapacity);
 assert.equal(first.gross,Math.round(v.activeBase*m.unitPrice));
 const saved={companyId:'edu',turn:1,brOperations:operations.save(g)};assert.equal(operations.validate(saved),true);
 for(const field of ['patients','inventory']){const bad=structuredClone(saved);field==='inventory'?bad.brOperations.inventory=1:bad.brOperations.service[field]=[];assert.throws(()=>operations.validate(bad));}
 const wrong=structuredClone(saved);delete wrong.brOperations.service.activeBase;assert.throws(()=>operations.validate(wrong));
 const fractional=structuredClone(saved);fractional.brOperations.service.capacity=31.5;fractional.brOperations.service.usedCapacity=20;fractional.brOperations.service.idleCapacity=11.5;assert.throws(()=>operations.validate(fractional));
 const restored=game('edu');restored.turn=2;operations.restore(restored,saved);g.turn=2;assert.deepEqual(operations.advance(restored),operations.advance(g));
 for(const pivot of ['customer','problem','tech','niche','pivot']){const p=game('edu');operations.init(p);assert.equal(operations.applyPivot(p,{id:pivot}),true);p.turn=1;operations.advance(p);const snapshot={companyId:'edu',turn:1,brOperations:operations.save(p)};assert.equal(operations.validate(snapshot),true);const resumed=game('edu');resumed.turn=2;operations.restore(resumed,snapshot);p.turn=2;assert.deepEqual(operations.advance(resumed),operations.advance(p));assert.equal(resumed.brOperations.service.idleCapacity,resumed.brOperations.service.capacity-resumed.brOperations.service.usedCapacity);}
});

test('legacy v1 operating save restores and advances for existing v2 models',()=>{
 const original=game('avam');operations.init(original);const legacy={companyId:'avam',turn:1,brOperations:operations.save(original)};
 legacy.brOperations.version=1;delete legacy.brOperations.ledger.purchases;delete legacy.brOperations.ledger.consumed;delete legacy.brOperations.ledger.charge;delete legacy.brOperations.ledger.cashCosts;delete legacy.brOperations.ledger.cashDelta;
 assert.equal(operations.validate(legacy),true);
 const restored=game('avam');operations.restore(restored,legacy);restored.turn=2;const advanced=operations.advance(restored);
 assert.equal(advanced.quarter,2);assert.ok(restored.brOperations.inventory>=0);
});

test('operating state validates before restoration and refuses mismatched company or malformed receivable',()=>{
 const g=game('avam');operations.init(g);operations.advance(g);
 const saved={companyId:'avam',brOperations:operations.save(g)},before=JSON.stringify(saved);
 assert.equal(operations.validate(saved),true);assert.equal(JSON.stringify(saved),before);
 const wrong=structuredClone(saved);wrong.brOperations.companyId='dream';assert.throws(()=>operations.validate(wrong));
 const bad=structuredClone(saved);bad.brOperations.receivables=[{dueQuarter:0,amount:1}];assert.throws(()=>operations.validate(bad));
 const badPivot=structuredClone(saved);delete badPivot.brOperations.pivotEffects.capacity;assert.throws(()=>operations.validate(badPivot));
 const badLedger=structuredClone(saved);badLedger.brOperations.ledger.net=NaN;assert.throws(()=>operations.validate(badLedger));
 const legacy={companyId:'avam'};assert.equal(operations.validate(legacy),true);
});

test('operating milestones need both original metric progress and completed operational work',()=>{
 const g=game('dream');operations.init(g);g.milestone={operatingThreshold:{completed:10}};
 assert.equal(operations.milestoneProgress(g,90),0);
 g.brOperations.completed=8;assert.equal(operations.milestoneProgress(g,90),80);
 g.brOperations.completed=14;assert.equal(operations.milestoneProgress(g,90),90);
 g.milestone={operatingThreshold:{completed:0}};assert.throws(()=>operations.milestoneProgress(g,90));
});

test('pivots preserve a valid state and do not create legacy customer revenue',()=>{
 const g=game('quant');operations.init(g);const before=g.brOperations.inventory;
 assert.equal(operations.applyPivot(g,{id:'pivot'}),true);assert.ok(g.brOperations.inventory<=before);assert.equal(operations.ignoreLegacyEffect(g,{addCustomer:{revenue:99}}),false);
 assert.ok(operations.pivotMilestones(g,'customer').length>0);
 const late=game('quant');assert.equal(operations.applyPivot(late,{id:'tech'}),true);assert.equal(operations.applyPivot(late,null),false);
});
