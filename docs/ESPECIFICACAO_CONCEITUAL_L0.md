# Especificação Conceitual L0 — Adaptação Brasileira do Simulador

> Rascunho conceitual aprovado para orientar os lotes posteriores. Não autoriza alterações em código, catálogos, dados, build, testes, staging, commit ou push.

## 1. Escopo e objetivo pedagógico

O simulador será adaptado para o contexto brasileiro, como ambiente didático para estudantes de graduação e pós-graduação em engenharia, administração, computação e saúde. A experiência aborda decisões fictícias de pequenos e médios negócios, sem movimentar valores, contratos ou obrigações reais.

A versão integrada anterior é um rascunho parcial, incoerente e não aceito como adaptação final. Esta especificação define somente conteúdo descritivo e diretrizes conceituais. IDs, fórmulas, valores, probabilidades, ordem de arrays e chaves internas permanecem congelados.

## 2. Matriz conceitual dos 12 empreendimentos

Todos os itens desta seção são **[PROPOSTA CONCEITUAL]**. Os conteúdos originais citados como “a desaparecer” deverão ser removidos apenas da experiência exibida ao jogador, por mecanismo técnico aprovado em L1.

### 2.1 `aether` — Clínica popular

- **Operação:** Operação simulada de clínica popular, limitada à gestão administrativa de agenda, recepção e fluxo físico.
- **Produto/serviço:** Organização administrativa de agendamentos e recepção em cenários fictícios.
- **Clientes:** Pessoas fictícias que frequentam a clínica simulada, sem registro ou tratamento de dados pessoais ou de saúde.
- **Receita descritiva:** Pagamentos simulados vinculados à organização administrativa de agendamentos e recepção.
- **Concorrência:** Outras clínicas populares fictícias e operações locais de recepção.
- **Oportunidades:** agilidade em agendamentos e organização de salões de espera.
- **Dificuldades:** escala de atendentes de recepção e controle do fluxo físico.
- **Limites:** sem dados pessoais ou de pacientes; sem triagem, diagnóstico, exames, prescrição, aconselhamento clínico ou alegação terapêutica.
- **Conteúdo original a desaparecer:** NHS, UK GDPR, MHRA e parceiros estrangeiros de estudos clínicos.

### 2.2 `edu` — Academia

- **Operação:** serviço de condicionamento físico em salão próprio.
- **Produto/serviço:** acesso a equipamentos de musculação e esteiras.
- **Clientes:** moradores do entorno que buscam exercícios regulares.
- **Receita descritiva:** mensalidades e planos recorrentes de acesso.
- **Concorrência:** redes de baixo custo e pequenos estúdios de bairro.
- **Oportunidades:** atendimento no salão e manutenção rápida dos aparelhos.
- **Dificuldades:** sazonalidade e cancelamentos.
- **Limites:** sem promessa de resultado físico garantido, orientação médica ou venda de suplementos controlados.
- **Conteúdo original a desaparecer:** currículo escolar britânico, métricas do Reino Unido e subsídios educacionais europeus.

### 2.3 `avam` — Assistência técnica de celulares

- **Operação:** oficina de reparos físicos e reposição de peças.
- **Produto/serviço:** troca de telas e baterias, além de reparos de placas em dispositivos portáteis.
- **Clientes:** consumidores com aparelhos danificados ou fora de garantia.
- **Receita descritiva:** componentes substituídos e mão de obra técnica.
- **Concorrência:** quiosques, lojas de galerias e redes franqueadas.
- **Oportunidades:** atendimento padronizado, confiança e garantia de peças.
- **Dificuldades:** estoque para diversos modelos e risco de dano durante o manuseio.
- **Limites:** sem coleta, extração, visualização ou menção a dados pessoais armazenados nos aparelhos.
- **Conteúdo original a desaparecer:** legislação europeia de infraestrutura de dados e laboratórios estrangeiros.

### 2.4 `voed` — Restaurante por quilo

- **Operação:** alimentação presencial com autoatendimento.
- **Produto/serviço:** bufê diário de pratos quentes e saladas para consumo no salão.
- **Clientes:** trabalhadores e comerciários da região no horário de almoço.
- **Receita descritiva:** faturamento pela pesagem individual dos pratos.
- **Concorrência:** lanchonetes, marmitarias e restaurantes executivos locais.
- **Oportunidades:** giro de mesas e redução de desperdício de insumos.
- **Dificuldades:** oscilação de matérias-primas e concentração de trabalho em poucas horas.
- **Limites:** sem alegação de saúde, certificação nutricional, adequação a dieta restritiva ou referência sanitária real.
- **Conteúdo original a desaparecer:** cadeias de suprimento europeias e inovações agronômicas estrangeiras.

### 2.5 `legal` — Farmácia

