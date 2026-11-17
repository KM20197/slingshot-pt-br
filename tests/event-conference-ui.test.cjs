'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk'),parse5=require('parse5');
const life=require('../locales/life-event-ui.pt-BR.json'),conf=require('../locales/conference-ui.pt-BR.json'),{apply}=require('../tools/event-conference-ui-patch.cjs');
const original=fs.readFileSync('source/index.original.html','utf8'),built=fs.readFileSync('index.html','utf8');
const normal=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v);
function methods(html){const result={};for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;walk.ancestor(acorn.parse(m[2],{ecmaVersion:'latest'}),{MethodDefinition(n,aa){if(aa.some(x=>x.type==='ClassDeclaration'&&x.id?.name==='Game')&&conf.methodPins[n.key.name])result[n.key.name]=n;}});}return result;}
function strings(n){const out=[];walk.simple(n,{Literal(v){if(typeof v.value==='string')out.push(v);},TemplateElement(v){out.push(v);}});return out;}
test('generated event/conference methods restore to original rules, expressions, selectors and shared pitch/demo-day content',()=>{
 const before=methods(original),after=methods(built);
 for(const name of Object.keys(conf.methodPins)){
  const old=strings(before[name]),next=strings(after[name]);assert.equal(old.length,next.length);
  const pairs=[...life.methods,...conf.methods].filter(x=>x.method===name);
  for(const pair of pairs){let count=0;for(let i=0;i<old.length;i++){const source=old[i].type==='Literal'?old[i].value:old[i].value.raw;if(old[i].type===pair.kind&&source===pair.source){assert.equal(next[i].type,old[i].type);assert.equal(next[i].type==='Literal'?next[i].value:next[i].value.raw,pair.target);next[i].value=structuredClone(old[i].value);count++;}}assert.equal(count,pair.count||1,name+' '+pair.source);}
  assert.equal(normal(after[name]),normal(before[name]),name);
 }
});
test('presentation rejects omitted/technical bindings, source drift, numeric changes and injected markup/interpolations',()=>{
 for(const mutate of [c=>c.methods.pop(),c=>c.methods.push({method:'startConference',kind:'Literal',source:'confBudget',target:'other'}),c=>c.methods[0].source='Drift',c=>c.methods.find(x=>x.source==='SPY −2').target='ESPIÃO −3',c=>c.methods.find(x=>x.kind==='TemplateElement').target='${game.reset()}',c=>c.methods.find(x=>x.source==='£').target='R$ <img src=x onerror=alert(1)>']){
  const data=structuredClone(conf);mutate(data);assert.throws(()=>apply(original,life,data));
 }
 assert.throws(()=>apply(original.replace('showLifeEvent(event) {','showLifeEvent(event) { /* drift */'),life,conf));
});
test('scoped modal structure and actions survive and monetary labels distinguish whole units from thousands',()=>{
 function roots(html){const all=[];function visit(n){all.push(n);for(const x of n.childNodes||[])visit(x);}visit(parse5.parse(html));return Object.fromEntries(['lifeEventModal','conferenceModal','conferenceResultsModal','minigameIntroModal'].map(id=>[id,all.find(n=>n.attrs?.some(a=>a.name==='id'&&a.value===id))]));}
 function skeleton(n){return {name:n.nodeName,attrs:n.attrs,children:(n.childNodes||[]).filter(n=>n.nodeName!=='#text').map(skeleton)};}
 const old=roots(original),next=roots(built);for(const id of Object.keys(old))assert.deepEqual(skeleton(next[id]),skeleton(old[id]),id);
 assert.ok(built.includes('Encontro empresarial fictício'));assert.ok(built.includes('CONCORRENTE A'));assert.ok(built.includes('CONCORRENTE B'));
 assert.equal(life.methods.find(x=>x.source==='k cash</span>').target,' mil de caixa</span>');
 assert.equal(conf.methods.find(x=>x.method==='startConference'&&x.source==='£').target,'R$ ');
 assert.ok(conf.methods.find(x=>x.source==='k Cash').target.includes('mil'));
 const texts=[];function visit(n){if(n.nodeName==='#text')texts.push(n.value);for(const x of n.childNodes||[])visit(x);}for(const n of Object.values(next))visit(n);
 assert.doesNotMatch(texts.join(' '),/£|TechSummit|London|NEXAGEN AI|SYNTHEX LABS|AETHER BIOLABS|Life Happens|Quick Tips|Debrief Insights/);
});
