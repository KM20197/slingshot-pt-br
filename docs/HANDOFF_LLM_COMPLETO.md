# Handoff de continuidade — Slingshot Brasil

> **Registro histórico, reconciliado em 07/10/2026.** Para estado e próximo lote, leia `docs/ESTADO_ATUAL.md`; para instruções, `docs/MANUAL_ORQUESTRACAO.md`; para caminhos, `docs/MAPA_ARQUIVOS.md`. As expressões “vigente”, “atual” e “próximo” no corpo abaixo valem na data de cada registro. Não reativar gates ou contagens antigas. Gemini e Codex coorquestram na transição; OpenCode é explorador, worker e revisor. Este histórico preserva evidências, inclusive retificações.

## Planejamento adicional — L3i/L3j, 06/10/2026

O inventário dos seis empreendimentos fora de `operations-v1` foi concluído sem alterar
código ou dados: `aether`, `edu` e `voed` formam o próximo grupo de serviços;
`cyber`, `terra` e `sorgente`, o grupo de indústria. O planejamento em
`docs/PLANEJAMENTO_L3I_L3J_OPERACOES_RESTANTES_2026-10-06.md` fixa limites e critérios,
mas não aprova fórmulas, números ou formato de save. A implementação depende de uma
especificação econômica delimitada.

## Checkpoint adicional — P3b `teamFit`, 06/10/2026

P3b localiza somente os rótulos visíveis de adequação da equipe no renderer dos cards
de pivot: `dev` → Produto, `sci` → Pesquisa, `mkt` → Vendas e marketing e `hr` →
Pessoas. Os objetos booleanos `teamFit`, IDs, regras, cores, saves e dados de mercado
permanecem inalterados. P2 continua sendo o baseline anterior para `pivotType` e
`funderView`; o delta P3b está delimitado em
`docs/PROPOSTA_P3B_TEAM_FIT_APRESENTACAO_2026-10-06.md`.

O build foi regenerado por `npm run build`. A suíte integral passou com 252/252 testes;
o teste de apresentação restaura `VENTURE_MARKETS` integralmente para a fonte técnica.
Revisão independente somente leitura reavaliou a separação de escopo e aprovou com
nota 9/10. Sem staging, commit, push ou alteração da fonte original.

## Checkpoint adicional — P3c, cromia de oportunidades, 06/10/2026

`Game.renderOpportunitiesTab` agora apresenta em português os títulos, estados de
prontidão, mensagens de disponibilidade e ações estáticas dos cards de oportunidade.
O lote não altera `VENTURE_MARKETS`, IDs, valores, condições, cores, cálculos ou saves.
Os testes verificam tanto os novos rótulos como a ausência dos três literais ingleses
remanescentes. A revisão independente aprovou a correção com nota 9,5/10. A
verificação integral passou com 252/252 testes e build reproduzível.

## Checkpoint vigente — P1, validação e mercados atuais, 05/10/2026

Este checkpoint é posterior aos registros históricos abaixo. `FUNDER_ADVICE` está coberto por 861 caminhos em 41 perfis, com `self` nulo; o teste permanente reconfirma fontes, destinos, ordem por perfil, paridade técnica, cinco arquivos finais e 1.476 comparações do método real. Os cinco perfis finais e `FOLLOW_ON_INVESTORS` passam também na suíte completa atual.

Foram traduzidos 75 campos de apresentação de `PIVOT_TEAM`, sem modificar nomes, SVGs, números, chaves, cores, emojis ou apoio booleano. `VENTURE_MARKETS` tem 194 campos de apresentação: 24 de nome/descrição atual, 36 nomes alternativos, 36 descrições, 36 resumos, 26 lacunas de equipe e 36 comentários de financiadores. `STRATEGIC_PIVOTS` soma 45 campos, `FORCED_RESPONSES` 47 e `PIVOT_MILESTONES` 26 (13 notas e 13 descrições). Os recortes preservam dados técnicos; o aceite não se estende às estruturas inteiras nem a adaptação funcional. `check_project.ps1` passou com 233/233 testes e build reproduzível de 27 scripts; SHA original preservado. A revisão independente das correções de pivôs e respostas forçadas chegou a 10/10, mas os campos novos de mercados precisam de revisão independente antes de aceite.

Contagem atual: 40 entradas, 4.013 caminhos, 3.951 destinos distintos. Existem 31 estruturas sem entrada; `VENTURE_MARKETS` está em `partial-translation` com 194 caminhos, `PIVOT_MILESTONES` está em `partial-translation` com 26 e não há entradas `pending-translation` neste recorte. A interface de mercados está oculta nos doze casos, mas os bônus/investimentos/prontidão são neutralizados somente nos seis operacionais; não declarar isolamento integral dos pivôs. `MILESTONES`, `EXECUTIVES` e `HR_EXECS` têm fontes efetivas em camadas aprovadas anteriores, e não justificam criar destinos descartados pelo build. Os 192 candidatos continuam originais; sua exportação em TXT não comprova adaptação.

Próximo passo: revisão independente somente leitura do recorte ampliado de `VENTURE_MARKETS`; o prompt está em `docs/PROMPT_OPENCODE_REVISAO_P1_ATUAL_2026-10-05.md`. Depois, continuar a tradução/classificação por caminho nos campos restantes de `VENTURE_MARKETS` e nas estruturas ainda não registradas, preservando consumidores e regras. P1, inspeção visual e partida completa permanecem abertos. P2 exige proposta e aprovação explícita; não inventar dados brasileiros.

Checkout correto: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`, não o cwd do chat em `Documents\ChatGPT\Estilingue`. HEAD local observado nesta etapa: `36714758dd64c7b4bd9107633c946f969b5d3706`; referências históricas abaixo não descrevem o Git atual. Sem staging, commit, push, fetch, mudança de Supabase ou publicação. Preservar a árvore intencionalmente suja. Nenhuma ação do usuário em OpenCode ou Gemini é necessária agora.

## Checkpoint adicional — L3e, diagnóstico de caixa, save e pessoas, 30/09/2026

Exploração somente leitura autorizada pelo usuário para `avam` (assistência técnica de celulares), `dream` (minimercado) e `quant` (gráfica/embalagens). Nenhum arquivo de código foi editado, e não foram executados build, testes, staging, commit ou push nesta exploração.

Dois bloqueios foram confirmados no núcleo `operations-v1` antes de ampliar a adaptação. Primeiro, `SlingshotOperations.advance` calcula recebimentos e o livro operacional, mas `commitTurn` só aplica receita ao caixa quando o vetor legado `customers` não está vazio. Como o trio não cria clientes SaaS, a receita operacional não reduz a saída de caixa. Segundo, o validador exige `ledger.net >= 0`, embora o próprio modelo possa gerar trimestre operacional negativo; a gravação local pode ocorrer, mas a restauração desse save falha.

Foi confirmada também uma duplicidade de custo no cálculo operacional: a reposição de estoque/insumo (`purchase`) e o custo de cada unidade concluída são ambos lançados como saída no mesmo trimestre. O próximo modelo deve separar recebimento, compra de estoque/insumo, custo consumido e resultado por competência, usando uma única fonte para o fluxo de caixa.

A hipótese de dupla contagem atual de pessoas não se confirmou: `metrics.staff` começa no porte canônico do negócio, a equipe inicial de gestão fica em `team` sem novo incremento e uma contratação posterior incrementa `metrics.staff` uma vez. Ainda assim, o mecanismo legado não é apropriado ao trio: contratação e gerente de pessoas alteram AP. O futuro domínio deve separar proprietário, empregados e contratos externos.

Decisão complementar do usuário: a chave da turma permanece somente para exportar resultado acadêmico local; não é requisito para jogar, salvar ou retomar. A identificação continua restrita à exportação manual; a obrigatoriedade atual da identificação na tela de exportação é pendência posterior, não mudança realizada neste checkpoint.

O próximo lote proposto é L3f, ainda sem autorização de implementação: primeiro reparar caixa/save/custos versionadamente, depois criar Pessoas e Contratos v1 só para o trio. A especificação fechada está em `docs/ESPECIFICACAO_L3F_PESSOAS_CONTRATOS.md`. Preservar saves legados por versão explícita; não migrar nem inferir pelo ID do empreendimento.

## Checkpoint adicional — L3f, operação, pessoas e contratos v1, 30/09/2026

O usuário autorizou L3f somente para `avam`, `dream` e `quant`. O núcleo `operations-runtime.js` agora grava `operations-v1` na versão 2: resultado operacional (`net`) pode ser negativo; recebimentos, compra de estoque/insumos, custo consumido, encargo local e contribuição de caixa são campos distintos. `calculateQuarterlyRevenue` entrega a contribuição de caixa ao turno mesmo sem `customers` do mecanismo SaaS; assim, os recebimentos operacionais do trio passam a afetar `metrics.cash` pela rota ordinária de `commitTurn`.

Saves de `brOperations` versão 1 permanecem válidos e não são reescritos automaticamente. O validador aceita a estrutura histórica e exige os novos campos apenas na versão 2. O novo estado `brBusiness` guarda empregados e contratos iniciais, é validado antes de restaurar e somente é usado pelo trio. Proprietário não entra na folha; supervisor e equipe operacional são empregados; assessoria administrativa/contábil e marketing/promoção são contratos externos. Contratos não incrementam empregados ou AP. A escolha inicial substitui apenas o assistente de três gestores para o trio; os demais nove casos preservam a rota existente.

Arquivos novos do lote: `people-contracts-runtime.js`, `business-adapter.js`, `locales/people-contracts.pt-BR.json`, `tools/people-contracts-patch.cjs`, `tests/business-cashflow.test.cjs` e `tests/people-contracts.test.cjs`. O HTML foi regenerado exclusivamente por `npm run build`; `source/index.original.html` conserva SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`. Não houve staging, commit ou push.

