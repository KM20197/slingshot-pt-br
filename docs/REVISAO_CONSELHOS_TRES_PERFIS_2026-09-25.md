# Revisão do lote P1 — três perfis de FUNDER_ADVICE

Data: 25/09/2026. Base local: `4696c6301ae38345d1a1d23502ad06fb5f9f9d70`. Execução histórica do lote: Codex, antes da definição atual dos três papéis do OpenCode. Fluxo atual: Gemini orienta, `slingshot-worker` implementa, `slingshot-explorer` faz levantamentos e `gauntlet-reviewer` revisa de modo independente. Estado: implementação e validação concluídas localmente; a revisão posterior pelo runtime real do `gauntlet-reviewer` foi de **7,8/10 bloqueado** a **9,2/10 aprovado** após evidências de hash e validação integral, sem mudança de código ou tradução; sem staging, commit ou push.

## Escopo e preservação

Tradução por caminho dos conselhos, justificativas e reações de `marcusWebb` (21 campos), `michaelOkonkwo` (21) e `annaLindqvist` (19), total 61, na ordem da fonte. Os 235 campos anteriores foram preservados por comparação profunda do catálogo com a base Git. As demais estruturas do catálogo também permaneceram iguais. Acumulado: 296 campos em 14 perfis; 27 perfis pendentes, próximo `eleniStavros`. Catálogo geral: 22 estruturas registradas, 3.153 caminhos, 3.101 destinos diferentes da fonte. Essas contagens não representam conclusão percentual do aplicativo.

Conteúdo britânico legado traduzido, sem adaptação de empreendimentos ou financiamento. Foram preservados os IDs, domínios e seus pesos, preferências, penalidades, números, métodos e ordem dos dados. `self` continua nulo. Emojis, CTOs, CFOs, B2B, ESG e IP foram mantidos; nomes geográficos em prosa receberam exônimos consolidados (Suécia/Noruega). “Grupo de investidores-anjo” mantém a terminologia do perfil de Marcus já catalogado. Não houve teste visual ou partida completa nesta etapa; a aprovação deste lote não aprova a edição para turma.

