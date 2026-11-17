const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const isolation=require('../market-isolation');
const html=fs.readFileSync('index.html','utf8');
function method(name){
 const found=[];
 for(const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(script[1]))continue;const offset=script.index+script[0].indexOf('>')+1;
  walk.ancestor(acorn.parse(script[2],{ecmaVersion:'latest'}),{MethodDefinition(node,parents){if(node.key.name===name&&parents.some(p=>p.type==='ClassDeclaration'&&p.id?.name==='Game'))found.push(html.slice(offset+node.start,offset+node.end));}});
 }
 assert.equal(found.length,1,name);return found[0];
}
test('L3k-a hides the obsolete market controls without deleting their saved state contract',()=>{
 assert.deepEqual(isolation.operatingIds(),['avam','dream','quant','vanguard','legal','arene','voed','aether','edu','cyber','terra','sorgente']);
 assert.match(html,/<div id="sidebarMarketsCard" class="hidden /);
 assert.match(html,/<div id="competitionPanel" class="hidden /);
 assert.match(html,/data-tab="markets" aria-hidden="true" tabindex="-1">Mercados<\/button>/);
 for(const name of ['showMarketsModal','showMarketsHelpModal','showHelpTab','updateMarketsCard'])assert.match(method(name),/SlingshotMarketIsolation\.hidden\(this\)/,name);
 const save=method('saveGame'),load=method('loadGame');
 assert.match(save,/marketIntel: this\.marketIntel/);assert.match(load,/this\.marketIntel = s\.marketIntel/);
});
test('L3k-a gives every operational model no hidden legacy market advantage',()=>{
 for(const id of isolation.operatingIds())assert.equal(isolation.isolated({company:{id}}),true);
 for(const id of ['unknown',undefined])assert.equal(isolation.isolated({company:{id}}),false);
 for(const name of ['getMarketUnderstandingBonus','getMarketDecisionBonus','getAcquisitionBonus','getRetentionBonus','getExpansionBonus','applyPendingMarketInvestments','investInMarketKnowledge','investInCustomerInsights','investInAlternative'])assert.match(method(name),/SlingshotMarketIsolation\.isolated\(this\)/,name);
 assert.match(method('originalFundingReference'),/SlingshotMarketIsolation\.isolated\(this\)\) marketKnowledgeMod = 1/);
 assert.match(method('completePivotProcess'),/SlingshotMarketIsolation\.isolated\(this\)\) pivotReadiness = 0/);
 assert.match(method('renderPivotCards'),/SlingshotMarketIsolation\.isolated\(this\)/);
 for(const name of ['renderRivals','updateRivalNews','showCompetitorModal','showCompetitorDetailModal','showCompetitionHelpModal'])assert.match(method(name),/SlingshotMarketIsolation\.hidden\(this\)/,name);
 for(const name of ['simulateRivals','updateMarketConditions','showMarketShiftModal'])assert.match(method(name),/SlingshotMarketIsolation\.hidden\(this\)/,name);
 assert.match(method('triggerRandomShock'),/SlingshotMarketIsolation\.hidden\(this\)/);
 assert.match(method('commitTurn'),/SlingshotMarketIsolation\.hidden\(this\).*pendingMarketShift/s);
});
