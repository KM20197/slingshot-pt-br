# Proposta P3b — apresentação de `teamFit`

## Escopo aprovado

Localizar, em `Game.renderPivotCards`, os quatro nomes visíveis associados aos IDs
canônicos de `teamFit`:

- `dev` → `Produto`
- `sci` → `Pesquisa`
- `mkt` → `Vendas e marketing`
- `hr` → `Pessoas`

## Relação com P2

O mesmo patch de apresentação já continha o P2 concluído, que apresenta os rótulos de
`pivotType` e `funderView`. Esses rótulos permanecem como baseline aprovado e não são
parte da alteração P3b. O delta P3b é exclusivamente o mapa `teamFitLabels` e seu uso
no mapa local `deptLabels` do renderer.

## Limites

`teamFit` continua sendo o mesmo objeto booleano em cada alternativa. Este recorte não
altera IDs, valores booleanos, cores, ordem, cálculo de adequação, `marketOpp`, pivôs,
financiadores, saves ou regras.

## Aceite

O patch deve usar âncoras únicas no renderer, o build deve gerar o artefato, e o teste
deve confirmar os rótulos apresentados e a restauração integral de `VENTURE_MARKETS`
para a fonte técnica.
