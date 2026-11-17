'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),parse5=require('parse5');
const patch=require('../tools/entry-help-context-patch.cjs'),catalogue=require('../locales/entry-help-context.pt-BR.json'),topics=require('../locales/tutorial.pt-BR.json');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
function fixture(){
 const data=structuredClone(catalogue),video='<div class="max-w-xl"><div><iframe src="https://example.test/original" title="Original"></iframe></div></div>',transcript='<details><summary>Historical narration</summary><p>British AI startup</p></details>';
 data.history.videoSha256=hash(video);data.history.transcriptSha256=hash(transcript);
 data.entry={source:'Original entry',target:'Serviços, comércio e indústria brasileiros.'};data.ada=[{source:'Original Ada',target:'Integração brasileira em desenvolvimento.'}];data.meta={source:'Original description',target:'Simulação de empreendimentos brasileiros.'};
 const panels=data.panels.map(p=>{const body='<p>Legacy '+p.scopeId+'</p>';p.expectedInnerSha256=hash(body);return '<div id="'+p.scopeId+'" class="help-content">'+body+'</div>';}).join('');
 const outside='<aside id="outside"><p>Original entry</p><a href="https://example.test/credit">License</a></aside>',script='<script id="ada-loader">const message="British AI startup";</script>';
 const credits='<div id="contributorsModal"><div class="max-h-[90vh] overflow-y-auto"><p>Authors/license unchanged</p><button onclick="closeCredits()">Close</button></div></div>';
 const html='<meta name="author" content="Authors"><meta name="citation_title" content="Original title"><meta name="description" content="Original description">'+outside+'<div id="preambleModal1"><p>Original entry</p>'+video+transcript+'<button onclick="startGame()">Start</button></div><div id="preambleModal2"><p>Original Ada</p><button onclick="openLoadStartup()">Import</button></div>'+credits+panels+script;
 return {html,data,video,transcript,outside,script,credits};
}
function all(html){const ns=[];function collect(n){ns.push(n);for(const c of n.childNodes||[])collect(c);}collect(parse5.parse(html));return ns;}
const id=n=>n.attrs?.find(a=>a.name==='id')?.value,text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join('');
test('scoped update leaves scripts, existing credits/actions/resources and duplicate text outside targets intact',()=>{
 const f=fixture(),out=patch.apply(f.html,f.data);assert.ok(out.includes(f.outside));assert.ok(out.includes(f.script));assert.ok(out.includes('<meta name="author" content="Authors">'));assert.ok(out.includes('<meta name="citation_title" content="Original title">'));
 for(const action of ['startGame()','openLoadStartup()','closeCredits()'])assert.equal(out.split('onclick="'+action+'"').length-1,1);
 const ns=all(out),before=all(f.html);assert.deepEqual(ns.map(id).filter(Boolean),before.map(id).filter(Boolean));
 assert.ok(out.includes('Authors/license unchanged'));assert.ok(out.includes(f.video));assert.ok(out.includes(f.transcript));
 const p=ns.find(n=>id(n)==='preambleModal1'),c=ns.find(n=>id(n)==='contributorsModal');assert.ok(!text(p).includes('British AI startup'));assert.ok(text(p).includes(f.data.entryGuide.text));assert.ok(text(c).includes('British AI startup'));assert.ok(text(c).includes(f.data.history.notice));
});
test('six generated help panels reproduce the current Brazilian topic paragraphs and exclude old investors/UK teaching',()=>{
 const generated=fs.readFileSync('index.html','utf8'),ns=all(generated);
 for(const panel of catalogue.panels){const root=ns.find(n=>id(n)===panel.scopeId);assert.ok(root,panel.scopeId);const body=text(root);assert.ok(!/startup|Innovate UK|\bequity\b|£/i.test(body));
  for(const name of panel.topics){const t=topics[name];assert.ok(body.includes(t.title));for(const h of [t.summary,t.more])assert.ok(body.includes(text(parse5.parseFragment(h))));}
 }
 const entry=text(ns.find(n=>id(n)==='preambleModal1')),ada=text(ns.find(n=>id(n)==='preambleModal2'));assert.ok(!/startup|Reino Unido|brit[aâ]nic|£/i.test(entry));assert.ok(!/new AI startup|Carregar sua startup/i.test(ada));assert.ok(ada.includes('ainda dependem de validação própria'));
});
test('refuses stale source/hash, duplicate protected roots, panel consumers, out-of-scope panels and reapplication',()=>{
 const f=fixture();assert.throws(()=>patch.apply(f.html.replace('Original entry</p>'+f.video,'Changed entry</p>'+f.video),f.data),/Âncora/);
 assert.throws(()=>patch.apply(f.html.replace('Legacy helpContent-money','Changed money'),f.data),/Hash divergente/);
 assert.throws(()=>patch.apply(f.html+'<div id="preambleModal2"></div>',f.data),/duplicada/);
 assert.throws(()=>patch.apply(f.html.replace('Legacy helpContent-money','<button onclick="danger()">Legacy helpContent-money</button>'),f.data),/consumidor protegido/);
 const bad=structuredClone(f.data);bad.panels[0].scopeId='outside';assert.throws(()=>patch.apply(f.html,bad),/fora do escopo/);
 assert.throws(()=>patch.apply(patch.apply(f.html,f.data),f.data),/Hash divergente/);
});
