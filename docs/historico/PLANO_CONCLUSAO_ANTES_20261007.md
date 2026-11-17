> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Plano de conclusão — Slingshot Brasil

Data: 25/09/2026. Planejamento P0 publicado em `4696c6301ae38345d1a1d23502ad06fb5f9f9d70`. As evidências da seção 1 descrevem o checkpoint histórico do P0.

Checkpoint vigente (05/10/2026, posterior à atualização abaixo): `FUNDER_ADVICE` permanece reconferido integralmente em teste permanente — 861 caminhos, 41 perfis, `self` nulo, regras preservadas e 1.476 comparações determinísticas. Foram traduzidos 75 caminhos de `PIVOT_TEAM`, 45 de `STRATEGIC_PIVOTS`, 47 de `FORCED_RESPONSES`, 26 de `PIVOT_MILESTONES` e 194 campos de apresentação de `VENTURE_MARKETS` (24 atuais, 36 nomes alternativos, 36 descrições, 36 resumos, 26 lacunas de equipe e 36 comentários de financiadores). O build reproduzível conferiu 27 blocos e 183 traduções HTML; `check_project.ps1` passou com 233/233 testes e SHA original intacto. Contagem atual: 40 entradas, 4.013 caminhos, 3.951 destinos distintos; 31 estruturas ainda sem entrada. `VENTURE_MARKETS` e `PIVOT_MILESTONES` estão em `partial-translation`; os demais textos e dados continuam pendentes e a interface/isolamento das rotas não são considerados completos. A revisão independente das correções de pivôs/forçadas alcançou 10/10; o recorte ampliado de mercados ainda requer nova revisão independente antes de aceite. P1 permanece aberto; P2 não foi iniciado. HEAD local desta conferência: `36714758dd64c7b4bd9107633c946f969b5d3706`, sem consulta ao remoto, staging ou commit. As referências de Git e contagens das atualizações históricas abaixo não descrevem o checkout atual.

Atualização anterior de execução (02/10/2026, encerramento dos conselhos e FOLLOW_ON_INVESTORS): o lote histórico de três perfis da seção 6 foi registrado no commit `65767d417b985c99bf412506b8f58b535f2712e4`, com 61 campos novos e 235 anteriores preservados. A reenumeração completa do AST confirmou 861 campos traduzíveis de `FUNDER_ADVICE` em 41 perfis; `self` permanece nulo. Os cinco perfis finais foram regenerados, testados e aceitos em revisão independente: meilingKoh 9,5/10, zaraHassan 9,2/10, jaylenBrooks 9,4/10, yusufDemir 9,5/10 e eleanorWhitfield 9,4/10. IDs, preferências, escolhas e efeitos hostis foram preservados. `FUNDER_OPTIONS` e `VENTURE_ANGELS` foram classificados como técnicos, e os 64 caminhos de `FOLLOW_ON_INVESTORS` traduzidos sem modificar IDs, SVGs, valores, diluição, bônus ou tiers; revisão 9,6/10. O recorte então contado continha 25 estruturas, 3.626 caminhos e 3.564 destinos distintos. A contagem vigente é a do checkpoint acima. As referências históricas a HEAD/origin/main no commit de três perfis não confirmam o checkout de hoje nem o remoto. P2–P8 não foram implementados por essa atualização de tradução.

## 1. Base, evidências e limites

Checkout: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. Shell desta etapa: PowerShell. HEAD local: `b0b8aa3ac773ba388f608819970ffccde897d435`. Não houve consulta ao remoto, staging, commit ou push nesta etapa.

Autoridades: `AGENTS.md`, `docs/DECISOES_APROVADAS.md` e requisitos do handoff. Fontes de evidência: `docs/INVENTARIO.md`, `source/index.original.html`, `locales/structures.pt-BR.json`, gerador do Mobility, testes presentes e `docs/REVISAO_LOTE_MOBILITY.md`. Inspeções desta etapa foram somente de leitura, exceto pelos dois documentos autorizados.

