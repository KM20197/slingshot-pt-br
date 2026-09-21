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

const hashes={M2_FUNDERS:'cc6da3daa6f582cfedd77401c0808965417ca382570cec551bc67f28ed370bbf',M3_FUNDERS:'760e4bfaa98ec056ffa0c71bd78ba5dd638d704678f259272d93ebd6bfdee3b1'};
const html=fs.readFileSync('source/index.original.html','utf8'),original={};
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n){if(Object.hasOwn(hashes,n.id.name)){if(original[n.id.name])throw Error('Estrutura duplicada.');original[n.id.name]=read(n.init);}}});
}
const targets=JSON.parse(fs.readFileSync('locales/later-funders-targets.pt-BR.json','utf8')),entries={};
const sameKeys=(a,b)=>JSON.stringify(Object.keys(a).sort())===JSON.stringify(Object.keys(b).sort());
if(!sameKeys(targets,hashes))throw Error('Cobertura de estruturas divergente.');
for(const pool of Object.keys(hashes)){
 const data=original[pool];
 if(!data||crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')!==hashes[pool])throw Error('Fonte divergente: '+pool);
 if(!sameKeys(targets[pool],data))throw Error('Cobertura de perfis divergente: '+pool);
 const strings={};
 for(const[id,funder]of Object.entries(data)){
  const expected=Object.fromEntries(fields.map(f=>[f,funder[f]]));
  if(funder.resourceBenefits)expected.resourceBenefits=funder.resourceBenefits;
  function visit(source,target,path){
   if(typeof source==='string'){
    if(typeof target!=='string'||!target.trim())throw Error('Texto inválido: '+pool+'/'+path.join('/'));
    strings[JSON.stringify(path)]={source,target};return;
   }
   if(!source||!target||typeof target!=='object'||Array.isArray(target)||!sameKeys(source,target))throw Error('Cobertura de campos divergente: '+pool+'/'+path.join('/'));
   for(const key of Object.keys(source))visit(source[key],target[key],[...path,key]);
  }
  visit(expected,targets[pool][id],[id]);
 }
 entries[pool]={classification:'Prosa dos perfis e benefícios de recursos do cenário britânico legado traduzidos. Nomes, IDs, etapas, critérios geográficos, afinidades, exclusividades, imagens e atributos financeiros preservados. Não conclui a substituição das rotas societárias nem valida as alegações como fatos atuais.',strings};
}
translate(html,entries);
const file='locales/structures.pt-BR.json',catalogue=JSON.parse(fs.readFileSync(file,'utf8'));
Object.assign(catalogue,entries);fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');
for(const[pool,entry]of Object.entries(entries))console.log(pool+': '+Object.keys(entry.strings).length+' textos.');
