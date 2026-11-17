# Proposta L3i-a — parâmetros didáticos do Restaurante por quilo (`voed`)

**Data:** 06/10/2026  
**Status:** proposta concreta para aprovação. Não aplicada ao código, ao JSON ou ao salvamento.

## Escopo

Esta proposta ativa somente `operations-v1` para `voed`, preservando o contrato `brOperations` versão 2 e o runtime existente. Não abrange clínica (`aether`), academia (`edu`), os negócios industriais, eventos, financiamento, Ada ou importação.

Os números abaixo são unidades internas de simulação. Não representam preço de refeição, margem, custo, oferta comercial ou dados de um estabelecimento real.

## Escolha técnica

`family` proposta: `retail_inventory`.

O nome é técnico e não será apresentado como descrição do restaurante. Ele permite reutilizar, sem alteração do runtime, o comportamento já testado de unidades disponíveis, perda residual, reposição, custo de reposição e recebíveis. Na interface, as unidades serão chamadas de porções preparadas, vendas, descarte e reposição de insumos.

| Campo | Valor proposto | Papel didático |
| --- | ---: | --- |
| `baseDemand` | 22 | Procura inicial por porções no trimestre de simulação |
| `baseCapacity` | 30 | Limite operacional inicial de atendimento e venda |
| `unitPrice` | 2.2 | Receita interna por porção vendida |
| `unitVariableCost` | 1.05 | Custo interno por porção preparada/vendida, usado pelo runtime para consumo e reposição |
| `initialInventory` | 38 | Porções disponíveis no início da primeira rodada |
| `targetInventory` | 52 | Meta de porções após a reposição do período |
| `receivableShare` | 0.06 | Parte agregada da receita recebida em período posterior |

A ordem de grandeza deixa capacidade acima da procura inicial, mas não elimina os efeitos de marketing, decisões, pivôs e variação já presentes no motor. Também cria disponibilidade residual que pode gerar descarte, tornando visível o custo de preparar além da venda.

## Regras que o runtime aplicará sem alteração

Para cada trimestre, usando os termos já aplicáveis a todos os modelos:

1. Demanda = `floor((baseDemand + floor(mkt / 10)) × conversão × efeitos de pivô × efeitos de decisão)`.
2. Capacidade = `floor((baseCapacity + floor(dev / 12) + floor(hr / 20)) × efeitos de pivô × efeitos de decisão)`.
3. Vendas = menor valor entre demanda, capacidade e porções disponíveis.
4. Descarte = pequena fração das porções restantes, segundo a regra existente de `retail_inventory` e o efeito de qualidade.
5. Reposição = diferença entre o estoque final e a meta de porções, respeitando o efeito de decisão de inventário.
6. Receita, custo, recebimento diferido e caixa usam a mesma contabilidade agregada já validada pelo motor.

Não haverá itens de cardápio, ingredientes, clientes, pedidos, pagamentos individuais, dados nutricionais, informação sanitária ou alegações de saúde.

## Conteúdo localizado proposto

### Rótulo e BMC inicial

- **Rótulo do modelo:** `Restaurante por quilo com preparo diário`.
- **Parceiros-chave:** fornecedores de insumos e serviços de apoio locais.
- **Atividades-chave:** preparo agregado, organização do bufê, atendimento e controle de desperdício.
- **Recursos-chave:** cozinha, bufê, capacidade de atendimento e porções preparadas.
- **Proposta de valor:** refeição prática com atendimento organizado no horário de maior fluxo.
- **Relacionamento com clientes:** atendimento ágil e acompanhamento agregado da experiência no salão.
- **Canais:** salão do restaurante e divulgação local.
- **Segmentos de clientes:** trabalhadores e moradores que buscam refeição prática na região.
- **Estrutura de custos:** insumos agregados, preparo, desperdício, ocupação e reposição.
- **Fontes de receita:** venda de refeições por peso, em valor agregado.

### Atualizações de BMC por marco

| Marco | Atualizações propostas |
| --- | --- |
| 1 | rotina de preparo e controle agregado de desperdício; disponibilidade do bufê acompanhada |
| 2 | capacidade de atendimento organizada; retorno de público acompanhado de forma agregada; reposição planejada |
| 3 | parcerias locais; demanda recorrente em horário comercial; fluxo operacional consolidado |

### Efeitos de pivô

A proposta mantém somente os tipos de pivô genéricos já suportados pelo runtime. Seus textos de BMC seriam localizados para o contexto de refeições, sem alterar multiplicadores ou criar eventos:

- cliente: novo segmento local e divulgação direcionada;
- problema: foco em agilidade e previsibilidade no horário de maior fluxo;
- tecnologia: organização do preparo e do controle de desperdício;
- nicho: oferta focada em um público local;
- pivô genérico: canal local alternativo de atendimento.

## Marcos propostos

Os requisitos de métricas do jogo seguem o padrão didático dos demais modelos. O limiar operacional sempre é total acumulado de porções vendidas; não mede indivíduos nem transações identificáveis.

| Etapa | Dificuldade | Nome | Prazo | Foco mínimo | Limiar operacional | Recompensa de valuation |
| --- | --- | --- | ---: | --- | ---: | ---: |
| m1 | conservadora | Primeiro fluxo de almoço organizado | 8 | dev 40, mkt 15 | 32 | 200 |
| m1 | equilibrada | Bufê com desperdício acompanhado | 7 | dev 43, mkt 22 | 46 | 450 |
| m1 | ambiciosa | Capacidade de atendimento demonstrada | 6 | dev 46, mkt 28, hr 20 | 60 | 900 |
| m2 | conservadora | Reposição e descarte controlados | 7 | dev 55, hr 35 | 74 | 300 |
| m3 | conservadora | Operação de refeições sustentável | 6 | mkt 70, dev 68, hr 50 | 100 | 500 |

Descrições de marco propostas:

- m1: atender porções sem ultrapassar a capacidade ou a disponibilidade preparada;
- m2: conciliar venda, reposição e desperdício agregado;
- m3: sustentar atendimento, reposição e caixa operacional.

## Critérios de aceite da implementação

- `operations.enabled(game('voed'))` passa a retornar `true`; os demais empreendimentos ainda não incluídos permanecem desativados.
- `init`, `advance`, `save`, `validate` e `restore` usam o contrato v2 existente, sem campo novo e sem migração.
- Inventário nunca fica negativo; vendas não excedem demanda, capacidade ou disponibilidade.
- Há descarte somente de porções remanescentes, sem receita associada.
- Os textos do empreendimento usam porções, preparo, venda, descarte e reposição; a palavra `inventory` não aparece na apresentação.
- O BMC e as opções de marco são exclusivos de `voed` e preservam o funcionamento dos seis modelos já ativos.
- Os testes cobrem determinismo, restauração, recebíveis, limite de venda, descarte, progresso de marco, isolamento e compatibilidade de salvamento anterior.
- `npm run build`, os testes direcionados e `check_project.ps1` passam antes de encerrar o lote.

## Alterações previstas, se aprovada

1. Adicionar o objeto `voed` em `locales/operating-models.pt-BR.json` com o conteúdo desta proposta.
2. Ampliar os testes de operações e, se necessário, os testes de apresentação localizada.
3. Atualizar `tools/build.cjs` somente se a injeção do modelo exigir uma transformação rastreável.
4. Executar build, testes e revisão independente conforme `AGENTS.md`.

A implementação não deve começar com valores diferentes dos listados sem uma nova proposta explícita.
