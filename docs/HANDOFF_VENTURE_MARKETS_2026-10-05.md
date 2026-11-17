> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Handoff de continuidade — VENTURE_MARKETS

Data: 05/10/2026. Checkout correto: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. O cwd do chat pode apontar para outro diretório; não o use para alterações.

## Orientação ao próximo chat

Continue de forma autônoma e silenciosa. Não interrompa o usuário para confirmações, status rotineiro, escolhas cosméticas, execução de build/testes ou criação normal de arquivos. Pare somente quando for realmente necessário que o usuário use **OpenCode** ou **Gemini**. Ao precisar deles, entregue um prompt completo com caminhos absolutos, escopo, proibições e formato de resposta. Mantenha o usuário informado por comentários curtos durante operações longas.

Use sempre português. Preserve a árvore intencionalmente suja: não execute `git reset`, `git checkout`, staging, commit, push, fetch nem comandos destrutivos. Use `apply_patch` para edições. Não edite `index.html` manualmente; gere-o por `npm run build` ou `node tools/build.cjs`.

## Fonte e invariantes

- Fonte imutável: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\source\index.original.html`
- SHA-256 obrigatório: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`
- Hash da estrutura `VENTURE_MARKETS`: `13f1fee373cfa8736284d8d9558af55e4a9e1da5b17e4048053f6a21cbd5d013`
- Mecanismo de aplicação/paridade: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\tools\structured-translation.cjs`
- Build: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\tools\build.cjs`
- Catálogo acumulado: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\locales\structures.pt-BR.json`

Somente prosa de apresentação pode mudar. Preserve IDs, ordem, `threshold`, `marketOpp`, `bonus`, `pivotType`, `teamFit`, `teamGap`, `funderView`, `funderComment`, números, regras e consumidores.

## Estado aceito

`VENTURE_MARKETS` tem **602 caminhos** catalogados e status `partial-translation`:

| Recorte | Caminhos | Estado |
|---|---:|---|
| `current.name` e `current.description` | 24 | aceito |
| `alternatives[].name` | 36 | aceito |
| `alternatives[].description` | 36 | aceito |
| `alternatives[].shortDesc` | 36 | aceito |
| `alternatives[].teamGap` não nulo | 26 | aceito |
| `alternatives[].funderComment` | 36 | aceito |
| `current.levels[].name` | 60 | aceito (OpenCode 9/10) |
| `current.levels[].insight` | 60 | catalogado; ainda requer teste/revisão de aceite |
| `alternatives[].levels[].name` | 144 | aceito (OpenCode 9/10) |
| `alternatives[].levels[].insight` | 144 | aceito (OpenCode 9/10; teste dedicado já existe) |

O lote anterior de mercados (194 caminhos) foi aceito; também coexistem sem alteração funcional `STRATEGIC_PIVOTS` (45), `FORCED_RESPONSES` (47) e `PIVOT_MILESTONES` (26).

## Arquivos de cada recorte recente

### Níveis atuais

- Alvos de nomes: `locales\venture-markets-current-level-names-targets.pt-BR.json`
- Gerador: `tools\catalogue-venture-markets-current-level-names.cjs`
- Teste: `tests\venture-markets-current-level-names-translation.test.cjs`
- Alvos de insights: `locales\venture-markets-current-level-insights-targets.pt-BR.json`
- Gerador: `tools\catalogue-venture-markets-current-level-insights.cjs`
- Ainda falta criar `tests\venture-markets-current-level-insights-translation.test.cjs`, incluindo cobertura, HTML, restauração, idempotência e rejeição atômica.

### Níveis alternativos

- Alvos de nomes por `marketId -> alternative.id`: `locales\venture-markets-alternative-level-names-targets.pt-BR.json`
- Gerador: `tools\catalogue-venture-markets-alternative-level-names.cjs`
- Ainda falta criar o teste específico dos 144 nomes alternativos.
- Alvos de insights por `marketId -> alternative.id`: `locales\venture-markets-alternative-level-insights-targets.pt-BR.json`
- Gerador: `tools\catalogue-venture-markets-alternative-level-insights.cjs`
- Teste: `tests\venture-markets-alternative-level-insights-translation.test.cjs`

Os alvos por ID de alternativa são preferíveis a arrays posicionais: evitam permutas silenciosas. Mantenha esse formato em novos recortes alternativos.

## Achados e decisões de revisão

- OpenCode aprovou nomes atuais (9/10), nomes alternativos (9/10) e insights alternativos (9/10).
- Ajustes cosméticos pendentes: quebrar geradores minificados em múltiplas linhas e adicionar `console.log` de contagem.
- Melhoria de teste pendente para insights alternativos: o extrator do teste deve falhar explicitamente quando `VENTURE_MARKETS` estiver ausente ou duplicado, como o gerador já faz.
- A classificação em `structures.pt-BR.json` deve dizer explicitamente que títulos e insights de níveis atuais/alternativos estão incluídos e que `customerInsights`, oportunidades, riscos, bônus, efeitos e demais textos seguem pendentes.
- Não substitua os insights atuais por uma versão brasileira adaptada que foi fornecida pelo usuário: ela introduzia leis, valores e instituições brasileiras e pertence a P2/P3, não à tradução fiel de P1.
- O Gemini inicialmente devolveu JSON inválido; a versão limpa foi validada como 12 mercados, 36 alternativas e 144 insights, e foi usada somente para `alternatives[].levels[].insight`.

## Próxima sequência recomendada

1. Criar e executar o teste dos 60 insights atuais; incluir SHA, filtros `src`/JSON-LD/função, restauração integral, HTML, idempotência e fixture de falha atômica usando `tests\venture-markets-generator-support.cjs`.
2. Criar e executar o teste dos 144 nomes alternativos, com vínculo por `alternative.id`, restauração integral, HTML, idempotência e falha atômica.
3. Melhorar o teste de insights alternativos para rejeitar declaração ausente/duplicada e, se conveniente, adicionar fixture atômica.
4. Executar `npm run build`, testes focados e depois `check_project.ps1` quando os testes novos estiverem prontos. Só registre a contagem de testes após execução real.
5. Pedir OpenCode para cada lote novo somente depois de testes focados e build. Não alegar que ele executou testes; suas revisões são estáticas.
6. Depois dos níveis, o próximo conteúdo de prosa mapeado é `current.customerInsights` (120 caminhos). Não traduzir `marketOpp`, bônus, riscos, `pivotType`, `funderView` ou efeitos sem escopo funcional P2/P3 aprovado.

## Validações já executadas neste chat

- Antes dos lotes recentes: `check_project.ps1` passou com 236/236 testes.
- `venture-markets-current-level-names-translation.test.cjs`: 3/3 passou após endurecimento de espaços de borda.
- `venture-markets-alternative-level-insights-translation.test.cjs`: 2/2 passou após normalização do catálogo e build.
- Builds recentes concluíram com `scriptBlocksChecked: 27` e `htmlTranslations: 183`.
- O SHA da fonte original foi confirmado em verificações anteriores.

Não declarar uma nova suíte completa aprovada sem rodá-la novamente após os últimos arquivos adicionados.

## Limites do projeto

P1 permanece aberto. `VENTURE_MARKETS` ainda é parcial; `customerInsights`, oportunidades, riscos, bônus, efeitos e demais estruturas ainda não foram concluídos. P2/P3 (adaptação brasileira funcional) exigem proposta e aprovação explícitas. A interface de mercados permanece oculta e a neutralização de efeitos é limitada aos seis modelos operacionais; não declarar isolamento integral.
