(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./finance-adapter'):root.SlingshotFinanceAdapter,typeof module==='object'&&module.exports?require('./academic'):root.SlingshotAcademic);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.SlingshotSave=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(finance,academic){
 'use strict';
 function validate(saved,companies){
  if(!saved||saved.brEdition!==1||saved.version!=='1.3')throw new Error('Arquivo incompatível com a edição brasileira.');
  if(!companies.some(c=>c.id===saved.companyId))throw new Error('Empreendimento desconhecido.');
  const q=saved.brCompletedQuarters;
  if(!Number.isInteger(saved.turn)||saved.turn<1||saved.turn>16||!Number.isInteger(q)||q<0||q>16||q>saved.turn||q<saved.turn-1)throw new Error('Contagem de trimestres inválida.');
  if(!Array.isArray(saved.brLoans))throw new Error('Carteira de contratos ausente.');
  const candidate={...saved};
  finance.summary(candidate);
  for(const loan of saved.brLoans){
   if(loan.startQuarter<1||loan.startQuarter>saved.turn||loan.lastSettledQuarter!==Math.max(loan.startQuarter,q))throw new Error('Contrato incompatível com os trimestres da partida.');
  }
  academic.fromGame(candidate,'resume');
  return true;
 }
 return Object.freeze({validate});
});
