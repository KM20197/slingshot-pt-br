# Próximo recorte delimitado — marco e áreas de foco

Os Lotes A e B trataram a gestão e as telas acessíveis de contratação. Ficou fora do escopo, por decisão registrada, a apresentação dinâmica do rastreador de marco no método `Game.update`. A varredura AST do build vigente (`6968ed1d…`) confirma que `Game.update` ocorre uma única vez na classe `Game`, nas linhas 62.027–62.504; na fonte original, o mesmo método ocupa as linhas 72.612–73.089. Os alvos abaixo são literais de apresentação, não integram os 2.615 sinais do inventário r482 e não foram corrigidos nos Lotes A/B.

## Alvos dentro de `Game.update`

| # | Literal atual na fonte original | Linha | Consumidor |
| --- | --- | --- | --- |
| 1 | ``deadlineText = turnsLeft <= 0 ? "⚠ OVERDUE!" : `Due Q${this.milestone.deadline} (${turnsLeft}q left)` `` | 73.003 | Prazo do rastreador principal |
| 2 | ``milestoneDeadline.textContent = `Due Q${this.milestone.deadline}` `` | 73.012 | Prazo do painel lateral legado |
| 3 | `milestoneProgress2.textContent = "✓ Ready!"` | 73.020 | Indicador de conclusão |
| 4 | `milestoneDeadline2.textContent = "Completes at end of quarter"` | 73.021 | Conclusão no fim do trimestre |
| 5 | `milestoneLabel.textContent = "Select next milestone..."` | 73.051 | Estado sem marco no painel lateral |
| 6 | `milestoneLabel2.textContent = "🎯 Choose your next milestone"` | 73.056 | Estado sem marco no rastreador principal |
| 7 | `milestoneDeadline2.textContent = "Ready to select"` | 73.059 | Prazo no estado sem marco |
| 8 | `focusLabels = { sci: "Research", dev: "Product", mkt: "Sales & Marketing", hr: "Team" }` | 73.030 | Áreas exibidas após "Concentre-se em:" |

O texto estático ao redor já está em português: `milestoneLabel2` inicia com "Nenhum definido" e `milestoneHint` contém "Concentre-se em:". A mistura de idiomas aparece na mesma linha do rastreador. `focusLabels` alimenta `milestoneFocusAreas` com separador `" & "`; o valor de `hr` é `"Team"`, diferente de `"People"` usado em outros mapas da mesma família.

`Due Q` e `q left` exigem decisão de forma antes da execução. O Lote B usa `T` para trimestre em contexto dinâmico (`Entrou no T${...}`), mas isso não foi formalizado como regra global. O intervalo também precisa de singular e plural (`1q left` contra `2q left`). Os emojis `⚠`, `✓` e `🎯` fazem parte da apresentação e não devem ser removidos.

Para os nomes das áreas, há precedente aprovado no próprio contexto de marcos: `getMilestoneFocusAreas` e `getMilestoneFocusReason` usam "Operações e Qualidade", "Produção e Serviços", "Vendas e Marketing" e "Gestão de Pessoas", com separador `" e "`. Os rótulos curtos de `statNames` no modal de demissão ("Operações", "Produção", "Vendas", "Pessoas") são outro contrato e não devem ser importados para cá sem decisão. A escolha final entre `"Pessoas"` e `"Gestão de Pessoas"` e entre `" & "` e `" e "` permanece humana.

## Vizinhança fora de `Game.update`

A mesma família de rótulos aparece em mais dois métodos alcançáveis:

- `showMilestoneIntel` (38.153–38.383): mapa com `hr: "People"` e texto `Focus areas: ... join(' & ')` em 38.165. Acionado pelo botão de inteligência de marco em 37.959.
- `showAdvisorSuggestions` (38.390–38.670): mapa sem `hr` e `join(' & ')` em 38.417. Acionado por `openAdvisorBtn` em 3.992.
- `showMilestoneModal` (37.849–38.019): já usa os rótulos longos em português em 37.904, o que serve de referência de nomenclatura.

Incluir os dois primeiros ampliaria o recorte para três métodos e exigiria trilha de consumidor própria. A decisão de escopo não foi tomada; este registro não autoriza edição.

## Condições de execução, se contratado

- O novo patch deve ser aplicado depois de `tools/team-capacity-ui-patch.cjs`, porque os dois reescrevem `Game.update`; a restauração deve ser limitada aos literais de apresentação.
- Fórmulas, expressões, `className`, IDs, visibilidade, handlers, `milestoneProgress` e a ordem das instruções devem permanecer com paridade AST.
- O patch deve falhar fechado para âncora ausente, duplicada ou deslocada, ser idempotente em bytes e cobrir os casos ambíguos: `Due Q${...}` aparece duas vezes porque um literal contém o outro, e `Ready!` aparece em um título, em um comentário e no alvo, o que exige âncora com `milestoneProgress2`.
- A validação deve incluir build, conferência do HTML gerado e suíte completa; a linha de base atual é 375/375, sem falhas, cancelamentos ou ignorados.
- `index.html` continua sendo produto de `npm run build`; a fonte original permanece intacta.

Este recorte está apenas documentado: nenhum build, nenhuma alteração de código e nenhum contrato foram feitos para ele. O registro não reabre os Lotes A/B nem substitui o parecer pendente.

# Atualização do inventário — r494

# Atualização do inventário — r495

