const acorn=require('acorn'),walk=require('acorn-walk');
const setup=require('../locales/management-setup.pt-BR.json');
const tutorials=require('../locales/tutorial.pt-BR.json');
const coaching=require('../locales/coaching-topics.pt-BR.json');
const text=value=>JSON.stringify(value).replaceAll('<','\\u003c');
function literal(n){
 if(n.type==='Literal')return n.value;
 if(n.type==='UnaryExpression'&&n.operator==='-')return -literal(n.argument);
 if(n.type==='ArrayExpression')return n.elements.map(literal);
 if(n.type==='ObjectExpression')return Object.fromEntries(n.properties.map(p=>[p.key.name??p.key.value,literal(p.value)]));
 if(n.type==='TemplateLiteral'&&!n.expressions.length)return n.quasis[0].value.cooked;
 throw new Error('Dado não literal no lote L2b: '+n.type);
}
function once(body,before,after){
 const start=body.indexOf(before);
 if(start<0||body.indexOf(before,start+before.length)!==-1)throw new Error('Âncora L2b ausente/ambígua: '+before.slice(0,100));
 return body.slice(0,start)+after+body.slice(start+before.length);
}
function apply(html){
 const changes=[],seen=new Set();
 const methods={
  showLocationModal:()=> 'SlingshotManagement.renderLocations(this);',
  selectLocation:()=> 'return SlingshotManagement.selectLocation(this,id);',
  showLocationInfo:()=> 'SlingshotManagement.locationInfo(this,locationId);',
  renderHireColumn:()=> 'SlingshotManagement.renderLeaders(this,containerId,role);',
  selectExec:()=> 'return SlingshotManagement.selectLeader(this,execId,role);',
  hireExec:()=> 'return this.selectExec(execId,role);',
  startExecNegotiation:()=> 'return this.selectExec(execId,role);',
  updateHiringStatus:()=> 'SlingshotManagement.hiringStatus(this);',
  showExecCV:()=> 'SlingshotManagement.cv(this,execId,role);',
  showHRModal:()=> 'SlingshotManagement.showHR(this);',
  selectHRExec:()=> 'return SlingshotManagement.hireHR(this,execId);',
  hireHRExec:()=> 'return SlingshotManagement.hireHR(this,execId);',
  showFundingPathwayHelp:()=> 'SlingshotManagement.fundingHelp();',
  startGame:body=>{
   body=once(body,'const salaryMod = this.location ? (1 + this.location.salaryMod) : 1;','SlingshotManagement.begin(this);\n    const salaryMod = this.location ? (1 + this.location.salaryMod) : 1;');
   body=once(body,'const roleLabels = { research: "Research", dev: "Product", marketing: "Sales & Marketing" };','const roleLabels = SlingshotManagement.roles;');
   body=body.replace('Based in ${this.location.name}. Your local ecosystem will shape your journey.','Localidade: ${this.location.name}. Os efeitos locais acompanham a operação.').replace('Your ${this.founder.profile.name.toLowerCase()} background gives you a head start with grant applications.','O perfil ${this.founder.profile.name.toLowerCase()} acrescenta experiência em pedidos de fomento na simulação.').replace('takes the helm.','assume a gestão.').replace('Leadership team hired. ${this.equityGrants.reduce((s, g) => s + g.equity, 0).toFixed(1)}% equity granted.','Equipe de gestão contratada. Remuneração salarial registrada nas despesas fixas.');
   return 'if(this.gameStarted)return;\n'+body;
  },
  saveGame:body=>once(body,"version: '1.3',","version: '1.3',\n        brManagement: this.brManagement || null,"),
  loadGame:body=>once(body,'this.location = s.location;','this.location = s.location;\n      this.brManagement = s.brManagement ? JSON.parse(JSON.stringify(s.brManagement)) : null;'),
  calculateQuarterlyRevenue:body=>{
   body=once(body,'const netContribution = Math.min(grossRevenue - supportCosts, grossRevenue * maxEfficiency);','const netContribution = Math.min(grossRevenue - supportCosts, grossRevenue * maxEfficiency);\n    const brazil = SlingshotManagement.revenue(this,grossRevenue,supportCosts,maxEfficiency);');
   body=once(body,'this.quarterlySupportCosts = Math.round(supportCosts);','this.quarterlySupportCosts = brazil ? brazil.support : Math.round(supportCosts);');
   return once(body,'return {\n      gross: Math.round(grossRevenue),','return brazil || {\n      gross: Math.round(grossRevenue),');
  },
  calculateHiddenRevenueModifiers:body=>once(body,'return modifiers;','return SlingshotManagement.modifiers(this,modifiers);'),
  processPipeline:body=>once(body,'if (quartersInPipeline >= deal.closeIn) {','if (quartersInPipeline >= deal.closeIn + SlingshotManagement.timing(this)) {'),
  generateCandidates:body=>{
   const origin='const candidateCity = inferCandidateCity(c);';
   if(body.split(origin).length!==3)throw new Error('Esperados dois filtros de localização de candidatos');
   body=body.replaceAll(origin,"const candidateCity = this.location?.id?.startsWith('br_') ? this.location.id : inferCandidateCity(c);");
   body=once(body,"let salaryMod = 1.0;\n      if (locationTier === 'london') {", "let salaryMod = 1.0;\n      if (this.location?.id?.startsWith('br_')) {\n        salaryMod=1+this.location.salaryMod;\n      } else if (locationTier === 'london') {");
   body=once(body,'locationInterestMod,\n        adjustedSalaryExpect:',"locationInterestMod,\n        currentCity: candidateCity,\n        origin: this.location?.id?.startsWith('br_') ? 'Candidatura local — cenário fictício' : c.origin,\n        adjustedSalaryExpect:");
   return once(body,'let adjustedInterest = c.interest + (c.locationInterestMod || 0);','let adjustedInterest = c.interest + (c.locationInterestMod || 0) + SlingshotManagement.hiringInterest(this);');
  },
  updateHiringWizard:body=>body.replace('"Starting..."','"Equipe selecionada"').replace('"Select to Continue"','"Selecione para continuar"').replace('"Next →"','"Avançar →"'),
  renderExecRow:body=>once(body,'const labels = { research: "Research", dev: "Product", marketing: "Sales & Mktg", hr: "People" };','const labels = SlingshotManagement.roles;'),
  renderMilestoneAdvisorPanel:()=> 'SlingshotManagement.milestoneAdvice(this,milestoneData,completedCount);',
  showMilestoneModal:body=>{
   body=body.replace('if (this.team.research && this.funder) {','if (false) {');
   const pairs={
    'Choose Your First Milestone':'Escolha sua primeira meta','Choose Your Second Milestone':'Escolha sua segunda meta','Choose Your Final Milestone':'Escolha sua meta final',
    'Your first major goal. Conservative is safer, Ambitious pays more but demands tight execution.':'Compare requisitos, prazo e recompensa. Uma meta ambiciosa exige execução mais rigorosa.',
    "You've proven yourself. Now scale up—your team's strengths and runway should guide this choice.":'Escolha o próximo objetivo de acordo com as competências da equipe e o caixa disponível.',
    "The endgame approaches. This milestone will define your company's legacy.":'Consolide a operação e conclua a última meta dentro do prazo.',
    '"Research"':'"Operações e Qualidade"','"Product"':'"Produção e Serviços"','"Sales & Marketing"':'"Vendas e Marketing"','"People"':'"Gestão de Pessoas"',
    '🛡 Conservative':'🛡 Conservadora','⚖ Balanced':'⚖ Equilibrada','🔥 Ambitious':'🔥 Ambiciosa','No active competitors':'Sem concorrentes ativos','rivals competing here':'concorrentes nesta área','1 rival strong here':'1 concorrente forte nesta área','Less competition':'Menor concorrência',
    'Competitor Intel':'Inteligência da concorrência','⏱ Timeline':'⏱ Prazo','${m.time} quarters':'${m.time} trimestres','+£${m.reward.val}k':'+R$ ${m.reward.val} mil','Valuation Boost':'Aumento na avaliação do negócio','Choose This Path':'Escolher esta meta'
   };
   for(const [a,b]of Object.entries(pairs)){if(!body.includes(a))throw new Error('Texto de meta ausente: '+a);body=body.replaceAll(a,b);}
   return once(body,'<div class="text-xs text-blue-700">Aumento na avaliação do negócio</div>','<div class="text-xs text-blue-700">Aumento na avaliação do negócio</div><div class="text-xs mt-2">Bônus didático de caixa: R$ ${m.reward.cash} mil</div>');
  },
  startBeginnerTutorial:body=>body.replace('"Full Tutorial"','"Tutorial completo"'),
  startQuickTutorial:body=>body.replace('"Quick Start Guide"','"Guia rápido"'),
  getTutorialTotalSteps:()=> 'return this.getCurrentTopicList().length;',
  getTutorialContent:()=> 'const id=this.getCurrentTopicList()[step-1];const topic=this.tutorialTopics[id];return topic?`<h2 class="text-2xl font-bold mb-4">${topic.icon} ${topic.title}</h2>${topic.summary}<div class="mt-4">${topic.more}</div>`:"";',
  getBeginnerTutorialContent:()=> 'return this.getTutorialContent(step);',
  renderTutorialStep:body=>body.replace('"Choose Your Game →"','"Escolher modo de jogo →"').replace('"Next →"','"Avançar →"'),
  updateTutorialReadCounter:body=>body.replace('${read} of ${total} topics read','${read} de ${total} tópicos lidos').replace('🎓 All Topics Read - Start Playing!','📋 Todos os tópicos lidos — Iniciar!').replace('🚀 Start Playing (${total - read} unread)','Iniciar (${total - read} não lidos)').replace('🚀 Start Playing','Iniciar')
 };
 const functions={getLocations:()=> 'return SlingshotManagement.locations(ventureId);',getExecutives:()=> 'return SlingshotManagement.executives(category);',getLocationTier:body=>'const br=SlingshotManagement.locations().find(c=>c.id===locationId);if(br)return br.tier;\n'+body};
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  const code=m[2],offset=m.index+m[0].indexOf('>')+1;
  const edit=(id,start,end,value)=>{if(seen.has(id))throw new Error('Âncora L2b duplicada: '+id);seen.add(id);changes.push({start:offset+start,end:offset+end,value});};
  walk.ancestor(acorn.parse(code,{ecmaVersion:'latest'}),{
   MethodDefinition(n,parents){if(parents.some(p=>p.type==='ClassDeclaration'&&p.id?.name==='Game')&&methods[n.key.name])edit('method:'+n.key.name,n.value.body.start+1,n.value.body.end-1,methods[n.key.name](code.slice(n.value.body.start+1,n.value.body.end-1)).replace(/[ \t]+(?=\r?\n)/g,''));},
   FunctionDeclaration(n){if(functions[n.id?.name])edit('function:'+n.id.name,n.body.start+1,n.body.end-1,functions[n.id.name](code.slice(n.body.start+1,n.body.end-1)));},
   VariableDeclarator(n){
    const name=n.id.name;
    if(name==='EXECUTIVES'||name==='HR_EXECS'){
     const byRole=role=>Object.values(setup.executives).filter(e=>e.role===role);
     edit('data:'+name,n.init.start,n.init.end,text(name==='HR_EXECS'?byRole('hr'):Object.fromEntries(['research','dev','marketing'].map(role=>[role,byRole(role)]))));
    }
    if(name==='STAT_LABELS'){const labels=literal(n.init);Object.assign(labels,setup.metrics,{cash:'Caixa',val:'Avaliação',burn:'Despesas fixas',staff:'Equipe',equity:'Participação'});edit('data:'+name,n.init.start,n.init.end,text(labels));}
    if(name==='MILESTONES'){
     const all=literal(n.init);
     for(const stages of Object.values(all)){
      stages.m1=stages.m1.map((m,i)=>{const b=setup.milestones[i];return {...m,name:b.name,desc:b.desc,focus:b.focus,threshold:b.threshold,time:b.time,icon:b.icon,reward:{...m.reward,val:b.val}};});
      for(const stage of ['m2','m3'])stages[stage]=stages[stage].map((m,i)=>({...m,name:stage==='m2'?['Padronização da operação','Expansão planejada','Ampliação da carteira de clientes'][i]:['Operação consolidada','Replicação do negócio','Presença ampliada no mercado'][i],desc:stage==='m2'?'Fortaleça as competências indicadas para sustentar a rotina, cumprir entregas e desenvolver o mercado.':'Consolide as competências indicadas e a organização da equipe para sustentar o crescimento do negócio.',icon:['📋','⚙️','📈'][i]}));
     }
     edit('data:'+name,n.init.start,n.init.end,text(all));
    }
   },
   PropertyDefinition(n,parents){
    if(!parents.some(p=>p.type==='ClassDeclaration'&&p.id?.name==='Game'))return;
    const key=n.key.name;
    if(key==='tutorialTopics')edit('property:'+key,n.value.start,n.value.end,text(tutorials));
    if(key==='topicCards')edit('property:'+key,n.value.start,n.value.end,text(Object.fromEntries(Object.entries(tutorials).map(([id,t])=>[id,{icon:t.icon,bgClass:'bg-indigo-600',hoverBorder:'hover:border-indigo-400',desc:t.subtitle}]))));
    if(key==='coachingTips'){
     const tips=literal(n.value);
     for(const [id,t]of Object.entries(tips)){
      if(!Object.hasOwn(coaching,id))throw new Error('Ajuda guiada sem adaptação: '+id);
      const topic=tutorials[coaching[id]];
      if(topic){t.title=topic.title;t.content=topic.summary+'<div class="mt-4">'+topic.more+'</div>';}
     }
     edit('property:'+key,n.value.start,n.value.end,text(tips));
    }
   }
  });
 }
 for(const id of [...Object.keys(methods).map(k=>'method:'+k),...Object.keys(functions).map(k=>'function:'+k),...['EXECUTIVES','HR_EXECS','STAT_LABELS','MILESTONES'].map(k=>'data:'+k),...['tutorialTopics','topicCards','coachingTips'].map(k=>'property:'+k)])if(!seen.has(id))throw new Error('Âncora L2b ausente: '+id);
 for(const e of changes.sort((a,b)=>b.start-a.start))html=html.slice(0,e.start)+e.value+html.slice(e.end);
 return html;
}
module.exports={apply};
