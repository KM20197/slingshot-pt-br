const fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const {translate}=require('./structured-translation.cjs');
const html=fs.readFileSync('source/index.original.html','utf8');let advice;
const read=n=>n.type==='Literal'?n.value:n.type==='UnaryExpression'&&n.operator==='-'&&n.argument.type==='Literal'?-n.argument.value:n.type==='ArrayExpression'?n.elements.map(read):n.type==='ObjectExpression'?Object.fromEntries(n.properties.map(p=>[p.key.name,read(p.value)])):(()=>{throw Error('Dado não literal: '+n.type)})();
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n){if(n.id.name==='FUNDER_ADVICE')advice=read(n.init);}});}
const id='eleniStavros',source=advice?.[id];if(!source)throw Error('Perfil ausente na fonte.');
const paths=[];for(const [domain,rows] of Object.entries(source.advice))rows.forEach((row,index)=>['text','reason'].forEach(field=>paths.push({path:[id,'advice',domain,index,field],source:row[field]})));
for(const field of ['followedReaction','ignoredReaction','hostileWarning'])paths.push({path:[id,field],source:source[field]});
const targets=JSON.parse(fs.readFileSync('locales/advice-eleni-targets.pt-BR.json','utf8'))[id];if(!Array.isArray(targets)||targets.length!==paths.length)throw Error('Cobertura de Eleni divergente.');
const file='locales/structures.pt-BR.json',catalogue=JSON.parse(fs.readFileSync(file,'utf8')),strings={...catalogue.FUNDER_ADVICE.strings};paths.forEach(({path,source},i)=>strings[JSON.stringify(path)]={source,target:targets[i]});catalogue.FUNDER_ADVICE={...catalogue.FUNDER_ADVICE,strings};translate(html,{FUNDER_ADVICE:catalogue.FUNDER_ADVICE});fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');console.log('FUNDER_ADVICE (eleniStavros): '+paths.length+' campos.');