Verificação: testes específicos L3f, build reprodutível e as rotas legadas de gestão passaram. `check_project.ps1` concluiu build com 25 blocos de script e suíte com 158/160. As duas falhas recorrentes permanecem em `tests/location-translation.test.cjs`: a expectativa ainda usa `Channels, pricing, partnerships`, enquanto a árvore anterior já contém `Canais, pricing, partnerships` em `getUKGrantQuestions`. Não são decorrentes de L3f e não foram corrigidas neste lote. `git diff --check` não reportou erro; há somente avisos de fim de linha em arquivos já modificados.

Pendente antes de declarar aceite: revisão independente somente leitura e inspeção visual manual da rota de equipe do trio, de um trimestre com resultado operacional negativo, de save/restauração e da ausência de chave durante a jogabilidade. O prompt está em `docs/PROMPT_OPENCODE_REVISAO_L3F.md`.

## Direção vigente — arquitetura econômica antes de eventos e Ada, 29/09/2026

O usuário definiu que o próximo foco é a **economia, BMC e pivôs**, pois essa base determina o significado das decisões. Não adaptar primeiro eventos nem integrar a Ada: ambos dependem de um formato econômico coerente e estável. A estratégia aprovada é desenhar a arquitetura comum dos 12 empreendimentos e implementá-la gradualmente por grupos, sem exigir especificação numérica completa de todos antes de iniciar.

Ordem obrigatória da próxima frente:

1. mapear os 12 empreendimentos, separando mecanismos comuns e particularidades;
2. implementar e validar três representantes: **assistência técnica de celulares** (serviço: atendimentos, peças e capacidade da equipe), **minimercado** (comércio: vendas, estoque, compras, perdas e capital de giro) e **gráfica/embalagens** (indústria: pedidos, insumos, capacidade produtiva e entregas);
3. expandir aos demais empreendimentos, ajustando a arquitetura conforme testes;
4. adaptar BMC, pivôs e eventos junto de cada grupo, para que narrativa, escolha e efeito calculado correspondam;
5. só então integrar Ada/importador ao formato estabilizado, com validação explícita de compatibilidade.

Não converter a clínica em fluxo clínico, nem usar dados reais de pacientes: permanece uma gestão ambulatorial fictícia. IDs técnicos, chaves de save e dados canônicos continuam separados da prosa em português. Qualquer alteração de fórmula, parâmetro numérico, formato de save ou catálogo econômico exige especificação e aceite do lote antes de implementação.

### Papéis de trabalho e escolha de modelo

- **Codex** conduz o planejamento e a integração de maior complexidade: arquitetura econômica, compatibilidade de saves, BMC/pivôs, fronteiras entre motor e catálogos, Ada/importador e resolução de falhas transversais. Também assume o papel de executor integrado antes atribuído ao Antigravity quando este não estiver disponível.
- Para planejamento, usar **Astra Médio** nas decisões que cruzam motor, 12 negócios, eventos, BMC, pivôs, exportação/save e Ada; usar **Terra Médio** nos recortes já delimitados, como classificação de inventário, critérios de aceite, documentação, matriz e preparação de lotes.
- **OpenCode** executa somente lotes delimitados após especificação: inventário em leitura, mudanças mecânicas em módulo/catálogo indicado, build/testes e revisão independente baseada em matriz, diff e logs fornecidos. Não decide parâmetros econômicos nem aprova seu próprio lote.
- **Gemini** recebe apenas prompts e documentos para revisar coerência semântica, narrativa econômica e riscos. Sem acesso ao checkout, não declara execução, teste ou aprovação local sem evidência recebida.

O pacote de publicação da Ada será preparado pelo Codex apenas depois da estabilização do formato: artefato, instruções de publicação no Claude, aviso de uso exclusivo de dados fictícios e de envio a serviço externo, além do contrato versionado do importador. Não publicar, chamar serviços externos ou inserir credenciais antes dessa etapa.

## Checkpoint adicional — L3b `operations-v1`, 29/09/2026

O lote inicial econômico está implementado somente para **assistência técnica de celulares** (`avam`), **minimercado** (`dream`) e **gráfica/embalagens** (`quant`). O núcleo local `operations-runtime.js` mantém estado versionado `brOperations`: capacidade, demanda agregada, inventário/insumos, recebíveis, perdas, unidades concluídas e livro do trimestre. Não há backend, `fetch`, credencial ou API; a execução continua possível offline.

`locales/operating-models.pt-BR.json` separa os parâmetros didáticos provisórios, os BMCs, metas e pivôs desses três casos. `tools/operations-patch.cjs` integra o núcleo ao build e somente troca a rota de receita, marcos, pivôs e save/load quando o ID está no catálogo. Os outros nove empreendimentos conservam o motor anterior. As três cidades já adaptadas influenciam termos operacionais existentes (suprimento, cobrança/conversão e atraso de entrega), sem alterar crédito, nota, exportação, Ada ou concorrentes/eventos gerais.

Os efeitos genéricos de receita continuam sem adaptação neste checkpoint. Para os três modelos eles são deliberadamente ignorados pelo núcleo, para impedir que eventos ainda SaaS criem clientes/receita incompatíveis. Adaptar eventos e concorrentes é lote posterior, não uma lacuna escondida. Os números são de simulação didática e requerem calibração antes de qualquer uso como referência real.

Foi feita leitura pontual da referência Johgo: seus conceitos de capacidade, estoque, perdas e recebíveis inspiram a modelagem, mas nenhum código, dado, serviço ou dependência foi reutilizado. A implementação Johgo observada dependia de Supabase/rotas remotas, incompatíveis com a exigência de jogo offline sem backend.

Verificação local concluída: `check_project.ps1` em 29/09/2026 passou com **147/147 testes**, build reprodutível, 22 blocos de script, hash da fonte original e `git diff --check` dos arquivos rastreados sem erros. A árvore já continha alterações e arquivos não rastreados de lotes anteriores; nada foi preparado, commitado ou enviado. A revisão independente foi solicitada, mas não iniciou por limite de uso do revisor; deve ser repetida e registrada antes de declarar aceite final. Inspeção visual manual de partida continua pendente.

## Checkpoint adicional — L3d, mercados ocultos e isolados, 30/09/2026

`VENTURE_MARKETS` não foi removido: ainda participa de rotas legadas e é preservado em `marketIntel` no save/load. Como seu catálogo tecnológico não é coerente com os doze empreendimentos brasileiros, o cartão lateral, a ajuda e a abertura dos modais foram ocultados na interface.

Para os três modelos já convertidos a `operations-v1` — assistência técnica de celulares (`avam`), minimercado (`dream`) e gráfica/embalagens (`quant`) — `market-isolation.js` neutraliza bônus legados de mercado em metas, decisões, crédito, investimentos pendentes e prontidão de pivôs. Não apaga nem reescreve dados de save. Os outros nove modelos não receberam nova economia neste lote.

Build reprodutível e todos os testes específicos L3d passaram; hash original preservado e `git diff --check` sem erro. A verificação total registrou 153/155: duas falhas já existentes de `location-translation.test.cjs`, causadas por divergência textual prévia entre `Channels` e `Canais` em `getUKGrantQuestions`, fora do L3d. Detalhes em `docs/REVISAO_L3D_2026-09-30.md`. Sem staging, commit ou push. Inspeção visual manual e revisão independente seguem pendentes.

## Checkpoint adicional — L3c, painel de partida em português, 29/09/2026

O usuário relatou que o primeiro `Situation Brief` ainda mostrava capítulos, prazos, foco sugerido e botão em inglês, além de libra no painel. O L3c aplica somente apresentação: `tools/dashboard-localization-patch.cjs` traduz o resumo de situação, os capítulos, os prazos e as sugestões dinâmicas. A região visível devolve `R$`/`BRL` com multiplicador 1; não houve conversão de escala, modificação de fórmulas, crédito, save, exportação ou nota. Referências históricas britânicas em narrativas não foram reescritas por esse lote.

Também foi confirmado que a negociação individual de salário/equity foi removida intencionalmente no L2b: a contratação usa escolha de perfil, salário didático fixo ajustado pela cidade e participação zero. A remuneração é registrada uma vez na despesa fixa; `tests/management-setup.test.cjs` protege esse comportamento. Restituir negociação seria um novo lote de regras, não uma correção de tradução.

Verificação posterior: `check_project.ps1` passou com **150/150 testes**, build reprodutível, 22 blocos de script, hash original e `git diff --check` rastreado aprovados. Sem staging, commit ou push. A inspeção visual manual do arquivo local continua necessária porque o navegador integrado bloqueia `file://` e não deve ser contornado.