Na abertura, existiam alterações em `AGENTS.md` e `.opencode/agents/gauntlet-reviewer.md`, e arquivos não rastreados `docs/agent-routes/models.md` e `HANDOFF_LLM_COMPLETO.md` na raiz. Preservar esses arquivos fora do lote documental e fora de seu futuro staging. O plano não aprova essas mudanças anteriores.

O SHA-256 do original foi conferido: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`. A extração sintática somente de leitura confirmou a correspondência de 71 estruturas com o inventário. Não foi executado o gerador de inventário, pois ele escreve arquivos fora do escopo.

| Medida conferida | Resultado e interpretação |
|---|---|
| Estruturas registradas no catálogo | 40 de 71; inclui classificações técnicas, uma tradução parcial e duas entradas explicitamente pendentes |
| Caminhos catalogados | 3.806; 3.744 têm destino diferente da fonte |
| FUNDER_ADVICE | 861 campos em 41 perfis; `self` nulo; cobertura completa verificada por AST |
| Estruturas sem entrada | 31; entrada existente não é sinônimo de tradução concluída |
| Próxima sequência pendente | demais campos de `VENTURE_MARKETS`, `STRATEGIC_PIVOTS`, `FORCED_RESPONSES`, `PIVOT_MILESTONES`; demais estruturas, interface e mensagens de P1 continuam pendentes |
| Evidência histórica Mobility | 109/109 testes, 19 scripts, exit 0, revisão final 9,0/10 após três ciclos, segundo relatório do lote |

As contagens vigentes foram obtidas por leitura do catálogo e análise AST da fonte. Não são percentuais de conclusão. O P0 histórico foi exclusivamente documental e não repetiu testes de aplicação; a continuação vigente de P1 executou build e 212/212 testes. Isso não comprova inspeção visual ou todos os percursos online/offline. A revisão do Mobility não foi reaberta.

## 2. Classificação das 49 estruturas sem catálogo

Classificação de planejamento baseada na forma e no conteúdo da fonte; não substitui a extração por caminho e a inspeção dos consumidores antes de cada lote. “Mista” exige traduzir apenas prosa e rótulos, preservando IDs, números, nomes próprios factuais, seletores e regras. Os limites por linha estão em `docs/INVENTARIO.md`.

| Estruturas | Quantidade | Classe e tratamento previsto |
|---|---:|---|
| `FUNDER_OPTIONS`, `VENTURE_ANGELS` | 2 | Referências internas de opções/perfis. Preservar IDs; futura substituição funcional de financiamento é separada da tradução. |
| `FOLLOW_ON_INVESTORS` | 1 | Mista: descrições e rótulos traduzíveis, IDs e parâmetros preservados; revisão das rotas societárias necessária. |
| `MILESTONES`, `PIVOT_TEAM`, `VENTURE_MARKETS` | 3 | Mistas: objetivos, cargos e descrições; `VENTURE_MARKETS` tem 60 campos de apresentação traduzidos, preservando nomes factuais, metas, categorias e efeitos. |
| `MO_RISK_WEIGHTS`, `ARCHETYPE_PIVOT_MAP` | 2 | Pesos e mapeamentos técnicos; sem tradução direta. |
| `STRATEGIC_PIVOTS`, `FORCED_RESPONSES`, `PIVOT_MILESTONES` | 3 | Mistas: opções e marcos exibidos, com efeitos e IDs técnicos. |
| `EXECUTIVES`, `HR_EXECS` | 2 | Mistas: biografias e papéis; nomes, retratos e modificadores preservados. |
| `_PG_TONE_SKIN`, `_PG_ACCENT`, `_PG_EURO_M`, `_PG_EURO_F`, `_PG_DARKH` | 5 | Paletas de cores técnicas; preservar. |
| `CANDIDATE_POOL`, `CHAR_EVENTS`, `GENERIC_EVENTS` | 3 | Mistas e volumosas: perfis, diálogos, eventos e escolhas; subdividir por grupo/caminho e preservar efeitos. |
| `RIVALS`, `PIVOT_RIVALS` | 2 | Mistas: descrições e mensagens, com métricas e identidades; adaptação brasileira depende da matriz aprovada. |
| `REVENUE_MARKETING_EVENTS`, `FUNDER_EVENTS`, `COMPETITIVE_EVENTS` | 3 | Mistas: narrativas e opções com efeitos; mapear referências societárias antes de adaptar. |
| `MARKETS`, `NEWS`, `SHOCKS`, `TOKEN_SETTINGS`, `LIFE_EVENTS` | 5 | Rótulos/prosa e dados técnicos; separar conteúdo didático de preços, efeitos e identificadores. |
| `TOKEN_BASELINES`, `TOKEN_PER_STAFF` | 2 | Parâmetros numéricos; preservar na tradução. |
| `CONFERENCES`, `TICKER_LINES`, `DELEGATE_TYPES` | 3 | Conteúdo de apresentação/misto: prosa e rótulos; preservar nomes factuais, IDs e cores. |
| `VENUE_THEMES`, `SKIN_TONES`, `HAIR_TONES`, `OUTFITS`, `CONF_COSTS`, `CONF_SLOT_OFFSETS` | 6 | Estilos, paletas, custos e coordenadas; sem tradução direta. |
| `UIEffects` | 1 | Métodos, classes e templates de apresentação. Rótulos recebidos devem ser tratados nos chamadores; revisar acessibilidade, sem traduzir classes ou código. |
| `PITCH_FIGURES`, `PITCH_SEATS`, `PITCH_CHAIR_COLOURS`, `PITCH_TROUSER_COLOURS`, `PITCH_TOP_COLOURS`, `PITCH_POSES` | 6 | Configuração gráfica, posições e estados de pose; preservar identificadores. |
| **Total** | **49** | Classificação documental feita no P0, sem alterar catálogos naquela etapa. |

HTML, atributos acessíveis, modais e mensagens dentro de métodos exigem cobertura separada. Os 40.693 candidatos JavaScript e 2.486 candidatos HTML do inventário incluem material técnico e não representam uma lista pronta de traduções. Grandes literais, SVGs e templates precisam de classificação específica.

## 3. Requisitos aprovados e propostas

São requisitos aprovados: edição brasileira acadêmica, português integral, preservação do motor fora das adaptações autorizadas, dívida sem participação societária, fomento com elegibilidade, nota 0–5, exportação local e conferência pelo professor, privacidade, salvamento/retomada e jogo online/offline até Q16.

Permanecem aprovados os parâmetros didáticos de dívida: banco 24% a.a./12 trimestres; familiares 6%/8; ONG elegível 8%/12; agiotagem fictícia 120%/4. Taxa trimestral efetiva, amortização constante, juros sem capitalização de atrasos, primeira parcela no trimestre seguinte e ajuste final de centavos. Conversão: uma unidade do motor corresponde a 100.000 centavos. Não reapresentar esses parâmetros como decisões em aberto nem como ofertas reais.

O P0 propôs a divisão P1–P8, a sequência operacional, o lote de três perfis e os cenários adicionais de validação. O lote de três perfis foi posteriormente autorizado e implementado; a organização do restante do plano não aprova novos empreendimentos, valores ou programas reais. Não há prazo estimado nem implantação automática.

## 4. Etapas, dependências e critérios

### P1 — Tradução e classificação integral

- **Estado:** 40 entradas registradas, incluindo três pendências explícitas e uma tradução parcial; FUNDER_ADVICE completo (861 campos em 41 perfis, com `self` nulo); FUNDER_OPTIONS e VENTURE_ANGELS técnicos, FOLLOW_ON_INVESTORS com 64 caminhos, PIVOT_TEAM com 75 textos e `VENTURE_MARKETS` com 60 textos de apresentação traduzidos; marcos/gestores usam camadas aprovadas preexistentes. Interface, atributos, mensagens e outras estruturas continuam incompletos. Verificação atual: 214/214, fonte intacta; não confundir com inspeção visual ou conclusão de P1.
- **Entrega:** completar conselhos em lotes na ordem da fonte; classificar as demais estruturas e traduzir os campos pertinentes; cobrir HTML, atributos e mensagens fora das estruturas.
- **Dependências:** P0 e escopo de cada lote. Textos destinados a mudança funcional devem ser coordenados com P2/P3 para evitar tradução descartável, sem alterar a ordem dentro do lote escolhido.
- **Arquivos prováveis:** `locales/structures.pt-BR.json`, arquivos de destinos em `locales/`, `locales/pt-BR.json`, `tools/catalogue-*.cjs`, `tools/build.cjs`, testes de tradução e relatórios. `index.html` somente por geração.
- **Aceite/testes:** cobertura exata por caminho, fonte correspondente, destinos não vazios, exclusões justificadas, paridade AST e testes diferenciais quando métodos forem afetados; `.\check_project.ps1`, revisão independente e inspeção de prosa/termos.
- **Decisões:** resolver ambiguidades reais de terminologia; preservar referências britânicas factuais até adaptação aprovada.

### P2 — Matriz brasileira de empreendimentos

- **Estado:** prosa de empreendimentos originais traduzida; inventário somente de leitura da cópia Johgo candidata concluído em 26/09/2026 e reconciliado em `docs/REVISAO_EXPLORACAO_JOHGO_P2_2026-09-26.md`; matriz brasileira final ainda não proposta nem aprovada.
- **Entrega:** matriz relacionando cada empreendimento original ao caso mantido/adaptado, público, modelo de receita, BMC, mercado, marcos, equipe, concorrentes e justificativa acadêmica. Academia, supermercado e clínica são candidatos já citados, não valores/modelos automaticamente aprovados.
- **Dependências:** referência Johgo recebida e identificada por origem, versão e hash; decisão explícita do usuário antes de substituir dados. A investigação somente de leitura para localizar e descrever a referência é elegível, mas não aprova casos, valores ou alteração de arquivos.
- **Arquivos prováveis:** novo documento de matriz a delimitar; depois, catálogos de `COMPANIES`, `VENTURE_DETAILS`, `BMC_DATA`, mercados, marcos e concorrentes via build.
- **Aceite/testes:** aprovação explícita da matriz, rastreabilidade de dependências e manutenção dos IDs técnicos; testes de coerência de referências e percursos de cada negócio após implementação.
- **Decisões:** quais casos substituir/manter, setores e profundidade da adaptação. Não exigir nova decisão para fatos já aprovados.

### P3 — Dívida, fomento e remoção de rotas societárias

- **Estado:** módulos de dívida e três rotas brasileiras presentes; integração completa e fomento ainda pendentes conforme handoff. A presença dos testes existentes não é prova de cobertura de todas as rotas.
- **Entrega:** mapa de entradas/efeitos/saídas de financiamento; substituir negociação societária, remuneração em ações, diluição em eventos e finais de IPO. Separar empréstimos de bolsas e recursos não reembolsáveis, com elegibilidade e justificativa didática.
- **Dependências:** P2 para adequação dos negócios; parâmetros de dívida já aprovados. Programas reais exigem pesquisa factual atual e decisão antes da inclusão.
- **Arquivos prováveis:** `finance.js`, `finance-adapter.js`, `initial-credit.js`, `continuing-credit.js`, `crisis-credit.js`, patches em `tools/build.cjs`, catálogos de financiadores/eventos e testes de crédito/integração.
- **Aceite/testes:** nenhuma rota jogável emite ações, dilui ou exige IPO; testes de cada rota e ausência de atalhos legados. Validar parcelas, responsabilidade pessoal/empresarial, centavos, atrasos, pagamento parcial e fomento inelegível/sem juros. Buscar termos é apoio à inspeção, não prova suficiente de remoção funcional.
- **Decisões:** modalidades de fomento e regras ainda não documentadas; resolução didática de finais/remunerações substituídos.

### P4 — Calibração monetária e equilíbrio

- **Estado:** parâmetros originais e conversão técnica existem; realismo brasileiro não demonstrado.
- **Entrega:** tabela fundamentada de caixa inicial, custos, salários, receitas, metas, limites de crédito e cenários de risco por negócio.
- **Dependências:** P2/P3 aprovados; fontes e data de referência definidas.
- **Arquivos prováveis:** catálogos e módulos que alimentam valores via build; testes de cenários e conversão financeira.
- **Aceite/testes:** unidades explícitas, arredondamento controlado, cenários comparáveis até Q16 e ausência de caminhos inviáveis por erro de escala. Registrar hipóteses, sem prometer equivalência à economia real.
- **Decisões:** faixa de porte, dificuldade e valores propostos para aprovação.

### P5 — Interface e acessibilidade

- **Estado:** tradução de interface parcial; há mecanismos de acessibilidade no original, sem auditoria integral desta edição no P0.
- **Entrega:** landing page, instruções, modais, mensagens, rótulos e fluxos em português; controles acessíveis nos percursos afetados.
- **Dependências:** estabilização dos fluxos de P2–P4; partes independentes podem ser tratadas após P0 em lotes próprios.
- **Arquivos prováveis:** `locales/pt-BR.json`, patches de `tools/build.cjs`, módulos de interface e `professor.html`.
- **Aceite/testes:** teclado, foco visível e retorno de foco, ausência de armadilhas, nomes/rótulos, mensagens dinâmicas, contraste, ampliação, movimento reduzido e amostras com leitor de tela. Registrar navegador, modo e passos; automação não comprova conformidade integral.
- **Decisões:** meta formal de acessibilidade e navegadores de referência, caso ainda não definidos; não dependem de ferramentas pagas.

### P6 — Salvamento, nota, exportação e professor

- **Estado:** `save-validation.js`, módulos acadêmicos, exportação e página do professor presentes; testes existentes são evidência de implementação, não de validação integral desta sessão.
- **Entrega:** retomar partidas com contratos brasileiros consistentes; preservar a nota aprovada; gerar TXT local e conferir assinatura/recálculo no professor.
- **Dependências:** P3/P4 e interface pertinente. Não alterar fórmula aprovada para acomodar falhas de integração.
- **Arquivos prováveis:** `save-validation.js`, `academic.js`, `academic-export.js`, `result-code.js`, `professor.html` e testes correspondentes.
- **Aceite/testes:** salvar/retomar em trimestres intermediários com dívida e atraso; rejeitar estado inconsistente; nota 0–5, sucesso antecipado, ausência de obrigações, atraso e arredondamento final. Testar arquivo adulterado, chave incorreta, exportação obsoleta e identificação opcional exclusivamente local.
- **Decisões:** política para saves incompatíveis caso ainda não documentada. HMAC não prova autoria nem criptografa; manter a limitação visível.

### P7 — Partidas completas e revisão final

- **Estado:** partida integral com todos os requisitos brasileiros não comprovada.
- **Entrega:** matriz de percursos por empreendimento e evidências de sucesso, falha/crise, continuidade até Q16, salvamento/retomada e exportação/professor. Sucesso antecipado é cenário próprio; não simular Q16 não jogado.
- **Dependências:** P1–P6 concluídos no escopo aprovado.
- **Arquivos prováveis:** testes de integração existentes e novos testes delimitados, relatórios de execução e distribuíveis gerados.
- **Aceite/testes:** suíte determinística e revisão independente; execução por servidor local HTTP e abertura `file://`, com rede indisponível no teste offline; nenhum requisito depende de IA paga/conta externa. Verificar carregamento de recursos, persistência e ausência de tráfego de participantes. Problemas concretos retornam à etapa responsável.
- **Decisões:** confirmar matriz mínima de ambientes. “Online” aqui significa execução HTTP para validação; não autoriza deploy público.

