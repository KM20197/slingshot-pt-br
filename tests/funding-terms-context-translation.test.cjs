const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),parse5=require('parse5');
const patch=require('../tools/funding-terms-context-translation-patch.cjs'),locale=require('../locales/funding-terms-context.pt-BR.json'),catalogue=require('../locales/pt-BR.json');
const original=fs.readFileSync('source/index.original.html','utf8'),escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function texts(html){const modals=[],out=[];function scan(n){if(n.attrs?.some(a=>a.name==='id'&&a.value===locale.modalId))modals.push(n);for(const c of n.childNodes||[])scan(c);}scan(parse5.parse(html,{sourceCodeLocationInfo:true}));assert.equal(modals.length,1);function walk(n,skip=false){skip=skip||['script','style'].includes(n.tagName);if(n.nodeName==='#text'&&!skip&&n.value.trim())out.push(n);for(const c of n.childNodes||[])walk(c,skip);}walk(modals[0]);return out;}
function replace(html,edits){for(const e of edits.sort((a,b)=>b.start-a.start))html=html.slice(0,e.start)+e.text+html.slice(e.end);return html;}
function edit(html,node,target){const l=node.sourceCodeLocation,raw=html.slice(l.startOffset,l.endOffset);return {start:l.startOffset,end:l.endOffset,text:raw.match(/^\s*/)[0]+escape(target)+raw.match(/\s*$/)[0]};}
function phase(){return replace(original,texts(original).filter(n=>Object.hasOwn(catalogue,n.value.trim())).map(n=>edit(original,n,catalogue[n.value.trim()])));}
const row=(i,source,target,occurrence=0,expectedOccurrences=1)=>({nodeIndex:i,source,target,occurrence,expectedOccurrences});
const fixture='<div id="fundingTermsHelpModal"><p>Same</p><p>Keep</p><p>Same</p></div>';
const data={modalId:locale.modalId,nodes:[row(0,'Same','Primeiro',0,2),row(1,'Keep',null),row(2,'Same','Segundo',1,2)]};
test('conteúdo real na fase pós-catálogo troca somente44textos e mantém os18restantes e scripts',()=>{
 const before=phase(),nodes=texts(before);assert.equal(nodes.length,62);assert.deepEqual(nodes.map(n=>n.value.trim()),locale.nodes.map(n=>n.source));
 const expected=replace(before,locale.nodes.filter(r=>r.target!==null).map(r=>edit(before,nodes[r.nodeIndex],r.target))),out=patch.apply(before);
 assert.equal(out,expected);assert.equal(patch.translations.length,44);assert.equal(locale.nodes.filter(r=>r.target===null).length,18);
 const scripts=s=>[...s.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)].map(m=>m[1]);assert.deepEqual(scripts(out),scripts(before));assert.throws(()=>patch.apply(out),/divergente/);
});
test('fontes duplicadas recebem targets distintos nas posições aprovadas, sem afetar nó preservado',()=>{
 assert.equal(patch.apply(fixture,data),'<div id="fundingTermsHelpModal"><p>Primeiro</p><p>Keep</p><p>Segundo</p></div>');
});
test('rejeita fonte e ordem stale, duplicatas novas, contagem, ocorrência inválida e modal inválido',()=>{
 for(const html of [fixture.replace('Keep','Stale'),fixture.replace('<p>Same</p><p>Keep</p>','<p>Keep</p><p>Same</p>'),fixture.replace('Keep','Same'),fixture.replace('<p>Keep</p>',''),fixture.replace('fundingTermsHelpModal','other'),fixture+fixture])assert.throws(()=>patch.apply(html,data));
 for(const change of [{nodeIndex:1},{occurrence:1},{expectedOccurrences:3},{target:undefined},{target:''}]){const copy=structuredClone(data);Object.assign(copy.nodes[0],change);assert.throws(()=>patch.apply(fixture,copy));}
 assert.throws(()=>patch.apply(fixture,{...data,modalId:'other'}));
});
test('entidades, whitespace e escaping preservam atributos, outros modais e script/style',()=>{
 const input='<p>A &amp; B</p><div id="fundingTermsHelpModal"><p title="A &amp; B">\n  A &amp; B  \n</p><script>A &amp; B</script><style>A &amp; B</style><span>Keep</span></div><div id="other">A &amp; B</div>';
 const custom={modalId:locale.modalId,nodes:[row(0,'A & B','C & <D>'),row(1,'Keep',null)]};
 assert.equal(patch.apply(input,custom),input.replace('\n  A &amp; B  \n','\n  C &amp; &lt;D&gt;  \n'));
});
