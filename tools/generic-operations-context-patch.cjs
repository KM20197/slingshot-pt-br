'use strict';
const fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk'),{translate}=require('./structured-translation.cjs');
const indices=Array.from({length:66},(_,i)=>i),keys=[];
for(const i of indices){keys.push(JSON.stringify(['research',i,'intro']),JSON.stringify(['research',i,'aside']));for(let c=0;c<(i===49||i===65?4:3);c++)for(const field of ['text','reaction'])keys.push(JSON.stringify(['research',i,'choices',c,field]));}
function apply(html,catalogue=JSON.parse(fs.readFileSync(require.resolve('../locales/generic-operations-context.pt-BR.json'),'utf8'))){
 if(!catalogue||Object.keys(catalogue).join('|')!=='GENERIC_EVENTS')throw Error('Raiz genérica divergente');
 const entry=catalogue.GENERIC_EVENTS,actual=Object.keys(entry?.strings||{});
 if(typeof entry?.classification!=='string'||actual.length!==532||actual.some(k=>!keys.includes(k)))throw Error('Caminhos genéricos incompletos ou proibidos');
 for(const key of keys){const v=entry.strings[key];if(!v||typeof v.source!=='string'||typeof v.target!=='string'||!v.target.trim()||v.source===v.target||/[<>0-9]/.test(v.target)||v.target.includes(String.fromCharCode(96))||v.target.includes('$'+'{')||/\b(UK|NHS|England|Inglaterra|London|Gartner|Cabinet|FT|startup|IA|AI|G2|TeamChat|CareerHub|biotecnologia|healthtech|software|LLM|chatbot|Pangram|GitHub|GDPR|ICO|LGPD|INPI|DACH|Berlin|Berlim|Nigerian)\b|Financial Times|open source|KTP|Innovate|Warwick|Nottingham|Sheffield|Russell|British|GPU|cloud|laboratório|apprentice|PhD|MSc/i.test(v.target))throw Error('Texto genérico inválido: '+key);if((v.source.match(/\[NEW\]/g)||[]).length!==(v.target.match(/\[NEW\]/g)||[]).length)throw Error('Marcador genérico alterado');}
 let found=0;
 const get=(n,k)=>n?.type==='ObjectExpression'?n.properties.find(p=>p.type==='Property'&&!p.computed&&(p.key.name??p.key.value)===k)?.value:undefined;
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;
  walk.ancestor(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n,a){if(n.id?.name!=='GENERIC_EVENTS'||a.some(x=>/Function/.test(x.type)))return;found++;
   const pool=get(n.init,'research');if(pool?.type!=='ArrayExpression'||pool.elements.length!==66)throw Error('Pool de operações ausente ou divergente');
   for(const i of indices){const event=pool.elements[i],sectors=get(event,'sectors'),choices=get(event,'choices');if(choices?.type!=='ArrayExpression'||choices.elements.length!==(i===49||i===65?4:3))throw Error('Escolhas genéricas divergentes');
    const expectedSector=i===51?'vanguard':i===56?'dream':null,flag=get(event,'llm');
    if(expectedSector){if(sectors?.type!=='ArrayExpression'||sectors.elements.length!==1||sectors.elements[0]?.value!==expectedSector)throw Error('Setor exclusivo divergente');}else if(sectors!==undefined)throw Error('Evento universal recebeu filtro');
    if(i>=57&&i<=60){if(flag?.type!=='Literal'||flag.value!==true)throw Error('Flag técnica divergente');}else if(flag!==undefined)throw Error('Flag técnica inesperada');
   }
  }});
 }
 if(found!==1)throw Error('GENERIC_EVENTS ausente ou duplicado');
 return translate(html,catalogue);
}
module.exports={apply};
