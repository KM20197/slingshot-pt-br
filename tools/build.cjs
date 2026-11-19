const fs=require('node:fs');
const acorn=require('acorn');
const {execFileSync}=require('node:child_process');
let html=fs.readFileSync('source/index.original.html','utf8');
if(require('node:crypto').createHash('sha256').update(html).digest('hex')!=='a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61')throw new Error('O original diverge do arquivo inventariado; interrompido para revisão.');
const translated=require('./structured-translation.cjs').translate(html,JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8')));
html=translated.html;
// The immutable source has cosmetic spaces after commas on these literals. Remove
// only the whitespace exposed by approved translated milestone descriptions.
for (const report of translated.reports) for (const change of report.changes || []) {
 if (report.name === 'PIVOT_MILESTONES' && change.path.at(-1) === 'desc') {
  html=html.replaceAll(JSON.stringify(change.target)+', \r\n',JSON.stringify(change.target)+',\r\n');
  html=html.replaceAll(JSON.stringify(change.target)+', \n',JSON.stringify(change.target)+',\n');
 }
}
fs.mkdirSync('artifacts',{recursive:true});
fs.writeFileSync('artifacts/structured-translation-report.json',JSON.stringify(translated.reports,null,2));
const edits=[];
const indicatorUI=require('./indicator-ui-patch.cjs').apply(html);
html=indicatorUI.html;
edits.push({reason:'Sete rótulos dos indicadores em português, preservando limiares, cálculos, formatos e consumidores',...indicatorUI.report});
const newsContext=require('./news-context-patch.cjs').apply(html);
html=newsContext.html;
edits.push({reason:'Manchetes fictícias do ticker NEWS em português, preservando grupos, ordem, números, moedas, seleção e consumidor',reports:newsContext.reports});
html=require('./onboarding-patch.cjs').apply(html);
edits.push({reason:'L1b: introdução, navegação padrão em português, perfis em ordem visual e remoção de exemplos; Ada e motor preservados',methods:['Game.init','Game.showFounderModal','Game.showProfileInfo']});
html=require('./company-identity-patch.cjs').apply(html);
edits.push({reason:'Correção P0: os doze empreendimentos mantêm IDs e regras técnicas, mas usam nome e descrição brasileiros na definição visível da empresa',structure:'COMPANIES'});
html=require('./crisis-patch.cjs').apply(html);
edits.push({reason:'Socorro financeiro por empréstimo pessoal fictício com passivo, preservando o valor de referência e a oportunidade única de recuperação',methods:['Game.showCrisisModal','Game.resolveCrisis']});
html=require('./method-patch.cjs').replaceMethod(html,'renderFundingStages','    SlingshotInitialCredit.render(this);');
edits.push({reason:'Escolha inicial de recursos próprios ou empréstimos aprovados substitui ofertas de participação societária',method:'Game.renderFundingStages'});
for(const [method,body] of Object.entries({
 showRaiseModal:'    SlingshotContinuingCredit.open(this);',
 closeRaiseModal:'    SlingshotContinuingCredit.close();',
 showFollowOnTermSheet:'    SlingshotContinuingCredit.open(this);',
 acceptFunding:'    const offer = SlingshotContinuingCredit.accept(this, optionId, this.originalFundingReference());\n    SlingshotContinuingCredit.close();\n    this.log("Crédito contratado: " + offer.name + ". Parcelas a partir do próximo trimestre.");\n    this.update();'
})){
 html=require('./method-patch.cjs').replaceMethod(html,method,body);
 edits.push({reason:'Financiamento posterior por empréstimos com passivo, sem diluição nem aumento artificial da avaliação da empresa',method:'Game.'+method});
}
function replaceOnce(before,after,reason) {
 const first=html.indexOf(before);
 if(first<0||html.indexOf(before,first+before.length)>=0)throw new Error('Âncora ausente ou ambígua: '+before.slice(0,100));
 html=html.slice(0,first)+after+html.slice(first+before.length);
 edits.push({reason,before,after});
}
function replaceInMethod(method,before,after,reason) {
 html=require('./method-patch.cjs').replaceMethod(html,method,body=>{
  const first=body.indexOf(before);
  if(first<0||body.indexOf(before,first+before.length)>=0)throw new Error('Âncora ausente ou ambígua em '+method+': '+before.slice(0,100));
  return body.slice(0,first)+after+body.slice(first+before.length);
 });
 edits.push({reason,method,before,after});
}
for(const [before,after] of [
 ['<h3 class="font-bold text-base">${loc.name}</h3>','<h3 class="font-bold text-base">${SlingshotLocationDisplay.city(loc.name)}</h3>'],
 ['<span class="text-xs text-slate-300">${loc.region}</span>','<span class="text-xs text-slate-300">${SlingshotLocationDisplay.region(loc.region)}</span>'],
 ['document.getElementById("locationInfoName").textContent = `📍 ${loc.name}`;','document.getElementById("locationInfoName").textContent = `📍 ${SlingshotLocationDisplay.city(loc.name)}`;'],
 ['document.getElementById("locationInfoRegion").textContent = loc.region;','document.getElementById("locationInfoRegion").textContent = SlingshotLocationDisplay.region(loc.region);'],
 ['locEl.textContent = `📍 ${this.location.name}`;','locEl.textContent = `📍 ${SlingshotLocationDisplay.city(this.location.name)}`;']
])replaceOnce(before,after,'Exônimos e regiões na apresentação, preservando nomes internos usados em regras de fomento');
replaceInMethod('init','${c.archetype}','${SlingshotCompanyDisplay.sector(c)}','Setor brasileiro por ID na grade, preservando o arquétipo canônico');
replaceInMethod('init','${c.name}','${SlingshotCompanyDisplay.name(c)}','Nome brasileiro por ID na grade, preservando o nome canônico');
replaceInMethod('selectVenture','document.getElementById("companyDisplay").textContent = this.company.name;','document.getElementById("companyDisplay").textContent = SlingshotCompanyDisplay.name(this.company);','Nome brasileiro no cabeçalho após seleção');
replaceInMethod('showLocationModal','locationVentureName.textContent = this.company.name;','locationVentureName.textContent = SlingshotCompanyDisplay.name(this.company);','Nome brasileiro na escolha de localização');
replaceInMethod('showVentureInfo','document.getElementById("ventureInfoName").textContent = company.name;','document.getElementById("ventureInfoName").textContent = SlingshotCompanyDisplay.name(company);','Nome brasileiro no modal de empreendimento');
replaceInMethod('showVentureInfo','document.getElementById("ventureInfoArchetype").textContent = company.archetype;','document.getElementById("ventureInfoArchetype").textContent = SlingshotCompanyDisplay.sector(company);','Setor brasileiro no modal de empreendimento');
replaceInMethod('updateCompanyNameDisplays','nameEl.textContent = this.company.name;','nameEl.textContent = SlingshotCompanyDisplay.name(this.company);','Nome brasileiro no cabeçalho atualizado durante a partida');
replaceInMethod('updateCompanyNameDisplays','locNameEl.textContent = this.company.name;','locNameEl.textContent = SlingshotCompanyDisplay.name(this.company);','Nome brasileiro na tela de localização atualizada durante a partida');
replaceInMethod('loadGame','document.getElementById("companyDisplay").textContent = this.company.name;','document.getElementById("companyDisplay").textContent = SlingshotCompanyDisplay.name(this.company);','Nome brasileiro no cabeçalho após restauração');
replaceInMethod('checkForSavedGame','`(${company.name}, Q${s.turn} — ${timeStr})`','`(${SlingshotCompanyDisplay.name(company)}, Q${s.turn} — ${timeStr})`','Nome brasileiro no resumo de partida salva');
replaceInMethod('endGame','`${this.company.name} ran out of cash in Q${this.turn}`','`${SlingshotCompanyDisplay.name(this.company)} ran out of cash in Q${this.turn}`','Nome brasileiro no encerramento por falta de caixa');
replaceInMethod('endGame','`${this.company.name} ended Q16 profitable and paying its own way`','`${SlingshotCompanyDisplay.name(this.company)} ended Q16 profitable and paying its own way`','Nome brasileiro no encerramento sustentável');
replaceInMethod('endGame','`${this.company.name} after ${this.turn} quarters`','`${SlingshotCompanyDisplay.name(this.company)} after ${this.turn} quarters`','Nome brasileiro no encerramento geral');
replaceInMethod('showHallOfFame','`${this.company.name} • ${new Date().getFullYear()}`','`${SlingshotCompanyDisplay.name(this.company)} • ${new Date().getFullYear()}`','Nome brasileiro no Hall of Fame');
replaceOnce('        crisisLifelineUsed: this.crisisLifelineUsed || false,','        crisisLifelineUsed: this.crisisLifelineUsed || false,\n        brCrisisGracePeriod: this.crisisGracePeriod === true,','Preserva a carência da recuperação na partida salva');
replaceOnce('      this.crisisLifelineUsed = s.crisisLifelineUsed || false; // P2-6: one lifeline per run, survives reload','      this.crisisLifelineUsed = s.crisisLifelineUsed || false;\n      this.crisisGracePeriod = s.brCrisisGracePeriod === true;','Restaura a carência antes de atualizar a interface ou verificar falência');
replaceOnce('  generateFundingOptions() {','  generateFundingOptions() {\n    return SlingshotContinuingCredit.options(this, this.originalFundingReference());\n  }\n\n  originalFundingReference() {','Preserva o cálculo de capital do original como referência para propostas de empréstimo');
html=require('./method-patch.cjs').replaceMethod(html,'originalFundingReference',body=>body.replaceAll('game.founderBonuses','this.founderBonuses'));
edits.push({reason:'Referência de financiamento usa os bônus da própria partida, preservando os cálculos',method:'Game.originalFundingReference'});
replaceOnce('<html lang="en-GB">','<html lang="pt-BR">','Idioma da edição');
replaceOnce('<meta charset="UTF-8">','<meta charset="UTF-8">\n<meta http-equiv="Content-Security-Policy" content="default-src \'self\' data: blob:; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: blob:; media-src \'self\' data: blob:; connect-src \'none\'; frame-src \'none\'; object-src \'none\'; base-uri \'self\'">','Bloqueio de conexões automáticas externas e telemetria');
replaceOnce('    this.turn = 1;','    this.turn = 1;\n    this.brCompletedQuarters = 0;\n    SlingshotFinanceAdapter.init(this);','Contagem explícita para avaliação acadêmica');
replaceOnce('    this.metrics.cash -= netCost;','    this.metrics.cash -= netCost;\n    SlingshotFinanceAdapter.settleQuarter(this, this.turn);\n    this.brCompletedQuarters = Math.max(this.brCompletedQuarters || 0, this.turn);','Trimestre concluído após apuração operacional e parcelas');
replaceOnce('  endGame(reason) {','  endGame(reason) {\n    SlingshotExport.capture(this, reason);','Captura de resultado antes dos resets do encerramento');
replaceOnce("        version: '1.3',","        version: '1.3',\n        brEdition: 1,\n        brLoans: this.brLoans,\n        brFundingAPCost: this.fundingAPCost,\n        brCompletedQuarters: this.brCompletedQuarters,",'Persistência da contagem, carteira e atenção financeira, sem identificação pessoal');
replaceOnce('      const s = JSON.parse(raw);\n      if (!this.runStartTime)', '      const s = JSON.parse(raw);\n      SlingshotSave.validate(s, COMPANIES);\n      if (!this.runStartTime)', 'Validação da edição, nota e contratos antes de qualquer alteração do estado');
replaceOnce('      this.turn = s.turn;','      this.turn = s.turn;\n      this.brCompletedQuarters = s.brCompletedQuarters;\n      this.brLoans = s.brLoans;\n      SlingshotFinanceAdapter.summary(this);\n      SlingshotSave.restoreFunding(this, s);','Restauração da contagem, carteira e limites por etapa previamente validados');
replaceOnce("      UIEffects.showToast(`Game loaded — Quarter ${this.turn}`, 'success');", "      SlingshotExport.reset();\n      UIEffects.showToast(`Game loaded — Quarter ${this.turn}`, 'success');", 'Limpeza do resultado anterior após restauração bem-sucedida');
replaceOnce('  startGame() {','  startGame() {\n    SlingshotExport.reset();','Limpeza de resultado e operações pendentes ao iniciar partida');
replaceOnce('function getFunder(funderId) {','function getFunder(funderId) {\n  const brazil = SlingshotInitialCredit.source(funderId, FUNDERS.personalSavings);\n  if (brazil) return brazil;','Fontes iniciais brasileiras sem participação societária');
replaceOnce('  selectFunder(id) {','  selectFunder(id) {\n    if (!SlingshotInitialCredit.begin(this, id)) return;','Validação de elegibilidade e seleção única antes de alterar caixa e atributos');
replaceOnce('    // Hire team first, then choose milestone based on team strengths\n    this.showHiringModal();','    SlingshotInitialCredit.apply(this);\n    document.getElementById("fundingModal").classList.add("hidden");\n    document.getElementById("fundingModal").classList.remove("flex");\n    // Hire team first, then choose milestone based on team strengths\n    this.showHiringModal();','Registro do passivo inicial sem duplicar o crédito que o motor já incluiu no caixa');
replaceOnce('    // Show guided play coaching for funding stage selection','    SlingshotInitialCredit.render(this);\n    // Show guided play coaching for funding stage selection','Atualização das propostas após escolher empreendimento, modo e local');
html=html.replaceAll('slingshot_save','slingshot_br_save_v1');
// Coleta desativada conforme autorização. A assinatura permanece para preservar os chamadores.
replaceOnce("      if (typeof umami !== 'undefined') {\n        umami.track(eventName, eventData);\n      }",'      return; // Edição brasileira: nenhuma telemetria.','Desativação da transmissão de eventos');
html=html.replace(/<script\b[^>]*src="https:\/\/cloud\.umami\.is[^>]*><\/script>/g,'');
html=html.replace(/<script\b[^>]*src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase[^>]*><\/script>/g,'');
html=html.replace(/<script\b[^>]*src="trajectory-shim\.js"[^>]*><\/script>/g,'');
html=html.replace(/<script\b[^>]*src="\/cdn-cgi\/[^>]*><\/script>/g,'');
for(const dependency of JSON.parse(fs.readFileSync('vendor/manifest.json','utf8'))) {
 html=html.replaceAll(dependency.url,dependency.file);
}
const catalogue=fs.existsSync('locales/pt-BR.json')?JSON.parse(fs.readFileSync('locales/pt-BR.json','utf8')):{};
// Only DOM text and accessibility attributes, never JS identifiers or comparison strings.
const parse5=require('parse5');
const tree=parse5.parse(html,{sourceCodeLocationInfo:true});
const translations=[];
function section(node,content) {
 const loc=node.sourceCodeLocation;
 if(!loc?.startTag||!loc.endTag)throw new Error('Seção HTML sem limites verificáveis.');
 translations.push({start:loc.startTag.endOffset,end:loc.endTag.startOffset,text:content,source:'approved-brazil-section'});
}
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function visit(node,skip=false) {
 if(node.attrs?.some(a=>a.name==='id'&&a.value==='privacyPolicyModal')) {
  section(node,`<div class="bg-white rounded-2xl max-w-2xl w-full p-6 text-slate-800">
   <h2 class="text-2xl font-bold">Política de privacidade</h2>
   <p class="mt-4">Esta edição acadêmica não cria contas e não envia identificação, escolhas ou resultados dos participantes ao Supabase. A telemetria do original foi desativada.</p>
   <p class="mt-4">A partida pode ser salva no armazenamento local deste navegador. Use um nome fictício para o personagem e para a empresa. O arquivo salvo pertence a este dispositivo; não é enviado ao professor automaticamente.</p>
   <p class="mt-4">A matrícula ou o e-mail é solicitado apenas ao exportar o resultado. Essa identificação integra o arquivo que você decide entregar ao professor. A chave da turma é removida do campo após o uso. O código de resultado não oculta os dados por criptografia.</p>
   <p class="mt-4">Os links de fontes e materiais externos abrem serviços com políticas próprias. A versão offline permite concluir a partida e gerar o arquivo sem conexão.</p>
   <button class="mt-5 px-4 py-2 bg-slate-800 text-white rounded-lg" onclick="document.getElementById('privacyPolicyModal').classList.add('hidden');document.getElementById('privacyPolicyModal').classList.remove('flex');">Fechar</button></div>`);
  return;
 }
 if(node.tagName==='div'&&node.childNodes?.some(child=>child.tagName==='h4'&&child.childNodes?.some(t=>t.value?.includes('UK AI Sector at a Glance')))) {
  section(node,`<h4 class="text-white font-bold text-sm mb-3">🇧🇷 Inteligência artificial nas empresas brasileiras</h4>
   <div class="grid grid-cols-2 gap-3 mb-4">
    <div class="bg-indigo-500/20 rounded-lg p-3"><strong class="text-2xl text-indigo-300">17%</strong><p class="text-xs text-slate-300">Empresas que utilizaram IA — TIC Empresas 2025</p></div>
    <div class="bg-emerald-500/20 rounded-lg p-3"><strong class="text-2xl text-emerald-300">13%</strong><p class="text-xs text-slate-300">Empresas que utilizaram IA — TIC Empresas 2024</p></div>
    <div class="bg-violet-500/20 rounded-lg p-3"><strong class="text-2xl text-violet-300">10%</strong><p class="text-xs text-slate-300">Comércio e reparação de veículos — TIC Empresas 2024</p></div>
    <div class="bg-amber-500/20 rounded-lg p-3"><strong class="text-2xl text-amber-300">41,9%</strong><p class="text-xs text-slate-300">Indústrias com 100 ou mais pessoas ocupadas — PINTEC 2024</p></div>
   </div>
   <p class="text-xs text-slate-300 mb-3">As pesquisas têm universos diferentes. Esses percentuais não são uma estimativa de todas as microempresas e não devem ser comparados diretamente entre si. A simulação explora decisões de gestão e adoção de tecnologia em diferentes empreendimentos.</p>
   <p class="text-xs text-slate-300">Fontes: <a class="underline" href="https://www.cetic.br/pt/noticia/uso-de-inteligencia-artificial-por-empresas-brasileiras-avanca-e-atinge-17-aponta-pesquisa-do-cetic-br/" target="_blank" rel="noopener noreferrer">Cetic.br — TIC Empresas 2025</a>; <a class="underline" href="https://cetic.br/pt/tics/pesquisa/2024/empresas/H9/expandido/" target="_blank" rel="noopener noreferrer">TIC Empresas 2024, indicador H9</a>; <a class="underline" href="https://agenciadenoticias.ibge.gov.br/media/com_mediaibge/arquivos/58ab6f34051f3fa2b73b75cc6e926067.pdf" target="_blank" rel="noopener noreferrer">IBGE — PINTEC Semestral 2024</a>. Referências consultadas em setembro de 2026.</p>`);
  return;
 }
 skip=skip||['script','style'].includes(node.tagName);
 if(!skip&&node.nodeName==='#text'&&node.sourceCodeLocation) {
  const key=node.value.trim();
  if(Object.hasOwn(catalogue,key)) {
   const loc=node.sourceCodeLocation;
   const text=node.value.replace(key,catalogue[key]);
   translations.push({start:loc.startOffset,end:loc.endOffset,text:escape(text),source:key});
  }
 }
 if(!skip&&node.attrs)for(const attr of node.attrs) {
  if(['title','alt','placeholder','aria-label'].includes(attr.name)&&Object.hasOwn(catalogue,attr.value)) {
   const loc=node.sourceCodeLocation?.attrs?.[attr.name];
   if(loc) {
    let end=loc.endOffset;
    // Translating this legacy line exposes its original trailing space to diff checks.
    if(attr.name==='placeholder'&&attr.value==='Enter your name, founder...'&&node.attrs.some(a=>a.name==='id'&&a.value==='unicornFounderName')) {
     const trailing=/^[ \t]+(?=\r?\n)/.exec(html.slice(end));
     if(trailing)end+=trailing[0].length;
    }
    translations.push({start:loc.startOffset,end,text:attr.name+'="'+escape(catalogue[attr.value]).replaceAll('"','&quot;')+'"',source:attr.value});
   }
  }
 }
 for(const child of node.childNodes||[])visit(child,skip);
}
visit(tree);
for(const edit of translations.sort((a,b)=>b.start-a.start))html=html.slice(0,edit.start)+edit.text+html.slice(edit.end);
const aboutContext=require('./about-context-translation-patch.cjs');
html=aboutContext.apply(html);
edits.push({reason:'Tradução contextual do modal Sobre: 21 nós de texto aprovados, com tags, atributos, links, espaços de borda e o modal de créditos preservados',modal:aboutContext.modalId,translations:aboutContext.translations.length});
const fundingTermsContext=require('./funding-terms-context-translation-patch.cjs');
html=fundingTermsContext.apply(html);
edits.push({reason:'Tradução contextual da ajuda societária: 44 nós de texto como referência do original, sem alterações de regras ou valores',modal:fundingTermsContext.modalId,translations:fundingTermsContext.translations.length});
html=require('./management-patch.cjs').apply(html);
edits.push({reason:'L2: conteúdo integral dos empreendimentos recuperado do Rodada5 e retratos por objetos sem características pessoais',structures:['VENTURE_DETAILS','FOUNDER_PORTRAITS'],functions:['getAvatar','renderAvatar','renderCandidatePortrait']});
html=require('./setup-patch.cjs').apply(html);
html=require('./setup-ui-patch.cjs').apply(html);
html=require('./operations-patch.cjs').apply(html);
edits.push({reason:'L3b, L3i e L3j: operações persistidas para os doze empreendimentos brasileiros, com modelos v2, serviços agregados v3 e produção industrial fictícia',source:'locales/operating-models.pt-BR.json'});
html=require('./dashboard-localization-patch.cjs').apply(html);
edits.push({reason:'L3c: resumo de situação, capítulos, foco sugerido e moeda apenas de apresentação em português e reais; valores internos preservados',methods:['Game.getChapterInfo','Game.calculateSuggestedFocus','Game.getMilestoneFocusAreas','Game.getMilestoneFocusReason','Game.showSituationBrief']});
html=require('./conditional-ui-translation-patch.cjs').apply(html);
edits.push({reason:'Tradução das duas mensagens de integração da equipe, preservando condições, campos e interpolação',method:'Game.update'});
html=require('./operational-endgame-patch.cjs').apply(html);
edits.push({reason:'Correção P0: encerramento acadêmico local em português, sem relatório SaaS, valuation, equity ou abertura de Claude',method:'Game.endGame'});
html=require('./market-isolation-patch.cjs').apply(html);
edits.push({reason:'L3d/L3d.1: acesso visual a mercados ocultado; efeitos de mercado legado neutralizados somente para os três modelos operations-v1, com estado de save preservado',methods:['Game.showMarketsModal','Game.showMarketsHelpModal','Game.showHelpTab','Game.updateMarketsCard','Game.applyPendingMarketInvestments','Game.getMarketUnderstandingBonus','Game.getMarketDecisionBonus','Game.getAcquisitionBonus','Game.getRetentionBonus','Game.getExpansionBonus','Game.investInMarketKnowledge','Game.investInCustomerInsights','Game.investInAlternative','Game.originalFundingReference','Game.completePivotProcess','Game.renderPivotCards']});
html=require('./pivot-presentation-patch.cjs').apply(html);
edits.push({reason:'P2 aprovado: rótulos pt-BR de tipos de pivot e visão de financiadores; P3b acrescenta rótulos de adequação da equipe por ID; P3c localiza a cromia estática dos cards, sem alterar dados, regras ou saves',methods:['Game.renderOpportunitiesTab']});
html=require('./people-contracts-patch.cjs').apply(html);
edits.push({reason:'L3f: caixa operacional, livro com resultado negativo e estrutura inicial de empregados e contratos externos somente para avam, dream e quant',methods:['Game.commitTurn','Game.showHiringModal','Game.startGame','Game.saveGame','Game.loadGame']});
const teamCapacityUI=require('./team-capacity-ui-patch.cjs').apply(html);
html=teamCapacityUI.html;
edits.push({reason:'Rótulos e avisos da capacidade da equipe em português, preservando limites, AP, custos, estados e consumidores',...teamCapacityUI.report});
const staffHiringUI=require('./staff-hiring-ui-patch.cjs').apply(html);
html=staffHiringUI.html;
edits.push({reason:'Lote B: rótulos, botões, alertas e moeda das telas acessíveis de contratação, desligamento e confirmação',...staffHiringUI.report});
html=require('./operational-decisions-patch.cjs').apply(html);
edits.push({reason:'L3g: decisões operacionais tipadas e versionadas, sem gestores SaaS, investidores, minijogos, mercados ou fomento para avam, dream e quant',methods:['Game.randomizeStartingDomain','Game.selectQuarterEvents','Game.renderExecRow','Game.renderDecision','Game.confirmChoice','Game.allChosen','Game.commitTurn']});
edits.push({reason:'L2b: cidades com efeitos, gestores assalariados, metas e tutoriais de gestão brasileiros; versão de regras persistida',source:'locales/management-setup.pt-BR.json'});
const libraries=['academic.js','finance.js','finance-adapter.js','initial-credit.js','continuing-credit.js','crisis-credit.js','people-contracts-runtime.js','business-adapter.js','operations-runtime.js','operational-decisions-runtime.js','operational-endgame-runtime.js','market-isolation.js','management-runtime.js','save-validation.js','result-code.js','academic-export.js','location-display.js','company-display.js'].map(file=>{
 let code=fs.readFileSync(file,'utf8');
 if(file==='management-runtime.js')code=code.replace('BR_MANAGEMENT_DATA',JSON.stringify(require('../locales/management-setup.pt-BR.json')).replaceAll('<','\\u003c'));
 if(file==='operations-runtime.js')code=code.replace('BR_OPERATIONS_DATA',JSON.stringify(require('../locales/operating-models.pt-BR.json')).replaceAll('<','\\u003c'));
 if(file==='operational-decisions-runtime.js')code=code.replace('BR_OPERATIONAL_DECISIONS_DATA',JSON.stringify(require('../locales/operational-decisions.pt-BR.json')).replaceAll('<','\\u003c'));
 if(file==='people-contracts-runtime.js')code=code.replace('BR_PEOPLE_CONTRACTS_DATA',JSON.stringify(require('../locales/people-contracts.pt-BR.json')).replaceAll('<','\\u003c'));
 return '<script>\n'+code.replaceAll('</script','<\\/script')+'\n</script>';
}).join('\n');
replaceOnce('const game = new Game();',libraries+'\n<script>\nconst game = new Game();','Integração dos módulos locais');
// Close the original script before inserting the new scripts.
html=html.replace(libraries,'</script>\n'+libraries);
const fundingPathwayStaticHelp=require('./funding-pathway-static-help-patch.cjs');
html=fundingPathwayStaticHelp.applyFundingPathwayStaticHelp(html);
edits.push({reason:'Sincronização da ajuda estática de caminhos com o literal brasileiro aprovado do runtime, sem alterar regras econômicas',modal:fundingPathwayStaticHelp.modalId,synchronizedModals:1});
html=require('./entry-help-context-patch.cjs').apply(html);
edits.push({reason:'Entrada e seis abas de ajuda usam orientação brasileira; vídeo/transcrição originais preservados nos créditos, sem alterações de regras ou importação',source:'locales/entry-help-context.pt-BR.json',panels:6});
const lifeConferenceContext=require('./life-conference-context-patch.cjs').apply(html);
html=lifeConferenceContext.html;
edits.push({reason:'Catálogos brasileiros fictícios de eventos, conferências, anúncios e visitantes; somente campos editoriais, sem novos grupos, efeitos ou regras',source:'locales/life-conference-context.pt-BR.json',reports:lifeConferenceContext.reports});
const eventConferenceUI=require('./event-conference-ui-patch.cjs').apply(html);
html=eventConferenceUI.html;
edits.push({reason:'Apresentação brasileira de eventos e conferências, sem alterações de regras, valores, seletores ou conteúdo dos outros minijogos',...eventConferenceUI.report});
const clinicLegacy=require('./clinic-legacy-decisions-patch.cjs').apply(html);
html=clinicLegacy.html;
edits.push({reason:'Treze decisões exclusivas da clínica popular em contexto administrativo brasileiro, sem alterar valores ou regras',reports:clinicLegacy.reports});
const decisionPresentation=require('./decision-presentation-patch.cjs').apply(html);
html=decisionPresentation.html;
edits.push({reason:'Apresentação brasileira das decisões compartilhadas, sem alterar classificação, regras, seletores ou interpolação',...decisionPresentation.report});
const genericMarketingContext=require('./generic-marketing-context-patch.cjs').apply(html);
html=genericMarketingContext.html;
edits.push({reason:'Trinta e quatro eventos genéricos de marketing em cenários brasileiros fictícios, preservando setores, escolhas e efeitos',reports:genericMarketingContext.reports});
const genericOperationsContext = require('./generic-operations-context-patch.cjs').apply(html);
html = genericOperationsContext.html;
edits.push({ reason: 'Sessenta e seis eventos genéricos de operações em cenários brasileiros fictícios, preservando escolhas e efeitos', reports: genericOperationsContext.reports });
const genericOperationsPrizeMessages = require('./generic-operations-prize-messages-patch.cjs').apply(html);
html = genericOperationsPrizeMessages.html;
edits.push({ reason: 'Mensagens administrativas fictícias de reconhecimento, com regras originais preservadas', reports: genericOperationsPrizeMessages.report });
const genericGeneralContext = require('./generic-general-context-patch.cjs').apply(html);
html = genericGeneralContext.html;
edits.push({ reason: 'Setenta e três eventos gerais de organização fictícia, com metadados originais preservados', reports: genericGeneralContext.reports });
const genericDevelopmentContext = require('./generic-development-context-patch.cjs').apply(html);
html = genericDevelopmentContext.html;
edits.push({ reason: 'Cinquenta e seis eventos de desenvolvimento em cenários administrativos fictícios, com metadados originais preservados', reports: genericDevelopmentContext.reports });
const genericHrContext = require('./generic-hr-context-patch.cjs').apply(html);
html = genericHrContext.html;
edits.push({ reason: 'Trinta e quatro eventos de RH em cenários administrativos fictícios, com metadados originais preservados', reports: genericHrContext.reports });
const competitiveEventsContext = require('./competitive-events-context-patch.cjs').apply(html);
html = competitiveEventsContext.html;
edits.push({ reason: 'Oito eventos competitivos em cenários administrativos fictícios, preservando rival e efeitos originais', reports: competitiveEventsContext.reports });
const charFatimaContext = require('./char-fatima-context-patch.cjs').apply(html);
html = charFatimaContext.html;
edits.push({ reason: 'Dezesseis eventos de Fátima em situações administrativas fictícias, preservando os metadados originais', reports: charFatimaContext.reports });
const charYukiContext = require('./char-yuki-context-patch.cjs').apply(html);
html = charYukiContext.html;
edits.push({ reason: 'Quinze eventos de Yuki em cooperação e divulgação administrativas fictícias brasileiras, preservando os metadados originais', reports: charYukiContext.reports });
const charKwameContext = require('./char-kwame-context-patch.cjs').apply(html);
html = charKwameContext.html;
edits.push({ reason: 'Vinte e um eventos de Kwame em iniciativas e divulgação administrativas fictícias, preservando metadados e a ressalva econômica original', reports: charKwameContext.reports });
const charAoifeContext = require('./char-aoife-context-patch.cjs').apply(html);
html = charAoifeContext.html;
edits.push({ reason: 'Vinte e oito eventos de Aoife em organização de rotinas, cooperação e transição administrativas fictícias, preservando metadados e desembolsos originais', reports: charAoifeContext.reports });
const charRajContext = require('./char-raj-context-patch.cjs').apply(html);
html = charRajContext.html;
edits.push({ reason: 'Dezesseis eventos de Raj em atendimento, organização da oferta e colaboração administrativas fictícias, preservando metadados e receitas comerciais originais', reports: charRajContext.reports });
const charWeiContext = require('./char-wei-context-patch.cjs').apply(html);
html = charWeiContext.html;
edits.push({ reason: 'Seis eventos de Wei em organização e aprendizagem administrativas fictícias, preservando dezenove escolhas e todos os metadados originais', reports: charWeiContext.reports });
const charPriyaContext = require('./char-priya-context-patch.cjs').apply(html);
html = charPriyaContext.html;
edits.push({ reason: 'Trinta eventos de Priya em relações comerciais administrativas fictícias, preservando noventa escolhas e todos os efeitos e metadados originais', reports: charPriyaContext.reports });
const charAishaContext = require('./char-aisha-context-patch.cjs').apply(html);
html = charAishaContext.html;
edits.push({ reason: 'Nove eventos de Aisha em preparação, convivência e transições administrativas fictícias, preservando vinte e sete escolhas e todos os efeitos e metadados originais', reports: charAishaContext.reports });
const charSofiaContext = require('./char-sofia-context-patch.cjs').apply(html);
html = charSofiaContext.html;
edits.push({ reason: 'Dezesseis eventos de Sofia em organização, comunicação, convivência e transições administrativas fictícias, preservando quarenta e oito escolhas e todos os efeitos e metadados originais', reports: charSofiaContext.reports });
const charDavidContext = require('./char-david-context-patch.cjs').apply(html);
html = charDavidContext.html;
edits.push({ reason: 'Vinte eventos de David em acordos, comunicação, cooperação e transições administrativas fictícias, preservando sessenta escolhas e todos os efeitos e metadados originais', reports: charDavidContext.reports });
const charEmmaContext = require('./char-emma-context-patch.cjs').apply(html);
html = charEmmaContext.html;
edits.push({ reason: 'Vinte e sete eventos de Emma em reputação, divulgação e cuidado com informações administrativas fictícias, preservando oitenta e uma escolhas e todos os efeitos e metadados originais', reports: charEmmaContext.reports });
const charMarcusContext = require('./char-marcus-context-patch.cjs').apply(html);
html = charMarcusContext.html;
edits.push({ reason: 'Dezessete eventos de Marcus em atendimento, divulgação e relações administrativas fictícias, preservando cinquenta e uma escolhas e todos os efeitos e metadados originais', reports: charMarcusContext.reports });
const generatedWhitespaceHygiene=require('./generated-whitespace-hygiene-patch.cjs').apply(html);
html=generatedWhitespaceHygiene.html;
edits.push({reason:'Higiene delimitada por AST em modelos de receita e tutorial/coaching; conteúdo preservado e uma exceção de separador HTML com DOM equivalente',...generatedWhitespaceHygiene.report});
const hrSeparatorHygiene=require('./char-sofia-context-patch.cjs').cleanHrSeparators(html);
html=hrSeparatorHygiene.html;
edits.push({reason:'Remover apenas dezoito espaços de três linhas vazias entre objetos HR, preservando o AST completo e toda a prosa e os metadados',...hrSeparatorHygiene.report});
const currencyPresentation=require('./currency-presentation-patch.cjs').apply(html);
html=currencyPresentation.html;
edits.push({reason:'C1-bis: símbolo monetário de apresentação em R$ nas gravações DOM, saídas diretas de UI, fluxos por variável, helper global e texto estático, sem alterar REGIONS, valores, fórmulas, IDs, seletores ou saves',...currencyPresentation.report});
fs.mkdirSync('artifacts/build-scripts',{recursive:true});
let i=0;
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 acorn.parse(m[2],{ecmaVersion:'latest'});
 const file=`artifacts/build-scripts/${i++}.js`;
 fs.writeFileSync(file,m[2]);execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
}
fs.writeFileSync('index.html',html);
fs.writeFileSync('artifacts/build-report.json',JSON.stringify({status:'development-not-release',scriptBlocksChecked:i,htmlTranslations:translations.length,aboutContextTranslations:aboutContext.translations.length,fundingTermsContextTranslations:fundingTermsContext.translations.length,fundingPathwayStaticHelpModals:1,generatedWhitespaceHygiene:generatedWhitespaceHygiene.report,hrSeparatorHygiene:hrSeparatorHygiene.report,approvedExceptions:edits},null,2));
console.log(JSON.stringify({status:'development-not-release',scriptBlocksChecked:i,htmlTranslations:translations.length,aboutContextTranslations:aboutContext.translations.length,fundingTermsContextTranslations:fundingTermsContext.translations.length,fundingPathwayStaticHelpModals:1,generatedWhitespaceHygiene:generatedWhitespaceHygiene.report,hrSeparatorHygiene:hrSeparatorHygiene.report}));
