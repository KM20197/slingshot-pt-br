'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const patch=require('../tools/char-aoife-context-patch.cjs'),cat=require('../locales/char-aoife-context.pt-BR.json'),original=fs.readFileSync(require.resolve('../source/index.original.html'),'utf8');
const indices=Array.from({length:28},(_,i)=>i),cashPaths=[[3,0,90],[3,1,80],[4,0,60],[4,1,30],[6,0,40],[6,1,20],[11,1,-10],[12,1,30],[15,0,-25],[18,1,-20],[18,2,-10],[21,0,30],[22,0,-30],[22,2,10]];
function at(n,path){for(const k of path)n=n.type==='ArrayExpression'?n.elements[k]:n.properties.find(q=>(q.key.name??q.key.value)===k).value;return n;}
const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v),value=n=>n.type==='UnaryExpression'?-n.argument.value:n.value;
test('Aoife changes exactly224literals with whole character table AST parity and no overlap with accepted catalogues',()=>{
 const result=patch.apply(original),before=patch.locate(original).node,after=patch.locate(result.html).node;assert.equal(result.reports[0].translations,224);
 const protectedKeys=new Set();for(const family of ['clinic-legacy-decisions','char-fatima-context','char-yuki-context','char-kwame-context'])for(const k of Object.keys(require('../locales/'+family+'.pt-BR.json').CHAR_EVENTS.strings))protectedKeys.add(k);assert.equal(protectedKeys.size,520);
 for(const[k,v]of Object.entries(cat.CHAR_EVENTS.strings)){assert.ok(!protectedKeys.has(k));const n=at(after,JSON.parse(k));assert.equal(n.value,v.target);n.value=v.source;}assert.equal(clean(after),clean(before));
 const pronoun=structuredClone(cat);pronoun.CHAR_EVENTS.strings['["dev","aoife",0,"intro"]'].target='Se eu organizar a rotina, teremos uma base melhor.';assert.doesNotThrow(()=>patch.apply(original,pronoun));
 pronoun.CHAR_EVENTS.strings['["dev","aoife",0,"intro"]'].target='Contar troféus não melhora o atendimento.';assert.doesNotThrow(()=>patch.apply(original,pronoun));
});
test('Aoife rejects stale sources, wrong paths, unsafe prose, hidden cash cost and changed sector or metadata',()=>{
 const first='["dev","aoife",0,"intro"]',change=fn=>{const c=structuredClone(cat);fn(c.CHAR_EVENTS.strings);assert.throws(()=>patch.apply(original,c));};
 change(s=>delete s[first]);change(s=>s[first].source+=' stale');for(const path of [['dev','aoife',27,'unknown'],['research','kwame',0,'intro'],['dev','aoife',28,'intro']])change(s=>{s[JSON.stringify(path)]=s[first];delete s[first];});
 for(const target of ['', '<script>','prazo42','US','us','£ exemplo','Shenzhen','China','Indonésia','Coca-Cola','indenização','liminar','proteção automática','exclusividade garantida','NDA','MIT','GPL','copyleft','copyright','código','robôs','automação','programação','EU','União Europeia','união europeia','IA','startup','software','patente','licenciamento','equity','CLT','FGTS','INSS','LGPD','subsídio','proteção legal','não concorrência','garden leave','tribunal','advogado',String.fromCharCode(96),'$'+'{cash}','{rival}','[NEW] extra'])change(s=>s[first].target=target);
 change(s=>s['["dev","aoife",11,"choices",1,"text"]'].target='Negociar apenas uma conversa');change(s=>s['["dev","aoife",11,"choices",1,"reaction"]'].target='Tudo resolvido sem custo.');
 for(const[i,c]of [[15,0],[18,1],[18,2]])change(s=>s[JSON.stringify(['dev','aoife',i,'choices',c,'reaction'])].target='Não há desembolso.');
 for(const[i,c,f]of [[12,1,'text'],[18,1,'text'],[18,2,'text'],[22,0,'reaction']])change(s=>s[JSON.stringify(['dev','aoife',i,'choices',c,f])].target='Apenas conversar.');
 const extra=structuredClone(cat);extra.GENERIC_EVENTS={strings:{}};assert.throws(()=>patch.apply(original,extra));
 const {node,base}=patch.locate(original),replace=(path,text)=>{const n=at(node,path);return original.slice(0,base+n.start)+text+original.slice(base+n.end);};
 for(const i of indices)assert.throws(()=>patch.apply(replace(['dev','aoife',i,'choices',0,'cost'],'999')));
 for(const[i,c]of cashPaths)assert.throws(()=>patch.apply(replace(['dev','aoife',i,'choices',c,'eff','cash'],'999')));assert.throws(()=>patch.apply(replace(['dev','aoife',11,'choices',0,'eff','hr'],'999')));assert.throws(()=>patch.apply(replace(['dev','aoife',6,'choices',0,'ap'],'999')));
 for(const[i,c]of [[0,2],[1,2],[2,2],[11,0],[14,2],[20,2]])assert.throws(()=>patch.apply(replace(['dev','aoife',i,'choices',c,'mood'],'999')));for(const i of [6,13,14,16])assert.throws(()=>patch.apply(replace(['dev','aoife',i,'sectors'],'["aether"]')));assert.throws(()=>patch.apply(replace(['dev','aoife',19,'choices',0,'eff','dev'],'999')));
 for(const i of [24,25,26,27])for(let c=0;c<3;c++)for(const f of ['ap','cost','mood'])assert.throws(()=>patch.apply(replace(['dev','aoife',i,'choices',c,f],'999')));
 const event=at(node,['dev','aoife',0]);for(const flag of ['sectors:["aether"],','llm:true,','chance:0.5,','id:"new_id",'])assert.throws(()=>patch.apply(original.slice(0,base+event.start+1)+flag+original.slice(base+event.start+1)));
 const choices=at(node,['dev','aoife',0,'choices']),parts=choices.elements.map(e=>original.slice(base+e.start,base+e.end));assert.throws(()=>patch.apply(replace(['dev','aoife',0,'choices'],'['+[parts[1],parts[0],parts[2]].join(',')+']')));assert.throws(()=>patch.apply(replace(['dev','aoife',11,'choices',2],'null')));const pool=at(node,['dev','aoife']);assert.throws(()=>patch.apply(original.slice(0,base+pool.end-1)+',null'+original.slice(base+pool.end-1)));
});
test('generated Aoife covers224fields in all28events and preserves cash and all metadata, cash and all metadata',()=>{
 const node=patch.locate(fs.readFileSync(require.resolve('../index.html'),'utf8')).node,before=patch.locate(original).node;
 for(const[k,v]of Object.entries(cat.CHAR_EVENTS.strings))assert.equal(at(node,JSON.parse(k)).value,v.target);assert.equal(Object.keys(cat.CHAR_EVENTS.strings).length,224);assert.equal(at(node,['dev','aoife']).elements.length,28);
 for(const family of ['clinic-legacy-decisions','char-fatima-context','char-yuki-context','char-kwame-context'])for(const[k,v]of Object.entries(require('../locales/'+family+'.pt-BR.json').CHAR_EVENTS.strings))assert.equal(at(node,JSON.parse(k)).value,v.target);
 for(let i=0;i<28;i++)assert.equal(patch.metadataHash(at(node,['dev','aoife',i])),patch.metadataHash(at(before,['dev','aoife',i])));
 for(const[i,c,expected]of cashPaths)assert.equal(value(at(node,['dev','aoife',i,'choices',c,'eff','cash'])),expected);assert.equal(value(at(node,['dev','aoife',11,'choices',0,'eff','hr'])),-1);
 assert.equal(at(node,['dev','aoife',11,'choices',1,'cost']).value,30);assert.equal(at(node,['dev','aoife',6,'sectors']).elements[0].value,'vanguard');
 for(const[i,c]of [[15,0],[18,1],[18,2]])assert.match(cat.CHAR_EVENTS.strings[JSON.stringify(['dev','aoife',i,'choices',c,'reaction'])].target,/desembolso adicional/i);
 assert.match(cat.CHAR_EVENTS.strings['["dev","aoife",22,"choices",0,"reaction"]'].target,/perda de receita/i);assert.equal(value(at(node,['dev','aoife',19,'choices',0,'eff','dev'])),-1);
 for(const i of [13,14,16])assert.equal(at(node,['dev','aoife',i,'sectors']).elements[0].value,'vanguard');
 assert.match(cat.CHAR_EVENTS.strings['["dev","aoife",11,"choices",1,"text"]'].target,/apoio financeiro/i);assert.match(cat.CHAR_EVENTS.strings['["dev","aoife",11,"choices",1,"reaction"]'].target,/desembolso adicional/i);
});