Fonte original SHA-256: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`. Hash do objeto FUNDER_ADVICE serializado: `02cb400289da66bc466aa0b48dc6b7292e234d91e8c20c47bc3ff5d8629db1a2`.

## Arquivos do lote

- `locales/advice-next-three-targets.pt-BR.json`: 61 destinos, classificados como prosa/conselhos/reações pelos caminhos do gerador e pela classificação existente da estrutura.
- `tools/catalogue-advice-next-three.cjs`: valida fonte e cobertura, acrescenta os caminhos selecionados sem descartar anteriores, verifica paridade e gera o catálogo ordenado.
- `tests/advice-next-three-translation.test.cjs`: quatro testes dedicados.
- `locales/structures.pt-BR.json`: somente 61 adições em FUNDER_ADVICE.
- `index.html`: gerado pelo build, sem edição manual.
- `docs/HANDOFF_LLM_COMPLETO.md` e `docs/PLANO_CONCLUSAO.md`: atualização do estado e das pendências.
- Este relatório.

Alterações anteriores fora do lote: `AGENTS.md`, `.opencode/agents/gauntlet-reviewer.md`, `docs/agent-routes/models.md`, `HANDOFF_LLM_COMPLETO.md` avulso na raiz e artefato residual de terminal com diff. `locales/pt-BR.json` não precisou ser alterado. Ajustes nas instruções permanentes do Gemini foram feitos fora deste checkout e não integram o commit proposto do aplicativo.

## Validação

1. Gerador: 61 campos do lote e 296 acumulados; comparação com catálogo da base confirmou preservação dos 235 anteriores e de todas as demais estruturas.
2. Teste de cobertura/paridade: 21+21+19 caminhos na ordem da fonte; restauração completa dos literais do catálogo e comparação de FUNDER_ADVICE inteiro; preservação de `self`, opções técnicas, emojis e siglas; três métodos originais idênticos.
3. Teste diferencial do método real `pickFunderChoice`: 3 perfis × 4 domínios × 3 conjuntos de escolhas × 3 valores determinísticos de aleatoriedade = 108 comparações.
4. Teste do gerador: adição exclusiva dos 61 caminhos, preservação das entradas restantes e idempotência byte a byte.
5. Casos negativos: tradução faltante, tradução excedente, destino vazio, perfil inesperado e fonte alterada são rejeitados antes de escrever o catálogo.
6. Primeira execução de `.\check_project.ps1`: build validou 19 scripts e suíte aprovou 113/113 testes, sem falhas/cancelados/ignorados, duração dos testes 124.158,7022 ms. Log em `artifacts/advice-next-three-verify.log`, ignorado pelo Git. O log termina em `PASS: fonte original, build, testes e diffs rastreados sem erros.` A sessão do executor perdeu o identificador após nova mensagem do usuário; o exit code externo dessa primeira execução não foi recuperado. Por essa lacuna de evidência, o verificador completo foi executado novamente.
7. Execução final: `pwsh -NoProfile -File .\check_project.ps1`, com saída registrada em `artifacts/advice-next-three-verify-final.log`: **exit 0**, observado no retorno do processo e na linha `CHECK_PROJECT_EXIT=0` do log. Build: 19 scripts. Suíte: **113/113**, zero falhas/cancelados/ignorados, duração dos testes 124.248,1977 ms. SHA-256 do log: `f78890b88146c7c7d3958e69048aa5bded0068e2d31e0a42821257d043b1c6df`. Nenhum código/dado foi alterado entre essas duas execuções; as alterações de fechamento posteriores são documentais.
8. `git diff --check` dos arquivos rastreados do lote: exit 0. Verificação direta com Node dos quatro arquivos novos: ausência de espaços finais e marcadores de conflito, codificação UTF-8 e quebra final, exit 0. O aviso do verificador sobre sete arquivos não rastreados foi tratado com essa verificação dos quatro novos deste lote; os três preexistentes não foram alterados nem incluídos. O pacote ao Gemini inclui o conteúdo integral dos arquivos novos, além do diff rastreado.

## Revisão independente

Agente `p1_independent_review`, diferente do executor, recebeu os 61 pares fonte/destino, o gerador, os quatro testes e as evidências. Confirmou que não fez chamadas de ferramentas sobre checkout, filesystem, shell ou rede, não editou nem delegou. Essa restrição foi cumprida por instrução; não há alegação de sandbox imposta pela plataforma nem de execução de testes pelo revisor.

- Ciclo 1: **8,8/10 — BLOQUEADO_POR_EVIDÊNCIA**. Nenhum defeito bloqueante de tradução ou código encontrado. Faltavam exit code explícito da execução completa e relatório de fechamento para conferir as afirmações.
- Correção: nova execução integral com exit 0 registrado no processo e no log; relatório com contagens, arquivos, preservações, cobertura dos testes e limitações. Não foi necessário alterar tradução, gerador ou testes para atender aos achados.
- Ciclo 2: **9,2/10 — APROVADO para este lote**, sem bloqueadores residuais. O revisor considerou sanadas as duas lacunas, confirmou a coerência do relatório com o material recebido e não solicitou outras correções. Nota inicial 8,8; final 9,2; dois ciclos, dentro do limite de três. A melhora decorre das evidências e do fechamento documental, sem alteração de código ou tradução entre ciclos.

## Próxima ação

Entregar ao Gemini o relatório, o diff dos arquivos rastreados, o conteúdo integral dos arquivos novos e as evidências. Com o pacote conferido, orientar a publicação manual somente dos oito arquivos deste lote, verificando o estado atual do índice e do remoto. A recomendação seguinte é preparar a matriz P2 com a versão/origem pertinente do Johgo, empreendimentos, empréstimos e fomento não reembolsável, antes de traduzir em volume conteúdo destinado à adaptação. Nenhuma decisão de negócio ou implementação P2 foi realizada aqui.
