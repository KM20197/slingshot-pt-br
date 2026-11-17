# Planejamento P3 — VENTURE_MARKETS

## Estado de partida

P2 está concluído: `pivotType` e `funderView` permanecem IDs canônicos e recebem apenas rótulos visíveis em `Game.renderPivotCards`. Não implementar P3 antes de aprovar um recorte desta matriz.

## Matriz de impacto

| Campo | Uso encontrado | Natureza | Risco | Recomendação P3 |
|---|---|---|---|---|
| `funderComment` | Texto do card em `index.html:59149` | Apresentação | Baixo | Elegível para tradução estruturada; 36 caminhos alternativos. |
| `teamGap` | Texto condicional no card em `index.html:59141` | Apresentação | Baixo | Já traduzido no catálogo P1; só auditar cobertura e nulos. |
| `teamFit` | Ícones/badges derivados em `index.html:59070-59139` | Regra + apresentação | Médio | Não traduzir os booleanos; se necessário, localizar apenas os nomes dos departamentos no renderer. |
| `marketOpp.value/potential/challenge/risk` | Sementes e cálculo em `index.html:58513-58690` | Regra econômica | Alto | Fora de P3: não adaptar, traduzir nem remapear valores/IDs. |
| `pivotType` | Cor, busca de alternativa, marcos e save | Regra + apresentação | Alto | Concluído em P2 somente por rótulo; não tocar novamente. |
| `funderView` | Cor/ícone e rótulo visual | Regra + apresentação | Médio | Concluído em P2 somente por rótulo; não tocar novamente. |
| `marketOpp` como bloco | Dados de oportunidade exibidos e consumidos | Regra econômica | Alto | Fora de P3. |

## Recorte recomendado

P3a: somente `funderComment` alternativo, via catálogo estruturado com 36 caminhos `[marketId, 'alternatives', index, 'funderComment']`.

Justificativa: é prosa exibida diretamente, não participa de comparações, persistência, cores, cálculo econômico ou decisões. `teamGap` já está coberto; `marketOpp` e `teamFit` exigem análise separada.

## Critérios de aceite P3a

- Fonte original e hash estrutural continuam imutáveis.
- Ordem dos 12 mercados e 36 alternativas é validada contra a fonte.
- Cada alvo é string não vazia, sem espaços externos, diferente da fonte e sem chaves extras/ausentes.
- O gerador falha antes de escrever diante de fonte, estrutura ou alvo inválido.
- Idempotência em bytes e restauração integral de `VENTURE_MARKETS` são testadas.
- `marketOpp`, `teamFit`, `teamGap`, `pivotType`, `funderView`, níveis, bônus, thresholds, IDs, cores, regras e saves permanecem byte/estruturalmente preservados conforme o teste aplicável.

## Fora de escopo explícito

Não iniciar adaptação econômica, brasileira ou funcional. Não modificar `index.html` à mão. Não alterar `source/index.original.html`, IDs, comparações, mapeamentos, saves ou regras sem nova proposta aprovada.
