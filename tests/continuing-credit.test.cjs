const test=require('node:test'),assert=require('node:assert/strict');
const credit=require('../continuing-credit'),adapter=require('../finance-adapter'),academic=require('../academic'),save=require('../save-validation');
const ref=[{id:'fof_fff',cash:60,dilution:5,newVal:999999}];
function game(){return {gameStarted:true,turn:2,brCompletedQuarters:1,completedMilestones:[],lastRaiseMilestoneCount:-1,brLoans:[],metrics:{cash:100,val:350,equity:100,burn:10},company:{id:'clinic'},funder:{stage:'bootstrap',apMod:-1},baseAP:6,maxAP:5};}
test('later credit increases cash and debt without altering equity or valuation',()=>{
 const g=game(),offer=credit.options(g,ref).find(o=>o.kind==='publicBank');credit.accept(g,offer.id,ref);
 assert.equal(g.metrics.cash,160);assert.equal(g.metrics.val,350);assert.equal(g.metrics.equity,100);
 assert.equal(g.brLoans[0].principalCents,6000000);assert.equal(g.fundingAPCost,1);assert.equal(g.maxAP,6);
 assert.equal(credit.options(g,ref).length,0);const before=JSON.stringify(g);assert.throws(()=>credit.accept(g,offer.id,ref));assert.equal(JSON.stringify(g),before);
});
test('a new milestone permits another loan but family later funding is one-time',()=>{
 const g=game();credit.accept(g,credit.options(g,ref).find(o=>o.kind==='family').id,ref);g.completedMilestones=['m1'];
 const offers=credit.options(g,ref);assert.ok(offers.some(o=>o.kind==='publicBank'));assert.ok(!offers.some(o=>o.kind==='family'));assert.ok(!offers.some(o=>o.kind==='ngo'));
 g.company.brNgoEligible=true;assert.ok(credit.options(g,ref).some(o=>o.kind==='ngo'));
});
test('repayment feeds academic result and arrears restrict ordinary new credit',()=>{
 const g=game();credit.accept(g,credit.options(g,ref).find(o=>o.kind==='publicBank').id,ref);
 g.metrics.cash=0;adapter.settleQuarter(g,3);g.turn=3;g.brCompletedQuarters=3;g.completedMilestones=['m1'];
 assert.deepEqual(credit.options(g,ref).map(o=>o.kind),['informal']);
 assert.equal(academic.fromGame(g,'bankrupt').components.financial,0);
});
test('restored contracts preserve funding round gate and pending attention cost',()=>{
 const g=game();credit.accept(g,credit.options(g,ref)[0].id,ref);
 const stored={...g,companyId:'clinic',brEdition:1,version:'1.3',brFundingAPCost:g.fundingAPCost};
 assert.equal(save.validate(stored,[{id:'clinic'}]),true);
 const restored={...g,lastRaiseMilestoneCount:-1,fundingAPCost:0};save.restoreFunding(restored,stored);
 assert.equal(restored.lastRaiseMilestoneCount,0);assert.equal(restored.fundingAPCost,1);assert.equal(credit.options(restored,ref).length,0);
});
test('finished games, invalid reference cash and crises cannot originate new debt',()=>{
 for(const override of [{gameStarted:false},{failureState:'runway_crisis'},{completedMilestones:['m1','m2','m3']},{brCompletedQuarters:16}])assert.equal(credit.options({...game(),...override},ref).length,0);
 for(const cash of [0,-1,NaN,Infinity])assert.equal(credit.options(game(),[{id:'fof_fff',cash}]).length,0);
});
test('saved data cannot bypass the one-time family funding rule',()=>{
 const g=game();credit.accept(g,credit.options(g,ref).find(o=>o.kind==='family').id,ref);g.completedMilestones=['m1'];
 const extra={...g.brLoans[0],id:'br-round-1-family',brRoundStage:1};
 const stored={...g,brLoans:[...g.brLoans,extra],companyId:'clinic',brEdition:1,version:'1.3',brFundingAPCost:1};
 assert.throws(()=>save.validate(stored,[{id:'clinic'}]),/única vez/);
});
