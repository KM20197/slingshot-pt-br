const fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
// O marcador [NEW] é funcional e fica intacto. Cada ocorrência repetida recebe
// a mesma tradução, inclusive os seletores textuais das listas de remoção.
const pairs=`NHS Digital (data access agreements)|NHS Digital (acordos de acesso a dados)
University hospital research partners (Oxford, Cambridge, Imperial)|Parceiros de pesquisa em hospitais universitários (Oxford, Cambridge, Imperial)
Cloud infrastructure providers (AWS/Azure healthcare)|Fornecedores de infraestrutura em nuvem (AWS/Azure para saúde)
Medical device certification consultants|Consultores de certificação de dispositivos médicos
EHR/EPR system vendors (integration)|Fornecedores de sistemas EHR/EPR (integração)
Royal Colleges (clinical validation)|Royal Colleges (validação clínica)
Machine learning model training on clinical datasets|Treinamento de modelos de aprendizado de máquina com bases de dados clínicos
Clinical validation studies with NHS partners|Estudos de validação clínica com parceiros do NHS
Regulatory compliance (MHRA, CE marking, UKCA)|Conformidade regulatória (MHRA, marcação CE, UKCA)
Integration with hospital IT systems|Integração com sistemas de TI hospitalares
Continuous model improvement from deployment feedback|Melhoria contínua dos modelos a partir do retorno da implantação
Medical advisory board coordination|Coordenação do conselho consultivo médico
Proprietary ML models trained on UK patient data|Modelos próprios de aprendizado de máquina treinados com dados de pacientes do Reino Unido
Clinical validation datasets|Bases de dados para validação clínica
Medical advisory board (NHS consultants)|Conselho consultivo médico (especialistas do NHS)
Regulatory expertise and documentation|Conhecimento regulatório e documentação
HIPAA/NHS Data Security toolkit compliance|Conformidade com HIPAA e NHS Data Security toolkit
GPU compute infrastructure|Infraestrutura computacional com GPUs
AI-powered early detection of conditions|Detecção precoce de doenças com IA
Reduces diagnostic false positives by 40%|Reduz falsos positivos no diagnóstico em 40%
Faster triage in overstretched NHS trusts|Triagem mais rápida em organizações hospitalares sobrecarregadas do NHS
Frees clinician time for complex cases|Libera tempo dos profissionais clínicos para casos complexos
Consistent quality across trusts|Qualidade consistente entre organizações hospitalares
Audit trail for clinical governance|Trilha de auditoria para governança clínica
Dedicated implementation managers per trust|Gestores de implantação dedicados a cada organização hospitalar
24/7 clinical support hotline|Canal de suporte clínico 24 horas por dia, 7 dias por semana
User training programmes for clinicians|Programas de treinamento de usuários para profissionais clínicos
Quarterly business reviews with trust leadership|Revisões trimestrais com a direção da organização hospitalar
Clinical champion network within trusts|Rede de profissionais de referência clínica nas organizações hospitalares
Direct sales to NHS procurement teams|Vendas diretas às equipes de compras do NHS
NHS Innovation Accelerator programme|Programa NHS Innovation Accelerator
NHSX/NHS Transformation Directorate|NHSX/NHS Transformation Directorate
Medical conference presence (NHS Expo, HIMSS)|Participação em congressos médicos (NHS Expo, HIMSS)
Academic publication and peer review|Publicação acadêmica e revisão por pares
Royal College endorsements|Recomendações dos Royal Colleges
NHS acute hospital trusts|Organizações hospitalares do NHS para atendimento de casos agudos
NHS mental health trusts|Organizações de saúde mental do NHS
Private hospital groups (Nuffield, Spire, HCA)|Grupos hospitalares privados (Nuffield, Spire, HCA)
GP federations and primary care networks|Federações de médicos generalistas e redes de atenção primária
Integrated Care Systems (ICS)|Sistemas integrados de atenção à saúde (ICS)
R&D engineering salaries (60% of costs)|Salários da engenharia de pesquisa e desenvolvimento (60% dos custos)
Cloud computing and GPU costs|Custos de computação em nuvem e GPUs
Clinical trial and validation expenses|Despesas com estudos clínicos e validação
Regulatory and legal fees|Despesas regulatórias e jurídicas
Professional indemnity insurance|Seguro de responsabilidade civil profissional
Medical advisory board honoraria|Honorários do conselho consultivo médico
Annual SaaS licensing (per-trust)|Licenciamento anual de SaaS (por organização hospitalar)
Per-diagnosis transaction fees|Taxas por diagnóstico realizado
Implementation and integration fees|Taxas de implantação e integração
Training and certification programmes|Programas de treinamento e certificação
Premium support tiers|Planos de suporte avançado
Clinically validated 94% accuracy|Acurácia de 94% validada clinicamente
Peer-reviewed validation study|Estudo de validação revisado por pares
NHS Innovation Accelerator acceptance|Aceitação no NHS Innovation Accelerator
First NHS acute trust deployed|Primeira implantação em organização hospitalar do NHS para casos agudos
Live revenue from pilot trust|Receita efetiva da organização hospitalar piloto
Clinical champion programme active|Programa ativo de profissionais de referência clínica
EHR integration certified|Integração com EHR certificada
5+ NHS trusts deployed|Implantação em 5+ organizações hospitalares do NHS
First ICS-wide deal|Primeiro contrato abrangendo um ICS
Proven 2.3 year earlier detection|Detecção comprovadamente antecipada em 2,3 anos
NHS procurement framework listed|Inclusão no sistema de compras do NHS
Strategic NHS England relationship|Relacionamento estratégico com NHS England
Competitor wins NHS contract / Regulatory delays|Concorrente conquista contrato com o NHS / Atrasos regulatórios
NHS → Private Wellness Market|NHS → Mercado privado de bem-estar
Consumer health app platforms (Apple Health, Google Fit)|Plataformas de aplicativos de saúde para consumidores (Apple Health, Google Fit)
Private wellness clinic chains|Redes privadas de clínicas de bem-estar
Health insurance providers|Operadoras de planos de saúde
Wellness marketing agencies|Agências de marketing para bem-estar
Consumer app development & UX|Desenvolvimento de aplicativos para consumidores e experiência do usuário
Digital marketing & acquisition|Marketing digital e aquisição de clientes
App store optimisation|Otimização da presença em lojas de aplicativos
Wellness content creation|Criação de conteúdo sobre bem-estar
Consumer product team|Equipe de produtos para consumidores
Brand & marketing expertise|Conhecimento em marcas e marketing
App store presence|Presença em lojas de aplicativos
Personal health insights & trends|Informações e tendências sobre a saúde pessoal
Early warning for lifestyle conditions|Alertas precoces sobre doenças relacionadas ao estilo de vida
Integrates with fitness wearables|Integração com dispositivos vestíveis de atividade física
Shareable reports for GP visits|Relatórios compartilháveis para consultas com médicos generalistas
In-app onboarding & tutorials|Orientação inicial e tutoriais no aplicativo
Community forums & challenges|Fóruns e desafios da comunidade
Gamification & streaks|Gamificação e sequências de uso contínuo
Push notification engagement|Engajamento por notificações do aplicativo
App Store & Google Play|App Store e Google Play
Social media advertising|Publicidade em redes sociais
Health & wellness influencers|Influenciadores de saúde e bem-estar
Employer wellness programmes|Programas de bem-estar oferecidos por empregadores
Health-conscious consumers (35-55)|Consumidores atentos à saúde (35-55 anos)
Fitness enthusiasts tracking metrics|Praticantes de atividade física que acompanham indicadores
Worried well seeking reassurance|Pessoas saudáveis preocupadas com a saúde que buscam tranquilidade
Corporate wellness participants|Participantes de programas empresariais de bem-estar
Customer acquisition costs (CAC)|Custos de aquisição de clientes (CAC)
App development & maintenance|Desenvolvimento e manutenção do aplicativo
Marketing & influencer spend|Despesas com marketing e influenciadores
App store fees (30%)|Taxas das lojas de aplicativos (30%)
Freemium with premium subscription (£9.99/mo)|Versão básica gratuita com assinatura avançada (£9.99/mês)
Family plans (£14.99/mo)|Planos familiares (£14.99/mês)
Insurance partnership revenue share|Participação na receita de parcerias com seguradoras
Anonymised insights licensing|Licenciamento de análises anonimizadas
Market feedback shows doctors want assistance not replacement|O retorno do mercado indica que médicos querem assistência, e não substituição
Diagnostic AI → Clinical Decision Support|IA para diagnóstico → Apoio à decisão clínica
Medical education providers|Provedores de educação médica
Royal Colleges (endorsement)|Royal Colleges (recomendação)
Medical indemnity insurers|Seguradoras de responsabilidade civil médica
Evidence synthesis & guideline integration|Síntese de evidências e integração de diretrizes
Clinical pathway mapping|Mapeamento de linhas de cuidado
Continuing education content|Conteúdo de educação continuada
Multi-disciplinary team support tools|Ferramentas de apoio a equipes multidisciplinares
Clinical guideline database|Base de diretrizes clínicas
Medical education content|Conteúdo de educação médica
Decision audit trail systems|Sistemas de rastreabilidade e auditoria das decisões
Supports clinical reasoning (not replaces)|Apoia o raciocínio clínico (sem substituí-lo)
Surfaces relevant evidence at point of care|Apresenta evidências relevantes no momento do atendimento
Reduces variation in care quality|Reduz a variação na qualidade da assistência
Defensible decision documentation|Documentação que fundamenta as decisões
Clinical champion programmes|Programas de profissionais de referência clínica
Peer learning networks|Redes de aprendizagem entre pares
CPD credit partnerships|Parcerias para créditos de desenvolvimento profissional contínuo
Medical education integration|Integração com a educação médica
Junior doctor training programmes|Programas de treinamento para médicos em início de carreira
Individual clinicians (bottom-up adoption)|Profissionais clínicos individualmente (adoção iniciada pelos profissionais)
Medical education institutions|Instituições de educação médica
Primary care networks|Redes de atenção primária
Medical education content licensing|Licenciamento de conteúdo de educação médica
Clinical guideline curation|Curadoria de diretrizes clínicas
CPD accreditation fees|Taxas de acreditação de desenvolvimento profissional contínuo
Per-clinician licensing|Licenciamento por profissional clínico
Education institution deals|Contratos com instituições de ensino
CPD subscription bundles|Pacotes de assinatura de desenvolvimento profissional contínuo`;
const targets=new Map(pairs.split('\n').map(line=>line.split('|')));
if(targets.size!==pairs.split('\n').length)throw new Error('Fonte duplicada no dicionário.');
if(new Set(targets.values()).size!==targets.size)throw new Error('Textos distintos não podem receber a mesma tradução neste bloco.');
let original;
function read(node){
 if(node.type==='Literal')return node.value;
 if(node.type==='ArrayExpression')return node.elements.map(read);
 if(node.type==='ObjectExpression')return Object.fromEntries(node.properties.map(p=>[p.key.name??p.key.value,read(p.value)]));
 throw new Error('Dado não literal: '+node.type);
}
for(const m of fs.readFileSync('source/index.original.html','utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{VariableDeclarator(n){if(n.id.name==='BMC_DATA')original=read(n.init);}});
}
const strings={};
function visit(value,path){
 if(typeof value==='string'){
  const marker=value.endsWith(' [NEW]')?' [NEW]':'',plain=marker?value.slice(0,-marker.length):value;
  if(!targets.has(plain))throw new Error('Tradução ausente: '+JSON.stringify(path)+' '+value);
  strings[JSON.stringify(path)]={source:value,target:targets.get(plain)+marker};
 }else for(const [key,child] of Object.entries(value))visit(child,[...path,Array.isArray(value)?Number(key):/^\d+$/.test(key)?Number(key):key]);
}
visit(original.aether,['aether']);
const catalogue=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8'));
catalogue.BMC_DATA={classification:'Tradução parcial: subestrutura Aether completa, incluindo seletores de remoção e marcador funcional [NEW] preservado. Contexto britânico original; demais empreendimentos e adaptação brasileira pendentes.',strings:{...(catalogue.BMC_DATA?.strings||{}),...strings}};
fs.writeFileSync('locales/structures.pt-BR.json',JSON.stringify(catalogue,null,2)+'\n');
console.log('BMC_DATA.aether: '+Object.keys(strings).length+' campos tratados.');
