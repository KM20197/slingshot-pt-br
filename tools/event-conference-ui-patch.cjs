'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),acorn=require('acorn'),walk=require('acorn-walk'),parse5=require('parse5');
const {replaceMethod}=require('./method-patch.cjs');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const signature='6863c50ca941437faf6f611d86b450c1b2bcc4fc47d6713a69a891cc83ba3d84';
const normalize=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v);
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function strings(ast){const out=[];walk.simple(ast,{Literal(n){if(typeof n.value==='string')out.push(n);},TemplateElement(n){out.push(n);}});return out;}
function shape(s){
 const root=parse5.parseFragment(s);function visit(n){return {name:n.nodeName,attrs:n.attrs,children:(n.childNodes||[]).filter(c=>c.nodeName!=='#text').map(visit)};}
 return JSON.stringify(visit(root));
}
function apply(html,life=JSON.parse(fs.readFileSync(require.resolve('../locales/life-event-ui.pt-BR.json'),'utf8')),conf=JSON.parse(fs.readFileSync(require.resolve('../locales/conference-ui.pt-BR.json'),'utf8'))){
 if(life.version!==1||conf.version!==1||![life.methods,life.dom,conf.methods,conf.dom].every(Array.isArray))throw Error('Catálogo de apresentação inválido.');
 const methodItems=[...life.methods,...conf.methods],domItems=[...life.dom,...conf.dom],all=[...methodItems,...domItems];
 const bindings=all.map(x=>[x.method||x.scope,x.kind,x.source,x.count||1]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b),'en'));
 if(hash(JSON.stringify(bindings))!==signature)throw Error('Caminhos de apresentação incompletos ou não aprovados.');
 for(const x of all)if(typeof x.target!=='string'||!x.target.trim()||x.target===x.source||x.target.includes('</script')||x.target.includes('${')||x.target.includes('`'))throw Error('Alvo de apresentação inválido.');
 for(const x of all)if(x.source.replace(/[^0-9]/g,'')!==x.target.replace(/[^0-9]/g,''))throw Error('Número de apresentação alterado.');
 let changedNodes=0;
 for(const name of new Set(methodItems.map(x=>x.method))){
  const items=methodItems.filter(x=>x.method===name);
  html=replaceMethod(html,name,body=>{
   if(hash(body)!==conf.methodPins[name])throw Error('Método de apresentação divergente: '+name);
   const prefix='function probe(){',code=prefix+body+'}',before=acorn.parse(code,{ecmaVersion:'latest'}),nodes=strings(before),edits=[],approved=new Set();
   for(const x of items){
    const matches=nodes.map((n,i)=>({n,i})).filter(({n})=>n.type===x.kind&&(n.type==='Literal'?n.value:n.value.raw)===x.source);
    if(matches.length!==(x.count||1))throw Error('Fonte ausente ou ambígua: '+name+' '+x.source);
    for(const {n,i}of matches){if(approved.has(i))throw Error('Campo repetido.');approved.add(i);edits.push({start:n.start-prefix.length,end:n.end-prefix.length,text:n.type==='Literal'?JSON.stringify(x.target).replaceAll('<','\\u003c'):x.target});}
   }
   let output=body;for(const e of edits.sort((a,b)=>b.start-a.start))output=output.slice(0,e.start)+e.text+output.slice(e.end);
   const after=acorn.parse(prefix+output+'}',{ecmaVersion:'latest'}),newNodes=strings(after);
   if(nodes.length!==newNodes.length)throw Error('Número de literais alterado.');
   for(const i of approved){const old=nodes[i],next=newNodes[i];if(next.type!==old.type)throw Error('Tipo de literal alterado.');next.value=structuredClone(old.value);}
   if(normalize(before)!==normalize(after))throw Error('Regra, seletor ou interpolação alterados: '+name);
   // Compare complete template skeletons; numeric text and markup are protected too.
   const beforeTemplates=[],afterTemplates=[];walk.simple(before,{TemplateLiteral(n){beforeTemplates.push(n);}});walk.simple(acorn.parse(prefix+output+'}',{ecmaVersion:'latest'}),{TemplateLiteral(n){afterTemplates.push(n);}});
   for(let i=0;i<beforeTemplates.length;i++){
    const render=t=>t.quasis.map((q,j)=>q.value.cooked+(j<t.expressions.length?'__EXPR_'+j+'__':'')).join('');
    const old=render(beforeTemplates[i]),next=render(afterTemplates[i]);
    if(shape(old)!==shape(next))throw Error('Marcação do template alterada: '+name);
    if(old.replace(/[^0-9]/g,'')!==next.replace(/[^0-9]/g,''))throw Error('Número textual alterado: '+name);
   }
   changedNodes+=edits.length;return output;
  });
 }
 const tree=parse5.parse(html,{sourceCodeLocationInfo:true}),nodes=[];function visit(n){nodes.push(n);for(const c of n.childNodes||[])visit(c);}visit(tree);
 const edits=[];for(const x of domItems){
  if(x.kind!=='text')throw Error('Atributo DOM não aprovado.');
  const roots=nodes.filter(n=>n.attrs?.some(a=>a.name==='id'&&a.value===x.scope));if(roots.length!==1)throw Error('Modal ausente ou duplicado.');
  const within=n=>{for(let p=n;p;p=p.parentNode)if(p===roots[0])return true;return false;};
  const found=nodes.filter(n=>n.nodeName==='#text'&&within(n)&&n.value.trim()===x.source);
  if(found.length!==(x.count||1))throw Error('Texto DOM ausente ou ambíguo: '+x.source);
  if(x.source.replace(/[^0-9]/g,'')!==x.target.replace(/[^0-9]/g,''))throw Error('Número DOM alterado.');
  for(const n of found){const loc=n.sourceCodeLocation,leading=n.value.match(/^\s*/)[0],trailing=n.value.match(/\s*$/)[0];edits.push({start:loc.startOffset,end:loc.endOffset,text:leading+escape(x.target)+trailing});}
 }
 for(const e of edits.sort((a,b)=>b.start-a.start))html=html.slice(0,e.start)+e.text+html.slice(e.end);
 return {html,report:{methodFields:methodItems.length,methodNodes:changedNodes,domFields:domItems.length,domNodes:edits.length,methods:[...new Set(methodItems.map(x=>x.method))],astParity:true,templateMarkupAndNumbersPreserved:true}};
}
module.exports={apply};
