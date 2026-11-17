'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),acorn=require('acorn'),walk=require('acorn-walk'),parse5=require('parse5');
const {replaceMethod}=require('./method-patch.cjs');
const signature='33f2efcd315e6b86519e34bfbae55c227bd9b716aa5db38810ed5bf233312e1e';
const methodPins={"renderExecRow":"445eb548e4d63fdaadb8d746f03e1c4fd65023fd47be84cc6d6bcca272f5d187","renderDecision":"d063cc43570dd2a6539b94f52525114f22aacbc5cc5936a294ea383a149b1f14","generateEventTitle":"c4a57ecb259ab82c2dd0fd928fd487e82f91ea3ea5e300996465245dcf7a497d","generateChoiceDescription":"108ff8fd3828f16ef9caf95319fcb83e97c63f444a4b684a06459eba6269b099","getStatLabel":"16b06c0bcdffd3a69961fc9231b9e45e28cd718b9b31a82e3186ec3d3ad6173a","generateImpactTags":"f524a24b355de6368e32c92e97fcab019adb5ad4e3a40425804ea1f0acc0fc1f"};
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v);
const nodes=ast=>{const out=[];walk.simple(ast,{Literal(n){if(typeof n.value==='string')out.push(n);},TemplateElement(n){out.push(n);}});return out;};
function shape(text){function visit(n){return {name:n.nodeName,attrs:n.attrs,data:n.nodeName==='#comment'?n.data:undefined,children:(n.childNodes||[]).filter(c=>c.nodeName!=='#text').map(visit)};}return JSON.stringify(visit(parse5.parseFragment(text)));}
function apply(html,catalogue=JSON.parse(fs.readFileSync(require.resolve('../locales/decision-presentation.pt-BR.json'),'utf8'))){
 if(catalogue?.version!==1||!Array.isArray(catalogue.items))throw Error('Catálogo de decisões inválido');
 const bindings=catalogue.items.map(x=>[x.method,x.kind,x.source,x.count]);
 if(hash(JSON.stringify(bindings))!==signature)throw Error('Caminhos de decisões divergentes');
 for(const x of catalogue.items){
  if(typeof x.target!=='string'||!x.target.trim()||x.source===x.target||x.target.includes('<')||x.target.includes('>')||x.target.includes(String.fromCharCode(96))||x.target.includes('$'+'{')||x.target.replace(/[^0-9]/g,'')!==x.source.replace(/[^0-9]/g,''))throw Error('Alvo de decisão inválido');
  if((x.source.startsWith(' '))!==x.target.startsWith(' ')||(x.source.endsWith(' '))!==x.target.endsWith(' '))throw Error('Separação de texto alterada');
 }
 let occurrences=0,changedNodes=0;
 for(const name of Object.keys(methodPins)){
  const items=catalogue.items.filter(x=>x.method===name);
  html=replaceMethod(html,name,body=>{
   if(hash(body)!==methodPins[name])throw Error('Método de decisão divergente: '+name);
   const prefix='function probe(){',before=acorn.parse(prefix+body+'}',{ecmaVersion:'latest'}),old=nodes(before),updates=new Map(),approved=new Set();
   for(const x of items){
    let count=0;
    for(let i=0;i<old.length;i++){
     const n=old[i],type=x.kind==='TemplateFragment'?'TemplateElement':'Literal';if(n.type!==type)continue;
     const original=n.type==='Literal'?n.value:n.value.raw;
     const hits=x.kind==='Literal'?(original===x.source?1:0):original.split(x.source).length-1;if(!hits)continue;
     if(updates.has(i)&&x.kind==='Literal')throw Error('Literal duplicado');
     const current=updates.get(i)??original;
     updates.set(i,x.kind==='Literal'?x.target:current.split(x.source).join(x.target));approved.add(i);count+=hits;
    }
    if(count!==x.count)throw Error('Ocorrência divergente: '+name+'/'+x.source);
    occurrences+=count;
   }
   let output=body;
   for(const[i,value]of [...updates].sort((a,b)=>old[b[0]].start-old[a[0]].start)){
    const n=old[i];if(shape(n.type==='Literal'?n.value:n.value.raw)!==shape(value))throw Error('DOM ou atributos alterados');
    const text=n.type==='Literal'?JSON.stringify(value):value;
    output=output.slice(0,n.start-prefix.length)+text+output.slice(n.end-prefix.length);
   }
   const after=acorn.parse(prefix+output+'}',{ecmaVersion:'latest'}),next=nodes(after);
   if(old.length!==next.length)throw Error('Nós da decisão alterados');
   for(const i of approved){if(next[i].type!==old[i].type)throw Error('Tipo de decisão alterado');next[i].value=structuredClone(old[i].value);}
   if(clean(before)!==clean(after))throw Error('Lógica ou interpolação alterada');
   changedNodes+=approved.size;return output;
  });
 }
 return {html,report:{pairs:catalogue.items.length,occurrences,changedNodes,methods:Object.keys(methodPins),classificationKeywordsPreserved:true,ASTAndDOMPreserved:true}};
}
module.exports={apply};
