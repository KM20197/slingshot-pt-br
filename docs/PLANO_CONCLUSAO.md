# Plano de conclusão — Slingshot Brasil

Data: 25/09/2026. Estado: planejamento P0 documental entregue para revisão; implementação das próximas etapas não iniciada por este lote.

## 1. Base, evidências e limites

Checkout: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. Shell desta etapa: PowerShell. HEAD local: `b0b8aa3ac773ba388f608819970ffccde897d435`. Não houve consulta ao remoto, staging, commit ou push nesta etapa.

Autoridades: `AGENTS.md`, `docs/DECISOES_APROVADAS.md` e requisitos do handoff. Fontes de evidência: `docs/INVENTARIO.md`, `source/index.original.html`, `locales/structures.pt-BR.json`, gerador do Mobility, testes presentes e `docs/REVISAO_LOTE_MOBILITY.md`. Inspeções desta etapa foram somente de leitura, exceto pelos dois documentos autorizados.

Na abertura, existiam alterações em `AGENTS.md` e `.opencode/agents/gauntlet-reviewer.md`, e arquivos não rastreados `docs/agent-routes/models.md` e `HANDOFF_LLM_COMPLETO.md` na raiz. Preservar esses arquivos fora do lote documental e fora de seu futuro staging. O plano não aprova essas mudanças anteriores.

