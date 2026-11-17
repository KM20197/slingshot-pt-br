const parse5=require('parse5');
const catalogue=require('../locales/setup-ui.pt-BR.json');
function apply(html){
 const changes=[],seen=new Map();
 const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 function visit(node,scope){
  if(['script','style'].includes(node.tagName))return;
  const id=node.attrs?.find(a=>a.name==='id')?.value;
  if(Object.hasOwn(catalogue,id))scope=id;
  if(scope&&node.nodeName==='#text'){
   const key=node.value.trim(),target=catalogue[scope][key];
   if(target){const marker=scope+':'+key;seen.set(marker,(seen.get(marker)||0)+1);const p=node.sourceCodeLocation;changes.push({start:p.startOffset,end:p.endOffset,text:escape(node.value.replace(key,target))});}
  }
  for(const c of node.childNodes||[])visit(c,scope);
 }
 visit(parse5.parse(html,{sourceCodeLocationInfo:true}));
 for(const [scope,entries]of Object.entries(catalogue))for(const source of Object.keys(entries))if(seen.get(scope+':'+source)!==1)throw new Error('Texto L2b ausente/ambíguo: '+scope+':'+source);
 for(const e of changes.sort((a,b)=>b.start-a.start))html=html.slice(0,e.start)+e.text+html.slice(e.end);
 return html;
}
module.exports={apply};
