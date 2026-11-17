'use strict';
const fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const {translate}=require('./structured-translation.cjs'),crypto=require('node:crypto');
const indices=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],choiceCounts=[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],pins=["cb7fe06226a9095e208401a6cc05caef60b89bd681920da1a9d43a0d7ba69889","61ede16d7f283d994b236b52c041d237b5a6f08942142c7a11028325cde56ac7","89a786e40ec15a41c441a99c8874b5f39f1df50089b36a01f666c47f19e5bab3","7ab5268da5fade5625ea26464508fd9b9e10c4adf7910a01a9e84c989bbe855a","8f63be71115ea956a09995a5c3b4617261e4c7dce545fc5429dfac4a461a8ff0","bf4b8f971ee817b34c803fc8d3273d5df716cc7952dfbf47d3cf1e3facc79352","775e9897443c67df530e3862ff56769d119342640bab51d1e2ce9863eb500e0a","d7cc6f9a9a8ead1d59e8535ec7f1a17e91757c1f56b650cdbcc1f6db4c77afe5","0616662fd36416866a12c57fc183a9052fefd0933a15003dac3ea77013517c10","dca9c62ac160075899f661578ea7356d2c98e67cdbd21ca818e934fbabf0e1a3","b765fbb4da33505c99946c2a5272860f78d69287ec0f32ff26ff9416cdc0c31d","0c15ba2fc46f4ee6f9e3f8f0bfa3015caac82b7af1996ceb0ba9d384e75db182","f549515700827eeeaffe5c950750a84633e940786f87ae66dbc73092ef94b451","5f708ed047ca51cea48e1ed7ef4b6e45f8102571df06f1f65b5b25bcb2030219","301a282e98d07c30f670b4f0e72cc85c2e9977c74205f9bfd25e4e994537726a","af8d4b74a3ab1dedf292557c1fd241505d651e0e4a56dcf6351ea696dc94921f"],keys=[];
for(const i of indices){const path=["hr","sofia",i];for(const f of ["intro","aside"])keys.push(JSON.stringify([...path,f]));for(let c=0;c<3;c++)for(const f of ["text","reaction"])keys.push(JSON.stringify([...path,"choices",c,f]));}
const get=(n,k)=>n?.properties?.find(q=>q.type==='Property'&&!q.computed&&(q.key.name??q.key.value)===k)?.value;
function locate(html){let result,count=0;for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;walk.ancestor(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n,a){if(n.id?.name==='CHAR_EVENTS'&&!a.some(x=>/Function/.test(x.type))){count++;result={node:n.init,base:m.index+m[0].indexOf('>')+1};}}});}if(count!==1)throw Error('CHAR_EVENTS ausente ou duplicado');return result;}
function metadataHash(event){const n=structuredClone(event);for(const f of ['intro','aside']){const x=get(n,f);if(x?.type!=='Literal'||typeof x.value!=='string')throw Error('Prosa do evento de Sofia divergente');x.value='EDITORIAL';}const choices=get(n,'choices');if(choices?.type!=='ArrayExpression'||!choices.elements.length)throw Error('Escolhas de Sofia ausentes');for(const c of choices.elements){if(c?.type!=='ObjectExpression')throw Error('Escolha de Sofia inválida');for(const f of ['text','reaction']){const x=get(c,f);if(x?.type!=='Literal'||typeof x.value!=='string')throw Error('Prosa da escolha de Sofia divergente');x.value='EDITORIAL';}for(const f of ['successReaction','failureReaction']){const x=get(c,f);if(x){if(x.type!=='Literal'||typeof x.value!=='string')throw Error('Prosa condicional de Sofia divergente');x.value='EDITORIAL';}}}return crypto.createHash('sha256').update(JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v)).digest('hex');}
function apply(html,catalogue=JSON.parse(fs.readFileSync(require.resolve('../locales/char-sofia-context.pt-BR.json'),'utf8'))){
 if(!catalogue||Object.keys(catalogue).join('|')!=='CHAR_EVENTS')throw Error('Raiz de Sofia divergente');
 const e=catalogue.CHAR_EVENTS,actual=Object.keys(e?.strings||{});
 if(typeof e?.classification!=='string'||actual.length!==128||actual.some(k=>!keys.includes(k)))throw Error('Caminhos de Sofia divergentes');
 for(const key of keys){const v=e.strings[key];if(!v||typeof v.source!=='string'||typeof v.target!=='string'||!v.target.trim()||v.source===v.target||/[<>0-9£€{}]/.test(v.target)||/[\p{Extended_Pictographic}\p{Regional_Indicator}]/u.test(v.target)||v.target.includes(String.fromCharCode(96))||v.target.includes('$'+'{')||/(?<![\p{L}\p{N}_])US(?![\p{L}\p{N}_])/iu.test(v.target)||/\bEU\b/.test(v.target)||/União Europeia/i.test(v.target)||/\b(3M|Gmail|Post-it|hackathon|burnout|aplicativo|aplicativos|engenharia|engenheiro|desenvolvedor|desenvolvedores|Shenzhen|China|Indonésia|Indonesia|Coca-Cola|API|SaaS|TeamChat|banco|bancos|regulador|reguladores|criptografia|empréstimo|juros|NDA|MIT|GPL|copyleft|copyright|Nature|CortexAI|CodeRepo|Theranos|Silicon Valley|UK|NHS|England|Inglaterra|London|Edinburgh|Singapore|Tokyo|Seoul|Horizon|Turing|Imperial|KTP|PhD|startup|IA|AI|LLM|software|app|apps|SDK|equity|salário|bônus|diagnóstico|terapia|CLT|FGTS|INSS|LGPD|GDPR|passaporte|passaportes|visto|vistos|imigração|imigratório|imigratória|tributário|tributária|fiscal|imposto|impostos|acionista|ações societárias|patente|patentes|patent|patents|licença|licenciamento|judicial|litígio|subsídio|subsídios)\b|código|robô|programação|automação|propriedade intelectual|segredo industrial|proteção legal|direito exclusivo|não concorrência|não competir|non.compete|garden leave|tribunal|advogado|licenças|jurídic|indenização|\bliminar\b|proteção automática|exclusividade garantida|bolsa de valores|conformidade garantida/i.test(v.target))throw Error('Texto de Sofia inválido: '+key);if((v.source.match(/\[NEW\]/g)||[]).length!==(v.target.match(/\[NEW\]/g)||[]).length)throw Error('Marcador NEW de Sofia alterado');}
 const anchor=(path,pattern)=>{if(!pattern.test(e.strings[JSON.stringify(['hr','sofia',...path])].target))throw Error('Referência narrativa ou consequência de Sofia ocultada: '+JSON.stringify(path));};
 anchor([9,"choices",0,"reaction"],/perd.*prepara.*atendimento/i);
 anchor([9,"choices",2,"reaction"],/desgast.*coopera/i);
 anchor([9,"choices",2,"reaction"],/tens|des[âa]nim/i);
 anchor([9,"choices",2,"reaction"],/duas pessoas/i);
 anchor([10,"choices",2,"reaction"],/acréscimo de caixa/i);
 anchor([10,"choices",2,"reaction"],/além/i);
 anchor([10,"choices",2,"reaction"],/custo da ação/i);
 anchor([0,"intro"],/duas pessoas/i);
 anchor([2,"intro"],/três pessoas/i);
 anchor([2,"intro"],/neste mês/i);
 anchor([4,"intro"],/duas pessoas/i);
 anchor([4,"intro"],/passa de mil libras por mês/i);
 anchor([6,"intro"],/duas equipes/i);
 anchor([6,"intro"],/sem autoria identificada/i);
 anchor([9,"intro"],/criticar|críticas/i);
 anchor([9,"intro"],/favorecer/i);
 anchor([9,"intro"],/diminuir/i);
 anchor([11,"intro"],/colaborativa/i);
 anchor([11,"intro"],/decisões/i);
 anchor([11,"intro"],/nada anda/i);
 anchor([11,"intro"],/trabalhar sempre/i);
 anchor([11,"intro"],/equilíbrio/i);
 const protectedPairs=Object.fromEntries(keys.slice(0,96).map(k=>[k,e.strings[k]]).sort(([a],[b])=>a.localeCompare(b)));if(crypto.createHash('sha256').update(JSON.stringify(protectedPairs)).digest('hex')!=='cae26aa653a98327fb01b0af93ffb4aea965ec7d01df3de3dffb44167727376b')throw Error('Pares Sofia r465 alterados');
 const reusedPairs=Object.fromEntries(keys.slice(112).map(k=>[k,e.strings[k].target]).sort(([a],[b])=>a.localeCompare(b)));if(crypto.createHash('sha256').update(JSON.stringify(reusedPairs)).digest('hex')!=='2d6e55423a9ceff6665f67db782207909b0d3c448e46084ff24e368f12810ce4')throw Error('Reuso David18/19 divergente');
 anchor([12,"intro"],/distância/i);
 anchor([12,"intro"],/coordena|conduz/i);
 anchor([12,"aside"],/dez pessoas/i);
 anchor([12,"aside"],/cinquenta/i);
 anchor([13,"intro"],/não há confirmação/i);
 anchor([13,"intro"],/independência/i);
 anchor([14,"intro"],/meses/i);
 anchor([14,"intro"],/desde o início/i);
 anchor([15,"intro"],/três anos/i);
 anchor([15,"intro"],/dezoito meses/i);
 for(const i of [14,15]){anchor([i,'choices',2,'reaction'],/(perd|reduz|prejudic).*(coopera|equipe)/i);anchor([i,'choices',2,'reaction'],/(perd|reduz|prejudic).*(prepara|organiza).*atendimento/i);anchor([i,'choices',2,'reaction'],/tens|des[âa]nim/i);}anchor([14,'choices',2,'reaction'],/bastante|forte|acentuad/i);
 const pool=get(get(locate(html).node,'hr'),'sofia');
 if(pool?.type!=='ArrayExpression'||pool.elements.length!==16)throw Error('Pool de Sofia divergente');
 for(let n=0;n<indices.length;n++){if(get(pool.elements[indices[n]],'choices')?.elements?.length!==choiceCounts[n])throw Error('Quantidade de escolhas de Sofia divergente: '+n);if(metadataHash(pool.elements[indices[n]])!==pins[n])throw Error('Metadados de Sofia divergentes: '+indices[n]);}
 return translate(html,catalogue);
}

