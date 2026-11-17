# P1 — equipe de pivôs e consolidação da validação

Data: 02/10/2026. Checkout: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`.

## Escopo e preservações

Tradução de 75 caminhos de `PIVOT_TEAM`, na ordem AST: 18 de `research`, 19 de `product`, 19 de `sales` e 19 de `investor`. Somente `role`, `moodText`, `background`, `expertise`, `concerns`, `pivotView`, `forcedView` e os seis campos `note` por perfil foram catalogados. Nomes, cores, retratos, emojis, chaves e booleanos `support` permanecem idênticos. Foram mantidas referências estrangeiras, siglas e cifras, inclusive `£200M`, `40+`, `10x` e `#2`.

A tradução de um investidor legado não o transforma em financiador brasileiro, nem aprova sua presença funcional na edição final. Nenhuma fórmula, modalidade de crédito, regra de pivô, dado de save ou valor econômico foi alterado neste lote.

Arquivos novos: `locales/pivot-team-targets.pt-BR.json`, `tools/catalogue-pivot-team.cjs`, `tests/pivot-team-translation.test.cjs` e `tests/advice-complete-translation.test.cjs`. Catálogo atualizado em `locales/structures.pt-BR.json`; `index.html` regenerado exclusivamente pelo build. A árvore já estava suja e foi preservada.

O teste consolidado de conselhos confirma 861 caminhos em 41 perfis e `self` nulo, sem ausência, caminho extra, fonte divergente ou destino vazio. Restaura exclusivamente os cinco tipos de texto autorizados e compara toda a estrutura com a fonte. Confirma os cinco arquivos finais de destinos e executa 1.476 comparações determinísticas do método real `pickFunderChoice`. Não é uma nova revisão semântica de todos os conselhos.

## Classificação corrigida

Não havia prova de isolamento integral dos pivôs. `PIVOT_TEAM`, `STRATEGIC_PIVOTS`, `FORCED_RESPONSES` e `PIVOT_MILESTONES` ainda possuem consumidores no HTML gerado. A afirmação anterior de rota integralmente isolada foi retirada dos metadados pertinentes, sem modificar o motor.

`VENTURE_MARKETS` tem interface oculta nos doze casos, mas a neutralização de bônus, investimentos e prontidão alcança somente os seis modelos operacionais. Os demais seis conservam consumidores legados. `VENTURE_MARKETS`, `STRATEGIC_PIVOTS`, `FORCED_RESPONSES` e `PIVOT_MILESTONES` estão marcados `pending-translation`; entradas vazias não contam como tradução concluída.

`MILESTONES` está marcado `replaced-by-approved-layer`: `setup-patch.cjs` substitui nomes e descrições nos doze casos; em m1 também substitui foco, requisitos, prazo, ícone e `reward.val`. `operations-patch.cjs` substitui integralmente os marcos dos seis modelos operacionais. Não foram criados destinos que o build descartaria. Essa classificação não aprova novos parâmetros: descreve camadas preexistentes.

Contagem final por leitura do catálogo: 40 entradas, 3.701 caminhos e 3.639 destinos distintos da fonte. Quatro entradas registradas estão explicitamente pendentes de tradução, e 31 das 71 estruturas do inventário ainda não possuem entrada. As 17 entradas que declaram `sourceSha256` tiveram seus hashes de literal conferidos por AST. Essas contagens não são percentual de conclusão nem aprovação semântica das outras estruturas.

## Falhas preexistentes e correções delimitadas dos testes

A verificação inicial, antes de aplicar os 75 destinos ao catálogo, terminou com exit 1: 199/203 testes. As quatro falhas foram:

- `build-reproducibility`: expectativa antiga de 26 scripts, embora a camada de encerramento P0 já produza 27. A expectativa foi atualizada para 27; a comparação byte a byte do HTML foi mantida.
- Dois testes de localização: o patch L3c já produzia `Canais, pricing, partnerships`, enquanto a fonte contém `Channels, pricing, partnerships`. A comparação agora exige o literal localizado e restaura somente essa apresentação em `getUKGrantQuestions` e no item `q7` de `qScores`/`feedback`. Nenhum score, probabilidade, resultado, ID ou outro campo foi excluído da comparação. O hint parcialmente inglês continua pendência de P1.
- `management-content`: o teste ainda exigia os nomes originais de `COMPANIES`, apesar da identidade brasileira aprovada no P0. Agora exige nome e descrição exatamente iguais ao catálogo aprovado antes de restaurá-los para comparar integralmente os demais campos.

Não foi alterado código de produção para acomodar essas expectativas. As modificações preexistentes desses testes foram mantidas.

## Evidências finais

`check_project.ps1` concluiu com exit 0 e PASS. Build: 27 blocos de script, 183 traduções HTML estáticas. Suíte: 210/210 testes, nenhuma falha, cancelamento ou teste ignorado; duração da suíte 269.069,3858 ms. O teste de build em diretório novo reproduziu o HTML byte a byte.

Os quatro testes específicos de `PIVOT_TEAM` passaram: cobertura/restauração técnica, 58 cenários dos métodos reais `showPivotTeamDetail` e `showTeamMemberDetail`, idempotência/preservação das demais entradas e rejeição de destinos ausentes, extras, vazios, não textuais ou fonte alterada antes de escrever. Fixtures de teste são cópias temporárias em `artifacts/`; a fonte real não é editada.

SHA-256 final de `source/index.original.html`: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`. O Git não registra mudança nesse arquivo. `git diff --check` terminou sem erro; há apenas avisos CRLF/LF em arquivos já modificados. O verificador informou 172 arquivos não rastreados, que não são inspecionados por `git diff --check`; os quatro arquivos novos de código/destinos deste lote receberam conferência direta de whitespace.

## Revisão independente e limites

Revisor: agente independente `review_p1_pivot_validation`, que não escreveu o lote. Revisão exclusivamente por trechos e evidências fornecidos pela coordenação; não executou ferramentas, shell, testes, edição ou acesso à rede. As restrições foram procedimentais, não uma alegação de isolamento técnico do ambiente.

Um ciclo: nota estática inicial 9,5/10, condicionada às provas; nota final 9,5/10 e lote aprovado após receber build, suíte, SHA e diff. Nenhum achado objetivo exigiu correção. A aprovação cobre os 75 textos, gerador, testes novos, três correções de testes antigos e metadados revisados. Não estende a aprovação aos demais lotes ou ao projeto inteiro.

Não foi realizada inspeção visual em navegador ou partida integral até Q16; os 58 cenários com DOM simulado não substituem essa validação. Rótulos fixos ingleses dos modais, demais narrativas, matriz P2, adaptação funcional de pivôs, fomento e calibração permanecem pendentes. O catálogo original de 192 candidatos ainda não foi adaptado por este lote. Não declarar liberação para turma.

HEAD local observado: `36714758dd64c7b4bd9107633c946f969b5d3706`. Nenhum staging, commit, push, fetch, publicação ou alteração do Supabase foi executado. Não há afirmação sobre sincronização atual com o remoto.
