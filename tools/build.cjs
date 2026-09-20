const fs=require('node:fs');
const acorn=require('acorn');
const {execFileSync}=require('node:child_process');
let html=fs.readFileSync('source/index.original.html','utf8');
if(require('node:crypto').createHash('sha256').update(html).digest('hex')!=='a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61')throw new Error('O original diverge do arquivo inventariado; interrompido para revisão.');
const translated=require('./structured-translation.cjs').translate(html,JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8')));
html=translated.html;
fs.mkdirSync('artifacts',{recursive:true});
fs.writeFileSync('artifacts/structured-translation-report.json',JSON.stringify(translated.reports,null,2));
const edits=[];
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
for(const [before,after] of [
 ['<h3 class="font-bold text-base">${loc.name}</h3>','<h3 class="font-bold text-base">${SlingshotLocationDisplay.city(loc.name)}</h3>'],
 ['<span class="text-xs text-slate-300">${loc.region}</span>','<span class="text-xs text-slate-300">${SlingshotLocationDisplay.region(loc.region)}</span>'],
 ['document.getElementById("locationInfoName").textContent = `📍 ${loc.name}`;','document.getElementById("locationInfoName").textContent = `📍 ${SlingshotLocationDisplay.city(loc.name)}`;'],
 ['document.getElementById("locationInfoRegion").textContent = loc.region;','document.getElementById("locationInfoRegion").textContent = SlingshotLocationDisplay.region(loc.region);'],
 ['locEl.textContent = `📍 ${this.location.name}`;','locEl.textContent = `📍 ${SlingshotLocationDisplay.city(this.location.name)}`;']
])replaceOnce(before,after,'Exônimos e regiões na apresentação, preservando nomes internos usados em regras de fomento');
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
   if(loc)translations.push({start:loc.startOffset,end:loc.endOffset,text:attr.name+'="'+escape(catalogue[attr.value]).replaceAll('"','&quot;')+'"',source:attr.value});
  }
 }
 for(const child of node.childNodes||[])visit(child,skip);
}
visit(tree);
for(const edit of translations.sort((a,b)=>b.start-a.start))html=html.slice(0,edit.start)+edit.text+html.slice(edit.end);
const libraries=['academic.js','finance.js','finance-adapter.js','initial-credit.js','continuing-credit.js','crisis-credit.js','save-validation.js','result-code.js','academic-export.js','location-display.js'].map(file=>'<script>\n'+fs.readFileSync(file,'utf8').replaceAll('</script','<\\/script')+'\n</script>').join('\n');
replaceOnce('const game = new Game();',libraries+'\n<script>\nconst game = new Game();','Integração dos módulos locais');
// Close the original script before inserting the new scripts.
html=html.replace(libraries,'</script>\n'+libraries);
fs.mkdirSync('artifacts/build-scripts',{recursive:true});
let i=0;
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 acorn.parse(m[2],{ecmaVersion:'latest'});
 const file=`artifacts/build-scripts/${i++}.js`;
 fs.writeFileSync(file,m[2]);execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
}
fs.writeFileSync('index.html',html);
fs.writeFileSync('artifacts/build-report.json',JSON.stringify({status:'development-not-release',scriptBlocksChecked:i,htmlTranslations:translations.length,approvedExceptions:edits},null,2));
console.log(JSON.stringify({status:'development-not-release',scriptBlocksChecked:i,htmlTranslations:translations.length}));
