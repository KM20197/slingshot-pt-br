const fs=require('node:fs');
const inventory=JSON.parse(fs.readFileSync('artifacts/inventory.json','utf8'));
const file='locales/pt-BR.json';
const catalogue=JSON.parse(fs.readFileSync(file,'utf8'));
const byLine={
2481:'Uma simulação acadêmica de empreendedorismo',
2482:'Você consegue desenvolver um negócio sustentável?',
2487:'É 2026. Tecnologia e capacidade de gestão podem transformar um empreendimento.',
2490:'A inteligência artificial pode funcionar como uma',
2491:'— assim como a máquina a vapor, a eletricidade ou a computação — capaz de transformar diferentes setores. Seu valor depende de identificar oportunidades, resolver problemas e colocar soluções em prática.',
2493:'No Brasil, empreendedores de saúde, comércio, serviços, indústria e tecnologia enfrentam o desafio de transformar oportunidades em negócios viáveis. Conhecer o cliente, formar uma equipe e administrar recursos limitados são decisões centrais dessa trajetória.',
2496:'Agora é sua vez. Escolha seu empreendimento, forme sua equipe e desenvolva o negócio ao longo de dezesseis trimestres.',
2499:'Há oportunidades e riscos em cada decisão.',
2500:'Aprenda com as escolhas, os resultados e as novas tentativas.',
2527:'Olá, meu nome é Ammon Salter, professor de gestão de tecnologia e inovação na Warwick Business School. Gostaria de apresentar uma simulação de empreendedorismo tecnológico chamada The Slingshot.',
2530:'O Reino Unido abriga mais de 6.000 empresas de inteligência artificial, constituindo um dos ecossistemas de IA mais dinâmicos do mundo. Bilhões são investidos no setor, mas desenvolver um empreendimento de IA bem-sucedido continua sendo muito difícil. Um unicórnio britânico de IA leva, em média, quase cinco anos para atingir o valor de um bilhão de libras, e a maioria das empresas nunca chega lá.',
2534:'The Slingshot coloca você na direção de uma empresa nascente de IA. Ao longo de quatro anos, sua capacidade de transformar o potencial da IA em um negócio viável será colocada à prova. Suas decisões determinam se a empresa sobrevive.',
2537:'Na simulação original, a cada trimestre você distribui atenção entre prioridades concorrentes: desenvolvimento de produto, contratação, captação de recursos e parcerias de pesquisa. Escolhe a localização do negócio e negocia com financiadores que desejam uma participação expressiva na empresa. Contrata profissionais que também podem exigir participação. Cada rodada de investimento reduz sua parcela societária. É preciso equilibrar ambição e controle. Três concorrentes buscam os mesmos marcos e não vão esperar por você.',
2543:'Mais de 450 eventos apresentam dificuldades enfrentadas por empresas nascentes: avanços de concorrentes, mudanças regulatórias, saída de profissionais importantes e problemas tecnológicos. Você pode solicitar recursos de fomento e receber avaliações realistas das propostas. Pode mudar a estratégia quando as circunstâncias mudam. Nenhuma partida é igual à outra, e as escolhas envolvem concessões.',
2548:'O jogo exige desenvolver e executar uma estratégia empreendedora, distribuir recursos e administrar a tensão entre rigor científico e expectativas comerciais. Você precisará responder a financiadores que oferecem orientação e exigem atenção. Talvez seja necessário buscar oportunidades melhores antes de o dinheiro acabar. A maioria dos jogadores fracassa na primeira tentativa. Ninguém disse que empreender seria fácil.',
2553:'Você consegue desenvolver o próximo unicórnio britânico de IA? The Slingshot espera por você. Experimente.',
2554:'O vídeo apresenta uma sequência de imagens ilustrativas sem texto na tela. Começa com o logotipo do Slingshot e um foguete decolando, seguidos de quatro imagens sobre tecnologia e suas aplicações; um infográfico dos recursos do jogo descritos nesta página; uma folha com um plano ao longo do tempo; Londres e o rio Tâmisa; pilhas de dinheiro; duas pessoas apertando as mãos; quatro bicicletas em uma corrida; um grupo em discussão; imagens de crescimento empresarial e de uma partida; reuniões de equipe; um diagrama de mudança de direção; pessoas chorando; outra reunião; e termina com o logotipo do Slingshot.',
2701:'Criado por Ammon Salter (Warwick Business School), com Stefano Baruffaldi (Politecnico di Milano) e Federico Bignone (Warwick Business School)'
};
for(const [line,translation] of Object.entries(byLine)){
 const candidates=inventory.htmlStrings.filter(s=>s.line===Number(line)&&s.context==='HTMLText').sort((a,b)=>b.text.length-a.text.length);
 if(!candidates[0])throw new Error('Linha de conteúdo ausente: '+line);
 catalogue[candidates[0].text.trim()]=translation;
}
Object.assign(catalogue,{
 'general purpose technology':'tecnologia de propósito geral',
 'The Slingshot — Introduction Video':'The Slingshot — vídeo original de apresentação',
 'Video transcript and description':'Transcrição em português e descrição do vídeo original',
 'Narration.':'Narração do original britânico (as regras de financiamento da edição brasileira são diferentes).',
 'What is shown.':'Descrição das imagens.',
 'Start in Core →':'Iniciar no modo padrão →',
 'The full challenge · competitive play & class benchmarking':'Desafio completo · decisões, concorrência e desenvolvimento',
 'Start in Seed':'Iniciar no modo introdutório',
 'A gentler run to learn the game · no benchmarking':'Mais recursos iniciais para aprender a jogar',
 '💾 Continue Saved Game':'💾 Continuar partida salva',
 '🎓 Guided Play':'🎓 Partida orientada',
 'Learn with coaching':'Aprenda com orientações',
 '📚 Tutorial':'📚 Tutorial',
 'Learn the mechanics':'Conheça os mecanismos',
 '🔥 Extreme Mode':'🔥 Modo extremo',
 'Hidden stats, no hints, less cash':'Efeitos ocultos, sem dicas e menos caixa',
 'OFF':'DESATIVADO',
 '• Hidden stat effects & impact tags':'• Efeitos sobre os indicadores e impactos ocultos',
 '• Silent advisors - no recommendations':'• Assessores silenciosos, sem recomendações',
 '• 20% less starting cash':'• Caixa inicial 20% menor',
 'New to the game? The tutorial takes about 5 minutes.':'Primeira partida? O tutorial leva cerca de 5 minutos.',
 'Average game: 25-40 minutes':'Duração estimada da partida: 25 a 40 minutos',
 'Learn more about the UK AI ecosystem':'Tecnologia e oportunidades no Brasil',
 'ℹ️ About This Simulation':'ℹ️ Sobre esta simulação',
 'Code written by':'Código desenvolvido por',
 'and':'e',
 '(OpenAI) and':'(OpenAI) e',
 "(Google) to Ammon Salter's design":'(Google), a partir do projeto de Ammon Salter',
 '🔒 Privacy: This site uses cookieless analytics.':'🔒 Privacidade: o jogo não transmite identificação nem resultados dos participantes.',
 'Privacy Policy':'Política de privacidade',
 '🏆 Progress':'🏆 Progresso',
 '🏛️ Grant Funding':'🏛️ Fomento à pesquisa e inovação',
 'How grant funding works':'Como funciona o fomento',
 'No applications':'Nenhuma proposta',
 'Pending':'Em análise',
 'Last result':'Último resultado',
 'Grant status':'Situação da proposta',
 '📝 Grant Status':'📝 Situação das propostas',
 'Financials':'Finanças',
 '📈 Details':'📈 Detalhes',
 'Revenue:':'Receita:',
 'Customers:':'Clientes:',
 'Burn:':'Despesas:',
 'Net:':'Resultado:',
 'Runway:':'Autonomia:',
 'vs Target:':'Em relação à meta:',
 '📝 Log':'📝 Histórico',
 'Your story begins...':'Sua trajetória começa...',
 'Show Stats':'Mostrar indicadores'
});
fs.writeFileSync(file,JSON.stringify(catalogue,null,2)+'\n');
console.log('Entradas revisadas de interface: '+Object.keys(catalogue).length);
