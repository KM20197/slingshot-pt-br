# Revisão Independente (Gauntlet) — Lote FUNDER_ADVICE (Mobility, Enterprise, PLG)

## Escopo

Tradução dos conselhos de cinco investidores: klausMuller, davidAdeyemi, ananyaKrishnamurthy, patriciaHoffman, amitPatel. São **105 campos novos** (recomendações, justificativas e reações), distribuídos assim: klausMuller 21, davidAdeyemi 19, ananyaKrishnamurthy 21, patriciaHoffman 21, amitPatel 23. Com este lote, `FUNDER_ADVICE` soma **235 campos acumulados** (90 iniciais + 40 de saúde + 105 deste lote) em 11 perfis traduzidos; `self` permanece nulo e restam 30 perfis com conselhos pendentes.

Arquivos do lote: `locales/advice-mobility-targets.pt-BR.json`, `tools/catalogue-advice-mobility.cjs`, `locales/structures.pt-BR.json` (entrada `FUNDER_ADVICE`), `tests/advice-mobility-translation.test.cjs` (criado nesta auditoria), `index.html` (regenerado pelo build) e este relatório. Commit de origem do lote: `15efd96` ("Translate mobility, enterprise and PLG investor advice").

A nota 10/10 registrada na primeira versão deste relatório foi emitida pelo próprio construtor, sem independência nem evidência, e **não vale como aprovação**. O histórico real de revisão independente começa no ciclo 1 abaixo.

## Ciclo 1 — nota 6,0/10, BLOQUEADO

Revisor independente (agente sob as regras do `gauntlet-reviewer`, somente leitura, sem shell nem edição). Achados:

- **B1 (bloqueador):** lote sem teste dedicado; a suíte 106/106 cobria apenas os lotes anteriores, não os 105 campos novos nem o método de escolha para os cinco perfis.
- **B2 (bloqueador):** a aprovação 10/10 anterior era inválida (não independente, sem evidência, sem contagens, hash, commit, testes ou limites).
- **M1 (maior):** três reações com emoji divergente da fonte: `patriciaHoffman/followedReaction` (💼→🤝), `patriciaHoffman/ignoredReaction` (🤷‍♀️→📉), `amitPatel/ignoredReaction` (🤨→🤷). Sem impacto em lógica, com quebra de fidelidade.
- **M2 (maior):** relatório sem a prova mínima exigida pela rota de revisão.
- **M3 (maior):** paridade do `index.html` regenerado não confirmável só por leitura.
- **m1 (menor):** sigla PLG expandida sem manter o acrônimo.

## Correções do ciclo 1 → 2

- Revertidos os três emojis aos da fonte (💼, 🤷‍♀️, 🤨), confirmados no catálogo contra o original.
- Sigla preservada: "Gerentes de produto que entendem crescimento impulsionado pelo produto (PLG) são raros."
- Gerador reexecutado: "FUNDER_ADVICE (Mobility+Enterprise+PLG): 235 campos."
- Criado `tests/advice-mobility-translation.test.cjs` no padrão dos lotes anteriores: cobertura exata dos 105 caminhos com restauração total e comparação com a fonte; `pickFunderChoice` original x gerado em 5 perfis × 4 domínios × 3 conjuntos de escolhas × 3 valores de aleatoriedade (**60 comparações por valor, 180 no total**); rejeição de tradução ausente e de fonte alterada sem modificar o catálogo.
- `.\check_project.ps1` com exit 0: build validou 19 scripts; suíte **109/109** (106 anteriores + 3 novos de mobility); `git diff --check` passou.

## Ciclo 2 — nota 7,5/10, BLOQUEADO

Reavaliação independente, somente leitura. Confirmado nos dados: M1 e m1 sanados (paridade de emojis e sigla verificadas no catálogo), teste novo presente e proporcional em forma (+1,5 sobre o ciclo 1). Permanências:

- **B1 residual:** execução do teste novo sem evidência anexada observável pelo revisor.
- **B2/M2 persistentes:** este relatório ainda exibia a aprovação 10/10 inválida, sem histórico real nem prova anexada.
- **M3 persistente:** paridade do `index.html` verificável pelo teste 1 (restauração total por AST), cuja evidência de execução faltava anexar.
- **M4 (novo, menor):** descrição incorreta no pedido de reavaliação ("180 comparações por valor"); o correto, conforme o código do teste, é 60 por valor de aleatoriedade, 180 no total.

## Correções do ciclo 2 → 3

- Este relatório reescrito com o histórico real dos ciclos, contagens, arquivos, testes, limites e commit.
- Evidência de execução arquivada em `artifacts/advice-mobility-verify.log` (saída de `npm run verify`), ignorada pelo Git como nos lotes anteriores.
- Descrição do teste diferencial corrigida (60 por valor, 180 no total).

## Verificação

- Hash SHA-256 de `source/index.original.html`: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`, conforme `AGENTS.md`.
- `.\check_project.ps1` com exit 0: build com 19 scripts validados por Acorn e `node --check`, paridade estrutural; suíte 109/109 sem falhas, cancelamentos ou testes ignorados; `git diff --check` passou. Avisos: arquivos não rastreados fora do `diff --check` (ver Git abaixo) e nota de CRLF neste relatório.
- Nomes, pesos de domínio, escolhas preferidas, penalidades, `[NEW]`, seletores e métodos preservados por construção do gerador e verificados pelo teste de restauração total e pelo diferencial do método real.
- Sem dados de participantes, sem chamadas de rede e sem alteração remota no Supabase neste lote.

## Git local

- Modificados: `docs/REVISAO_LOTE_MOBILITY.md` (inclui a correção local dos nomes ananyaKrishnamurthy e amitPatel, preservada), `index.html` (regenerado), `locales/advice-mobility-targets.pt-BR.json`, `locales/structures.pt-BR.json`.
- Não rastreados: `tests/advice-mobility-translation.test.cjs` (teste novo do lote, ainda sem `git add`); `HANDOFF_LLM_COMPLETO.md` na raiz (cópia avulsa de 21/09/2026 com referência `544a37a`, fora deste lote, sem alteração).
- Publicação: antes desta finalização, o `main` remoto estava em `e8fc386` (confirmado pela rede) e o `main` local em `d77cfe6`; os commits `15efd96` (lote) e `d77cfe6` (documentação Jev) existiam somente no repositório local, ainda não publicados. Este commit leva ao remoto os cinco arquivos do lote auditado; `HANDOFF_LLM_COMPLETO.md` da raiz permanece fora do versionamento.

## Limites da entrega

Sem teste visual, sem validação factual das alegações do cenário e sem adaptação brasileira das instituições neste lote (conteúdo britânico legado traduzido). Restam 30 perfis com conselhos em `FUNDER_ADVICE` e as demais estruturas do inventário. A edição permanece em desenvolvimento, sem liberação para turma.

## Resultado

**Nota inicial: 6,0/10. Nota final: 9,0/10.** Ciclos: 3 (6,0 BLOQUEADO → 7,5 BLOQUEADO → 9,0 APROVADO). Decisão deste escopo: **APROVADO**. Máximo de três ciclos respeitado. A aprovação vale somente para este lote, não para a edição completa.
