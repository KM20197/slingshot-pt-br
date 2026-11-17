const fs=require('node:fs'),path=require('node:path'),parse5=require('parse5');
const locale=JSON.parse(fs.readFileSync(path.join(__dirname,'..','locales','about-context.pt-BR.json'),'utf8'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');

// Escopo restrito a nós de texto de um único modal; offsets de parse5, sem serializar o documento.
function apply(html,custom){
 const data=custom||locale,modalId=data.modalId||'aboutModal',list=data.translations||[];
 if(!list.length)throw new Error('Catálogo about-context sem traduções.');
 const tree=parse5.parse(html,{sourceCodeLocationInfo:true});
 const modals=[];
 (function walk(node){
  if((node.attrs||[]).some(attr=>attr.name==='id'&&attr.value===modalId))modals.push(node);
  for(const child of node.childNodes||[])walk(child);
 })(tree);
 if(modals.length!==1)throw new Error('Modal '+modalId+' ausente ou duplicado ('+modals.length+').');
 const texts=[];
 (function walk(node,skip){
  skip=skip||node.tagName==='script'||node.tagName==='style';
  if(node.nodeName==='#text'&&!skip&&node.sourceCodeLocation)texts.push(node);
  for(const child of node.childNodes||[])walk(child,skip);
 })(modals[0],false);
 const span=node=>{
  const loc=node.sourceCodeLocation,lead=node.value.length-node.value.trimStart().length,tail=node.value.length-node.value.trimEnd().length;
  return {start:loc.startOffset+lead,end:loc.endOffset-tail};
 };
 const edits=[],claimed=new Set();
 for(const item of list){
  if(typeof item.source!=='string'||!item.source||typeof item.target!=='string')throw new Error('Entrada about-context inválida.');
  const hits=texts.filter(node=>{
   if(node.value.trim()!==item.source)return false;
   const {start,end}=span(node);
   return html.slice(start,end)===item.source;
  });
  if(hits.length!==1)throw new Error('Ocorrência de "'+item.source.slice(0,60)+'" em '+modalId+': '+hits.length+'.');
  if(claimed.has(hits[0]))throw new Error('Dois segmentos about-context disputam o mesmo nó de texto.');
  claimed.add(hits[0]);
  const {start,end}=span(hits[0]);
  edits.push({start,end,text:escape(item.target)});
 }
 edits.sort((a,b)=>a.start-b.start);
 for(let i=1;i<edits.length;i++)if(edits[i].start<edits[i-1].end)throw new Error('Sobreposição entre segmentos about-context.');
 for(const edit of edits.reverse())html=html.slice(0,edit.start)+edit.text+html.slice(edit.end);
 return html;
}
module.exports={apply,modalId:locale.modalId,translations:locale.translations};