- **Operação:** varejo simulado de higiene, perfumaria e conveniência.
- **Produto/serviço:** produtos padronizados de higiene e cuidados pessoais em prateleiras.
- **Clientes:** público que busca itens de conveniência ou cuidados básicos.
- **Receita descritiva:** margem comercial sobre a venda de produtos de prateleira.
- **Concorrência:** redes de drogarias e supermercados locais.
- **Oportunidades:** mix de higiene e perfumaria.
- **Dificuldades:** prevenção de perdas e capital de giro em estoque comercial.
- **Limites:** sem venda ou dispensação de medicamentos, receitas, dados de pacientes, diagnóstico, aconselhamento médico ou alegação clínica.
- **Conteúdo original a desaparecer:** controvérsias jurídicas britânicas, processos de Londres e regras de cortes estrangeiras.

### 2.6 `dream` — Minimercado

- **Operação:** varejo alimentar de vizinhança.
- **Produto/serviço:** bebidas, produtos de limpeza, alimentos secos e gêneros de primeira necessidade.
- **Clientes:** moradores em compras de reposição ou emergência.
- **Receita descritiva:** giro de estoque pago no balcão.
- **Concorrência:** redes atacadistas, hipermercados e mercearias.
- **Oportunidades:** oferta de marcas regionais.
- **Dificuldades:** pouco espaço de armazenagem e negociação com distribuidores.
- **Limites:** sem afirmação sobre procedência sanitária, fiscalização ou segurança alimentar factual.
- **Conteúdo original a desaparecer:** mercado criativo londrino, IA artística e estúdios estrangeiros.

### 2.7 `arene` — Loja de roupas

- **Operação:** varejo de vestuário e acessórios.
- **Produto/serviço:** peças prontas, casuais e sazonais.
- **Clientes:** pessoas interessadas em moda básica ou tendências da estação.
- **Receita descritiva:** venda direta de peças.
- **Concorrência:** lojas de shopping, galerias e comércio pela internet.
- **Oportunidades:** vitrines e atendimento no salão de vendas.
- **Dificuldades:** coleções paradas e mudanças de estação.
- **Limites:** sem garantia de conformidade trabalhista, origem de materiais ou selo de sustentabilidade real.
- **Conteúdo original a desaparecer:** clubes e ligas esportivas britânicas, incluindo Leeds e Championship.

### 2.8 `vanguard` — Material de construção

- **Operação:** varejo e pequeno atacado de insumos para obras.
- **Produto/serviço:** areia, cimento, ferragens, tintas e acabamentos.
- **Clientes:** moradores em reforma e profissionais locais de obra.
- **Receita descritiva:** ordens de compra no balcão e no pátio.
- **Concorrência:** grandes lojas de bricolagem e depósitos de bairro.
- **Oportunidades:** entrega rápida em pequenas distâncias.
- **Dificuldades:** espaço, margens de itens pesados e inadimplência em vendas a prazo.
- **Limites:** sem endosso de certificação técnica, alvará ou conformidade de engenharia real.
- **Conteúdo original a desaparecer:** robótica industrial e automação europeia.

### 2.9 `terra` — Produtos de limpeza

- **Operação:** produção e distribuição didática de produtos de higiene e limpeza profissional.
- **Produto/serviço:** detergentes e suprimentos para conservação de espaços.
- **Clientes:** empresas de conservação, condomínios e pequenos escritórios.
- **Receita descritiva:** fornecimento recorrente em galões para compradores comerciais.
- **Concorrência:** indústrias multinacionais e fábricas informais.
- **Oportunidades:** rotas de entrega diretas e venda no atacado.
- **Dificuldades:** embalagens plásticas e padronização da produção.
- **Limites:** sem alegação de eficácia, esterilização, aplicação hospitalar, certificação, registro ou conformidade regulatória.
- **Conteúdo original a desaparecer:** créditos de carbono, fazendas de precisão e painéis solares europeus.

### 2.10 `sorgente` — Alimentos congelados

- **Operação:** fabricação em pequena escala e empacotamento de refeições rápidas.
- **Produto/serviço:** porções prontas, seladas e resfriadas para aquecimento doméstico.
- **Clientes:** famílias e pessoas sem tempo para cozinhar.
- **Receita descritiva:** comercialização em freezer próprio ou revenda em mercados.
- **Concorrência:** grandes indústrias alimentícias e serviços locais de entrega.
- **Oportunidades:** diversificação de cardápio e parcerias com minimercados.
- **Dificuldades:** cadeia de frio e logística de embalagens.
- **Limites:** sem garantia de vigilância sanitária, validade real ou prescrição de perda de peso.
- **Conteúdo original a desaparecer:** saúde mental preventiva britânica e avaliações corporativas do Reino Unido.

### 2.11 `cyber` — Confecção

