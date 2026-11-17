'use strict';
const fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const {translate}=require('./structured-translation.cjs');
const events=[...[0,2,3,6,15,17].map(i=>['research','fatima',i]),['research','yuki',7],['research','kwame',11],['research','kwame',14],['marketing','priya',0],['marketing','priya',5],['marketing','priya',6],['marketing','emma',6]],keys=[];
for(const p of events){keys.push(JSON.stringify([...p,'intro']),JSON.stringify([...p,'aside']));for(let c=0;c<3;c++)for(const f of ['text','reaction'])keys.push(JSON.stringify([...p,'choices',c,f]));}
function apply(html,catalogue=JSON.parse(fs.readFileSync(require.resolve('../locales/clinic-legacy-decisions.pt-BR.json'),'utf8'))){
 if(!catalogue||Object.keys(catalogue).join('|')!=='CHAR_EVENTS')throw Error('Estrutura da clínica divergente');
 const entry=catalogue.CHAR_EVENTS,actual=Object.keys(entry?.strings||{});
 if(typeof entry?.classification!=='string'||actual.length!==keys.length||actual.some(k=>!keys.includes(k)))throw Error('Caminhos da clínica incompletos ou proibidos');
 for(const k of keys){const v=entry.strings[k];if(!v||typeof v.source!=='string'||typeof v.target!=='string'||!v.target.trim()||v.source===v.target||/[<>`]|\$\{|\d/.test(v.target)||/\b(MHRA|UK|London|England|NHS|NIA|MoU|NDA|AI|IA|pharma|startup|biotech|biotecnologia|protein|proteína|Royal College)\b/i.test(v.target))throw Error('Texto administrativo inválido: '+k);}
 let found=0;
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;
  walk.ancestor(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n,a){
   if(n.id?.name!=='CHAR_EVENTS'||a.some(x=>/Function/.test(x.type)))return;
   found++;
   const get=(v,k)=>v?.type==='ObjectExpression'?v.properties.find(p=>p.type==='Property'&&!p.computed&&(p.key.name??p.key.value)===k)?.value:null;
   for(const [domain,person,i] of events){
    const pool=get(get(n.init,domain),person);
    if(pool?.type!=='ArrayExpression')throw Error('Pool administrativo ausente: '+domain+'/'+person);
    const e=pool.elements[i],sector=get(e,'sectors'),choices=get(e,'choices');if(sector?.type!=='ArrayExpression'||sector.elements.length!==1||sector.elements[0]?.value!=='aether'||choices?.type!=='ArrayExpression'||choices.elements.length!==3)throw Error('Setor ou escolhas divergentes: '+domain+'/'+person+'/'+i);
   }
  }});
 }
 if(found!==1)throw Error('CHAR_EVENTS ausente ou duplicado');
 return translate(html,catalogue);
}
module.exports={apply};
