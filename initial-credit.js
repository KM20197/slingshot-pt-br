(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./finance'):root.SlingshotFinance,typeof module==='object'&&module.exports?require('./finance-adapter'):root.SlingshotFinanceAdapter);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.SlingshotInitialCredit=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(finance,adapter){
 'use strict';
 const SOURCES=Object.freeze({brPublic:'publicBank',brFamily:'family',brNgo:'ngo',brInformal:'informal'});
 function source(id,original){
  if(!Object.hasOwn(SOURCES,id))return null;
  const kind=SOURCES[id],terms=finance.TERMS[kind];
  return {...original,id,name:terms.name,title:'Crédito didático',cash:430,val:430,equity:0,brKind:kind,
   photo:kind==='family'?'🏠':kind==='ngo'?'🤝':kind==='informal'?'⚠️':'🏦',
   desc:'Recursos próprios mais empréstimo. Consulte as parcelas antes de escolher.',
   personality:'Planeje as parcelas antes de assumir o compromisso.',
   benefits:'Crédito com condições conhecidas antes da contratação.',
   challenges:'O principal e os juros precisam ser pagos mesmo se o empreendimento não prosperar.',
   ongoing:'As parcelas serão apuradas a partir do próximo trimestre.',isFF:kind==='family',hasDebt:false,bonus:kind==='family'?{hr:1}:{}};
 }
 function quote(game,kind){
  if(!Object.hasOwn(finance.TERMS,kind))throw new Error('Modalidade desconhecida.');
  const multiplier=game.funderCashMult||1;
  const adjusted=value=>game.extremeMode?Math.round(Math.round(value*multiplier)*0.8):Math.round(value*multiplier);
  const own=adjusted(350),total=adjusted(430),principal=total-own;
  const loan=finance.create(kind,finance.gameUnitsToCents(principal),game.turn,'br-initial-credit');
  let projected=loan,totalPayments=0,firstPayment=0;
  for(let i=1;i<=finance.TERMS[kind].quarters;i++){
   const bill=finance.due(projected,game.turn+i);if(i===1)firstPayment=bill.totalCents;
   totalPayments+=bill.totalCents;projected=finance.settle(projected,game.turn+i,bill.totalCents).loan;
  }
  return {own,total,principal,loan,firstPayment:finance.centsToGameUnits(firstPayment),totalPayments:finance.centsToGameUnits(totalPayments)};
 }
 function apply(game){
  const kind=game.funder?.brKind;if(!kind)return;
  const plan=quote(game,kind);
  if(game.brLoans.some(loan=>loan.id===plan.loan.id))throw new Error('Financiamento inicial já registrado.');
  // The original selectFunder has already credited the TOTAL; only register its liability.
  const candidate={brLoans:[...game.brLoans,plan.loan]};adapter.summary(candidate);
  game.brLoans=candidate.brLoans;game.brFinanceSummary=candidate.brFinanceSummary;
  game.log('Empréstimo registrado: '+finance.TERMS[kind].name+'. Primeira parcela no trimestre '+(game.turn+1)+'.');
 }
 function begin(game,id){
  if(game.gameStarted||game.brInitialSelected)return false;
  if(id!=='personalSavings'&&!Object.hasOwn(SOURCES,id))return false;
  if(SOURCES[id]==='ngo'&&game.company?.brNgoEligible!==true)return false;
  if(!Array.isArray(game.brLoans)||game.brLoans.length)throw new Error('Carteira inicial deve estar vazia.');
  if(id!=='personalSavings'){
   const plan=quote(game,SOURCES[id]);adapter.summary({brLoans:[plan.loan]});
  }
  game.brInitialSelected=true;return true;
 }
 function render(game){
  const grid=document.getElementById('fundingStageGrid');if(!grid)return;
  grid.replaceChildren();
  const introduction=document.createElement('p');introduction.className='col-span-full text-sm text-slate-700';
  introduction.textContent='Escolha a origem dos recursos iniciais. As taxas são parâmetros didáticos, não ofertas reais. A referência de capital do original foi mantida para comparação; a calibração dos negócios brasileiros ainda está em desenvolvimento.';
  grid.append(introduction);
  const money=value=>(value*1000).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  function card(id,name,description,disabled=false){
   const element=document.createElement('button');element.type='button';element.disabled=disabled;
   element.className='hire-card border-2 border-slate-200 rounded-xl p-5 text-left bg-white';
   const title=document.createElement('strong'),text=document.createElement('p');title.textContent=name;text.textContent=description;
   element.append(title,text);element.onclick=()=>{game.fundingStage='bootstrap';game.selectFunder(id);};grid.append(element);
  }
  const own=quote(game,'family').own;
  card('personalSavings','Recursos próprios',money(own)+' de capital próprio, sem parcelas de empréstimo.');
  for(const [id,kind] of Object.entries(SOURCES)){
   const terms=finance.TERMS[kind],q=quote(game,kind);
   // Social-purpose eligibility is explicit in the venture profile, never inferred from its name.
   const eligible=kind!=='ngo'||game.company?.brNgoEligible===true;
   card(id,terms.name,money(q.own)+' próprios + '+money(q.principal)+' de empréstimo. Taxa efetiva: '+(terms.annualRate*100).toLocaleString('pt-BR')+'% ao ano; '+terms.quarters+' parcelas trimestrais. Primeira: '+money(q.firstPayment)+'; total previsto: '+money(q.totalPayments)+'. Responsabilidade: '+(terms.borrower==='owner'?'pessoal do empreendedor.':'da empresa.')+(eligible?'':' Requer empreendimento com finalidade social compatível, ainda não definido neste perfil.'),!eligible);
  }
 }
 return Object.freeze({source,quote,apply,begin,render});
});
