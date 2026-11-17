'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const patch=require('../tools/generic-operations-context-patch.cjs'),cat=require('../locales/generic-operations-context.pt-BR.json'),original=fs.readFileSync(require.resolve('../source/index.original.html'),'utf8');
function table(html){let result;for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;walk.ancestor(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n,a){if(n.id?.name==='GENERIC_EVENTS'&&!a.some(x=>/Function/.test(x.type)))result={node:n.init,base:m.index+m[0].indexOf('>')+1};}});}assert.ok(result);return result;}
function at(n,p){for(const k of p)n=n.type==='ArrayExpression'?n.elements[k]:n.properties.find(q=>(q.key.name??q.key.value)===k).value;return n;}
const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v);
test('all sixty-six generic operations events change only532approved literals and retain all effects, flags, sectors and unrelated pools',()=>{
 const result=patch.apply(original),before=table(original).node,after=table(result.html).node;assert.equal(result.reports[0].translations,532);
 for(const[k,v]of Object.entries(cat.GENERIC_EVENTS.strings)){const n=at(after,JSON.parse(k));assert.equal(n.value,v.target);n.value=v.source;}assert.equal(clean(after),clean(before));
});
test('generic operations patch refuses missing, stale, injected, technical and sector-altered catalogues or sources',()=>{
 const key=Object.keys(cat.GENERIC_EVENTS.strings)[0],change=fn=>{const c=structuredClone(cat);fn(c.GENERIC_EVENTS.strings);assert.throws(()=>patch.apply(original,c));};
 change(s=>delete s['["research",31,"choices",2,"reaction"]']);
 change(s=>delete s['["research",47,"choices",2,"reaction"]']);
 change(s=>delete s['["research",49,"choices",3,"text"]']);change(s=>delete s['["research",65,"choices",3,"reaction"]']);
 change(s=>delete s[key]);change(s=>s['["research",66,"intro"]']={source:'extra',target:'Extra'});change(s=>s[key].source+='divergente');
 for(const target of ['', '<script>erro</script>','regra42','NHS aprova','comunidade UK','prêmio startup','relatório Gartner','modelo de IA','provedor LLM','UK GDPR','registro INPI','lei LGPD','rede GitHub','Pangram detecta',String.fromCharCode(96),'$'+'{game.cash}','[NEW] outro'])change(s=>s[key].target=target);
 const {node,base}=table(original); const event=at(node,['research',0]);assert.throws(()=>patch.apply(original.slice(0,base+event.start+1)+'sectors:["aether"],'+original.slice(base+event.start+1)));
 const third=at(node,['research',0,'choices',2]);assert.throws(()=>patch.apply(original.slice(0,base+third.start)+original.slice(base+third.end)));
 for(const i of [49,65]){const fourth=at(node,['research',i,'choices',3]);assert.throws(()=>patch.apply(original.slice(0,base+fourth.start)+original.slice(base+fourth.end)));}
 for(const i of [51,56]){const s=at(node,['research',i,'sectors',0]);assert.throws(()=>patch.apply(original.slice(0,base+s.start)+'"aether"'+original.slice(base+s.end)));}
 const flag=at(node,['research',57,'llm']);assert.throws(()=>patch.apply(original.slice(0,base+flag.start)+'false'+original.slice(base+flag.end)));
});
test('generated operations retains all approved texts and prior marketing adaptations',()=>{
 const n=table(fs.readFileSync(require.resolve('../index.html'),'utf8')).node;
 for(const[k,v]of Object.entries(cat.GENERIC_EVENTS.strings))assert.equal(at(n,JSON.parse(k)).value,v.target);
 for(let i=0;i<66;i++){assert.equal(at(n,['research',i,'choices']).elements.length,i===49||i===65?4:3);const props=at(n,['research',i]).properties,sector=props.find(p=>(p.key.name??p.key.value)==='sectors'),flag=props.find(p=>(p.key.name??p.key.value)==='llm');if(i===51||i===56)assert.deepEqual(sector.value.elements.map(e=>e.value),[i===51?'vanguard':'dream']);else assert.equal(sector,undefined);if(i>=57&&i<=60)assert.equal(flag.value.value,true);else assert.equal(flag,undefined);}
 const marketing=require('../locales/generic-marketing-context.pt-BR.json');for(const[k,v]of Object.entries(marketing.GENERIC_EVENTS.strings))assert.equal(at(n,JSON.parse(k)).value,v.target);
});