### P8 — Documentação acadêmica e entrega local

- **Estado:** documentos técnicos existem; instruções finais para turma dependem dos fluxos concluídos.
- **Entrega:** guia do aluno, guia do professor, objetivos pedagógicos, regras de avaliação, fontes/limitações didáticas, privacidade, instruções offline e pacote local reproduzível com identificação da versão.
- **Dependências:** P7 aprovado.
- **Arquivos prováveis:** `README.md`, documentos de guias a delimitar, handoff, relatório final e manifesto do pacote.
- **Aceite/testes:** instruções reproduzíveis em máquina/ambiente de referência, referências verificadas, distribuição sem segredos ou dados pessoais, limitações explícitas e revisão final sem bloqueadores.
- **Decisões:** requisitos acadêmicos adicionais do docente. Hospedagem é decisão posterior separada, com autorização específica; não impede planejar e validar a entrega local.

## 5. Sequência proposta e decisões pendentes

O P0 foi encerrado e o lote P1 delimitado abaixo foi fechado no commit `65767d417b985c99bf412506b8f58b535f2712e4`. Esse commit não encerra a etapa ampla P1, nem autoriza alterações de P2. A investigação somente de leitura para preparar a matriz P2 foi concluída; o relatório reconciliado está em `docs/REVISAO_EXPLORACAO_JOHGO_P2_2026-09-26.md`. A próxima ação é a decisão do usuário sobre quais casos Johgo serão referência, mantidos, adaptados ou descartados. Só depois pode existir uma proposta de matriz; só depois da aprovação dessa proposta podem ocorrer substituições de dados. Resolver P3 e depois calibrar P4. Consolidar P5/P6 sobre os fluxos estabilizados, executar P7 e fechar P8. Não executar dois agentes alterando o mesmo checkout em paralelo. Não inventar datas de conclusão.

