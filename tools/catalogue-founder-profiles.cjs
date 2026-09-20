const fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const translations=`academic|name|O acadêmico
academic|title|Do doutorado à criação de uma empresa
academic|slogan|Da bancada do laboratório ao lançamento
academic|desc|Você passou anos no laboratório, publicando artigos e ampliando as fronteiras do conhecimento. Agora está transformando esse conhecimento em uma empresa. Você domina a ciência, mas o mundo dos negócios é um território novo.
academic|strengths|Credibilidade técnica sólida, rede de pesquisa, rigor científico
academic|challenges|Visão comercial, relacionamento com investidores, agir no ritmo de uma startup
academic|difficulty|Média
academic|playstyle|Pesquisa em primeiro lugar, progresso metódico
academic|bestFor|Jogadores que gostam de construir bases técnicas sólidas antes de comercializar
academic|famousExamples|Demis Hassabis (DeepMind), Hermann Hauser (Arm, Amadeus), Sophie Wilson (Arm)
academic|gameplayTips.0|Seus contatos universitários facilitam bastante as propostas de fomento — aproveite essa vantagem desde o início
academic|gameplayTips.1|Parceiros acadêmicos procurarão você ativamente; você terá acesso a colaborações de pesquisa de alto nível
academic|gameplayTips.2|Investidores podem questionar sua visão comercial — considere contratar um assessor com foco em negócios
academic|gameplayTips.3|Seu rigor científico é uma vantagem em tecnologias de base científica avançada, mas pode atrasar você em mercados que mudam rapidamente
academic|grantAdvantage|Forte — As universidades acolhem você e os avaliadores confiam em suas credenciais de pesquisa
academic|fundraisingStyle|Melhor com investidores de capital de risco (VCs) especializados em tecnologias de base científica avançada, que valorizam a excelência técnica acima da expansão rápida
academic|hiringEdge|Atrai profissionais voltados à pesquisa; pode ter dificuldade para recrutar vendedores de perfil agressivo
academic|riskProfile|Menor risco técnico, maior risco comercial — você desenvolverá algo concreto, mas vendê-lo será o desafio
serial|name|O empreendedor recorrente
serial|title|Já passou por isso
serial|slogan|Aprendeu com os fracassos, pronto para vencer
serial|desc|Esta não é sua primeira experiência. Você já criou empresas — algumas deram certo, outras não — e aprendeu com todas. Você conhece o funcionamento do jogo, mas cada startup é diferente.
serial|strengths|Relacionamento com investidores, reconhecimento de padrões, gestão de crises
serial|challenges|Evitar estratégias antigas inadequadas, manter a humildade, aprofundar o conhecimento técnico
serial|difficulty|Fácil
serial|playstyle|Decisões equilibradas e baseadas na experiência
serial|bestFor|Jogadores que querem um começo mais tolerante a erros e bom acesso a investidores
serial|famousExamples|Mike Lynch (Autonomy, Darktrace), Brent Hoberman (Lastminute.com, Made.com), Alex Chesterman (Zoopla, Cazoo)
serial|gameplayTips.0|Seu histórico abre portas com investidores — muitas vezes você pode dispensar rodadas com investidores-anjo e procurar diretamente investidores de capital de risco (VCs)
serial|gameplayTips.1|Avaliadores de fomento valorizam sua experiência; você começa com uma credibilidade que os iniciantes precisam conquistar
serial|gameplayTips.2|Cuidado para não aplicar soluções antigas a problemas novos — o cenário de IA muda rapidamente
serial|gameplayTips.3|Sua rede de contatos é seu superpoder — use-a para contratar, formar parcerias e conseguir apresentações por pessoas conhecidas
serial|grantAdvantage|Moderada — Você já fez isso antes e os avaliadores reconhecem sua capacidade
serial|fundraisingStyle|Caminho mais fácil para captar recursos — seu histórico fala por si
serial|hiringEdge|Boa reputação como empregador; candidatos confiam em sua experiência anterior
serial|riskProfile|Equilibrado — a experiência reduz a maioria dos riscos, mas o excesso de confiança pode ser seu ponto cego
corporate|name|O executivo que deixou a grande empresa
corporate|title|Ex-executivo de uma grande empresa de tecnologia
corporate|slogan|Trocando conforto por controle
corporate|desc|Você avançou na carreira em uma grande empresa de tecnologia e aprendeu como grandes organizações funcionam. Agora troca estabilidade por autonomia. Você conhece processos e operações em escala, mas as startups seguem outras regras.
corporate|strengths|Excelência operacional, vendas empresariais, redes profissionais
corporate|challenges|Executar com poucos recursos, tolerar ambiguidades, pensar como fundador
corporate|difficulty|Média a difícil
corporate|playstyle|Orientação por processos e foco no mercado empresarial
corporate|bestFor|Jogadores que miram mercados B2B de grandes empresas e valorizam a execução estruturada
corporate|famousExamples|Ronan Dunne (da O2 à Verizon), Carolyn McCall (do Guardian à easyJet), Andy Palmer (da Nissan à Aston Martin)
corporate|gameplayTips.0|Sua rede corporativa vale ouro nas vendas empresariais — use esses relacionamentos para conquistar os primeiros clientes
corporate|gameplayTips.1|Parceiros empresariais em projetos de fomento confiarão em você; você fala a língua deles
corporate|gameplayTips.2|Você pode tornar os processos complexos demais no início — startups precisam de velocidade mais do que de perfeição
corporate|gameplayTips.3|Desapegue-se das redes de proteção das grandes empresas — aqui, não há outra pessoa para detectar os erros por você
corporate|grantAdvantage|Voltada ao setor empresarial — Seus contatos corporativos facilitam parcerias com empresas
corporate|fundraisingStyle|Bom desempenho com investidores focados em B2B; investidores de capital de risco voltados ao consumidor podem questionar sua capacidade de fazer muito com pouco
corporate|hiringEdge|Atrai profissionais em busca de estabilidade; pode ter dificuldade com perfis independentes que assumem riscos
corporate|riskProfile|Base operacional sólida, mas adaptar-se ao caos de uma startup é seu maior teste
prodigy|name|O prodígio técnico
prodigy|title|Um criador excepcional
prodigy|slogan|Programar é meu superpoder
prodigy|desc|Você programa desde os doze anos e consegue construir quase tudo. Os problemas técnicos se rendem a você. Os problemas com pessoas são mais complicados. Sua aposta é que suas habilidades sustentarão a empresa.
prodigy|strengths|Excelência técnica, prototipagem rápida, intuição de produto
prodigy|challenges|Delegar, manter o foco comercial, ter paciência com questões não técnicas
prodigy|difficulty|Difícil
prodigy|playstyle|Construção em primeiro lugar, excelência técnica
prodigy|bestFor|Jogadores experientes que conseguem compensar habilidades comerciais limitadas
prodigy|famousExamples|Nick D'Aloisio (Summly), Mustafa Suleyman (DeepMind), Tom Sherrington (GoCardless)
prodigy|gameplayTips.0|Sua vantagem técnica permite construir mais rápido e com menor custo — use isso para superar os concorrentes
prodigy|gameplayTips.1|Contrate profissionais comerciais cedo — sem ajuda, você criará coisas incríveis que ninguém compra
prodigy|gameplayTips.2|Investidores podem subestimar sua liderança — prove sua capacidade com execução, não com palavras
prodigy|gameplayTips.3|Propostas de fomento exigem justificativas de negócio, não apenas brilhantismo técnico — procure ajuda nessa parte
prodigy|grantAdvantage|Fraca no papel — Os avaliadores questionam sua viabilidade comercial até que seja comprovada
prodigy|fundraisingStyle|Demonstre em vez de apenas falar — suas demonstrações e protótipos dizem mais do que apresentações de captação
prodigy|hiringEdge|Profissionais técnicos respeitam você; candidatos da área de negócios podem duvidar de sua liderança
prodigy|riskProfile|Alto risco comercial — você criará algo brilhante, mas conseguirá vender?
dealmaker|name|O negociador
dealmaker|title|Especialista em vendas e parcerias
dealmaker|slogan|Relacionamentos abrem todas as portas
dealmaker|desc|Você conseguiria vender gelo para pinguins. Sua carreira foi construída com relacionamentos, negociações e fechamento de negócios. Você encontrará clientes e parceiros, mas precisará confiar em outras pessoas para desenvolver o produto.
dealmaker|strengths|Aquisição de clientes, acordos de parceria, apresentações para captação de recursos
dealmaker|challenges|Avaliação técnica, detalhes do produto, paciência operacional
dealmaker|difficulty|Média
dealmaker|playstyle|Receita em primeiro lugar, orientação por relacionamentos
dealmaker|bestFor|Jogadores que gostam da atividade comercial e conseguem contratar bons profissionais técnicos
dealmaker|famousExamples|Richard Branson (Virgin), Michael Spencer (ICAP), Stelios Haji-Ioannou (easyJet)
dealmaker|gameplayTips.0|Suas habilidades de venda geram receita cedo — use isso para reduzir a dependência de financiamento
dealmaker|gameplayTips.1|Associe-se a um cofundador técnico ou diretor de tecnologia (CTO) competente; sem ele, você prometerá mais do que consegue entregar
dealmaker|gameplayTips.2|Investidores gostam de sua energia, mas investigarão seu conhecimento técnico — prepare-se
dealmaker|gameplayTips.3|Avaliadores de fomento podem questionar sua credibilidade técnica — parceiros acadêmicos ajudam nesse ponto
dealmaker|grantAdvantage|Moderada — Sua habilidade para formar parcerias ajuda, mas a credibilidade técnica precisa de apoio
dealmaker|fundraisingStyle|Apresentador nato — você conquistará investidores, mas garanta que haja conteúdo por trás do estilo
dealmaker|hiringEdge|Ótimo em apresentar a visão; candidatos técnicos vão querer conhecer primeiro quem lidera o produto
dealmaker|riskProfile|Baixo risco comercial, alto risco técnico — você venderá antes de construir
operator|name|O gestor de operações
operator|title|De diretor de operações (COO) a diretor executivo (CEO)
operator|slogan|A execução supera a estratégia
operator|desc|Você faz as coisas funcionarem. Processos, sistemas, equipes — você já melhorou todos eles. Administrou operações de empresas em crescimento e agora quer dirigir a sua. Executar é seu superpoder.
operator|strengths|Expansão eficiente, gestão de equipes, controle de custos
operator|challenges|Definir uma visão, inovar tecnicamente, comunicar a proposta ao público externo
operator|difficulty|Média
operator|playstyle|Foco em eficiência, crescimento sistemático
operator|bestFor|Jogadores que preferem otimizar a inovar
operator|famousExamples|Carolyn McCall (easyJet), Sharon White (John Lewis), Keith Weed (diretor de marketing — CMO — da Unilever)
operator|gameplayTips.0|Sua excelência operacional se destaca em escala — mas primeiro você precisa ter algo para expandir
operator|gameplayTips.1|Associe-se a um cofundador visionário ou técnico que possa definir a direção
operator|gameplayTips.2|Você terá o consumo de caixa mais eficiente do jogo — aproveite essa vantagem de tempo até o caixa acabar
operator|gameplayTips.3|Investidores valorizam sua execução, mas querem ver que você também consegue inspirar, não apenas administrar
operator|grantAdvantage|Neutra — Você conduzirá bem os projetos, mas precisa de parceiros para ter credibilidade em pesquisa
operator|fundraisingStyle|Executor confiável — os investidores sabem que você usará o dinheiro deles com critério
operator|hiringEdge|Boa reputação como gestor; candidatos esperam uma empresa bem administrada
operator|riskProfile|Baixo risco operacional, mas encontrar o ajuste entre produto e mercado exige uma criatividade que talvez lhe falte
domain|name|O especialista no setor
domain|title|Conhece o setor por dentro
domain|slogan|Conheço os segredos dos bastidores
domain|desc|Você passou décadas no setor que sua startup pretende atender. Conhece os clientes, os problemas e as relações de poder. Sua agenda de contatos vale ouro. Mas a tecnologia avança rápido e você ainda está aprendendo sobre IA.
domain|strengths|Compreensão dos clientes, credibilidade no setor, capacidade de lidar com a regulação
domain|challenges|Tendências técnicas, cultura de startups, superar o que funcionava antes
domain|difficulty|Média
domain|playstyle|Proximidade com os clientes e foco setorial
domain|bestFor|Jogadores que miram setores específicos, como saúde, finanças ou indústria
domain|famousExamples|Anne Boden (setor bancário/Starling), Nick Jenkins (cartões comemorativos/Moonpig), Will Shu (logística/Deliveroo)
domain|gameplayTips.0|Seu conhecimento do setor é incomparável — você sabe exatamente do que os clientes precisam e pelo que pagarão
domain|gameplayTips.1|Contrate jovens profissionais técnicos que possam executar sua visão com ferramentas modernas
domain|gameplayTips.2|Sua rede oferece acesso privilegiado a clientes de projetos-piloto e a parcerias
domain|gameplayTips.3|Esteja aberto a soluções fora das abordagens tradicionais de seu setor
domain|grantAdvantage|Forte para pesquisa aplicada — Os avaliadores valorizam a compreensão de problemas reais
domain|fundraisingStyle|Investidores de capital de risco especializados no setor gostarão de você; os generalistas podem questionar seu conhecimento técnico
domain|hiringEdge|Líder confiável para profissionais do setor; pode parecer antiquado aos profissionais de tecnologia
domain|riskProfile|Baixo risco de mercado, pois você conhece o cliente, e maior risco na execução técnica
firsttimer|name|O iniciante
firsttimer|title|Novo na área e cheio de vontade
firsttimer|slogan|Sem bagagem, só potencial
firsttimer|desc|Você nunca fez isso antes, e essa é sua vantagem. Sem maus hábitos, pressupostos ou medo. Você aprenderá rápido, cometerá erros ainda mais rápido e se adaptará. Tudo é possível porque você não sabe o que seria impossível.
firsttimer|strengths|Aprendizagem com mente aberta, energia e determinação, disposição para mudar de direção
firsttimer|challenges|Tudo é novo, rede de contatos limitada, aprender enquanto faz
firsttimer|difficulty|Difícil
firsttimer|playstyle|Aprender durante a jornada, alta adaptabilidade
firsttimer|bestFor|Jogadores que gostam de desafios e de aprender com os erros
firsttimer|famousExamples|Tom Blomfield (Monzo), Sarah Wood (Unruly), Taavet Hinrikus (Wise)
firsttimer|gameplayTips.0|Sua adaptabilidade é seu superpoder — mude de direção mais rápido do que fundadores estabelecidos conseguem
firsttimer|gameplayTips.1|Amplie ativamente sua rede de contatos; cada conversa é uma oportunidade de aprender
firsttimer|gameplayTips.2|Investidores podem subestimar você — use isso para entregar mais do que esperam e surpreendê-los
firsttimer|gameplayTips.3|Avaliadores de fomento serão céticos — comece com programas regionais para construir credibilidade
firsttimer|grantAdvantage|Fraca no início — Você precisa provar sua capacidade antes que os parceiros levem você a sério
firsttimer|fundraisingStyle|Caminho mais difícil — investidores-anjo e aceleradoras são seu melhor primeiro passo
firsttimer|hiringEdge|Sua energia atrai quem acredita na proposta; profissionais experientes podem querer uma liderança comprovada
firsttimer|riskProfile|Maior risco geral, mas também maior ritmo de aprendizagem — você evoluirá rapidamente
visionary|name|O visionário
visionary|title|Pensa no panorama completo
visionary|slogan|Vejo para onde o mundo está indo
visionary|desc|Você percebe para onde o mundo está indo antes dos demais. Suas ideias inspiram investidores, funcionários e jornalistas. Os detalhes da execução entediam você, mas você sabe encontrar pessoas que cuidam das pequenas coisas.
visionary|strengths|Liderança inspiradora, clareza estratégica, atração de talentos e capital
visionary|challenges|Detalhes operacionais, paciência com progresso gradual, escutar
visionary|difficulty|Média
visionary|playstyle|Inspirar e delegar, pensar em objetivos muito ambiciosos
visionary|bestFor|Jogadores que gostam de formar equipes e deixar a execução com outras pessoas
visionary|famousExamples|James Dyson, Richard Branson, Mike Lynch (Autonomy), Martha Lane Fox
visionary|gameplayTips.0|Sua visão atrai profissionais de alto nível — use isso para formar uma boa equipe desde o início
visionary|gameplayTips.1|Investidores financiarão o sonho, mas você precisa de um gestor de operações para realizá-lo
visionary|gameplayTips.2|Não avance tanto a ponto de sua equipe não conseguir acompanhar — mantenha contato com a realidade
visionary|gameplayTips.3|Sua capacidade de contar histórias facilita conseguir cobertura da imprensa e parcerias
visionary|grantAdvantage|Mista — Sua visão inspira, mas os avaliadores querem marcos concretos
visionary|fundraisingStyle|Captador nato — investidores acreditam em sua visão de futuro
visionary|hiringEdge|Líder de forte atração; conquista pessoas que acreditam na proposta e querem mudar o mundo
visionary|riskProfile|A execução é seu ponto cego — cerque-se de gestores atentos aos detalhes
bootstrapper|name|O empreendedor com recursos próprios
bootstrapper|title|Faz muito com pouco e se financia sozinho
bootstrapper|slogan|Cada libra é vigiada de perto
bootstrapper|desc|Você acredita em criar negócios que geram dinheiro, não apenas o captam. Cada libra conta e cada contratação precisa justificar seu custo. Você crescerá mais devagar, mas manterá uma participação maior — se conseguir sobreviver por tempo suficiente.
bootstrapper|strengths|Eficiência no uso do caixa, crescimento sustentável, mentalidade de propriedade integral
bootstrapper|challenges|Expandir com rapidez suficiente, competir com rivais financiados, captar quando necessário
bootstrapper|difficulty|Difícil
bootstrapper|playstyle|Uso eficiente do capital, crescimento sustentável
bootstrapper|bestFor|Jogadores que querem manter o controle e evitar diluição societária
bootstrapper|famousExamples|Nick Jenkins (Moonpig), Julian Dunkerton (Superdry), Ella Mills (Deliciously Ella)
bootstrapper|gameplayTips.0|Sua disciplina financeira prolonga o tempo até o caixa acabar — use isso para resistir mais do que concorrentes financiados
bootstrapper|gameplayTips.1|Recursos de fomento são ideais para você — financiamento sem diluição societária, alinhado à sua filosofia
bootstrapper|gameplayTips.2|Esteja disposto a captar se surgir uma oportunidade real de expansão — não deixe o orgulho custar sua vitória
bootstrapper|gameplayTips.3|Priorize funcionalidades que geram receita em vez de demonstrações impressionantes
bootstrapper|grantAdvantage|Forte alinhamento estratégico — O fomento oferece recursos sem ceder participação societária
bootstrapper|fundraisingStyle|Captador relutante — mas, quando capta, negocia as condições com firmeza
bootstrapper|hiringEdge|Atrai pessoas pragmáticas; pode ter dificuldade com candidatos em busca de ganhos com participação societária
bootstrapper|riskProfile|Menor consumo de caixa reduz o risco de ficar sem dinheiro, mas os concorrentes podem ultrapassar você
community|name|O criador de comunidades
community|title|Articulador do ecossistema
community|slogan|Construir com as pessoas, não apenas para elas
community|desc|Você acredita em construir com as pessoas, não apenas para elas. Código aberto, comunidades de desenvolvedores, movimentos de usuários — você reuniu pessoas em torno de causas comuns. Agora direciona isso para uma empresa.
community|strengths|Crescimento orgânico, usuários entusiasmados, atração de profissionais
community|challenges|Gerar receita, manter o foco, dizer não a pedidos da comunidade
community|difficulty|Média a difícil
community|playstyle|Comunidade em primeiro lugar, crescimento orgânico
community|bestFor|Jogadores que criam ferramentas para desenvolvedores, plataformas ou negócios com efeitos de rede
community|famousExamples|Pip Jamieson (The Dots), Matt Sherwood (MyBuilder), Russell Mayfield (Fat Llama)
community|gameplayTips.0|Sua comunidade é sua defesa competitiva — cuide dela e seus membros se tornarão sua força de vendas
community|gameplayTips.1|Gerar receita é seu desafio — planeje como cobrar sem afastar sua base de usuários
community|gameplayTips.2|A imprensa gosta de histórias de comunidades — use isso para o marketing orgânico
community|gameplayTips.3|Cuidado para não deixar a comunidade determinar integralmente o plano de evolução do produto
community|grantAdvantage|Moderada — Propostas de inovação aberta têm boa receptividade em alguns programas
community|fundraisingStyle|Indicadores da comunidade, como usuários e colaboradores, podem substituir a receita no início
community|hiringEdge|Membros da comunidade tornam-se candidatos; a afinidade cultural já está presente
community|riskProfile|Baixo custo de aquisição, mas o desafio é transformar a comunidade em clientes pagantes
strategist|name|O estrategista
strategist|title|Analista que veio da consultoria
strategist|slogan|Enxergue o tabuleiro inteiro
strategist|desc|Você assessorou diretores executivos e analisou mercados. Entende claramente os modelos de negócio e identifica falhas em qualquer plano, inclusive no seu. Agora passa de assessor a executor. A teoria encontra a realidade.
strategist|strengths|Pensamento estratégico, modelagem financeira, resolução estruturada de problemas
strategist|challenges|Velocidade de execução, conforto com ambiguidades, inspirar em vez de apenas analisar
strategist|difficulty|Média
strategist|playstyle|Decisões analíticas e estruturadas
strategist|bestFor|Jogadores que gostam de planejar e querem reduzir erros evitáveis
strategist|famousExamples|Martha Lane Fox (McKinsey), Archie Norman (da McKinsey à Asda), Sherry Coutu (LEK Consulting)
strategist|gameplayTips.0|Sua capacidade de análise ajuda a evitar armadilhas evidentes — mas não fique analisando quando deveria agir
strategist|gameplayTips.1|Investidores valorizam seu rigor; use seus modelos financeiros para negociar condições melhores
strategist|gameplayTips.2|Seu reconhecimento de padrões ajuda nas mudanças de direção — você perceberá mudanças de mercado antes dos demais
strategist|gameplayTips.3|Contrate gestores entusiasmados que executem enquanto você formula a estratégia
strategist|grantAdvantage|Propostas fortes — Você escreve propostas convincentes e bem estruturadas
strategist|fundraisingStyle|Apresentações baseadas em dados impressionam investidores analíticos; acrescente energia para equilibrar
strategist|hiringEdge|Entrevistas estruturadas atraem profissionais; o processo pode parecer frio a pessoas criativas
strategist|riskProfile|Menor risco estratégico, mas passar do aconselhamento à ação é seu desafio de desenvolvimento`;

