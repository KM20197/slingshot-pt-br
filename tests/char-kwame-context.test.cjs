'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const patch=require('../tools/char-kwame-context-patch.cjs'),cat=require('../locales/char-kwame-context.pt-BR.json'),original=fs.readFileSync(require.resolve('../source/index.original.html'),'utf8');
const indices=[0,1,2,3,4,5,6,7,8,9,10,12,13,15,16,17,18,19,20,21,22];
function at(n,path){for(const k of path)n=n.type==='ArrayExpression'?n.elements[k]:n.properties.find(q=>(q.key.name??q.key.value)===k).value;return n;}
const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v);
test('Kwame changes exactly168literals with full character table AST parity and no clinical overlap',()=>{
 const result=patch.apply(original),before=patch.locate(original).node,after=patch.locate(result.html).node;assert.equal(result.reports[0].translations,168);
 assert.match(cat.CHAR_EVENTS.strings['["research","kwame",2,"intro"]'].target,/\beu\b/);
 const clinic=require('../locales/clinic-legacy-decisions.pt-BR.json').CHAR_EVENTS.strings;
 for(const[k,v]of Object.entries(cat.CHAR_EVENTS.strings)){assert.ok(!Object.hasOwn(clinic,k));const n=at(after,JSON.parse(k));assert.equal(n.value,v.target);n.value=v.source;}assert.equal(clean(after),clean(before));
});
test('Kwame rejects stale sources, wrong paths, unsafe claims, hidden participation, changed effects and ordering',()=>{
 const first='["research","kwame",0,"intro"]',change=fn=>{const c=structuredClone(cat);fn(c.CHAR_EVENTS.strings);assert.throws(()=>patch.apply(original,c));};
 change(s=>delete s[first]);change(s=>s[first].source+='stale');for(const i of [11,14,23])change(s=>{s[JSON.stringify(['research','kwame',i,'intro'])]=s[first];delete s[first];});
 for(const target of ['', '<script>','prazo42','£ exemplo','Nature','CortexAI','CodeRepo','Theranos','Silicon Valley','EU','União Europeia','união europeia','IA','startup','software','patente','licenciamento','equity','CLT','LGPD','subsídio','proteção legal',String.fromCharCode(96),'$'+'{cash}','{rival}','[NEW] extra'])change(s=>s[first].target=target);
 change(s=>s['["research","kwame",5,"choices",0,"text"]'].target='Formalizar apenas uma conversa');
 const extra=structuredClone(cat);extra.GENERIC_EVENTS={strings:{}};assert.throws(()=>patch.apply(original,extra));
 const {node,base}=patch.locate(original),replace=(path,text)=>{const n=at(node,path);return original.slice(0,base+n.start)+text+original.slice(base+n.end);};
 for(const i of indices)assert.throws(()=>patch.apply(replace(['research','kwame',i,'choices',0,'cost'],'999')));
 for(const path of [['research','kwame',3,'choices',0,'eff','hr'],['research','kwame',5,'choices',0,'eff','equity'],['research','kwame',10,'choices',0,'eff','dev'],['research','kwame',15,'choices',2,'eff','hr'],['research','kwame',17,'choices',2,'eff','mkt'],['research','kwame',19,'choices',2,'eff','sci'],['research','kwame',20,'choices',2,'eff','hr'],['research','kwame',20,'choices',0,'eff','cash'],['research','kwame',6,'choices',0,'ap']])assert.throws(()=>patch.apply(replace(path,'999')));
 for(const i of [0,1,2,8,13,20,22])assert.throws(()=>patch.apply(replace(['research','kwame',i,'choices',2,'mood'],'999')));
 const event=at(node,['research','kwame',0]);for(const flag of ['sectors:["aether"],','llm:true,','chance:0.5,','id:"new_id",'])assert.throws(()=>patch.apply(original.slice(0,base+event.start+1)+flag+original.slice(base+event.start+1)));
 const choices=at(node,['research','kwame',0,'choices']),parts=choices.elements.map(e=>original.slice(base+e.start,base+e.end));assert.throws(()=>patch.apply(replace(['research','kwame',0,'choices'],'['+[parts[1],parts[0],parts[2]].join(',')+']')));
 assert.throws(()=>patch.apply(replace(['research','kwame',12,'choices',2],'null')));const pool=at(node,['research','kwame']);assert.throws(()=>patch.apply(original.slice(0,base+pool.end-1)+',null'+original.slice(base+pool.end-1)));
});
test('generated Kwame covers168catalogue and16clinical fields across all23events with preserved metadata',()=>{
 const node=patch.locate(fs.readFileSync(require.resolve('../index.html'),'utf8')).node,before=patch.locate(original).node,covered=new Set(Object.keys(cat.CHAR_EVENTS.strings));
 for(const[k,v]of Object.entries(cat.CHAR_EVENTS.strings))assert.equal(at(node,JSON.parse(k)).value,v.target);
 let clinicalKwame=0;for(const[k,v]of Object.entries(require('../locales/clinic-legacy-decisions.pt-BR.json').CHAR_EVENTS.strings)){assert.equal(at(node,JSON.parse(k)).value,v.target);const path=JSON.parse(k);if(path[0]==='research'&&path[1]==='kwame'){clinicalKwame++;covered.add(k);}}
 assert.equal(clinicalKwame,16);assert.equal(covered.size,184);assert.equal(at(node,['research','kwame']).elements.length,23);
 for(let i=0;i<23;i++)assert.equal(patch.metadataHash(at(node,['research','kwame',i])),patch.metadataHash(at(before,['research','kwame',i])));
 for(let i=0;i<23;i++){const path=['research','kwame',i];for(const f of ['intro','aside'])assert.ok(covered.has(JSON.stringify([...path,f])));for(let c=0;c<3;c++)for(const f of ['text','reaction'])assert.ok(covered.has(JSON.stringify([...path,'choices',c,f])));}
 for(const[i,f]of [[3,'hr'],[5,'equity'],[10,'dev']]){const n=at(node,['research','kwame',i,'choices',0,'eff',f]);assert.equal(n.type,'UnaryExpression');assert.equal(n.argument.value,1);}
 for(const[c,value]of [[0,40],[1,80],[2,120]])assert.equal(at(node,['research','kwame',20,'choices',c,'eff','cash']).value,value);
 assert.match(cat.CHAR_EVENTS.strings['["research","kwame",5,"choices",0,"text"]'].target,/participação no negócio/i);
});
