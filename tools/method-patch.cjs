'use strict';
const acorn=require('acorn'),walk=require('acorn-walk');
let cached;
function table(html){
 if(cached?.html===html)return cached;
 const entries=[];
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  const offset=m.index+m[0].indexOf('>')+1;
  walk.ancestor(acorn.parse(m[2],{ecmaVersion:'latest'}),{MethodDefinition(n,a){
   if(a.some(p=>p.type==='ClassDeclaration'&&p.id?.name==='Game'))entries.push({name:n.key.name,start:offset+n.value.body.start,end:offset+n.value.body.end});
  }});
 }
 return cached={html,entries};
}
function replaceMethod(html,name,body){
 const state=table(html),matches=state.entries.filter(e=>e.name===name);
 if(matches.length!==1)throw Error('Método ausente ou duplicado: '+name);
 const target=matches[0],{start,end}=target;
 const replacement=typeof body==='function'?body(html.slice(start+1,end-1)):body;
 const ast=acorn.parse('function test(){'+replacement+'}',{ecmaVersion:'latest'});
 const block=typeof body==='function'?'{'+replacement+'}':'{\n'+replacement+'\n  }';
 const out=html.slice(0,start)+block+html.slice(end),delta=block.length-(end-start);
 let hasClass=false;walk.simple(ast,{ClassDeclaration(){hasClass=true;},ClassExpression(){hasClass=true;}});
 // Nested classes or a literal script delimiter change the set/boundaries of scanned methods.
 // Fall back to the original complete scan on the next call rather than retaining stale entries.
 if(hasClass||/<\/script/i.test(block)||state.entries.some(e=>e!==target&&((e.start>start&&e.end<end)||(e.start<start&&e.end>end))))cached=undefined;
 else cached={html:out,entries:state.entries.map(e=>e===target?{...e,end:e.end+delta}:e.start>=end?{...e,start:e.start+delta,end:e.end+delta}:{...e})};
 return out;
}
module.exports={replaceMethod};