let original;
function read(n){
 if(n.type==='Literal')return n.value;
 if(n.type==='ArrayExpression')return n.elements.map(read);
 if(n.type==='ObjectExpression')return Object.fromEntries(n.properties.map(p=>[p.key.name??p.key.value,read(p.value)]));
 throw new Error('Dado não literal: '+n.type);
}
for(const m of fs.readFileSync('source/index.original.html','utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n){
  if(n.id.name==='FOUNDER_PROFILES'){
   if(original)throw new Error('Estrutura duplicada.');
   const hash=require('node:crypto').createHash('sha256').update(m[2].slice(n.init.start,n.init.end)).digest('hex');
   if(hash!=='00fd7d29f1e1fb645efd2e63617c07232d5d25c3d3181a30d511005858012ada')throw new Error('Fonte dos perfis diverge da versão revisada.');
   original=read(n.init);
  }
 }});
}
const targets=new Map();
for(const line of translations.trim().split('\n')){
 const parts=line.split('|');if(parts.length!==3||parts.some(x=>!x.trim()))throw new Error('Tradução inválida.');
 const [id,field,target]=parts,path=JSON.stringify([id,...field.split('.').map(x=>/^\d+$/.test(x)?Number(x):x)]);
 if(targets.has(path))throw new Error('Campo duplicado: '+path);targets.set(path,target);
}
const strings={},preserved=new Set(['id','icon','color','portraitStyle','stats']);
function visit(value,path){
 if(typeof value==='string'){
  const key=JSON.stringify(path);if(!targets.has(key))throw new Error('Tradução ausente: '+key);
  strings[key]={source:value,target:targets.get(key)};targets.delete(key);return;
 }
 if(!Array.isArray(value))throw new Error('Formato de prosa inesperado: '+JSON.stringify(path));
 value.forEach((item,i)=>visit(item,[...path,i]));
}
for(const [id,profile] of Object.entries(original))for(const [field,value] of Object.entries(profile))if(!preserved.has(field))visit(value,[id,field]);
if(targets.size)throw new Error('Campos excedentes: '+[...targets.keys()].join(', '));
const file='locales/structures.pt-BR.json',catalogue=JSON.parse(fs.readFileSync(file,'utf8'));
catalogue.FOUNDER_PROFILES={classification:'Doze perfis: prosa traduzida; identificadores, ícones, cores, retratos e atributos numéricos preservados. Referências financeiras do original britânico ainda aguardam a adaptação brasileira aprovada.',strings};
fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');
console.log('FOUNDER_PROFILES: '+Object.keys(strings).length+' campos tratados.');