Decisões que devem ser solicitadas quando a etapa correspondente começar: matriz de empreendimentos; programas e elegibilidade de fomento; tratamento didático de finais societários removidos; valores/porte/dificuldade; ambientes e meta formal de acessibilidade; tratamento de saves antigos se necessário. Nenhuma dessas decisões era necessária para encerrar P0 nem impede a avaliação do lote de tradução atual. Não rediscutir a fórmula da nota e as taxas já aprovadas.

## 6. Lote P1 delimitado no P0 — 61 campos de FUNDER_ADVICE

Extração somente de leitura do AST original, na ordem de propriedades da fonte:

| Perfil | Campos conferidos e implementados |
|---|---:|
| `marcusWebb` | 21 |
| `michaelOkonkwo` | 21 |
| `annaLindqvist` | 19 |
| **Total** | **61** |

Por perfil, o lote abrange `advice/<domínio>/<índice>/text`, `reason`, `followedReaction`, `ignoredReaction` e `hostileWarning`. Nomes, IDs, preferências de domínio, escolhas e penalidades não foram alterados. Emojis e siglas foram preservados. O registro histórico deste lote indicava 628 campos em 31 perfis; a reenumeração completa de 02/10/2026 substituiu essa contagem pelo estado verificável atual de 861 campos em 41 perfis, sem pendências em `FUNDER_ADVICE`. Isso não conclui P1 nem significa publicação.

