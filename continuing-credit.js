(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./finance'):root.SlingshotFinance,typeof module==='object'&&module.exports?require('./finance-adapter'):root.SlingshotFinanceAdapter);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.SlingshotContinuingCredit=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(finance,adapter){
 'use strict';
 let dialog;
 const money=v=>(v*1000).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
 function options(game,reference){
  if(!game.gameStarted||game.failureState||!Array.isArray(game.completedMilestones))return [];
  const stage=game.completedMilestones.length;
  if(stage>=3||game.brCompletedQuarters>=16||(Number.isInteger(game.lastRaiseMilestoneCount)&&stage<=game.lastRaiseMilestoneCount))return [];
  const loans=game.brLoans||[];const summary=adapter.summary({brLoans:loans});
  if(loans.some(loan=>loan.brRoundStage===stage))return [];
  // Keep the original money calculation as a reference, not its equity mechanism.
  const basis=reference.find(option=>option.id==='fof_fff');
  if(!basis||!Number.isFinite(basis.cash)||basis.cash<=0)return [];
  return Object.entries(finance.TERMS).filter(([kind])=>{
   if(kind==='ngo'&&game.company?.brNgoEligible!==true)return false;
   if(kind==='family'&&loans.some(loan=>loan.kind==='family'&&loan.brRoundStage!==undefined))return false;
   return summary.arrears===0||kind==='informal';
  }).map(([kind,terms])=>{
   const id='br-round-'+stage+'-'+kind;
   let loan=finance.create(kind,finance.gameUnitsToCents(basis.cash),game.turn,id);
   let firstPayment=0,totalPayments=0;
   for(let i=1;i<=terms.quarters;i++){
    const bill=finance.due(loan,game.turn+i);if(i===1)firstPayment=bill.totalCents;
    totalPayments+=bill.totalCents;loan=finance.settle(loan,game.turn+i,bill.totalCents).loan;
   }
   return {id,kind,stage,cash:basis.cash,name:terms.name,annualRate:terms.annualRate,quarters:terms.quarters,borrower:terms.borrower,firstPayment:finance.centsToGameUnits(firstPayment),totalPayments:finance.centsToGameUnits(totalPayments)};
  });
 }
 function accept(game,id,reference){
  const offer=options(game,reference).find(item=>item.id===id);
  if(!offer)throw new Error('Esta proposta não está disponível para a situação atual da partida.');
  const candidate={...game,metrics:{...game.metrics},brLoans:[...(game.brLoans||[])]};
  const loan=adapter.borrow(candidate,offer.kind,offer.cash,offer.id);loan.brRoundStage=offer.stage;
  // Commit only after the contract and complete portfolio have been validated.
  game.metrics.cash=candidate.metrics.cash;game.brLoans=candidate.brLoans;game.brFinanceSummary=candidate.brFinanceSummary;
  game.lastRaiseMilestoneCount=offer.stage;game.fundingAPCost=1;
  if(game.funder?.stage==='bootstrap'&&game.funder?.apMod<0&&!game.hasRaisedExternal){game.maxAP=game.baseAP;game.hasRaisedExternal=true;}
  return offer;
 }
 function open(game){
  if(dialog?.open)dialog.close();
  if(!dialog){dialog=document.createElement('dialog');dialog.id='br-credit-dialog';dialog.style.cssText='width:min(94vw,850px);max-height:90vh;padding:24px;border-radius:16px;background:white;color:#18352c';document.body.append(dialog);}
  dialog.replaceChildren();
  const title=document.createElement('h2');title.textContent='Financiamento e compromissos';title.style.cssText='font-size:24px;font-weight:bold';dialog.append(title);
  const intro=document.createElement('p');intro.textContent='Uma contratação por etapa de desenvolvimento, com custo de 1 ponto de atenção. Taxas didáticas fixas; a primeira parcela vence no próximo trimestre. O principal usa a referência de captação do motor original, ainda sujeita à calibração brasileira.';dialog.append(intro);
  const summary=adapter.summary(game),balance=document.createElement('p');balance.textContent='Parcelas já previstas para o próximo trimestre: '+money(summary.nextPayments)+'. Valores vencidos: '+money(summary.arrears)+'.';dialog.append(balance);
  const status=document.createElement('p');status.setAttribute('role','status');
  const offers=game.generateFundingOptions();
  if(!offers.length){const note=document.createElement('p');note.textContent='Não há propostas disponíveis. Verifique os compromissos em atraso, conclua a crise atual ou avance para o próximo marco de desenvolvimento.';dialog.append(note);}
  for(const offer of offers){
   const card=document.createElement('section');card.style.cssText='padding:16px;margin-top:12px;border:1px solid #a2bbb1;border-radius:10px';
   const heading=document.createElement('h3');heading.textContent=offer.name;heading.style.fontWeight='bold';
   const details=document.createElement('p');details.textContent='Crédito: '+money(offer.cash)+'. Taxa efetiva: '+(offer.annualRate*100).toLocaleString('pt-BR')+'% ao ano, em '+offer.quarters+' trimestres. Primeira parcela: '+money(offer.firstPayment)+'. Total previsto sem atrasos: '+money(offer.totalPayments)+'. Responsabilidade: '+(offer.borrower==='owner'?'pessoal do empreendedor.':'da empresa.');
   const button=document.createElement('button');button.type='button';button.textContent='Contratar '+offer.name;button.style.cssText='padding:10px;background:#185c46;color:white;border-radius:6px';
   button.onclick=()=>{button.disabled=true;try{game.acceptFunding(offer.id);}catch(error){status.textContent=error.message;button.disabled=false;}};
   card.append(heading,details,button);dialog.append(card);
  }
  dialog.append(status);const closeButton=document.createElement('button');closeButton.type='button';closeButton.textContent='Fechar';closeButton.style.padding='12px';closeButton.onclick=close;dialog.append(closeButton);dialog.showModal();
 }
 function close(){dialog?.close();}
 return Object.freeze({options,accept,open,close});
});
