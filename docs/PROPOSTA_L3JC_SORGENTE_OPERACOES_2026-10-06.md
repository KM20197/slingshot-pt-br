# Decisão e proposta L3j-c — Alimentos congelados fictícios (`sorgente`)

**Data:** 06/10/2026  
**Status:** implementada após aprovação em 06/10/2026. O catálogo e o HTML foram gerados e validados; não houve mudança de runtime ou formato de salvamento.

## Limites de conteúdo

O cenário é fictício e usa somente unidades internas agregadas. Não pode registrar ou alegar ingrediente, receita, validade, cadeia de frio, temperatura, alergênico, nutrição, dieta, conservação, segurança alimentar, resultado de saúde, certificação ou conformidade.

## Alternativas avaliadas

| Alternativa | Vantagem | Limite | Decisão |
| --- | --- | --- | --- |
| Reusar `manufacture_to_order` v2 | Mantém runtime, save e testes já validados; representa pedidos agregados produzidos e entregues | Refugo ocorre na produção, não como perda residual de produto pronto | **Recomendada** |
| Criar variante de produção disponível | Poderia exibir perda residual agregada | Exige novo contrato, save, validação e testes sem necessidade pedagógica comprovada | Adiada |

A recomendação é usar `manufacture_to_order` v2. O refugo agregado já torna visível que parte da produção não se converte em unidade entregue, sem criar uma mecânica que sugira validade, armazenamento ou condição sanitária.

## Parâmetros implementados

| Campo | Valor | Papel didático |
| --- | ---: | --- |
| `family` | `manufacture_to_order` | produção por pedido já suportada |
| `baseDemand` | 17 | procura agregada inicial por pedidos fictícios |
| `baseCapacity` | 23 | limite produtivo agregado inicial |
| `unitPrice` | 3.7 | receita interna por unidade entregue |
| `unitVariableCost` | 1.3 | custo interno agregado por unidade produzida |
| `initialInventory` | 32 | disponibilidade inicial de insumos agregados |
| `targetInventory` | 46 | meta de reposição de insumos agregados |
| `receivableShare` | 0.22 | parcela agregada recebida posteriormente |

Os valores são unidades internas didáticas e não representam preço, custo, produtividade ou margem de uma fábrica real.

## Semântica no contrato v2

- `inventory`: insumos agregados disponíveis para produção;
- `completed`: unidades agregadas entregues;
- `losses`: refugo agregado de produção, sem causa ou condição alimentar especificada;
- `purchases` e `consumed`: reposição e uso agregado;
- `receivables`: receita agregada ainda a receber.

Não haverá estoque de produto pronto, lote, varejista, pedido individual, fornecedor, rota ou informação de conservação.

## BMC inicial candidato

- **Parceiros-chave:** fornecedores de insumos e serviços de manutenção do espaço.
- **Atividades-chave:** programação agregada, produção, revisão e entrega de pedidos fictícios.
- **Recursos-chave:** capacidade produtiva, insumos agregados e espaço de trabalho.
- **Proposta de valor:** pedidos fictícios de conveniência alimentar produzidos com prazo acompanhado.
- **Relacionamento com clientes:** confirmação agregada de pedido e entrega, sem cadastro individual.
- **Canais:** atendimento comercial local e divulgação para pontos fictícios de venda.
- **Segmentos de clientes:** famílias e pontos de venda fictícios que buscam conveniência alimentar.
- **Estrutura de custos:** insumos, refugo, ocupação, capacidade e reposição agregados.
- **Fontes de receita:** pedidos agregados entregues.

## Marcos candidatos

| Etapa | Dificuldade | Nome | Prazo | Foco mínimo | Limiar operacional | Recompensa de valuation |
| --- | --- | --- | ---: | --- | ---: | ---: |
| m1 | conservadora | Primeiros pedidos produzidos | 8 | dev 40, mkt 15 | 24 | 200 |
| m1 | equilibrada | Fila produtiva organizada | 7 | dev 43, mkt 22 | 36 | 450 |
| m1 | ambiciosa | Capacidade de produção demonstrada | 6 | dev 46, mkt 28, hr 20 | 48 | 900 |
| m2 | conservadora | Refugo e prazo acompanhados | 7 | dev 55, hr 35 | 62 | 300 |
| m3 | conservadora | Produção sustentável | 6 | mkt 70, dev 68, hr 50 | 84 | 500 |

## BMC e pivôs candidatos

Todos os pivôs usam o formato `name`/`trigger`/`changes`. Os textos tratam de público comprador, organização de produção, foco de fornecimento e canal comercial. Não abordam conservação, temperatura, nutrição, segurança ou saúde.

## Critérios de aceite

- `sorgente` é o último empreendimento a integrar `operations-v1`; não há mudança de runtime, save ou contratos v2/v3.
- Produção não excede procura, capacidade ou insumos; refugo não gera receita.
- O teste força refugo positivo e comprova a redução de estoque e a receita apenas de unidades entregues.
- O teste cobre recebível diferido, restauração e avanço determinístico.
- Os cinco pivôs de BMC são exercitados e comparados ao catálogo.
- Build, testes direcionados, `check_project.ps1` e revisão independente encerram o sublote.

## Alterações aplicadas

1. Adicionar `sorgente` ao catálogo localizado com a família v2 existente.
2. Ampliar testes de operações e BMC.
3. Atualizar a descrição rastreável do build.
4. Gerar `index.html` exclusivamente por `npm run build`.