Arquivos do lote: `locales/advice-next-three-targets.pt-BR.json`, `tools/catalogue-advice-next-three.cjs`, `tests/advice-next-three-translation.test.cjs`, atualização de `locales/structures.pt-BR.json`, `index.html` regenerado, `docs/REVISAO_CONSELHOS_TRES_PERFIS_2026-09-25.md` e os dois documentos de continuidade (`docs/HANDOFF_LLM_COMPLETO.md` e este plano). O gerador preserva os 235 campos anteriores, rejeita divergência da fonte e ordena caminhos conforme o original. Os critérios incluem cobertura, restauração/paridade, método real `pickFunderChoice` em cenários determinísticos, `.\check_project.ps1` e revisão independente em até três ciclos, mínimo 9/10 e nenhum bloqueador.

Esse era o escopo proposto no P0. Em continuação autorizada, os 61 campos foram traduzidos, o gerador e o teste foram criados e o HTML foi regenerado; revisão independente aprovada em 9,2/10. A implementação posterior ao P0 não altera seu histórico documental. O lote P1 foi fechado depois no commit `65767d417b985c99bf412506b8f58b535f2712e4`.

## 7. Correção prioritária após validação visual L3h

Registro de 01/10/2026, a partir de validação manual do usuário no L3h. A camada operacional conclui trimestre e mostra as três frentes corretas, mas estes pontos são **bloqueadores P0** antes da expansão para L3i:

