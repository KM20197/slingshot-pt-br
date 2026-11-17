const {replaceMethod}=require('./method-patch.cjs');

function once(html,before,after,label){
 const first=html.indexOf(before);
 if(first<0||html.indexOf(before,first+before.length)>=0)throw new Error('Âncora L3d ausente ou ambígua: '+label);
 return html.slice(0,first)+after+html.slice(first+before.length);
}
function prefix(body,anchor,addition,label){
 const first=body.indexOf(anchor);
 if(first<0||body.indexOf(anchor,first+anchor.length)>=0)throw new Error('Âncora L3d ausente ou ambígua em '+label);
 return body.slice(0,first)+addition+body.slice(first);
}
function exact(body,before,after,label){
 const first=body.indexOf(before);
 if(first<0||body.indexOf(before,first+before.length)>=0)throw new Error('Âncora L3d ausente ou ambígua em '+label);
 return body.slice(0,first)+after+body.slice(first+before.length);
}
function apply(html){
 html=once(html,'<div id="sidebarMarketsCard" class="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-xl shadow-lg p-4 border-2 border-teal-400 text-white">','<div id="sidebarMarketsCard" class="hidden bg-gradient-to-br from-teal-600 to-emerald-700 rounded-xl shadow-lg p-4 border-2 border-teal-400 text-white" aria-hidden="true">','cartão de mercados');
 html=once(html,'<button onclick="game.showHelpTab(\'markets\')" class="help-tab px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 border-b-2 border-transparent whitespace-nowrap" data-tab="markets">Mercados</button>','<button onclick="game.showHelpTab(\'markets\')" class="hidden help-tab px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 border-b-2 border-transparent whitespace-nowrap" data-tab="markets" aria-hidden="true" tabindex="-1">Mercados</button>','aba de ajuda');
 html=once(html,'      <!-- Competition - Compact -->\n      <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm p-3 border border-blue-200">','      <!-- Concorrência legada: preservada no original, mas não exibida nesta edição. -->\n      <div id="competitionPanel" class="hidden bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm p-3 border border-blue-200" aria-hidden="true">','cartão de concorrência');
 html=replaceMethod(html,'showMarketsModal',body=>prefix(body,'    // Initialize market intel for this venture if not done','    if (typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.hidden(this)) return;\n','showMarketsModal'));
 html=replaceMethod(html,'showMarketsHelpModal','    if (typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.hidden(this)) return;\n    document.getElementById("marketsHelpModal").classList.remove("hidden");\n    document.getElementById("marketsHelpModal").classList.add("flex");');
 html=replaceMethod(html,'showHelpTab',body=>prefix(body,'    // Hide all content','    if (tabId === \'markets\' && typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.hidden(this)) return;\n','showHelpTab'));
 html=replaceMethod(html,'updateMarketsCard',body=>prefix(body,'    const vm = VENTURE_MARKETS[this.company?.id];','    if (typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.hidden(this)) return;\n','updateMarketsCard'));
 html=replaceMethod(html,'applyPendingMarketInvestments',body=>prefix(body,'    if (!this.pendingMarketInvestments) return;','    if (typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.isolated(this)) {\n      this.pendingMarketInvestments = { knowledge: 0, insights: 0, alternatives: {} };\n      return;\n    }\n','applyPendingMarketInvestments'));
 html=replaceMethod(html,'getMarketUnderstandingBonus',body=>prefix(body,'    // AN-15: Ensure defaults to prevent NaN from null market intel','    if (typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.isolated(this)) return 0;\n','getMarketUnderstandingBonus'));
 html=replaceMethod(html,'getMarketDecisionBonus',body=>prefix(body,'    const knowledge = this.marketIntel?.currentKnowledge || 0;','    if (typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.isolated(this)) return 0;\n','getMarketDecisionBonus'));
 html=replaceMethod(html,'getAcquisitionBonus',body=>prefix(body,'    const knowledge = this.marketIntel?.currentKnowledge || 0;','    if (typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.isolated(this)) return 0;\n','getAcquisitionBonus'));
 for(const name of ['getRetentionBonus','getExpansionBonus'])html=replaceMethod(html,name,body=>prefix(body,'    const insights = this.marketIntel?.currentInsights || 0;','    if (typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.isolated(this)) return 0;\n',name));
 for(const name of ['investInMarketKnowledge','investInCustomerInsights'])html=replaceMethod(html,name,body=>prefix(body,'    // Ensure marketIntel is initialized',"    if (typeof SlingshotMarketIsolation !== 'undefined' && SlingshotMarketIsolation.isolated(this)) return false;\n",name));
 html=replaceMethod(html,'investInAlternative',body=>prefix(body,'    // Check if already invested in this alternative',"    if (typeof SlingshotMarketIsolation !== 'undefined' && SlingshotMarketIsolation.isolated(this)) return false;\n",'investInAlternative'));
 html=replaceMethod(html,'originalFundingReference',body=>{
  body=exact(body,'    const marketKnowledgeMod = Math.min(1.1, combinedKnowledge > 20\n      ? 1 + ((combinedKnowledge - 20) / 80) * 0.1  // Up to 10% boost\n      : 1.0);','    let marketKnowledgeMod = Math.min(1.1, combinedKnowledge > 20\n      ? 1 + ((combinedKnowledge - 20) / 80) * 0.1  // Up to 10% boost\n      : 1.0);\n    if (typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.isolated(this)) marketKnowledgeMod = 1;','originalFundingReference');
  return body;
 });
 html=replaceMethod(html,'completePivotProcess',body=>exact(body,'    }\n    \n    // Base penalties - reduced by up to 50% with full preparation','    }\n    if (typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.isolated(this)) pivotReadiness = 0;\n    \n    // Base penalties - reduced by up to 50% with full preparation','completePivotProcess'));
 html=replaceMethod(html,'renderPivotCards',body=>exact(body,'    const _vmPrep = (typeof VENTURE_MARKETS !== \'undefined\' && VENTURE_MARKETS[this.company?.id]) || null;','    const _vmPrep = !(typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.isolated(this)) && (typeof VENTURE_MARKETS !== \'undefined\' && VENTURE_MARKETS[this.company?.id]) || null;','renderPivotCards'));
 html=replaceMethod(html,'renderRivals',body=>prefix(body,'    const playerTotal = this.metrics.sci + this.metrics.dev + this.metrics.mkt;',"    if (typeof SlingshotMarketIsolation !== 'undefined' && SlingshotMarketIsolation.hidden(this)) {\n      for (const id of ['rivalsList', 'rivalsListLeft', 'rivalNews', 'rivalNewsLeft']) { const node = document.getElementById(id); if (node) { node.innerHTML = ''; node.classList.add('hidden'); } }\n      for (const id of ['playerRank', 'playerRankLeft']) { const node = document.getElementById(id); if (node) node.textContent = ''; }\n      return;\n    }\n",'renderRivals'));
 html=replaceMethod(html,'updateRivalNews',body=>prefix(body,'    const newsEl = document.getElementById("rivalNews");',"    if (typeof SlingshotMarketIsolation !== 'undefined' && SlingshotMarketIsolation.hidden(this)) return;\n",'updateRivalNews'));
 for(const name of ['showCompetitorModal','showCompetitorDetailModal','showCompetitionHelpModal'])html=replaceMethod(html,name,body=>prefix(body,body.match(/^\s*[^\n]*/)?.[0]||'',"    if (typeof SlingshotMarketIsolation !== 'undefined' && SlingshotMarketIsolation.hidden(this)) return;\n",name));
 for(const name of ['simulateRivals','updateMarketConditions'])html=replaceMethod(html,name,body=>prefix(body,body.match(/^\s*[^\n]*/)?.[0]||'',"    if (typeof SlingshotMarketIsolation !== 'undefined' && SlingshotMarketIsolation.hidden(this)) { this.pendingMarketShift = []; return; }\n",name));
 html=replaceMethod(html,'showMarketShiftModal',body=>prefix(body,body.match(/^\s*[^\n]*/)?.[0]||'',"    if (typeof SlingshotMarketIsolation !== 'undefined' && SlingshotMarketIsolation.hidden(this)) { this.pendingMarketShift = []; return; }\n",'showMarketShiftModal'));
 html=replaceMethod(html,'triggerRandomShock',body=>prefix(body,body.match(/^\s*[^\n]*/)?.[0]||'',"    if (typeof SlingshotMarketIsolation !== 'undefined' && SlingshotMarketIsolation.hidden(this)) return;\n",'triggerRandomShock'));
 html=replaceMethod(html,'commitTurn',body=>exact(body,'    if (this.pendingMarketShift.length > 0 && this.milestone) {','    if (!(typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.hidden(this)) && this.pendingMarketShift.length > 0 && this.milestone) {','commitTurn'));
 html=replaceMethod(html,'commitTurn',body=>body.replace(/    if \(!_msImminent && this\.turn >= 2 && this\.turn <= 14 &&\r?\n        \(forceTokenShock \|\| Math\.random\(\) < 0\.15\) && !this\.pendingShock\) \{/,'    if (!(typeof SlingshotMarketIsolation !== \'undefined\' && SlingshotMarketIsolation.hidden(this)) && !_msImminent && this.turn >= 2 && this.turn <= 14 &&\n        (forceTokenShock || Math.random() < 0.15) && !this.pendingShock) {'));
 return html;
}
module.exports={apply};
