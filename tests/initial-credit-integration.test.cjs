const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),acorn=require('acorn'),walk=require('acorn-walk');
const initial=require('../initial-credit');
let body;
for(const m of fs.readFileSync('index.html','utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{MethodDefinition(n){if(n.key.name==='selectFunder')body=m[2].slice(n.value.body.start,n.value.body.end);}});
}
function setup(eligible=false){
 const original={id:'personalSavings',cash:350,val:350,stage:'bootstrap',equity:0,apMod:-1,bonus:{},name:'Recursos próprios'};
 const ctx=vm.createContext({SlingshotInitialCredit:initial,getFunder:id=>id==='personalSavings'?original:initial.source(id,original),console,soundManager:{playFundingSelect(){}},document:{getElementById:()=>({classList:{add(){},remove(){}}})}});
 const select=vm.runInContext('(function(id)'+body+')',ctx);
 const game={turn:1,brLoans:[],company:{staff:4,burn:35,brNgoEligible:eligible},metrics:{cash:0,hr:50},baseAP:6,investors:[],fundingStage:'bootstrap',
  modeFunder:f=>f,initTokenSpend(){},lockAPBonuses(){},recalcFounderEquity(){this.metrics.equity=100;},logJourneyEvent(){},log(){},showHiringModal(){}};
 return {game,select:id=>select.call(game,id)};
}
test('built selectFunder rejects repeat and switch before restoring spent cash or duplicating HR bonus',()=>{
 const env=setup();env.select('brFamily');assert.equal(env.game.metrics.cash,430);assert.equal(env.game.metrics.hr,51);
 assert.equal(env.game.brLoans.length,1);env.game.metrics.cash-=20;const before=JSON.stringify(env.game);
 for(const id of ['brFamily','brPublic','personalSavings']){env.select(id);assert.equal(JSON.stringify(env.game),before);}
});
test('built selectFunder refuses NGO when profile lacks eligibility',()=>{
 const env=setup(),before=JSON.stringify(env.game);env.select('brNgo');assert.equal(JSON.stringify(env.game),before);
 const eligible=setup(true);eligible.select('brNgo');assert.equal(eligible.game.brLoans[0].kind,'ngo');assert.equal(eligible.game.metrics.cash,430);
});
