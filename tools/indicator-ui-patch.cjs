'use strict';
const crypto=require('node:crypto'),acorn=require('acorn'),walk=require('acorn-walk');
const sources={scoreExcellent:'Excellent',scoreStrong:'Strong',scoreSolid:'Solid',scoreDeveloping:'Developing',scoreEarly:'Early Stage',cashToast:'Cash',runwayToast:'Runway'};
const pins={score:'bc4c8c39a8839e0d13213c00b53613483d28481512c0f932cfc52b90b5593954',cashToast:'52df4e842eb3c703258c7d994698157c111cf8923e666a3be07888f78fa3b18f',runwayToast:'4f436f6e6787af1e4b8af145b5652437ba1f0ce34fd806d105eddb3ad15f3280'};
const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v),sha=n=>crypto.createHash('sha256').update(clean(n)).digest('hex');
function inspect(html){
 const games=[];for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=|application\/ld\+json/i.test(m[1]))continue;const code=m[2];if(!code.includes('class Game'))continue;walk.simple(acorn.parse(code,{ecmaVersion:'latest'}),{ClassDeclaration(n){if(n.id?.name==='Game')games.push({node:n,code,offset:m.index+m[0].indexOf('>')+1});}});}
 if(games.length!==1)throw Error('Classe Game ausente ou duplicada');const {node,code,offset}=games[0],find=name=>{const a=node.body.body.filter(n=>n.type==='MethodDefinition'&&!n.computed&&n.key.name===name);if(a.length!==1)throw Error('Método ausente ou duplicado: '+name);return a[0];},score=find('getScoreLabel'),update=find('update'),returns=[],calls=[];
 walk.simple(score.value.body,{ReturnStatement(n){returns.push(n.argument);}});walk.simple(update.value.body,{CallExpression(n){if(n.callee.type==='MemberExpression'&&!n.callee.computed&&n.callee.object.type==='Identifier'&&n.callee.object.name==='UIEffects'&&n.callee.property.name==='showKPIChange')calls.push(n);}});
 if(returns.length!==5||calls.length!==2||[...returns,...calls.map(c=>c.arguments[0])].some(n=>n?.type!=='Literal'||typeof n.value!=='string'))throw Error('Forma dos indicadores divergente');
 const nodes=[...returns,...calls.map(c=>c.arguments[0])],ids=Object.keys(sources),points=nodes.map((n,i)=>({id:ids[i],source:n.value,start:offset+n.start,end:offset+n.end,raw:code.slice(n.start,n.end)}));
 return{points,pins:{score:sha(score),cashToast:sha(calls[0]),runwayToast:sha(calls[1])},methods:{score:code.slice(score.start,score.end),update:code.slice(update.start,update.end)}};
}
function apply(html,catalogue=require('../locales/indicator-ui.pt-BR.json')){
 if(!catalogue||Object.keys(catalogue).sort().join('|')!=='classification|strings'||catalogue.classification!=='presentation-only-indicators'||!catalogue.strings||Object.keys(catalogue.strings).join('|')!==Object.keys(sources).join('|'))throw Error('Catálogo de indicadores divergente');
 const found=inspect(html);for(const[k,h]of Object.entries(pins))if(found.pins[k]!==h)throw Error('AST protegido divergente: '+k);
 const edits=[];for(const point of found.points){const item=catalogue.strings[point.id];if(!item||Object.keys(item).sort().join('|')!=='source|target'||item.source!==sources[point.id]||point.source!==item.source||typeof item.target!=='string'||item.target!==item.target.trim()||item.target===item.source||item.target.length>70||!/^\p{L}[\p{L}\p{M} -]*$/u.test(item.target))throw Error('Texto de indicador inválido: '+point.id);edits.push({...point,target:item.target});}
 let out=html;for(const e of edits.sort((a,b)=>b.start-a.start))out=out.slice(0,e.start)+JSON.stringify(e.target)+out.slice(e.end);
 return{html:out,report:{labels:edits.length,methods:['Game.getScoreLabel','Game.update'],rulesUnchanged:true,changes:edits.map(({id,source,target})=>({id,source,target}))}};
}
module.exports={apply,inspect,sources,pins};
