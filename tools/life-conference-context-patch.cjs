'use strict';
const fs=require('node:fs');
const acorn=require('acorn'),walk=require('acorn-walk');
const {translate}=require('./structured-translation.cjs');
const names=['LIFE_EVENTS','CONFERENCES','TICKER_LINES','DELEGATE_TYPES'];
function editable(name,path){
 if(name==='LIFE_EVENTS')return path.length===2&&Number.isInteger(path[0])&&['title','text'].includes(path[1]);
 if(name==='CONFERENCES')return path.length===3&&typeof path[0]==='string'&&Number.isInteger(path[1])&&['name','location'].includes(path[2]);
 if(name==='TICKER_LINES')return (path.length===1&&path[0]==='closing')||(path.length===2&&typeof path[0]==='string'&&Number.isInteger(path[1]));
 return name==='DELEGATE_TYPES'&&path.length===2&&Number.isInteger(path[0])&&path[1]==='name';
}
function apply(html,catalogue=JSON.parse(fs.readFileSync(require.resolve('../locales/life-conference-context.pt-BR.json'),'utf8'))){
 if(!catalogue||Object.keys(catalogue).sort().join('|')!==names.slice().sort().join('|'))throw Error('Estruturas editoriais divergentes.');
 const expected=Object.fromEntries(names.map(n=>[n,new Set()]));
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=|application\/ld\+json/.test(match[1]))continue;
  walk.ancestor(acorn.parse(match[2],{ecmaVersion:'latest'}),{VariableDeclarator(node,ancestors){
   const name=node.id.name;
   if(!names.includes(name)||ancestors.some(a=>/Function/.test(a.type)))return;
   function visit(value,path){
    if(!value)return;
    if(value.type==='Literal'&&typeof value.value==='string'&&editable(name,path))expected[name].add(JSON.stringify(path));
    else if(value.type==='ArrayExpression')value.elements.forEach((v,i)=>visit(v,[...path,i]));
    else if(value.type==='ObjectExpression')for(const p of value.properties)if(p.type==='Property'&&!p.computed)visit(p.value,[...path,p.key.type==='Identifier'?p.key.name:p.key.value]);
   }
   visit(node.init,[]);
  }});
 }
 for(const name of names){
  const entry=catalogue[name];
  if(!entry||typeof entry.classification!=='string'||!entry.strings||!expected[name].size)throw Error('Catálogo incompleto: '+name);
  const keys=Object.keys(entry.strings);
  if(keys.length!==expected[name].size||keys.some(k=>!expected[name].has(k)))throw Error('Caminhos editoriais incompletos ou proibidos: '+name);
  for(const key of keys){
   const item=entry.strings[key];
   if(!item||typeof item.source!=='string'||typeof item.target!=='string'||!item.target.trim()||item.source===item.target)throw Error('Texto editorial inválido: '+name+' '+key);
  }
 }
 return translate(html,catalogue);
}
module.exports={apply};
