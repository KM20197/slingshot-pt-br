const acorn=require('acorn'),walk=require('acorn-walk');
function replaceMethod(html,name,body){
 const matches=[];
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  const offset=m.index+m[0].indexOf('>')+1;
  walk.ancestor(acorn.parse(m[2],{ecmaVersion:'latest'}),{MethodDefinition(n,ancestors){
   if(n.key.name===name&&ancestors.some(a=>a.type==='ClassDeclaration'&&a.id?.name==='Game'))matches.push({start:offset+n.value.body.start,end:offset+n.value.body.end});
  }});
 }
 if(matches.length!==1)throw new Error('Método ausente ou duplicado: '+name);
 acorn.parse('function test(){'+body+'}',{ecmaVersion:'latest'});
 const {start,end}=matches[0];return html.slice(0,start)+'{\n'+body+'\n  }'+html.slice(end);
}
module.exports={replaceMethod};
