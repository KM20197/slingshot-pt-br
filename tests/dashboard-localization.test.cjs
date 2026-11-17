const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const html=fs.readFileSync('index.html','utf8');
function method(name){
 const found=[];
 for(const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(script[1]))continue;const offset=script.index+script[0].indexOf('>')+1;
  walk.ancestor(acorn.parse(script[2],{ecmaVersion:'latest'}),{MethodDefinition(node,parents){if(node.key.name===name&&parents.some(p=>p.type==='ClassDeclaration'&&p.id?.name==='Game'))found.push(html.slice(offset+node.start,offset+node.end));}});
 }
 assert.equal(found.length,1,name);return found[0];
}
test('L3c localizes the chapter and situation brief without changing its IDs',()=>{
 for(const phrase of ['Capítulo 1','Resumo da situação','Autonomia financeira','Meta atual','Foco sugerido','Iniciar trimestre'])assert.ok(html.includes(phrase),phrase);
 for(const id of ['briefChapterTitle','briefChapterSubtitle','briefRunway','briefMilestoneName','briefSuggestion','briefSuggestionReason'])assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(!html.includes('>Situation Brief<'));assert.ok(!html.includes('>Start Quarter<'));
});
test('L3c keeps financial magnitudes and changes only the displayed region currency',()=>{
 assert.match(html,/const R = Object\.freeze\(\{\.\.\.REGIONS\.uk, currency: "R\$", currencyName: "BRL", currencyMultiplier: 1\}\)/);
 assert.match(html,/function getRegion\(\) \{\s*return R;/);
 assert.match(html,/function formatValuation\(amountInK, currency = 'R\$'\)/);
 assert.match(html,/currencyMultiplier: 1/);
});
test('L3c translates dynamic focus, deadline and chapter logic',()=>{
 const expected={getChapterInfo:'Capítulo',calculateSuggestedFocus:'Financiamento',getMilestoneFocusAreas:'Produção e Serviços',getMilestoneFocusReason:'Equilibre o esforço',showSituationBrief:'Restam'};
 for(const [name,phrase] of Object.entries(expected))assert.ok(method(name).includes(phrase),name);
 assert.doesNotMatch(method('getChapterInfo'),/Finding product/);
 assert.doesNotMatch(method('showSituationBrief'),/quarter\$\{|Year \$\{|Low runway/);
});
test('new hires use salary-only offers while existing save fields remain available',()=>{
 const negotiation=method('startNegotiation'),preview=method('updateOfferPreview'),submit=method('submitOffer'),save=method('saveGame');
 assert.match(negotiation,/Proposta de contratação/);
 assert.doesNotMatch(negotiation,/offerEquity|Equity Offer/);
 assert.doesNotMatch(preview,/offerEquity|equityExpect/);
 assert.match(submit,/hireCandidate\(candidate, salary, 0\)/);
 assert.match(save,/hiredStaff:/);
 assert.match(save,/equityGrants:/);
 assert.ok(!html.includes('Salary & Equity Expectations'));
 const detail=method('showCandidateDetail');
 assert.match(detail,/Remuneração de referência/);
 assert.doesNotMatch(detail,/equityExpect/);
});
test('BMC and ticker use the local presentation labels without changing BMC IDs',()=>{
 for(const phrase of ['Canvas do Modelo de Negócio','Parceiros principais','Estrutura de custos','Fontes de receita','Mercados locais exigem atenção a caixa'])assert.ok(html.includes(phrase),phrase);
 for(const id of ['bmcKeyPartners','bmcKeyActivities','bmcValueProposition','bmcCustomerSegments','bmcRevenueStreams'])assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(html.includes('Sobre o Canvas do Modelo de Negócio'));
 assert.ok(!html.includes('About the Canvas do Modelo de Negócio'));
});

test('pre-commit review uses operational Portuguese without SaaS fundraising language',()=>{
 for(const phrase of ['Antes de concluir o trimestre','Caixa projetado baixo','Atenção distribuída','menos de um trimestre de caixa','0 trimestres','Concentre a atenção em menos frentes'])assert.ok(html.includes(phrase),phrase);
 const review=method('showPreCommitReview');
 assert.doesNotMatch(html,/0 quarters|Consider raising funding|bankruptcy risk/);
 assert.doesNotMatch(review,/Consider raising funding|bankruptcy risk|quarters|Try concentrating AP/);
});
