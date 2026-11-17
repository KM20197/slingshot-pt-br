'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),parse5=require('parse5'),acorn=require('acorn'),walk=require('acorn-walk');
const patch=require('../tools/decision-presentation-patch.cjs'),cat=require('../locales/decision-presentation.pt-BR.json');
const baseline=fs.readFileSync(require.resolve('./fixtures/decision-presentation-baseline.html'),'utf8');
const patched=patch.apply(baseline);
const labelMap=new Map(cat.items.filter(x=>x.kind==='Literal').map(x=>[x.source,x.target]));
function methods(html,globals={}){const definitions=[];for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;walk.ancestor(acorn.parse(m[2],{ecmaVersion:'latest'}),{MethodDefinition(n,a){if(patched.report.methods.includes(n.key.name)&&a.some(x=>x.type==='ClassDeclaration'&&x.id?.name==='Game'))definitions.push(m[2].slice(n.start,n.end));}});}assert.equal(definitions.length,6);return vm.runInNewContext('({'+definitions.join(',')+'})',globals);}
function skeleton(html){function visit(n){return {name:n.nodeName,attrs:n.attrs?.map(a=>n.nodeName==='span'&&a.name==='title'&&a.value===labelMap.get('Mood hidden in Extreme Mode')?{...a,value:'Mood hidden in Extreme Mode'}:a),children:(n.childNodes||[]).filter(x=>x.nodeName!=='#text').map(visit)};}return JSON.stringify(visit(parse5.parseFragment(html)));}
test('decision presentation is pinned to67pairs/72occurrences and refuses stale methods, selectors and injected targets',()=>{
 assert.equal(patched.report.pairs,67);assert.equal(patched.report.occurrences,72);assert.equal(patched.report.methods.length,6);
 const change=fn=>{const c=structuredClone(cat);fn(c);assert.throws(()=>patch.apply(baseline,c));};
 change(c=>c.items.pop());change(c=>c.items[0].method='confirmChoice');change(c=>c.items[0].source+='alterado');
 for(const target of ['<script>alterado</script>',String.fromCharCode(96),'$'+'{game.cash}','regra42',''])change(c=>c.items[0].target=target);
 const spaced=cat.items.findIndex(x=>x.source===' Year ');change(c=>c.items[spaced].target='Ano');
 assert.throws(()=>patch.apply(baseline.replace('decisionArea','anotherArea')));
 assert.throws(()=>patch.apply(baseline.replace('if (ap >= 4)','if (ap >= 5)')));
 const generated=fs.readFileSync(require.resolve('../index.html'),'utf8'),p=methods(patched.html),g=methods(generated);
 for(const name of patched.report.methods)assert.equal(g[name].toString(),p[name].toString(),name);
});
test('localized titles, descriptions, metric labels and impact tags retain original classification and ordering',()=>{
 const before=methods(baseline),after=methods(patched.html);
 for(const intro of ['research science','product feature','market sales','team hire','partner','customer','cost budget','Uma recepção organizada'])assert.equal(after.generateEventTitle({intro},'research'),labelMap.get(before.generateEventTitle({intro},'research')));
 for(const text of ['academic university','hire recruit','acquire buy','partner','contractor outsource','train develop','organizar recepção'])for(const ap of [0,1,2,3,4,5]){
  const choice={text,ap};assert.equal(after.generateChoiceDescription(choice,'research'),labelMap.get(before.generateChoiceDescription(choice,'research')));
 }
 for(const key of ['sci','dev','mkt','hr','burn','val','cash','equity','other'])assert.equal(after.getStatLabel(key),labelMap.get(before.getStatLabel(key))??key);
 const choices=[{text:'aggressive careful university',ap:4,cost:50,eff:{sci:5,mkt:4,hr:3,burn:1,cash:50}},{text:'partner pricing',ap:2,cost:10,eff:{cash:-50,hr:-3}},{text:'team build immediate',ap:1,cost:5,eff:{dev:5}},{text:'fees',ap:1,cost:20,eff:{cash:-10}},{text:'finance',ap:1,cost:20,eff:{cash:10}}];
 for(const choice of choices)for(const domain of ['research','dev','marketing','hr']){
  const expected=Array.from(before.generateImpactTags(choice,domain),x=>({...x,label:labelMap.get(x.label)})),actual=Array.from(after.generateImpactTags(choice,domain),x=>({...x}));
  assert.deepEqual(actual,expected);
 }
 const clinic=require('../locales/clinic-legacy-decisions.pt-BR.json');for(const[k,v]of Object.entries(clinic.CHAR_EVENTS.strings))if(JSON.parse(k).at(-1)==='intro')assert.equal(after.generateEventTitle({intro:v.target},'research'),labelMap.get(before.generateEventTitle({intro:v.target},'research')));
});
test('actual decision renderers preserve DOM, choice sorting, handlers, advice, selected/pass/extreme states and timing',()=>{
 function render(html,{empty=false,selected,extreme=false,domain='research',advice=true,conflict=true}={}){
  const dom=new Map(),toggles=[];const document={getElementById(id){if(!dom.has(id))dom.set(id,{innerHTML:'',classList:{toggle(...args){toggles.push([id,...args]);}}});return dom.get(id);}};
  const proto=methods(html,{document,Date:{now:()=>123},SlingshotOperationalDecisions:{enabled:()=>false},SlingshotManagement:{roles:{research:'Operações',dev:'Produção',marketing:'Vendas',hr:'Pessoas'}},renderAvatar:()=>'<span>objeto</span>',localizeText:t=>t,getRegion:()=>({currency:'R$',currencyMultiplier:1})});
  const event={intro:'Situação fictícia',aside:'Atenção ao fluxo',choices:[{text:'Organizar',reaction:'Primeira',ap:1,cost:5,eff:{}},{text:'Conferir',reaction:'Segunda',ap:4,cost:40,eff:{}}]};
  const game=Object.assign(Object.create(null),...patched.report.methods.map(name=>({[name]:proto[name]})),{currentDomain:domain,team:empty?{}:{[domain]:{name:'Pessoa Fictícia',title:'Gestão',avatar:'objeto'}},currentEvents:empty?{}:{[domain]:{event}},choices:{[domain]:selected},moods:{[domain]:2},extremeMode:extreme,quarter:2,year:1,decisionTiming:{currentDomain:null},funderAdvices:empty||!advice?[]:[{domain,recommendedChoice:1,funderName:'Perfil A',funderId:'a',text:'Parecer A'},...(conflict?[{domain,recommendedChoice:0,funderName:'Perfil B',funderId:'b',text:'Parecer B'}]:[])],getFunderTypeLabel:()=> 'Perfil',renderEffectBadges:()=>'<span>Efeito</span>'});
  proto.renderDecision.call(game);proto.renderExecRow.call(game);
  return {decision:dom.get('decisionArea').innerHTML,row:dom.get('execRow').innerHTML,toggles,timing:game.decisionTiming};
 }
 for(const options of [{empty:true},{selected:1},{selected:-1},{extreme:true},{domain:'dev'},{domain:'marketing'},{domain:'hr'},{advice:false},{conflict:false}]){
  const before=render(baseline,options),after=render(patched.html,options);
  assert.equal(skeleton(after.decision),skeleton(before.decision));assert.equal(skeleton(after.row),skeleton(before.row));assert.deepEqual(after.toggles,before.toggles);assert.deepEqual(after.timing,before.timing);
  if(!options.empty){assert.ok(after.decision.indexOf('data-choice-index="1"')<after.decision.indexOf('data-choice-index="0"'));assert.ok(after.decision.includes("game.confirmChoice('"+(options.domain||'research')+"', -1)"));}
  if(options.selected===1)assert.ok(after.decision.includes(labelMap.get('✓ Selected')));
  if(options.selected===-1)assert.ok(after.decision.includes(labelMap.get('✓ Passing')));
  if(options.empty)assert.ok(after.decision.includes(cat.items.find(x=>x.source==='No decision pending').target));
  if(options.extreme)assert.ok(after.row.includes('title="'+labelMap.get('Mood hidden in Extreme Mode')+'"'));
 }
 const delegated=[],sentinel={};const operational=methods(patched.html,{SlingshotOperationalDecisions:{enabled:()=>true,renderDecision:g=>{delegated.push(g);return 'decision';},renderExecRow:g=>{delegated.push(g);return 'row';}}});
 assert.equal(operational.renderDecision.call(sentinel),'decision');assert.equal(operational.renderExecRow.call(sentinel),'row');assert.deepEqual(delegated,[sentinel,sentinel]);
});
