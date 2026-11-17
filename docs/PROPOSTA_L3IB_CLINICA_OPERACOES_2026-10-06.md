# Proposta L3i-b — Clínica popular fictícia (`aether`)

**Data:** 06/10/2026  
**Status:** proposta de parâmetros para aprovação e implementação. Depende do contrato `operations-v2-service` descrito em `PROPOSTA_L3IBC_CONTRATO_VERSIONADO_2026-10-06.md`.

## Escopo e limites

Ativa somente `aether` após a implementação do contrato v3. O cenário representa organização agregada de capacidade ambulatorial fictícia. Não contém, produz ou infere dados de pacientes, profissionais individuais, especialidades, agenda, ausência individual, diagnóstico, prescrição, exame, convênio, triagem ou recomendação clínica.

Os valores abaixo são unidades internas didáticas e não representam preço, margem, custo, produtividade, condição comercial ou parâmetro de uma clínica real.

## Família e parâmetros candidatos

```json
{
  "stateVersion": 3,
  "engine": "operations-v2-service",
  "family": "service_recurring",
  "serviceMode": "aggregate_attendance",
  "baseDemand": 18,
  "baseCapacity": 24,
  "unitPrice": 3.4,
  "unitVariableCost": 1.2,
  "receivableShare": 0.18
}
```

Sem `initialInventory`, `targetInventory`, `activeBase`, `entries` ou `exits`.

| Parâmetro | Papel didático |
| --- | --- |
| `baseDemand` | procura agregada inicial por atendimentos no trimestre |
| `baseCapacity` | limite agregado de atendimentos disponíveis no trimestre |
| `unitPrice` | receita interna por atendimento agregado concluído |
| `unitVariableCost` | custo interno por atendimento agregado concluído |
| `receivableShare` | parte agregada da receita que entra em período posterior |

A procura inicial fica abaixo da capacidade inicial para tornar observável tanto ociosidade quanto o efeito de variações de demanda e capacidade. Não há estoque, produção, descarte de material, fila individual ou penalidade de ausência nesta proposta.

## Regras candidatas por trimestre

1. Procura e capacidade usam a mesma estrutura determinística de métricas, pivôs e decisões aprovada para os modelos operacionais, com parâmetros próprios de `aether`.
2. Atendimentos concluídos são o menor valor entre procura e capacidade.
3. Capacidade ociosa é a diferença entre capacidade e atendimentos concluídos.
4. Procura não atendida é a diferença entre procura e atendimentos concluídos e acumula em `lostDemand`.
5. Receita, custo interno, recebíveis, caixa recebido, resultado e caixa do período usam apenas valores agregados.
6. Não há cálculo de estoque, reposição, itens, prontuário, agenda ou base de pacientes.

## BMC inicial candidato

- **Parceiros-chave:** fornecedores de serviços de apoio e manutenção da unidade.
- **Atividades-chave:** organização agregada da capacidade, recepção e acompanhamento do fluxo da unidade.
- **Recursos-chave:** instalações, capacidade de atendimento e equipe de apoio em nível agregado.
- **Proposta de valor:** atendimento ambulatorial fictício organizado e acessível para o público local.
- **Relacionamento com clientes:** comunicação geral de horários e fluxo, sem registro individual.
- **Canais:** unidade local e divulgação comunitária genérica.
- **Segmentos de clientes:** público local que busca atendimento ambulatorial fictício acessível.
- **Estrutura de custos:** capacidade da unidade, apoio operacional, ocupação e manutenção agregada.
- **Fontes de receita:** atendimentos agregados concluídos.

## Marcos candidatos

| Etapa | Dificuldade | Nome | Prazo | Foco mínimo | Limiar operacional | Recompensa de valuation |
| --- | --- | --- | ---: | --- | ---: | ---: |
| m1 | conservadora | Fluxo de atendimento organizado | 8 | dev 40, mkt 15 | 26 | 200 |
| m1 | equilibrada | Capacidade ambulatorial acompanhada | 7 | dev 43, mkt 22 | 38 | 450 |
| m1 | ambiciosa | Atendimento agregado demonstrado | 6 | dev 46, mkt 28, hr 20 | 50 | 900 |
| m2 | conservadora | Capacidade e recebimentos equilibrados | 7 | dev 55, hr 35 | 64 | 300 |
| m3 | conservadora | Unidade operacional sustentável | 6 | mkt 70, dev 68, hr 50 | 86 | 500 |

Os limiares são total acumulado de atendimentos agregados; não representam pessoas, prontuários ou consultas identificáveis.

## Atualizações BMC e pivôs candidatos

- **Marco 1:** rotina de fluxo da unidade e capacidade agregada acompanhada.
- **Marco 2:** retorno geral do público acompanhado de forma não identificável e recebimentos planejados.
- **Marco 3:** parcerias locais, demanda recorrente agregada e fluxo operacional consolidado.
- **Pivôs:** somente os tipos genéricos já existentes; seus textos tratam de público, fluxo, organização da unidade e canal local. Não introduzem especialidade, tecnologia clínica, dados sensíveis ou alegações de saúde.

## Critérios de aceite da implementação

- Apenas `aether` recebe `stateVersion: 3`, `engine: operations-v2-service` e `serviceMode: aggregate_attendance`.
- `edu` continua desativada até seu próprio lote; todos os sete modelos v2 preservam comportamento e saves.
- O estado v3 de `aether` contém capacidade, uso e ociosidade, mas não contém `activeBase`, `entries` ou `exits`.
- `usedCapacity <= capacity`, `idleCapacity = capacity - usedCapacity` e nenhum contador fica negativo.
- A receita corresponde somente aos atendimentos agregados concluídos; ociosidade e procura não atendida não geram receita.
- Salvar/restaurar é determinístico e saves sem estado operacional continuam válidos.
- BMC e marcos do HTML gerado equivalem ao catálogo localizado.
- A interface não usa termos de diagnóstico, prescrição, paciente, prontuário, especialidade ou agenda individual.
- Build, testes direcionados, `check_project.ps1` e revisão independente passam antes do encerramento.

## Alterações previstas se aprovada

1. Evoluir `operations-runtime.js` para reconhecer o contrato v3 por modelo e família.
2. Adicionar `aether` ao catálogo localizado com o conteúdo desta proposta.
3. Ampliar a injeção já existente de BMC e marcos, sem modificar a fonte original.
4. Criar testes de validação, restauração, isolamento v2/v3 e ausência de campos proibidos.
5. Gerar `index.html` por `npm run build` e revisar o diff.
