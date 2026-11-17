const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const acorn=require('acorn'),walk=require('acorn-walk');
const ventures=require('../locales/ventures.pt-BR.json');
const guidance=require('../locales/setup-guidance.pt-BR.json');
function extract(file){
 const result={data:{},methods:{},functions:{},properties:{}};
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  const code=m[2];walk.ancestor(acorn.parse(code,{ecmaVersion:'latest'}),{
   VariableDeclarator(n){if(['VENTURE_DETAILS','FOUNDER_PROFILES','FOUNDER_PORTRAITS','COMPANIES','REVENUE_MODELS'].includes(n.id.name))result.data[n.id.name]=vm.runInNewContext('('+code.slice(n.init.start,n.init.end)+')');if(['getAvatar','renderAvatar'].includes(n.id.name))result.functions[n.id.name]=code.slice(n.init.start,n.init.end);},
   FunctionDeclaration(n){if(n.id?.name==='renderCandidatePortrait')result.functions[n.id.name]=code.slice(n.start,n.end);},
   PropertyDefinition(n,parents){if(n.key.name==='coachingTips'&&parents.some(p=>p.type==='ClassDeclaration'&&p.id.name==='Game'))result.properties[n.key.name]=vm.runInNewContext('('+code.slice(n.value.start,n.value.end)+')');},
   MethodDefinition(n,parents){if(parents.some(p=>p.type==='ClassDeclaration'&&p.id.name==='Game'))result.methods[n.key.name]='function('+n.value.params.map(p=>code.slice(p.start,p.end)).join(',')+')'+code.slice(n.value.body.start,n.value.body.end);}
  });
 }return result;
}
const built=extract('index.html'),original=extract('source/index.original.html');
const plain=v=>JSON.parse(JSON.stringify(v));
test('all twelve venture detail dialogs use the supplied Brazilian content, including variable-length lists',()=>{
 assert.equal(Object.keys(ventures).length,12);
 const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',innerHTML:'',classList:{add(){},remove(){}}});return nodes.get(id);};
 const context=vm.createContext({...built.data,LOGOS:{},SlingshotCompanyDisplay:require('../company-display'),soundManager:{playClick(){}},document:{getElementById:get}});
 const show=vm.runInContext('('+built.methods.showVentureInfo+')',context),game={};
 for(const [id,v]of Object.entries(ventures)){
  show.call(game,id);assert.equal(game.viewingVentureId,id);
  for(const [field,element]of Object.entries({name:'Name',sector:'Archetype',desc:'Tagline',product:'Product',customers:'Customers',revenue:'Revenue',competition:'Competition'}))assert.equal(get('ventureInfo'+element).textContent,v[field],id+'.'+field);
  for(const [field,element]of [['whyWork','WhyWork'],['whyHard','WhyHard']])assert.equal(get('ventureInfo'+element).innerHTML,v[field].map(t=>'<li>• '+t+'</li>').join(''),id+'.'+field);
  assert.doesNotMatch(JSON.stringify(built.data.VENTURE_DETAILS[id]),/\bNHS\b|\bFCA\b|£|Londres|London|radiolog|\bAPI\b|cyber|jurídic|fundos quantitativos/i);
 }
});
test('venture content adaptation preserves canonical IDs, models and economics',()=>{
 const before=plain(original.data.COMPANIES),after=plain(built.data.COMPANIES);
 for(let i=0;i<before.length;i++){
  assert.equal(after[i].id,before[i].id);
  assert.equal(after[i].name,ventures[before[i].id].name);
  assert.equal(after[i].desc,ventures[before[i].id].desc);
  after[i].name=before[i].name;
  after[i].desc=before[i].desc;
 }
 assert.deepEqual(after,before);
 const models=plain(built.data.REVENUE_MODELS);
 for(const [id,model]of Object.entries(models)){model.name=original.data.REVENUE_MODELS[id].name;model.description=original.data.REVENUE_MODELS[id].description;}
 assert.deepEqual(models,plain(original.data.REVENUE_MODELS));
 const restored=built.methods.calculateQuarterlyRevenue.replace('    const operating = SlingshotOperations.revenue(this);\n    if (operating) return operating;\n','').replace('    const brazil = SlingshotManagement.revenue(this,grossRevenue,supportCosts,maxEfficiency);\n','').replace('brazil ? brazil.support : Math.round(supportCosts)','Math.round(supportCosts)').replace('return brazil || {','return {');
 const normalized=s=>s.replace(/[ \t]+(?=\r?\n)/g,'');
 assert.equal(normalized(restored),normalized(original.methods.calculateQuarterlyRevenue));
 for(const id of Object.keys(original.data.FOUNDER_PROFILES))assert.deepEqual(plain(built.data.FOUNDER_PROFILES[id].stats),plain(original.data.FOUNDER_PROFILES[id].stats));
});
test('leaders and candidates render local objects even when a saved avatar contains a portrait or remote URL',()=>{
 const context=vm.createContext({});
 for(const [name,code]of Object.entries(built.functions))context[name]=vm.runInContext('('+code+')',context);
 for(const source of ['https://example.invalid/person.png','<svg><image href="old-face.png"/></svg>','👩🏿‍🔬']){
  const avatar=context.renderAvatar(source,'Perfil fictício');assert.match(avatar,/<svg/);assert.doesNotMatch(avatar,/<image|(?:href|src)=|👩/);
  const candidate=context.renderCandidatePortrait({id:'r1',portrait:source},80,'research');assert.match(candidate,/<svg/);assert.doesNotMatch(candidate,/<image|(?:href|src)=|👩/);
 }
});
test('setup coaching uses the three active management profiles and preserves display timing and dismissal behavior',()=>{
 for(const [id,tip]of Object.entries(guidance)){
  assert.equal(built.properties.coachingTips[id].quarter,original.properties.coachingTips[id].quarter);
  for(const [field,value]of Object.entries(tip))assert.equal(built.properties.coachingTips[id][field],value);
 }
 const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',innerHTML:'',checked:false,classList:{add(){},remove(){}}});return nodes.get(id);};
 const show=vm.runInNewContext('('+built.methods.showCoachingTip+')',{document:{getElementById:get}});
 const game={guidedPlayMode:true,coachingTips:built.properties.coachingTips,coachingTipsDismissed:new Set(),coachingTipsShown:new Set(),turn:1};
 show.call(game,'setup_founder');assert.equal(get('coachingTitle').textContent,guidance.setup_founder.title);assert.equal(get('coachingSubtitle').textContent,'Tutorial guiado • Preparação');
 assert.ok(game.coachingTipsShown.has('setup_founder'));
 get('coachingTitle').textContent='inalterado';show.call(game,'setup_founder');assert.equal(get('coachingTitle').textContent,'inalterado');
 game.coachingTipsDismissed.add('setup_venture');show.call(game,'setup_venture');assert.equal(get('coachingTitle').textContent,'inalterado');
});