// Remove only the three blank-line indents between the pinned HR array objects.
// Separators contain no literals/comments; the complete CHAR_EVENTS AST stays equal.
function cleanHrSeparators(html){
 const {node,base}=locate(html),pool=get(get(node,'hr'),'aisha');
 if(pool?.type!=='ArrayExpression'||pool.elements.length!==9)throw Error('Higiene HR: pool divergente');
 const expected=[',\n      \n      \n      ',',\n      \n      '],edits=[],gaps=[];
 let blankLines=0,spacesRemoved=0;
 for(const [n,i]of [1,2].entries()){
  const start=base+pool.elements[i].end,end=base+pool.elements[i+1].start,gap=html.slice(start,end),normalized=gap.replace(/\r\n/g,'\n'),cleanedExpected=expected[n].replace(/^ {6}(?=\n)/gm,'');
  if(normalized!==expected[n]&&normalized!==cleanedExpected)throw Error('Higiene HR: separador não aprovado '+i);
  const matches=[...gap.matchAll(/^ {6}(?=\r?\n)/gm)],cleaned=gap.replace(/^ {6}(?=\r?\n)/gm,'');
  blankLines+=matches.length;spacesRemoved+=matches.reduce((a,m)=>a+m[0].length,0);gaps.push({between:[i,i+1],blankLines:matches.length});if(cleaned!==gap)edits.push({start,end,text:cleaned});
 }
 if(![0,3].includes(blankLines))throw Error('Higiene HR: normalização parcial não aprovada');
 let output=html;for(const e of edits.sort((a,b)=>b.start-a.start))output=output.slice(0,e.start)+e.text+output.slice(e.end);
 const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v);
 if(clean(node)!==clean(locate(output).node))throw Error('Higiene HR: AST alterado');
 return{html:output,report:{scope:'Somente separadores hr.aisha[1]/[2] e[2]/[3]',blankLines,spacesRemoved,gaps,wholeCharASTEqual:true,sourceStringsAndMetadataPreserved:true}};
}

module.exports={apply,locate,metadataHash,cleanHrSeparators};
