/* Parâmetros didáticos aprovados em 11/09/2026. Não são ofertas de crédito. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SlingshotFinance = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const TERMS = Object.freeze({
    publicBank: Object.freeze({name:'Banco público', annualRate:0.24, quarters:12, borrower:'company'}),
    family: Object.freeze({name:'Empréstimo de familiares', annualRate:0.06, quarters:8, borrower:'owner'}),
    ngo: Object.freeze({name:'Crédito de ONG elegível', annualRate:0.08, quarters:12, borrower:'company'}),
    informal: Object.freeze({name:'Agiotagem — cenário fictício', annualRate:1.20, quarters:4, borrower:'owner'})
  });
  function integer(value, label) {
    if (!Number.isSafeInteger(value) || value < 0) throw new TypeError(label + ': inteiro não negativo obrigatório.');
    return value;
  }
  function create(kind, principalCents, startQuarter, id) {
    if (!Object.hasOwn(TERMS, kind)) throw new Error('Modalidade desconhecida.');
    const terms = TERMS[kind];
    if (!terms) throw new Error('Modalidade desconhecida.');
    integer(principalCents, 'Principal'); integer(startQuarter, 'Trimestre');
    if (!principalCents || typeof id !== 'string' || !id) throw new Error('Principal e identificação obrigatórios.');
    return {id, kind, borrower:terms.borrower, principalCents, balanceCents:principalCents,
      interestArrearsCents:0, principalArrearsCents:0, startQuarter, lastSettledQuarter:startQuarter};
  }
  function due(loan, quarter) {
    if (!loan || !Object.hasOwn(TERMS, loan.kind)) throw new Error('Contrato inválido.');
    for (const field of ['principalCents','balanceCents','interestArrearsCents','principalArrearsCents','startQuarter','lastSettledQuarter']) integer(loan[field], field);
    if (!loan.principalCents || loan.balanceCents > loan.principalCents || loan.principalArrearsCents > loan.balanceCents || loan.lastSettledQuarter < loan.startQuarter) throw new Error('Saldos ou sequência do contrato inválidos.');
    integer(quarter, 'Trimestre');
    if (quarter <= loan.lastSettledQuarter) return {principalCents:0, interestCents:0, totalCents:0};
    if (quarter !== loan.lastSettledQuarter + 1) throw new Error('Apure cada trimestre em sequência.');
    const terms = TERMS[loan.kind];
    const installment = quarter - loan.startQuarter;
    const regular = installment >= terms.quarters ? loan.balanceCents : Math.floor(loan.principalCents / terms.quarters);
    const principalCents = Math.min(loan.balanceCents, regular + loan.principalArrearsCents);
    const quarterRate = Math.expm1(Math.log1p(terms.annualRate) / 4);
    const interestCents = Math.round(loan.balanceCents * quarterRate) + loan.interestArrearsCents;
    integer(interestCents + principalCents, 'Total da parcela');
    return {principalCents, interestCents, totalCents:principalCents + interestCents};
  }
  function settle(loan, quarter, availableCents) {
    integer(availableCents, 'Caixa disponível');
    const bill = due(loan, quarter);
    if (quarter <= loan.lastSettledQuarter) return {loan:{...loan}, paidCents:0, bill};
    const paidCents = Math.min(availableCents, bill.totalCents);
    const interestPaid = Math.min(paidCents, bill.interestCents);
    const principalPaid = paidCents - interestPaid;
    return {paidCents, bill, loan:{...loan,
      balanceCents:loan.balanceCents - principalPaid,
      interestArrearsCents:bill.interestCents - interestPaid,
      principalArrearsCents:bill.principalCents - principalPaid,
      lastSettledQuarter:quarter}};
  }
  // O motor original usa milhares de unidades monetárias. R$ 1 mil = 100.000 centavos.
  function gameUnitsToCents(value) {
    if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw new TypeError('Valor em milhares inválido.');
    return integer(Math.round(value*100000),'Centavos');
  }
  function centsToGameUnits(value) {return integer(value,'Centavos')/100000;}
  return Object.freeze({TERMS, create, due, settle, gameUnitsToCents, centsToGameUnits});
});