Próxima coordenação: o usuário faz a validação em `docs/CHECKLIST_VALIDACAO_VISUAL_L3.md`; OpenCode recebe depois o prompt de revisão estática em `docs/PROMPT_OPENCODE_REVISAO_L3BC.md`; Gemini recebe apenas documentos pelo prompt `docs/PROMPT_GEMINI_REVISAO_L3BC.md`. Codex conserva arquitetura, calibração, integração e qualquer mudança posterior. Não iniciar expansão aos outros nove empreendimentos antes de registrar os resultados da validação dos três representantes e da revisão independente.

## Checkpoint adicional — L2b, 29/09/2026

Cidades brasileiras, cargos de gestão, primeiras metas e tutoriais foram implementados localmente em `management-runtime.js`, `tools/setup-patch.cjs`, `tools/setup-ui-patch.cjs` e respectivos catálogos. Fontes dos anexos preservadas em `docs/referencias/`. Consulte `docs/REVISAO_L2B_2026-09-29.md` para regras, parâmetros didáticos e limites. Não editar `index.html` como fonte.

Primeira verificação completa: 140/141 testes; falha em comparação textual de logs de fundador agora traduzidos, sem divergência de efeitos no teste diferencial. A expectativa foi corrigida para excluir somente mensagens de log e espaços finais; segunda verificação concluída com 141/141 testes, PASS, em `artifacts/l2b-check-2.txt`. Build: 21 scripts. Novo teste executa início real e detecta salários/ocupação duplicados; retomada cobre os 12 perfis legados e as três novas cidades. A ocupação entra após os bônus do fundador.

Uma tentativa independente com `9router/slingshot-reviewer` falhou por conexão em 29/09, sessão `ses_f135e4443ffenDpr3MOZXZlslO`, sem nota. Permissões efetivas conferidas: shell, escrita, delegação e web negados; leitura de saídas gerenciadas tem a exceção já documentada. O roteador instalado foi iniciado apenas em 127.0.0.1:20128, sem atualização/mudança de modelo; a segunda tentativa leu os arquivos mas expirou por SSE. A terceira retomou a mesma sessão e aprovou **código L2b, 9/10**, exit 0. Parecer e ressalvas em `docs/REVISAO_L2B_2026-09-29.md`; 141/141 confirmados pelo coordenador, embora o revisor não tenha observado o rodapé completo. Não declarar liberação para turma. Sem commit/push/publicação. A árvore inclui alterações anteriores que devem ser preservadas.

Ainda pendentes: decisões/eventos durante a partida, modelos econômicos por setor/BMC, concorrentes, funcionários adicionais, rotas legadas de fomento/participação, Ada final e inspeção visual/partida completa. O usuário reafirmou “prossiga”; não pedir novamente escolha de perfis, localização dos anexos ou autorização da Ada fictícia no Claude. Inventário inicial de decisões em `artifacts/l2c-event-inventory.json`: 234 eventos de gestores, 263 gerais, 17 de receita, 63 de financiadores, 8 competitivos; eventos de vida têm esquema diferente e ainda precisam de contagem. O inventário não adapta conteúdo. Os tópicos históricos abaixo não substituem este checkpoint.

## Checkpoint adicional — L2a, 28/09/2026

O pedido mais recente confirmou os três perfis iniciais `firsttimer`, `visionary` e `strategist`, retratos por objetos e adaptação de cidades, cargos, metas e decisões. O texto integral de `Empreendimentos.txt` foi recuperado do chat Rodada5 e aplicado aos 12 diálogos e descrições dos cartões; cópia em `docs/referencias/Empreendimentos-Rodada5.txt`. Perfis legados e atributos permanecem para compatibilidade. Ajuda guiada de perfil/empreendimento adaptada. Detalhes e limites em `docs/REVISAO_L2A_2026-09-28.md`.

Verificação completa: 132/132 testes, 20 scripts, hash original preservado, exit 0. Estado `BLOCKED_FOR_REVIEW`: uma tentativa do revisor configurado falhou por conexão à API, sem nota. Inspeção visual permanece pendente. Sem staging, commit, push ou publicação. O restante do pedido não está concluído: cidades e efeitos, cargos e remuneração sem ações, metas, tutoriais completos, eventos, modelos operacionais e integração da Ada. Rascunhos numéricos fora do checkout não são parâmetros implementados/aprovados. O usuário autorizou Ada no Claude com uso explícito de informações fictícias e aviso de envio externo; preservar essa decisão sem solicitar confirmação novamente.

## Checkpoint adicional — L1b, 28/09/2026

O usuário autorizou implementar o lote de interface e especificação econômica, preservando o motor e a Ada. Foram removidos dois parágrafos introdutórios e exemplos famosos dos perfis, traduzidos os controles da rota padrão e reordenada apenas a apresentação dos 12 perfis. Especificação dos negócios em `docs/ESPECIFICACAO_ECONOMICA_L1B.md`; ela não foi aplicada ao conteúdo econômico do jogo. A clínica foi definida pelo usuário como gestão ambulatorial fictícia, sem decisões clínicas nem dados reais de pacientes. Demais decisões numéricas não mudaram.

Situação da verificação e revisão, arquivos do lote e limites: `docs/REVISAO_L1B_2026-09-28.md` (consultar antes de continuar). Build e 128/128 testes passaram com exit 0; comparação AST identificou somente três métodos de apresentação alterados. A revisão inicial do código recebeu 9/10, mas a reavaliação final está `BLOCKED_FOR_REVIEW` porque a API do revisor ficou indisponível. Inspeção visual/teclado permanece manual: navegador integrado bloqueou `file://` e proibiu contorno. Não declarar aceite completo. Sem staging, commit ou push; preservar alterações preexistentes de L1a e de documentação. Os dados históricos abaixo não substituem esse checkpoint.

Data de consolidação: 26/09/2026 (checkpoint pós-publicação do lote P1 de três perfis)
Repositório público: `https://github.com/KM20197/slingshot-pt-br`
Branch: `main`
Commit de referência observado: `65767d417b985c99bf412506b8f58b535f2712e4` (lote P1 de três perfis). Nesta conferência, `HEAD` e a referência local `origin/main` apontavam para esse mesmo commit; não houve nova consulta de rede nesta atualização documental.
Diretório de trabalho: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`

## 1. Finalidade e pedido do usuário

O usuário pediu uma edição brasileira do jogo acadêmico Slingshot, baseada no original anexo, com a mesma lógica e mecanismos internos sempre que não houver adaptação expressamente aprovada. A edição é destinada a estudantes de engenharia, administração, computação e áreas da saúde, deve funcionar tanto online como offline e precisa estar integralmente em português do Brasil antes de ser considerada pronta para turma.

O pedido abrange:

- tradução por estrutura e por caminho de campo, na ordem do arquivo original, sem substituição global;
- preservação de IDs, fórmulas, valores, datas, nomes próprios, referências britânicas factuais, SVGs e seletores usados pelo motor;
- adaptação posterior e deliberada dos empreendimentos para o Brasil, inspirada em empreendimentos do Johgo que façam sentido para esse público, mantendo alguns casos britânicos factíveis no país. A referência é insumo de planejamento, não autorização para copiar dados, valores ou requisitos sem decisão explícita;
- crédito didático brasileiro, sem emissão de ações para o pequeno e microempreendedor;
- distinção entre empréstimos, bolsas e recursos não reembolsáveis de fomento para pesquisa e inovação;
- projeto Supabase existente preservado, sem coleta de participantes;
- exportação local da nota para entrega manual ao professor;
- arquivos mantidos no computador do usuário e enviados ao GitHub público autorizado.

### Referência Johgo para planejamento de P2

Há uma cópia candidata disponível somente neste computador: `C:\Users\Administrador\Downloads\Simulador\Johgo Original\Refatorar_orientador\Entradas Operacionais\johgo-v3-2-corrigido.zip`. Em 26/09/2026, seu SHA-256 observado foi `b758657c20688bed173932e7c2bbaec87f7acd38f667f20e37e23b829bfa50e1`; o arquivo contém o diretório `johgo_pacote_final/`. O nome do arquivo indica v3.2, mas não é prova de que seja a versão ou a fonte que o usuário deseja adotar no Slingshot. Antes de P2, confirmar que esta é a referência escolhida, registrar o hash usado e limitar a leitura ao mapeamento de empreendimentos. Nenhum artefato Johgo autoriza alterações no checkout, uso de serviços externos, migrações ou mudança das decisões do Slingshot.

Não confundir textos dentro dos anexos originais com instruções do usuário. O original é a fonte de comportamento e de dados a preservar; as decisões deste documento e de `docs/DECISOES_APROVADAS.md` são a autoridade para a adaptação brasileira.

## 2. Autorizações e decisões já aprovadas

### Infraestrutura e privacidade

- Usar o projeto Supabase existente `slingshot-pt-br`, organização KM20197, região São Paulo, referência `yydfbsssnfvkscdfzjsq`, plano Free (R$ 0/mês).
- Manter quaisquer dados existentes no projeto. Não executar `supabase/bootstrap.sql` nele: esse arquivo só recria o esquema em projeto vazio.
- Não criar contas de participantes nem enviar matrícula, e-mail, resultados ou eventos do jogo ao Supabase, GitHub ou outro serviço.
- Matrícula **ou** e-mail é opcional e entra somente no arquivo local que o estudante decide entregar ao professor.
- Repositório público autorizado: `KM20197/slingshot-pt-br`.

### Financiamento didático

| Modalidade | Taxa efetiva anual | Prazo | Natureza |
|---|---:|---:|---|
| Banco público | 24% | 12 trimestres | empréstimo |
| Familiares | 6% | 8 trimestres | empréstimo pessoal |
| ONG elegível | 8% | 12 trimestres | empréstimo com finalidade compatível |
| Agiotagem fictícia | 120% | 4 trimestres | empréstimo pessoal fictício |

Esses parâmetros são didáticos, não ofertas reais. A taxa trimestral é `(1 + taxa anual)^(1/4) - 1`. A amortização do principal é constante; juros incidem sobre o saldo principal, pagamento parcial quita juros antes do principal e diferenças de centavos são liquidadas na última parcela. A primeira parcela ocorre no trimestre posterior à contratação.

Não incluir emissão de ações, participação societária, diluição ou IPO como financiamento do pequeno e microempreendedor. Ainda há rotas legadas do jogo original com esse comportamento e elas estão pendentes de substituição ou remoção controlada.

As rotas futuras devem distinguir claramente:

- empréstimos de bancos públicos para negócios gerais, com os parâmetros acima;
- crédito familiar, ONG elegível e crédito pessoal fictício;
- bolsas e recursos não reembolsáveis para pesquisa e inovação;
- chamadas de CAPES, CNPq e Fundação Estadual de Amparo à Pesquisa apenas quando a finalidade do empreendimento justificar a modalidade.

Não apresentar programas ou taxas como oferta vigente sem pesquisa factual e aprovação do usuário.

### Nota acadêmica e entrega

A nota é de 0 a 5, arredondada somente no total para duas casas:

`nota = desenvolvimento (0 a 3) + continuidade (0 a 1) + capacidade financeira (0 a 1)`.

- Cada um dos três marcos contribui seu progresso de 0 a 1, usando o cálculo já produzido pelo motor.
- Continuidade é `trimestres concluídos / 16`; vale 1 se houver sucesso antecipado com os três marcos concluídos.
- Capacidade financeira é `caixa / (despesa operacional do próximo trimestre + parcelas previstas)`, limitada a 0–1.
- Atraso zera apenas o componente financeiro. Sem obrigações e sem atraso, o componente financeiro vale 1.
- Exemplo aprovado: `2,50 + 0,75 + 0,60 = 3,85`.

O aluno conclui a partida, gera um arquivo `.txt` assinado com uma chave de turma e o entrega manualmente. `professor.html` confere a assinatura e recalcula a nota localmente. HMAC não criptografa dados, não prova autoria e não impede que alguém com a chave compartilhada produza um resultado; essa limitação deve continuar visível na documentação.

## 3. Forma de trabalho, computador e GitHub

O trabalho é feito diretamente no computador do usuário, dentro de `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. O arquivo distribuível `index.html` é gerado localmente a partir de `source/index.original.html` e de catálogos explícitos. Depois de testes e revisão, as alterações são versionadas localmente e enviadas ao repositório público autorizado.

