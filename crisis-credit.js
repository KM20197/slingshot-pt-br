(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./finance'):root.SlingshotFinance,typeof module==='object'&&module.exports?require('./finance-adapter'):root.SlingshotFinanceAdapter);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.SlingshotCrisisCredit=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(finance,adapter){
 'use strict';
 const money=v=>(v*1000).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
 function quote(amount,turn){
  let loan=finance.create('informal',finance.gameUnitsToCents(amount),turn,'br-crisis-credit');
  let first=0,total=0;
  for(let i=1;i<=finance.TERMS.informal.quarters;i++){
   const bill=finance.due(loan,turn+i);if(i===1)first=bill.totalCents;
   total+=bill.totalCents;loan=finance.settle(loan,turn+i,bill.totalCents).loan;
  }
  return Object.freeze({amount,turn,firstPayment:finance.centsToGameUnits(first),totalPayments:finance.centsToGameUnits(total)});
 }
 function canResolve(game,choice){
  if(!game.gameStarted||game.failureState!=='runway_crisis'||game.crisisLifelineUsed)return false;
  if(choice==='bridge')return !(game.brLoans||[]).some(loan=>loan.id==='br-crisis-credit'||loan.brCrisis===true);
  if(choice==='layoffs')return game.hiredStaff.length>0;
  if(choice==='pivot')return game.completedMilestones.length>=1&&(game.pivotHistory?.length||0)<(game.maxPivots||2);
  if(choice==='decline')return game.metrics.cash>0;
  return choice==='shutdown';
 }
 function accept(game){
  if(!canResolve(game,'bridge'))throw new Error('O crédito emergencial não está disponível.');
  const shown=game.brCrisisOffer;
  if(!shown||shown.turn!==game.turn)throw new Error('Reabra a proposta de crédito emergencial.');
  const fresh=quote(shown.amount,game.turn);
  if(fresh.firstPayment!==shown.firstPayment||fresh.totalPayments!==shown.totalPayments)throw new Error('As condições da proposta são inconsistentes.');
  const candidate={...game,metrics:{...game.metrics},brLoans:[...(game.brLoans||[])]};
  const loan=adapter.borrow(candidate,'informal',shown.amount,'br-crisis-credit');loan.brCrisis=true;
  game.metrics.cash=candidate.metrics.cash;game.brLoans=candidate.brLoans;game.brFinanceSummary=candidate.brFinanceSummary;
  game.brCrisisOffer=null;
  return fresh;
 }
 return Object.freeze({quote,canResolve,accept,money});
});
