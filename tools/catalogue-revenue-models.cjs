const fs=require('node:fs');
const rows=[
 ['b2bSaas','name','B2B SaaS','Software como serviço para empresas (B2B SaaS)'],
 ['b2bSaas','description','Enterprise sales, high-touch, relationship-driven','Vendas empresariais, atendimento próximo e orientação por relacionamentos'],
 ['healthcareProcurement','name','Healthcare / Public Sector','Saúde / Setor público'],
 ['healthcareProcurement','description','Long procurement cycles, regulatory hurdles, large contracts','Ciclos de contratação longos, obstáculos regulatórios e contratos de grande porte'],
 ['consumer','name','Consumer Subscription','Assinatura para consumidores'],
 ['consumer','description','High-volume, low-price, marketing-intensive','Alto volume, preço baixo e uso intensivo de marketing'],
 ['researchGrants','name','Research & Grants','Pesquisa e fomento não reembolsável'],
 ['researchGrants','description','Grant-funded, project-based, academic partnerships','Financiamento não reembolsável, organização por projetos e parcerias acadêmicas'],
 ['platformAPI','name','Platform / API','Plataforma / API'],
 ['platformAPI','description','Developer-focused, usage-based, technical marketing','Foco em desenvolvedores, cobrança por uso e marketing técnico']
];
const file='locales/structures.pt-BR.json',catalogue=JSON.parse(fs.readFileSync(file,'utf8'));
catalogue.REVENUE_MODELS={classification:'Cinco modelos: nomes e descrições traduzidos. Identificadores, métricas, efeitos da equipe, projeções e tolerâncias numéricas preservados; calibração brasileira pendente.',strings:Object.fromEntries(rows.map(([id,field,source,target])=>[JSON.stringify([id,field]),{source,target}]))};
fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');
console.log('REVENUE_MODELS: '+rows.length+' campos tratados.');