Fluxo operacional atual (Gemini orienta/revisa, executor local altera arquivos, usuário publica):

1. editar somente arquivos da cópia brasileira, nunca `source/index.original.html`;
2. regenerar o catálogo específico quando aplicável;
3. para código/dados, executar `.\check_project.ps1` e verificar o diff; para alteração exclusivamente documental, conferir coerência e `git diff --check`, sem build ou testes de aplicação;
4. realizar revisão independente pelo Gauntlet para código/dados; documentos recebem revisão de coerência e evidências;
5. registrar evidências em `docs/REVISAO_*.md`;
6. após revisão, o usuário executa staging de caminhos explícitos, confere o diff preparado, cria commit e envia ao remoto por avanço normal, orientado pelo Gemini. O executor não faz staging, commit ou push neste fluxo.

O Gemini é o orientador do processo e recebe evidências selecionadas, sem acesso implícito ao computador. Não deve afirmar execução local nem aprovação sem material suficiente. O OpenCode executa o trabalho por três papéis: `slingshot-explorer` levanta escopo e caminhos em leitura; `slingshot-worker` implementa lotes autorizados e executa validações; `gauntlet-reviewer` faz a revisão independente em somente leitura. Enquanto o Antigravity estiver sem créditos, o `slingshot-worker` é o executor preferencial de mudanças autorizadas: sua permissão efetiva de edição foi confirmada em 26/09/2026, mas a rota/modelo deve passar por um smoke test curto no início do próximo lote. Se o worker não puder executar o lote, o Codex o implementará sob as mesmas restrições e manterá a revisão independente. O usuário controla staging, commit e push. As permissões e configurações do OpenCode não se transferem automaticamente ao Codex ou ao Gemini. O plano de conclusão e o próximo lote proposto estão em `docs/PLANO_CONCLUSAO.md`.

Não há necessidade de mexer no GitHub para testes locais. Não acessar, exportar ou alterar credenciais. Não fazer novas alterações remotas no Supabase sem uma autorização específica posterior. A aplicação gerada bloqueia conexões automáticas externas por política de conteúdo e não possui telemetria do original.

Comandos usuais:

```powershell
Set-Location C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br
git rev-parse HEAD
# Apenas para lotes de código/dados:
.\check_project.ps1
git diff --check
git status --short
```

## 4. Fonte imutável e arquitetura de build

