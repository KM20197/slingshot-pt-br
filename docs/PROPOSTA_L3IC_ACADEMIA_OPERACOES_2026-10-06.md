# Proposta L3i-c — Academia (`edu`)

**Data:** 06/10/2026  
**Status:** proposta de parâmetros e extensão controlada do contrato v3. Não implementada; não aprova dados individuais, fórmulas ocultas, eventos, pivôs ou decisões operacionais adicionais.

## Escopo e limites

Ativa somente `edu` após estender o contrato `operations-v2-service` com uma variante explícita de associação recorrente. A representação é inteiramente agregada por trimestre.

É proibido armazenar ou inferir matrícula individual, nome, contato, idade, frequência identificável, treino, biometria, medida corporal, condição de saúde, recomendação física, resultado de condicionamento ou meio de pagamento individual.

Os valores abaixo são unidades internas didáticas; não representam mensalidade, salário, custo, retenção ou desempenho de uma academia real.

## Variante proposta do contrato v3

`edu` declarará:

```json
{
  "stateVersion": 3,
  "engine": "operations-v2-service",
  "family": "service_recurring",
  "serviceMode": "aggregate_membership"
}
```

O ramo v3 continuará a escolher a forma de `service` por `serviceMode`, nunca pelo ID da empresa:

| `serviceMode` | Campos permitidos em `service` |
| --- | --- |
| `aggregate_attendance` | `capacity`, `usedCapacity`, `idleCapacity` |
| `aggregate_membership` | `capacity`, `usedCapacity`, `idleCapacity`, `activeBase`, `entries`, `exits` |

Assim, `aether` permanece estrito e não aceita base ativa; `edu` não pode receber campo clínico, inventário ou chave arbitrária.

## Parâmetros candidatos

```json
{
  "baseDemand": 20,
  "baseCapacity": 32,
  "initialActiveBase": 18,
  "entryRate": 0.16,
  "exitRate": 0.08,
  "unitPrice": 2.6,
  "unitVariableCost": 0.72,
  "receivableShare": 0.1
}
```

| Parâmetro | Papel didático |
| --- | --- |
| `baseDemand` | procura agregada por novas adesões no período |
| `baseCapacity` | limite agregado de uso da estrutura no período |
| `initialActiveBase` | membros ativos agregados no início da simulação |
| `entryRate` | fração didática máxima de procura convertida em entradas agregadas |
| `exitRate` | fração didática da base que deixa de permanecer ativa no período |
| `unitPrice` | receita interna por membro ativo agregado no período |
| `unitVariableCost` | custo interno por uso agregado concluído |
| `receivableShare` | parcela agregada de receita que entra no período seguinte |

## Regras candidatas por trimestre

1. Procura por novas adesões é calculada de modo determinístico a partir de `baseDemand`, métricas, pivôs e decisões aprovadas.
2. Entradas agregadas não excedem a procura nem as vagas disponíveis da base ativa.
3. Saídas agregadas são calculadas sobre a base ativa de abertura segundo `exitRate` e efeitos explicitamente aprovados.
4. `activeBase` final = `activeBase` inicial + `entries` − `exits`.
5. Uso agregado é limitado pelo menor valor entre capacidade e base ativa final; `idleCapacity` é a diferença.
6. Receita interna é calculada sobre a base ativa final, uma única vez por período; custo variável é calculado sobre o uso agregado.
7. Não há estoque, reposição, descarte de material, presença individual ou cobrança individual.

A fórmula final deve ser escrita no runtime e testada exatamente como aprovada; não pode ser complementada por constantes ocultas.

## BMC inicial candidato

- **Parceiros-chave:** fornecedores de manutenção, limpeza e apoio do espaço.
- **Atividades-chave:** organização agregada da capacidade, conservação do espaço e acompanhamento da continuidade de membros em nível agregado.
- **Recursos-chave:** estrutura de exercícios, capacidade de uso e base ativa agregada.
- **Proposta de valor:** espaço de condicionamento para adultos com capacidade organizada ao longo do período.
- **Relacionamento com clientes:** comunicação geral de continuidade e uso do espaço, sem perfil individual.
- **Canais:** unidade local e divulgação de bairro.
- **Segmentos de clientes:** adultos da região interessados em rotina de condicionamento.
- **Estrutura de custos:** manutenção, ocupação, apoio operacional e capacidade agregada.
- **Fontes de receita:** mensalidades agregadas de membros ativos.

## Marcos candidatos

| Etapa | Dificuldade | Nome | Prazo | Foco mínimo | Limiar operacional | Recompensa de valuation |
| --- | --- | --- | ---: | --- | ---: | ---: |
| m1 | conservadora | Base ativa organizada | 8 | dev 40, mkt 15 | 30 | 200 |
| m1 | equilibrada | Capacidade de uso acompanhada | 7 | dev 43, mkt 22 | 44 | 450 |
| m1 | ambiciosa | Continuidade agregada demonstrada | 6 | dev 46, mkt 28, hr 20 | 58 | 900 |
| m2 | conservadora | Uso e continuidade equilibrados | 7 | dev 55, hr 35 | 74 | 300 |
| m3 | conservadora | Operação de condicionamento sustentável | 6 | mkt 70, dev 68, hr 50 | 98 | 500 |

O limiar operacional mede uso agregado acumulado; não mede pessoas, presenças ou atividades individuais.

## BMC e pivôs candidatos

- **Marco 1:** rotina de continuidade agregada e capacidade de uso acompanhada.
- **Marco 2:** organização do espaço e comunicação geral de continuidade.
- **Marco 3:** fluxo operacional consolidado, divulgação local e base recorrente agregada.
- **Pivôs:** somente textos genéricos sobre público, organização de capacidade e canal local. Sem programas de treino, resultados físicos, aconselhamento ou dados de saúde.

## Critérios de aceite da futura implementação

- `edu` é o único novo modelo com `serviceMode: aggregate_membership`.
- `aether` preserva exatamente os três campos atuais de `aggregate_attendance`.
- O estado de `edu.service` aceita exatamente seis chaves aprovadas.
- A equação de base ativa fecha a cada trimestre e nenhum contador fica negativo.
- Uso não excede capacidade nem base ativa final; ociosidade fecha a diferença.
- Receita de base ativa e custo de uso não duplicam em chamadas repetidas no mesmo trimestre.
- Save/restore v3 é determinístico; saves v1/v2 dos outros modelos permanecem válidos.
- Campos individuais, clínicos ou físicos são rejeitados pelo validador.
- BMC e marcos do HTML gerado equivalem ao catálogo localizado.
- Build, testes direcionados, `check_project.ps1` e revisão independente são concluídos antes do encerramento.

## Alterações previstas se aprovada

1. Generalizar a validação/inicialização v3 por `serviceMode`.
2. Adicionar o modelo `edu` ao catálogo localizado com estes parâmetros, BMC e marcos.
3. Implementar o avanço agregado de base ativa e uso no runtime.
4. Ampliar testes de fechamento de base, limite de uso, restauração, isolamento de modos e rejeição de campos proibidos.
5. Gerar `index.html` exclusivamente por `npm run build`.
