# Proposta L3j-b — Produtos de limpeza fictícios (`terra`)

**Data:** 06/10/2026  
**Status:** proposta de parâmetros para aprovação. Não aplicada ao catálogo, runtime ou HTML.

## Escopo e limites

Ativa somente `terra` em `operations-v1`, reutilizando `manufacture_to_order` v2. O cenário representa fornecimento fictício de itens de conservação para ambientes institucionais. Não representa fórmula, substância, dosagem, risco químico, desinfecção, esterilização, eficácia, segurança, certificação, conformidade ou aconselhamento de uso.

Todos os valores são unidades internas didáticas, sem relação com preço, custo, margem, capacidade ou condição comercial real.

## Parâmetros candidatos

| Campo | Valor | Papel didático |
| --- | ---: | --- |
| `family` | `manufacture_to_order` | produção sob encomenda já suportada |
| `baseDemand` | 14 | procura agregada inicial por pedidos institucionais fictícios |
| `baseCapacity` | 19 | limite produtivo agregado inicial |
| `unitPrice` | 4.6 | receita interna por pedido/unidade entregue |
| `unitVariableCost` | 1.7 | custo interno agregado por unidade produzida |
| `initialInventory` | 28 | disponibilidade inicial de insumos agregados |
| `targetInventory` | 40 | meta de reposição de insumos agregados |
| `receivableShare` | 0.3 | parcela agregada recebida posteriormente |

## Semântica no contrato v2

- `inventory`: insumos agregados disponíveis para pedidos fictícios;
- `completed`: pedidos/unidades agregados concluídos;
- `losses`: refugo agregado de produção;
- `purchases` e `consumed`: reposição e uso agregado;
- `receivables`: receita agregada ainda a receber.

O runtime já limita produção por procura, capacidade e insumos, aplica refugo agregado, repõe até a meta e separa receita de caixa recebido.

## BMC inicial candidato

- **Parceiros-chave:** fornecedores de insumos e serviços de manutenção do espaço.
- **Atividades-chave:** programação agregada, produção, revisão e entrega de pedidos fictícios.
- **Recursos-chave:** capacidade produtiva, insumos agregados e espaço de trabalho.
- **Proposta de valor:** fornecimento fictício de itens de conservação com prazo acompanhado.
- **Relacionamento com clientes:** confirmação agregada de pedido e entrega, sem cadastro individual.
- **Canais:** atendimento comercial local e divulgação para compradores institucionais fictícios.
- **Segmentos de clientes:** escritórios, condomínios e empresas fictícias que mantêm seus espaços.
- **Estrutura de custos:** insumos, refugo, ocupação, capacidade e reposição agregados.
- **Fontes de receita:** pedidos agregados entregues.

## Marcos candidatos

| Etapa | Dificuldade | Nome | Prazo | Foco mínimo | Limiar operacional | Recompensa de valuation |
| --- | --- | --- | ---: | --- | ---: | ---: |
| m1 | conservadora | Primeiros pedidos institucionais produzidos | 8 | dev 40, mkt 15 | 20 | 200 |
| m1 | equilibrada | Fila de pedidos organizada | 7 | dev 43, mkt 22 | 30 | 450 |
| m1 | ambiciosa | Capacidade de fornecimento demonstrada | 6 | dev 46, mkt 28, hr 20 | 42 | 900 |
| m2 | conservadora | Refugo e prazo acompanhados | 7 | dev 55, hr 35 | 54 | 300 |
| m3 | conservadora | Produção institucional sustentável | 6 | mkt 70, dev 68, hr 50 | 74 | 500 |

## BMC e pivôs candidatos

- **Marco 1:** programação agregada e capacidade registrada.
- **Marco 2:** revisão agregada, refugo acompanhado e confirmação de prazo.
- **Marco 3:** parcerias comerciais, pedidos recorrentes e fluxo consolidado.
- **Pivôs:** usam o formato `name`/`trigger`/`changes` e tratam de público comprador, organização produtiva, foco de fornecimento e canal comercial genéricos. Nenhum texto alega eficácia, desinfecção, proteção ou conformidade.

## Critérios de aceite

- Apenas `terra` passa a integrar `operations-v1`; `sorgente` segue desativada.
- Não há mudança em runtime, formato de save ou modelos v2/v3 existentes.
- Produção não excede procura, capacidade ou insumos; refugo não gera receita.
- BMC, marcos e pivôs do HTML gerado equivalem ao catálogo localizado e cada pivô é exercitado em teste.
- Testes cobrem parâmetros, limites, refugo, recebíveis, restauração e isolamento de `sorgente`.
- Build, testes direcionados, `check_project.ps1` e revisão independente encerram o sublote.

## Alterações previstas se aprovada

1. Adicionar `terra` a `locales/operating-models.pt-BR.json`.
2. Ampliar testes de operações e BMC.
3. Atualizar a descrição rastreável do build.
4. Gerar `index.html` por `npm run build` e revisar o diff.
