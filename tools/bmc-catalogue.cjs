const fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
module.exports=function compile(profile,pairs){
 const lines=pairs.trim().split('\n').map(line=>line.split('|'));
 if(lines.some(row=>row.length!==2||row.some(value=>!value.trim())))throw new Error('Par de tradução inválido.');
 const targets=new Map(lines);
 if(targets.size!==lines.length||new Set(targets.values()).size!==targets.size)throw new Error('Fonte duplicada ou tradução colidente.');
 let original;
 function read(node){
  if(node.type==='Literal')return node.value;
  if(node.type==='ArrayExpression')return node.elements.map(read);
  if(node.type==='ObjectExpression')return Object.fromEntries(node.properties.map(p=>[p.key.name??p.key.value,read(p.value)]));
  throw new Error('Dado não literal: '+node.type);
 }
 for(const m of fs.readFileSync('source/index.original.html','utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n){if(n.id.name==='BMC_DATA')original=read(n.init);}});
 }
 if(!Object.hasOwn(original,profile))throw new Error('Perfil inexistente.');
 const strings={},used=new Set();
 function visit(value,path){
  if(typeof value==='string'){
   const marker=value.endsWith(' [NEW]')?' [NEW]':'',plain=marker?value.slice(0,-marker.length):value;
   if(!targets.has(plain))throw new Error('Tradução ausente: '+JSON.stringify(path)+' '+value);
   used.add(plain);strings[JSON.stringify(path)]={source:value,target:targets.get(plain)+marker};
  }else for(const [key,child] of Object.entries(value))visit(child,[...path,Array.isArray(value)||/^\d+$/.test(key)?Number(key):key]);
 }
 visit(original[profile],[profile]);
 for(const source of targets.keys())if(!used.has(source))throw new Error('Tradução excedente: '+source);
 const catalogue=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8'));
 const previous=Object.fromEntries(Object.entries(catalogue.BMC_DATA?.strings||{}).filter(([path])=>JSON.parse(path)[0]!==profile));
 const combined={...previous,...strings};
 const bySource=new Map(),byTarget=new Map();
 for(const [path,item] of Object.entries(combined)){
  if(!Object.hasOwn(original,JSON.parse(path)[0]))throw new Error('Perfil desconhecido no catálogo: '+path);
  if(typeof item.source!=='string'||typeof item.target!=='string'||!item.target.trim())throw new Error('Entrada inválida no catálogo: '+path);
  if(item.source.endsWith(' [NEW]')!==item.target.endsWith(' [NEW]'))throw new Error('Marcador funcional divergente: '+path);
  const source=item.source.replace(/ \[NEW\]$/,''),target=item.target.replace(/ \[NEW\]$/,'');
  if(bySource.has(source)&&bySource.get(source)!==target)throw new Error('Tradução inconsistente entre perfis: '+source);
  if(byTarget.has(target)&&byTarget.get(target)!==source)throw new Error('Colisão entre perfis: '+target);
  bySource.set(source,target);byTarget.set(target,source);
 }
 const ordered=Object.fromEntries(Object.keys(original).flatMap(id=>Object.entries(combined).filter(([path])=>JSON.parse(path)[0]===id)));
 const profiles=[...new Set(Object.keys(ordered).map(path=>JSON.parse(path)[0]))];
 catalogue.BMC_DATA={classification:'Tradução parcial: perfis completos '+profiles.join(', ')+'. Seletores de remoção e marcador funcional [NEW] preservados. Contexto britânico original; demais perfis e adaptação brasileira pendentes.',strings:ordered};
 fs.writeFileSync('locales/structures.pt-BR.json',JSON.stringify(catalogue,null,2)+'\n');
 console.log('BMC_DATA.'+profile+': '+Object.keys(strings).length+' campos tratados.');
};
