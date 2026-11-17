const fs=require('node:fs'),crypto=require('node:crypto'),acorn=require('acorn'),walk=require('acorn-walk'),vm=require('node:vm');
const {translate}=require('./structured-translation.cjs');
const hash='a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61',structureHash='13f1fee373cfa8736284d8d9558af55e4a9e1da5b17e4048053f6a21cbd5d013',html=fs.readFileSync('source/index.original.html','utf8');
if(crypto.createHash('sha256').update(html).digest('hex')!==hash)throw Error('Fonte original divergente');
let literal;for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;const c=m[2];walk.ancestor(acorn.parse(c,{ecmaVersion:'latest'}),{VariableDeclarator(n,a){if(n.id?.name==='VENTURE_MARKETS'&&!a.some(x=>/Function/.test(x.type))){if(literal)throw Error('VENTURE_MARKETS duplicado');literal=c.slice(n.init.start,n.init.end)}}})}
if(!literal||crypto.createHash('sha256').update(literal).digest('hex')!==structureHash)throw Error('Estrutura de origem divergente');
const source=vm.runInNewContext('('+literal+')'),targets=JSON.parse(fs.readFileSync('locales/venture-markets-current-customer-insights-targets.pt-BR.json','utf8')),ids=Object.keys(source),strings={};
if(JSON.stringify(Object.keys(targets))!==JSON.stringify(ids))throw Error('Cobertura divergente');
for(const id of ids){const values=targets[id],insights=source[id].current.customerInsights;if(!Array.isArray(values)||values.length!==insights.length)throw Error('Cobertura divergente');for(const[i,item]of insights.entries()){const target=values[i];if(typeof target!=='string'||target!==target.trim()||!target||target===item.insight)throw Error('Texto inválido');strings[JSON.stringify([id,'current','customerInsights',i,'insight'])]={source:item.insight,target}}}
if(Object.keys(strings).length!==60)throw Error('Total divergente');
const file='locales/structures.pt-BR.json',catalogue=JSON.parse(fs.readFileSync(file,'utf8')),previous=catalogue.VENTURE_MARKETS;
if(!previous||previous.status!=='partial-translation'||previous.sourceSha256!==structureHash)throw Error('Recorte atual ausente');
catalogue.VENTURE_MARKETS={...previous,classification:'Recorte P1 parcial de VENTURE_MARKETS; títulos e insights dos níveis atuais e alternativos e customerInsights atuais adicionados. Oportunidades, riscos, bônus, efeitos e demais textos continuam pendentes.',strings:{...previous.strings,...strings}};
translate(html,{VENTURE_MARKETS:catalogue.VENTURE_MARKETS});fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');console.log('VENTURE_MARKETS/current customerInsights: 60 caminhos');
