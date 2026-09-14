const acorn=require('acorn');
const walk=require('acorn-walk');
const crypto=require('node:crypto');

// Changes are restricted to explicitly named string-value paths. No string-wide replace.
function translate(html,catalogue){
 const replacements=[],reports=[],found=new Set();
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(match[1])||/application\/ld\+json/.test(match[1]))continue;
  const code=match[2],offset=match.index+match[0].indexOf('>')+1;
  const ast=acorn.parse(code,{ecmaVersion:'latest'});
  walk.ancestor(ast,{VariableDeclarator(node,ancestors){
   if(ancestors.some(a=>/Function/.test(a.type))||node.id.type!=='Identifier')return;
   const name=node.id.name,entry=catalogue[name];
   if(!entry)return;
   if(found.has(name))throw new Error('Estrutura duplicada: '+name);
   found.add(name);
   const edits=[],used=new Set();
   function visit(value,path){
    if(!value)return;
    if(value.type==='Literal'&&typeof value.value==='string'){
     const key=JSON.stringify(path),item=entry.strings?.[key];
     if(item){
      if(item.source!==value.value||typeof item.target!=='string'||!item.target)throw new Error('Fonte divergente: '+name+' '+key);
      used.add(key);
      edits.push({start:offset+value.start,end:offset+value.end,text:JSON.stringify(item.target).replaceAll('<','\\u003c'),path,source:item.source,target:item.target});
     }
    }else if(value.type==='ArrayExpression')value.elements.forEach((child,i)=>visit(child,[...path,i]));
    else if(value.type==='ObjectExpression')for(const p of value.properties){
     if(p.type==='Property'&&!p.computed)visit(p.value,[...path,p.key.type==='Identifier'?p.key.name:p.key.value]);
    }
   }
   visit(node.init,[]);
   for(const key of Object.keys(entry.strings||{}))if(!used.has(key))throw new Error('Campo não encontrado: '+name+' '+key);
   const original=code.slice(node.init.start,node.init.end);
   let changed=original;
   for(const e of edits.sort((a,b)=>b.start-a.start))changed=changed.slice(0,e.start-offset-node.init.start)+e.text+changed.slice(e.end-offset-node.init.start);
   const before=acorn.parse('('+original+')',{ecmaVersion:'latest'});
   const after=acorn.parse('('+changed+')',{ecmaVersion:'latest'});
   // Restore only the approved literal values in the parsed result. Any other AST change fails.
   const literalChanges=new Map(edits.map(e=>[JSON.stringify(e.path),e.source]));
   function restore(value,path){
    const key=JSON.stringify(path);
    if(value.type==='Literal'&&literalChanges.has(key))value.value=literalChanges.get(key);
    else if(value.type==='ArrayExpression')value.elements.forEach((child,i)=>{if(child)restore(child,[...path,i]);});
    else if(value.type==='ObjectExpression')for(const p of value.properties)if(p.type==='Property'&&!p.computed)restore(p.value,[...path,p.key.type==='Identifier'?p.key.name:p.key.value]);
   }
   restore(after.body[0].expression,[]);
   const normalize=value=>JSON.stringify(value,(key,v)=>['start','end','raw'].includes(key)?undefined:v);
   if(normalize(before)!==normalize(after))throw new Error('Paridade estrutural violada: '+name);
   replacements.push(...edits);
   reports.push({name,translations:edits.length,astParity:true,classification:entry.classification,sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),changes:edits.map(({path,source,target})=>({path,source,target}))});
  }});
 }
 for(const name of Object.keys(catalogue))if(!found.has(name))throw new Error('Estrutura não encontrada: '+name);
 for(const e of replacements.sort((a,b)=>b.start-a.start))html=html.slice(0,e.start)+e.text+html.slice(e.end);
 return {html,reports};
}
module.exports={translate};
