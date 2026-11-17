const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const acorn=require('acorn'),walk=require('acorn-walk');
const api=require('../management-runtime'),config=require('../locales/management-setup.pt-BR.json');
const operations=require('../operations-runtime');
const html=fs.readFileSync('index.html','utf8');
const methods={},data={},properties={};
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 const code=m[2];walk.ancestor(acorn.parse(code,{ecmaVersion:'latest'}),{
  VariableDeclarator(n){if(['MILESTONES','EXECUTIVES','HR_EXECS','STAT_LABELS'].includes(n.id.name))data[n.id.name]=vm.runInNewContext('('+code.slice(n.init.start,n.init.end)+')');},
  PropertyDefinition(n,parents){if(['tutorialTopics','topicCards','coreTopics','advancedTopics','coachingTips'].includes(n.key.name)&&parents.some(p=>p.type==='ClassDeclaration'&&p.id?.name==='Game'))properties[n.key.name]=vm.runInNewContext('('+code.slice(n.value.start,n.value.end)+')');},
  MethodDefinition(n,parents){if(parents.some(p=>p.type==='ClassDeclaration'&&p.id?.name==='Game'))methods[n.key.name]='function('+n.value.params.map(p=>code.slice(p.start,p.end)).join(',')+')'+code.slice(n.value.body.start,n.value.body.end);}
 });
}
const plain=v=>JSON.parse(JSON.stringify(v));
const game=(cityId='br_metropole',companyId='aether')=>({company:{id:companyId},location:api.locations().find(c=>c.id===cityId),turn:1,metrics:{cash:350,burn:25,sci:20,dev:20,mkt:20,hr:20,equity:100},team:{research:null,dev:null,marketing:null,hr:null},moods:{},completedMilestones:[],baseAP:6,log(){},updateHiringWizard(){},showMilestoneModal(){}});
function context(){
 const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',checked:false,value:'',style:{},classList:{add(){},remove(){},toggle(){}},querySelectorAll(){return [];}});return nodes.get(id);};
 const ctx=vm.createContext({document:{getElementById:get},setTimeout(){},SlingshotCompanyDisplay:require('../company-display'),console:{log(){},error(){}},Math:Object.create(Math)});
 vm.runInContext(fs.readFileSync('management-runtime.js','utf8').replace('BR_MANAGEMENT_DATA',JSON.stringify(config)),ctx);
 return {ctx,get,api:ctx.SlingshotManagement};
}
test('three city choices expose and calculate salary, commercial, supply, occupancy and temporary incentive differences',()=>{
 assert.deepEqual(api.locations().map(c=>c.salaryMod),[.2,-.05,-.1]);
 const metro=game(),vale=game('br_vale','cyber'),interior=game('br_interior');
 assert.equal(api.terms(metro).conversion,.04);assert.equal(api.terms(game('br_vale')).conversion,0);assert.equal(api.terms(interior).conversion,-.02);
 assert.equal(api.terms(vale).charge,.02);assert.equal(api.terms(game('br_vale','quant')).conversion,.04);assert.equal(api.terms(game('br_vale','cyber')).conversion,.04);assert.equal(api.terms(game('br_vale','terra')).conversion,.04);assert.equal(api.terms(game('br_vale','sorgente')).conversion,.04);assert.equal(api.terms(game('br_vale','aether')).conversion,0);vale.turn=5;assert.equal(api.terms(vale).charge,.04);
 assert.equal(api.terms(vale).supply,.85);assert.equal(api.terms(interior).supply,1.15);
 for(const g of [metro,vale,interior]){const initial=g.metrics.burn;api.begin(g);assert.equal(g.metrics.burn,initial+g.location.occupancy);api.begin(g);assert.equal(g.metrics.burn,initial+g.location.occupancy);assert.equal(api.validate(JSON.parse(JSON.stringify(g))),true);}
 assert.equal(api.hiringInterest(metro),-.05);assert.equal(api.hiringInterest(interior),.05);
});
test('local operating costs reach the actual revenue calculation without accumulating during repeated display updates',()=>{
 const actual=vm.runInNewContext('('+methods.calculateQuarterlyRevenue+')',{SlingshotManagement:api,SlingshotOperations:{revenue(){return null;}}});
 for(const id of ['br_metropole','br_vale','br_interior']){
  const g=game(id,'cyber');g.revenueModel={};g.customers=[{quarterlyRevenue:100,supportCost:50}];g.calculateStaffRevenueEffects=()=>({supportEfficiency:0});
  const before=JSON.stringify(g.customers),first=plain(actual.call(g)),second=plain(actual.call(g));
  assert.deepEqual(first,second);assert.equal(JSON.stringify(g.customers),before);assert.equal(g.metrics.cash,350);assert.equal(g.revenueHistory.length,1);
  assert.equal(first.net,first.gross-first.support);
  assert.equal(first.net,{br_metropole:51,br_vale:55,br_interior:40}[id]);
 }
 const legacy=game();legacy.location={id:'london'};legacy.revenueModel={};legacy.customers=[{quarterlyRevenue:100,supportCost:50}];legacy.calculateStaffRevenueEffects=()=>({supportEfficiency:0});
 assert.deepEqual(plain(actual.call(legacy)),{gross:100,support:50,net:50});
});
test('interior delivery adds exactly one quarter to real pipeline conversion and Vale bonus applies only to industry',()=>{
 const env=context();env.ctx.Math.random=()=>.5;
 const process=vm.runInContext('('+methods.processPipeline+')',env.ctx);
 for(const id of ['br_metropole','br_interior']){
  const g=game(id);g.turn=2;g.revenueModel={metrics:{avgRevenuePerCustomer:10,supportCostPerCustomer:2}};g.pipeline=[{addedQuarter:1,closeIn:1,probability:.6,value:10}];g.calculateStaffRevenueEffects=()=>({conversionBonus:0,dealSizeBonus:0,supportEfficiency:0});g.addCustomer=x=>x;
  assert.equal(process.call(g).length,id==='br_metropole'?1:0);
  if(id==='br_interior'){g.turn=3;assert.equal(process.call(g).length,1);assert.equal(g.pipeline.length,0);}
 }
 const modifiers=api.modifiers(game('br_vale','quant'),{conversionBonus:0});assert.equal(modifiers.conversionBonus,.04);assert.ok(modifiers.conversionBonus<1);assert.equal(api.modifiers(game('br_vale','aether'),{conversionBonus:0}).conversionBonus,0);
});
test('rendered city cards and selection use the same canonical data and reject post-funding switches',()=>{
 const env=context(),g=game();g.renderFundingStages=()=>{};g.showCoachingTip=()=>{};
 vm.runInContext('('+methods.showLocationModal+')',env.ctx).call(g);
 for(const c of api.locations()){assert.ok(env.get('locationGrid').innerHTML.includes(c.name));assert.ok(env.get('locationGrid').innerHTML.includes(api.money(c.occupancy)));}
 const select=vm.runInContext('('+methods.selectLocation+')',env.ctx);
 assert.equal(select.call(g,'br_interior'),true);assert.equal(g.location.id,'br_interior');
 g.brInitialSelected=true;assert.equal(select.call(g,'br_metropole'),false);assert.equal(g.location.id,'br_interior');
});
test('twelve neutral leader profiles have three choices per role and apply salary without equity or double HR charges',()=>{
 const env=context(),g=game();
 for(const role of ['research','dev','marketing','hr']){
  const choices=api.executives(role);assert.equal(choices.length,3);
  for(const e of choices){assert.equal(e.equity,0);assert.equal(e.vestingYears,0);assert.doesNotMatch(JSON.stringify(e),/London|PhD|British|Londres|NHS|FCA/);}
  env.api.renderLeaders(g,'cards',role);assert.doesNotMatch(env.get('cards').innerHTML,/vesting|equity|participação|£/);assert.equal((env.get('cards').innerHTML.match(/>Contratar<\/button>/g)||[]).length,3);
 }
 assert.equal(env.api.selectLeader(g,'fatima','research'),true);assert.equal(g.team.research.id,'fatima');
 env.api.cv(g,'fatima','research');assert.ok(env.get('execCVModal').innerHTML.includes('27.000'));
 const initial=g.metrics.burn;g.gameStarted=true;assert.equal(env.api.hireHR(g,'david'),false);g.completedMilestones=['m1'];assert.equal(env.api.hireHR(g,'david'),true);
 assert.equal(g.metrics.burn,initial+20);assert.equal(g.maxAP,7);assert.equal(g.metrics.equity,100);assert.equal(env.api.hireHR(g,'sofia'),false);assert.equal(g.metrics.burn,initial+20);
});
test('management save rules reject mismatched cities before mutation and preserve valid repeated initialization',()=>{
 const g=game();api.begin(g);const saved=JSON.parse(JSON.stringify(g)),before=JSON.stringify(saved);
 assert.equal(api.validate(saved),true);assert.equal(JSON.stringify(saved),before);
 for(const mutate of [s=>{delete s.brManagement;},s=>{s.brManagement.cityId='br_interior';},s=>{s.brManagement.fixedCost=0;},s=>{s.location.salaryMod=0;}]){const bad=structuredClone(saved);mutate(bad);const bytes=JSON.stringify(bad);assert.throws(()=>api.validate(bad));assert.equal(JSON.stringify(bad),bytes);}
 assert.equal(api.validate({location:{id:'london'}}),true);
});

