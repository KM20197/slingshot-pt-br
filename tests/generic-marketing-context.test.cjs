'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const patch=require('../tools/generic-marketing-context-patch.cjs'),cat=require('../locales/generic-marketing-context.pt-BR.json'),original=fs.readFileSync(require.resolve('../source/index.original.html'),'utf8');
function table(html){let result;for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;walk.ancestor(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n,a){if(n.id?.name==='GENERIC_EVENTS'&&!a.some(x=>/Function/.test(x.type)))result={node:n.init,base:m.index+m[0].indexOf('>')+1};}});}assert.ok(result);return result;}
function at(n,p){for(const k of p)n=n.type==='ArrayExpression'?n.elements[k]:n.properties.find(q=>(q.key.name??q.key.value)===k).value;return n;}
const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v);
test('all34generic marketing events change only274approved literals and retain all effects, flags, sectors and unrelated pools',()=>{
 const result=patch.apply(original),before=table(original).node,after=table(result.html).node;assert.equal(result.reports[0].translations,274);
 for(const[k,v]of Object.entries(cat.GENERIC_EVENTS.strings)){const n=at(after,JSON.parse(k));assert.equal(n.value,v.target);n.value=v.source;}assert.equal(clean(after),clean(before));
});
test('generic marketing patch refuses missing, stale, injected, technical and sector-altered catalogues or sources',()=>{
 const key=Object.keys(cat.GENERIC_EVENTS.strings)[0],change=fn=>{const c=structuredClone(cat);fn(c.GENERIC_EVENTS.strings);assert.throws(()=>patch.apply(original,c));};
 change(s=>delete s[key]);change(s=>s['["marketing",34,"intro"]']={source:'extra',target:'Extra'});change(s=>s[key].source+='divergente');
 change(s=>delete s['["marketing",31,"choices",3,"text"]']);
 for(const target of ['', '<script>erro</script>','regra42','NHS aprova','comunidade UK','prêmio startup','relatório Gartner','modelo de IA','provedor LLM','UK GDPR','registro INPI','lei LGPD','rede GitHub','Pangram detecta',String.fromCharCode(96),'$'+'{game.cash}','[NEW] outro'])change(s=>s[key].target=target);
 const {node,base}=table(original),sector=at(node,['marketing',12,'sectors',0]);
 assert.throws(()=>patch.apply(original.slice(0,base+sector.start)+'"cyber"'+original.slice(base+sector.end)));
 const event=at(node,['marketing',0]);assert.throws(()=>patch.apply(original.slice(0,base+event.start+1)+'sectors:["aether"],'+original.slice(base+event.start+1)));
 const fourth=at(node,['marketing',31,'choices',3]);assert.throws(()=>patch.apply(original.slice(0,base+fourth.start)+original.slice(base+fourth.end)));
});
test('generated generic marketing text contains all274approved paths, shared event12 filters and event31four choices',()=>{
 const n=table(fs.readFileSync(require.resolve('../index.html'),'utf8')).node;
 for(const[k,v]of Object.entries(cat.GENERIC_EVENTS.strings))assert.equal(at(n,JSON.parse(k)).value,v.target);
 assert.deepEqual(at(n,['marketing',12,'sectors']).elements.map(x=>x.value),['aether','sorgente']);assert.equal(at(n,['marketing',12,'choices']).elements.length,3);assert.equal(at(n,['marketing',31,'choices']).elements.length,4);
});