| Item observado | Correção necessária | Estado |
|---|---|---|
| Nome/identidade SaaS residual em qualquer dos doze empreendimentos; `Vanguard Robotics` e `Arene AI` são somente exemplos observados | A definição `COMPANIES` do HTML gerado agora usa nome e descrição brasileiros para os doze IDs, preservando os IDs e regras técnicas. Restam outras narrativas SaaS fora da definição-base, tratadas nos itens seguintes. | Concluído no corretivo P0.1 |
| Relatório final em inglês, avatar/aba do Claude e referência a Schumpeter | Encerramento acadêmico local em português substitui o fluxo legado antes de sua execução, remove links do Claude/Schumpeter no resultado e preserva a exportação local aprovada. | Concluído no corretivo P0.1 |
| Concorrentes, séries de investimento, pesquisa de mercado e inteligência competitiva SaaS | Para os doze empreendimentos, a lista, notícias, modais, ajuda, simulação, atualização de mercado e mudanças pendentes foram bloqueadas até existir modelo local próprio; não expõe captação, IPO ou metas SaaS. | Concluído no corretivo P0.2 |
| Alertas de caixa, crise, eventos de vida e recomendações de financiamento SaaS | O pré-trimestre está em português operacional e sem captação/falência em inglês; choques aleatórios foram bloqueados sem interromper o trimestre (P0.3). A crise usa crédito local ou redução de equipe/assessorias reais; salvamentos antigos seguem fallback legado seguro (P0.5). | Concluído nos corretivos P0.3 e P0.5 — revisões 9,5/10 |
| `Post Job`, `Layoff Staff` e gestão posterior ao início | Os atalhos agora abrem gestão local de pessoas e assessorias: contratar/desligar auxiliares dentro do limite do empreendimento e ativar/encerrar contratos, com recálculo do custo trimestral, sem AP, equity ou funções SaaS. Save valida custos derivados e estado aplicado. | Concluído no corretivo P0.4 — revisão independente 9,5/10 |

