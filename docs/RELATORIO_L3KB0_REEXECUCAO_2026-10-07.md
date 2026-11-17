# Relatório L3k-b0 — reexecução de calibração

**Data:** 07/10/2026  
**Status:** análise isolada revisada; não aprova valores de L3k-b.

## Escopo e evidências

- Artefato reproduzível: `artifacts/l3kb0/simulate-l3kb0.cjs`.
- Execução local: `node --check artifacts/l3kb0/simulate-l3kb0.cjs` e `node artifacts/l3kb0/simulate-l3kb0.cjs`, ambos exit 0.
- Resultado: 324 cenários, 5.184 linhas trimestrais e 312 comparações; arquivos em `artifacts/l3kb0/`.
- A fonte original foi conferida pelo script e no coordenador: SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
- Não houve alteração de catálogo, runtime, save ou HTML. Os artefatos são ignorados por `.gitignore`.

O script chama os módulos reais de operações, gestão e crédito. Os parâmetros de pessoas são candidatos apenas em memória. Cada cenário recomeça com o mesmo estado determinístico do empreendimento, percorre Q1–Q16 uma vez e separa receita por competência, recebimentos, compras, encargos, parcelas e caixa.

O caixa de partida usa R$ 350 mil próprios ou R$ 430 mil com crédito inicial de banco público, o burn legado de `source/index.original.html:9868-9878`, a ocupação de R$ 8 mil da Metrópole Central e parcelas reais. Sem `brBusiness`, a referência é o trio legado de menor folha (Yuki, Wei e Marcus: R$ 62 mil/trimestre e bônus completos). Com `brBusiness`, aplica-se a substituição de folha definida pelo runtime.

Ficam fora da simulação: L3k-c, perfis alternativos de gestor e fundador, choques, marcos, crise e crédito posterior. Por isso, os resultados não demonstram sustentabilidade de partida completa.

## Controles confirmados

- Cada trilha contém exatamente Q1–Q16.
- A equipe máxima custa mais do que a inicial.
- Sem `brBusiness`, não há bônus nem custo candidato.
- `edu.activeBase` não excede `baseCapacity`.
- A flag de melhora contra a linha de base é separada de viabilidade financeira no Q16.

## Resultado econômico

Os candidatos originais — supervisor, duas pessoas e dois contratos, com custo trimestral de 38 (`voed`/`edu`), 41 (`aether`) ou 46 (demais) — ficaram insolventes entre Q7 e Q12 com recursos próprios para todos os seis IDs.

Mesmo o cenário mínimo, com apenas o supervisor e sem contratos, é insuficiente para `voed` (-162, Q11), `aether` (-77, Q14), `terra` (-63, Q14) e `sorgente` (-1, Q16). `cyber` chega a +2, uma margem que não tolera decisão, choque ou variação; `edu` chega a +249, mas a capacidade adicional não eleva sua base ativa máxima de 32 nem os recebimentos.

O contrato comercial acrescenta unidades e recebimentos fora de `edu`, mas não paga seu próprio custo candidato. Contabilidade não modifica demanda, capacidade ou recebimento no runtime. De duas para cinco pessoas, o cenário neutro não ganha unidades ou recebimentos: acumula somente mais R$ 288 (`voed`/`edu`), R$ 336 (`aether`) ou R$ 432 (indústrias) de custo em 16 trimestres.

## Revisão independente

O `gauntlet-reviewer` examinou o script, artefatos e módulos em sessão distinta e somente leitura. Nota inicial 8,5/10; foram corrigidas a proveniência de burn, o bônus `sci:3` da referência legada, a leitura ambígua de equilíbrio e a evidência interna. Nota final: **9,2/10**, veredito **APROVADO para o escopo examinado**. O revisor não aprovou valores econômicos.

## Proposta para decisão

Não implementar a proposta original de L3k-b. A análise não sustenta cadastrar pessoas/contratos iniciais nos seis empreendimentos sem alterar parâmetros econômicos ou o escopo da simulação.

É necessária uma decisão humana entre:

1. autorizar uma segunda varredura isolada, com novos custos e bônus candidatos explicitamente delimitados; ou
2. postergar L3k-b até uma recalibração mais ampla de burn, caixa inicial ou operação.

Qualquer alteração de `edu.activeBase <= baseCapacity` permanece um lote arquitetural próprio, fora de L3k-b.
