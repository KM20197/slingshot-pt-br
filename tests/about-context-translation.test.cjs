const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),parse5=require('parse5');
const patch=require('../tools/about-context-translation-patch.cjs');
const locale=require('../locales/about-context.pt-BR.json');
const original=fs.readFileSync('source/index.original.html','utf8');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');

function modalNode(html,id){
 const found=[];
 (function walk(node){
  if((node.attrs||[]).some(attr=>attr.name==='id'&&attr.value===id))found.push(node);
  for(const child of node.childNodes||[])walk(child);
 })(parse5.parse(html,{sourceCodeLocationInfo:true}));
 assert.equal(found.length,1);
 return found[0];
}
// Implementação independente dos trechos: monta o HTML esperado sem reutilizar o patch.
function expected(html,data){
 const modal=modalNode(html,data.modalId||'aboutModal');
 const texts=[];
 (function walk(node,skip){
  skip=skip||node.tagName==='script'||node.tagName==='style';
  if(node.nodeName==='#text'&&!skip&&node.sourceCodeLocation)texts.push(node);
  for(const child of node.childNodes||[])walk(child,skip);
 })(modal,false);
 const edits=data.translations.map(item=>{
  const hits=texts.filter(node=>node.value.trim()===item.source);
  assert.equal(hits.length,1,item.source.slice(0,50));
  const loc=hits[0].sourceCodeLocation,lead=hits[0].value.length-hits[0].value.trimStart().length,tail=hits[0].value.length-hits[0].value.trimEnd().length;
  assert.equal(html.slice(loc.startOffset+lead,loc.endOffset-tail),item.source);
  return {start:loc.startOffset+lead,end:loc.endOffset-tail,text:escape(item.target)};
 });
 let out=html;
 for(const edit of edits.sort((a,b)=>b.start-a.start))out=out.slice(0,edit.start)+edit.text+out.slice(edit.end);
 return out;
}
function sliceBetween(html,id){
 const node=modalNode(html,id),loc=node.sourceCodeLocation;
 return html.slice(loc.startTag?.startOffset??loc.startOffset,loc.endTag?.endOffset??loc.endOffset);
}
function hrefs(html,id){
 const raw=sliceBetween(html,id);
 return [...raw.matchAll(/href="([^"]*)"/g)].map(match=>match[1]);
}
function scripts(html){
 return [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)].map(match=>match[1]);
}

test('aplicação no original troca somente os 66 valores e preserva modal de créditos, scripts e links',()=>{
 const after=patch.apply(original);
 assert.equal(locale.translations.length,66);
 assert.equal(after,expected(original,locale));
 assert.equal(sliceBetween(after,'contributorsModal'),sliceBetween(original,'contributorsModal'));
 assert.deepEqual(scripts(after),scripts(original));
 assert.deepEqual(hrefs(after,locale.modalId),hrefs(original,locale.modalId));
 assert.ok(after.includes('ES/X003949/1'));
});

test('fontes iguais fora do modal, em script, style e atributos permanecem intactos',()=>{
 const data={modalId:'aboutModal',translations:[{source:'Alpha beta',target:'Alfa & <gama>'}]};
 const fixture='<div id="otherModal"><p>Alpha beta</p></div><div id="aboutModal"><p>Alpha beta</p><script>Alpha beta</script><style>Alpha beta</style><span title="Alpha beta">rótulo</span></div><p>Alpha beta</p>';
 const out=patch.apply(fixture,data);
 assert.equal(out,fixture.replace('<p>Alpha beta</p><script>Alpha beta</script>','<p>Alfa &amp; &lt;gama&gt;</p><script>Alpha beta</script>'));
});

test('preserva espaço de borda e não inventa espaço antes de pontuação',()=>{
 const data={modalId:'aboutModal',translations:[{source:'. olá mundo',target:'. oi, mundo'}]};
 const fixture='<div id="aboutModal">\n   <p>  . olá mundo  </p>\n</div>';
 const out=patch.apply(fixture,data);
 assert.equal(out,'<div id="aboutModal">\n   <p>  . oi, mundo  </p>\n</div>');
});

test('rejeita modal ausente, modal duplicado, source ausente, source duplicado e reexecução',()=>{
 const full=patch.apply(original);
 assert.throws(()=>patch.apply('<div id="other"><p>x</p></div>',locale),/ausente ou duplicado/);
 assert.throws(()=>patch.apply('<div id="aboutModal"></div><div id="aboutModal"></div>',locale),/ausente ou duplicado/);
 const data={modalId:'aboutModal',translations:[{source:'Alpha beta',target:'Alfa gama'}]};
 assert.throws(()=>patch.apply('<div id="aboutModal"><p>Alpha</p></div>',data),/Ocorrência de "Alpha beta" em aboutModal: 0/);
 assert.throws(()=>patch.apply('<div id="aboutModal"><p>Alpha beta</p><p>Alpha beta</p></div>',data),/Ocorrência de "Alpha beta" em aboutModal: 2/);
 assert.throws(()=>patch.apply(full,locale),/Ocorrência de/);
});
