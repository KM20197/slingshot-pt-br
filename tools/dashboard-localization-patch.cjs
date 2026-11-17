const {replaceMethod}=require('./method-patch.cjs');

function once(html,before,after,label){
 const first=html.indexOf(before);
 if(first<0||html.indexOf(before,first+before.length)>=0)throw new Error('Âncora L3c ausente ou ambígua: '+label);
 return html.slice(0,first)+after+html.slice(first+before.length);
}
function replaceAllRequired(html,pairs){
 for(const [before,after] of pairs){
  if(!html.includes(before))throw new Error('Texto L3c ausente: '+before);
  html=html.replaceAll(before,after);
 }
 return html;
}
function replaceAllPresent(html,pairs){
 for(const [before,after] of pairs)html=html.replaceAll(before,after);
 return html;
}
function replaceExactInBody(body,before,after,label){
 const first=body.indexOf(before);
 if(first<0||body.indexOf(before,first+before.length)>=0)throw new Error('Âncora de contratação ausente ou ambígua: '+label);
 return body.slice(0,first)+after+body.slice(first+before.length);
}
function apply(html){
 html=once(html,'      <!-- Ownership -->\n      <div class="bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl shadow-lg p-4 border-2 border-violet-400 text-white">','      <!-- Ownership (preservado internamente; oculto nesta edição) -->\n      <div id="ownershipPanel" class="hidden bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl shadow-lg p-4 border-2 border-violet-400 text-white">','painel de participação');
 html=once(html,'      <!-- Grant Funding -->\n      <div class="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl shadow-lg p-4 border-2 border-teal-400 text-white">','      <!-- Grant Funding (preservado internamente; oculto nesta edição) -->\n      <div id="grantFundingPanel" class="hidden bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl shadow-lg p-4 border-2 border-teal-400 text-white">','painel de fomento');
 html=once(html,'<span id="equityCommitted" class="text-amber-600 font-medium text-sm"></span>','<span id="equityCommitted" class="hidden text-amber-600 font-medium text-sm"></span>','indicador legado de participação na equipe inicial');
 html=once(html,'const R = REGIONS.uk;','const R = Object.freeze({...REGIONS.uk, currency: "R$", currencyName: "BRL", currencyMultiplier: 1});','região de apresentação');
 html=once(html,'function getRegion() {\n  return REGIONS.uk;\n}','function getRegion() {\n  return R;\n}','região ativa');
 html=once(html,"function formatValuation(amountInK, currency = '£') {","function formatValuation(amountInK, currency = 'R$') {",'moeda padrão');
 html=replaceAllRequired(html,[
  ['<span id="briefChapterTitle" class="font-bold">Chapter 1</span>','<span id="briefChapterTitle" class="font-bold">Capítulo 1</span>'],
  ['Finding product–market fit','Encontrando adequação entre produto e mercado'],
  ['Situation Brief','Resumo da situação'],
  ['Q1 of 16','T1 de 16'],['Year 1','Ano 1'],['Ch.1','Cap. 1'],
  ['💰 Runway','💰 Autonomia financeira'],['8 quarters','8 trimestres'],
  ['🎯 Current Milestone','🎯 Meta atual'],['Core Algorithm Validation','Validação do processo principal'],
  ['⏰ 4 quarters remaining','⏰ Restam 4 trimestres'],
  ['Suggested Focus','Foco sugerido'],['Product & Research','Produção e Serviços & Qualidade'],
  ['Your milestone requires strong science scores','A meta exige bons indicadores de qualidade'],
  ['<div id="briefRunwayWarning" class="text-xs text-amber-600 mt-1 hidden">⚠️ Low runway - consider fundraising</div>','<div id="briefRunwayWarning" class="text-xs text-amber-600 mt-1 hidden">⚠️ Autonomia baixa — considere financiamento</div>'],
  ['<span>Start Quarter</span>','<span>Iniciar trimestre</span>']
 ]);
 html=replaceAllPresent(html,[
  ['Before You Commit','Antes de concluir o trimestre'],['Review Your Choices','Revise as decisões'],['Low Runway','Caixa projetado baixo'],['This quarter will leave you with less than 1 quarter of runway.','Este trimestre pode deixar pouco caixa disponível para a operação.'],['Projected runway:','Caixa projetado:'],['Critical Issues Detected','Atenção antes de concluir'],['Consider adjusting your choices before committing.','Revise as decisões antes de concluir.'],['← Review Choices','← Revisar decisões'],['Proceed Anyway →','Concluir trimestre →']
  ,['Attention Spread Thin','Atenção distribuída'],['Diluted effort reduces effectiveness by 10% this quarter.','Distribuir a atenção reduz a efetividade neste trimestre.'],['⚠️ Spread quarter streak:','⚠️ Sequência de atenção distribuída:'],['Continuing may trigger a Strategic Drift event!','Revise a distribuição antes de concluir.'],['0 quarters','0 trimestres']
 ]);
 html=replaceMethod(html,'showPreCommitReview',body=>replaceAllPresent(body,[
  ['"Critical Issues Detected"','"Atenção antes de concluir"'],['"under 1 quarter (bankruptcy risk!)"','"menos de um trimestre de caixa"'],['`about ${issues.projectedRunway.toFixed(1)} quarters`','`cerca de ${issues.projectedRunway.toFixed(1)} trimestres`'],['"Consider adjusting your choices before committing."','"Revise as decisões antes de concluir."'],['"Consider raising funding or choosing revenue-generating options."','"Considere reduzir despesas ou escolher ações compatíveis com o caixa disponível."'],['"Attention Spread Thin"','"Atenção distribuída"'],['"Diluted effort reduces effectiveness by 10% this quarter."','"Distribuir a atenção reduz a efetividade neste trimestre."'],['"Strategic Drift event"','"evento de desvio estratégico"'],['"Try concentrating AP in fewer domains for more impact."','"Concentre a atenção em menos frentes para aumentar o efeito."']
 ]));
 html=replaceAllRequired(html,[
  ['📝 Post a Job','📝 Abrir vaga'],['Create a job listing to attract candidates','Defina a vaga para consultar pessoas candidatas'],['Role *','Área da vaga *'],
  ['Science & Innovation','Operações e Qualidade'],['Engineering & Design','Produção e Serviços'],['Growth & Brand','Vendas e relacionamento'],['Culture & Talent','Gestão de pessoas'],
  ['Seniority Level *','Nível de experiência *'],['1-3 years · Learning curve','1–3 anos · Em desenvolvimento'],['4-8 years · Hit ground running','4–8 anos · Experiência consolidada'],['8+ years · Strategic leadership','8+ anos · Liderança e coordenação'],
  ['Completing a hire costs <strong>1 AP</strong>. Browse candidates for free, then negotiate with your chosen candidate.','Concluir uma contratação consome <strong>1 ação</strong>. Consulte os perfis antes de decidir.'],
  ['<strong>Tip:</strong> Hire a People lead to get candidate recommendations and salary advice.','<strong>Dica:</strong> a responsável por pessoas ajuda a organizar recomendações e custos de equipe.'],
 ['>Cancel</button>','>Cancelar</button>'],['📤 Post Job','📤 Consultar candidatos'],['📬 Candidates','📬 Pessoas candidatas'],['Review applications and make offers','Analise perfis e avalie a contratação']
 ]);
 html=replaceAllPresent(html,[
  ['UK tech sector shows steady growth • AI adoption continues • London retains European hub status • ','Mercados locais exigem atenção a caixa, operação e atendimento • acompanhe suas decisões trimestrais • '],
  ['Company Health','Saúde da operação'],['View ClearView ratings','Ver indicadores ClearView'],['What is this?','O que é isto?'],
  ['Business Model Canvas','Canvas do Modelo de Negócio'],['Key Partners','Parceiros principais'],['Key Activities','Atividades principais'],['Value Propositions','Propostas de valor'],['Customer Relationships','Relacionamento com clientes'],['Customer Segments','Segmentos de clientes'],['Key Resources','Recursos principais'],['Channels','Canais'],['Cost Structure','Estrutura de custos'],['Revenue Streams','Fontes de receita'],['Recent Changes:','Alterações recentes:'],['Items marked with [NEW] were added after Milestone 1','Itens marcados com [NOVO] foram incluídos após a Meta 1'],['Showing current state','Mostrando o estado atual']
 ]);
 html=replaceAllPresent(html,[
  ['📊 About the Canvas do Modelo de Negócio','📊 Sobre o Canvas do Modelo de Negócio'],['📖 Origins & Purpose','📖 Origem e finalidade'],
  ['The <strong>Canvas do Modelo de Negócio</strong> was created by <strong>Alexander Osterwalder</strong> and Yves Pigneur, first published in their 2010 book <em>"Business Model Generation"</em>. It has become one of the most widely-used strategic tools for entrepreneurs and established companies alike.','O <strong>Canvas do Modelo de Negócio</strong>, proposto por Alexander Osterwalder e Yves Pigneur, organiza em uma página como um empreendimento cria, entrega e captura valor.'],
  ['The canvas provides a <strong>single-page visual framework</strong> that captures how a company creates, delivers, and captures value. Instead of lengthy business plans, it lets you see your entire business model at a glance.','Ele não substitui planejamento financeiro ou obrigações legais; é um quadro de acompanhamento para relacionar clientes, operação, custos e receitas.'],
  ['🧱 The 9 Building Blocks','🧱 Os nove blocos'],['Who are you creating value for? Your most important customers.','Para quem o empreendimento cria valor e quais públicos são prioritários?'],['What value do you deliver? Why do customers choose you over competitors?','Que valor é entregue e por que clientes escolheriam esta opção?'],['How do you reach and communicate with your customers?','Como o empreendimento alcança e se comunica com clientes?'],['What type of relationship does each segment expect? Personal? Automated?','Que tipo de relacionamento cada segmento espera?'],['How does each customer segment pay? Subscriptions? Licensing? Usage fees?','Como cada segmento gera receita no modelo adotado?'],['What assets are essential? Technology, IP, talent, capital?','Quais recursos são indispensáveis para operar e entregar?'],['What must you do well? R&D, production, marketing, platform management?','Quais atividades precisam funcionar bem para cumprir a proposta?'],['Who are your essential suppliers and partners? What do they provide?','Quais fornecedores e parceiros são essenciais e o que oferecem?'],['What are your biggest costs? Fixed vs variable? Cost-driven or value-driven?','Quais custos principais sustentam a operação e como variam?'],
  ['🎮 How It Evolves In This Game','🎮 Como evolui na simulação'],['Your Canvas do Modelo de Negócio is <strong>dynamic</strong> — it changes based on your decisions throughout the game:','O Canvas do Modelo de Negócio é <strong>dinâmico</strong>: ele registra mudanças associadas às decisões da simulação.'],['<strong>Early game:</strong> Your canvas starts sparse. You have a vision but few validated elements.','<strong>Início:</strong> o quadro começa com poucos elementos confirmados.'],['<strong>Product decisions</strong> add to Key Activities, Resources, and Value Propositions.','<strong>Decisões de operação</strong> podem alterar atividades, recursos e proposta de valor.'],['<strong>Sales & marketing</strong> decisions define Channels, Relationships, and Customer Segments.','<strong>Decisões comerciais</strong> podem alterar canais, relacionamento e segmentos.'],['<strong>Hiring & partnerships</strong> build out Key Resources and Partners.','<strong>Equipe e parcerias</strong> podem ampliar recursos e parceiros.'],['<strong>Revenue model choices</strong> determine your Revenue Streams.','<strong>Escolhas de receita</strong> definem como as fontes de receita são apresentadas.'],['<strong>By endgame:</strong> Your canvas should be rich and coherent — a complete business model.','<strong>Ao longo da partida:</strong> a coerência entre os blocos ajuda a interpretar as decisões.'],['💡 Why It Matters','💡 Por que acompanhar'],['In real startups, the Canvas do Modelo de Negócio helps founders and investors quickly understand how all the pieces fit together. A strong canvas shows <strong>coherence</strong> — your segments match your channels, your value prop justifies your pricing, and your activities support your promises. Watch how your decisions build (or fragment) your business model!','No jogo, o quadro facilita observar se clientes, canais, atividades, custos e receitas estão coerentes. Ele descreve a estratégia adotada; não cria, por si só, efeitos econômicos adicionais.'],['Got It!','Entendi']
 ]);
 html=replaceAllPresent(html,[
  ['>Overview</button>','>Visão geral</button>'],['>Attention Points</button>','>Pontos de atenção</button>'],['>Money</button>','>Finanças</button>'],['>Milestones</button>','>Metas</button>'],['>Markets</button>','>Mercados</button>'],['>Team</button>','>Equipe</button>'],
  ['⚡ Attention Points (AP)','⚡ Pontos de atenção (AP)'],['🎯 Milestones','🎯 Metas'],['👥 Your Team','👥 Sua equipe'],['Cash hits zero (bankruptcy)','O caixa chega a zero'],['Select choices (each costs Attention Points)','Escolha ações; cada uma consome pontos de atenção'],['Milestones are your key objectives. Complete all 3 to win!','Metas são objetivos da partida. Conclua as três para vencer.'],
  ['Team & Staffing','Equipe e contratações'],['Your team size directly affects how much you can accomplish each quarter. More staff means more Attention Points.','O porte da equipe afeta a capacidade de execução a cada trimestre. Mais pessoas aumentam os pontos de atenção.'],['📈 Staff → Attention Points','📈 Equipe → Pontos de atenção'],
  ['Milestones are your path to victory. Complete all three to win the game and build a successful AI startup.','As metas orientam o progresso na simulação. Conclua as três antes do prazo para vencer.'],['What Are Milestones?','O que são metas?'],['Milestones represent the key stages of building your startup:','As metas representam etapas de evolução do empreendimento na simulação:']
 ]);
 html=replaceMethod(html,'getChapterInfo',`    if (quarter >= 12) {
      return { num: 3, title: "Capítulo 3", subtitle: "Preparando a consolidação", icon: "🚀" };
    } else if (quarter >= 6) {
      return { num: 2, title: "Capítulo 2", subtitle: "Ampliando a operação", icon: "📈" };
    }
    return { num: 1, title: "Capítulo 1", subtitle: "Encontrando adequação entre produto e mercado", icon: "🔍" };`);
 html=replaceMethod(html,'calculateSuggestedFocus',`    if (runway <= 2) return { focus: "🚨 Financiamento e receita", reason: "Autonomia crítica. Obtenha recursos ou gere receita imediatamente para manter a operação.", urgent: true, warning: false };
    if (runway <= 4) return { focus: "💰 Financiamento e controle de despesas", reason: "Autonomia baixa. Inicie a busca por recursos ou eleve a receita.", urgent: false, warning: true };
    if (milestone) {
      const quartersLeft = Math.max(0, milestone.deadline - this.turn), progressNeeded = 100 - progress, progressPerQuarter = quartersLeft > 0 ? progressNeeded / quartersLeft : progressNeeded;
      if (progressPerQuarter > 25 && quartersLeft <= 2) return { focus: "⚡ " + this.getMilestoneFocusAreas(milestone), reason: quartersLeft === 1 ? "Último trimestre — concentre o esforço final." : "O prazo se aproxima — acelere o progresso agora.", urgent: false, warning: true };
    }
    if (milestone && (milestone.threshold || milestone.focus)) return { focus: this.getMilestoneFocusAreas(milestone), reason: this.getMilestoneFocusReason(milestone), urgent: false, warning: false };
    return { focus: "Crescimento equilibrado", reason: "Desenvolva capacidades em todas as áreas enquanto acompanha o caixa.", urgent: false, warning: false };`);
 html=replaceMethod(html,'getMilestoneFocusAreas',`    if (!milestone) return "Crescimento equilibrado";
    const focusKeys = milestone.threshold ? Object.keys(milestone.threshold) : milestone.focus;
    if (!focusKeys || focusKeys.length === 0) return "Crescimento equilibrado";
    const focusMap = { sci: "Operações e Qualidade", dev: "Produção e Serviços", mkt: "Vendas e Marketing", hr: "Gestão de Pessoas" }, areas = focusKeys.map(key => focusMap[key] || key).slice(0, 2);
    return areas.length === 1 ? areas[0] : areas.length === 2 ? areas[0] + " e " + areas[1] : areas.join(", ");`);
 html=replaceMethod(html,'getMilestoneFocusReason',`    if (!milestone || !milestone.threshold) return "Concentre-se nos requisitos da meta.";
    const labels = { sci: "Operações e Qualidade", dev: "Produção e Serviços", mkt: "Vendas e Marketing", hr: "Gestão de Pessoas" }, gaps = [];
    Object.entries(milestone.threshold).forEach(([metric, target]) => { const current = this.metrics[metric] || 0, gap = target - current; if (gap > 0) gaps.push({ name: labels[metric] || metric, gap: Math.round(gap), percentAchieved: Math.round((current / target) * 100) }); });
    gaps.sort((a, b) => b.gap - a.gap);
    if (gaps.length === 0) return "Todos os indicadores estão no caminho certo — avance para concluir a meta.";
    const [first, second] = gaps;
    if (!second) return first.percentAchieved >= 80 ? first.name + " está quase lá — um esforço adicional conclui a meta." : first.percentAchieved >= 50 ? first.name + " precisa de mais atenção — o caminho já está pela metade." : "Priorize " + first.name + " — ainda falta progresso relevante.";
    if (first.percentAchieved >= 70 && second.percentAchieved >= 70) return "Quase lá em " + first.name + " e " + second.name + " — mantenha o ritmo.";
    return first.percentAchieved < 50 ? "Concentre-se em " + first.name + " (sua maior lacuna) e depois em " + second.name + "." : "Equilibre o esforço entre " + first.name + " e " + second.name + ".";`);
 html=replaceMethod(html,'renderStatsGuideTab',`    return \
      '<p class="text-slate-600 mb-5">Sua empresa acompanha quatro indicadores que afetam as capacidades disponíveis. Cada indicador varia de 0 a 100; eles representam o estado da operação no simulador, não uma avaliação externa.</p>' +
      '<div class="bg-emerald-50 rounded-xl p-5 border border-emerald-200 mb-4"><div class="flex items-center gap-3 mb-3"><span class="text-3xl">⚙️</span><div><h3 class="font-bold text-emerald-800 text-lg">Operações e Qualidade</h3><div class="text-sm text-emerald-600">Rigor de processo e conformidade</div></div></div><div class="space-y-2 text-emerald-900 text-sm"><p><strong>O que mede:</strong> a capacidade de padronizar, controlar e melhorar a operação.</p><p><strong>Como evolui:</strong> decisões de processo, qualificação da equipe e investimentos compatíveis com o empreendimento.</p><p><strong>Por que importa:</strong> contribui para metas que exigem qualidade, confiabilidade e execução.</p></div></div>' +
      '<div class="bg-sky-50 rounded-xl p-5 border border-sky-200 mb-4"><div class="flex items-center gap-3 mb-3"><span class="text-3xl">🛠️</span><div><h3 class="font-bold text-sky-800 text-lg">Produção e Serviços</h3><div class="text-sm text-sky-600">Capacidade de produzir e entregar</div></div></div><div class="space-y-2 text-sky-900 text-sm"><p><strong>O que mede:</strong> a capacidade de executar, entregar e manter o que foi vendido.</p><p><strong>Como evolui:</strong> equipe, equipamentos, processos e decisões operacionais.</p><p><strong>Por que importa:</strong> apoia prazos, atendimento e metas ligadas à entrega.</p></div></div>' +
      '<div class="bg-fuchsia-50 rounded-xl p-5 border border-fuchsia-200 mb-4"><div class="flex items-center gap-3 mb-3"><span class="text-3xl">📣</span><div><h3 class="font-bold text-fuchsia-800 text-lg">Vendas e Marketing</h3><div class="text-sm text-fuchsia-600">Relacionamento comercial e visibilidade</div></div></div><div class="space-y-2 text-fuchsia-900 text-sm"><p><strong>O que mede:</strong> a capacidade de alcançar clientes, construir reputação e converter oportunidades.</p><p><strong>Como evolui:</strong> ações comerciais, parcerias, comunicação e decisões que reforcem a confiança.</p><p><strong>Por que importa:</strong> abre canais comerciais e ajuda a sustentar o crescimento.</p></div></div>' +
      '<div class="bg-amber-50 rounded-xl p-5 border border-amber-200 mb-4"><div class="flex items-center gap-3 mb-3"><span class="text-3xl">👥</span><div><h3 class="font-bold text-amber-800 text-lg">Gestão de Pessoas</h3><div class="text-sm text-amber-600">Clima, desenvolvimento e organização da equipe</div></div></div><div class="space-y-2 text-amber-900 text-sm"><p><strong>O que mede:</strong> a capacidade de manter uma equipe organizada, saudável e produtiva.</p><p><strong>Como evolui:</strong> decisões de pessoas, desenvolvimento e prevenção de sobrecarga.</p><p><strong>Por que importa:</strong> impacto baixo pode dificultar contratações e reduzir a produtividade.</p><p><strong>📊 ClearView:</strong> reúne sinais internos de satisfação da equipe. Acompanhe a aba para observar a capacidade de apoio às pessoas.</p></div></div>' +
      '<div class="bg-slate-100 rounded-xl p-5 border border-slate-300"><h3 class="font-bold text-slate-800 text-lg mb-3">⚖️ Equilíbrio entre indicadores</h3><div class="space-y-2 text-slate-700 text-sm"><p>As decisões geralmente envolvem compensações. Não há uma estratégia única que sirva para todos os empreendimentos.</p><ul class="list-disc list-inside space-y-1 ml-2"><li><strong>Operações e Qualidade:</strong> mais consistência e controle.</li><li><strong>Produção e Serviços:</strong> maior capacidade de executar e entregar.</li><li><strong>Vendas e Marketing:</strong> maior presença e relacionamento comercial.</li><li><strong>Equilíbrio:</strong> progresso gradual com menor concentração de riscos.</li></ul></div></div>';`);
 html=replaceMethod(html,'startNegotiation',`    const candidate = this.currentCandidates.find(c => c.id === candidateId);
    if (!candidate || (this.declinedCandidates || []).includes(candidateId)) return;
    this.negotiatingCandidate = candidate;
    const expected = candidate.adjustedSalaryExpect || candidate.salaryExpect;
    if (!expected) return;
    const minimum = Math.max(20, Math.floor(expected.min * 0.7));
    const maximum = Math.ceil(expected.max * 1.2);
    const content = document.getElementById('negotiationContent');
    content.innerHTML = '<div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-2xl"><h2 class="font-bold text-white text-lg">💼 Proposta de contratação</h2><p class="text-indigo-100 text-sm">para ' + candidate.name + '</p></div><div class="p-6"><div class="bg-slate-50 rounded-lg p-3 mb-5 text-sm"><div class="font-medium text-slate-700 mb-1">Faixa salarial de referência</div><div class="text-slate-600">R$ ' + expected.min + ' mil – R$ ' + expected.max + ' mil por ano</div></div><div class="mb-5"><label class="block text-sm font-bold text-slate-700 mb-2">💵 Proposta salarial anual</label><div class="flex items-center gap-4"><input type="range" id="offerSalary" min="' + minimum + '" max="' + maximum + '" value="' + expected.ideal + '" class="flex-1" oninput="game.updateOfferPreview()"><div class="font-mono font-bold text-lg text-slate-800 w-24">R$ <span id="offerSalaryDisplay">' + expected.ideal + '</span> mil</div></div><div class="flex justify-between text-xs text-slate-400 mt-1"><span>Mínimo: R$ ' + minimum + ' mil</span><span>Faixa: R$ ' + expected.min + '–' + expected.max + ' mil</span></div><div class="text-xs text-slate-500 mt-1">Custo trimestral: +R$ <span id="offerQuarterlyCost">' + Math.round(expected.ideal / 4) + '</span> mil</div></div><div id="offerAssessment" class="mb-5 p-4 rounded-lg bg-blue-50 border border-blue-200"></div><div class="p-3 bg-slate-50 rounded-lg text-sm"><div class="flex items-center justify-between"><span class="text-slate-600">📅 Início previsto:</span><span class="font-medium text-slate-800">' + (candidate.availability === '3 months' ? 'em até dois trimestres' : 'no próximo trimestre') + '</span></div></div></div><div class="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex gap-3"><button onclick="game.closeNegotiation()" class="flex-1 px-4 py-2.5 border border-slate-300 text-slate-600 rounded-lg hover:bg-white">Cancelar</button><button onclick="game.submitOffer()" class="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg">Enviar proposta</button></div>';
    this.updateOfferPreview();
    document.getElementById('negotiationModal').classList.remove('hidden');
    document.getElementById('negotiationModal').classList.add('flex');`);
 html=replaceMethod(html,'updateOfferPreview',`    const salaryEl = document.getElementById('offerSalary'), candidate = this.negotiatingCandidate;
    if (!salaryEl || !candidate) return;
    const salary = parseInt(salaryEl.value), expected = candidate.adjustedSalaryExpect || candidate.salaryExpect;
    document.getElementById('offerSalaryDisplay').textContent = salary;
    document.getElementById('offerQuarterlyCost').textContent = Math.round(salary / 4);
    const interest = candidate.adjustedInterest || candidate.interest || 0.5;
    const salaryScore = salary >= expected.ideal ? 1 : salary >= expected.min ? 0.6 : salary >= expected.min * 0.85 ? 0.25 : 0;
    const score = salaryScore * 0.75 + interest * 0.25, assessment = document.getElementById('offerAssessment');
    if (score >= 0.8) assessment.innerHTML = '<div class="font-medium text-emerald-800">Proposta competitiva</div><p class="text-sm text-emerald-700">A remuneração e o interesse atual indicam boa chance de aceite.</p>';
    else if (score >= 0.5) assessment.innerHTML = '<div class="font-medium text-blue-800">Proposta em avaliação</div><p class="text-sm text-blue-700">A pessoa candidata pode aceitar ou recusar conforme as condições.</p>';
    else assessment.innerHTML = '<div class="font-medium text-amber-800">Proposta abaixo da referência</div><p class="text-sm text-amber-700">A chance de recusa é maior.</p>';`);
 html=replaceMethod(html,'submitOffer',`    const salaryEl = document.getElementById('offerSalary'), candidate = this.negotiatingCandidate;
    if (!salaryEl || !candidate || !candidate.salaryExpect) return;
    const salary = Math.min(200, parseInt(salaryEl.value)), expected = candidate.adjustedSalaryExpect || candidate.salaryExpect;
    const salaryScore = salary >= expected.ideal ? 1 : salary >= expected.min ? 0.6 : salary >= expected.min * 0.85 ? 0.25 : 0;
    const interest = candidate.adjustedInterest || candidate.interest || 0.5;
    const acceptChance = salaryScore * 0.75 + interest * 0.25;
    if (Math.random() < acceptChance * 0.85) this.hireCandidate(candidate, salary, 0);
    else this.showDecline(candidate);`);
 html=replaceMethod(html,'hireCandidate',body=>replaceExactInBody(body,`      // Track equity grant for cap table
      this.equityGrants = this.equityGrants || [];
      this.equityGrants.push({
        name: candidate.name,
        role: (candidate.seniority || 'new') + ' hire',
        equity: equity,
        vestingYears: 4,
        cliff: 1,
        grantedQuarter: this.turn
      });
      // CT-1 FIX: Recalc founder equity when grant is added
      this.recalcFounderEquity();`,`      // Contratações novas não recebem participação. O bloco continua lendo
      // concessões antigas para manter saves anteriores compatíveis.
      if (equity > 0) {
        this.equityGrants = this.equityGrants || [];
        this.equityGrants.push({
          name: candidate.name,
          role: (candidate.seniority || 'new') + ' hire',
          equity: equity,
          vestingYears: 4,
          cliff: 1,
          grantedQuarter: this.turn
        });
      }
      this.recalcFounderEquity();`,'registro de participação de nova contratação'));
 html=replaceMethod(html,'renderCandidateCard',body=>replaceExactInBody(body,`        <div class="bg-white/60 rounded-lg p-3 mb-3">
          <div class="text-xs text-slate-500 mb-1">Salary & Equity Expectations</div>
          <div class="flex justify-between text-sm">
            <span class="font-medium text-slate-700">💷 £\${candidate.salaryExpect.min}k - £\${candidate.salaryExpect.max}k</span>
            <span class="font-medium text-slate-700">📊 \${candidate.equityExpect.min}% - \${candidate.equityExpect.max}%</span>
          </div>
        </div>`,`        <div class="bg-white/60 rounded-lg p-3 mb-3">
          <div class="text-xs text-slate-500 mb-1">Faixa salarial de referência</div>
          <div class="text-sm"><span class="font-medium text-slate-700">💵 R$ \${candidate.salaryExpect.min} mil – R$ \${candidate.salaryExpect.max} mil por ano</span></div>
        </div>`,'faixa salarial no cartão'));
 html=replaceMethod(html,'showCandidateDetail',body=>{
  body=replaceAllPresent(body,[
   ["'Very High'","'Muito alto'"],["'High'","'Alto'"],["'Moderate'","'Moderado'"],["'Low'","'Baixo'"],["'Very Low'","'Muito baixo'"],
   ["'Available immediately'","'Disponível agora'"],["'1 month notice'","'Aviso de 1 mês'"],["'3 month notice'","'Aviso de 3 meses'"],
   ['>Interest<','>Interesse<'],['>Level<','>Experiência<'],['>Non-compete<','>Restrição contratual<'],['Compensation Expectations','Remuneração de referência'],['>Salary<','>Salário<'],['>Education<','>Formação<'],['>Experience<','>Experiência<'],['>Achievements<','>Realizações<'],['>Skills<','>Competências<'],['>Strengths<','>Pontos fortes<'],['>Watch Out<','>Pontos de atenção<'],['>Personality<','>Perfil<'],['>Back</button>','>Voltar</button>'],['>Declined','>Recusou'],['>Make Offer','>Fazer proposta']
  ]);
  return replaceExactInBody(body,`            <div>
              <div class="text-slate-500 mb-1">Equity</div>
              <div class="font-bold text-slate-800">\${candidate.equityExpect.min}% - \${candidate.equityExpect.max}%</div>
              <div class="text-xs text-indigo-600">Ideal: \${candidate.equityExpect.ideal}%</div>
            </div>`,``, 'participação no currículo de candidato');
 });
 html=replaceMethod(html,'renderClearViewTab',body=>replaceAllPresent(body,[
  ["this.company?.name || 'Your Startup'","this.company?.name || 'Seu empreendimento'"],
  ['Employee Sentiment Dashboard','Painel de percepção da equipe'],['Like Glassdoor, for your startup','Indicadores internos da equipe'],[' reviews',' avaliações'],['Would recommend to a friend','Recomendaria a alguém'],['Approve of CEO','Aprova a liderança'],['Company Outlook','Perspectiva da equipe'],['Leadership & Vision','Liderança e direção'],['Compensation & Equity','Remuneração e reconhecimento'],['Work-Life Balance','Equilíbrio de trabalho'],['Career Growth','Desenvolvimento profissional'],['Culture & Values','Cultura e valores'],['Runway Concerns','Atenção ao caixa'],["\"There's anxiety about whether we'll make it\"",'"Há preocupação sobre a continuidade da operação"'],['Job Security','Percepção de estabilidade'],["\"Feels stable and well-funded\"",'"A operação parece estável"'],["\"Typical startup uncertainty\"",'"Há incerteza comum em uma operação em crescimento"'],['Recent Employee Reviews','Percepções recentes da equipe'],['Running Hot: ','Sobrecarga: '],['No Head of People','Sem responsável por pessoas'],['Unlocks after completing Milestone 1','Disponível após concluir a Meta 1'],['People Team Overwhelmed','Gestão de pessoas sobrecarregada'],['People Team Stretched','Capacidade de gestão de pessoas limitada'],['No Head of People Yet','Ainda não há responsável por pessoas'],['ClearView affects your business:','O ClearView afeta a operação:']
 ]));
 html=replaceMethod(html,'showSituationBrief',body=>replaceAllRequired(body,[
  ['`Ch.${chapterInfo.num}`','`Cap. ${chapterInfo.num}`'],['`Q${quarter} of ${totalQuarters}`','`T${quarter} de ${totalQuarters}`'],['`Year ${year}`','`Ano ${year}`'],["`${runway} quarter${runway !== 1 ? 's' : ''}`","`${runway} trimestre${runway !== 1 ? 's' : ''}`"],
  ['⚠️ LAST CHANCE: Raise funding or cut costs NOW or game over!','⚠️ ÚLTIMA CHANCE: obtenha recursos ou reduza despesas agora para evitar o encerramento.'],['🚨 Critical! Raise funding immediately','🚨 Situação crítica. Obtenha recursos imediatamente.'],['⚠️ Low runway - consider fundraising soon','⚠️ Autonomia baixa — considere financiamento em breve'],
  ['"⏰ Final quarter!"','"⏰ Último trimestre!"'],["`⏰ ${quartersLeft} quarter${quartersLeft !== 1 ? 's' : ''} remaining`","`⏰ Restam ${quartersLeft} trimestre${quartersLeft !== 1 ? 's' : ''}`"],['"No active milestone"','"Nenhuma meta ativa"']
 ]));
 return html;
}
module.exports={apply};
