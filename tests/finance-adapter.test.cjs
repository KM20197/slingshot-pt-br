const {test}=require('node:test');const assert=require('node:assert/strict');
const adapter=require('../finance-adapter');const finance=require('../finance');
function game(){const g={turn:1,metrics:{cash:0}};adapter.init(g);return g;}
test('crédito de R$350 mil entra uma vez e parcela usa a mesma unidade do caixa',()=>{
 const g=game();const loan=adapter.borrow(g,'publicBank',350,'bank-1');
 assert.equal(g.metrics.cash,350);assert.equal(loan.principalCents,35000000);
 assert.equal(g.brFinanceSummary.nextPayments,finance.due(loan,2).totalCents/100000);
 const paid=adapter.settleQuarter(g,2);assert.equal(g.metrics.cash,350-paid);
 assert.equal(adapter.settleQuarter(g,2),0);
 assert.throws(()=>adapter.borrow(g,'publicBank',350,'bank-1'));
});
test('empréstimo pessoal financia o negócio e é pago uma única vez',()=>{
 const g=game();adapter.borrow(g,'family',100,'family-1');
 const bill=finance.due(g.brLoans[0],2);
 adapter.settleQuarter(g,2);assert.equal(g.metrics.cash,100-bill.totalCents/100000);
 assert.equal(g.brLoans[0].borrower,'owner');
});
test('caixa negativo não gera pagamento e atraso chega ao cálculo acadêmico',()=>{
 const g=game();adapter.borrow(g,'informal',100,'informal-1');g.metrics.cash=-2;
 adapter.settleQuarter(g,2);assert.equal(g.metrics.cash,-2);assert.ok(g.brFinanceSummary.arrears>0);
});
test('não cobra no trimestre da contratação',()=>{
 const g=game();adapter.borrow(g,'publicBank',100,'bank-1');assert.equal(adapter.settleQuarter(g,1),0);
});
test('crédito e liquidação com carteira inválida não deixam alterações parciais',()=>{
 const g=game();g.brLoans=[{kind:'BAD',id:'bad'}];
 const before=JSON.stringify(g);
 assert.throws(()=>adapter.borrow(g,'family',1,'new'));assert.equal(JSON.stringify(g),before);
 assert.throws(()=>adapter.settleQuarter(g,2));assert.equal(JSON.stringify(g),before);
});
test('previsão que excede limite seguro aborta novo crédito atomicamente',()=>{
 const g=game();const value=Number.MAX_SAFE_INTEGER/100000;
 adapter.borrow(g,'publicBank',value,'large-1');
 for(let i=2;i<15;i++){
  const before=JSON.stringify(g);
  try{adapter.borrow(g,'publicBank',value,'large-'+i);}catch{assert.equal(JSON.stringify(g),before);return;}
 }
 assert.fail('Deveria rejeitar soma de parcelas fora da faixa segura.');
});
