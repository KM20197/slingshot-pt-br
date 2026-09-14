const test=require('node:test'),assert=require('node:assert/strict');
const save=require('../save-validation'),finance=require('../finance');
const companies=[{id:'clinic'}];
const base=()=>({brEdition:1,version:'1.3',companyId:'clinic',turn:1,brCompletedQuarters:0,brLoans:[],metrics:{cash:100,burn:10},completedMilestones:[],milestone:{id:'m1'},milestoneProgress:0});
test('save validation is read-only and accepts start and Q16',()=>{
 const s=base(),before=JSON.stringify(s);assert.equal(save.validate(s,companies),true);assert.equal(JSON.stringify(s),before);
 s.turn=16;s.brCompletedQuarters=16;assert.equal(save.validate(s,companies),true);
});
test('rejects incompatible edition, impossible quarter counts and malformed grade',()=>{
 for(const fields of [{brEdition:0},{turn:17},{brCompletedQuarters:17},{turn:9},{companyId:'missing'},{completedMilestones:['m1','m1']},{metrics:{cash:null,burn:10}}]){
  const s={...base(),...fields},before=JSON.stringify(s);assert.throws(()=>save.validate(s,companies));assert.equal(JSON.stringify(s),before);
 }
});
test('rejects stale or future loans before restoration',()=>{
 const s=base();s.turn=3;s.brCompletedQuarters=2;s.brLoans=[finance.create('family',100000,1,'loan1')];
 assert.throws(()=>save.validate(s,companies),/Contrato incompatível/);
 s.brLoans=[finance.settle(s.brLoans[0],2,100000).loan];assert.equal(save.validate(s,companies),true);
 s.brLoans=[finance.create('family',100000,4,'future')];assert.throws(()=>save.validate(s,companies),/Contrato incompatível/);
});
