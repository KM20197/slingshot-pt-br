const fs=require('node:fs');
const catalogue=fs.existsSync('locales/structures.pt-BR.json')?JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8')):{};
function structure(name,classification,pairs=[]){
 catalogue[name]={classification,strings:Object.fromEntries(pairs.map(([path,source,target])=>[JSON.stringify(path),{source,target}]))};
}
structure('REGIONS','Tradução do contexto britânico preservado; nomes institucionais, siglas, moeda, bancos de nomes e identificadores mantidos.',[
 [['uk','name'],'United Kingdom','Reino Unido'],
 [['uk','cities','primary'],'London','Londres'],
 [['uk','cities','financial'],'London','Londres'],
 [['uk','cities','scottish'],'Edinburgh','Edimburgo'],
 [['uk','stockIndexDesc'],"Britain's largest public corporations",'Maiores empresas britânicas de capital aberto'],
 [['uk','immigration','workVisa'],'Skilled Worker visa','visto Skilled Worker (trabalhador qualificado)'],
 [['uk','immigration','sponsorLicense'],'sponsor licence','licença para patrocinar vistos de trabalho'],
 [['uk','immigration','rightToWork'],'right to work','direito de trabalhar'],
 [['uk','immigration','settledStatus'],'settled status','status de residência permanente (settled status)'],
 [['uk','immigration','immigrationAuth'],'Immigration Authority','autoridade de imigração'],
 [['uk','immigration','visaRenewal'],'visa renewal','renovação de visto'],
 [['uk','culture','bacheloretteParty'],'hen do','despedida de solteira'],
 [['uk','culture','bachelorParty'],'stag do','despedida de solteiro'],
 [['uk','culture','trainOperator'],'train','trem'],
 [['uk','culture','partyDestination'],'Prague','Praga'],
 [['uk','centralBank'],'Bank of England','Banco da Inglaterra'],
 [['uk','titles','financeMinister'],'Chancellor','chanceler do Tesouro'],
 [['uk','titles','leader'],'Prime Minister','primeiro-ministro']
]);
structure('GEOGRAPHY_REGIONS','Identificadores geográficos usados para cruzar dados; mantidos integralmente.');
structure('PORTRAITS','Recursos gráficos SVG; mantidos integralmente.');
structure('LOGOS','Recursos gráficos SVG e identificadores; mantidos integralmente.');
const legendSources=[
 'British AI pioneer, acquired by tech giant for £400M','CortexAI co-founder, now leading enterprise AI','Revolutionising British banking','Former Allied Irish Banks exec turned fintech founder','Cambridge-born AI cybersecurity unicorn',"Britain's first software billionaire",'Godfather of British tech, ARM co-founder','Dot-com pioneer and digital champion','London-based AI video generation','Estonian-British fintech transforming transfers','London AI consultancy advising government','Leading the generative AI revolution','The godfather of GPU computing','Serial founder across industries','Social media empire builder','Brothers revolutionising payments','Swedish entrepreneur who changed music','Designer who reimagined hospitality','Building safe, beneficial AI','Youngest self-made billionaire in AI'
];
const legendTargets=[
 'Pioneira britânica em IA, adquirida por gigante da tecnologia por £400M','Cofundadora da CortexAI, hoje à frente de IA empresarial','Transformando o setor bancário britânico','Ex-executiva do Allied Irish Banks que fundou uma fintech','Unicórnio de cibersegurança com IA nascido em Cambridge','Primeiro bilionário britânico do setor de software','Referência da tecnologia britânica e cofundador da ARM','Pioneira da internet e defensora da inclusão digital','Geração de vídeos com IA sediada em Londres','Fintech estoniano-britânica que transforma as transferências de dinheiro','Consultoria de IA de Londres que assessora o governo','À frente da revolução da IA generativa','Referência da computação com GPUs','Fundador de várias empresas em diferentes setores','Criador de um império de redes sociais','Irmãos que transformam os meios de pagamento','Empreendedor sueco que mudou a música','Designer que reinventou a hospitalidade','Desenvolvendo IA segura e benéfica','O mais jovem bilionário da IA a construir a própria fortuna'
];
// The original schema uses bio (checked by the translator before applying).
structure('HALL_OF_FAME_LEGENDS','Biografias traduzidas; nomes, empresas, ícones e valores históricos preservados.',legendSources.map((source,i)=>[[i,'bio'],source,legendTargets[i]]));
const companySources=[
 'AI-driven protein design for healthcare applications. Deep science, high stakes.','Autonomous robots for UK warehouses. Hardware meets software.','AI trading systems for the City. Fast money, faster competition.','Generative AI for creators. Consumer-facing, culture-shaping.','AI-powered threat detection for UK critical infrastructure. High security, high stakes.','Climate prediction and sustainability AI. Save the planet, build a business.','Contract analysis and legal research automation. Disrupting the Magic Circle.','Personalised learning that adapts to every student. EdTech meets AI.','Food and drink, from kitchen to bin. Consumer trust is the whole business.','Data for anything with a fixture list. Clubs, studios and broadcasters as customers.','Sleep, stress, movement and the ordinary business of getting through the week.',"Small models that run where there's no connection. Sold to the engineers who build with them."
];
const companyTargets=[
 'Gestão de atendimento ambulatorial com foco na capacidade das instalações e experiência do público. Explicitamente não haverá dados reais de pacientes, diagnóstico, prescrição ou alegação clínica.','Comércio varejista de insumos e ferramentas para pequenas obras e reformas no cenário fictício.','Confecção e impressão de materiais comerciais e invólucros institucionais. Explicitamente, o caso não alega certificação, conformidade regulatória, segurança de embalagens, adequação para contato com alimentos ou qualquer garantia técnica.','Comércio varejista de gêneros alimentícios e itens de primeira necessidade, focado em abastecimento local.','Manufatura de vestuário em escala para o mercado varejista. Explicitamente, o caso não alega sustentabilidade, origem de materiais, certificação trabalhista ou cadeia de fornecimento como fatos ou garantias.','Produção e distribuição de itens para manutenção predial institucional. Explicitamente, o caso não contém alegações sanitárias, médicas, clínicas, regulatórias ou de eficácia, e não possui dados de pacientes, diagnósticos, prescrições ou orientação de saúde.','Comércio varejista de produtos de higiene, perfumaria e conveniência de bairro. Explicitamente não haverá venda de medicamentos, dados reais de pacientes, diagnóstico, prescrição ou alegação clínica.','Estabelecimento voltado para atividades físicas de adultos, focado em continuidade de membros e conservação do espaço.','Estabelecimento de alimentação com cobrança por peso, voltado à organização do atendimento e à gestão de desperdício no cenário fictício. Explicitamente, o caso não faz alegações nutricionais, sanitárias ou de saúde.','Comércio varejista de vestuário e acessórios, focado em tendências fictícias e atendimento ao consumidor.','Produção e distribuição de refeições pré-preparadas no cenário fictício. Explicitamente, o caso não faz alegações nutricionais, sanitárias, médicas, de conservação, validade, presença de alergênicos, adequação a dietas ou resultados de saúde.','Prestação de serviços de reparo e manutenção física de aparelhos com controle estrito de produtividade e peças.'
];
structure('COMPANIES','Descrições originais traduzidas; adaptação setorial brasileira ainda pendente. Archetype e demais categorias são identificadores do motor e permanecem inalterados.',companySources.map((source,i)=>[[i,'desc'],source,companyTargets[i]]));
const ventureIds=["aether", "vanguard", "quant", "dream", "cyber", "terra", "legal", "edu", "voed", "arene", "sorgente", "avam"];
const ventures=require('../locales/ventures.pt-BR.json');
for(const [i,id] of ventureIds.entries())catalogue.COMPANIES.strings[JSON.stringify([i,'desc'])].target=ventures[id].desc;
fs.writeFileSync('locales/structures.pt-BR.json',JSON.stringify(catalogue,null,2)+'\n');
