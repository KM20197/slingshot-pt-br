const fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk'),vm=require('node:vm'),crypto=require('node:crypto'),{translate}=require('./structured-translation.cjs');
const html=fs.readFileSync('source/index.original.html','utf8'),names=['FUNDER_OPTIONS','VENTURE_ANGELS','FOLLOW_ON_INVESTORS'],found={};
for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(match[1]))continue;
 const code=match[2];walk.simple(acorn.parse(code,{ecmaVersion:'latest'}),{VariableDeclarator(node){if(node.id.type==='Identifier'&&names.includes(node.id.name)){const literal=code.slice(node.init.start,node.init.end);found[node.id.name]={literal,value:vm.runInNewContext('('+literal+')'),sha256:crypto.createHash('sha256').update(literal).digest('hex')};}}});
}
for(const name of names)if(!found[name])throw Error('Estrutura ausente: '+name);
const fields=['name','title','personality','benefits'],paths=[];
for(const[group,items]of Object.entries(found.FOLLOW_ON_INVESTORS.value)){
 if(Array.isArray(items))items.forEach((item,index)=>fields.forEach(field=>paths.push([[group,index,field],item[field]])));
 else Object.entries(items).forEach(([id,item])=>['personality','benefits'].forEach(field=>paths.push([[group,id,field],item[field]])));
}
const targets=JSON.parse(fs.readFileSync('locales/follow-on-investors-targets.pt-BR.json','utf8')).FOLLOW_ON_INVESTORS;
if(paths.length!==64||targets.length!==paths.length)throw Error('Cobertura de campos divergente');
const file='locales/structures.pt-BR.json',catalogue=JSON.parse(fs.readFileSync(file,'utf8')),strings={...catalogue.FOLLOW_ON_INVESTORS?.strings};
for(const [index,[path,source]]of paths.entries())strings[JSON.stringify(path)]={source,target:targets[index]};
catalogue.FUNDER_OPTIONS={classification:'referência técnica; IDs preservados, sem prosa de execução',sourceSha256:found.FUNDER_OPTIONS.sha256,strings:{}};
catalogue.VENTURE_ANGELS={classification:'referência técnica; IDs e ordem preservados, sem prosa de execução',sourceSha256:found.VENTURE_ANGELS.sha256,strings:{}};
catalogue.FOLLOW_ON_INVESTORS={classification:'rótulos e prosa de interface; IDs, SVGs, valores, diluição, bônus e tiers preservados',sourceSha256:found.FOLLOW_ON_INVESTORS.sha256,strings};
translate(html,{FUNDER_OPTIONS:catalogue.FUNDER_OPTIONS,VENTURE_ANGELS:catalogue.VENTURE_ANGELS,FOLLOW_ON_INVESTORS:catalogue.FOLLOW_ON_INVESTORS});
fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');console.log(paths.length);
