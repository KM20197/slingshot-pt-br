'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const patch=require('../tools/char-yuki-context-patch.cjs'),cat=require('../locales/char-yuki-context.pt-BR.json');
const original=fs.readFileSync(require.resolve('../source/index.original.html'),'utf8');
const indices=[0,1,2,3,4,5,6,8,9,10,11,12,13,14,15];
function at(n,path){for(const k of path)n=n.type==='ArrayExpression'?n.elements[k]:n.properties.find(q=>(q.key.name??q.key.value)===k).value;return n;}
const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v);
test('Yuki changes exactly120literals with full character table AST parity and no clinical overlap',()=>{
 const result=patch.apply(original),before=patch.locate(original).node,after=patch.locate(result.html).node;
 assert.equal(result.reports[0].translations,120);
 const clinic=require('../locales/clinic-legacy-decisions.pt-BR.json').CHAR_EVENTS.strings;
 for(const[k,v]of Object.entries(cat.CHAR_EVENTS.strings)){assert.ok(!Object.hasOwn(clinic,k));const n=at(after,JSON.parse(k));assert.equal(n.value,v.target);n.value=v.source;}
 assert.equal(clean(after),clean(before));
});
test('Yuki rejects stale sources, wrong paths, unsafe prose, changed metadata, order and pool',()=>{
 const first='["research","yuki",0,"intro"]';
 function change(fn){const c=structuredClone(cat);fn(c.CHAR_EVENTS.strings);assert.throws(()=>patch.apply(original,c));}
 change(s=>delete s[first]);change(s=>s[first].source+='stale');
 for(const i of [7,16])change(s=>{s[JSON.stringify(['research','yuki',i,'intro'])]=s[first];delete s[first];});
 for(const target of ['', '<script>','prazo42','£ exemplo','patente','licenciamento','Horizon','Turing','KTP','PhD','IA','startup','CLT','LGPD','subsídio','equity','proteção legal',String.fromCharCode(96),'$'+'{cash}','{rival}','[NEW] extra'])change(s=>s[first].target=target);
 const extra=structuredClone(cat);extra.GENERIC_EVENTS={strings:{}};assert.throws(()=>patch.apply(original,extra));
 const{node,base}=patch.locate(original),replace=(path,text)=>{const n=at(node,path);return original.slice(0,base+n.start)+text+original.slice(base+n.end);};
 for(const i of indices)assert.throws(()=>patch.apply(replace(['research','yuki',i,'choices',0,'cost'],'999')));
 for(const path of [['research','yuki',2,'choices',0,'ap'],['research','yuki',3,'choices',0,'eff','cash'],['research','yuki',3,'choices',1,'eff','cash'],['research','yuki',8,'choices',2,'eff','dev'],['research','yuki',11,'choices',0,'eff','dev'],['research','yuki',0,'choices',1,'mood'],['research','yuki',0,'choices',2,'mood'],['research','yuki',13,'choices',0,'eff','mkt'],['research','yuki',13,'choices',0,'eff','hr'],['research','yuki',13,'choices',2,'eff','sci'],['research','yuki',14,'choices',0,'eff','cash'],['research','yuki',14,'choices',1,'eff','cash'],['research','yuki',14,'choices',0,'eff','hr'],['research','yuki',15,'choices',0,'eff','sci'],['research','yuki',15,'choices',2,'mood']])assert.throws(()=>patch.apply(replace(path,'999')));
 const event=at(node,['research','yuki',0]);
 for(const flag of ['sectors:["aether"],','llm:true,','chance:0.5,','id:"new_id",'])assert.throws(()=>patch.apply(original.slice(0,base+event.start+1)+flag+original.slice(base+event.start+1)));
 const choices=at(node,['research','yuki',0,'choices']),parts=choices.elements.map(e=>original.slice(base+e.start,base+e.end));
 assert.throws(()=>patch.apply(replace(['research','yuki',0,'choices'],'['+[parts[1],parts[0],parts[2]].join(',')+']')));
 assert.throws(()=>patch.apply(replace(['research','yuki',12,'choices',2],'null')));
 const pool=at(node,['research','yuki']);assert.throws(()=>patch.apply(original.slice(0,base+pool.end-1)+',null'+original.slice(base+pool.end-1)));
});
test('generated Yuki covers all128prose fields of16events including8clinical fields and preserves metadata',()=>{
 const node=patch.locate(fs.readFileSync(require.resolve('../index.html'),'utf8')).node,before=patch.locate(original).node;
 const clinic=require('../locales/clinic-legacy-decisions.pt-BR.json').CHAR_EVENTS.strings;let clinicalYuki=0;
 for(const[k,v]of Object.entries(cat.CHAR_EVENTS.strings))assert.equal(at(node,JSON.parse(k)).value,v.target);
 for(const[k,v]of Object.entries(clinic)){assert.equal(at(node,JSON.parse(k)).value,v.target);const path=JSON.parse(k);if(path[0]==='research'&&path[1]==='yuki')clinicalYuki++;}
 assert.equal(clinicalYuki,8);assert.equal(at(node,['research','yuki']).elements.length,16);
 for(let i=0;i<16;i++)assert.equal(patch.metadataHash(at(node,['research','yuki',i])),patch.metadataHash(at(before,['research','yuki',i])));
 const covered=new Set(Object.keys(cat.CHAR_EVENTS.strings));
 for(const k of Object.keys(clinic))if(JSON.parse(k)[1]==='yuki')covered.add(k);
 assert.equal(covered.size,128);
 for(let i=0;i<16;i++){const path=['research','yuki',i];for(const f of ['intro','aside'])assert.ok(covered.has(JSON.stringify([...path,f])));for(let c=0;c<3;c++)for(const f of ['text','reaction'])assert.ok(covered.has(JSON.stringify([...path,'choices',c,f])));}
 for(const[i,c,n]of [[14,0,80],[14,1,60]])assert.equal(at(node,['research','yuki',i,'choices',c,'eff','cash']).value,n);
 for(const[i,c,f]of [[13,0,'mkt'],[13,0,'hr'],[13,2,'sci'],[14,0,'hr'],[15,0,'sci']]){const n=at(node,['research','yuki',i,'choices',c,'eff',f]);assert.equal(n.type,'UnaryExpression');assert.equal(n.argument.value,1);}
 const mood=at(node,['research','yuki',15,'choices',2,'mood']);assert.equal(mood.type,'UnaryExpression');assert.equal(mood.argument.value,1);
 assert.equal(at(node,['research','yuki',2,'choices',0,'ap']).value,6);
 for(const[i,c,n]of [[3,0,80],[3,1,40]])assert.equal(at(node,['research','yuki',i,'choices',c,'eff','cash']).value,n);
 for(const[i,c]of [[8,2],[11,0]]){const eff=at(node,['research','yuki',i,'choices',c,'eff','dev']);assert.equal(eff.type,'UnaryExpression');assert.equal(eff.argument.value,1);}
});