Esses itens tiveram precedência sobre L3i e foram corrigidos com teste de rota e revisão independente. Nenhuma dependência de OpenCode, Gemini, Claude ou conta externa é aceita para a partida ou a exportação local.

## 8. Verificação e encaminhamento do P0

Comandos de leitura usados com conclusão bem-sucedida (exit code do processo 0): `git rev-parse HEAD`, `git status --short`, leituras com `Get-Content`, buscas com `rg`, `Get-FileHash`, listagem `git ls-files --cached --others --exclude-standard` e extração AST somente de leitura executada com `node` via entrada padrão. Nenhuma instalação foi necessária.

Validação documental realizada: `git diff --check -- docs/HANDOFF_LLM_COMPLETO.md docs/PLANO_CONCLUSAO.md` sem erros. Como o plano é novo e não rastreado, seu conteúdo, whitespace e quebra de linha final foram verificados diretamente com Node (exit 0); a soma das 18 linhas de classificação confirmou 49 estruturas. A comparação SHA-256 dos arquivos rastreados e não ignorados antes/depois mostrou somente os dois documentos autorizados alterados/adicionados, sem remoções. A revisão pelo Gemini deve receber o diff do handoff **e o plano completo**, não apenas `git diff`, que não inclui o arquivo novo antes do staging.

A publicação do P0, posterior às inspeções acima, foi concluída pelo usuário no commit `4696c6301ae38345d1a1d23502ad06fb5f9f9d70`, com confirmação pela rede registrada no encerramento daquele lote. O lote P1 foi depois fechado no commit `65767d417b985c99bf412506b8f58b535f2712e4`, composto pelos oito arquivos da seção 6. Nenhuma nova publicação deve repetir staging ou commit desse lote; antes de qualquer novo lote, conferir o estado atual e preservar o trabalho preexistente. Não executar push forçado nem incluir trabalho preexistente fora do lote.
