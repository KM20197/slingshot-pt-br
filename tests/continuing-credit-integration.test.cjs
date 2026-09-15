const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),acorn=require('acorn'),walk=require('acorn-walk');
const credit=require('../continuing-credit');
const required=['originalFundingReference','generateFundingOptions','getRelationshipFundingModifier','acceptFunding'],methods={};
for(const m of fs.readFileSync('index.html','utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{MethodDefinition(n){if(required.includes(n.key.name))methods[n.key.name]='function('+n.value.params.map(p=>p.name).join(',')+')'+m[2].slice(n.value.body.start,n.value.body.end);}});
}
function setup(){
 const context=vm.createContext({SlingshotContinuingCredit:credit,FOLLOW_ON_INVESTORS:{bootstrap:[{id:'fof_fff',baseCash:60,baseDilution:5,valMult:1.1,bonus:{},tier:'bridge'}]},FUNDERS:{},M2_FUNDERS:{},M3_FUNDERS:{},getAvailableM2Funders:()=>[],getAvailableM3Funders:()=>[]});
 const g={turn:1,gameStarted:true,completedMilestones:[],brCompletedQuarters:0,brLoans:[],metrics:{cash:350,val:350,equity:100},market:'stable',fundingStage:'bootstrap',funder:{stage:'bootstrap',apMod:-1},company:{},founderBonuses:{financial:4},lastRaiseMilestoneCount:-1,investorRelationship:1,
  getCompetitiveFundingModifier:()=>({cashMod:1,dilutionMod:1,valMod:1,position:{status:'competitive'}}),log(){},update(){},baseAP:6,maxAP:5};
 for(const name of required)g[name]=vm.runInContext('('+methods[name]+')',context);
 return g;
}
test('built reference works without global game and tracks original stage cash scaling',()=>{
 const g=setup();
 const amounts=[];for(let stage=0;stage<3;stage++){g.completedMilestones=['m1','m2'].slice(0,stage);amounts.push(g.originalFundingReference().find(o=>o.id==='fof_fff').cash);}
 assert.deepEqual(amounts,[60,84,108]);
});
test('built funding route contracts once and leaves valuation and ownership unchanged',()=>{
 const g=setup(),offer=g.generateFundingOptions().find(o=>o.kind==='publicBank');g.acceptFunding(offer.id);
 assert.equal(g.metrics.cash,410);assert.equal(g.metrics.val,350);assert.equal(g.metrics.equity,100);
 assert.equal(g.brLoans.length,1);assert.equal(g.generateFundingOptions().length,0);
 const before=JSON.stringify(g);assert.throws(()=>g.acceptFunding(offer.id));assert.equal(JSON.stringify(g),before);
});