- **Operação:** oficina fabril de corte e costura em lotes.
- **Produto/serviço:** camisetas e calças padronizadas para revendedores.
- **Clientes:** distribuidores de moda e redes varejistas.
- **Receita descritiva:** encomendas entregues em lotes.
- **Concorrência:** polos têxteis regionais e produtos importados.
- **Oportunidades:** flexibilidade para pequenos lotes e estampas locais.
- **Dificuldades:** retenção de mão de obra capacitada e manutenção de maquinário.
- **Limites:** sem simular fiscalização trabalhista real ou certificação sindical.
- **Conteúdo original a desaparecer:** incidentes cibernéticos do Reino Unido e legislação europeia de segurança da informação.

### 2.12 `quant` — Gráfica/embalagens

- **Operação:** impressão e montagem de artefatos de papel.
- **Produto/serviço:** pastas comerciais, caixas de papelão leve, folhetos e adesivos.
- **Clientes:** pequenas empresas, comércio local e agências de publicidade.
- **Receita descritiva:** ordens de serviço faturadas após a entrega.
- **Concorrência:** cópias rápidas de vizinhança e gráficas digitais.
- **Oportunidades:** fidelidade de cor e cumprimento de prazos.
- **Dificuldades:** tintas e manutenção de maquinário.
- **Limites:** sem afirmação de certificação atóxica para embalagens de alimentos ou selo real de celulose.
- **Conteúdo original a desaparecer:** finanças de Londres, corretoras, moedas estrangeiras e negociação bancária institucional.

## 3. Matriz dos sete perfis de fundador

Os perfis abaixo são propostas conceituais. O vínculo de cada perfil com seu ID ou estrutura original será confirmado no L1.

| Perfil proposto | Objetivo pedagógico | Competências e postura de risco | Campos funcionais futuros afetados |
|---|---|---|---|
| Comerciante de bairro | Operação inicial com recursos e reservas curtas. | Conhecimento de clientes e fluxo de caixa diário; aversão a endividamento elevado. | **[PROPOSTA CONCEITUAL — decisão funcional e econômica pendente]** |
| Recém-egresso da graduação | Transição de conhecimentos recém-aprendidos para a gestão de negócios. | Organização e aprendizado rápido; cautela na preservação do capital inicial. | **[PROPOSTA CONCEITUAL — decisão funcional e econômica pendente]** |
| Profissional em transição de carreira | Migração de experiência corporativa para microempresa própria. | Planejamento e processos formais; risco moderado. | **[PROPOSTA CONCEITUAL — decisão funcional e econômica pendente]** |
| Especialista técnico | Contraste entre execução técnica e desafio comercial. | Controle de qualidade e equipamentos; expansão gradual. | **[PROPOSTA CONCEITUAL — decisão funcional e econômica pendente]** |
| Focado em vendas | Crescimento comercial acima da capacidade inicial de entrega. | Persuasão e fechamento de contratos; risco elevado. | **[PROPOSTA CONCEITUAL — decisão funcional e econômica pendente]** |
| Sucessor familiar | Pressões de governança e operação com estrutura pré-existente. | Delegação e preservação patrimonial; risco conservador. | **[PROPOSTA CONCEITUAL — decisão funcional e econômica pendente]** |
| Veterano de negócios | Gestão de crises e de oscilações de mercado. | Resiliência e mitigação de problemas; risco analítico. | **[PROPOSTA CONCEITUAL — decisão funcional e econômica pendente]** |

## 4. Diretrizes para tutorial, interface, créditos e privacidade

- A interface exibirá claramente que se trata de adaptação brasileira e preservará atribuição e licença originais: Slingshot — Salter, Baruffaldi & Bignone — CC BY-NC-SA 4.0.
- A Ada via Claude é uma integração externa autorizada exclusivamente para consulta sobre cenários fictícios.
- Antes do redirecionamento à Ada, a interface exibirá aviso explícito sobre o serviço externo.
- É proibido estimular, solicitar, armazenar ou cruzar dados pessoais, médicos, financeiros reais ou informações corporativas factuais dos alunos.

## 5. Campos congelados

Em lotes descritivos, não alterar:

- IDs;
- `archetype`, `revenueModel`, `crowdfundFit`, `staff` e `burn`;
- números, fórmulas, probabilidades e multiplicadores;
- ordem de arrays e chaves internas.

## 6. Critérios de aceite e limites das etapas

- **Conteúdo descritivo:** a aprovação desta especificação autoriza somente futura adaptação de texto em rotas de catálogo aprovadas; nenhum texto altera regras do motor ou seu equilíbrio matemático.
- **L1:** nomes globais, perfis, marcos e outros rótulos presos ao build permanecem intocados até que L1 documente uma camada de exibição segura, separada das chaves JavaScript.
- **L3b:** qualquer alteração em investimento, empréstimo, taxa ou elegibilidade depende de lote funcional isolado, mapeamento técnico, parâmetros pedagógicos/econômicos aprovados e validação independente.
