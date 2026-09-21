const fs=require('node:fs'),crypto=require('node:crypto'),acorn=require('acorn'),walk=require('acorn-walk');
const {translate}=require('./structured-translation.cjs');
function read(n){
 if(n.type==='Literal')return n.value;
 if(n.type==='TemplateLiteral'&&!n.expressions.length)return n.quasis[0].value.cooked;
 if(n.type==='UnaryExpression'&&n.operator==='-'&&n.argument.type==='Literal'&&typeof n.argument.value==='number')return -n.argument.value;
 if(n.type==='ArrayExpression')return n.elements.map(read);
 if(n.type==='ObjectExpression')return Object.fromEntries(n.properties.map(p=>{if(p.type!=='Property'||p.computed)throw Error('Propriedade não literal.');return [p.key.name??p.key.value,read(p.value)];}));
 throw Error('Dado não literal: '+n.type);
}

const hashes={M2_FUNDER_OPTIONS:'e8ec174d4ef734e4652ab3c4ab1131e74a48bb50a56d5d332e99825c47333d88',M3_FUNDER_OPTIONS:'b2d5e444f85744f6aac7c57733077d7c9c85aada301f05fa2fe3c49dc3c0475c',FUNDER_ADVICE:'02cb400289da66bc466aa0b48dc6b7292e234d91e8c20c47bc3ff5d8629db1a2'};
const html=fs.readFileSync('source/index.original.html','utf8'),data={};
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n){if(Object.hasOwn(hashes,n.id.name)){if(data[n.id.name])throw Error('Estrutura duplicada.');data[n.id.name]=read(n.init);}}});
}
for(const[name,hash]of Object.entries(hashes))if(!data[name]||crypto.createHash('sha256').update(JSON.stringify(data[name])).digest('hex')!==hash)throw Error('Fonte divergente: '+name);
const ids=['dragon','techAngel','operatorAngel','academicAngel'];
const targets=JSON.parse(fs.readFileSync('locales/advice-initial-targets.pt-BR.json','utf8'));
if(JSON.stringify(Object.keys(targets).sort())!==JSON.stringify([...ids].sort()))throw Error('Cobertura de perfis divergente.');
const file='locales/structures.pt-BR.json',catalogue=JSON.parse(fs.readFileSync(file,'utf8'));
const strings={...(catalogue.FUNDER_ADVICE?.strings||{})};
for(const id of ids){
 const paths=[];
 for(const[domain,rows]of Object.entries(data.FUNDER_ADVICE[id].advice))rows.forEach((row,i)=>{for(const field of ['text','reason'])paths.push({path:[id,'advice',domain,i,field],source:row[field]});});
 for(const field of ['followedReaction','ignoredReaction','hostileWarning'])paths.push({path:[id,field],source:data.FUNDER_ADVICE[id][field]});
 if(!Array.isArray(targets[id])||targets[id].length!==paths.length)throw Error('Cobertura de campos divergente: '+id);
 paths.forEach(({path,source},i)=>{const target=targets[id][i];if(typeof target!=='string'||!target.trim())throw Error('Texto inválido: '+id);strings[JSON.stringify(path)]={source,target};});
}
for(const name of ['M2_FUNDER_OPTIONS','M3_FUNDER_OPTIONS'])catalogue[name]={classification:'Referências técnicas aos IDs dos financiadores, por categoria e empreendimento; ordem e valores preservados integralmente.',strings:{}};
const ordered={};
function visit(value,path=[]){if(typeof value==='string'){const key=JSON.stringify(path);if(Object.hasOwn(strings,key))ordered[key]=strings[key];}else if(Array.isArray(value))value.forEach((x,i)=>visit(x,[...path,i]));else if(value&&typeof value==='object')for(const[k,v]of Object.entries(value))visit(v,[...path,k]);}
visit(data.FUNDER_ADVICE);
if(Object.keys(ordered).length!==Object.keys(strings).length)throw Error('Caminho excedente.');
catalogue.FUNDER_ADVICE={classification:'Tradução parcial de conselhos, justificativas e reações, por perfil. Nomes, preferências de domínio (incluindo repetições usadas como peso), escolhas e penalidades preservados. self permanece null. Outros perfis ainda pendentes; conteúdo britânico legado, sem adaptação financeira neste lote.',strings:ordered};
translate(html,{M2_FUNDER_OPTIONS:catalogue.M2_FUNDER_OPTIONS,M3_FUNDER_OPTIONS:catalogue.M3_FUNDER_OPTIONS,FUNDER_ADVICE:catalogue.FUNDER_ADVICE});
fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');console.log('FUNDER_ADVICE: '+Object.keys(ordered).length+' campos; duas estruturas de opções preservadas.');
