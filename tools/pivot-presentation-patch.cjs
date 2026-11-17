const {replaceMethod}=require('./method-patch.cjs');
function once(html,before,after,label){
 const first=html.indexOf(before);
 if(first<0||html.indexOf(before,first+before.length)>=0)throw Error('Âncora de apresentação de oportunidades ausente ou ambígua: '+label);
 return html.slice(0,first)+after+html.slice(first+before.length);
}
function apply(html){
 for(const method of ['renderCurrentMarketTab','renderAssumptionsTab'])html=replaceMethod(html,method,body=>once(body,"return '<p class=\"text-slate-500\">Market data not available for this venture.</p>';","return '<p class=\"text-slate-500\">Dados de mercado indisponíveis para este empreendimento.</p>';",'fallback sem dados de mercado em '+method));
 html=replaceMethod(html,'renderOpportunitiesTab',body=>once(body,"return '<p class=\"text-slate-500\">Market data not available for this venture.</p>';","return '<p class=\"text-slate-500\">Dados de mercado indisponíveis para este empreendimento.</p>';",'fallback sem dados de mercado'));
 html=once(html,'      const c = pivotColors[alt.pivotType] || pivotColors.customer;','      const c = pivotColors[alt.pivotType] || pivotColors.customer;\n      const pivotLabels = { customer: \'Pivot de cliente\', problem: \'Pivot de problema\', tech: \'Pivot tecnológico\' };\n      const funderLabels = { positive: \'Visão favorável de financiadores\', neutral: \'Visão neutra de financiadores\' };\n      const teamFitLabels = { dev: \'Produto\', sci: \'Pesquisa\', mkt: \'Vendas e marketing\', hr: \'Pessoas\' };','rótulos por ID');
 html=once(html,'${alt.pivotType} pivot','${pivotLabels[alt.pivotType] || alt.pivotType}','rótulo do pivot');
 html=once(html,"      const deptLabels = { dev: 'Product', sci: 'Research', mkt: 'Marketing', hr: 'People' };",'      const deptLabels = teamFitLabels;','rótulos de adequação da equipe');
 html=once(html,'<span>${funderIcons[alt.funderView]}</span>','<span>${funderIcons[alt.funderView]}</span>\n                <span class="font-medium">${funderLabels[alt.funderView] || alt.funderView}</span>','rótulo da visão de financiadores');
 for(const [before,after,label] of [
  ['const readinessLabel = readiness >= 75 ? \'Ready\' : readiness >= 50 ? \'Prepared\' : readiness >= 25 ? \'Exploring\' : readiness > 0 ? \'Starting\' : \'Unexplored\';',"const readinessLabel = readiness >= 75 ? 'Pronto' : readiness >= 50 ? 'Preparado' : readiness >= 25 ? 'Em exploração' : readiness > 0 ? 'Iniciando' : 'Não explorado';",'estados de prontidão'],
  ['🔍 Insights Unlocked','🔍 Insights desbloqueados','título de insights'],
  ['No insights yet — start exploring','Ainda não há insights — comece a explorar','estado sem insights'],
  ['Pivot Readiness','Prontidão para pivotar','título de prontidão'],
  ['👥 Team Fit','👥 Adequação da equipe','título de adequação'],
  ['<!-- Funder View -->','<!-- Visão de financiadores -->','comentário de visão de financiadores'],
  ["<span>${readiness === 0 ? 'Start Exploring' : 'Explore Further'}</span>","<span>${readiness === 0 ? 'Começar a explorar' : 'Continuar explorando'}</span>",'ação de exploração'],
  ['✓ Ready to Pivot','✓ Pronto para pivotar','estado pronto para pivotar'],
  ['📈 Exploring... (next quarter)','📈 Em exploração... (próximo trimestre)','exploração pendente'],
  ['Need 1 AP to continue','É necessário 1 ponto de atenção para continuar','atenção insuficiente']
 ]) html=once(html,before,after,label);
 return html;
}
module.exports={apply};
