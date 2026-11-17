const test=require('node:test'),assert=require('node:assert/strict');
const operations=require('../operations-runtime');
const game=id=>({company:{id},turn:1,metrics:{dev:0,hr:0,mkt:0},location:{id:'br_metropole'},revenueHistory:[]});
test('operational cash contribution is available without legacy SaaS customers',()=>{
 const g=game('dream'),ledger=operations.advance(g),revenue=operations.revenue(g);
 assert.equal(Array.isArray(g.customers),false);assert.equal(revenue.net,ledger.cashDelta);assert.ok(Number.isFinite(ledger.cashDelta));
});
test('negative operational result validates and inventory purchase is not duplicated as cash spending',()=>{
 const g=game('dream'),ledger=operations.advance(g),saved={companyId:'dream',brOperations:operations.save(g)};
 saved.brOperations.ledger.net=-10;assert.equal(operations.validate(saved),true);
 assert.equal(ledger.cashCosts,ledger.purchases+ledger.charge);
});