O SHA-256 do original foi conferido: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`. A extração sintática somente de leitura confirmou a correspondência de 71 estruturas com o inventário. Não foi executado o gerador de inventário, pois ele escreve arquivos fora do escopo.

| Medida conferida | Resultado e interpretação |
|---|---|
| Estruturas registradas no catálogo | 22 de 71; inclui classificações técnicas sem tradução |
| Caminhos catalogados | 3.092; 3.040 têm destino diferente da fonte |
| FUNDER_ADVICE | 235 campos em 11 perfis; `self` nulo; 30 perfis pendentes |
| Estruturas sem entrada | 49; classificação inicial na seção 2 |
| Próxima sequência pendente | `marcusWebb`, `michaelOkonkwo`, `annaLindqvist` |
| Evidência histórica Mobility | 109/109 testes, 19 scripts, exit 0, revisão final 9,0/10 após três ciclos, segundo relatório do lote |

As contagens foram obtidas por leitura do catálogo e análise AST da fonte, sem executar o jogo. Não são percentuais de conclusão. Testes de aplicação não foram repetidos: P0 modifica somente Markdown. A presença de módulos e testes não comprova todos os percursos online/offline. A revisão do Mobility não foi reaberta.

## 2. Classificação das 49 estruturas sem catálogo

Classificação de planejamento baseada na forma e no conteúdo da fonte; não substitui a extração por caminho e a inspeção dos consumidores antes de cada lote. “Mista” exige traduzir apenas prosa e rótulos, preservando IDs, números, nomes próprios factuais, seletores e regras. Os limites por linha estão em `docs/INVENTARIO.md`.

| Estruturas | Quantidade | Classe e tratamento previsto |
|---|---:|---|
| `FUNDER_OPTIONS`, `VENTURE_ANGELS` | 2 | Referências internas de opções/perfis. Preservar IDs; futura substituição funcional de financiamento é separada da tradução. |
| `FOLLOW_ON_INVESTORS` | 1 | Mista: descrições e rótulos traduzíveis, IDs e parâmetros preservados; revisão das rotas societárias necessária. |
| `MILESTONES`, `PIVOT_TEAM`, `VENTURE_MARKETS` | 3 | Mistas: objetivos, cargos e descrições; preservar nomes factuais, metas, categorias e efeitos. |
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
| **Total** | **49** | Classificação documental; nenhum catálogo foi alterado. |

HTML, atributos acessíveis, modais e mensagens dentro de métodos exigem cobertura separada. Os 40.693 candidatos JavaScript e 2.486 candidatos HTML do inventário incluem material técnico e não representam uma lista pronta de traduções. Grandes literais, SVGs e templates precisam de classificação específica.

## 3. Requisitos aprovados e propostas

São requisitos aprovados: edição brasileira acadêmica, português integral, preservação do motor fora das adaptações autorizadas, dívida sem participação societária, fomento com elegibilidade, nota 0–5, exportação local e conferência pelo professor, privacidade, salvamento/retomada e jogo online/offline até Q16.

Permanecem aprovados os parâmetros didáticos de dívida: banco 24% a.a./12 trimestres; familiares 6%/8; ONG elegível 8%/12; agiotagem fictícia 120%/4. Taxa trimestral efetiva, amortização constante, juros sem capitalização de atrasos, primeira parcela no trimestre seguinte e ajuste final de centavos. Conversão: uma unidade do motor corresponde a 100.000 centavos. Não reapresentar esses parâmetros como decisões em aberto nem como ofertas reais.

São propostas deste plano: a divisão P1–P8, a sequência operacional, o lote de três perfis e os cenários adicionais de validação. Elas organizam a execução, sem aprovar novos empreendimentos, valores ou programas reais. Não há prazo estimado nem implantação automática.

## 4. Etapas, dependências e critérios

### P1 — Tradução e classificação integral

- **Estado:** 22 entradas catalogadas e FUNDER_ADVICE parcial; interface e outras estruturas incompletas.
- **Entrega:** completar conselhos em lotes na ordem da fonte; classificar as demais estruturas e traduzir os campos pertinentes; cobrir HTML, atributos e mensagens fora das estruturas.
- **Dependências:** P0 e escopo de cada lote. Textos destinados a mudança funcional devem ser coordenados com P2/P3 para evitar tradução descartável, sem alterar a ordem dentro do lote escolhido.
- **Arquivos prováveis:** `locales/structures.pt-BR.json`, arquivos de destinos em `locales/`, `locales/pt-BR.json`, `tools/catalogue-*.cjs`, `tools/build.cjs`, testes de tradução e relatórios. `index.html` somente por geração.
- **Aceite/testes:** cobertura exata por caminho, fonte correspondente, destinos não vazios, exclusões justificadas, paridade AST e testes diferenciais quando métodos forem afetados; `.\check_project.ps1`, revisão independente e inspeção de prosa/termos.
- **Decisões:** resolver ambiguidades reais de terminologia; preservar referências britânicas factuais até adaptação aprovada.

### P2 — Matriz brasileira de empreendimentos

- **Estado:** prosa de empreendimentos originais traduzida; matriz brasileira final ainda não aprovada.
- **Entrega:** matriz relacionando cada empreendimento original ao caso mantido/adaptado, público, modelo de receita, BMC, mercado, marcos, equipe, concorrentes e justificativa acadêmica. Academia, supermercado e clínica são candidatos já citados, não valores/modelos automaticamente aprovados.
- **Dependências:** referências Johgo disponibilizadas e decisão do usuário antes de substituir dados.
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

Após revisão deste P0, iniciar somente o lote P1 delimitado abaixo se solicitado. Preparar a matriz P2 antes de traduzir/adaptar em volume conteúdo que será substituído. Resolver P3 e depois calibrar P4. Consolidar P5/P6 sobre os fluxos estabilizados, executar P7 e fechar P8. Não executar dois agentes alterando o mesmo checkout em paralelo. Não inventar datas de conclusão.

Decisões que devem ser solicitadas quando a etapa correspondente começar: matriz de empreendimentos; programas e elegibilidade de fomento; tratamento didático de finais societários removidos; valores/porte/dificuldade; ambientes e meta formal de acessibilidade; tratamento de saves antigos se necessário. Nenhuma dessas decisões bloqueia a entrega documental atual ou exige rediscutir a fórmula da nota e as taxas já aprovadas.

## 6. Próximo lote proposto — 61 campos de FUNDER_ADVICE

Extração somente de leitura do AST original, na ordem de propriedades da fonte:

| Perfil | Campos previstos |
|---|---:|
| `marcusWebb` | 21 |
| `michaelOkonkwo` | 21 |
| `annaLindqvist` | 19 |
| **Total** | **61** |

Por perfil, abranger `advice/<domínio>/<índice>/text`, `reason`, `followedReaction`, `ignoredReaction` e `hostileWarning`. Não traduzir nomes, IDs, preferências de domínio, escolhas ou penalidades. Preservar emojis, siglas e marcadores. O perfil seguinte, fora do lote, é `eleniStavros`. Se aceito e sem outra mudança de cobertura, o acumulado será 296 campos em 14 perfis, restando 27; são projeções, não resultados entregues.

Arquivos propostos, a confirmar sem sobrescrever trabalho existente: `locales/advice-next-three-targets.pt-BR.json`, `tools/catalogue-advice-next-three.cjs`, `tests/advice-next-three-translation.test.cjs`, atualização de `locales/structures.pt-BR.json`, `index.html` regenerado e relatório específico em `docs/`. O gerador deve preservar os 235 campos anteriores, rejeitar divergência da fonte e ordenar caminhos conforme o original. Testar cobertura, restauração/paridade e método real `pickFunderChoice` em cenários determinísticos. Executar `.\check_project.ps1` e revisão independente até três ciclos, mínimo 9/10 e nenhum bloqueador.

Este escopo é somente uma proposta. Não houve tradução, criação de gerador ou teste, build, novo Gauntlet ou publicação neste P0.

## 7. Verificação e encaminhamento do P0

Comandos de leitura usados com conclusão bem-sucedida (exit code do processo 0): `git rev-parse HEAD`, `git status --short`, leituras com `Get-Content`, buscas com `rg`, `Get-FileHash`, listagem `git ls-files --cached --others --exclude-standard` e extração AST somente de leitura executada com `node` via entrada padrão. Nenhuma instalação foi necessária.

Validação documental realizada: `git diff --check -- docs/HANDOFF_LLM_COMPLETO.md docs/PLANO_CONCLUSAO.md` sem erros. Como o plano é novo e não rastreado, seu conteúdo, whitespace e quebra de linha final foram verificados diretamente com Node (exit 0); a soma das 18 linhas de classificação confirmou 49 estruturas. A comparação SHA-256 dos arquivos rastreados e não ignorados antes/depois mostrou somente os dois documentos autorizados alterados/adicionados, sem remoções. A revisão pelo Gemini deve receber o diff do handoff **e o plano completo**, não apenas `git diff`, que não inclui o arquivo novo antes do staging.

Antes de publicar, o usuário deve isolar somente os dois documentos, revisar o diff preparado e executar `git diff --cached --check`; consultar o remoto e proceder apenas por avanço normal, sem push forçado. Não declarar aprovação independente ou publicação deste P0 até que ocorram.
