const {replaceMethod}=require('./method-patch.cjs');
function once(body,before,after){
 if(!body.includes(before)||body.indexOf(before)!==body.lastIndexOf(before))throw new Error('Âncora da crise ausente ou ambígua: '+before);
 return body.replace(before,after);
}
function apply(html){
 html=replaceMethod(html,'showCrisisModal',body=>{
  body=once(body,'    this.closeAllModals();','    SlingshotContinuingCredit.close();\n    this.closeAllModals();');
  body=once(body,'    const bridgeTerms = Math.min(30, 18 + Math.floor(Math.random() * 12)); // 18-30% dilution','    // Condições didáticas de crédito emergencial aprovadas para a edição brasileira.');
  body=once(body,'    this._crisisBridgeTerms = bridgeTerms; // resolveCrisis must charge the terms SHOWN, not re-roll','    this.brCrisisOffer = SlingshotCrisisCredit.quote(bridgeAmount, this.turn);');
  body=once(body,'class="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"','class="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl" style="max-height:calc(100vh - 2rem);overflow-y:auto"');
  const texts={
   'Complete M1 first':'Conclua o primeiro marco', 'No pivots remaining':'Mudanças de direção esgotadas',
   'RUNWAY CRISIS':'CRISE DE CAIXA',
   'Your company has ${runway} quarters of cash remaining.':"O caixa da empresa cobre ${Number(runway).toLocaleString('pt-BR')} trimestres de operação, antes das parcelas de empréstimos.",
   '⚠️ This is your one lifeline. After this, the company fails only if it runs out of cash.':'⚠️ Esta é sua única oportunidade de recuperação. Depois dela, a falta de caixa encerra a empresa.',
   'Every startup gets one chance to recover from disaster.':'Cada empresa dispõe de uma oportunidade de recuperação.',
   "Choose wisely—there won't be another.":'Avalie os efeitos de cada alternativa.',
   'Emergency Investor Bailout':'Empréstimo pessoal emergencial',
   'Existing investors bail you out on tough terms.':'Agiotagem fictícia: responsabilidade pessoal, taxa efetiva didática de 120% ao ano, em 4 trimestres. Primeira parcela no próximo trimestre: ${SlingshotCrisisCredit.money(this.brCrisisOffer.firstPayment)}. Total sem atrasos: ${SlingshotCrisisCredit.money(this.brCrisisOffer.totalPayments)}.',
   '+${region.currency}${bridgeAmount}k cash':'+${SlingshotCrisisCredit.money(bridgeAmount)} no caixa',
   '−${bridgeTerms}% equity':'Dívida pessoal registrada',
   'Investor mood −1':'Parcelas a partir do próximo trimestre',
   '>Emergency Layoffs<':'>Redução emergencial da equipe<',
   'Cut staff and costs drastically.':'Reduza a equipe e os custos.',
   '(No staff to lay off)':'(Sem funcionários para desligar)',
   '+${region.currency}50k emergency cash':'+${SlingshotCrisisCredit.money(50)} de caixa liberado',
   '−${region.currency}${layoffSavings}k/q burn':'−${SlingshotCrisisCredit.money(layoffSavings)}/trimestre de despesas',
   '−2 team morale':'−2 no ânimo da equipe',
   'Desperate Pivot':'Mudança emergencial de direção',
   'Abandon current progress and restart your milestone with a leaner approach.':'Reduza o progresso atual e reinicie o marco com uma abordagem mais enxuta.',
   '(Not available)':'(Indisponível)',
   '−50% all stats':'−50% nos atributos',
   '−70% milestone progress':'−70% no progresso do marco',
   'Fresh start':'Novo começo',
   'Hold Your Nerve':'Prosseguir com o caixa atual',
   'Decline the rescue. You have a plan, or you think you do.':'Recuse a ajuda e execute seu plano de recuperação.',
   'No dilution, no layoffs':'Sem novo empréstimo ou desligamentos',
   'Run out of cash and the company fails':'A falta de caixa encerra a empresa',
   'Accept defeat and wind down the company':'Encerrar as atividades da empresa'
  };
  for(const [before,after] of Object.entries(texts))body=once(body,before,after);
  return body;
 });
 html=replaceMethod(html,'resolveCrisis',body=>{
  body='\n    if (!SlingshotCrisisCredit.canResolve(this, choice)) return;\n    if (choice === "bridge") SlingshotCrisisCredit.accept(this);\n'+body;
  const start=body.indexOf("      case 'bridge':"),end=body.indexOf("      case 'layoffs':",start);
  if(start<0||end<0)throw new Error('Ramo de crédito emergencial ausente.');
  body=body.slice(0,start)+`      case 'bridge':
        this.log('🆘 Empréstimo pessoal emergencial contratado. As parcelas começam no próximo trimestre.');
        UIEffects.showToast('Crédito emergencial registrado', 'bad', '💸');
        this.journeyEvents.push({turn: this.turn, type: 'crisis_bridge', desc: 'Recuperação com empréstimo pessoal emergencial: taxa didática de 120% ao ano por 4 trimestres.'});
        break;

`+body.slice(end);
  return body;
 });
 return html;
}
module.exports={apply};
