const fs=require('node:fs');const {calculate}=require('../academic');const {encode}=require('../result-code');
(async()=>{
 const score=calculate({milestones:[1,1,.5],completedQuarters:12,success:false,cash:60,nextOperatingCosts:80,nextDebtPayments:20,arrears:0});
 const code=await encode({version:'slingshot-br-1',formulaVersion:'1.0.0',nonce:'fixture-3-85',identificacao:'teste@example.invalid',empresa:'Clínica São João',modo:'core',data:'2026-09-14T12:00:00Z',nota:score.grade,componentes:score.components,metricas:score.inputs},'teste');
 fs.writeFileSync('artifacts/test-result.txt',code);console.log(code);
})();
