const fs=require('node:fs'),crypto=require('node:crypto'),acorn=require('acorn'),walk=require('acorn-walk');
const {translate}=require('./structured-translation.cjs');
const fields=['title','desc','personality','benefits','challenges','ongoing'];
function read(n){
 if(n.type==='Literal')return n.value;
 if(n.type==='TemplateLiteral'&&!n.expressions.length)return n.quasis[0].value.cooked;
 if(n.type==='UnaryExpression'&&n.operator==='-'&&n.argument.type==='Literal'&&typeof n.argument.value==='number')return -n.argument.value;
 if(n.type==='ArrayExpression')return n.elements.map(read);
 if(n.type==='ObjectExpression')return Object.fromEntries(n.properties.map(p=>{if(p.type!=='Property'||p.computed)throw Error('Propriedade não literal.');return [p.key.name??p.key.value,read(p.value)];}));
 throw Error('Dado não literal: '+n.type);
}
const html=fs.readFileSync('source/index.original.html','utf8');let original;
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n){if(n.id.name==='FUNDERS'){if(original)throw Error('FUNDERS duplicado.');original=read(n.init);}}});
}
const expected='e788397fdbfa5ed3482f6cff649d2d5ab64c54c30babce7a689eb10d7921a9da';
if(!original||crypto.createHash('sha256').update(JSON.stringify(original)).digest('hex')!==expected)throw Error('Fonte FUNDERS divergente; catálogo não gravado.');
const targets=JSON.parse(fs.readFileSync('locales/funders-targets.pt-BR.json','utf8'));
if(JSON.stringify(Object.keys(targets).sort())!==JSON.stringify(Object.keys(original).sort()))throw Error('Cobertura de financiadores divergente.');
const strings={};
for(const [id,funder]of Object.entries(original)){
 if(!Array.isArray(targets[id])||targets[id].length!==fields.length)throw Error('Cobertura de campos divergente: '+id);
 fields.forEach((field,i)=>{
  const source=funder[field],target=targets[id][i];
  if(typeof source!=='string'||typeof target!=='string'||!target.trim())throw Error('Texto inválido: '+id+'/'+field);
  strings[JSON.stringify([id,field])]={source,target};
 });
}
const entry={classification:'192 textos de apresentação em 32 perfis do cenário britânico legado. Nomes canônicos preservados porque participam de comparações internas, inclusive nomes genéricos; título militar dentro de name também preservado. Identificadores, etapas, valores, bônus, referências geográficas, empreendimentos e SVGs intactos. As rotas brasileiras já substituídas continuam no módulo de crédito. Não representa adaptação final do financiamento nem validação factual das biografias.',strings};
translate(html,{FUNDERS:entry});
const file='locales/structures.pt-BR.json',catalogue=JSON.parse(fs.readFileSync(file,'utf8'));
catalogue.FUNDERS=entry;
fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');
console.log('FUNDERS: 32 perfis, 192 campos traduzidos; demais dados preservados.');
