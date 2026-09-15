const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),acorn=require('acorn'),walk=require('acorn-walk');
const credit=require('../crisis-credit'),finance=require('../finance'),adapter=require('../finance-adapter'),save=require('../save-validation');
const required=['showCrisisModal','resolveCrisis','checkForCrisis','saveGame','loadGame'],methods={};
function extract(){
 for(const m of fs.readFileSync('index.html','utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{MethodDefinition(n){if(required.includes(n.key.name))methods[n.key.name]='function('+n.value.params.map(p=>m[2].slice(p.start,p.end)).join(',')+')'+m[2].slice(n.value.body.start,n.value.body.end);}});
 }
}
extract();
function setup(){
 let rendered='',ended=0,stored=null;
 const element={classList:{add(){},remove(){}},style:{}};
 const context=vm.createContext({SlingshotCrisisCredit:credit,SlingshotSave:save,SlingshotFinanceAdapter:adapter,SlingshotExport:{reset(){}},SlingshotContinuingCredit:{close(){}},COMPANIES:[{id:'clinic',name:'Clínica'}],LOGOS:{},localStorage:{setItem:(_,value)=>stored=value,getItem:()=>stored},document:{getElementById:id=>['preambleModal1','preambleModal2','companyDisplay','companyLogo'].includes(id)?element:null,body:{insertAdjacentHTML:(_,html)=>rendered=html}},getRegion:()=>({currency:'£'}),UIEffects:{showToast(){}},soundManager:{},console});
 const g={turn:1,gameStarted:true,failureState:'runway_crisis',crisisLifelineUsed:false,brLoans:[],metrics:{cash:5,burn:100,equity:100,val:350},hiredStaff:[{id:1},{id:2}],completedMilestones:[],pivotHistory:[],journeyEvents:[],moods:{research:0},currentEvents:{research:[]},investorRelationship:3,
  company:{id:'clinic'},brCompletedQuarters:0,milestone:{id:'m1'},milestoneProgress:0,team:{},baseAP:6,maxAP:6,
  getDisplayedRunway(){return 0;},applyModeAP(){},ensureTokenSpend(){},renderTokenSpend(){},getStaffAPBonus(){return 0;},getTokenAPDelta(){return 0;},renderAPPips(){},selectQuarterEvents(){},
  closeAllModals(){},log(){},update(){},renderExecRow(){},calculateMilestoneProgress(){},checkMilestoneCompletion(){},endGame(){ended++;},applyDilution(){throw new Error('Não pode emitir ações.');}};
 for(const name of required)g[name]=vm.runInContext('('+methods[name]+')',context);
 return {g,html:()=>rendered,ended:()=>ended,stored:()=>stored};
}
test('emergency quote agrees with four complete SAC payments',()=>{
 const q=credit.quote(150,1);let loan=finance.create('informal',15000000,1,'expected'),total=0;
 for(let t=2;t<=5;t++){const bill=finance.due(loan,t);if(t===2)assert.equal(q.firstPayment,bill.totalCents/100000);total+=bill.totalCents;loan=finance.settle(loan,t,bill.totalCents).loan;}
 assert.equal(q.totalPayments,total/100000);assert.ok(q.totalPayments>150);assert.equal(loan.balanceCents,0);
});
test('built crisis shows exact terms and contracts once without equity or investor mutations',()=>{
 const {g,html}=setup();g.showCrisisModal();
 assert.match(html(),/120% ao ano, em 4 trimestres/);assert.ok(html().includes(credit.money(g.brCrisisOffer.firstPayment)));assert.doesNotMatch(html(),/equity|Investor Bailout/);
 g.resolveCrisis('bridge');assert.equal(g.metrics.cash,155);assert.equal(g.metrics.equity,100);assert.equal(g.metrics.val,350);assert.equal(g.investorRelationship,3);
 assert.equal(g.brLoans.length,1);assert.equal(g.brLoans[0].brCrisis,true);assert.equal(g.crisisLifelineUsed,true);assert.equal(g.failureState,null);assert.equal(g.crisisGracePeriod,true);
 const before=JSON.stringify(g);g.resolveCrisis('bridge');assert.equal(JSON.stringify(g),before);
 const cash=g.metrics.cash;adapter.settleQuarter(g,1);assert.equal(g.metrics.cash,cash);adapter.settleQuarter(g,2);assert.ok(g.metrics.cash<cash);
});
test('invalid crisis actions cannot consume the recovery opportunity',()=>{
 for(const choice of ['unknown','pivot','layoffs','decline']){
  const {g}=setup();g.hiredStaff=[];g.metrics.cash=0;const before=JSON.stringify(g);g.resolveCrisis(choice);assert.equal(JSON.stringify(g),before);
 }
});
test('changed or missing emergency quote fails before consuming recovery or changing state',()=>{
 const {g}=setup();let before=JSON.stringify(g);assert.throws(()=>g.resolveCrisis('bridge'));assert.equal(JSON.stringify(g),before);
 g.showCrisisModal();g.brCrisisOffer={...g.brCrisisOffer,firstPayment:0};before=JSON.stringify(g);assert.throws(()=>g.resolveCrisis('bridge'));assert.equal(JSON.stringify(g),before);
});
test('decline keeps recovery unused and layoffs retain original cash and mood effects',()=>{
 const {g}=setup();g.resolveCrisis('decline');assert.equal(g.crisisLifelineUsed,false);assert.equal(g.metrics.cash,5);
 g.failureState='runway_crisis';g.resolveCrisis('layoffs');assert.equal(g.hiredStaff.length,0);assert.equal(g.metrics.cash,55);assert.equal(g.metrics.burn,50);assert.equal(g.moods.research,-2);assert.equal(g.brLoans.length,0);
});
test('restored emergency loan must retain its unique consumed lifeline',()=>{
 const loan={...finance.create('informal',15000000,1,'br-crisis-credit'),brCrisis:true};
 const s={brEdition:1,version:'1.3',companyId:'clinic',turn:1,brCompletedQuarters:0,brLoans:[loan],crisisLifelineUsed:true,metrics:{cash:155,burn:100},completedMilestones:[],milestone:{id:'m1'},milestoneProgress:0};
 assert.equal(save.validate(s,[{id:'clinic'}]),true);
 for(const change of [{crisisLifelineUsed:false},{brLoans:[{...loan,kind:'publicBank'}]},{brLoans:[{...loan,brCrisis:false}]},{brLoans:[{...loan,brRoundStage:0}]}])assert.throws(()=>save.validate({...s,...change},[{id:'clinic'}]));
});
test('actual save/load preserves the crisis grace period after credit and decline',()=>{
 for(const choice of ['bridge','decline']){
  const {g,stored,ended}=setup();g.showCrisisModal();g.resolveCrisis(choice);
  // Zero cash for bridge makes premature bankruptcy observable; decline still has cash.
  if(choice==='bridge')g.metrics.cash=0;
  assert.equal(g.checkForCrisis(),false);assert.equal(g.saveGame(true),true);
  assert.equal(JSON.parse(stored()).brCrisisGracePeriod,true);
  g.crisisGracePeriod=false;g.crisisLifelineUsed=false;
  assert.equal(g.loadGame(),true);assert.equal(g.crisisGracePeriod,true);
  assert.equal(g.checkForCrisis(),false);assert.equal(ended(),0);
  // Once grace expires, the original consequence still applies.
  g.crisisGracePeriod=false;assert.equal(g.checkForCrisis(),true);
  assert.equal(ended(),choice==='bridge'?1:0);
 }
});
test('save rejects a non-boolean grace flag before restoring anything',()=>{
 const {g}=setup();assert.equal(g.saveGame(true),true);
 const s={brEdition:1,version:'1.3',companyId:'clinic',turn:1,brCompletedQuarters:0,brLoans:[],brCrisisGracePeriod:'true',metrics:{cash:5,burn:100},completedMilestones:[],milestone:{id:'m1'},milestoneProgress:0};
 assert.throws(()=>save.validate(s,[{id:'clinic'}]),/Carência/);
});
