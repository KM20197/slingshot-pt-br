const fs=require('node:fs'),crypto=require('node:crypto'),acorn=require('acorn'),walk=require('acorn-walk'),vm=require('node:vm');
const {translate}=require('./structured-translation.cjs');
const hash='a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61',structureHash='13f1fee373cfa8736284d8d9558af55e4a9e1da5b17e4048053f6a21cbd5d013';
const html=fs.readFileSync('source/index.original.html','utf8');
if(crypto.createHash('sha256').update(html).digest('hex')!==hash)throw Error('Fonte original divergente');
let literal;
for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(match[1])||/application\/ld\+json/.test(match[1]))continue;
 const code=match[2];walk.ancestor(acorn.parse(code,{ecmaVersion:'latest'}),{VariableDeclarator(node,ancestors){
  if(node.id?.name!=='VENTURE_MARKETS'||ancestors.some(ancestor=>/Function/.test(ancestor.type)))return;
  if(literal)throw Error('VENTURE_MARKETS duplicado');literal=code.slice(node.init.start,node.init.end);
 }});
}
if(!literal||crypto.createHash('sha256').update(literal).digest('hex')!==structureHash)throw Error('Estrutura de origem divergente');
const source=vm.runInNewContext('('+literal+')'),targets=JSON.parse(fs.readFileSync('locales/venture-markets-alternative-descriptions-targets.pt-BR.json','utf8')),ids=Object.keys(source);
if(JSON.stringify(Object.keys(targets))!==JSON.stringify(ids))throw Error('Cobertura divergente');
const strings={};
for(const id of ids){
 const alternatives=source[id].alternatives,values=targets[id];
 if(!Array.isArray(values)||values.length!==alternatives.length)throw Error('Cobertura divergente: '+id);
 for(const [index,item] of alternatives.entries()){
  const target=values[index];if(typeof target!=='string'||!target.trim()||target===item.description)throw Error('Texto inválido: '+id+'/'+item.id);
  strings[JSON.stringify([id,'alternatives',index,'description'])]={source:item.description,target};
 }
}
if(Object.keys(strings).length!==36)throw Error('Total divergente');
const file='locales/structures.pt-BR.json',catalogue=JSON.parse(fs.readFileSync(file,'utf8')),previous=catalogue.VENTURE_MARKETS;
if(!previous||previous.status!=='partial-translation'||previous.sourceSha256!==structureHash||![24,50,60,86,96,122,132,158,168,194,602,662].includes(Object.keys(previous.strings||{}).length))throw Error('Recorte atual ausente');
const merged={...previous.strings,...strings};catalogue.VENTURE_MARKETS={...previous,classification:Object.keys(merged).length===194?'Recortes P1: 24 rótulos e descrições do mercado atual; 36 nomes, 36 descrições, 36 resumos, 26 lacunas de equipe e 36 comentários de financiadores das alternativas. Dados de oportunidade, riscos, bônus, efeitos e os demais textos continuam pendentes de tradução ou adaptação funcional em P2/P3. A interface permanece oculta e a neutralização de efeitos é limitada aos seis modelos operacionais.':'Recorte P1 parcial de VENTURE_MARKETS com '+Object.keys(merged).length+' caminhos; campos restantes, oportunidade, riscos, bônus e efeitos continuam pendentes.',strings:merged};
translate(html,{VENTURE_MARKETS:catalogue.VENTURE_MARKETS});fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');
console.log('VENTURE_MARKETS/descriptions: 36 caminhos');
