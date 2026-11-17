# Planejamento L3i/L3j — operações dos seis empreendimentos restantes

## Estado

`operations-v1` já cobre `avam`, `dream`, `quant`, `vanguard`, `legal` e `arene`.
Os seis IDs restantes ainda percorrem o motor legado e, por isso, não devem receber
somente troca de textos.

## Agrupamento proposto

| Lote | IDs | Casos visíveis | Núcleo operacional necessário |
|---|---|---|---|
| L3i — serviços | `aether`, `edu`, `voed` | Clínica popular, academia, restaurante por quilo | Capacidade por período, demanda atendida, faltas ou desperdício agregado quando aplicável, recebíveis e custos operacionais. |
| L3j — indústria | `cyber`, `terra`, `sorgente` | Confecção, produtos de limpeza, alimentos congelados | Insumos, produção, perdas agregadas, pedidos/recebíveis, capacidade e custos operacionais. |

## Limites

- Preservar IDs técnicos e a fonte original.
- Não usar dados reais de pacientes, prontuários, prescrição, medicamentos ou alegações clínicas.
- Tratar alimentos congelados e produtos de limpeza como casos didáticos fictícios, sem alegações sanitárias, regulatórias ou de eficácia.
- Não definir preços, margens, salários, juros, crédito ou parâmetros reais sem proposta específica aprovada.
- Não reativar mercados, concorrentes, eventos SaaS, diluição, captação societária ou receita SaaS.

## Ordem de implementação proposta

1. L3i: definir somente o contrato de estado e as invariantes compartilhadas para serviços; modelar cada caso por catálogo, sem alterar os seis IDs restantes ainda não incluídos.
2. Validar caixa, capacidade, marcos, salvamento e retomada dos três serviços.
3. L3j: reaproveitar o contrato de inventário e recebíveis já testado em `operations-v1`, com catálogos específicos para as três indústrias.
4. Adaptar BMC, pivôs e decisões operacionais apenas junto do lote correspondente.

## Critérios de aceite por lote

- O estado operacional é validado antes da restauração e rejeita IDs, família, números ou recebíveis inválidos.
- O caixa recebe somente a contribuição operacional calculada; estoque e capacidade não geram receita duplicada.
- As metas exigem os limites do motor e o trabalho operacional configurado.
- Decisões não criam empregados, AP, clientes SaaS, crédito ou participação societária.
- `source/index.original.html`, saves legados e os empreendimentos fora do lote permanecem preservados.
- Build, testes específicos, `check_project.ps1` e revisão independente atingem a nota mínima de 9/10.

## Decisão ainda necessária

Este planejamento não aprova fórmulas, números nem formato novo de save. Antes da
implementação L3i, aprovar a especificação do estado operacional de serviços e seus
parâmetros didáticos.
