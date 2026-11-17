'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),patch=require('../tools/generic-general-context-patch.cjs'),cat=require('../locales/generic-general-context.pt-BR.json'),original=fs.readFileSync(require.resolve('../source/index.original.html'),'utf8');
function at(n,p){for(const k of p)n=n.type==='ArrayExpression'?n.elements[k]:n.properties.find(q=>(q.key.name??q.key.value)===k).value;return n;}
const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v);
test('seventy-three general events change only594approved literals and retain the whole generic table AST',()=>{
 const before=patch.locate(original).node,result=patch.apply(original),after=patch.locate(result.html).node;assert.equal(result.reports[0].translations,594);for(const[k,v]of Object.entries(cat.GENERIC_EVENTS.strings)){const n=at(after,JSON.parse(k));assert.equal(n.value,v.target);n.value=v.source;}assert.equal(clean(after),clean(before));
});
test('general patch rejects catalogue drift and changes to effects, choices, restaurant filters or technical flags',()=>{
 const key=Object.keys(cat.GENERIC_EVENTS.strings)[0],change=fn=>{const c=structuredClone(cat);fn(c.GENERIC_EVENTS.strings);assert.throws(()=>patch.apply(original,c));};change(s=>delete s[key]);change(s=>delete s['["all",11,"choices",2,"reaction"]']);change(s=>s['["all",73,"intro"]']={source:'extra',target:'Outro'});change(s=>s[key].source+='stale');
 for(const target of ['', '<script>','custo42','£ preço','modelo de IA','provedor LLM','serviço cloud','startup UK','órgão MHRA','processo UKCA','regra ASA','marca ZOE','lei LGPD','modelo de app',String.fromCharCode(96),'$'+'{cash}','[NEW] outro'])change(s=>s[key].target=target);
 const {node,base}=patch.locate(original);function replace(p,text){const n=at(node,p);return original.slice(0,base+n.start)+text+original.slice(base+n.end);}
 for(const p of [['all',0,'choices',0,'ap'],['all',0,'choices',0,'cost']])assert.throws(()=>patch.apply(replace(p,'999')));
 const eff=at(node,['all',0,'choices',0,'eff']).properties[0].value;assert.throws(()=>patch.apply(original.slice(0,base+eff.start)+'999'+original.slice(base+eff.end)));
 assert.throws(()=>patch.apply(replace(['all',0,'llm'],'false')));assert.throws(()=>patch.apply(replace(['all',5,'sectors',0],'"aether"')));assert.throws(()=>patch.apply(replace(['all',0,'choices',2],'null')));
 const choices=at(node,['all',0,'choices']);assert.throws(()=>patch.apply(original.slice(0,base+choices.end-1)+',null'+original.slice(base+choices.end-1)));
 for(const i of [12,20,23])assert.throws(()=>patch.apply(replace(['all',i,'sectors',0],'"aether"')));
 for(const field of ['ap','cost'])assert.throws(()=>patch.apply(replace(['all',23,'choices',0,field],'999')));
 assert.throws(()=>patch.apply(replace(['all',23,'choices',0,'mood'],'0')));
 const added=at(node,['all',23]);assert.throws(()=>patch.apply(original.slice(0,base+added.start+1)+'llm:true,'+original.slice(base+added.start+1)));
 for(const i of [24,33,34,35])assert.throws(()=>patch.apply(replace(['all',i,'sectors',0],'"aether"')));
 for(const field of ['ap','cost'])assert.throws(()=>patch.apply(replace(['all',35,'choices',0,field],'999')));
 const newest=at(node,['all',35]);assert.throws(()=>patch.apply(original.slice(0,base+newest.start+1)+'llm:true,'+original.slice(base+newest.start+1)));
 for(const i of [36,45,46,47])assert.throws(()=>patch.apply(replace(['all',i,'sectors',0],'"aether"')));
 for(const field of ['ap','cost','mood'])assert.throws(()=>patch.apply(replace(['all',47,'choices',0,field],'999')));
 assert.throws(()=>patch.apply(replace(['all',46,'llm'],'false')));
 const last=at(node,['all',47]);assert.throws(()=>patch.apply(original.slice(0,base+last.start+1)+'llm:true,'+original.slice(base+last.start+1)));
 for(const i of [48,52,56,59])assert.throws(()=>patch.apply(replace(['all',i,'sectors',0],'"aether"')));
 for(const i of [52,56])assert.throws(()=>patch.apply(replace(['all',i,'llm'],'false')));
 for(const field of ['ap','cost','mood'])assert.throws(()=>patch.apply(replace(['all',59,'choices',0,field],'999')));
 const finalNew=at(node,['all',59]);assert.throws(()=>patch.apply(original.slice(0,base+finalNew.start+1)+'llm:true,'+original.slice(base+finalNew.start+1)));
 for(const p of patch.conditionalPaths){change(s=>delete s[JSON.stringify(p)]);change(s=>s[JSON.stringify(p)].source+='stale');}
 for(const i of [70,72])assert.throws(()=>patch.apply(replace(['all',i,'llm'],'false')));
 for(const i of [60,61])assert.throws(()=>patch.apply(replace(['all',i,'sectors',0],'"aether"')));
 for(const i of [62,65,67,69,72]){const e=at(node,['all',i]);assert.throws(()=>patch.apply(original.slice(0,base+e.start+1)+'sectors:["avam"],'+original.slice(base+e.start+1)));}
 for(const p of [['all',65,'choices',0,'chance'],['all',65,'choices',1,'chance'],['all',67,'choices',0,'chance'],['all',67,'choices',1,'chance'],['all',69,'choices',0,'chance']])assert.throws(()=>patch.apply(replace(p,'0.99')));
 const conditionalEff=at(node,['all',65,'choices',0,'successEff']).properties[0].value;assert.throws(()=>patch.apply(original.slice(0,base+conditionalEff.start)+'999'+original.slice(base+conditionalEff.end)));
 const event=at(node,['all',1]);assert.throws(()=>patch.apply(original.slice(0,base+event.start+1)+'sectors:["voed"],'+original.slice(base+event.start+1)));
});
test('generated general text retains all594paths and prior operations532 and marketing274',()=>{
 const n=patch.locate(fs.readFileSync(require.resolve('../index.html'),'utf8')).node;for(const catalog of [cat,require('../locales/generic-operations-context.pt-BR.json'),require('../locales/generic-marketing-context.pt-BR.json')])for(const[k,v]of Object.entries(catalog.GENERIC_EVENTS.strings))assert.equal(at(n,JSON.parse(k)).value,v.target);
 for(let i=0;i<73;i++){assert.equal(at(n,['all',i,'choices']).elements.length,3);const event=at(n,['all',i]),sector=event.properties.find(p=>(p.key.name??p.key.value)==='sectors'),flag=event.properties.find(p=>(p.key.name??p.key.value)==='llm');if(i>=5&&i<62)assert.deepEqual(sector.value.elements.map(x=>x.value),[i<20?'voed':i<34?'arene':i<46?'sorgente':'avam']);else assert.equal(sector,undefined);if(i===0||i===4||i===46||i===52||i===56||i===70||i===72)assert.equal(flag.value.value,true);else assert.equal(flag,undefined);}
});

