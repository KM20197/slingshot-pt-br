(function(root,factory){
 const data=typeof module==='object'&&module.exports?require('./locales/people-contracts.pt-BR.json'):BR_PEOPLE_CONTRACTS_DATA;
 const api=factory(data);if(typeof module==='object'&&module.exports)module.exports=api;else root.SlingshotPeopleContracts=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(data){
 'use strict';
 const clone=value=>JSON.parse(JSON.stringify(value));
 const model=game=>data.businesses[game?.company?.id||game?.companyId]||null;
 const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 const money=value=>Number(value).toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0})+' mil';
 function enabled(game){return Boolean(model(game));}
 function state(game){return game?.brBusiness||null;}
 function validate(saved,allowUnapplied=false){
  const s=saved?.brBusiness;if(s===undefined||s===null)return true;
  const m=data.businesses[saved.companyId];
  if(!m||s.version!==data.version||s.companyId!==saved.companyId||s.applied!==true)throw new Error('Estado de pessoas e contratos incompatível.');
  if(!s.employees||!Number.isInteger(s.employees.supervisor)||s.employees.supervisor!==1||!Number.isInteger(s.employees.crew)||s.employees.crew<0||s.employees.crew>m.crew.maxCount)throw new Error('Equipe operacional inválida.');
  if(!s.contracts||!['accounting','marketing'].every(key=>typeof s.contracts[key]==='boolean'))throw new Error('Contratos operacionais inválidos.');
  const personnel=m.supervisor.quarterlyCost+s.employees.crew*m.crew.quarterlyCostEach;
  const contract=(s.contracts.accounting?m.contracts.accounting.quarterlyCost:0)+(s.contracts.marketing?m.contracts.marketing.quarterlyCost:0);
  if((!allowUnapplied&&s.costsApplied!==true)||s.quarterlyPersonnelCost!==personnel||s.quarterlyContractCost!==contract)throw new Error('Custos de pessoas e contratos incompatíveis.');
  return true;
 }
 function configure(game,contracts={accounting:true,marketing:true}){
  const m=model(game);if(!m||game.gameStarted)return false;
  const selected={accounting:contracts.accounting!==false,marketing:contracts.marketing!==false};
  const personnel=m.supervisor.quarterlyCost+m.crew.count*m.crew.quarterlyCostEach;
  const contract=(selected.accounting?m.contracts.accounting.quarterlyCost:0)+(selected.marketing?m.contracts.marketing.quarterlyCost:0);
  game.brBusiness={version:data.version,companyId:game.company.id,applied:true,employees:{supervisor:1,crew:m.crew.count},contracts:selected,quarterlyPersonnelCost:personnel,quarterlyContractCost:contract};
  return true;
 }
 function reprice(game){
  const m=model(game),s=state(game);if(!m||!s)return false;
  const personnel=m.supervisor.quarterlyCost+s.employees.crew*m.crew.quarterlyCostEach;
  const contract=(s.contracts.accounting?m.contracts.accounting.quarterlyCost:0)+(s.contracts.marketing?m.contracts.marketing.quarterlyCost:0);
  if(s.costsApplied)game.metrics.burn+=personnel+contract-s.quarterlyPersonnelCost-s.quarterlyContractCost;
  s.quarterlyPersonnelCost=personnel;s.quarterlyContractCost=contract;
  game.metrics.staff=s.employees.supervisor+s.employees.crew+1;
  return true;
 }
 function hire(game){
  const m=model(game),s=state(game);if(!m||!s||!game.gameStarted||s.employees.crew>=m.crew.maxCount)return false;
  s.employees.crew++;reprice(game);game.log('Contratação operacional: '+m.crew.label+'.');game.update?.();return true;
 }
 function dismiss(game){
  const m=model(game),s=state(game);if(!m||!s||!game.gameStarted||s.employees.crew<1)return false;
  s.employees.crew--;reprice(game);game.log('Desligamento operacional: '+m.crew.label+'.');game.update?.();return true;
 }
 function setContract(game,key,active){
  const m=model(game),s=state(game);if(!m||!s||!game.gameStarted||!Object.hasOwn(m.contracts,key))return false;
  const next=Boolean(active);if(s.contracts[key]===next)return false;
  s.contracts[key]=next;reprice(game);game.log((next?'Contrato ativado: ':'Contrato encerrado: ')+m.contracts[key].label+'.');game.update?.();return true;
 }
 function canEmergencyReduce(game){const s=state(game);return Boolean(model(game)&&s&&game.gameStarted&&(s.employees.crew>0||s.contracts.accounting||s.contracts.marketing));}
 function emergencyReduce(game){
  const m=model(game),s=state(game);if(!canEmergencyReduce(game))return null;
  const before=game.metrics.burn,changes=[];
  for(const key of ['marketing','accounting'])if(s.contracts[key]){s.contracts[key]=false;changes.push('contrato de '+m.contracts[key].label.toLowerCase());}
  if(s.employees.crew>0){s.employees.crew--;changes.push('uma pessoa de '+m.crew.label.toLowerCase());}
  reprice(game);game.update?.();return {saved:before-game.metrics.burn,changes};
 }
 function applyStart(game){
  const m=model(game),s=state(game);if(!m||!s||s.costsApplied)return false;
  validate({companyId:game.company.id,brBusiness:s},true);
  game.metrics.staff=s.employees.supervisor+s.employees.crew+1;
  game.startingStaff=game.metrics.staff;
  game.metrics.burn+=s.quarterlyPersonnelCost+s.quarterlyContractCost;
  s.costsApplied=true;
  game.log('Equipe inicial: proprietário, '+m.supervisor.label.toLowerCase()+' e '+s.employees.crew+' '+m.crew.label.toLowerCase()+'.');
  if(s.contracts.accounting)game.log('Contrato ativo: '+m.contracts.accounting.label+'.');
  if(s.contracts.marketing)game.log('Contrato ativo: '+m.contracts.marketing.label+'.');
  return true;
 }
 function capacity(game,fallback){
  const m=model(game),s=state(game);if(!m||!s)return fallback;
  return Math.max(1,Math.floor(fallback+m.supervisor.capacityBonus+s.employees.crew*m.crew.capacityEach));
 }
 function demand(game,fallback){
  const m=model(game),s=state(game);if(!m||!s||!s.contracts.marketing)return fallback;
  return Math.max(0,Math.floor(fallback+m.contracts.marketing.demandBonus));
 }
 function showManage(game){
  const m=model(game),s=state(game);if(!m||!s||!game.gameStarted)return false;
  const existing=document.getElementById('br-business-manage');if(existing)existing.remove();
  const modal=document.createElement('div');modal.id='br-business-manage';modal.className='fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[70] p-4';
  const render=()=>{modal.innerHTML='<section class="bg-white rounded-2xl max-w-xl w-full p-6"><div class="flex justify-between gap-4"><div><h2 class="text-2xl font-bold text-slate-800">Gestão de pessoas e contratos</h2><p class="mt-1 text-sm text-slate-600">Alterações passam a valer no custo trimestral imediatamente e não concedem pontos de atenção.</p></div><button id="br-manage-close" class="text-slate-500 text-2xl">×</button></div><div class="mt-5 rounded-lg border p-4"><h3 class="font-bold">'+esc(m.crew.label)+'</h3><p class="text-sm text-slate-600">'+s.employees.crew+' de até '+m.crew.maxCount+' pessoas · '+money(m.crew.quarterlyCostEach)+'/pessoa/trimestre</p><div class="mt-3 flex gap-2"><button id="br-dismiss" class="rounded bg-rose-600 px-3 py-2 text-white disabled:opacity-40" '+(s.employees.crew<1?'disabled':'')+'>Desligar uma pessoa</button><button id="br-hire" class="rounded bg-emerald-600 px-3 py-2 text-white disabled:opacity-40" '+(s.employees.crew>=m.crew.maxCount?'disabled':'')+'>Contratar uma pessoa</button></div></div><fieldset class="mt-4 space-y-3"><legend class="font-bold">Assessorias externas</legend>'+Object.entries(m.contracts).map(([key,item])=>'<label class="flex items-center justify-between gap-3 border rounded p-3"><span><strong>'+esc(item.label)+'</strong><br><small>'+money(item.quarterlyCost)+'/trimestre</small></span><input data-contract="'+key+'" type="checkbox" '+(s.contracts[key]?'checked':'')+'></label>').join('')+'</fieldset><p class="mt-4 text-sm text-slate-600">Custo atual: <strong>'+money(s.quarterlyPersonnelCost+s.quarterlyContractCost)+'/trimestre</strong>.</p></section>';
   modal.querySelector('#br-manage-close').onclick=()=>modal.remove();modal.querySelector('#br-hire').onclick=()=>{hire(game);render();};modal.querySelector('#br-dismiss').onclick=()=>{dismiss(game);render();};modal.querySelectorAll('[data-contract]').forEach(input=>input.onchange=()=>{setContract(game,input.dataset.contract,input.checked);render();});
  };render();document.body.append(modal);return true;
 }
 function showSetup(game){
  const m=model(game);if(!m)return false;
  const existing=document.getElementById('br-business-setup');if(existing)existing.remove();
  const modal=document.createElement('div');modal.id='br-business-setup';modal.className='fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[70] p-4';
  modal.innerHTML='<section class="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"><h2 class="text-2xl font-bold text-slate-800">Pessoas e contratos iniciais</h2><p class="mt-2 text-slate-600">O proprietário conduz o negócio, sem entrar na folha. Escolha contratos externos; a equipe operacional já inclui um supervisor e '+m.crew.count+' '+esc(m.crew.label.toLowerCase())+'.</p><div class="mt-4 rounded-lg border p-4"><h3 class="font-bold">Empregados</h3><p>'+esc(m.supervisor.label)+' — '+money(m.supervisor.quarterlyCost)+'/trimestre</p><p>'+m.crew.count+' '+esc(m.crew.label)+' — '+money(m.crew.count*m.crew.quarterlyCostEach)+'/trimestre</p><p class="text-sm text-slate-600 mt-2">Aumentam a capacidade operacional; não concedem pontos de atenção automaticamente.</p></div><fieldset class="mt-4 space-y-3"><legend class="font-bold">Contratos externos</legend><label class="block border rounded p-3"><input id="br-contract-accounting" type="checkbox" checked> <strong>'+esc(m.contracts.accounting.label)+'</strong> — '+money(m.contracts.accounting.quarterlyCost)+'/trimestre</label><label class="block border rounded p-3"><input id="br-contract-marketing" type="checkbox" checked> <strong>'+esc(m.contracts.marketing.label)+'</strong> — '+money(m.contracts.marketing.quarterlyCost)+'/trimestre</label></fieldset><p class="mt-4 text-sm text-slate-600">Contratos externos geram despesa recorrente, mas não são empregados nem aumentam AP.</p><div class="mt-5 flex justify-end"><button id="br-business-confirm" class="bg-indigo-600 text-white rounded px-4 py-2 font-bold">Confirmar estrutura inicial</button></div></section>';
  document.body.append(modal);
  modal.querySelector('#br-business-confirm').onclick=()=>{configure(game,{accounting:modal.querySelector('#br-contract-accounting').checked,marketing:modal.querySelector('#br-contract-marketing').checked});modal.remove();game.showMilestoneModal();};
  return true;
 }
 return Object.freeze({enabled,configure,validate,applyStart,capacity,demand,hire,dismiss,setContract,canEmergencyReduce,emergencyReduce,showSetup,showManage,data:()=>clone(data)});
});
