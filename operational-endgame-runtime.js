(function(root){
 'use strict';
 const text=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 const field=id=>document.getElementById(id);
 function name(game){return typeof SlingshotCompanyDisplay!=='undefined'?SlingshotCompanyDisplay.exportName(game):game?.company?.name||'Empreendimento';}
 function cash(value){return Number(value||0).toLocaleString('pt-BR',{maximumFractionDigits:0});}
 function show(game,reason){
  try{SlingshotExport?.capture(game,reason);}catch(error){console.warn('Não foi possível preparar a exportação local.',error);}
  game.closeAllModals?.();
  const failed=reason!=='allMilestones';if(failed)game.metrics.val=0;
  const info=reason==='allMilestones'?{icon:'🏁',title:'Metas concluídas',subtitle:'A operação concluiu as metas didáticas previstas.'}:reason==='bankrupt'?{icon:'💸',title:'Caixa insuficiente',subtitle:'A operação não tinha caixa suficiente para continuar neste cenário.'}:reason==='missedMilestone'?{icon:'⏰',title:'Prazo da meta encerrado',subtitle:'A operação chegou ao fim do prazo sem concluir todas as metas.'}:{icon:'📋',title:'Partida encerrada',subtitle:'A partida foi encerrada para revisão do percurso.'};
  field('endIcon').textContent=info.icon;field('endTitle').textContent=info.title;field('endSubtitle').textContent=`${name(game)} — trimestre ${game.turn||0}`;
  field('endReason').innerHTML=`<div class="flex items-start gap-3"><div class="text-2xl">${info.icon}</div><p class="text-slate-700 text-sm">${text(info.subtitle)} O resultado é didático e não representa a avaliação de um negócio real.</p></div>`;
  field('endStats').innerHTML=`<div class="bg-slate-50 rounded-lg p-3"><div class="text-slate-500 text-xs">Trimestres concluídos</div><div class="font-bold text-slate-800">${game.turn||0} de 16</div></div><div class="bg-slate-50 rounded-lg p-3"><div class="text-slate-500 text-xs">Metas concluídas</div><div class="font-bold text-slate-800">${game.completedMilestones?.length||0} de 3</div></div><div class="bg-slate-50 rounded-lg p-3"><div class="text-slate-500 text-xs">Caixa ao encerrar</div><div class="font-bold text-slate-800">R$ ${cash(game.metrics?.cash)} mil</div></div><div class="bg-slate-50 rounded-lg p-3"><div class="text-slate-500 text-xs">Equipe registrada</div><div class="font-bold text-slate-800">${game.metrics?.staff||0} pessoas</div></div>`;
  field('endPositives').innerHTML=`<div class="flex items-start gap-2 bg-emerald-50 rounded-lg p-3"><span class="text-emerald-500">✓</span><span class="text-slate-700">Você percorreu ${game.turn||0} trimestre(s) e pode usar o resultado para refletir sobre caixa, operação e metas.</span></div>`;
  field('endLessons').innerHTML=`<div class="flex items-start gap-2 bg-amber-50 rounded-lg p-3"><span class="text-amber-500">→</span><span class="text-slate-700">Compare demanda, capacidade, estoque e despesas antes de iniciar o próximo trimestre.</span></div><div class="flex items-start gap-2 bg-amber-50 rounded-lg p-3"><span class="text-amber-500">→</span><span class="text-slate-700">Revise as decisões operacionais e os contratos registrados; elas não representam recomendações para um negócio real.</span></div>`;
  field('endEncouragement').innerHTML='<div class="text-2xl mb-2">📘</div><p class="text-indigo-800 font-medium mb-1">Aprendizado da simulação</p><p class="text-indigo-600 text-sm">Inicie outra partida para testar uma combinação diferente de decisões.</p>';
  document.querySelectorAll('[href*="claude"],[onclick*="Schumpeter"],[onclick*="schumpeter"]').forEach(node=>node.remove());
  field('endModal').classList.remove('hidden');field('endModal').classList.add('flex');
  return true;
 }
 root.SlingshotOperationalEndgame=Object.freeze({show});
})(typeof globalThis!=='undefined'?globalThis:this);