Fonte original: `source/index.original.html`
SHA-256 obrigatório: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`

O original tem 83.574 linhas, oito scripts internos, 71 estruturas de dados de nível superior, cerca de 40.693 candidatos textuais em JavaScript e 2.486 candidatos textuais em HTML e atributos. `docs/INVENTARIO.md` é a lista de estruturas e linhas; execute `node tools/inventory.cjs` se a fonte for conferida novamente.

Arquivos centrais:

| Arquivo | Responsabilidade |
|---|---|
| `tools/build.cjs` | parte do original, aplica catálogos por AST, patches delimitados, tradução de HTML e valida os scripts gerados |
| `tools/structured-translation.cjs` | substitui apenas literais autorizados por caminho e verifica paridade AST |
| `locales/structures.pt-BR.json` | catálogo de estruturas, com `source`, `target` e caminho JSON explícito |
| `locales/pt-BR.json` | textos de interface e atributos HTML selecionados |
| `tools/catalogue-*.cjs` | geradores por lote, com hash da fonte e rejeição de cobertura incompleta |
| `tests/*.test.cjs` | testes de paridade, regras acadêmicas, crédito, exportação, build e esquema Supabase local |
| `academic.js` | cálculo da nota sem alterar resultados econômicos |
| `finance.js` e `finance-adapter.js` | dívida em centavos e conversão explícita para as unidades do motor |
| `initial-credit.js`, `continuing-credit.js`, `crisis-credit.js` | rotas brasileiras já substituídas |
| `academic-export.js`, `result-code.js`, `professor.html` | exportação e conferência local de resultado |
| `save-validation.js` | validação e restauração do estado brasileiro salvo |
| `supabase/` | documentação, bootstrap para projeto vazio, privacidade, seed de referência e verificações locais |

O build já injeta os módulos locais no HTML final e confere todos os scripts com Acorn e `node --check`. A alteração de um texto deve passar por catálogo e não por `replaceAll` genérico no HTML gerado.

## 5. Tradução: regras que não podem ser quebradas

Traduzir string por string e bloco por bloco. Um texto idêntico em duas posições pode ter destino diferente; por isso o caminho do campo é obrigatório.

Preservar:

- chaves de objetos, IDs, nomes de métodos, eventos, classes CSS, seletores DOM e nomes de arquivos;
- números, percentuais, datas, valores, bônus, penalidades, thresholds, fórmulas e ordem de arrays;
- SVGs, data URLs, imagens e identificadores de recursos;
- marcadores `[NEW]`, pois métodos reais removem itens por comparação textual;
- bancos de nomes e sobrenomes de personagens;
- marcas, universidades, siglas de reguladores e nomes próprios factuais.

Aplicar exônimo português consolidado na prosa: London → Londres, Edinburgh → Edimburgo, Prague → Praga, Bank of England → Banco da Inglaterra. Traduzir cargos genéricos de governo em prosa, como primeiro-ministro e chanceler do Tesouro. Manter universidades, marcas e siglas como MHRA, NCSC, ICO, FCA, NHS, FTSE 100 e UKRI. Traduzir palavras genéricas isoladas, como `train`, quando forem prosa.

Quando uma referência britânica interfere na lógica, preserve o dado interno e crie uma camada de apresentação, como em `location-display.js`. Não trocar uma cidade, financiador ou nome canônico dentro do objeto sem prova de que ele não é usado em comparações.

## 6. Estado implementado e evidências

### Base brasileira, privacidade e avaliação

- Nota acadêmica, exportação `.txt`, confirmação do professor, assinatura HMAC, limpeza de chave e proteção contra exportação obsoleta foram implementadas.
- O resultado é capturado antes dos resets de `endGame`; a exportação é local e o fluxo não coleta dados de participantes.
- Crédito inicial, captação posterior e socorro de crise funcionam por contratos de dívida sem participação societária nas rotas já substituídas.
- Contratos sobrevivem ao salvamento e são recalculados/validados na retomada.
- O Supabase existente foi preservado com RLS e permissões restritas. Os testes de esquema usam PGlite local e não se conectam ao projeto remoto.

### Estruturas já examinadas

O catálogo local conferido em 25/09/2026 após o lote P1 contém 22 estruturas registradas, 3.153 caminhos e 3.101 destinos diferentes da fonte. Essa comparação literal não equivale a uma nova auditoria da qualidade de todas as traduções. As 21 primeiras entradas têm cobertura ou classificação registrada nos lotes anteriores; `FUNDER_ADVICE` está parcial. Cobertura atual:

| Estrutura | Situação |
|---|---|
| `REGIONS` | 18 textos traduzidos; referências e identificadores preservados |
| `GEOGRAPHY_REGIONS`, `PORTRAITS`, `LOGOS` | classificados como dados técnicos ou gráficos; sem prosa a alterar |
| `HALL_OF_FAME_LEGENDS`, `COMPANIES`, `VENTURE_DETAILS` | prosa original traduzida; adaptação brasileira dos empreendimentos ainda pendente |
| `BMC_DATA` | 1.826 campos dos 12 perfis cobertos; `[NEW]` e seletores preservados |
| `REVENUE_MODELS` | cinco nomes e descrições traduzidos; calibração brasileira pendente |
| `FOUNDER_PROFILES`, `FOUNDER_GRANT_PROFILES`, `FOUNDER_PORTRAITS` | perfis e prosa traduzidos; retratos SVG mantidos |
| `LOCATIONS`, `LOCATION_MAP` | 276 textos de apresentação; nomes canônicos permanecem em inglês para regras |
| `FUNDING_STAGES`, `STAT_LABELS` | rótulos traduzidos; sem mudar a semântica interna |
| `FUNDERS` | 192 textos dos 32 perfis legados traduzidos |
| `M2_FUNDERS`, `M3_FUNDERS` | 104 textos traduzidos; opções técnicas preservadas |
| `M2_FUNDER_OPTIONS`, `M3_FUNDER_OPTIONS` | classificados como referências internas, sem texto a alterar |
| `FUNDER_ADVICE` | 296 campos em 14 perfis: `dragon`, `techAngel`, `operatorAngel`, `academicAngel`, `priyaSharma`, `thomasEriksson`, `klausMuller`, `davidAdeyemi`, `ananyaKrishnamurthy`, `patriciaHoffman`, `amitPatel`, `marcusWebb`, `michaelOkonkwo`, `annaLindqvist`; `self` nulo e 27 perfis pendentes |

Os lotes fechados possuem relatórios em `docs/REVISAO_*.md`. Rodadas posteriores, conselhos iniciais e conselhos de saúde tiveram avaliações independentes de 9,3/10. Esses resultados aprovam somente o lote correspondente, não a edição completa.

O lote Mobility acrescentou 105 campos e recebeu revisão independente 6,0 → 7,5 → 9,0 em três ciclos. A nota 10/10 anterior foi retirada; vale a aprovação 9,0 somente para esse lote. `docs/REVISAO_LOTE_MOBILITY.md` registra build de 19 scripts e 109/109 testes, com exit 0: evidência histórica, não reexecutada no P0 documental.

O P0 foi publicado em `4696c6301ae38345d1a1d23502ad06fb5f9f9d70`, com confirmação pela rede no encerramento anterior. O lote de 61 campos de `marcusWebb`, `michaelOkonkwo` e `annaLindqvist` foi validado com 113/113 testes, 19 scripts e exit 0. A revisão independente passou de 8,8/10 (faltavam exit code explícito e relatório) a 9,2/10, aprovado em dois ciclos após completar essas evidências. Não houve correção de código ou tradução entre os ciclos. O lote foi registrado no commit `65767d417b985c99bf412506b8f58b535f2712e4`, que inclui exatamente os oito arquivos do lote. O relatório `docs/REVISAO_CONSELHOS_TRES_PERFIS_2026-09-25.md` registra o log, seu hash e os limites da revisão por material fornecido.

Na abertura do P1 já estavam modificados `AGENTS.md` e `.opencode/agents/gauntlet-reviewer.md`, e não rastreados `docs/agent-routes/models.md`, `HANDOFF_LLM_COMPLETO.md` na raiz e um artefato de terminal com diff (33.504 bytes). Permaneceram fora do commit P1. A igualdade observada entre `HEAD` e a referência local `origin/main` não substitui `git fetch origin` quando for necessário afirmar o estado remoto em tempo real.

## 7. Atualização operacional — L3h e bloqueadores P0 (01/10/2026)

O usuário validou manualmente `vanguard`, `legal` e `arene`: as frentes “Controle e administração”, “Operação” e “Comercial” aparecem, não há contratação SaaS/investidores no início e o trimestre pode ser concluído. A revisão independente do lote L3h aprovou a integração em 9/10, após incluir pessoas/contratos e isolamento de mercados/pivôs para os seis empreendimentos operacionais atuais (`avam`, `dream`, `quant`, `vanguard`, `legal`, `arene`). Testes focados do motor, decisões, pessoas/contratos e isolamento de mercado foram aprovados; a inspeção visual foi executada pelo usuário.

Essa inspeção revelou bloqueadores P0: nomes e descrições SaaS residuais, relatório e encerramento em inglês, janela externa de Claude/Schumpeter, concorrentes com rodadas/IPO, alertas SaaS de caixa/eventos e gestão posterior de pessoas/contratos ainda legada. `Vanguard Robotics` e `Arene AI` são apenas exemplos vistos pelo usuário; o escopo obrigatório cobre **todos os doze** empreendimentos e toda superfície visível. O plano em `docs/PLANO_CONCLUSAO.md` registra o desdobramento e a prioridade.

Os corretivos P0.1, P0.2, P0.3 e P0.4 foram concluídos e revisados independentemente com notas 9/10, 9,5/10, 9,5/10 e 9,5/10. `tools/company-identity-patch.cjs` reescreve, no HTML gerado, os nomes e descrições das doze entradas de `COMPANIES` a partir de `locales/ventures.pt-BR.json`, preservando IDs, arquétipos e regras técnicas. `tools/operational-endgame-patch.cjs` redireciona `Game.endGame` antes do relatório SaaS legado para `operational-endgame-runtime.js`: resultado acadêmico local em português, sem valuation/equity, conselho, investidor ou link de Claude/Schumpeter, mantendo a captura da exportação local. `market-isolation-patch.cjs` agora oculta o cartão, listas, notícias, ajuda e modais de concorrência e interrompe simulação de rivais, atualizações de mercado e mudanças pendentes para os doze casos. No P0.3, eventos aleatórios foram bloqueados globalmente sem desviar `commitTurn`, e a revisão pré-trimestre foi localizada: não restam `0 quarters`, `Try concentrating AP`, captação nem risco de falência em inglês nessa superfície. No P0.4, os atalhos legados de contratação/desligamento abrem o painel local de pessoas e assessorias: auxiliares podem ser contratados ou desligados dentro do limite do empreendimento e contratos podem ser ativados ou encerrados; somente custos e capacidade operacional são recalculados. O save exige custos derivados e estado aplicado, e o painel não cria AP, equity ou equipe SaaS. O HTML recompilado foi inspecionado e o hash do original permaneceu `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`; quinze testes direcionados passaram. Ainda não considerar a correção P0 global concluída: resta a revisão integral do modal e das rotas de crise. Não iniciar L3i enquanto esse bloqueador persistir.

Não é necessária, nem autorizada como dependência do jogo, conta ou chamada a OpenCode, Gemini, Claude ou outro serviço externo. A exportação acadêmica continua local.

## 8. Trabalho pendente, em ordem segura

### Próxima unidade imediata

O lote de `marcusWebb` (21 campos), `michaelOkonkwo` (21) e `annaLindqvist` (19) foi fechado no commit `65767d417b985c99bf412506b8f58b535f2712e4`, preservando os 235 campos anteriores. A próxima posição pendente em `FUNDER_ADVICE` é `eleniStavros`, com 27 perfis ainda por tratar. Esse lote não conclui a etapa ampla P1. A investigação somente de leitura da cópia Johgo candidata foi concluída e reconciliada em `docs/REVISAO_EXPLORACAO_JOHGO_P2_2026-09-26.md`; ela não autoriza alteração de dados, nova tradução ou substituição de empreendimentos. O gate atual de P2 é a decisão explícita do usuário sobre quais casos Johgo serão apenas referência, mantidos, adaptados ou descartados. O roteiro `docs/agent-routes/translation.md` ainda cita `klausMuller` e 2.987 entradas: são referências históricas; usar o catálogo e o handoff atual para selecionar a próxima unidade.

### Estruturas posteriores ainda sem entrada de catálogo

Depois de concluir `FUNDER_ADVICE`, seguir a ordem do original:

1. `FUNDER_OPTIONS`, `VENTURE_ANGELS`, `FOLLOW_ON_INVESTORS`;
2. `MILESTONES`, `PIVOT_TEAM`, `VENTURE_MARKETS`, `MO_RISK_WEIGHTS`, `STRATEGIC_PIVOTS`, `FORCED_RESPONSES`, `PIVOT_MILESTONES`, `ARCHETYPE_PIVOT_MAP`;
3. `EXECUTIVES`, `HR_EXECS`, `CANDIDATE_POOL`, `CHAR_EVENTS`, `GENERIC_EVENTS`;
4. `RIVALS`, `PIVOT_RIVALS`, `REVENUE_MARKETING_EVENTS`, `FUNDER_EVENTS`, `COMPETITIVE_EVENTS`;
5. `MARKETS`, `NEWS`, `SHOCKS`, `TOKEN_SETTINGS`, `TOKEN_BASELINES`, `TOKEN_PER_STAFF`, `LIFE_EVENTS`;
6. `CONFERENCES`, `VENUE_THEMES`, `TICKER_LINES`, `DELEGATE_TYPES`, `SKIN_TONES`, `HAIR_TONES`, `OUTFITS`, `CONF_COSTS`, `CONF_SLOT_OFFSETS`;
7. `UIEffects`, `PITCH_FIGURES`, `PITCH_SEATS`, `PITCH_CHAIR_COLOURS`, `PITCH_TROUSER_COLOURS`, `PITCH_TOP_COLOURS`, `PITCH_POSES`;
8. os textos HTML, atributos, modais e mensagens de métodos que não pertençam às 71 estruturas.

Há 49 estruturas sem entrada no catálogo e a parte remanescente de `FUNDER_ADVICE`. A lista acima é um roteiro resumido: inclui-se também o conjunto técnico `_PG_TONE_SKIN`, `_PG_ACCENT`, `_PG_EURO_M`, `_PG_EURO_F`, `_PG_DARKH`. A classificação completa das 49 estruturas consta no plano. Ausência de catálogo não significa texto a traduzir, e estas contagens não medem percentual de conclusão.

### Adaptações funcionais ainda necessárias

1. Criar e aprovar a matriz de empreendimentos brasileiros antes de substituir dados de `COMPANIES`, `VENTURE_DETAILS`, BMCs, mercados, marcos, eventos e concorrentes. A referência Johgo deve ser identificada no material recebido por origem, versão e hash antes de ser usada; não assumir que uma cópia local, um ZIP ou sua versão representam a decisão atual do usuário. Academia, supermercado e clínica médica são apenas candidatos históricos, não uma seleção aprovada. Não improvisar valores ou casos.
2. Implementar as modalidades brasileiras de fomento, com elegibilidade explícita e sem juros para bolsas/recursos não reembolsáveis. Não reutilizar investimento-anjo ou capital de risco como disfarce de crédito.
3. Identificar e substituir as rotas societárias ainda legadas: negociação de financiamento, remuneração e contratação com participação, eventos que aplicam diluição e finais de IPO. Os módulos de crédito já substituídos são referências de integração, mas não cobrem todas as rotas.
4. Calibrar em R$ os custos, receitas, salários, caixa inicial, metas e riscos depois que os negócios brasileiros forem aprovados. Até então, valores originais em unidades internas são apenas referências de teste e não estimativas para microempresas brasileiras.
5. Traduzir a landing page inteira: título, desafio, transcrição do vídeo, botões, estatísticas do ecossistema britânico, créditos e modo extremo. Conferir `splice` nas bordas, aspas e chaves em cada bloco.
6. Executar teste visual acessível e partida completa até Q16, com sucesso, falha, salvamento/retomada e exportação da nota, tanto por servidor local quanto por abertura `file://`.
7. Rever acessibilidade, avisos de privacidade, instruções ao professor e documentação antes de qualquer liberação para turma.
8. Só depois decidir hospedagem. Não existe autorização registrada neste handoff para publicar em provedor ou alterar novamente o Supabase remoto.

## 8. Procedimento obrigatório: Gauntlet de revisão independente

Cada lote tem no máximo três ciclos. O revisor não pode ser quem editou o lote. Se a pendência relevante sobreviver ao terceiro ciclo, registrar `BLOCKED_FOR_REVIEW`; não aumentar a nota para encerrar o trabalho.

### Preparação

1. verificar o SHA-256 do original e o estado do checkout; identificar e preservar alterações preexistentes, sem exigir limpeza por descarte;
2. selecionar a próxima estrutura na ordem de `docs/INVENTARIO.md`;
3. extrair caminhos e valores com Acorn;
4. classificar cada item como interface, prosa, referência factual, nome próprio, chave técnica, dado numérico, SVG ou item sem tradução;
5. registrar fontes, destinos e exceções no catálogo ou no gerador;
6. fixar hash da estrutura de origem antes de escrever o catálogo.

### Implementação e testes

1. alterar somente destinos explicitamente aprovados por caminho;
2. rejeitar fonte divergente, caminho inexistente, caminho extra, destino vazio e colisão que descaracterize textos distintos;
3. comparar AST antes/depois, permitindo somente os literais catalogados;
4. criar teste que restaure os literais originais e compare todos os demais dados;
5. quando houver método dependente da estrutura, comparar cenários determinísticos do método original e do gerado;
6. executar gerador, `npm run verify`, `git diff --check` e, se o build for modificado, `node --check` dos scripts gerados.

### Ataque independente

O revisor deve dar nota de 0 a 10, listar problemas concretos e verificar:

- omissões, traduções excedentes e destinos em inglês que sejam prosa;
- números, datas, moeda, percentuais, siglas, nomes próprios e termos técnicos;
- IDs, regras, métodos, arrays, SVGs e `[NEW]`;
- testes específicos e pelo menos uma amostra representativa de métodos reais;
- documentação de limites e ausência de alegação de conclusão global.

### Correção e encerramento

Corrigir somente falhas comprovadas, rodar novamente a validação e pedir nova nota ao revisor. O relatório final do lote precisa informar nota inicial/final, número de ciclos, arquivos, contagem de caminhos, preservações, testes, limitações e commit. Só fechar com nota igual ou superior a 9/10 e sem pendência do escopo do lote.

## 9. Como avaliar o trabalho entregue por outro LLM

O avaliador pode executar esta sequência sem acessar serviços externos:

```powershell
Set-Location C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br
Get-FileHash source\index.original.html -Algorithm SHA256
git status --short
# Somente quando houver código/dados a validar:
.\check_project.ps1
git diff --check
```

Critérios objetivos:

| Área | Evidência necessária |
|---|---|
| Fonte | hash do original idêntico e arquivo sem alteração |
| Tradução | catálogo por caminho, fonte exata, destinos não vazios e classificação de exceções |
| Lógica | paridade AST e testes diferenciais de métodos tocados |
| Build | `npm run verify` aprovado, scripts validados e reprodução do HTML quando aplicável |
| Privacidade | nenhum dado de participante em rede, armazenamento remoto ou repositório |
| Financiamento | taxas/prazos aprovados, parcelas posteriores, dívida sem participação nas rotas alcançadas |
| Nota | cálculo 0–5, exportação local, conferência e recálculo pelo professor |
| Revisão | Gauntlet independente com nota documentada e máximo de três ciclos |
| Publicação | commit identificável, diff limpo, documentação atualizada; não afirmar que está pronto para turma enquanto houver pendências |

Para inspeção manual, abra `index.html` e `professor.html` por servidor local e por `file://`. Percorra uma partida de início a fim, force um cenário de crise, salve/retome e gere um resultado. A abertura por `file://` é requisito, não uma garantia já comprovada por testes automatizados.

## 10. Uso pelo OpenCode e mapa operacional

`AGENTS.md` na raiz é o ponto de entrada do OpenCode. Ele encaminha para três roteiros curtos em `docs/agent-routes/`, registra o limite de três ciclos do Gauntlet e exige revisão independente. `check_project.ps1` é o verificador executável: confere o hash da fonte, executa build e testes e valida o diff. O prompt para iniciar outra sessão e o mapa dos caminhos estão em `docs/PROMPT_OPENCODE.md`.

A pasta `C:\Users\Administrador\Downloads\Stingshot` contém anexos e uma configuração antiga do OpenCode, mas o código brasileiro editável e o Git estão em `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. O código original usado pelo build já está em `source/index.original.html`, dentro do checkout. Um agente que só vê o GitHub não acessa automaticamente os anexos da pasta Downloads. A configuração global de provedor do OpenCode permanece fora do repositório; nunca copie credenciais para o GitHub.

O Gauntlet registrado neste projeto é um processo de revisão, não uma instalação comprovada da skill externa Claudex Loop. CodeAF, JEV e a integração RTK com OpenCode não devem ser presumidos ativos apenas porque são mencionados em um prompt. O verificador local e o subagente somente leitura podem ser usados sem esses serviços, depois de confirmar as permissões efetivas do revisor.

## 11. Limites e condição de conclusão

O projeto ainda não está pronto para aplicação em turma. A tradução dos primeiros blocos e os módulos brasileiros isolados não substituem: adaptação dos empreendimentos, fomento completo, remoção das rotas societárias remanescentes, calibração monetária, tradução de toda a interface, teste integral online/offline e revisão final.

Só declarar a edição concluída quando houver catálogo completo ou exclusões justificadas, empreendimentos brasileiros aprovados, modalidades de fomento implementadas, todas as rotas de ações resolvidas, nota/exportação confirmadas em jogo completo, interface em português, auditoria de scripts/aspas/chaves e Gauntlet final. A entrega local e a validação por servidor local não autorizam hospedagem pública; esta permanece uma decisão posterior, separada e explícita.

O link opcional para o artefato público “Meet Ada” não integra a lógica da partida. Pode-se traduzir seus textos de uso, mas o jogo deve continuar jogável sem conta Claude e sem chave de API. Não inserir credenciais no HTML.

## Especificação detalhada — L3i de serviços, 06/10/2026

Foi criada `docs/ESPECIFICACAO_L3I_SERVICOS_2026-10-06.md` como proposta técnica, sem alteração de runtime, parâmetros, fórmulas ou salvamento. A análise separa `voed` (compatível, em princípio, com o contrato `brOperations` v2 por meio de porções agregadas) de `aether` e `edu` (que exigem especificação prévia de capacidade recorrente e extensão versionada). A próxima proposta implementável é L3i-a, condicionada à aprovação explícita de seus parâmetros didáticos e critérios de aceite.

## Proposta concreta — L3i-a Restaurante por quilo, 06/10/2026

Foi criada `docs/PROPOSTA_L3IA_RESTAURANTE_OPERACOES_2026-10-06.md`. Ela propõe ativar apenas `voed` usando o contrato `brOperations` v2 e a família técnica já suportada de estoque, reinterpretada na interface como porções preparadas. Os parâmetros, BMC, marcos, regras, limites e testes estão explícitos; nenhum valor foi aplicado no código ou nos dados enquanto a proposta não for aprovada.

## L3i-a implementado — Restaurante por quilo, 06/10/2026

Após aprovação explícita, `voed` foi incluído em `locales/operating-models.pt-BR.json` para operar com `brOperations` v2 e a família técnica `retail_inventory`, apresentada como porções preparadas, vendas, descarte e reposição no conteúdo do caso. Foram aplicados os parâmetros e marcos da proposta, BMC próprio e atualização de rastreabilidade em `tools/build.cjs`; não houve campo novo, migração, alteração de runtime, nem ativação de `aether`, `edu`, `cyber`, `terra` ou `sorgente`.

Validações concluídas: SHA-256 da fonte original aprovado; `npm run build`; `node --test tests/operations-runtime.test.cjs` (7/7); `node --test tests/bmc-translation.test.cjs` (17/17); `git diff --check`. Os novos testes cobrem ativação isolada, parâmetros e marcos, limite de venda, estado não negativo, recebíveis, restauração determinística, descarte sem receita e equivalência do BMC/marcos entre JSON e HTML gerado. Uma execução de `check_project.ps1` avançou pelos blocos de build, reprodução, BMC, financiamento, exportação, locais, gestão e transformações de métodos sem falhas, mas foi interrompida após permanecer sem saída; ela não deve ser registrada como aprovação integral da suíte.

Revisão independente (Aquinas): ciclo 1, nota 8,0/10, apontou ausência de “Fluxo operacional consolidado [NEW]” no marco 3 e cobertura insuficiente de restauração/descarte/equivalência HTML. Ambos foram corrigidos. Ciclo 2: nota final 9,8/10, sem pendências concretas no escopo L3i-a.

## Especificação adicional — L3i-b/L3i-c, 06/10/2026

Foi criada `docs/ESPECIFICACAO_L3IBC_CAPACIDADE_RECORRENTE_2026-10-06.md`. Ela documenta por que clínica e academia não devem reutilizar semanticamente `brOperations` v2, propõe um contrato versionado mínimo de capacidade recorrente e fixa limites de privacidade. Não há código, dados, fórmulas, valores nem migração aprovados por esse documento.

## Proposta concreta — L3i-b/L3i-c, contrato versionado, 06/10/2026

Foi criada `docs/PROPOSTA_L3IBC_CONTRATO_VERSIONADO_2026-10-06.md`. A proposta usa `brOperations` v3 somente para a nova família `service_recurring`, com `stateVersion` por modelo, para não invalidar saves v1/v2 dos sete modelos ativos. O estado separa capacidade agregada de base recorrente, reservada à academia; a clínica não recebe campos que possam ser confundidos com cadastro de pacientes. Nenhum runtime ou catálogo foi alterado.

## Proposta concreta — L3i-b Clínica popular fictícia, 06/10/2026

Foi criada `docs/PROPOSTA_L3IB_CLINICA_OPERACOES_2026-10-06.md`. Ela detalha parâmetros didáticos, BMC, marcos, regras agregadas e critérios de aceite para `aether` sob o contrato v3 proposto. O documento exclui expressamente dados de pacientes, agenda, decisões clínicas e campos de base ativa; nenhuma alteração de código ou dados foi aplicada nesta etapa.

## L3i-b implementado — Clínica popular fictícia, 06/10/2026

Após aprovação explícita, `aether` foi ativada no catálogo operacional com `stateVersion: 3`, `engine: operations-v2-service`, `family: service_recurring` e `serviceMode: aggregate_attendance`. O runtime passou a ter um ramo v3 limitado a procura, capacidade, atendimentos concluídos, ociosidade, recebíveis e ledger agregados. Não há inventário, base recorrente, agenda, pacientes, profissionais identificáveis ou dados clínicos. Os sete modelos anteriores permanecem nos contratos v1/v2; `edu`, `cyber`, `terra` e `sorgente` continuam desativados.

Validações concluídas: SHA-256 da fonte original aprovado; `npm run build`; `node --test tests/operations-runtime.test.cjs` (8/8); `node --test tests/bmc-translation.test.cjs` (17/17); `git diff --check`. Os testes cobrem isolamento de versão/engine, capacidade e ociosidade, ausência de inventário/base ativa, rejeição de campos arbitrários como `patients`, restauração determinística, os cinco pivôs e equivalência de BMC/marcos entre JSON e HTML.

Revisão independente (Cicero): ciclo 1, nota 7,5/10, identificou que o pivot genérico criava `inventory` inválido em v3 e que a validação aceitava campos arbitrários em `service`. O pivot passou a reduzir estoque somente em estados que o possuem; o esquema v3 agora aceita exatamente `capacity`, `usedCapacity` e `idleCapacity`. Ciclo 2: nota final 9,8/10, sem pendências concretas.

## Proposta concreta — L3i-c Academia, 06/10/2026

Foi criada `docs/PROPOSTA_L3IC_ACADEMIA_OPERACOES_2026-10-06.md`. A proposta define a variante `aggregate_membership` do contrato v3 para `edu`, com base ativa, entradas, saídas, capacidade e uso apenas em valores agregados. Ela preserva o esquema estrito de `aether` e não aplica código ou catálogo até aprovação explícita dos parâmetros e fórmulas.

## L3i-c implementado — Academia, 06/10/2026

Após aprovação explícita, `edu` foi ativada como a variante `aggregate_membership` do contrato `operations-v2-service` v3. O estado contém exatamente capacidade, uso, ociosidade, base ativa, entradas e saídas agregadas. A base fecha por `anterior - saídas + entradas`; o uso não excede base final ou capacidade; receita interna usa a base ativa e custo variável usa o uso agregado. Não há estoque, matrícula individual, treino, biometria, dados de saúde ou campo arbitrário persistível. `aether` preserva seu esquema estrito de atendimento agregado, e os sete modelos anteriores preservam os contratos v1/v2.

Validações concluídas: SHA-256 da fonte original aprovado; `npm run build`; `node --test tests/operations-runtime.test.cjs` (10/10); `node --test tests/bmc-translation.test.cjs` (17/17). Os testes incluem os cinco pivôs de `edu` com salvar, restaurar e avançar; rejeição de campos arbitrários e contadores fracionários; restauração de um save v1 representativo de `avam`; fechamento de base, limite de uso e equivalência de BMC/marcos entre JSON e HTML. `git diff --check` continua apontando espaços finais preexistentes em `index.html` gerado, fora das fontes deste lote; os arquivos de código do lote não contêm espaços finais.

Revisão independente: ciclo 1 (Mill), nota 8,8/10, apontou falta de teste de pivôs de `edu`, cobertura de save v1 e validação inteira de capacidade/uso. Todos foram corrigidos. Ciclo 2 (Halley), nota final 9,5/10, sem defeitos funcionais no escopo.

## Especificação adicional — L3j indústria, 06/10/2026

Foi criada `docs/ESPECIFICACAO_L3J_INDUSTRIA_2026-10-06.md`. Ela separa `cyber` e `terra` como candidatos à família existente `manufacture_to_order` v2, sob limites de conteúdo próprios, e reserva `sorgente` para decisão posterior de família. Não foram alterados runtime, catálogo, parâmetros, save ou HTML nesta etapa.

## Proposta concreta — L3j-a Confecção, 06/10/2026

Foi criada `docs/PROPOSTA_L3JA_CONFECCAO_OPERACOES_2026-10-06.md`. Ela propõe ativar apenas `cyber` pela família existente `manufacture_to_order` v2, com parâmetros internos, BMC, marcos e testes explícitos. Nenhuma alteração de catálogo, runtime, salvamento ou HTML foi aplicada nesta etapa.

## L3j-a implementado — Confecção, 06/10/2026

Após aprovação explícita, `cyber` foi ativada com a família existente `manufacture_to_order` v2. O modelo usa insumos, pedidos concluídos, refugo, reposição e recebíveis apenas em valores agregados; não altera runtime ou formato de save. `terra` e `sorgente` continuam desativadas. O BMC, os marcos e os pivôs usam conteúdo de confecção fictícia sem pessoa trabalhadora identificável, material específico, certificação ou alegação de sustentabilidade.

Validações concluídas: SHA-256 da fonte original aprovado; `npm run build`; testes direcionados de operações e BMC (29/29). Os testes cobrem parâmetros, limiares, limite de produção, refugo sem receita, restauração determinística, isolamento de `terra`/`sorgente`, equivalência JSON/HTML e os cinco pivôs de BMC de `cyber`.

Revisão independente (Zeno): ciclo 1, nota 9,2/10, identificou que o catálogo de pivôs usava formato abreviado e não era exercitado. O catálogo foi adaptado ao contrato `name`/`trigger`/`changes`, e foi adicionado teste que compara o BMC de cada pivô ao estado produzido. Ciclo 2: nota final 9,8/10, sem pendências funcionais concretas.

## Proposta concreta — L3j-b Produtos de limpeza fictícios, 06/10/2026

Foi criada `docs/PROPOSTA_L3JB_TERRA_OPERACOES_2026-10-06.md`. Ela propõe ativar somente `terra` pela família existente `manufacture_to_order` v2, com parâmetros internos, BMC, marcos e pivôs no formato exigido pelo runtime. Nenhuma alteração de catálogo, runtime, salvamento ou HTML foi aplicada nesta etapa.

## L3j-b implementado — Produtos de limpeza fictícios, 06/10/2026

Após aprovação explícita, `terra` foi ativada com `manufacture_to_order` v2. O modelo representa pedidos, insumos, refugo, reposição e recebíveis apenas como unidades internas agregadas. BMC, marcos e pivôs tratam de fornecimento institucional fictício e não incluem fórmula, substância, risco químico, desinfecção, eficácia, segurança, certificação ou conformidade. `sorgente` continua desativada.

Validações concluídas: SHA-256 da fonte original aprovado; `npm run build`; testes direcionados de operações e BMC (30/30). A cobertura inclui parâmetros, limites, refugo positivo com estoque reduzido além das unidades faturadas, receita apenas por unidades entregues, recebível do trimestre 1 liquidado exatamente com a receita direta do trimestre 2 após salvar/restaurar, pivôs de BMC e isolamento de `sorgente`.

Revisão independente (Hilbert): ciclo 1, nota 9,3/10, apontou ausência de asserções explícitas de refugo e recebimento diferido. Ambas foram adicionadas; a asserção final separa exatamente recebível anterior e receita direta corrente. Ciclo 2: nota final 9,9/10, sem pendências funcionais.

## Proposta concreta — L3j-c Alimentos congelados fictícios, 06/10/2026

Foi criada `docs/PROPOSTA_L3JC_SORGENTE_OPERACOES_2026-10-06.md`. A decisão recomendada é reutilizar `manufacture_to_order` v2, representando apenas refugo agregado de produção e evitando uma nova mecânica de produto pronto que poderia sugerir validade ou conservação. Nenhuma alteração de catálogo, runtime, salvamento ou HTML foi aplicada nesta etapa.

## L3j-c implementado — Alimentos congelados fictícios, 06/10/2026

Após aprovação explícita, `sorgente` foi ativada com `manufacture_to_order` v2, fechando os doze modelos operacionais. O modelo usa pedidos, insumos, refugo, reposição e recebíveis somente como unidades internas agregadas, sem validade, conservação, cadeia de frio, nutrição, alergênicos, segurança alimentar ou alegação de saúde. Não houve mudança de runtime ou formato de save.

Revisão independente (Archimedes): ciclo 1, nota 9,2/10, identificou o status desatualizado da proposta e a ausência de uma asserção explícita de preservação dos parâmetros dos modelos anteriores. O status foi corrigido e o teste passou a preservar os parâmetros comuns dos onze modelos já ativos. Ciclo 2: nota 9,7/10; os ajustes editoriais finais de contagem e títulos também foram aplicados. Não há pendência funcional neste lote.

## Auditoria L3k — integração após os doze modelos, 06/10/2026

Auditoria somente de leitura registrada em `docs/AUDITORIA_L3K_INTEGRACAO_OPERACIONAL_2026-10-06.md`. A operação, localização e encerramento já aceitam os doze IDs; isolamento de mercados, pessoas/contratos e decisões operacionais continuam restritos aos seis empreendimentos dos lotes iniciais. O risco imediato é que os seis recém-ativados mantenham modificadores econômicos legados de mercado apesar da interface oculta. A ordem recomendada é aprovar primeiro um lote L3k-a de isolamento para os doze e, depois, propostas por família para pessoas/contratos e decisões. Não houve alteração econômica nesta auditoria.

Validações concluídas: SHA-256 da fonte original aprovado; `npm run build`; testes direcionados de operações e BMC (32/32). A cobertura força refugo, verifica receita somente por unidades entregues, recebível diferido após save/restore, os cinco pivôs de BMC e uma referência explícita dos parâmetros dos onze modelos anteriores.

## L3k-a implementado — isolamento de mercados para doze operações, 06/10/2026

Após aprovação explícita, `market-isolation.js` passou a cobrir os doze IDs do catálogo de operações. Assim, os guardas já existentes neutralizam para todo empreendimento operacional os bônus e investimentos de mercado legados, a prontidão de pivô, choques e modificadores associados, enquanto a interface de mercados permanece oculta e `marketIntel` mantém seu contrato de save. Não houve alteração de valores, fórmulas, BMC, pivôs, eventos ou formato de save.

`npm run build` regenerou `index.html`; os testes de isolamento e operações passaram com 16/16; o hash da fonte original foi preservado. Revisão independente (Faraday): ciclo 1, 9,4/10, recomendou ligar a lista testada ao catálogo operacional; a asserção foi aplicada. Ciclo 2: nota final 9,8/10, sem pendências. Próximo lote recomendado: proposta de pessoas e contratos por família (L3k-b).

Na verificação integral posterior, `check_project.ps1` executou o build e 263 testes; encontrou uma única falha em `management-setup.test.cjs`, fora do escopo do isolamento. O teste ainda tratava `cyber` como caminho legado de receita, mas esse ID passou a usar operações próprias no L3j; por isso tentava ler `revenueHistory` após o retorno legítimo do runtime operacional. A preparação do teste agora isola explicitamente o cálculo legado que ele pretende verificar. A reprodução delimitada de gestão, isolamento e operações passou com 25/25; a fonte original permanece com o hash aprovado. A suíte integral não foi repetida após essa correção de teste devido à sua duração de aproximadamente doze minutos.

A repetição integral foi concluída depois: `check_project.ps1` retornou exit 0 com build e 263/263 testes aprovados em 782,5 segundos. A fonte original foi preservada; o script alertou somente que há 247 arquivos não rastreados fora da cobertura de `git diff --check`, em uma árvore já intencionalmente suja.

## L3k-b0 — calibração de pessoas e contratos, 07/10/2026

Os valores temporários propostos pelo Astra Médio foram analisados por 16 trimestres determinísticos, sem gravar catálogo, runtime, save ou HTML. O relatório em `docs/RELATORIO_L3KB0_CALIBRACAO_2026-10-07.md` concluiu que eles não devem ser implementados: os custos reduzem o caixa acumulado e a equipe máxima não acrescenta unidades além do cenário inicial nos seis casos. `edu` tem ainda um limite estrutural: aumentar capacidade não aumenta a base ativa. L3k-b permanece pendente de proposta recalibrada; para `edu`, a mudança de teto deve ser tratada como lote arquitetural próprio.

**Retificação em 07/10/2026:** a simulação temporária acima está invalidada para decisão. O laço incrementou o trimestre duas vezes, executando apenas oito avanços, e o cenário de equipe máxima não cobrou o custo adicional. Também não foi modelado o caixa completo da partida. A tabela do relatório não comprova inviabilidade nem ausência de benefício marginal. Refazer L3k-b0 com 16 trimestres consecutivos, custos e bônus candidatos em memória, mesmo estado e semente entre cenários, caixa inicial, despesas e obrigações. O limite `edu.activeBase <= baseCapacity` permanece confirmado pelo runtime. A resposta mais recente do Astra Médio no chat `AstraMedio Jogo` endossou essa separação e exigiu cenários comparáveis, menor saldo, trimestre de insolvência e efeito marginal de cada contratação ou contrato.

**Entrada para o próximo chat:** `docs/HANDOFF_CONTINUIDADE_L3KB0_ORQUESTRACAO_2026-10-07.md` reúne o estado atual, caminhos absolutos, restrições, resposta do Astra, limites da calibração anterior, plano dos lotes restantes e a divisão de trabalho entre Codex, Gemini e OpenCode.
