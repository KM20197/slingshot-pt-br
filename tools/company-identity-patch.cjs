const acorn=require('acorn');
const walk=require('acorn-walk');
const ventures=require('../locales/ventures.pt-BR.json');

const literal=value=>JSON.stringify(value).replaceAll('<','\\u003c');

function apply(html){
 const edits=[];
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(match[1]))continue;
  const offset=match.index+match[0].indexOf('>')+1;
  const ast=acorn.parse(match[2],{ecmaVersion:'latest'});
  walk.simple(ast,{VariableDeclarator(node){
   if(node.id.name!=='COMPANIES'||node.init?.type!=='ArrayExpression')return;
   for(const company of node.init.elements||[]){
    if(company?.type!=='ObjectExpression')continue;
    const props=Object.fromEntries(company.properties.map(prop=>[prop.key?.name||prop.key?.value,prop]));
    const id=props.id?.value?.value,venture=ventures[id];
    if(!venture)continue;
    for(const [key,value] of Object.entries({name:venture.name,desc:venture.desc})){
     const prop=props[key];if(!prop)throw new Error(`Empresa ${id} sem ${key}.`);
     edits.push({start:offset+prop.value.start,end:offset+prop.value.end,value:literal(value)});
    }
   }
  }});
 }
 if(edits.length!==Object.keys(ventures).length*2)throw new Error('COMPANIES não contém as doze identidades brasileiras.');
 for(const edit of edits.sort((a,b)=>b.start-a.start))html=html.slice(0,edit.start)+edit.value+html.slice(edit.end);
 return html;
}

module.exports={apply};
