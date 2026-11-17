# Relatório L3k-b0 — calibração de pessoas e contratos

> **Retificação de 07/10/2026:** a tabela e as conclusões abaixo são um registro histórico **inválido para decisão**. O laço de simulação incrementou `turn` duas vezes e executou somente oito avanços (trimestres ímpares de 1 a 15). O cenário de equipe máxima não incluiu o custo adicional dos três integrantes. A análise também não modelou o caixa inicial, as demais despesas da partida nem obrigações financeiras. Reexecutar L3k-b0 corretamente antes de aprovar ou rejeitar valores. O limite `edu.activeBase <= baseCapacity` permanece confirmado diretamente no runtime.

## Método

Foram simulados 16 trimestres determinísticos, com métricas técnicas neutras e os valores temporários propostos pelo Astra Médio. Nenhum arquivo de catálogo, runtime, save ou HTML foi alterado. O fluxo considera `cashDelta` operacional menos os custos trimestrais temporários de pessoas e contratos.

## Resultado principal

Os valores não são aprovados para L3k-b. Em todos os seis casos, a equipe máxima produziu as mesmas unidades do cenário inicial porque a demanda ou a base recorrente já limitava a operação. Assim, o custo marginal não cria benefício observável.

| ID | Caixa operacional-base | Inicial + contratos | Máximo + contratos | Unidades-base / inicial | Decisão |
| --- | ---: | ---: | ---: | ---: | --- |
| `voed` | 183 | -113 | -113 | 176 / 184 | Recalibrar |
| `aether` | 309 | -4 | -4 | 144 / 152 | Recalibrar |
| `edu` | 379 | 75 | 75 | 206 / 206 | Não usar bônus de capacidade atual |
| `cyber` | 279 | -77 | -77 | 124 / 130 | Recalibrar |
| `terra` | 260 | -86 | -86 | 108 / 116 | Recalibrar |
| `sorgente` | 261 | -92 | -92 | 129 / 137 | Recalibrar |

Nos cenários sem contrato comercial, as unidades retornaram ao nível-base. O bônus de demanda de uma unidade teve efeito pequeno, incapaz de compensar os custos propostos. Em `edu`, a capacidade passou de 32 para 48, mas a base ativa permaneceu em 30; o teto de `activeBase` impede ganho de unidades.

## Recomendação

Não implementar L3k-b com a estrutura de custos proposta. Antes de nova proposta, escolher uma destas abordagens:

1. **Equipe sem custo e sem bônus nesta fase:** ativar somente os rótulos e o save não é recomendável, pois criaria controles sem decisão econômica.
2. **Reduzir custos e ligar cada bônus a gargalo real:** exige uma nova proposta de valores, ainda sem mudar a fórmula de operações.
3. **Rever o modelo de pessoas por família:** para `edu`, qualquer bônus de capacidade requer separar ou elevar o teto da base ativa; isso é uma alteração de arquitetura e deve ser um lote próprio.

O caminho recomendado é o 2 para `voed`, `aether`, `cyber`, `terra` e `sorgente`, e o 3 para `edu`.