Triagem AST fresca confirmou quatro referências legadas (`selectRevenueEvent`, `selectFunderEvent`, `triggerRandomShock`, `showShock`) atrás dos desvios/guardas operacionais. O módulo operacional lista 12 IDs com conteúdo em português; os pools canônicos de 17/63/42 itens permanecem preservados. Nenhum novo recorte foi contratado. Provas: `artifacts/recorte-pos-news-20261023-r489/INVENTARIO_CONSUMIDORES_R494.md` e `.json`.

NEWS141 aceito r488 e sete rótulos ativos de indicadores aceitos r494 (suíte C2 365/365, revisão C2 10/10). Continuar a classificação por consumidor ativo; eventos legados bloqueados no fluxo operacional não são automaticamente erros de tela. Nenhum próximo recorte contratado. Provas:artifacts/recorte-pos-news-20261023-r489/RELATORIO_FINAL.md. As entradas abaixo são históricas.

# Atualização do inventário — r489

NEWS141 aceito emr488, conforme artifacts/news-contexto-20261022-r485/RELATORIO_FINAL.md. A proposta NEWS abaixo é histórica, já executada. Nova trilha estática confirma bloqueios operacionais de eventos de receita/investidores e choques; seus textos ingleses não são automaticamente erros de tela no fluxo operacional. Próximo lote contratado:sete rótulos ativos de indicadores, com regras e valores preservados. Provas e limites:artifacts/recorte-pos-news-20261023-r489. Contagens anteriores permanecem históricas, não foram refeitas globalmente.

# Inventário técnico de tradução — r482

Os 356 produtos aceitos em r481 permanecem com os mesmos hashes. A fonte original foi preservada. Este trabalho executou auxiliares de extração e conferência; não mudou o jogo nem repetiu a geração ou a suíte de 359 testes já aceita.

A comparação de raízes com nome/caminho correspondente no AST encontrou 2.615 sinais de prosa longa que continuam iguais ao original. A triagem por camadas analisou 27 scripts internos, 2.080 textos HTML, 36 atributos de interface, 10 textos em SVG e 91 catálogos. Foram percorridos 37.971 literais ou segmentos de template nos scripts e 13.432 valores nos catálogos, excluídos os campos source dos pares. Dois scripts de bibliotecas e oito URLs de dados ficaram fora da triagem lexical. Os demais módulos do jogo estão incorporados aos scripts internos, por isso não houve arquivo externo de runtime adicional.

A triagem retornou 3.635 sinais lexicais. Eles não representam 3.635 erros nem uma contagem de textos restantes. As duas contagens não devem ser somadas; há sobreposição de critérios e duplicação entre catálogo e HTML gerado. Nomes próprios, identificadores, SVGs, créditos e dados antigos exigem conferência de seus consumidores. O critério lexical também pode deixar de sinalizar textos curtos.

A contagem estrutural atual confirma 1.874 literais de prosa CHAR_EVENTS alterados, 2.124 de GENERIC_EVENTS, 64 de COMPETITIVE_EVENTS e 861 de FUNDER_ADVICE, sem sinal de prosa longa igual ao original nessas quatro raízes. São contagens técnicas; não reabrem aceites nem certificam coerência narrativa global. Os oito sinais de exemplos famosos em FOUNDER_PROFILES não são automaticamente pendências de tela: o consumidor desses exemplos foi removido no onboarding. CANDIDATE_POOL, RIVALS, PIVOT_RIVALS, FUNDER_EVENTS, REVENUE_MARKETING_EVENTS, SHOCKS e os demais sinais precisam de recortes e trilhas de consumo próprios. Nenhuma comparação narrativa dos 192 perfis foi feita.

## Próxima proposta delimitada: 141 manchetes NEWS

As 141 strings de NEWS permanecem iguais ao original, nos grupos hype, winter, stable, default, general e uk, com 18/18/18/18/48/21 entradas. A análise estática confirmou Game.renderBoardroom → Game.renderNews → #newsContent.textContent. A frase inicial do letreiro está em português, mas essa atualização a substitui por uma mistura das manchetes originais. Não foi executada partida, Game, RNG, save ou importação.

O próximo recorte pode traduzir e adaptar essas 141 manchetes fictícias, preservando chaves, ordem, tamanhos, marcador •, números e moedas originais, sem conversão cambial. A proposta mantém o consumidor, a seleção 6+8+4+4, a repetição duas vezes e o RNG. NEWS contém apenas strings, sem efeitos econômicos diretos nos dados; isso não autoriza alterar regras nem apresentar legislação ou garantias novas como fatos. A proposta está preparada, não contratada nem implementada; antes do contrato, reconfirmar AST, efeitos e hashes vivos. A execução local já autorizada não depende de confirmação rotineira.

Fonte, regras, valores e saves estão preservados. O log parcial Marcus C1 permanece sem saída fabricada. Novas partidas: zero; ledger histórico: 41. Resíduos econômicos e requisitos globais continuam abertos. Gemini é o orquestrador desejado; Codex coorquestra até transferência validada. Pacote somente local, sem envio ao Drive ou leitura do Gemini confirmados. Sem cobrança, Git mutável, Supabase remoto, publicação ou START42.


Conferido em22/10/2026,r484. Revisão independente documental OpenCode C1,nota9.5/10. Provas:artifacts/inventario-restante-20261022-r482. Contagens e hashes executados pelo coordenador;parecer sobre dossiê,sem execução pelo revisor.

# Atualização do inventário — r498

Lotes A/B seguem em `BLOCKED_FOR_REVIEW`; testes dedicados 2+4 passaram 6/6 e a suíte completa passou 375/375. `index.html` `6968ed1d…`; fonte original intacta. O recorte de marco/áreas de foco continua apenas documentado, sem contrato ou edição.
