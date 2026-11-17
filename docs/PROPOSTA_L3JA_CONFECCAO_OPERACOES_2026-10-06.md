# Proposta L3j-a — Confecção (`cyber`)

**Data:** 06/10/2026  
**Status:** proposta de parâmetros para aprovação. Não aplicada ao catálogo, runtime ou HTML.

## Escopo e limites

Ativa somente `cyber` em `operations-v1`, reutilizando `manufacture_to_order` v2. As unidades são internas e agregadas. O caso não registra trabalhador, jornada, condição laboral, material específico, tamanho, coleção, fornecedor, origem de insumo, certificação ou alegação de sustentabilidade.

Os valores abaixo são parâmetros didáticos de simulação, não estimativas de preço, custo, produtividade ou margem de uma confecção real.

## Parâmetros candidatos

| Campo | Valor | Papel didático |
| --- | ---: | --- |
| `family` | `manufacture_to_order` | produção sob encomenda já suportada pelo runtime |
| `baseDemand` | 16 | procura agregada inicial por pedidos/peças |
| `baseCapacity` | 22 | limite produtivo agregado inicial |
| `unitPrice` | 4.1 | receita interna por unidade entregue |
| `unitVariableCost` | 1.45 | custo interno agregado por unidade produzida |
| `initialInventory` | 30 | disponibilidade inicial de insumos agregados |
| `targetInventory` | 44 | meta de reposição de insumos agregados |
| `receivableShare` | 0.26 | parcela agregada recebida posteriormente |

## Semântica no contrato v2

- `inventory`: insumos agregados disponíveis para produção;
- `completed`: unidades agregadas entregues;
- `losses`: refugo agregado da produção;
- `purchases` e `consumed`: reposição e uso agregado de insumos;
- `receivables`: parte agregada de receita ainda a receber.

O runtime existente limita a produção por procura, capacidade e insumos; aplica refugo agregado; repõe até a meta; e separa receita de caixa recebido. Não haverá estoque por produto, pedido ou cliente.

## BMC inicial candidato

- **Parceiros-chave:** fornecedores de insumos e serviços de manutenção do espaço.
- **Atividades-chave:** programação agregada, produção, revisão e entrega de pedidos.
- **Recursos-chave:** capacidade produtiva, insumos agregados e espaço de trabalho.
- **Proposta de valor:** pedidos de vestuário fictício produzidos com prazo acompanhado.
- **Relacionamento com clientes:** confirmação agregada de pedido e entrega, sem cadastro individual.
- **Canais:** atendimento comercial local e divulgação para compradores fictícios.
- **Segmentos de clientes:** varejistas e distribuidores fictícios de vestuário.
- **Estrutura de custos:** insumos, refugo, ocupação, capacidade e reposição agregados.
- **Fontes de receita:** pedidos agregados entregues.

## Marcos candidatos

| Etapa | Dificuldade | Nome | Prazo | Foco mínimo | Limiar operacional | Recompensa de valuation |
| --- | --- | --- | ---: | --- | ---: | ---: |
| m1 | conservadora | Primeiros pedidos produzidos | 8 | dev 40, mkt 15 | 22 | 200 |
| m1 | equilibrada | Fila produtiva organizada | 7 | dev 43, mkt 22 | 34 | 450 |
| m1 | ambiciosa | Capacidade de produção demonstrada | 6 | dev 46, mkt 28, hr 20 | 46 | 900 |
| m2 | conservadora | Refugo e prazo acompanhados | 7 | dev 55, hr 35 | 58 | 300 |
| m3 | conservadora | Produção sustentável | 6 | mkt 70, dev 68, hr 50 | 80 | 500 |

## BMC e pivôs candidatos

- **Marco 1:** programação agregada e capacidade produtiva registrada.
- **Marco 2:** revisão agregada, refugo acompanhado e confirmação de prazo.
- **Marco 3:** parcerias comerciais, pedidos recorrentes e fluxo consolidado.
- **Pivôs:** somente tipos genéricos existentes, com textos sobre público comprador, organização da produção, foco de linha e canal comercial. Sem referência a condições laborais, origem ou certificação.

## Critérios de aceite

- Apenas `cyber` passa a integrar `operations-v1`; `terra` e `sorgente` seguem desativados.
- Não há mudança em `operations-runtime.js`, no formato de save ou nos modelos v2/v3 existentes.
- Produção não excede procura, capacidade ou insumos; refugo não gera receita.
- BMC, marcos e pivôs do HTML gerado equivalem ao catálogo localizado.
- Testes cobrem parâmetros, limite de produção, refugo, recebíveis, restauração, isolamento e não ativação de `terra`/`sorgente`.
- Build, testes direcionados, `check_project.ps1` e revisão independente encerram o sublote.

## Alterações previstas se aprovada

1. Adicionar `cyber` a `locales/operating-models.pt-BR.json`.
2. Ampliar testes de operações e BMC para o novo modelo.
3. Atualizar apenas a descrição rastreável do build, se necessário.
4. Gerar o HTML por `npm run build` e revisar o diff.
