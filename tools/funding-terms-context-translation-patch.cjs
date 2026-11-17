const fs=require('node:fs'),path=require('node:path'),parse5=require('parse5');
const locale=JSON.parse(fs.readFileSync(path.join(__dirname,'..','locales','funding-terms-context.pt-BR.json'),'utf8'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
// Valida o conjunto inteiro antes de editar; usa offsets do DOM atual, sem serialização.
function apply(html,custom){
 const data=custom||locale;
 if(data.modalId!=='fundingTermsHelpModal'||!Array.isArray(data.nodes)||!data.nodes.length)throw Error('Catálogo funding-terms inválido.');
 const modals=[];
 (function walk(n){if(n.attrs?.some(a=>a.name==='id'&&a.value===data.modalId))modals.push(n);for(const c of n.childNodes||[])walk(c);})(parse5.parse(html,{sourceCodeLocationInfo:true}));
 if(modals.length!==1)throw Error('Modal funding-terms ausente ou duplicado.');
 const texts=[];
 (function walk(n,skip=false){skip=skip||n.tagName==='script'||n.tagName==='style';if(n.nodeName==='#text'&&!skip&&n.sourceCodeLocation&&n.value.trim())texts.push(n);for(const c of n.childNodes||[])walk(c,skip);})(modals[0]);
 if(texts.length!==data.nodes.length)throw Error('Contagem de nós funding-terms divergente.');
 const edits=[];
 for(let i=0;i<data.nodes.length;i++){
  const row=data.nodes[i];
  if(!row||row.nodeIndex!==i||typeof row.source!=='string'||!row.source||row.source.trim()!==row.source||(row.target!==null&&(typeof row.target!=='string'||!row.target.trim()))||!Number.isInteger(row.occurrence)||row.occurrence<0||!Number.isInteger(row.expectedOccurrences)||row.expectedOccurrences<1)throw Error('Entrada funding-terms inválida no índice '+i+'.');
  const node=texts[i],hits=texts.filter(n=>n.value.trim()===row.source);
  if(node.value.trim()!==row.source||hits.length!==row.expectedOccurrences||hits[row.occurrence]!==node)throw Error('Fonte, ordem ou ocorrências funding-terms divergentes no índice '+i+'.');
  if(row.target===null)continue;
  const loc=node.sourceCodeLocation,raw=html.slice(loc.startOffset,loc.endOffset);
  edits.push({start:loc.startOffset,end:loc.endOffset,text:raw.match(/^\s*/)[0]+escape(row.target)+raw.match(/\s*$/)[0]});
 }
 for(const edit of edits.sort((a,b)=>b.start-a.start))html=html.slice(0,edit.start)+edit.text+html.slice(edit.end);
 return html;
}
module.exports={apply,modalId:locale.modalId,translations:locale.nodes.filter(n=>n.target!==null)};
