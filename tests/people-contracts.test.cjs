const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const people=require('../people-contracts-runtime');
const game=id=>({company:{id},metrics:{staff:4,burn:40},startingStaff:4,gameStarted:false,log(){}});
test('people and external contracts are restricted to approved operating businesses',()=>{
 for(const id of ['avam','dream','quant','vanguard','legal','arene'])assert.equal(people.enabled(game(id)),true);
 for(const id of ['aether','cyber','terra'])assert.equal(people.enabled(game(id)),false);
});
test('contracts never become employees or attention capacity',()=>{
 const g=game('avam');assert.equal(people.configure(g,{accounting:true,marketing:false}),true);
 const before=g.metrics.staff;assert.equal(people.applyStart(g),true);
 assert.equal(g.metrics.staff,4);assert.equal(g.startingStaff,4);assert.equal(g.brBusiness.contracts.marketing,false);
 assert.ok(g.metrics.burn>40);assert.equal(people.capacity(g,20),33);assert.equal(people.demand(g,20),20);
});
test('state validation rejects altered company and accepts configured state',()=>{
 const g=game('dream');people.configure(g);people.applyStart(g);
 const saved={companyId:'dream',brBusiness:structuredClone(g.brBusiness)};assert.equal(people.validate(saved),true);
 saved.brBusiness.companyId='avam';assert.throws(()=>people.validate(saved));
});
test('state validation rejects altered recurring costs and unapplied setup',()=>{
 const g=game('avam');people.configure(g);people.applyStart(g);const saved={companyId:'avam',brBusiness:structuredClone(g.brBusiness)};
 for(const change of [{quarterlyPersonnelCost:0},{quarterlyContractCost:999},{costsApplied:false}])assert.throws(()=>people.validate({companyId:'avam',brBusiness:{...saved.brBusiness,...change}}));
});

test('retail group starts from people and contracts rather than an executive SaaS team',()=>{
 for(const id of ['vanguard','legal','arene']){
  const g=game(id);assert.equal(people.configure(g),true);assert.equal(people.applyStart(g),true);
  assert.equal(g.brBusiness.companyId,id);assert.deepEqual(g.equityGrants,undefined);
  assert.ok(g.metrics.staff>0);assert.ok(g.metrics.burn>40);
 }
});
test('ongoing people and contracts update only operational costs and remain bounded',()=>{
 const g=game('avam');people.configure(g);people.applyStart(g);g.gameStarted=true;
 const initialBurn=g.metrics.burn;
 assert.equal(people.hire(g),true);assert.equal(g.brBusiness.employees.crew,3);assert.equal(g.metrics.staff,5);assert.equal(g.metrics.burn,initialBurn+8);
 assert.equal(people.dismiss(g),true);assert.equal(g.brBusiness.employees.crew,2);assert.equal(g.metrics.burn,initialBurn);
 assert.equal(people.setContract(g,'marketing',false),true);assert.equal(g.brBusiness.contracts.marketing,false);assert.equal(g.metrics.burn,initialBurn-5);assert.equal(people.demand(g,20),20);
 assert.equal(people.setContract(g,'marketing',true),true);assert.equal(g.metrics.burn,initialBurn);assert.equal(people.demand(g,20),21);
 while(people.hire(g)){}assert.equal(g.brBusiness.employees.crew,5);assert.equal(people.hire(g),false);
 while(people.dismiss(g)){}assert.equal(g.brBusiness.employees.crew,0);assert.equal(people.dismiss(g),false);
 assert.equal(g.metrics.staff,2);assert.equal(people.capacity(g,20),25);
});
test('emergency reduction ends optional contracts and reduces the real operating team',()=>{
 const g=game('avam');people.configure(g);people.applyStart(g);g.gameStarted=true;const burn=g.metrics.burn;
 const reduction=people.emergencyReduce(g);assert.deepEqual(reduction.changes,['contrato de marketing e promoção local','contrato de assessoria administrativa e contábil','uma pessoa de técnicos de bancada']);assert.equal(reduction.saved,17);assert.equal(g.metrics.burn,burn-17);assert.equal(g.brBusiness.employees.crew,1);assert.equal(people.canEmergencyReduce(g),true);
 people.emergencyReduce(g);assert.equal(people.canEmergencyReduce(g),false);assert.equal(people.emergencyReduce(g),null);
});
test('generated controls route operating ventures to local management without staff AP',()=>{
 const html=fs.readFileSync('index.html','utf8');
 for(const label of ['Gerir pessoas','Gerir contratos','Equipe e assessorias','Custos e contratos trimestrais'])assert.ok(html.includes(label),label);
 const start=html.indexOf('  showJobPostModal() {'),end=html.indexOf('\n  }',start);assert.match(html.slice(start,end),/SlingshotPeopleContracts\.showManage\(this\)/);
 const hireStart=html.indexOf('  showHiringModal() {'),hireEnd=html.indexOf('\n  }',hireStart);assert.match(html.slice(hireStart,hireEnd),/this\.gameStarted \? SlingshotPeopleContracts\.showManage\(this\) : SlingshotPeopleContracts\.showSetup\(this\)/);
 assert.ok(html.includes("if (action === 'hire') this.showHiringModal();"));
 const apStart=html.indexOf('  getStaffAPBonus() {'),apEnd=html.indexOf('\n  }',apStart);assert.match(html.slice(apStart,apEnd),/SlingshotPeopleContracts\.enabled\(this\)\) return 0/);
});
