/* Integração de dívida com o motor em milhares de reais. */
(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./finance'):root.SlingshotFinance);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.SlingshotFinanceAdapter=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(finance){
 'use strict';
 function init(game){game.brLoans=[];game.brFinanceSummary={nextPayments:0,arrears:0};}
 function forecast(loans){
  if(!Array.isArray(loans))throw new Error('Carteira de contratos inválida.');
  if(loans.some(loan=>!loan||typeof loan.id!=='string'||!loan.id)||new Set(loans.map(loan=>loan.id)).size!==loans.length)throw new Error('Contratos ausentes ou duplicados.');
  let nextPayments=0,arrears=0;
  for(const loan of loans){
   const bill=finance.due(loan,loan.lastSettledQuarter+1);
   nextPayments+=bill.totalCents;
   arrears+=loan.interestArrearsCents+loan.principalArrearsCents;
  }
  return {nextPayments:finance.centsToGameUnits(nextPayments),arrears:finance.centsToGameUnits(arrears)};
 }
 function summary(game){
  const result=forecast(game.brLoans||[]);
  game.brFinanceSummary=result;return result;
 }
 function borrow(game,kind,amount,id){
  const loans=game.brLoans||[];
  forecast(loans);
  if(loans.some(loan=>loan.id===id))throw new Error('Este contrato já foi registrado.');
  const cents=finance.gameUnitsToCents(amount);
  const loan=finance.create(kind,cents,game.turn,id);
  const cash=game.metrics.cash+finance.centsToGameUnits(cents);
  if(!Number.isFinite(cash))throw new Error('Caixa inválido.');
  const nextLoans=[...loans,loan];const nextSummary=forecast(nextLoans);
  game.brLoans=nextLoans;game.metrics.cash=cash;game.brFinanceSummary=nextSummary;return loan;
 }
 function settleQuarter(game,quarter){
  if(!Number.isSafeInteger(quarter)||quarter<0)throw new Error('Trimestre inválido.');
  let available=finance.gameUnitsToCents(Math.max(0,game.metrics.cash));
  forecast(game.brLoans||[]);
  let totalPaid=0;
  const loans=(game.brLoans||[]).map(loan=>{
   if(quarter<=loan.startQuarter||quarter<=loan.lastSettledQuarter)return {...loan};
   const result=finance.settle(loan,quarter,available);
   available-=result.paidCents;totalPaid+=result.paidCents;
   return result.loan;
  });
  // Atomic commit: invalid contracts above do not partially mutate game cash.
  const nextSummary=forecast(loans);
  game.brLoans=loans;
  game.metrics.cash-=finance.centsToGameUnits(totalPaid);
  game.brFinanceSummary=nextSummary;
  return finance.centsToGameUnits(totalPaid);
 }
 return Object.freeze({init,summary,borrow,settleQuarter});
});
