const fs=require('node:fs');
const rows=[
 ['academic','Your academic background opens doors at universities and gives assessors confidence in your research capability.','Sua formação acadêmica abre portas nas universidades e dá aos avaliadores confiança em sua capacidade de pesquisa.'],
 ['serial',"You've navigated the grant system before and know what assessors look for.",'Você já lidou com o sistema de fomento e sabe o que os avaliadores procuram.'],
 ['corporate',"Your corporate network helps with industry partners, but you're new to the grant world.",'Sua rede corporativa ajuda nas parcerias com empresas, mas o mundo do fomento é novo para você.'],
 ['prodigy',"Your technical skills are impressive, but you'll need to learn the grant-writing game.",'Suas habilidades técnicas impressionam, mas você precisará aprender a elaborar propostas de fomento.'],
 ['dealmaker','Your relationship skills help attract partners, but grant applications require different persuasion.','Sua habilidade de relacionamento ajuda a atrair parceiros, mas propostas de fomento exigem outra forma de persuasão.'],
 ['operator',"Your operational rigour helps with project planning sections, but you're new to academic partnerships.",'Seu rigor operacional ajuda nas seções de planejamento dos projetos, mas as parcerias acadêmicas são novidade para você.'],
 ['domain','Your industry credibility helps with sector-specific partners and market sections of applications.','Sua credibilidade no setor ajuda nas parcerias especializadas e nas seções de mercado das propostas.'],
 ['firsttimer',"Without a track record, partners and assessors will be cautious. You'll need to prove yourself.",'Sem um histórico de resultados, parceiros e avaliadores agirão com cautela. Você precisará demonstrar sua capacidade.'],
 ['visionary','Your vision inspires, but grant assessors want concrete plans and evidence.','Sua visão inspira, mas avaliadores de fomento querem planos concretos e evidências.'],
 ['bootstrapper',"Your efficient approach appeals to assessors, but you've fewer connections in the grant ecosystem.",'Sua abordagem eficiente agrada aos avaliadores, mas você tem menos contatos no ecossistema de fomento.'],
 ['community','Your community connections help, but academic grant processes are a different world.','Seus contatos na comunidade ajudam, mas os processos de fomento acadêmico são um mundo diferente.'],
 ['strategist','Your analytical rigour produces strong applications, and your consulting background provides some credibility.','Seu rigor analítico produz propostas bem fundamentadas, e sua experiência em consultoria oferece alguma credibilidade.']
];
const file='locales/structures.pt-BR.json',catalogue=JSON.parse(fs.readFileSync(file,'utf8'));
catalogue.FOUNDER_GRANT_PROFILES={classification:'Doze descrições de perfis traduzidas; identificadores e todos os bônus e valores de experiência, inclusive penalidades negativas, preservados.',strings:Object.fromEntries(rows.map(([id,source,target])=>[JSON.stringify([id,'description']),{source,target}]))};
catalogue.FOUNDER_PORTRAITS={classification:'Doze retratos SVG preservados integralmente como dados gráficos; sem prosa a traduzir.',strings:{}};
fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');
console.log('FOUNDER_GRANT_PROFILES: '+rows.length+' descrições tratadas; FOUNDER_PORTRAITS preservados.');
