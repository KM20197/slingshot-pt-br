'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const acorn=require('acorn'),walk=require('acorn-walk');
const {apply}=require('../tools/life-conference-context-patch.cjs');
const names=['LIFE_EVENTS','CONFERENCES','TICKER_LINES','DELEGATE_TYPES'];
function tables(html){
 const result={};
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;
  walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n){if(names.includes(n.id.name))result[n.id.name]=n.init;}});
 }
 return result;
}
function normalize(n){return JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v);}
test('event and conference catalogue preserves all original noneditorial data and every approved path',()=>{
 const before=tables(fs.readFileSync('source/index.original.html','utf8'));
 const after=tables(fs.readFileSync('index.html','utf8'));
 const catalogue=JSON.parse(fs.readFileSync('locales/life-conference-context.pt-BR.json','utf8'));
 for(const name of names){
  const visited=new Set();
  function restore(value,path){
   const key=JSON.stringify(path),entry=catalogue[name].strings[key];
   if(entry){assert.equal(value.type,'Literal');assert.equal(value.value,entry.target);value.value=entry.source;visited.add(key);}
   else if(value.type==='ArrayExpression')value.elements.forEach((v,i)=>{if(v)restore(v,[...path,i]);});
   else if(value.type==='ObjectExpression')for(const p of value.properties)if(p.type==='Property'&&!p.computed)restore(p.value,[...path,p.key.type==='Identifier'?p.key.name:p.key.value]);
  }
  restore(after[name],[]);
  assert.equal(visited.size,Object.keys(catalogue[name].strings).length);
  assert.equal(normalize(after[name]),normalize(before[name]),name+' rules, IDs, ordering and geometry');
 }
});
test('editorial integration rejects missing, technical, unknown and divergent catalogue paths',()=>{
 const html='<script>const LIFE_EVENTS=[{id:"x",title:"Title",text:"Text",effect:{value:15}}];const CONFERENCES={aether:[{name:"Name",location:"Location"}]};const TICKER_LINES={generic:["Ticker"],closing:"Closing"};const DELEGATE_TYPES=[{type:"investor",name:"Investor",value:8}];</script>';
 const cat={};
 for(const [name,items] of Object.entries({LIFE_EVENTS:[[[0,'title'],'Title','Título'],[[0,'text'],'Text','Texto']],CONFERENCES:[[['aether',0,'name'],'Name','Encontro'],[['aether',0,'location'],'Location','Local']],TICKER_LINES:[[['generic',0],'Ticker','Aviso'],[['closing'],'Closing','Encerramento']],DELEGATE_TYPES:[[[0,'name'],'Investor','Representante']]}))cat[name]={classification:'editorial',strings:Object.fromEntries(items.map(([p,source,target])=>[JSON.stringify(p),{source,target}]))};
 assert.ok(apply(html,cat).html.includes('Título'));
 for(const mutate of [c=>delete c.LIFE_EVENTS.strings['[0,"text"]'],c=>c.LIFE_EVENTS.strings['[0,"id"]']={source:'x',target:'y'},c=>c.EXTRA={strings:{}},c=>c.LIFE_EVENTS.strings['[0,"text"]'].source='Drift']){
  const changed=structuredClone(cat);mutate(changed);assert.throws(()=>apply(html,changed));
 }
 assert.throws(()=>apply(html.replace('</script>','const LIFE_EVENTS=[];</script>'),cat));
});
test('conference names and venues are fictional and all life-event descriptions have Brazilian editorial coverage',()=>{
 const cat=JSON.parse(fs.readFileSync('locales/life-conference-context.pt-BR.json','utf8'));
 for(const {target} of Object.values(cat.CONFERENCES.strings))assert.match(target,/fictíci[oa]/i);
 for(const [name,entry] of Object.entries(cat))for(const {source,target} of Object.values(entry.strings)){
  assert.notEqual(source,target,name);
  assert.doesNotMatch(target,/HMRC|Home Office|Buckingham|King's|NHS|ExCeL|CortexAI|Hacker News|Westminster|Canary Wharf|£|startup|\bAI\b|\bFCA\b/i);
 }
});
