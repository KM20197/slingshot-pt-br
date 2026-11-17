const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),parse5=require('parse5');
const {applyFundingPathwayStaticHelp:apply}=require('../tools/funding-pathway-static-help-patch.cjs'),metadata=require('../locales/funding-pathway-static-help.pt-BR.json'),catalogue=require('../locales/pt-BR.json');
const runtime=fs.readFileSync('management-runtime.js','utf8'),original=fs.readFileSync('source/index.original.html','utf8'),sha=s=>crypto.createHash('sha256').update(s).digest('hex'),esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let modal;function visit(n){if(n.attrs?.some(a=>a.name==='id'&&a.value===metadata.modalId))modal=n;for(const c of n.childNodes||[])visit(c);}visit(parse5.parse(original,{sourceCodeLocationInfo:true}));
const loc=modal.sourceCodeLocation,edits=[];function texts(n){if(n.nodeName==='#text'&&Object.hasOwn(catalogue,n.value.trim())){const l=n.sourceCodeLocation,raw=original.slice(l.startOffset,l.endOffset);edits.push({start:l.startOffset,end:l.endOffset,text:raw.match(/^\s*/)[0]+esc(catalogue[n.value.trim()])+raw.match(/\s*$/)[0]});}for(const c of n.childNodes||[])texts(c);}texts(modal);
let phase=original;for(const e of edits.sort((a,b)=>b.start-a.start))phase=phase.slice(0,e.start)+e.text+phase.slice(e.end);
// Resolve fresh source offsets after applying the global text catalogue.
visit(parse5.parse(phase,{sourceCodeLocationInfo:true}));const fresh=modal.sourceCodeLocation,outerStart=phase.slice(fresh.startOffset,fresh.startTag.endOffset),outerEnd=phase.slice(fresh.endTag.startOffset,fresh.endOffset),beforeInner=phase.slice(fresh.startTag.endOffset,fresh.endTag.startOffset);
const payload=runtime.match(/function fundingHelp\(\)\s*\{\s*node\('fundingPathwayHelpModal'\)\.innerHTML=`([^`]+)`;/)[1];
const wrap=(inner,code=runtime)=>'<div id="other" title="Preservar &amp; texto">Antes</div>'+outerStart+inner+outerEnd+'<script>'+code+'</script><script type="application/ld+json">{"name":"fundingHelp"}</script><script src="external.js"></script><p>Depois</p>';
const fixture=wrap(beforeInner),options={runtimeSource:runtime};
const simple=p=>'function fundingHelp(){node(\'fundingPathwayHelpModal\').innerHTML=`'+p+'`;toggle(\'fundingPathwayHelpModal\',true);}';
const scripts=s=>[...s.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)].map(m=>m[1]);

test('fase real do catálogo sincroniza exatamente um interior com o runtime brasileiro sem editar o restante',()=>{
 assert.equal(sha(beforeInner),metadata.beforeInnerSHA256);assert.equal(sha(payload),metadata.runtimePayloadSHA256);
 const result=apply(fixture);assert.equal(result,wrap(payload));assert.deepEqual(scripts(result),scripts(fixture));
 assert.equal(result.slice(0,result.indexOf(payload)),fixture.slice(0,fixture.indexOf(beforeInner)));
 assert.equal(result.slice(result.indexOf(payload)+payload.length),fixture.slice(fixture.indexOf(beforeInner)+beforeInner.length));
 assert.throws(()=>apply(result),/stale|reaplicação/);
});

test('AST rejeita forma, destino, writers adicionais, declaração ambígua e interpolação sem executar código',()=>{
 const good=simple(payload),variants=[
  good.replace('function fundingHelp()','const fundingHelp = () =>'),
  good.replace('function fundingHelp()','const fundingHelp = function()'),
  good.replace("node('fundingPathwayHelpModal')","node('otherModal')"),
  good.replace("node('fundingPathwayHelpModal')","document.getElementById('fundingPathwayHelpModal')"),
  good.replace('.innerHTML=',"['innerHTML']="),good.replace('.innerHTML=','.innerHTML+='),
  good.replace('toggle(',"node('fundingPathwayHelpModal').innerHTML='second';toggle("),
  good+good,good+";fundingHelp=()=>{};",good.replace('<section','${sideEffect()}<section'),
  good.replace('true);','false);'),good.replace('function fundingHelp()','async function fundingHelp()'),
  good.replace('function fundingHelp()','function fundingHelp(arg)'),
  good.replace('node(',"if(false)node("),good.replace('innerHTML=`','innerHTML=String.raw`')
 ];
 for(const code of variants)assert.throws(()=>apply(wrap(beforeInner,code),{runtimeSource:code}));
 // With valid external source, an extra binding or declaration in another inline script is also rejected.
 for(const code of [good,"const fundingHelp=()=>{};"])assert.throws(()=>apply(fixture+'<script>'+code+'</script>',options),/ambígua|paridade/);
});

test('falha fechado para modal ausente/duplicado/sem fecho, interior stale e divergência externa/embutida',()=>{
 for(const html of [fixture.replace('id="fundingPathwayHelpModal"','id="missing"'),fixture+outerStart+beforeInner+outerEnd,wrap(beforeInner+' '),fixture.replace(outerEnd+'<script>','<script>')])assert.throws(()=>apply(html,options));
 const changed=runtime.replace('Compare o dinheiro disponível hoje','Compare agora');assert.throws(()=>apply(wrap(beforeInner,changed),options),/paridade/);
 assert.throws(()=>apply(fixture,{runtimeSource:changed}),/hash/);
 assert.throws(()=>apply(fixture,{metadata:{...metadata,modalId:'other'}}),/metadados/);
 assert.throws(()=>apply(fixture,{metadata:{...metadata,beforeInnerSHA256:'bad'}}),/metadados/);
});

test('guardas estruturais negam scripts, IDs e novos handlers mesmo com hash de fixture autorizado',()=>{
 for(const p of [payload+'<p>Extra</p>',payload.replace('<h2','<script'),payload.replace('<h2','<h2 id="new"'),payload.replace('<h2','<h2 onmouseover="run()"'),payload.replace('game.closeFundingPathwayHelp()','game.startGame()'),payload.replace('Entendi','Fechar'),payload.replace('<section','<section style="color:red"'),payload.replace('<p class','<iframe class')]){
  const code=simple(p),custom={...metadata,runtimePayloadSHA256:sha(p)};
  assert.throws(()=>apply(wrap(beforeInner,code),{runtimeSource:code,metadata:custom}));
 }
 const code=simple(payload);assert.equal(apply(wrap(beforeInner,code),{runtimeSource:code}),wrap(payload,code));
});