test('actual game start charges city occupancy and locally adjusted salaries once',()=>{
 const env=context();Object.assign(env.ctx,{SlingshotExport:{reset(){}},soundManager:{playSetupComplete(){}}});
 const start=vm.runInContext('('+methods.startGame+')',env.ctx);
 for(const c of api.locations()){
  const g=game(c.id);for(const role of ['research','dev','marketing'])g.team[role]=api.executives(role)[0];
  for(const method of ['recalcFounderEquity','logJourneyEvent','initBMC','selectQuarterEvents','update','renderBoardroom','updateGuidedPlayProgress','showSituationBrief'])g[method]=()=>{};
  const wages=Object.values(g.team).filter(Boolean).reduce((sum,e)=>sum+Math.round(e.wage*(1+c.salaryMod)),0);
  start.call(g);assert.equal(g.metrics.burn,25+c.occupancy+wages);assert.equal(g.metrics.equity,100);
  const state=JSON.stringify(g.metrics);start.call(g);assert.equal(JSON.stringify(g.metrics),state);
 }
});
test('first milestone choices preserve IDs, use actual thresholds and distinguish value from cash',()=>{
 for(const [companyId,stages] of Object.entries(data.MILESTONES))for(const [i,m]of stages.m1.entries()){
  assert.equal(m.id,['m1_conservative','m1_balanced','m1_ambitious'][i]);assert.equal(m.time,[8,7,6][i]);assert.equal(m.reward.val,[200,450,900][i]);
  assert.deepEqual(plain(m.focus),Object.keys(m.threshold));assert.equal(m.name,operations.models()[companyId]?.milestones.m1[i].name||config.milestones[i].name);
 }
 const env=context();Object.assign(env.ctx,{MILESTONES:data.MILESTONES,soundManager:{playMilestoneChoice(){}}});
 const g=game();g.rivals=[];g.renderMilestoneAdvisorPanel=()=>{};g.showCoachingTip=()=>{};
 vm.runInContext('('+methods.showMilestoneModal+')',env.ctx).call(g);
 assert.equal(env.get('milestoneModalTitle').textContent,'Escolha sua primeira meta');
 env.api.milestoneAdvice(g,data.MILESTONES.aether,0);assert.match(env.get('milestoneAdvisorPanel').innerHTML,/20 \/ 40/);
 assert.match(env.get('milestoneGrid').innerHTML,/Aumento na avaliação do negócio/);assert.match(env.get('milestoneGrid').innerHTML,/Bônus didático de caixa/);assert.doesNotMatch(env.get('milestoneGrid').innerHTML.replace(/<!--[\s\S]*?-->/g,''),/£|NHS|Research|Choose|Valuation/);
});
test('both tutorial routes have consistent topic counts and all guided content is adapted',()=>{
 assert.equal(properties.coreTopics.length,14);assert.equal(properties.advancedTopics.length,4);assert.equal(Object.keys(properties.tutorialTopics).length,18);
 const all=JSON.stringify(properties);assert.doesNotMatch(all,/NHS|FCA|PhD|£|AI startup|R&D|Guided Play|Choose Your/);
 for(const id of [...properties.coreTopics,...properties.advancedTopics]){assert.ok(properties.tutorialTopics[id]?.more);assert.ok(properties.topicCards[id]?.desc);}
 for(const type of ['beginner','quick']){
  const g={...properties,tutorialType:type};for(const name of ['getCurrentTopicList','getTutorialTotalSteps','getTutorialContent','getBeginnerTutorialContent'])g[name]=vm.runInNewContext('('+methods[name]+')');
  assert.equal(g.getTutorialTotalSteps(),type==='beginner'?18:14);
  for(let step=1;step<=g.getTutorialTotalSteps();step++)assert.match(g.getBeginnerTutorialContent(step),/<h2/);
 }
});
