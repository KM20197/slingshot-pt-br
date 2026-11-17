(function(root,factory){
 const data=typeof module==='object'&&module.exports?require('./locales/management-setup.pt-BR.json'):BR_MANAGEMENT_DATA;
 const api=factory(data);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.SlingshotManagement=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(data){
 'use strict';
 const clone=v=>JSON.parse(JSON.stringify(v));
 const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
 const money=v=>(v*1000).toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
 const pct=v=>Math.round(v*100)+'%';
 const pp=v=>(v>0?'+':'')+Math.round(v*100)+' pontos percentuais';
 const node=id=>document.getElementById(id);
 const toggle=(id,visible)=>{node(id).classList.toggle('hidden',!visible);node(id).classList.toggle('flex',visible);};
 const city=id=>data.cities.find(c=>c.id===id);
 const industry=id=>['quant','cyber','terra','sorgente'].includes(id);
 const locations=()=>clone(data.cities);
 const executives=role=>Object.values(data.executives).filter(e=>e.role===role).map(clone);
 const leader=(id,role)=>executives(role).find(e=>e.id===id);
 const stageTitle=(game,role)=>{
  const medium=(game.completedMilestones?.length||0)>0;
  return {research:medium?'Gerente Administrativo e de Qualidade':'Responsável Administrativo e de Qualidade',dev:medium?'Gerente de Operações':'Responsável por Operações',marketing:medium?'Gerente Comercial':'Responsável Comercial',hr:medium?'Gerente de Pessoas':'Responsável por Pessoas'}[role]||data.roles[role];
 };
 const salary=(game,e)=>Math.round(e.wage*(1+(game.location?.salaryMod||0)));
 const bonusText=bonus=>Object.entries(bonus).map(([k,v])=>`${esc(data.metrics[k]||k)} ${v>0?'+':''}${v}`).join(' · ');
 function terms(game,location=game.location){
  const c=city(location?.id);if(!c)return null;
  const industrial=industry(game.company?.id||game.companyId);
  const incentive=industrial&&c.industryIncentiveQuarters>0&&(game.turn||1)<=c.industryIncentiveQuarters;
  return {...c,supply:industrial?c.industrySupply:c.supply,charge:incentive?c.industryCharge:c.localCharge,
   conversion:c.conversionBonus+(industrial?(c.industryConversionBonus||0):0)};
 }
 function begin(game){
  const c=city(game.location?.id);if(!c)return;
  if(game.brManagement){validate(game);return;}
  game.brManagement={version:1,cityId:c.id,fixedCost:c.occupancy};
  game.metrics.burn+=c.occupancy;
 }
 function validate(saved){
  const state=saved.brManagement,c=city(saved.location?.id);
  if(state===undefined||state===null){if(c)throw new Error('Partida com cidade brasileira sem versão de regras.');return true;}
  if(state.version!==1||!c||state.cityId!==c.id||state.fixedCost!==c.occupancy)throw new Error('Regras de localização incompatíveis.');
  if(saved.location.salaryMod!==c.salaryMod||JSON.stringify(saved.location.bonuses)!==JSON.stringify(c.bonuses))throw new Error('Parâmetros de localização divergentes.');
  return true;
 }
 function revenue(game,gross,support,maxEfficiency){
  const t=terms(game);if(!t)return null;
  const reserve=Math.max(0,gross*(1-maxEfficiency)-support);
  const variable=support*t.supply;
  const charge=gross*t.charge;
  const total=Math.round(variable+charge+reserve),sales=Math.round(gross);
  return {gross:sales,support:total,net:sales-total,logistics:Math.round(variable-support),localCharge:Math.round(charge)};
 }
 function modifiers(game,result){
  const t=terms(game);if(t)result.conversionBonus+=t.conversion;
  return result;
 }
 function timing(game){return terms(game)?.deliveryDelay||0;}
 function hiringInterest(game){return terms(game)?.talentInterest||0;}
 function cityFacts(game,c){
  const t=terms(game,c),sign=c.salaryMod>0?'+':'';
  const industrial=industry(game.company?.id);
  return `<ul class="text-sm space-y-2"><li>Mão de obra: <strong>${sign}${pct(c.salaryMod)}</strong></li><li>Despesa de ocupação: <strong>${money(c.occupancy)}/trimestre</strong></li><li>Conversão comercial: <strong>${pp(t.conversion)}</strong></li><li>Custo de fornecimento: <strong>${pct(t.supply-1)}</strong> sobre os custos variáveis do modelo</li><li>Encargo local simulado: <strong>${pct(t.charge)} da receita</strong>${industrial&&c.industryIncentiveQuarters?' nos quatro primeiros trimestres; depois '+pct(c.localCharge):''}</li><li>Prazo adicional de entrega/faturamento: <strong>${c.deliveryDelay} trimestre(s)</strong></li><li>Interesse nas vagas: <strong>${pp(c.talentInterest)}</strong></li><li>Competências iniciais: <strong>${bonusText(c.bonuses)}</strong></li></ul>`;
 }
 function renderLocations(game){
  toggle('ventureModal',false);node('locationVentureName').textContent=typeof SlingshotCompanyDisplay!=='undefined'?SlingshotCompanyDisplay.name(game.company):game.company.name;
  node('locationGrid').innerHTML=locations().map(c=>`<section class="border-2 rounded-xl p-4 bg-white flex flex-col gap-3"><div class="text-4xl" aria-hidden="true">${c.image}</div><h3 class="font-bold text-xl">${esc(c.name)}</h3><p class="text-sm">${esc(c.description)}</p>${cityFacts(game,c)}<p class="text-xs text-slate-500">Parâmetros comparativos da simulação; não são tributos nem condições reais de mercado.</p><div class="flex gap-2 mt-auto"><button class="border rounded p-2" onclick="game.showLocationInfo('${c.id}')">Saiba mais</button><button class="bg-blue-600 text-white rounded p-2" onclick="game.selectLocation('${c.id}')" aria-label="Escolher ${esc(c.name)}">Escolher</button></div></section>`).join('');
  toggle('locationModal',true);setTimeout(()=>game.showCoachingTip('setup_location'),300);
 }
 function selectLocation(game,id){
  if(game.gameStarted||game.brInitialSelected)return false;
  const c=city(id);if(!c)return false;
  game.location=clone(c);toggle('locationModal',false);game.renderFundingStages();toggle('fundingModal',true);
  setTimeout(()=>game.showCoachingTip('setup_funding_stage'),300);return true;
 }
 function locationInfo(game,id){
  const c=city(id);if(!c)return;
  game.viewingLocationId=id;
  for(const [suffix,value]of Object.entries({Name:c.name,Region:c.region,Tagline:c.tagline,Desc:c.description}))node('locationInfo'+suffix).textContent=value;
  node('locationInfoImage').textContent=c.image;node('locationInfoSalary').textContent=(c.salaryMod>0?'+':'')+pct(c.salaryMod);
  node('locationInfoGeography').innerHTML=cityFacts(game,c);
  node('locationInfoPros').innerHTML=c.pros.map(x=>'<li>• '+esc(x)+'</li>').join('');
  node('locationInfoCons').innerHTML=c.cons.map(x=>'<li>• '+esc(x)+'</li>').join('');
  toggle('locationInfoModal',true);
 }
 function renderLeaders(game,container,role){
  const icon={research:'📋',dev:'⚙️',marketing:'📣',hr:'🗂️'}[role];
  node(container).innerHTML=executives(role).map(e=>`<section data-id="${e.id}" class="hire-card border-2 rounded-xl p-4 flex flex-col gap-3"><span class="text-4xl" aria-hidden="true">${icon}</span><h3 class="font-bold">${esc(e.name)}</h3><p>${esc(e.title)}</p><p class="text-sm">${esc(e.background)}</p><p class="text-sm text-emerald-800">${bonusText(e.bonus)}</p><p class="text-sm text-amber-800">${esc(e.cv.weaknesses.join(' '))}</p><p class="font-bold mt-auto">${money(salary(game,e))}/trimestre</p><div class="flex gap-2"><button class="border rounded p-2" onclick="game.showExecCV('${e.id}','${role}')">Ver perfil</button><button class="bg-blue-600 text-white rounded p-2" onclick="game.${role==='hr'?'selectHRExec':'selectExec'}('${e.id}'${role==='hr'?'':",'"+role+"'"})" aria-label="Contratar ${esc(e.name)}">Contratar</button></div></section>`).join('');
 }
 function selectLeader(game,id,role){
  if(game.gameStarted||!['research','dev','marketing'].includes(role))return false;
  const e=leader(id,role);if(!e)return false;
  game.team[role]=e;document.querySelectorAll?.('[data-id]').forEach(card=>{if(card.dataset.id===id)card.classList.add('border-emerald-600','bg-emerald-50','ring-2','ring-emerald-200');});game.updateHiringWizard();
  // Selection does not advance on a timer; the explicit Next button avoids duplicate transitions.
  return true;
 }
 function hiringStatus(game){
  const selected=['research','dev','marketing'].map(r=>game.team[r]).filter(Boolean);
  node('equityCommitted').textContent='Folha inicial: '+money(selected.reduce((sum,e)=>sum+salary(game,e),0))+'/trimestre';
 }
 function showHR(game){if(!game.gameStarted||game.team.hr||!game.completedMilestones?.length)return;renderLeaders(game,'hrHires','hr');toggle('hrModal',true);}
 function hireHR(game,id){
  if(!game.gameStarted||game.team.hr||!game.completedMilestones?.length)return false;
  const e=leader(id,'hr');if(!e)return false;
  const wage=salary(game,e);game.team.hr={...e,wage,originalWage:e.wage};game.moods.hr=1;game.metrics.burn+=wage;
  for(const [k,v]of Object.entries(e.bonus))if(Number.isFinite(game.metrics[k]))game.metrics[k]+=v;
  game.maxAP=game.baseAP+1;
  game.log('Gerente de Pessoas contratado: '+e.name+'. '+money(wage)+'/trimestre. Capacidade: '+game.maxAP+' pontos de atenção.');
  toggle('hrModal',false);game.showMilestoneModal();return true;
 }
 function cv(game,id,role){
  const e=leader(id,role);if(!e)return;
  game.viewingExecId=id;game.viewingExecRole=role;
  node('execCVModal').innerHTML=`<section class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"><button class="float-right border rounded p-2" onclick="game.hideExecCV()" aria-label="Fechar perfil">Fechar</button><h2 class="font-bold text-xl">${esc(e.name)}</h2><p>${esc(data.roles[role])}</p><h3 class="font-bold mt-4">Formação</h3><p>${esc(e.cv.education)}</p>${[['Experiência',e.cv.experience],['Pontos fortes',e.cv.strengths],['Fique atento',e.cv.weaknesses]].map(([title,items])=>`<h3 class="font-bold mt-4">${title}</h3><ul>${items.map(x=>'<li>• '+esc(x)+'</li>').join('')}</ul>`).join('')}<h3 class="font-bold mt-4">Efeitos na simulação</h3><p>${bonusText(e.bonus)}</p><p class="mt-4 font-bold">${money(salary(game,e))}/trimestre</p><p class="text-sm">Remuneração salarial. O custo local já está incluído. Sem cessão de participação societária.</p></section>`;
  toggle('execCVModal',true);
 }
 function milestoneAdvice(game,stages,completed){
  const panel=node('milestoneAdvisorPanel'),choices=stages[['m1','m2','m3'][completed]]||[];
  panel.classList.remove('hidden');
  panel.innerHTML='<section class="bg-indigo-50 rounded-xl p-4"><h3 class="font-bold">Planeje com a equipe</h3><p>Compare os indicadores atuais com os requisitos de cada meta. Esta comparação não garante conclusão; decisões, prazo e recursos continuam determinantes.</p>'+choices.map(m=>'<p class="mt-3"><strong>'+esc(m.name)+'</strong>: '+Object.entries(m.threshold||{}).map(([key,value])=>esc(data.metrics[key]||key)+' '+Math.round(game.metrics[key]||0)+' / '+value).join(' · ')+'</p>').join('')+'<p class="mt-3">O aumento na avaliação não entra no caixa. O bônus didático de caixa indicado no card é uma recompensa separada.</p></section>';
 }
 function fundingHelp(){
  node('fundingPathwayHelpModal').innerHTML=`<section class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"><h2 class="text-xl font-bold">Entendendo os caminhos de financiamento</h2><p class="mt-3">Compare o dinheiro disponível hoje com as obrigações futuras. Nesta versão, os empréstimos não cedem participação no negócio.</p><h3 class="font-bold mt-4">Recursos próprios</h3><p>Capital do próprio empreendedor, sem parcelas de empréstimo. Cartão de crédito e dinheiro emprestado por familiares são dívidas, mesmo quando não há banco envolvido. O limite é o caixa disponível.</p><h3 class="font-bold mt-4">Crédito e financiamento</h3><p>O principal e os juros precisam ser pagos mesmo quando as vendas ficam abaixo do esperado. A primeira parcela vence no trimestre seguinte. As condições abaixo são didáticas, não ofertas reais.</p><ul class="my-3 space-y-2"><li>Banco público: 24% ao ano; 12 trimestres; responsabilidade da empresa.</li><li>Familiares: 6% ao ano; 8 trimestres; responsabilidade pessoal.</li><li>ONG elegível: 8% ao ano; 12 trimestres; finalidade compatível exigida.</li><li>Crédito informal de alto risco: 120% ao ano; 4 trimestres; responsabilidade pessoal.</li></ul><p>Compare o total a pagar e a parcela inicial mostrados na proposta. Linhas de fomento podem exigir finalidade específica; não se presume elegibilidade pelo nome do empreendimento.</p><h3 class="font-bold mt-4">Sócio investidor</h3><p>O material de referência descreve essa alternativa. Ela não está disponível nesta versão: a regra aprovada para os pequenos negócios usa capital próprio e dívida, sem diluição societária.</p><h3 class="font-bold mt-4">Por que a escolha importa</h3><p>Ela altera o caixa, os juros, os prazos e quem responde pela dívida. Propriedade e avaliação do negócio não aumentam automaticamente porque entrou um empréstimo.</p><button class="mt-5 bg-indigo-600 text-white rounded p-3" onclick="game.closeFundingPathwayHelp()">Entendi</button></section>`;
  toggle('fundingPathwayHelpModal',true);
 }
 return Object.freeze({locations,executives,terms,begin,validate,revenue,modifiers,timing,hiringInterest,renderLocations,selectLocation,locationInfo,renderLeaders,selectLeader,hiringStatus,showHR,hireHR,cv,milestoneAdvice,fundingHelp,money,roleTitle:stageTitle,roles:data.roles,metrics:data.metrics});
});
