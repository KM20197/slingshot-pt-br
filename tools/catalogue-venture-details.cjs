const fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const targets={
 aether:{
  product:'Você desenvolve um software de IA que analisa exames de imagem — raios X, ressonâncias magnéticas e tomografias — para ajudar médicos a detectar doenças mais cedo. A IA sinaliza possíveis problemas para revisão por radiologistas, agilizando o diagnóstico e identificando detalhes que podem passar despercebidos quando os médicos estão sobrecarregados.',
  customers:'As organizações hospitalares do NHS são os principais compradores. Elas enfrentam longas listas de espera, falta de pessoal e demanda crescente. Alguns grupos hospitalares privados também podem se interessar. Os contratos costumam ser assinados por diretores clínicos ou de tecnologia da informação dessas organizações.',
  revenue:'Licenças anuais de software vendidas a cada organização hospitalar. O preço costuma ser definido por exame ou por leito. Há taxas de implantação e integração com os sistemas do hospital. Espere de 6 a 12 meses entre a primeira reunião e a assinatura do contrato.',
  whyWork:['As listas de espera do NHS estão em níveis recordes','Há escassez de radiologistas no Reino Unido','O governo incentiva a adoção de IA','Os hospitais procuram soluções ativamente'],
  whyHard:['As compras do NHS são lentas e complexas','São necessários estudos clínicos para comprovar a eficácia','A regulamentação de dispositivos médicos exige tempo','É difícil obter dados para treinar os modelos','Médicos podem ser céticos em relação à IA'],
  competition:'Várias empresas bem financiadas desenvolvem produtos semelhantes, algumas com apoio de empresas farmacêuticas. Algumas já conquistaram contratos com o NHS. Você não chegou primeiro: precisará oferecer algo melhor ou encontrar um nicho pouco atendido.'
 },
 vanguard:{
  product:'Você desenvolve robôs móveis autônomos que transportam mercadorias em armazéns. Eles se orientam por câmeras e sensores, recolhem prateleiras ou pacotes e os levam aos trabalhadores responsáveis pela embalagem. O software coordena vários robôs trabalhando juntos.',
  customers:'Grandes armazéns de comércio eletrônico, operadores logísticos terceirizados (3PLs) e centros de distribuição de alimentos. Os compradores são diretores de operações que buscam processar mais volume sem ampliar o quadro de pessoal na mesma proporção. Ocado, Amazon e redes de supermercados estão entre os grandes participantes da logística britânica.',
  revenue:'Os robôs podem ser vendidos por £30-50 mil cada ou alugados mensalmente. A maioria dos clientes prefere o modelo de robótica como serviço, com pagamento mensal por robô, incluindo manutenção. Atualizações de software e suporte geram receita recorrente.',
  whyWork:['Os salários nos armazéns continuam subindo','É difícil contratar trabalhadores em número suficiente','O volume do comércio eletrônico continua crescendo','Robôs trabalham à noite e nos fins de semana'],
  whyHard:['Desenvolver hardware custa caro','Robôs apresentam defeitos e precisam de reparos','Cada armazém tem uma disposição física diferente','Os testes-piloto são longos antes de pedidos maiores','Há dificuldades no fornecimento de componentes'],
  competition:'Grandes empresas de robótica dos EUA têm ampla vantagem de tempo e recursos financeiros. Alguns armazéns britânicos já usam robôs concorrentes. Você provavelmente competirá por preço, atendimento ou foco em tipos de armazém que as grandes empresas deixam de lado.'
 },
 quant:{
  product:'Você desenvolve sistemas de IA que negociam automaticamente nos mercados financeiros. O software analisa dados de mercado, identifica padrões e executa operações sem intervenção humana. O objetivo é obter retornos consistentes e controlar o risco.',
  customers:'Fundos de investimento alternativo do tipo hedge, fundos de pensão, escritórios de gestão de patrimônio familiar e gestores de patrimônio. Eles distribuem recursos entre estratégias e procuram retornos que não acompanhem exatamente o mercado de ações. Você apresentará propostas a comitês de investimento que exigem um histórico de resultados.',
  revenue:'Taxas de administração de 1-2% dos ativos ao ano e taxas de desempenho de 15-20% dos lucros. É necessário captar ativos sob gestão para gerar receita expressiva. Algumas empresas também licenciam sua tecnologia para outros operadores.',
  whyWork:['Investidores procuram estratégias baseadas em IA','Londres concentra profissionais experientes em finanças','Há um marco regulatório definido pela FCA','Fundos de pensão ampliam a alocação em investimentos alternativos'],
  whyHard:['No início, você não tem histórico de resultados','São necessários 2-3 anos de resultados para captar valores expressivos','Um trimestre ruim pode afastar investidores','Fundos quantitativos estabelecidos têm décadas de dados','Os custos de infraestrutura são elevados'],
  competition:'Você compete com empresas que atuam há mais de 20 anos e empregam centenas de profissionais com doutorado. Algumas administram bilhões. Sua vantagem precisará ser uma abordagem nova ou um nicho que elas ainda não atendem.'
 },
 dream:{
  product:'Você desenvolve ferramentas de IA generativa que ajudam as pessoas a criar imagens, vídeos, música e outros conteúdos criativos. O usuário descreve o que deseja e a IA produz o conteúdo. Pense em ferramentas para criadores do YouTube e de redes sociais, designers e pessoas que criam por lazer.',
  customers:'Criadores individuais são o principal mercado: milhões de pessoas produzem conteúdo para redes sociais, YouTube, podcasts e projetos pessoais. Empresas e agências também podem usar as ferramentas. Os clientes chegam por lojas de aplicativos, redes sociais e recomendações.',
  revenue:'Assinaturas com recursos básicos gratuitos e recursos avançados por £10-20 por mês. A receita depende de atrair muitos usuários e converter uma parcela deles em assinantes. Planos empresariais também podem gerar receita.',
  whyWork:['A economia dos criadores reúne milhões de pessoas','A IA torna a qualidade profissional mais acessível','O compartilhamento em redes sociais pode ampliar a divulgação rapidamente','As pessoas pagam por ferramentas que economizam tempo'],
  whyHard:['O mercado já está muito disputado','Grandes empresas de tecnologia podem copiar seus recursos rapidamente','Questões de direitos autorais continuam sem solução','Conquistar clientes custa caro','Os usuários trocam de ferramenta com facilidade'],
  competition:'Dezenas de startups bem financiadas e grandes empresas de tecnologia desenvolvem ferramentas semelhantes. Novos concorrentes surgem toda semana. Alguns captaram centenas de milhões. Você precisará de um diferencial claro para se destacar.'
 },
 cyber:{
  product:'Você desenvolve software de IA para detectar ataques cibernéticos a sistemas importantes: redes elétricas, tratamento de água, transportes e serviços financeiros. Ele monitora o tráfego de rede e o comportamento dos sistemas, identificando atividades incomuns que possam indicar um ataque.',
  customers:'Operadores de infraestrutura crítica nacional, órgãos públicos, bancos e grandes empresas de setores regulados. Os compradores são diretores de segurança da informação (CISOs) e equipes de segurança de TI. Regras governamentais frequentemente exigem padrões específicos de segurança.',
  revenue:'Licenças anuais de software, com preço baseado no tamanho da rede protegida. Serviços de implantação e integração. Monitoramento contínuo e resposta a incidentes também podem gerar receita.',
  whyWork:['Aumentam os ataques cibernéticos à infraestrutura do Reino Unido','O governo amplia os gastos com defesa cibernética','A regulamentação exige mais segurança','Ferramentas antigas de segurança não detectam novas ameaças'],
  whyHard:['Os compradores decidem devagar e com cautela','Os ciclos de venda duram de 6 a 12 meses ou mais','Alguns trabalhos exigem credenciais de segurança','Fornecedores estabelecidos já têm relacionamentos com os clientes','Alarmes falsos destroem a credibilidade'],
  competition:'Grandes empresas de segurança, como CrowdStrike, Palo Alto e Darktrace, já atendem esse mercado. Elas têm equipes de vendas, marcas conhecidas e contratos vigentes. Você precisará demonstrar que sua IA detecta ameaças que elas deixam passar.'
 },
 terra:{
  product:'Você desenvolve ferramentas de IA para ajudar organizações a compreender e enfrentar riscos climáticos. Isso pode incluir previsão de eventos extremos, modelos de risco de enchentes ou incêndios florestais, acompanhamento de emissões de carbono e melhoria do uso de energia. Diferentes produtos atendem a diferentes compradores.',
  customers:'Seguradoras precisam de modelos de risco climático. Grandes empresas precisam acompanhar emissões para seus relatórios. Governos e cidades precisam de ferramentas de planejamento. Instituições de pesquisa podem financiar os trabalhos iniciais. Cada tipo de cliente tem necessidades e processos de compra próprios.',
  revenue:'Combinação de recursos de pesquisa, especialmente no início, projetos de consultoria e assinaturas de software. O fomento pode financiar o desenvolvimento, mas não cresce na mesma proporção que o negócio. O objetivo de longo prazo é obter receita recorrente de software com clientes empresariais.',
  whyWork:['O clima ocupa espaço crescente nas prioridades das empresas','Novas regras exigem relatórios de emissões','As seguradoras precisam de modelos de risco melhores','Há recursos públicos para pesquisa e desenvolvimento'],
  whyHard:['É fácil se tornar dependente de recursos de fomento','Os ciclos de venda para empresas são longos','É difícil comprovar o retorno de alguns produtos','"Sustentabilidade" é um termo amplo: é preciso definir um foco','Grandes consultorias disputam os mesmos projetos'],
  competition:'O mercado reúne startups, consultorias e grandes empresas de tecnologia. Algumas organizações estabelecidas têm mais dados e um histórico mais longo. Como o mercado é fragmentado, pode haver espaço para se especializar em um problema ou tipo de cliente.'
 },
 legal:{
  product:'Você desenvolve software de IA que lê e analisa documentos jurídicos: contratos, jurisprudência e normas. Ele pode revisar contratos mais rapidamente que advogados, sinalizar riscos, extrair cláusulas relevantes e pesquisar precedentes. Foi concebido para ajudar os advogados a trabalhar mais rápido, sem substituí-los.',
  customers:'Escritórios de advocacia, especialmente os profissionais que revisam documentos, departamentos jurídicos de empresas e equipes de conformidade. Os compradores são sócios administradores, diretores jurídicos e responsáveis por operações jurídicas. Grandes escritórios têm maior volume de trabalho e orçamento.',
  revenue:'Assinaturas de software, geralmente por usuário ou volume de documentos processados. Contratos empresariais com grandes escritórios e companhias. Algumas empresas cobram por projeto em tarefas específicas de revisão.',
  whyWork:['O trabalho jurídico é caro: £300-500 por hora','Boa parte do trabalho jurídico envolve revisão repetitiva','As equipes jurídicas das empresas estão sobrecarregadas','Advogados mais jovens são mais receptivos a ferramentas de IA'],
  whyHard:['Escritórios lucram com as horas faturáveis','Advogados são cautelosos com novas ferramentas','Erros jurídicos custam caro','É necessário um nível muito alto de precisão','Parte do trabalho exige julgamento humano'],
  competition:'Várias empresas de tecnologia jurídica desenvolvem ferramentas de IA há anos. Algumas recebem apoio de grandes escritórios. As maiores bancas podem desenvolver ferramentas próprias. Para atrair os clientes dos concorrentes, sua solução precisará ser muito melhor ou mais barata.'
 },
 edu:{
  product:'Você desenvolve software de aprendizagem com IA que se ajusta ao nível e ao ritmo de cada estudante. Ele identifica dificuldades, oferece exercícios direcionados e apresenta aos professores dados sobre o progresso da turma. Complementa o ensino em sala de aula.',
  customers:'Escolas, organizações mantenedoras de academies britânicas e autoridades educacionais locais. Os compradores são diretores escolares, coordenadores de TI ou diretores educacionais dessas organizações. Famílias também podem pagar pelo uso em casa. As decisões costumam ocorrer no nível da rede ou do distrito, e não de cada escola.',
  revenue:'Assinaturas anuais por escola ou estudante. Alguns produtos cobram por conta de professor. Serviços de implantação e formação. Uma versão para consumidores pode ser oferecida por assinatura direta às famílias.',
  whyWork:['Os professores estão sobrecarregados','O tamanho das turmas dificulta a atenção individual','A COVID deixou lacunas de aprendizagem','As escolas usam cada vez mais ferramentas digitais'],
  whyHard:['Os orçamentos escolares são muito limitados','As compras acompanham o calendário letivo','Há testes-piloto longos antes da implantação completa','Professores precisam de formação para usar novas ferramentas','É difícil demonstrar rapidamente o impacto na aprendizagem'],
  competition:'Muitas empresas de tecnologia educacional atendem escolas, mas poucas usam IA sofisticada. Grandes editoras de livros didáticos acrescentam ferramentas digitais a seus produtos. Como as escolas têm pouco orçamento para várias assinaturas, você disputa uma parcela pequena dos gastos.'
 },
 voed:{
  product:'Você desenvolve um aplicativo que sabe o que há na cozinha de uma família, quanto custou, o que está perto de estragar e como aproveitar os alimentos. Ele lê recibos e fotos, aprende os hábitos da família, sugere refeições com o que já está disponível e avisa antes que algo seja descartado.',
  customers:'Famílias, principalmente quem faz as compras semanais. Mais adiante, supermercados e marcas de alimentos interessados em participar da decisão de compra, além de prefeituras e entidades beneficentes com programas de redução de desperdício. É o mercado de consumo mais disputado do jogo e aquele em que é mais fácil entrar.',
  revenue:'Assinatura de poucas libras por mês, com uma versão gratuita da qual a maioria não sai. Mais adiante, participação na receita de pedidos de supermercado e destaque pago de produtos: fontes de dinheiro que também podem comprometer a confiança.',
  whyWork:['Um terço dos alimentos dos domicílios é descartado','A alimentação é a maior despesa em muitos orçamentos','Os varejistas querem os dados','O custo para alcançar novas famílias é baixo'],
  whyHard:['Ninguém conseguiu criar um aplicativo de alimentação que as pessoas mantenham por um ano','Os supermercados já têm os comprovantes das compras','Surgem alternativas gratuitas todo mês','A retenção é difícil: um quarto dos usuários sai a cada trimestre','Um supermercado pode copiar uma boa ideia em uma temporada'],
  competition:'Cupboard, Grüne Kiste e Nutrivo disputam as mesmas famílias com estratégias diferentes: uma compra crescimento, outra investe em sistemas no longo prazo e outra só faz afirmações que consegue comprovar. Nenhuma resolveu o problema da retenção.'
 },
 arene:{
  product:'Você desenvolve acompanhamento, previsão e conteúdo gerado para atividades com calendário de competições: dados de atletas e desempenho, riscos de lesão e sobrecarga, geração de conteúdo para o público e de melhores momentos, sistemas para os locais de eventos e para a transmissão.',
  customers:'Clubes profissionais e seus analistas, ligas e entidades dirigentes, estúdios de jogos, gravadoras e promotores de eventos, emissoras e detentores de direitos. Quem assina costuma ser um diretor comercial ou de desempenho, raramente um profissional de tecnologia.',
  revenue:'Contratos anuais por clube ou por título, vendidos em uma janela curta antes de uma temporada ou lançamento. Têm valores elevados, demoram para ser fechados e tendem a permanecer depois da implantação.',
  whyWork:['Esportes e jogos movimentam muito dinheiro','Os investimentos em análise de dados ainda são recentes','O Reino Unido conta com a Premier League, Silicon Spa e música ao vivo por perto','Os contratos são renovados e não têm a mesma rotatividade das assinaturas de consumo'],
  whyHard:['A temporada começa mesmo que você não esteja pronto','Clubes compram com base em relacionamentos, não apenas em recursos do produto','Estúdios desenvolvem suas próprias ferramentas','Perder a janela da pré-temporada significa esperar um ano','Os compradores recebem propostas de todos os concorrentes o tempo todo'],
  competition:'Chalkline avança rapidamente a partir de sua experiência com dados de apostas; Tempo Sport é paciente e difícil de substituir depois que entra em uma federação; Nine Yards não coloca no ar nada que possa falhar durante a transmissão. O calendário pesa mais que o produto na definição dos vencedores.'
 },
 sorgente:{
  product:'Você desenvolve um aplicativo que as pessoas abrem quase todos os dias para lidar com uma dificuldade comum e, aos poucos, com várias: sono, estresse, movimento, hábitos, tarefas domésticas ou um passatempo levado a sério.',
  customers:'Pessoas que pagam poucas libras por mês. Mais adiante, empregadores que contratam o serviço para suas equipes e serviços de saúde, se as evidências sustentarem o produto.',
  revenue:'Assinaturas, com perda de um quarto da base a cada três meses se o produto não justificar sua permanência. Programas oferecidos por empregadores são mais estáveis, mas demoram mais para ser conquistados.',
  whyWork:['As filas do NHS levam as pessoas a procurar alternativas','Empregadores investem no bem-estar das equipes','O custo para alcançar as pessoas é baixo','Um estudo publicado alcança mais longe que um anúncio'],
  whyHard:['Um quarto dos usuários sai a cada trimestre','Todos nesse mercado prometem os mesmos benefícios','Uma promessa exagerada pode transformar você no problema em vez de destacar o produto','Produzir evidências é lento e caro; fazer marketing é rápido e barato','Profissionais clínicos permanecem céticos até que os dados sejam convincentes'],
  competition:'Kindling atrai atenção com facilidade, mas tem poucas evidências; Rustad avança devagar e inspira confiança; Sattva Health só afirma o que sua fundadora consegue comprovar clinicamente. Sobrevive a empresa que não precisa escolher entre atenção e evidências.'
 },
 avam:{
  product:'Você desenvolve modelos compactos e as ferramentas que os acompanham: execução no próprio dispositivo, avaliação e testes, reconhecimento de fala adaptado à maneira como as pessoas daqui realmente falam e licenciamento dos materiais usados no treinamento.',
  customers:'Engenheiros de outras empresas: fabricantes de hardware, operadores industriais, órgãos públicos cujos dados não podem sair do local e organizações cujos usuários não têm sinal de rede.',
  revenue:'Cobrança por uso, por chamada ou por dispositivo, com uma faixa gratuita da qual a maioria não sai e um ciclo de vendas curto. A receita por cliente começa pequena e se acumula. A qualidade do produto atrai as vendas: sua própria equipe de produto gera clientes.',
  whyWork:['Enviar tudo a um centro de dados é caro e às vezes não é permitido','O Reino Unido tem competência em chips eficientes e tecnologias de fala','Desenvolvedores encontram você pela documentação, não por uma ligação de vendas','A receita por uso cresce sem ampliar o quadro de pessoal na mesma proporção'],
  whyHard:['Grandes fornecedores continuam melhorando as versões gratuitas','Desenvolvedores são fiéis até encontrarem uma alternativa melhor','A receita por uso permanece pequena por muito tempo antes de crescer','Uma interface ruim faz perder negócios que a equipe comercial não consegue recuperar','Os gastos com marketing têm efeito relativamente pequeno aqui'],
  competition:'Coldstart lança rapidamente e quebra a compatibilidade; Petit Modèle publica tudo e avança devagar; Anvil Systems é discreta e está presente em muitos sistemas. Vence quem se torna a primeira escolha dos engenheiros pela documentação, não pelos anúncios.'
 }
};
const html=fs.readFileSync('source/index.original.html','utf8');
let original;
function read(node){
 if(node.type==='Literal')return node.value;
 if(node.type==='ArrayExpression')return node.elements.map(read);
 if(node.type==='ObjectExpression')return Object.fromEntries(node.properties.map(p=>[p.key.name||p.key.value,read(p.value)]));
 throw new Error('Esperado dado literal, recebido '+node.type);
}
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n){if(n.id.name==='VENTURE_DETAILS')original=read(n.init);}});
}
const strings={};
function pair(source,target,path=[]){
 if(typeof source==='string'){
  if(typeof target!=='string'||!target)throw new Error('Tradução ausente em '+path.join('.'));
  strings[JSON.stringify(path)]={source,target};return;
 }
 if(!target||JSON.stringify(Object.keys(source))!==JSON.stringify(Object.keys(target)))throw new Error('Campos divergentes em '+path.join('.'));
 for(const key of Object.keys(source))pair(source[key],target[key],[...path,Array.isArray(source)?Number(key):key]);
}
pair(original,targets);
const catalogue=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8'));
catalogue.VENTURE_DETAILS={classification:'Tradução integral do bloco original britânico, preservando referências e valores. Adaptação aos empreendimentos brasileiros ainda pendente; não apresentar esses dados como estatísticas atuais do Brasil.',strings};
fs.writeFileSync('locales/structures.pt-BR.json',JSON.stringify(catalogue,null,2)+'\n');
console.log('VENTURE_DETAILS: '+Object.keys(strings).length+' campos traduzidos.');
