'use strict';
const crypto=require('node:crypto'),parse5=require('parse5');
const catalogue=require('../locales/entry-help-context.pt-BR.json'),topics=require('../locales/tutorial.pt-BR.json');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const allowedPanels=new Set(['helpContent-overview','helpContent-ap','helpContent-money','helpContent-milestones','helpContent-team','helpContent-faq']);
function descendants(node,result=[]){for(const child of node.childNodes||[]){result.push(child);descendants(child,result);}return result;}
function renderPanel(ids){
 if(!Array.isArray(ids)||!ids.length)throw Error('Painel sem tópicos brasileiros.');
 return ids.map(id=>{
  const t=topics[id];if(!t||typeof t.title!=='string')throw Error('Tópico brasileiro ausente: '+id);
  for(const content of [t.summary,t.more]){
   if(typeof content!=='string')throw Error('Conteúdo de tópico inválido: '+id);
   const ns=descendants(parse5.parseFragment(content));
   if(ns.some(n=>n.tagName&&(!['p','strong','em','ul','ol','li','br','span'].includes(n.tagName)||(n.attrs||[]).some(a=>a.name!=='class'))))throw Error('Tópico contém ação ou marcação não permitida: '+id);
  }
  return '<section class="mb-6"><h3 class="font-bold text-lg text-slate-800 mb-3">'+escape(t.title)+'</h3>'+t.summary+'<div class="mt-3">'+t.more+'</div></section>';
 }).join('');
}
// Only DOM offsets are changed. Script bodies, loaders, URLs and all game data are untouched.
function apply(html,data=catalogue){
 const ns=descendants(parse5.parse(html,{sourceCodeLocationInfo:true})),edits=[];
 const id=n=>n.attrs?.find(a=>a.name==='id')?.value;
 const one=(items,label)=>{if(items.length!==1)throw Error('Âncora ausente ou duplicada: '+label);return items[0];};
 const root=key=>one(ns.filter(n=>id(n)===key),key);
 const within=(n,p)=>{for(let a=n;a;a=a.parentNode)if(a===p)return true;return false;};
 const raw=n=>html.slice(n.sourceCodeLocation.startOffset,n.sourceCodeLocation.endOffset);
 const digest=(value,expected,label)=>{if(!/^[a-f0-9]{64}$/.test(expected)||hash(value)!==expected)throw Error('Hash divergente: '+label);};
 const edit=(start,end,text)=>edits.push({start,end,text});
 if(data.version!==1||!Array.isArray(data.panels)||!data.panels.length)throw Error('Catálogo inválido.');
 const seen=new Set();
 for(const panel of data.panels){
  if(!allowedPanels.has(panel.scopeId)||seen.has(panel.scopeId))throw Error('Painel fora do escopo ou duplicado: '+panel.scopeId);
  seen.add(panel.scopeId);const n=root(panel.scopeId),loc=n.sourceCodeLocation;
  if(descendants(n).some(n=>(n.attrs||[]).some(a=>a.name==='id'||a.name==='href'||a.name.startsWith('on'))))throw Error('Painel contém consumidor protegido: '+panel.scopeId);
  digest(html.slice(loc.startTag.endOffset,loc.endTag.startOffset),panel.expectedInnerSha256,panel.scopeId);
  edit(loc.startTag.endOffset,loc.endTag.startOffset,renderPanel(panel.topics));
 }
 const entry=root('preambleModal1'),ada=root('preambleModal2'),credits=root('contributorsModal');
 function replaceText(scope,pair){
  if(!pair||typeof pair.source!=='string'||!pair.source||typeof pair.target!=='string'||!pair.target)throw Error('Par de texto inválido.');
  const n=one(ns.filter(n=>n.nodeName==='#text'&&within(n,scope)&&n.value.trim()===pair.source),pair.source.slice(0,80)),loc=n.sourceCodeLocation;
  const leading=n.value.match(/^\s*/)[0],trailing=n.value.match(/\s*$/)[0];
  edit(loc.startOffset,loc.endOffset,leading+escape(pair.target)+trailing);
 }
 replaceText(entry,data.entry);for(const pair of data.ada)replaceText(ada,pair);
 const m=one(ns.filter(n=>n.tagName==='meta'&&n.attrs?.some(a=>a.name==='name'&&a.value==='description')),'meta description');
 if(m.attrs.find(a=>a.name==='content')?.value!==data.meta.source)throw Error('Descrição de entrada divergente.');
 const attr=m.sourceCodeLocation.attrs.content;edit(attr.startOffset,attr.endOffset,'content="'+escape(data.meta.target)+'"');
 const iframe=one(ns.filter(n=>n.tagName==='iframe'&&within(n,entry)),'vídeo histórico'),video=iframe.parentNode.parentNode;
 const transcript=one(ns.filter(n=>n.tagName==='details'&&within(n,entry)),'transcrição histórica');
 if(!within(video,entry)||data.history.sourceModalId!=='preambleModal1'||data.history.destinationModalId!=='contributorsModal')throw Error('Histórico fora do escopo.');
 digest(raw(video),data.history.videoSha256,'vídeo');digest(raw(transcript),data.history.transcriptSha256,'transcrição');
 const scroll=one((credits.childNodes||[]).filter(n=>n.tagName==='div'),'container de créditos');
 const cls=scroll.attrs?.find(a=>a.name==='class')?.value||'';
 if(!cls.includes('overflow-y-auto')||!cls.includes('max-h-'))throw Error('Créditos sem área rolável protegida.');
 const historical='<section data-slingshot-reference="original" class="bg-slate-900 rounded-xl p-4 mt-6"><h3 class="font-bold text-white mb-3">'+escape(data.history.heading)+'</h3><p class="text-sm text-slate-200 mb-4">'+escape(data.history.notice)+'</p>'+raw(video)+raw(transcript)+'</section>';
 edit(scroll.sourceCodeLocation.endTag.startOffset,scroll.sourceCodeLocation.endTag.startOffset,historical);
 const guide='<section class="max-w-xl mx-auto mb-6 rounded-2xl bg-white/10 p-5 text-left"><h3 class="font-bold text-white mb-3">'+escape(data.entryGuide.heading)+'</h3><p class="text-slate-200 leading-relaxed">'+escape(data.entryGuide.text)+'</p></section>';
 edit(video.sourceCodeLocation.startOffset,video.sourceCodeLocation.endOffset,guide);
 // Remove the transcript's own indentation/newline too; do not leave a new whitespace-only line.
 const tloc=transcript.sourceCodeLocation,lineStart=html.lastIndexOf('\n',tloc.startOffset-1)+1,lineEnd=html.indexOf('\n',tloc.endOffset);
 const removeStart=/^[ \t]*$/.test(html.slice(lineStart,tloc.startOffset))?lineStart:tloc.startOffset;
 const removeEnd=lineEnd>=0&&/^[ \t\r]*$/.test(html.slice(tloc.endOffset,lineEnd))?lineEnd+1:tloc.endOffset;
 edit(removeStart,removeEnd,'');
 const sorted=edits.sort((a,b)=>a.start-b.start);for(let i=1;i<sorted.length;i++)if(sorted[i].start<sorted[i-1].end)throw Error('Patches de entrada/ajuda sobrepostos.');
 for(const e of sorted.reverse())html=html.slice(0,e.start)+e.text+html.slice(e.end);
 return html;
}
module.exports={apply,renderPanel};
