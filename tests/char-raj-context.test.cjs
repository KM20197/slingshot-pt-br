'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const patch=require('../tools/char-raj-context-patch.cjs'),cat=require('../locales/char-raj-context.pt-BR.json'),original=fs.readFileSync(require.resolve('../source/index.original.html'),'utf8');
const indices=Array.from({length:16},(_,i)=>i),cashPaths=[[1,0,80],[1,1,50],[2,0,50],[2,1,20],[9,0,60],[9,1,45],[9,2,30],[10,0,90]],families=['clinic-legacy-decisions','char-fatima-context','char-yuki-context','char-kwame-context','char-aoife-context'];
function at(n,path){for(const k of path)n=n.type==='ArrayExpression'?n.elements[k]:n.properties.find(q=>(q.key.name??q.key.value)===k).value;return n;}
const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v),value=n=>n.type==='UnaryExpression'?-n.argument.value:n.value;
test('Raj changes exactly128literals with whole character table AST parity and no overlap with744accepted fields',()=>{
 const result=patch.apply(original),before=patch.locate(original).node,after=patch.locate(result.html).node;assert.equal(result.reports[0].translations,128);
 const protectedKeys=new Set();for(const family of families)for(const k of Object.keys(require('../locales/'+family+'.pt-BR.json').CHAR_EVENTS.strings))protectedKeys.add(k);assert.equal(protectedKeys.size,744);
 for(const[k,v]of Object.entries(cat.CHAR_EVENTS.strings)){assert.ok(!protectedKeys.has(k));const n=at(after,JSON.parse(k));assert.equal(n.value,v.target);n.value=v.source;}assert.equal(clean(after),clean(before));
 const portuguese=structuredClone(cat);portuguese.CHAR_EVENTS.strings['["dev","raj",0,"intro"]'].target='Se eu organizar os recursos, a rotina melhora.';assert.doesNotThrow(()=>patch.apply(original,portuguese));
 portuguese.CHAR_EVENTS.strings['["dev","raj",0,"intro"]'].target='Eliminar atritos ajuda o atendimento.';assert.doesNotThrow(()=>patch.apply(original,portuguese));
});
test('Raj rejects stale or unsafe prose, hidden receipts or adolescent context and altered metadata atomically',()=>{
 const first='["dev","raj",0,"intro"]',change=fn=>{const c=structuredClone(cat);fn(c.CHAR_EVENTS.strings);assert.throws(()=>patch.apply(original,c));};
 change(s=>delete s[first]);change(s=>s[first].source+=' stale');for(const path of [['dev','raj',16,'aside'],['dev','aoife',0,'intro'],['dev','raj',16,'intro']])change(s=>{s[JSON.stringify(path)]=s[first];delete s[first];});
 for(const target of ['', '<script>','prazo42','US','us','EU','União Europeia','NDA','API','SaaS','TeamChat','banco','regulador','empréstimo','juros','criptografia','software','IA','startup','equity','LGPD','CLT','patente','licenciamento','código','robôs','automação','programação','tribunal','advogado','liminar','proteção automática','exclusividade garantida',String.fromCharCode(96),'$'+'{cash}','{rival}','[NEW] extra'])change(s=>s[first].target=target);
 for(const[i,c]of cashPaths)change(s=>s[JSON.stringify(['dev','raj',i,'choices',c,'reaction'])].target='Só uma conversa sem consequência.');change(s=>s['["dev","raj",5,"intro"]'].target='Público genérico sem contexto.');
 for(const c of [0,1])change(s=>s[JSON.stringify(['dev','raj',13,'choices',c,'text'])].target='Guardar apenas o necessário.');
 const extra=structuredClone(cat);extra.GENERIC_EVENTS={strings:{}};assert.throws(()=>patch.apply(original,extra));
 const {node,base}=patch.locate(original),replace=(path,text)=>{const n=at(node,path);return original.slice(0,base+n.start)+text+original.slice(base+n.end);};
 for(const i of indices)assert.throws(()=>patch.apply(replace(['dev','raj',i,'choices',0,'cost'],'999')));
 for(const[i,c]of cashPaths)assert.throws(()=>patch.apply(replace(['dev','raj',i,'choices',c,'eff','cash'],'999')));
 assert.throws(()=>patch.apply(replace(['dev','raj',0,'choices',2,'mood'],'999')));assert.throws(()=>patch.apply(replace(['dev','raj',6,'choices',0,'ap'],'999')));assert.throws(()=>patch.apply(replace(['dev','raj',2,'sectors'],'["aether"]')));
 for(const path of [[12,'choices',0,'eff','mkt'],[12,'choices',2,'mood'],[14,'choices',1,'eff','sci'],[14,'choices',2,'mood'],[15,'choices',2,'eff','mkt'],[15,'choices',2,'mood']])assert.throws(()=>patch.apply(replace(['dev','raj',...path],'999')));assert.throws(()=>patch.apply(replace(['dev','raj',15,'sectors'],'["dream"]')));
 const event=at(node,['dev','raj',0]);for(const flag of ['sectors:["aether"],','llm:true,','chance:0.5,','id:"new_id",'])assert.throws(()=>patch.apply(original.slice(0,base+event.start+1)+flag+original.slice(base+event.start+1)));
 const choices=at(node,['dev','raj',0,'choices']),parts=choices.elements.map(e=>original.slice(base+e.start,base+e.end));assert.throws(()=>patch.apply(replace(['dev','raj',0,'choices'],'['+[parts[1],parts[0],parts[2]].join(',')+']')));assert.throws(()=>patch.apply(replace(['dev','raj',11,'choices',2],'null')));const pool=at(node,['dev','raj']);assert.throws(()=>patch.apply(original.slice(0,base+pool.end-1)+',null'+original.slice(base+pool.end-1)));
});
test('generated Raj covers128fields in16of16events and preserves eight receipts, all metadata and accepted catalogues',()=>{
 const node=patch.locate(fs.readFileSync(require.resolve('../index.html'),'utf8')).node,before=patch.locate(original).node;
 for(const[k,v]of Object.entries(cat.CHAR_EVENTS.strings))assert.equal(at(node,JSON.parse(k)).value,v.target);assert.equal(Object.keys(cat.CHAR_EVENTS.strings).length,128);assert.equal(at(node,['dev','raj']).elements.length,16);
 for(const family of families)for(const[k,v]of Object.entries(require('../locales/'+family+'.pt-BR.json').CHAR_EVENTS.strings))assert.equal(at(node,JSON.parse(k)).value,v.target);
 for(let i=0;i<16;i++)assert.equal(patch.metadataHash(at(node,['dev','raj',i])),patch.metadataHash(at(before,['dev','raj',i])));
 for(const[i,c,expected]of cashPaths){assert.equal(value(at(node,['dev','raj',i,'choices',c,'eff','cash'])),expected);assert.match(cat.CHAR_EVENTS.strings[JSON.stringify(['dev','raj',i,'choices',c,'reaction'])].target,/receita|pagamento|contrata/i);}
 for(const path of [[12,'choices',0,'eff','mkt'],[12,'choices',2,'mood'],[14,'choices',2,'mood'],[15,'choices',2,'mood']])assert.equal(value(at(node,['dev','raj',...path])),-1);assert.equal(value(at(node,['dev','raj',14,'choices',1,'eff','sci'])),1);assert.equal(value(at(node,['dev','raj',15,'choices',2,'eff','mkt'])),0);assert.deepEqual(at(node,['dev','raj',15,'sectors']).elements.map(x=>x.value),['dream','voed','sorgente']);
 assert.equal(value(at(node,['dev','raj',0,'choices',2,'mood'])),-1);assert.equal(at(node,['dev','raj',2,'sectors']).elements[0].value,'quant');assert.match(cat.CHAR_EVENTS.strings['["dev","raj",5,"intro"]'].target,/adolescent/i);
});
