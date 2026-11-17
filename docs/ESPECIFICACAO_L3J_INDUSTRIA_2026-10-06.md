# Especificação proposta L3j — operações industriais restantes

**Data:** 06/10/2026  
**Status:** planejamento técnico. Não autoriza alterações de runtime, fórmulas, parâmetros, salvamento, BMC, pivôs, eventos ou modelos localizados.

## Escopo

Este lote planeja a futura adaptação operacional de:

- `cyber` — Confecção;
- `terra` — Produtos de limpeza fictícios para conservação;
- `sorgente` — Alimentos congelados fictícios.

Os três casos são industriais, mas não devem receber a mesma semântica sem distinguir produção sob encomenda, produção para estoque e limites de conteúdo.

## Limites de conteúdo

- `cyber` não representa pessoa trabalhadora identificável, jornada, condição de trabalho, origem de tecido, certificação ou alegação de sustentabilidade.
- `terra` não representa fórmula, substância, risco químico, desinfecção, esterilização, eficácia, conformidade ou aconselhamento de segurança.
- `sorgente` não representa ingrediente, validade, cadeia de frio, alérgeno, informação nutricional, segurança alimentar, dieta, conservação ou alegação de saúde.
- Nenhum modelo registra cliente, pedido individual, fornecedor, rota, lote, pagamento individual ou informação regulada.

Todos os indicadores devem usar unidades internas agregadas de simulação.

## Mapeamento de famílias candidatas

| Empreendimento | Família candidata | Unidade agregada | Estoque | Perda/refugo |
| --- | --- | --- | --- | --- |
| `cyber` | `manufacture_to_order` v2 | peças/pedidos agregados entregues | insumos agregados | refugo de produção |
| `terra` | `manufacture_to_order` v2 | pedidos agregados atendidos | insumos e itens prontos agregados | refugo agregado de produção |
| `sorgente` | requer decisão entre `manufacture_to_order` e nova variante | unidades preparadas agregadas | produção disponível agregada | perda agregada sem explicação sanitária |

`cyber` e `terra` são compatíveis, em princípio, com a família já existente `manufacture_to_order`: ela limita unidades por demanda, capacidade e disponibilidade; registra refugo agregado, reposição e recebíveis. `sorgente` precisa de decisão adicional, pois sua proposta pedagógica pode exigir perda residual de itens prontos, comportamento que a família atual não expressa fora da etapa de produção.

## L3j-a — Confecção (`cyber`)

### Semântica proposta

- `inventory`: insumos agregados disponíveis para a produção;
- `completed`: peças ou pedidos agregados concluídos;
- `losses`: refugo agregado de produção;
- `purchases` e `consumed`: reposição e uso agregado de insumos;
- `receivables`: receita agregada ainda a receber.

### Requisitos

- Não apresentar tamanhos, coleções, trabalhadores, materiais específicos, cadeia de fornecimento ou certificações.
- BMC e marcos tratam de fila produtiva, revisão agregada, refugo, entrega e capacidade.
- Os pivôs usam somente público, problema, organização produtiva, foco de linha e canal comercial genéricos.

## L3j-b — Produtos de limpeza fictícios (`terra`)

### Semântica proposta

- `inventory`: insumos e disponibilidade agregada para pedidos institucionais fictícios;
- `completed`: pedidos agregados concluídos;
- `losses`: refugo agregado, sem causa química ou sanitária;
- `purchases` e `consumed`: reposição e uso agregado;
- `receivables`: receita agregada de pedidos concluídos.

### Requisitos

- Toda a linguagem deve falar em conservação e fornecimento institucional fictício.
- Não usar verbos ou alegações de desinfetar, esterilizar, eliminar, proteger, certificar ou garantir resultado.
- BMC e marcos tratam de produção, prazo, refugo, capacidade e recebimento, sem formulação ou conformidade.

## L3j-c — Alimentos congelados fictícios (`sorgente`)

### Decisão pendente

Há duas alternativas possíveis:

1. **Reusar `manufacture_to_order` v2:** unidades representam pedidos agregados produzidos e entregues; o refugo ocorre somente na produção. É o caminho de menor alteração técnica.
2. **Criar uma variante explícita de produção para disponibilidade:** unidades prontas remanescentes podem gerar perda agregada. Exige contrato e testes próprios antes de qualquer implementação.

A recomendação inicial é concluir `cyber` e `terra` primeiro e decidir `sorgente` após observar os resultados desses dois modelos. Isso evita introduzir uma terceira variante operacional sem necessidade comprovada.

## Ordem recomendada

1. Elaborar e aprovar os parâmetros didáticos, BMC, marcos e testes de `cyber`.
2. Implementar `cyber` usando `manufacture_to_order` v2 e validar isolamento.
3. Elaborar e implementar `terra` com os mesmos limites de família, mas conteúdo próprio.
4. Decidir a família de `sorgente` em documento específico, com justificativa de estado e perda agregada.

## Critérios transversais de aceite

- Nenhum ID técnico, regra de save anterior ou modelo ativo fora do lote muda sem justificativa aprovada.
- Reutilização de `manufacture_to_order` não altera o runtime, somente catálogo localizado e testes.
- Todo parâmetro econômico fica visível em proposta revisável antes do JSON.
- O build injeta BMC e marcos por ID e os testes comparam JSON e HTML gerado.
- Testes cobrem demanda, capacidade, estoque, refugo, reposição, recebíveis, restauração, determinismo, isolamento e desligamento.
- `npm run build`, testes direcionados, `check_project.ps1` e revisão independente encerram cada sublote.
