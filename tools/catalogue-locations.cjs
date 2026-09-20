const fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const pairs=`Oxford|Oxford
The Dreaming Spires|As torres dos sonhos
Ancient colleges meet cutting-edge science. The biotech incubator and university spin-outs have created a world-class life sciences cluster.|Faculdades históricas encontram a ciência de ponta. A incubadora de biotecnologia e as empresas nascidas na universidade criaram um polo de ciências da vida de nível mundial.
World-leading research university|Universidade de pesquisa entre as líderes mundiais
Strong pharma connections (nearby Harwell)|Fortes conexões com o setor farmacêutico (Harwell fica perto)
Prestigious address attracts talent|Endereço prestigiado atrai profissionais
High costs and housing shortage|Custos elevados e escassez de moradia
Academic culture can slow commercialisation|A cultura acadêmica pode retardar a comercialização
Glasgow|Glasgow
The Inventive City|A cidade inventiva
Scotland's largest city with a proud industrial heritage reborn as an innovation hub. Strong NHS links through the university hospital campus.|A maior cidade da Escócia, orgulhosa de sua herança industrial, renasceu como polo de inovação. Tem fortes vínculos com o NHS por meio do campus hospitalar universitário.
Excellent NHS collaboration opportunities|Excelentes oportunidades de colaboração com o NHS
Affordable talent with strong work ethic|Profissionais a custos acessíveis e com forte ética de trabalho
regional development funding available|Recursos disponíveis para desenvolvimento regional
Smaller biotech investor ecosystem|Ecossistema menor de investidores em biotecnologia
Perception gap with London VCs|Diferença de percepção em relação aos investidores de capital de risco de Londres
Cardiff|Cardiff
The Life Sciences Valley|O vale das ciências da vida
Welsh capital with a growing life sciences cluster. The Cardiff Medicentre and Development Bank of Wales offer strong support for health tech startups.|A capital galesa tem um polo de ciências da vida em crescimento. O Cardiff Medicentre e o Development Bank of Wales oferecem forte apoio a startups de tecnologia em saúde.
Welsh Government grants and support|Fomento não reembolsável e apoio do governo galês
Growing life sciences park|Parque de ciências da vida em crescimento
Low costs, high quality of life|Custos baixos e alta qualidade de vida
Smaller talent pool|Base menor de profissionais disponíveis
Less visibility to major investors|Menor visibilidade junto a grandes investidores
Southampton|Southampton
The Maritime Tech Hub|O polo de tecnologia marítima
Major port city with expertise in maritime technology and logistics automation. The University of Southampton has world-class engineering and autonomous systems research.|Importante cidade portuária com conhecimento em tecnologia marítima e automação logística. A University of Southampton tem pesquisa de nível mundial em engenharia e sistemas autônomos.
Port and logistics expertise|Conhecimento especializado em portos e logística
Strong university engineering links|Fortes vínculos com a engenharia universitária
Good transport to London customers|Boas conexões de transporte para clientes em Londres
Mid-tier costs|Custos intermediários
Competes with London for talent|Compete com Londres por profissionais
Birmingham|Birmingham
The Manufacturing Heart|O coração industrial
Britain's second city, central to the UK's manufacturing supply chain. JLR, Aston Martin, and a huge automotive supply base make it ideal for industrial automation.|A segunda cidade da Grã-Bretanha tem papel central na cadeia de fornecimento industrial do Reino Unido. JLR, Aston Martin e uma enorme base de fornecedores automotivos tornam o local ideal para automação industrial.
Central UK location|Localização central no Reino Unido
Large manufacturing customer base|Grande base de clientes industriais
Diverse, skilled workforce|Força de trabalho diversa e qualificada
Less tech-startup culture|Cultura de startups de tecnologia menos desenvolvida
Competes with London for visibility|Compete com Londres por visibilidade
Grimsby|Grimsby
The Reinvention|A reinvenção
Once a fishing powerhouse, now reinventing itself as the UK's offshore wind capital. Lowest costs in the country with access to automation-hungry food processing and renewable energy sectors.|Antes uma potência pesqueira, agora se reinventa como a capital britânica da energia eólica em alto-mar. Tem os menores custos do país e acesso aos setores de processamento de alimentos e energia renovável, que buscam automação.
Lowest operating costs in UK|Menores custos operacionais do Reino Unido
Offshore wind boom creating demand|Expansão da energia eólica em alto-mar gera demanda
Eager local workforce|Força de trabalho local motivada
Perception challenges|Desafios de imagem
Remote location, harder to attract talent|Localização afastada dificulta atrair profissionais
London|London
The City|A City de Londres
The world's leading financial centre. Every major bank, hedge fund, and asset manager has a presence here. Unmatched access to customers, talent, and capital.|O principal centro financeiro do mundo. Todos os grandes bancos, fundos do tipo hedge e gestores de ativos têm presença aqui. Acesso incomparável a clientes, profissionais e capital.
All financial customers on doorstep|Todos os clientes financeiros por perto
Deepest quant talent pool globally|Maior base mundial de profissionais de finanças quantitativas
Investor meetings over lunch|Reuniões com investidores durante o almoço
Brutal costs and competition|Custos e concorrência muito elevados
Constant poaching of staff|Aliciamento constante de funcionários por concorrentes
Edinburgh|Edinburgh
The Fund Managers|Os gestores de fundos
Scotland's capital hosts major fund managers including Baillie Gifford and Abrdn. A sophisticated financial centre with world-class universities and a thriving fintech scene.|A capital da Escócia abriga grandes gestoras de fundos, como Baillie Gifford e Abrdn. Um centro financeiro sofisticado, com universidades de nível mundial e um setor de tecnologia financeira em expansão.
Major asset managers headquartered here|Sedes de grandes gestoras de ativos
Strong data science and AI talent|Profissionais qualificados em ciência de dados e IA
regional development support|Apoio ao desenvolvimento regional
Fewer hedge funds than London|Menos fundos do tipo hedge que Londres
Some investors require travel|Alguns investidores exigem deslocamentos
Belfast|Belfast
The Fintech Frontier|A fronteira da tecnologia financeira
Northern Ireland's capital has quietly become a fintech powerhouse. Citi, Allstate, and CME Group have major tech operations here, creating a deep pool of financial services engineers.|A capital da Irlanda do Norte tornou-se discretamente uma potência em tecnologia financeira. Citi, Allstate e CME Group têm grandes operações tecnológicas aqui, formando uma ampla base de engenheiros de serviços financeiros.
Lowest costs of major UK cities|Menores custos entre as grandes cidades do Reino Unido
Strong financial services tech talent|Bons profissionais de tecnologia para serviços financeiros
Invest NI grants available|Recursos não reembolsáveis da Invest NI disponíveis
Distance from London clients|Distância dos clientes de Londres
Smaller quant research community|Comunidade menor de pesquisa em finanças quantitativas
Brighton|Brighton
The Creative Coast|O litoral criativo
London's creative escape by the sea. A thriving indie games scene, digital agencies, and media companies make Brighton the UK's creative tech capital outside London.|Um refúgio criativo à beira-mar para quem sai de Londres. Jogos independentes em expansão, agências digitais e empresas de mídia fazem de Brighton a capital britânica da tecnologia criativa fora de Londres.
Strong creative and games talent|Bons profissionais de criação e jogos
50 mins to London clients|50 minutos até os clientes de Londres
Vibrant, attractive lifestyle|Estilo de vida movimentado e atraente
High costs for a small city|Custos altos para uma cidade pequena
Limited growth ceiling|Limite restrito de crescimento
Bristol|Bristol
The Animation Capital|A capital da animação
Home to award-winning animation studios and national broadcasters. A rich creative heritage combined with strong engineering talent from the aerospace industry. Annual Balloon Fiesta captures the city's spirit.|Sede de estúdios de animação premiados e emissoras nacionais. Uma rica tradição criativa combina-se com bons profissionais de engenharia da indústria aeroespacial. O evento anual Balloon Fiesta expressa o espírito da cidade.
Animation studios and broadcaster heritage|Tradição de estúdios de animação e emissoras
Strong VFX and animation talent|Bons profissionais de efeitos visuais (VFX) e animação
More affordable than London|Mais acessível que Londres
Smaller than London market|Mercado menor que o de Londres
Some client travel required|Necessidade de algumas viagens a clientes
Dundee|Dundee
The Games City|A cidade dos jogos
Birthplace of Grand Theft Auto and home to the V&A's only museum outside London. Abertay University pioneered games degrees, creating a unique talent pool for interactive entertainment.|Berço de Grand Theft Auto e sede do único museu do V&A fora de Londres. A Abertay University foi pioneira em cursos superiores de jogos, criando uma base singular de profissionais de entretenimento interativo.
GTA legacy and games talent|Legado de GTA e profissionais de jogos
V&A Dundee creative hub|Polo criativo V&A Dundee
Low costs, high creativity|Custos baixos e alta criatividade
Small city, limited scale|Cidade pequena e escala limitada
Remote from media buyers|Distante dos compradores de mídia
Cheltenham|Cheltenham
National Cyber Agency's Backyard|O quintal da National Cyber Agency
Home to National Cyber Agency and National Cyber Security Centre. The UK's intelligence community creates a unique talent pipeline.|Sede da National Cyber Agency e do National Cyber Security Centre. A comunidade de inteligência do Reino Unido forma um fluxo singular de profissionais.
National Cyber Agency talent pipeline|Fluxo de profissionais da National Cyber Agency
Security clearance culture|Cultura de credenciamento de segurança
Government contracts|Contratos governamentais
Quiet town|Cidade tranquila
Talent often cleared elsewhere|Profissionais frequentemente com credenciamento de segurança obtido em outros locais
Newport|Newport
Cyber Wales Hub|Polo de cibersegurança do País de Gales
Home to the National Cyber Security Academy and growing Welsh cyber cluster. ONS data science campus nearby in the valleys.|Sede da National Cyber Security Academy e de um polo galês de cibersegurança em crescimento. O campus de ciência de dados do ONS fica próximo, nos vales.
Cyber Security Academy|Cyber Security Academy
Welsh Government support|Apoio do governo galês
Low costs|Custos baixos
Less visibility|Menor visibilidade
Malvern|Malvern
Defence Tech Valley|Vale da tecnologia de defesa
Home to DefenceTech Labs and Defence Research Institute. The Malvern Hills tech cluster has deep defence and signals intelligence heritage.|Sede da DefenceTech Labs e do Defence Research Institute. O polo tecnológico de Malvern Hills tem forte tradição em defesa e inteligência de sinais.
DefenceTech Labs/Defence Research Institute proximity|Proximidade da DefenceTech Labs e do Defence Research Institute
Defence contracts|Contratos de defesa
Beautiful location|Local bonito
Small town|Cidade de pequeno porte
Limited nightlife|Vida noturna limitada
Aberdeen|Aberdeen
Energy Transition Hub|Polo da transição energética
Oil & gas capital pivoting to renewables. Energy giants need AI for transition-huge budgets, urgent timelines.|Capital de petróleo e gás que muda seu foco para energias renováveis. Gigantes da energia precisam de IA para a transição — orçamentos enormes e prazos urgentes.
Energy company HQs|Sedes de empresas de energia
Transition urgency|Urgência da transição
Large budgets|Orçamentos grandes
Remote location|Localização afastada
Oil industry stigma|Estigma da indústria petrolífera
Hull|Hull
Offshore Wind Capital|Capital da energia eólica em alto-mar
UK's offshore wind hub. Siemens Gamesa factory and Humber freeport offer grants and access to renewables sector.|Polo britânico de energia eólica em alto-mar. A fábrica da Siemens Gamesa e o porto franco de Humber oferecem fomento e acesso ao setor de energias renováveis.
Offshore wind cluster|Polo de energia eólica em alto-mar
Freeport incentives|Incentivos do porto franco
Lowest costs|Custos mais baixos
Remote from investors|Distante dos investidores
Limited tech scene|Setor tecnológico limitado
Exeter|Exeter
Met Office & Climate|Met Office e clima
Home to the Met Office and University of Exeter's climate research. World-leading weather and climate science on your doorstep.|Sede do Met Office e da pesquisa climática da University of Exeter. Ciência meteorológica e climática entre as líderes mundiais ao seu alcance.
Met Office partnership|Parceria com o Met Office
Climate science hub|Polo de ciência climática
Quality of life|Qualidade de vida
Small city|Cidade pequena
Far from London|Longe de Londres
Leeds|Leeds
Legal Process Centre|Centro de processos de trabalho jurídico
UK's largest legal centre outside London. DLA Piper and Eversheds run major operations. Legal process expertise.|O maior centro jurídico do Reino Unido fora de Londres. DLA Piper e Eversheds mantêm grandes operações. Conhecimento especializado em processos de trabalho jurídico.
Major firm operations|Operações de grandes escritórios
Legal process expertise|Conhecimento especializado em processos de trabalho jurídico
Strong universities|Boas universidades
Process not prestige|Foco em processos, não em prestígio
Less M&A work|Menos trabalho de fusões e aquisições (M&A)
Swansea|Swansea
Welsh Legal Tech|Tecnologia jurídica galesa
Swansea University's Hillary Rodham Clinton School of Law and growing legal services sector. Welsh Government backing for legal tech.|A Hillary Rodham Clinton School of Law da Swansea University e um setor de serviços jurídicos em crescimento. Apoio do governo galês à tecnologia jurídica.
University law school|Faculdade universitária de direito
Small legal market|Mercado jurídico pequeno
Far from London courts|Longe dos tribunais de Londres
Bournemouth|Bournemouth
South Coast Legal|Direito no litoral sul
Growing professional services hub with Bournemouth University's strong business law programme. Quality of life attracts London escapees.|Polo de serviços profissionais em crescimento, com o bom programa de direito empresarial da Bournemouth University. A qualidade de vida atrai quem deixa Londres.
Lower costs than London|Custos menores que em Londres
Growing legal sector|Setor jurídico em crescimento
Smaller market|Mercado menor
Limited Magic Circle presence|Presença limitada do Magic Circle
York|York
Education Research Hub|Polo de pesquisa em educação
University of York's education department is world-ranked. Strong evidence-based education research and school partnerships.|O departamento de educação da University of York tem reconhecimento em classificações mundiais. Boa pesquisa educacional baseada em evidências e parcerias com escolas.
Top education research|Pesquisa em educação de alto nível
School partnerships|Parcerias com escolas
Historic city appeal|Atrativo de cidade histórica
Coventry|Coventry
Warwick & WMG Country|Território de Warwick e WMG
University of Warwick's world-ranked education research, Warwick Business School, and WMG's industry partnerships. UK City of Culture 2021 added creative energy.|Pesquisa em educação da University of Warwick reconhecida mundialmente, Warwick Business School e parcerias empresariais da WMG. O título UK City of Culture 2021 trouxe energia criativa.
Warwick Business School|Warwick Business School
WMG industry links|Vínculos da WMG com empresas
Campus outside city|Campus fora da cidade
Student town feel|Ambiente de cidade estudantil
Bath|Bath
Two Universities, One Vision|Duas universidades, uma visão
University of Bath's Institute of Coding and Bath Spa University's creative education programmes. Two universities, one beautiful UNESCO World Heritage city.|O Institute of Coding da University of Bath e os programas de educação criativa da Bath Spa University. Duas universidades em uma bela cidade reconhecida como Patrimônio Mundial pela UNESCO.
Institute of Coding|Institute of Coding
Bath Spa creativity|Criatividade da Bath Spa
UNESCO heritage city|Cidade reconhecida como patrimônio pela UNESCO
High living costs|Custo de vida alto
Holbeach|Holbeach
The Fenland Larder|A despensa de Fenland
Inside the National Centre for Food Manufacturing's cluster and cheap to run, but almost no consumer or design talent nearby.|Inserida no polo do National Centre for Food Manufacturing e com baixo custo operacional, mas quase sem profissionais de produtos de consumo ou design nas proximidades.
Deep food manufacturing expertise|Conhecimento aprofundado em fabricação de alimentos
Very low costs|Custos muito baixos
Almost no consumer/design talent|Quase sem profissionais de produtos de consumo ou design
Far from retail buyers|Longe dos compradores do varejo
Norwich|Norwich
Research Park and Cathedral|Parque de pesquisa e catedral
Norwich Research Park gives real credibility on nutrition and food safety, sitting alongside the university and a major teaching hospital.|O Norwich Research Park oferece credibilidade em nutrição e segurança dos alimentos, ao lado da universidade e de um importante hospital de ensino.
Nutrition and food-safety research credibility|Credibilidade em pesquisa de nutrição e segurança dos alimentos
Strong science base|Base científica sólida
A long way from retail buyers|Muito longe dos compradores do varejo
Weaker consumer/marketing talent pool|Base menos desenvolvida de profissionais de produtos de consumo e marketing
Carmarthen|Carmarthen
Creative Digital, Cheaply|Criação digital a baixo custo
Cheap, close to food producers, with a creative-digital base at Yr Egin on the UWTSD campus.|Baixo custo, proximidade de produtores de alimentos e uma base de criação digital no Yr Egin, no campus da UWTSD.
Creative-digital talent at Yr Egin|Profissionais de criação digital no Yr Egin
Small labour market|Mercado de trabalho pequeno
Limited food-science depth|Conhecimento limitado em ciência dos alimentos
Loughborough|Loughborough
The Sports Lab|O laboratório do esporte
The Sports Technology Institute and the athletes on campus give unmatched performance-science credibility, but there's nothing like a commercial games or sports-tech cluster here.|O Sports Technology Institute e os atletas no campus oferecem credibilidade incomparável em ciência do desempenho, mas não há aqui um polo comercial de jogos ou tecnologia esportiva.
Sports science credibility|Credibilidade em ciências do esporte
Access to elite athletes for testing|Acesso a atletas de elite para testes
No commercial sports-tech cluster|Ausência de polo comercial de tecnologia esportiva
Thin on sales and business talent|Poucos profissionais de vendas e negócios
Leamington Spa|Leamington Spa
Silicon Spa|Silicon Spa
The UK's densest games cluster, over two thousand games people within walking distance — which means competing with all of them for the same talent.|O polo de jogos mais concentrado do Reino Unido, com mais de dois mil profissionais a uma caminhada de distância — o que significa competir com todos eles pelos mesmos profissionais.
UK's largest games-development talent pool|Maior base de profissionais de desenvolvimento de jogos do Reino Unido
Strong local network and events|Boa rede local de contatos e eventos
Fierce competition for hiring|Forte concorrência nas contratações
Higher salaries than the Midlands norm|Salários acima do padrão das Midlands
Stirling|Stirling
Between the Lochs and the Labs|Entre os lagos e os laboratórios
Good computing science at the university and a national sports centre on the doorstep, but a long way from the money.|Boa ciência da computação na universidade e um centro esportivo nacional por perto, mas longe das fontes de capital.
Solid computing science graduates|Graduados em ciência da computação com boa formação
National sports centre access|Acesso ao centro esportivo nacional
Far from investors and major clubs|Longe dos investidores e dos grandes clubes
Small local commercial ecosystem|Ecossistema comercial local pequeno
Bradford|Bradford
The Digital Health City|A cidade da saúde digital
The Digital Health Enterprise Zone and a young, diverse city, though there's little consumer investment money nearby.|A Digital Health Enterprise Zone e uma cidade jovem e diversa, embora haja pouco capital de investimento em negócios voltados ao consumidor nas proximidades.
Digital health specialism|Especialização em saúde digital
Young, diverse user base to test with|Base de usuários jovem e diversa para testes
Little consumer/investor money nearby|Pouco dinheiro de consumidores e investidores nas proximidades
Lower brand prestige for hiring|Menor prestígio da marca local para contratar
Newcastle upon Tyne|Newcastle upon Tyne
Data on the Tyne|Dados às margens do Tyne
The National Innovation Centre for Data and the National Innovation Centre for Ageing sit on the same site — real research depth, at the costs of a city without a city's investors.|O National Innovation Centre for Data e o National Innovation Centre for Ageing ficam no mesmo local — pesquisa aprofundada, com custos de uma cidade, mas sem sua correspondente base de investidores.
National data and ageing research centres|Centros nacionais de pesquisa em dados e envelhecimento
Strong technical talent pool|Boa base de profissionais técnicos
Weak local investor base|Base local de investidores pouco desenvolvida
Some distance from London decision-makers|Alguma distância dos tomadores de decisão de Londres
Manchester|Manchester
The Original Modern|O moderno original
A devolved health budget makes the city its own testbed, with two big universities feeding a deep talent pool — though everyone else is hiring from it too.|Um orçamento de saúde descentralizado faz da cidade um campo próprio de testes, com duas grandes universidades formando uma ampla base de profissionais — embora todos os demais também contratem nessa mesma base.
Devolved health system open to pilots|Sistema de saúde descentralizado aberto a projetos-piloto
Deep talent pool from two big universities|Ampla base de profissionais formada por duas grandes universidades
Fierce competition for hires|Forte concorrência por novos contratados
Higher costs than the rest of the North|Custos maiores que no restante do norte da Inglaterra
Cambridge|Cambridge
The Silicon Fen|O Silicon Fen
The strongest cluster in the country for this work — Arm's headquarters and the Science Park on the doorstep — but you pay for every engineer twice.|O polo mais forte do país para esse trabalho — a sede da Arm e o Science Park por perto —, mas você paga o equivalente a dois engenheiros para contratar um.
Deepest silicon/AI talent pool in the UK|Maior base de profissionais de semicondutores e IA do Reino Unido
World-class research proximity|Proximidade de pesquisa de nível mundial
Very high salaries and rents|Salários e aluguéis muito altos
Constant competition for hires|Concorrência constante por contratações
Cleator Moor|Cleator Moor
Cumbria's Nuclear Coast|O litoral nuclear de Cumbria
Sellafield's remote-handling team next door is your own problem made flesh — real-world offline robotics, right here — but recruiting in west Cumbria is genuinely hard.|A equipe de manipulação remota de Sellafield, logo ao lado, vive na prática o problema que você busca resolver — robótica sem internet em situações reais, bem aqui —, mas contratar no oeste de Cumbria é muito difícil.
Remote/offline engineering expertise nearby|Conhecimento próximo em engenharia remota e operação sem internet
Very hard to recruit into|Muita dificuldade para atrair contratados para o local
Small, isolated labour market|Mercado de trabalho pequeno e isolado
Preston|Preston
Aerospace on the Ribble|Indústria aeroespacial às margens do Ribble
UCLan's engineering innovation centre and BAE Warton's autonomy test facility sit nearby, well away from the software labour market.|O centro de inovação em engenharia da UCLan e a instalação de testes de autonomia da BAE Warton ficam próximos, bem longe do mercado de trabalho de software.
Aerospace/autonomy engineering base|Base de engenharia aeroespacial e de sistemas autônomos
Away from the software labour market|Distante do mercado de trabalho de software
Limited developer-community presence|Presença limitada da comunidade de desenvolvedores`;
const targets=new Map();for(const line of pairs.split('\n')){const row=line.split('|');if(row.length!==2||row.some(x=>!x.trim())||targets.has(row[0]))throw new Error('Par inválido ou duplicado.');targets.set(...row);}
let original;
function read(n){
 if(n.type==='Literal')return n.value;
 if(n.type==='TemplateLiteral'&&!n.expressions.length)return n.quasis[0].value.cooked;
 if(n.type==='UnaryExpression'&&n.operator==='-'&&n.argument.type==='Literal'&&typeof n.argument.value==='number')return -n.argument.value;
 if(n.type==='ArrayExpression')return n.elements.map(read);
 if(n.type==='ObjectExpression')return Object.fromEntries(n.properties.map(p=>[p.key.name??p.key.value,read(p.value)]));
 throw new Error('Dado não literal: '+n.type);
}
for(const m of fs.readFileSync('source/index.original.html','utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n){if(n.id.name==='LOCATIONS'){if(original)throw new Error('Estrutura duplicada.');original=read(n.init);}}});
}
const strings={},used=new Set();
function visit(value,path){
 if(typeof value==='string'){if(!targets.has(value))throw new Error('Tradução ausente: '+value);used.add(value);strings[JSON.stringify(path)]={source:value,target:targets.get(value)};return;}
 if(!Array.isArray(value))throw new Error('Formato inesperado: '+JSON.stringify(path));value.forEach((x,i)=>visit(x,[...path,i]));
}
for(const [venture,locations]of Object.entries(original))locations.forEach((loc,i)=>{
 for(const [field,value]of Object.entries(loc))if(!['id','region','image','salaryMod','bonuses'].includes(field))visit(value,[venture,i,field]);
});
for(const source of targets.keys())if(!used.has(source))throw new Error('Tradução excedente: '+source);
const file='locales/structures.pt-BR.json',catalogue=JSON.parse(fs.readFileSync(file,'utf8'));
catalogue.LOCATIONS={classification:'36 opções: descrições, vantagens, desvantagens e frases de apresentação traduzidas. Nomes de cidades e chaves regionais preservados internamente porque controlam regras; exônimos e regiões traduzidos nos cartões, painel de detalhes e cabeçalho por location-display.js. SVGs, identificadores, salários e bônus intactos. Contexto britânico original, sem validação como dados atuais.',strings};
catalogue.LOCATION_MAP={classification:'Mapa técnico preenchido em execução a partir dos identificadores de LOCATIONS; inicialização vazia preservada.',strings:{}};
fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');console.log('LOCATIONS: '+Object.keys(strings).length+' campos tratados; LOCATION_MAP preservado.');
