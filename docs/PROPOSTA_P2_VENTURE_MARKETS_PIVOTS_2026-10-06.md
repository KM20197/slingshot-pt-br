# Proposta P2 — tipos de pivot e visão de financiadores

## Escopo proposto

Adaptar apenas a apresentação de `pivotType` (`customer`, `problem`, `tech`) e `funderView` (`positive`, `neutral`) nas 36 alternativas de `VENTURE_MARKETS`, sem mudar os valores canônicos armazenados.

## Evidência de consumidores

- `index.html:59064` usa `alt.pivotType` para cores; `:59090` também o exibe como texto.
- `index.html:59143-59145` usa `alt.funderView` para cor, ícone e texto apresentado.
- `index.html:67236`, `:71329`, `:71528` comparam `pivotType` com IDs canônicos; `getPivotMilestones` também depende dele.

## Implementação segura sugerida

1. Criar funções puras de apresentação por ID, por exemplo `pivotTypeLabel(id)` e `funderViewLabel(id)`.
2. Usá-las exclusivamente nos pontos de texto visíveis de `renderPivotCards`; manter os IDs nos objetos, comparações, cores, ícones, saves e regras.
3. Não traduzir nem substituir valores em `VENTURE_MARKETS` ou no catálogo estruturado.

## Mapeamento de apresentação proposto

| ID canônico | Texto pt-BR |
|---|---|
| `customer` | Pivot de cliente |
| `problem` | Pivot de problema |
| `tech` | Pivot tecnológico |
| `positive` | Visão favorável de financiadores |
| `neutral` | Visão neutra de financiadores |

## Critérios de aceite

- Todas as comparações e decisões continuam usando os IDs canônicos.
- Saves existentes continuam carregando sem migração.
- As cores e ícones atuais continuam associados aos mesmos IDs.
- Testes devem cobrir os 36 cards, os três tipos de pivot, as duas visões de financiadores, reprodução de save e ausência de mutação dos objetos de mercado.

## Fora de escopo

`marketOpp`, `teamFit`, valores, potencial, desafio, risco, bônus, thresholds, efeitos, regras e qualquer adaptação econômica.
