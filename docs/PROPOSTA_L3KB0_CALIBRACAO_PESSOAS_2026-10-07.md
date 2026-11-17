# Proposta concreta — L3k-b0: calibração de pessoas e contratos

**Data:** 07/10/2026  
**Status:** aprovada para análise somente leitura; não autoriza implementação de L3k-b.

## Objetivo

Calibrar os valores propostos para pessoas e contratos de `voed`, `aether`, `edu`, `cyber`, `terra` e `sorgente` antes de gravá-los no catálogo. A análise usará os valores apresentados pelo Astra Médio apenas como cenários temporários, sem alterar JSON, runtime, save ou HTML.

## Riscos confirmados

- Em `voed`, o cenário inicial proposto soma 38 unidades de custos de pessoas e contratos; a contribuição neutra estimada pelo Astra é inferior a esse total antes das demais despesas.
- Em `edu`, a capacidade calculada pode aumentar, mas `activeBase` permanece limitada a `baseCapacity` (32). Assim, a equipe não amplia o teto da base recorrente no contrato atual.
- Os demais quatro modelos exigem conferência de caixa, recebíveis e reposição para que o custo fixo não seja aprovado somente por semelhança com perfis anteriores.

## Cenários temporários

Para cada ID, comparar 16 trimestres determinísticos em condições neutras:

1. operação-base, sem `brBusiness`;
2. equipe inicial e dois contratos selecionados;
3. equipe máxima e dois contratos selecionados;
4. equipe inicial sem contrato comercial;
5. equipe inicial sem contratos.

Os parâmetros temporários são os da resposta do Astra Médio: perfis de custo total 38 para `voed` e `edu`, 41 para `aether`, e 46 para `cyber`, `terra` e `sorgente`; o contrato comercial soma uma unidade inteira de demanda. Eles não são valores aprovados para implementação.

## Métricas obrigatórias

- caixa operacional acumulado, recebimentos e custos de caixa por trimestre;
- contribuição operacional antes e depois dos custos de pessoas e contratos;
- demanda, capacidade, unidades concluídas e demanda perdida;
- inventário, compras e perdas, quando aplicável;
- `activeBase`, entradas, saídas, uso e ociosidade para `edu`;
- trimestre de recuperação do custo do contrato comercial, se houver;
- comparação com a operação-base e com os limites de capacidade ativos.

## Critérios para L3k-b

1. Não aprovar valores que reduzam o caixa operacional acumulado em todos os cinco cenários sem oferecer efeito mensurável de capacidade ou demanda.
2. Em `edu`, não aprovar bônus de capacidade como benefício econômico enquanto o teto de `activeBase` permanecer 32; a proposta deve reduzi-lo a custo sem bônus, postergar sua ativação ou abrir um lote arquitetural separado para o teto de base.
3. Em `voed`, aprovar somente uma estrutura inicial que tenha caminho didático observável para recuperar custos com demanda, capacidade ou ambos.
4. Não modificar os parâmetros operacionais, BMC, pivôs, marcos, save ou decisões trimestrais nesta etapa.
5. Registrar tabelas e conclusões em relatório antes de solicitar aprovação de implementação.

## Saída esperada

Um relatório comparativo por ID, seguido de uma proposta L3k-b revisada que indique quais valores permanecem, quais são ajustados e quais devem ficar pendentes. A implementação só pode começar após aprovação explícita dessa proposta revisada.
