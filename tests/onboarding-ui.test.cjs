const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), acorn = require('acorn'), walk = require('acorn-walk'), parse5 = require('parse5');
const {apply, founderOrder} = require('../tools/onboarding-patch.cjs');
const original = fs.readFileSync('source/index.original.html', 'utf8');
const catalogue = JSON.parse(fs.readFileSync('locales/structures.pt-BR.json', 'utf8'));
const translated = require('../tools/structured-translation.cjs').translate(original, catalogue).html;
const patched = apply(translated), generated = fs.readFileSync('index.html', 'utf8');
function extract(html) {
  const result = {methods: {}, data: {}};
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/.test(m[1]) || /application\/ld\+json/.test(m[1])) continue;
    walk.ancestor(acorn.parse(m[2], {ecmaVersion: 'latest'}), {
      VariableDeclarator(n) { if (['FOUNDER_PROFILES','FOUNDER_PORTRAITS','COMPANIES','VENTURE_DETAILS','REVENUE_MODELS','BMC_DATA'].includes(n.id.name)) result.data[n.id.name] = m[2].slice(n.init.start,n.init.end); },
      MethodDefinition(n, parents) { if (parents.some(p => p.type === 'ClassDeclaration' && p.id?.name === 'Game')) result.methods[n.key.name] = 'function(' + n.value.params.map(p => m[2].slice(p.start,p.end)).join(',') + ')' + m[2].slice(n.value.body.start,n.value.body.end); }
    });
  }
  return result;
}
const base = extract(translated), changed = extract(patched), built = extract(generated);
const data = Object.fromEntries(Object.entries(built.data).map(([key,code]) => [key, vm.runInNewContext('(' + code + ')')]));
function dom(html) {
  const nodes = [], root = parse5.parseFragment(html);
  function visit(n) { nodes.push(n); for (const c of n.childNodes || []) visit(c); }
  visit(root); return nodes;
}
const attr = (n,key) => n.attrs?.find(a => a.name === key)?.value;
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes || []).map(text).join('');
function environment() {
  const nodes = new Map();
  const get = id => {
    if (id === 'profileInfoExamples') throw new Error('Tentativa de preencher o campo removido');
    if (!nodes.has(id)) nodes.set(id,{value:'',innerHTML:'',textContent:'',classList:{add(){},remove(){}},setAttribute(){}});
    return nodes.get(id);
  };
  const context = vm.createContext({...data,document:{getElementById:get},setTimeout(){},soundManager:{playClick(){}},SlingshotCompanyDisplay:require('../company-display.js')});
  const game = {};
  for (const name of ['showFounderModal','showProfileInfo']) game[name] = vm.runInContext('(' + built.methods[name] + ')',context);
  return {game,get,context};
}
test('L1b changes only three presentation methods and no canonical structures', () => {
  assert.deepEqual(changed.data,base.data);
  const changedMethods = Object.keys(base.methods).filter(n => base.methods[n] !== changed.methods[n]);
  assert.deepEqual(changedMethods.sort(),['init','showFounderModal','showProfileInfo']);
  for (const name of ['saveGame','loadGame','selectFounderProfile','startGame','calculateQuarterlyRevenue']) assert.equal(changed.methods[name],base.methods[name],name);
  // The generated file may contain later lots; this assertion stays scoped to L1b's apply() result.
});
test('intro paragraphs and examples DOM are absent, not hidden or emptied', () => {
  const nodes=dom(generated);
  assert.ok(!nodes.some(n => attr(n,'id') === 'profileInfoExamples'));
  for (const phrase of ['É 2026. Tecnologia e capacidade','A inteligência artificial pode funcionar como','Famous Examples']) assert.ok(!nodes.some(n => n.nodeName === '#text' && n.value.includes(phrase)),phrase);
  assert.ok(!nodes.some(n => n.tagName === 'p' && !text(n).trim() && /leading-relaxed mb-4/.test(attr(n,'class') || '')));
});
test('L1b preserves Ada card and loader; generated card differs only by approved Brazilian static text', () => {
  function adaCard(html) {
    const buttons=dom(html).filter(n => n.tagName === 'button' && attr(n,'onclick') === 'openLoadStartup()');
    assert.equal(buttons.length,1,'Unique Ada loader action');
    return parse5.serialize(buttons[0].parentNode.parentNode);
  }
  assert.equal(adaCard(patched),adaCard(translated));
  let restored=adaCard(generated);
  for(const [source,target] of [
    ['Ada, the venture builder','Ada, criadora de empreendimentos'],
    ['Build your own','Crie seu empreendimento'],
    ['Load your startup','Importar arquivo — integração em desenvolvimento'],
    ['Meet Ada','Consultar Ada — referência externa'],
    ['Work with Ada, who is The Slingshot’s resident venture builder, to develop a new AI startup. You then load the file she gives you and play it here.','Ada é uma ferramenta externa do material de referência. A criação e a importação de empreendimentos da edição brasileira ainda dependem de validação própria. Para jogar com as regras brasileiras disponíveis, escolha um dos doze casos desta edição.'],
  ]) {
    assert.equal(restored.split(target).length-1,1,target);
    restored=restored.replace(target,source);
  }
  assert.equal(restored,adaCard(translated));
  const loader=html=>html.match(/<script id="ada-loader">[\s\S]*?<\/script>/)[0];
  assert.equal(loader(patched),loader(translated));assert.equal(loader(generated),loader(translated));
});
test('actual founder renderer offers exactly the three approved IDs without mutating saved profiles', () => {
  const env=environment(),before=JSON.stringify(data.FOUNDER_PROFILES);
  env.game.showFounderModal();const nodes=dom(env.get('founderProfileGrid').innerHTML);
  const ids=nodes.map(n=>attr(n,'id')).filter(id=>id?.startsWith('profileBtn_')).map(id=>id.slice(11));
  assert.deepEqual(ids,founderOrder);assert.deepEqual(ids,['firsttimer','visionary','strategist']);assert.equal(new Set(ids).size,3);
  assert.equal(JSON.stringify(data.FOUNDER_PROFILES),before);
  assert.equal(data.FOUNDER_PROFILES.firsttimer.name,'O iniciante');
  assert.equal(data.FOUNDER_PROFILES.academic.name,'O recém-egresso');
  checkButtons(nodes,'profile');
});
function checkButtons(nodes,prefix) {
  const byId=new Map(nodes.filter(n=>attr(n,'id')).map(n=>[attr(n,'id'),n]));
  const buttons=nodes.filter(n=>n.tagName==='button');assert.equal(buttons.length,prefix==='profile'?6:24);
  for(const button of buttons) {
    assert.match(text(button).trim(),/^(Saiba mais|Escolher(?: →)?)$/);
    const refs=attr(button,'aria-labelledby').split(' ');
    assert.equal(refs[0],attr(button,'id'));assert.ok(refs[1].startsWith(prefix+'Label_'));
    for(const ref of refs)assert.ok(byId.has(ref),ref);
    const label=refs.map(ref=>text(byId.get(ref))).join(' ').replace(/\s+/g,' ').trim();
    assert.ok(label.length>text(button).trim().length);
    assert.match(attr(button,'onclick'),/game\.(showProfileInfo|selectFounderProfile|showVentureInfo|selectVenture)\('[a-z]+'\)/);
  }
}
test('actual venture rendering statement has Portuguese actions and accessible context', () => {
  const env=environment();env.context.LOGOS=Object.fromEntries(data.COMPANIES.map(c=>[c.id,'']));env.context.vg=env.get('ventureGrid');
  const method=built.methods.init,ast=acorn.parse('('+method+')',{ecmaVersion:'latest'});let statement;
  walk.simple(ast,{AssignmentExpression(n){if(n.left.type==='MemberExpression'&&n.left.object.name==='vg'&&n.left.property.name==='innerHTML')statement=('('+method+')').slice(n.start,n.end);}});
  assert.ok(statement);vm.runInContext(statement,env.context);checkButtons(dom(env.get('ventureGrid').innerHTML),'venture');
});
test('all twelve actual profile dialogs open without accessing removed examples', () => {
  const env=environment();for(const id of Object.keys(data.FOUNDER_PROFILES)){env.game.showProfileInfo(id);assert.equal(env.game.viewingProfileId,id);assert.equal(env.get('profileInfoName').textContent,data.FOUNDER_PROFILES[id].icon+' '+data.FOUNDER_PROFILES[id].name);}
});
test('scoped static text catalogue is rendered and close/choose buttons have accessible names', () => {
  const nodes=dom(generated);
  for(const [id,entries]of Object.entries(require('../locales/onboarding.pt-BR.json'))){
    const root=nodes.find(n=>attr(n,'id')===id);assert.ok(root);
    const markup=parse5.serialize(root);
    for(const [source,target]of Object.entries(entries)){assert.ok(markup.includes(target),id+': '+target);assert.ok(!markup.includes('>'+source+'<'),source);}
  }
  for(const id of ['profileInfoChooseBtn','ventureInfoChooseBtn'])assert.ok(attr(nodes.find(n=>attr(n,'id')===id),'aria-labelledby'));
});
test('L1b rejects missing/ambiguous anchors and a second application', () => {
  assert.throws(()=>apply(translated.replace('profileInfoExamples','missingExamples')),/Âncora L1b/);
  assert.throws(()=>apply(translated.replace('Two ways to start','Different heading')),/Âncora L1b/);
  assert.throws(()=>apply(translated.replace('Two ways to start','Two ways to start</h2><h2>Two ways to start')),/Âncora L1b/);
  assert.throws(()=>apply(patched),/Âncora L1b/);
});
test('actual generated load/save methods preserve pre-L1b economic state and founder IDs', () => {
  const finance=require('../finance');
  const loan=finance.settle(finance.create('family',100000,1,'fixture-loan'),2,100000).loan;
  for(let i=0;i<Object.keys(data.FOUNDER_PROFILES).length;i++) {
    const profile=Object.values(data.FOUNDER_PROFILES)[i],company=data.COMPANIES[i];
    const saved={version:'1.3',brEdition:1,companyId:company.id,startupName:'Negócio fictício',turn:3,brCompletedQuarters:2,brLoans:[loan],
      metrics:{cash:125,burn:12},completedMilestones:[],milestone:{id:'m1'},milestoneProgress:25,
      founder:{name:'Pessoa fictícia',profile},founderProfile:profile,founderBonuses:{...profile.stats},
      customers:[{id:'fixture-customer',quarterlyRevenue:3,supportCost:1}],pipeline:[{id:'fixture-pipeline'}],
      revenueModel:data.REVENUE_MODELS[company.revenueModel],fundingStage:'bootstrap',funder:null,location:null};
    if(i>=9){saved.location=require('../management-runtime').locations()[i-9];require('../management-runtime').begin(saved);}
    let stored=JSON.stringify(saved);const errors=[];
    const node={textContent:'',innerHTML:'',style:{},classList:{add(){},remove(){}}};
    const context=vm.createContext({...data,LOGOS:{},console:{error:(...args)=>errors.push(args)},
      document:{getElementById:()=>node},localStorage:{getItem:()=>stored,setItem:(key,value)=>{assert.equal(key,'slingshot_br_save_v1');stored=value;}},
      UIEffects:{showToast(){}},SlingshotSave:require('../save-validation'),SlingshotFinanceAdapter:require('../finance-adapter'),
      SlingshotCompanyDisplay:require('../company-display'),SlingshotOperations:require('../operations-runtime'),SlingshotExport:{reset(){}}});
    const game={runStartTime:1};
    for(const name of ['applyModeAP','ensureTokenSpend','renderTokenSpend','closeAllModals','update','renderAPPips','selectQuarterEvents','log'])game[name]=()=>{};
    game.getStaffAPBonus=()=>0;game.getTokenAPDelta=()=>0;
    const load=vm.runInContext('('+built.methods.loadGame+')',context),save=vm.runInContext('('+built.methods.saveGame+')',context);
    assert.equal(load.call(game),true,JSON.stringify(errors));
    assert.equal(game.company.id,company.id);assert.equal(game.founder.profile.id,profile.id);
    for(const field of ['metrics','customers','pipeline','revenueModel','founderBonuses','brLoans'])assert.equal(JSON.stringify(game[field]),JSON.stringify(saved[field]),field);
    assert.equal(save.call(game,true),true,JSON.stringify(errors));
    const roundTrip=JSON.parse(stored);
    for(const field of ['companyId','startupName','turn','brCompletedQuarters','metrics','customers','pipeline','revenueModel','founderBonuses','brLoans'])assert.equal(JSON.stringify(roundTrip[field]),JSON.stringify(saved[field]),field);
    assert.equal(roundTrip.founder.profile.id,profile.id);assert.equal(errors.length,0);
    assert.equal(JSON.stringify(roundTrip.brManagement),JSON.stringify(saved.brManagement||null));
    if(saved.brManagement){const burn=game.metrics.burn;require('../management-runtime').begin(game);assert.equal(game.metrics.burn,burn);}
  }
});
