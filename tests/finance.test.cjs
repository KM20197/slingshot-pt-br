const {test} = require('node:test');
const assert = require('node:assert/strict');
const {TERMS,create,due,settle} = require('../finance');
const {gameUnitsToCents,centsToGameUnits}=require('../finance');
test('converte milhares do motor e centavos sem multiplicar dívida indevidamente',()=>{
 assert.equal(gameUnitsToCents(350),35000000);assert.equal(centsToGameUnits(35000000),350);
 assert.equal(centsToGameUnits(gameUnitsToCents(.001)),.001);
 assert.throws(()=>gameUnitsToCents(Number.MAX_VALUE));assert.throws(()=>gameUnitsToCents(-1));
});
test('taxa trimestral equivalente à anual aprovada, sem divisão simples por quatro',()=>{
 const bill=due(create('publicBank',10000000,1,'a'),2);
 assert.equal(bill.interestCents,Math.round(10000000*(Math.pow(1.24,.25)-1)));
});
test('todas as modalidades amortizam integralmente sem emissão de ações',()=>{
 for(const kind of Object.keys(TERMS)){
  let loan=create(kind,10000003,1,kind), principal=0;
  for(let q=2;q<=TERMS[kind].quarters+1;q++) {const result=settle(loan,q,1e9); principal+=result.bill.principalCents;loan=result.loan;}
  assert.equal(loan.balanceCents,0);assert.equal(principal,10000003);assert.equal(loan.interestArrearsCents,0);
 }
});
test('não cobra duas vezes no mesmo trimestre',()=>{
 const once=settle(create('family',100000,1,'f'),2,100000);
 const twice=settle(once.loan,2,100000);
 assert.equal(twice.paidCents,0);assert.deepEqual(twice.loan,once.loan);
});
test('pagamento insuficiente registra atraso e preserva saldo',()=>{
 const result=settle(create('informal',100000,1,'i'),2,0);
 assert.equal(result.loan.balanceCents,100000);assert.equal(result.loan.principalArrearsCents,25000);assert.ok(result.loan.interestArrearsCents>0);
});
test('obrigações pessoais e empresariais são identificadas separadamente',()=>{
 assert.equal(create('family',100,1,'f').borrower,'owner');assert.equal(create('ngo',100,1,'n').borrower,'company');
});
test('não permite pular trimestres nem principal negativo',()=>{
 assert.throws(()=>due(create('family',100,1,'f'),3));assert.throws(()=>create('family',-100,1,'f'));
});
test('rejeita modalidades herdadas e contratos corrompidos',()=>{
 for(const kind of ['toString','constructor','__proto__']) assert.throws(()=>create(kind,100,1,'x'));
 const loan=create('publicBank',100000,1,'x');
 for(const invalid of [{balanceCents:NaN},{balanceCents:100001},{principalArrearsCents:100001},{lastSettledQuarter:0}]) assert.throws(()=>due({...loan,...invalid},2));
});
