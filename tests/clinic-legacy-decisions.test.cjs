'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const patch=require('../tools/clinic-legacy-decisions-patch.cjs');
const catalogue=require('../locales/clinic-legacy-decisions.pt-BR.json');
const original=fs.readFileSync(require.resolve('../source/index.original.html'),'utf8');
function table(html){let value;for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;walk.ancestor(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n,a){if(n.id?.name==='CHAR_EVENTS'&&!a.some(x=>/Function/.test(x.type)))value=n.init;}});}assert.ok(value);return value;}
function nodeAt(n,path){for(const k of path)n=n.type==='ArrayExpression'?n.elements[k]:n.properties.find(p=>(p.key.name??p.key.value)===k).value;return n;}
const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v);
test('clinic adaptation changes only its 104 approved literals; all sectors, choices and effects retain AST parity',()=>{
 const result=patch.apply(original),before=table(original),after=table(result.html);
 assert.equal(result.reports[0].translations,104);
 for(const [key,item] of Object.entries(catalogue.CHAR_EVENTS.strings)){const n=nodeAt(after,JSON.parse(key));assert.equal(n.value,item.target);n.value=item.source;}
 assert.equal(clean(after),clean(before));
});
test('clinic catalogue rejects missing, technical, divergent, empty and injected paths before producing output',()=>{
 const change=fn=>{const c=structuredClone(catalogue);fn(c.CHAR_EVENTS.strings);assert.throws(()=>patch.apply(original,c));};
 const key=Object.keys(catalogue.CHAR_EVENTS.strings)[0];
 change(s=>delete s[key]);change(s=>delete s['["marketing","emma",6,"intro"]']);change(s=>s['["research","fatima",0,"cost"]']={source:'35',target:'trinta'});
 change(s=>s[key].source+='alterado');change(s=>s[key].target='');
 for(const text of ['<script>alteração</script>','${game.cash}','nova regra 42','MHRA autoriza','NHS organiza','Royal College','modelos de IA','MoU aprovado','NDA protege'])change(s=>s[key].target=text);
 assert.throws(()=>patch.apply(original.replace('sectors: ["aether"],','sectors: ["cyber"],')));
});
test('generated game contains the approved administrative text at all 104 paths',()=>{
 const generated=table(fs.readFileSync(require.resolve('../index.html'),'utf8'));
 for(const [key,item] of Object.entries(catalogue.CHAR_EVENTS.strings))assert.equal(nodeAt(generated,JSON.parse(key)).value,item.target);
});
