> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Handoff Astra — L3g: decisões operacionais do trio

## Missão

Fazer uma avaliação arquitetural **somente em leitura** e devolver uma especificação fechada para restaurar decisões jogáveis em três empreendimentos brasileiros, sem reativar a lógica de startup do jogo original.

Checkout: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`.

Não editar arquivos, não executar build ou testes, não fazer staging, commit ou push. Não chamar APIs nem enviar dados externos.

## Situação que motivou a análise

O lote L3f substituiu, apenas para assistência técnica de celulares (`avam`), minimercado (`dream`) e gráfica/embalagens (`quant`), a contratação inicial de gestores SaaS por **Pessoas e contratos iniciais**:

- proprietário sem salário e sem AP automático;
- supervisor e equipe operacional como empregados;
- assessoria administrativa/contábil e marketing/promoção como contratos externos;
- sem Gerente Geral, Gerente de Marketing ou participação societária na configuração inicial.

A inspeção visual confirmou que essa tela aparece e que os itens legados não aparecem. Porém, após confirmar a estrutura, não há decisões e o primeiro trimestre não pode ser iniciado.

A causa confirmada é técnica: L3f não preenche `this.team.research`, `this.team.dev` ou `this.team.marketing`; o método legado `selectQuarterEvents()` só cria `currentEvents` para esses cargos. Sem eventos, `renderDecision()` mostra `No decision pending`.

Não recomendar a simples recriação desses gestores SaaS. Isso somente destravaria a interface às custas de decisões narrativas sobre tecnologia, investidores, APIs e crescimento incompatíveis com serviço, varejo e indústria locais.

## Decisões do usuário já aprovadas

- Prioridade: adaptação econômica antes de tradução ampla, Ada ou eventos genéricos.
- O jogo deve ser offline, sem backend, sem credenciais e sem coleta de dados de participantes.
- O núcleo `operations-v1` vale hoje somente para `avam`, `dream` e `quant`.
- `VENTURE_MARKETS` permanece no save por compatibilidade, mas está invisível e neutralizado para o trio. Não reativá-lo nem removê-lo.
- O trio usa crédito didático sem emissão de ações; não introduzir VC, equity, ARR/MRR, clientes SaaS ou investimento-anjo pela rota de decisões.
- A chave de turma é exigida somente para exportar o resultado acadêmico local. Não é necessária para iniciar, jogar, salvar ou restaurar.
- Preservar `source/index.original.html`, SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
- Não alterar Ada/importador, Supabase, nota/exportação, crédito, concorrentes gerais, candidatos, os outros nove empreendimentos ou fórmulas não estritamente necessárias ao L3g.

## Estado técnico relevante

### L3f aprovado tecnicamente, mas sem aceite funcional completo

- Revisão independente: 9/10, aprovada, sem bloqueador estático.
- Testes locais anteriores: 158/160; as duas falhas de `location-translation.test.cjs` são preexistentes e fora de L3f.
- A inspeção visual revelou o bloqueio de decisões; por isso não foi possível testar trimestre, resultado negativo, save e restauração manualmente.
- Não houve staging, commit ou push.

### Pontos de leitura obrigatória

1. `AGENTS.md`
2. `docs/DECISOES_APROVADAS.md`
3. `docs/HANDOFF_LLM_COMPLETO.md`, seção “Checkpoint adicional — L3f”
4. `docs/REVISAO_L3F_2026-09-30.md`
5. `docs/ESPECIFICACAO_L3F_PESSOAS_CONTRATOS.md`
6. `docs/CHECKLIST_VALIDACAO_VISUAL_L3F.md`
7. `operations-runtime.js`
8. `people-contracts-runtime.js`
9. `business-adapter.js`
10. `locales/operating-models.pt-BR.json`
11. `locales/people-contracts.pt-BR.json`
12. `tools/operations-patch.cjs`
13. `tools/people-contracts-patch.cjs`
14. `tools/build.cjs`
15. `save-validation.js`
16. `source/index.original.html` somente para comparar a estrutura original.

### Cadeia que falha

- `people-contracts-runtime.js`, `showSetup()`: após a confirmação chama `game.showMilestoneModal()`.
- `tools/people-contracts-patch.cjs`, `startGame`: para o trio chama somente `SlingshotManagement.begin(this)` e `SlingshotPeopleContracts.applyStart(this)`; não cria executivos legados.
- `Game.randomizeStartingDomain()`, `Game.selectQuarterEvents()`, `Game.renderExecRow()`, `Game.renderDecision()`, `Game.confirmChoice()` e `Game.allChosen()` usam a lista fixa de departamentos legados.
- `Game.commitTurn()` aplica escolhas, processa efeitos e depois executa rivais, choques, narrativa bootstrap e outras rotas originais que não devem vazar para o trio.

### Economia já existente

`operations-runtime.js` mantém `brOperations` versão 2 para o trio:

- receita bruta, compra de estoque/insumo, custo consumido, encargo, recebimento, resultado e contribuição de caixa são separados;
- resultado operacional pode ser negativo;
- a contribuição de caixa já chega a `metrics.cash` sem exigir `customers` SaaS;
- saves `operations-v1` versão 1 continuam aceitos;
- capacidade e demanda já passam por `business-adapter.js` e Pessoas e Contratos v1;
- BMC, metas e pivôs do trio estão em `locales/operating-models.pt-BR.json`;
- os parâmetros são didáticos, não dados reais nem calibração final.

## Proposta preliminar a avaliar

Criar um domínio isolado de **decisões operacionais**, aplicável só ao trio, com três frentes que não são empregados:

1. Controle e administração;
2. Operação;
3. Comercial.

Os nomes podem ser refinados, mas não devem sugerir que existem três novos gerentes assalariados. A equipe de Pessoas e Contratos permanece a única fonte de empregados e contratos.

Catálogos de conteúdo necessários:

| Empreendimento | Situações prioritárias |
|---|---|
| Assistência técnica | triagem, orçamento, peças, ordens, prazo e retorno pós-serviço |
| Minimercado | compra, reposição, perdas, exposição, giro e caixa de mercadorias |
| Gráfica/embalagens | orçamento, insumos, fila, refugo, qualidade, produção e entrega |

Efeitos devem ser exclusivamente didáticos e explícitos sobre capacidade, demanda, qualidade/perdas, estoque/insumos, recebíveis, custo operacional ou métricas de meta já adaptadas. Não usar texto ou efeito de API, pesquisa acadêmica, SaaS, ARR, venture capital, equity, conselho de investidores ou mercado tecnológico.

## Questões a decidir pelo Astra

1. Recomendar a arquitetura mais segura entre:
   - domínio novo com IDs próprios (`controle`, `operacao`, `comercial`) e renderização própria;
   - adaptador de apresentação que reutiliza chaves legadas apenas internamente;
   - outro desenho melhor delimitado.

   Avaliar risco de as chaves legadas contaminarem save, resultados, eventos, exportação e telas futuras.

2. Definir a fronteira entre efeitos da decisão e `operations-v1`:
   - efeitos imediatos ou no trimestre seguinte;
   - permanentes, temporários ou de uso único;
   - como impedir dupla contagem de caixa, estoque, capacidade e custo;
   - como as decisões afetam metas/BMC/pivôs sem reintroduzir `VENTURE_MARKETS`.

3. Determinar quais mecanismos legados devem ser desviados somente no trio: seleção de eventos, conselhos de financiadores, mini-games, eventos de receita, rivais, choques, narrativa bootstrap, transições de mercado, eventos de vida, mensagens de superávit e penalidades de desengajamento. Distinguir claramente “desviar agora”, “deixar invisível, mas inócuo” e “lote posterior”.

4. Definir compatibilidade de save:
   - saves legados sem estado operacional;
   - saves `operations-v1` v1;
   - saves L3f v2 que abrem sem decisões em andamento;
   - saves L3g com uma ou mais decisões já escolhidas.

   Nenhuma restauração pode alterar silenciosamente caixa, estoque, pessoas, contratos, AP ou escolhas confirmadas.

5. Propor parâmetros de decisão somente como valores didáticos provisórios, com justificativa e testes de aceitação. Não apresentar valores como prática comercial, contábil ou legal brasileira.

## Entregáveis

Devolva um relatório em português com:

1. Veredito arquitetural e justificativa.
2. Matriz por empreendimento: frente de decisão, situação, três opções, efeitos pretendidos, efeito econômico, BMC/meta afetados, prazo de efeito, risco e teste de aceite.
3. Tabela dos desvios de mecanismos legados, com justificativa e impacto em cada tela.
4. Estratégia de save versionada, incluindo comportamento determinístico para saves L3f sem eventos.
5. Proposta fechada de implementação: arquivos permitidos, proibidos e métodos `Game` a interceptar.
6. Testes automatizados e roteiro visual mínimo.
7. Questões que exigem nova decisão do usuário, separadas de detalhes que podem ser implementados tecnicamente.

Não modificar o checkout. Não atribuir nota de revisão a uma implementação que não existe.
