const {test} = require('node:test');
const assert = require('node:assert/strict');
const {calculate,fromGame} = require('../academic');
const base = {milestones:[1,1,.5],completedQuarters:12,success:false,cash:60,nextOperatingCosts:80,nextDebtPayments:20,arrears:0};
test('exemplo aprovado: 3,85/5',()=>assert.equal(calculate(base).grade,3.85));
test('sucesso antecipado recebe continuidade integral',()=>assert.equal(calculate({...base,milestones:[1,1,1],success:true,completedQuarters:8,cash:100}).grade,5));
test('atraso zera somente capacidade financeira',()=>assert.equal(calculate({...base,arrears:.01,cash:100000}).grade,3.25));
test('falência preserva aprendizagem acumulada',()=>assert.equal(calculate({...base,cash:-10}).grade,3.25));
test('sem obrigações nem atraso recebe componente financeiro integral',()=>assert.equal(calculate({...base,nextOperatingCosts:0,nextDebtPayments:0,cash:0}).components.financial,1));
test('capital captado não adiciona pontos acima do limite',()=>assert.equal(calculate({...base,cash:1e9}).grade,4.25));
test('dados inválidos são rejeitados em vez de gerar nota',()=>{
  for(const invalid of [{cash:NaN},{completedQuarters:17},{nextDebtPayments:-1},{milestones:[1,1]},{success:true}]) assert.throws(()=>calculate({...base,...invalid}));
});
test('não duplica marco recém-concluído no instante da exportação',()=>{
 const result=fromGame({metrics:{cash:0,burn:10},completedMilestones:['m1'],milestone:{id:'m1'},milestoneProgress:100,turn:4,brCompletedQuarters:3},'missedMilestone');
 assert.deepEqual(result.inputs.milestones,[1,0,0]);
});
test('marco ativo usa progresso do motor sem recalcular requisitos',()=>{
 const result=fromGame({metrics:{cash:60,burn:100},completedMilestones:['m1','m2'],milestone:{id:'m3'},milestoneProgress:50,turn:13,brCompletedQuarters:12},'missedMilestone');
 assert.equal(result.grade,3.85);
});
test('rejeita array esparso, overflow e ausência de trimestres medidos',()=>{
 assert.throws(()=>calculate({...base,milestones:Array(3),success:true}));
 assert.throws(()=>calculate({...base,nextOperatingCosts:Number.MAX_VALUE,nextDebtPayments:Number.MAX_VALUE}));
 assert.throws(()=>fromGame({metrics:{cash:60,burn:100},completedMilestones:[],turn:16},'missedMilestone'));
});
test('encerramento Q16 conserva os dezesseis trimestres concluídos',()=>{
 const result=fromGame({metrics:{cash:0,burn:100},completedMilestones:[],turn:16,brCompletedQuarters:16},'missedMilestone');
 assert.equal(result.components.continuity,1);
});
test('histórico de marcos não aceita duplicatas, lacunas ou mais de três',()=>{
 const g={metrics:{cash:100,burn:10},brCompletedQuarters:0,turn:1};
 for(const ids of [['m1','m1','m1'],Array(3),['m1','m2','m3','m4'],['']])assert.throws(()=>fromGame({...g,completedMilestones:ids},'allMilestones'));
});