test('actual quarterly summary selects all ten conditional reactions and preserves base fallback without running a game',()=>{
 const acorn=require('acorn'),walk=require('acorn-walk'),vm=require('node:vm');
 function method(html){const found=[];for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;walk.full(acorn.parse(m[2],{ecmaVersion:'latest'}),n=>{if(['Property','MethodDefinition'].includes(n.type)&&(n.key?.name??n.key?.value)==='saveQuarterSummary')found.push(m[2].slice(n.start,n.end));});}assert.equal(found.length,1);return found[0];}
 const built=fs.readFileSync(require.resolve('../index.html'),'utf8'),source=method(built);assert.equal(source,method(original));const save=vm.runInNewContext('({'+source+'})').saveQuarterSummary,table=patch.locate(built).node;
 const loc=patch.locate(built);function event(i){const n=at(table,['all',i]);return vm.runInNewContext('('+built.slice(loc.base+n.start,loc.base+n.end)+')');}
 assert.equal(patch.conditionalPaths.length,10);for(const[i,c]of [[65,0],[65,1],[67,0],[67,1],[69,0]])for(const outcome of [undefined,true,false]){
  const e=event(i),choice=e.choices[c],g={choices:{research:c},currentEvents:{research:{event:e}},trackDecisionPattern(){this.tracked=(this.tracked||0)+1;},quarterSummaries:[],turn:1,metrics:{burn:1,cash:1,staff:1,val:0},milestone:null,milestoneProgress:0};if(outcome!==undefined)g.chanceOutcomes={research:outcome};save.call(g);assert.equal(g.quarterSummaries.length,1);assert.equal(g.tracked,1);const r=g.quarterSummaries[0].decisions[0];assert.equal(r.reaction,outcome===undefined?choice.reaction:outcome?choice.successReaction:choice.failureReaction);assert.equal(r.choice,choice.text);assert.equal(r.intro,e.intro);
 }
});
