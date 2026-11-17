# Especificação proposta L3i — operações de serviços

**Data:** 06/10/2026  
**Status:** planejamento técnico; não autoriza alteração de dados, fórmulas, economia ou formato de salvamento.

## Objetivo

Definir uma sequência segura para levar operações aos empreendimentos de serviços ainda sem `operations-v1`:

- `voed` — Restaurante por quilo;
- `aether` — Clínica popular fictícia;
- `edu` — Academia.

O lote não deve ser implementado como uma única família técnica. Embora os três negócios vendam serviços, seus ciclos operacionais e seus estados persistentes são distintos.

## Conclusão de arquitetura

O contrato atual `brOperations` versão 2 descreve bem um fluxo discreto de capacidade, unidades disponíveis, demanda atendida, perdas e recebíveis. Ele pode acomodar o restaurante desde que as unidades sejam tratadas como porções agregadas. Não descreve, por si só, serviços que dependem de agenda recorrente ou de base ativa de membros.

A proposta é dividir L3i em três sublotes:

| Sublote | Empreendimento | Contrato proposto | Situação |
| --- | --- | --- | --- |
| L3i-a | `voed` | Reutilizar `brOperations` v2, com semântica de porções preparadas | Pode seguir para parâmetros didáticos aprováveis |
| L3i-b | `aether` | Especificar extensão versionada para capacidade de atendimento agregada | Requer desenho do contrato antes de implementar |
| L3i-c | `edu` | Especificar extensão versionada para membros ativos e recorrência agregada | Requer desenho do contrato antes de implementar |

Nenhum sublote altera IDs, mercados, pivôs, eventos, BMC ou dados de origem sem escopo próprio aprovado.

## L3i-a — Restaurante por quilo (`voed`)

### Modelo conceitual

O modelo representa produção e venda diária de porções, sem registrar itens de cardápio, fornecedores, clientes, meios de pagamento ou dados pessoais.

No contrato já existente, os campos têm esta semântica específica:

| Campo atual | Semântica em `voed` |
| --- | --- |
| `inventory` | Porções preparadas e disponíveis para venda, em valor agregado |
| `completed` | Porções vendidas no período |
| `lostDemand` | Procura não atendida por capacidade ou porções insuficientes |
| `losses` | Porções preparadas que não foram vendidas e são descartadas no fechamento operacional |
| `purchases` | Reposição agregada de insumos operacionais para preparar novas porções |
| `consumed` | Insumos agregados empregados na preparação |
| `receivables` | Parcela agregada de vendas ainda a receber, se o parâmetro aprovado a utilizar |

A interface deve usar termos próprios do restaurante; os nomes técnicos do estado não podem aparecer como vocabulário do usuário.

### Invariantes

- Não vender mais porções do que a capacidade e a disponibilidade permitem.
- Tratar descarte como perda operacional sem gerar receita.
- Não apresentar alimentos, ingredientes, validade, procedência, informação nutricional ou alegações sanitárias.
- Não registrar clientes, pedidos individuais, horários ou formas de pagamento.
- Preservar o formato de salvamento v2 e a leitura de estados anteriores.
- Associar todos os efeitos a parâmetros visíveis no modelo localizado, jamais a constantes ocultas no runtime.

### Itens que ainda exigem escopo aprovado

- Valores e fórmulas de demanda, capacidade, preparo, descarte, custos, recebimento e metas.
- Marcos operacionais e seu vínculo com BMC, contratos, decisões e efeito de pivôs.
- Texto de interface e cartões de diagnóstico.

## L3i-b — Clínica popular fictícia (`aether`)

### Limite de representação

O simulador só pode representar capacidade agregada de atendimento. É vedado registrar ou inferir paciente, profissional individual, agenda nominativa, diagnóstico, sintoma, tratamento, resultado clínico, prescrição, prontuário, convênio real ou aconselhamento de saúde.

### Lacuna do contrato atual

A unidade vendida é um atendimento em horário disponível; não é estoque físico nem produto preparado. Forçar essa realidade no campo `inventory` tornaria o salvamento e os indicadores ambíguos.

Antes de implementar, a especificação de extensão deve definir:

- unidade agregada de capacidade e atendimento concluído;
- tratamento de ausência, ociosidade e procura não atendida;
- recebimento agregado, sem meios de pagamento nem dados individuais;
- compatibilidade explícita com `brOperations` v2 e migração versionada, se houver novo estado;
- como o runtime diferencia famílias sem inferir pelo ID do empreendimento.

Não há aprovação para criar esses campos, uma versão nova de salvamento ou parâmetros econômicos nesta etapa.

## L3i-c — Academia (`edu`)

### Limite de representação

O simulador só pode apresentar ocupação e continuidade em nível agregado. Não pode registrar pessoa matriculada, treino individual, biometria, medidas corporais, condição de saúde, frequência identificável ou recomendação física/medicinal.

### Lacuna do contrato atual

Receita e capacidade dependem de uma base ativa que se mantém, cresce ou se reduz ao longo de períodos. `completed` e `receivables` do contrato v2 não distinguem venda pontual de relacionamento recorrente.

Antes de implementar, a especificação de extensão deve definir:

- quantidade agregada de membros ativos e vagas disponíveis;
- entrada, saída e renovação agregadas;
- atendimento/ocupação como indicador separado de membros, quando necessário;
- recebimento recorrente agregado e sua separação de cobrança individual;
- compatibilidade versionada e leitura integral de salvamentos v2.

Não há aprovação para introduzir essa persistência, fórmulas ou parâmetros nesta etapa.

## Requisitos transversais

- Manter `operations-v1` como opt-in explícito no modelo localizado; não inferir ativação por ID, mercado ou texto.
- Tratar identificadores de empreendimento e de mercado como imutáveis.
- Não reativar mercados SaaS/tecnologia, mecanismos de equity, eventos de captação ou fluxos reais regulados.
- Não modificar `source-original.html`; toda mudança aprovada deve ser transformada em `tools/build.cjs` e refletida por `npm run build`.
- Cobrir persistência, restauração, determinismo, isolamento entre empreendimentos e ausência de efeito quando o recurso estiver desativado.
- Antes de código, produzir proposta específica com parâmetros visíveis, fórmulas, marcos, textos de interface e testes de aceitação.

## Ordem recomendada

1. Aprovar parâmetros didáticos e critérios de aceitação de L3i-a (`voed`).
2. Implementar L3i-a preservando o contrato v2, com testes direcionados e revisão independente.
3. Elaborar uma especificação de contrato versionado comum para L3i-b e L3i-c, caso a análise confirme que os dois compartilham estado suficiente.
4. Só então definir parâmetros e implementar `aether` e `edu` separadamente ou sob uma extensão comum aprovada.

## Critérios de aceite para a próxima proposta de L3i-a

- Explicar todas as unidades e variáveis em termos de porções agregadas.
- Listar valores e fórmulas em uma tabela revisável, sem números ocultos.
- Demonstrar que venda, preparo, perda, custo e recebimento fecham no ledger do período.
- Demonstrar que o salvamento v2 continua válido e que o estado é independente de outros empreendimentos.
- Incluir testes de limite de capacidade, descarte, procura não atendida, restauração e desligamento de `operations-v1`.
