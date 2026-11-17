# Especificação proposta L3i-b/L3i-c — capacidade recorrente de serviços

**Data:** 06/10/2026  
**Status:** arquitetura em análise. Não autoriza mudança de runtime, JSON, salvamento, fórmulas, valores ou ativação de empreendimentos.

## Escopo

Esta especificação cobre somente os requisitos que impedem `aether` (Clínica popular fictícia) e `edu` (Academia) de reutilizarem, sem ambiguidade, o contrato atual `brOperations` v2.

`voed` permanece em L3i-a, já implementado com porções agregadas. Nenhum outro empreendimento integra este documento.

## Limite de dados

A representação deve ser exclusivamente agregada por trimestre. Ela não pode guardar, derivar ou apresentar:

- identidade, contato, agenda ou histórico de pessoa atendida;
- diagnóstico, sintoma, tratamento, prescrição, exame, resultado clínico ou qualquer decisão em saúde;
- biometria, medidas corporais, rotina individual, condição de saúde ou recomendação física;
- contrato, cobrança, frequência ou pagamento identificável.

Os dois negócios operam como cenários didáticos fictícios. O modelo não deve fazer alegações de resultado clínico, sanitário ou de condicionamento.

## Por que `brOperations` v2 não é suficiente

A versão atual armazena unidades disponíveis, unidades concluídas, perdas, recebíveis e efeitos agregados. Essa estrutura é adequada a venda/produção discreta, mas não distingue:

| Necessidade | Clínica fictícia | Academia | Limitação do v2 |
| --- | --- | --- | --- |
| Capacidade temporal | horários agregados de atendimento | vagas e uso agregado por período | `inventory` não expressa capacidade reservável |
| Relação contínua | retorno agregado sem identidade | membros ativos e renovação agregada | `completed` é acumulado e não representa base ativa |
| Ociosidade | horários sem uso | vagas não ocupadas | não há indicador separado de capacidade não utilizada |
| Saída recorrente | não comparecimento agregado | cancelamento agregado | `lostDemand` representa procura não atendida, não saída de base |

Forçar esses conceitos em `inventory` criaria indicadores contraditórios e fragilizaria a leitura de saves antigos.

## Contrato candidato: `operations-v2-service`

A recomendação é uma extensão versionada, ativada por família explícita do modelo localizado e nunca inferida do ID do empreendimento. O estado candidato deve preservar integralmente a leitura de `brOperations` v1 e v2.

### Estado comum proposto

| Campo candidato | Tipo | Semântica agregada |
| --- | --- | --- |
| `version` | inteiro | Nova versão somente após aprovação da migração |
| `engine` | string | Identificador explícito da família de operações |
| `companyId` e `family` | strings | Validação de vínculo, como no contrato atual |
| `capacity` | número | Capacidade total do período, sem agenda individual |
| `usedCapacity` | número | Atendimentos/uso efetivamente realizado no período |
| `idleCapacity` | número | Capacidade não utilizada ao fim do período |
| `activeBase` | número | Base ativa agregada, quando a família exigir recorrência |
| `entries` e `exits` | números | Entradas e saídas agregadas de base; sem dados pessoais |
| `receivables` e `ledger` | estruturas existentes | Valores internos agregados e caixa do período |
| `pivotEffects` e `decisionEffects` | estruturas versionadas | Efeitos explícitos e determinísticos |

`activeBase`, `entries` e `exits` não devem existir para a família clínica caso não sejam necessários; a versão não pode introduzir campos decorativos. A forma final deve ser a menor estrutura que represente a regra aprovada.

### Invariantes propostos

- Todos os contadores são finitos e não negativos.
- `usedCapacity <= capacity` e `idleCapacity = capacity - usedCapacity`.
- Quando houver base ativa: `activeBase` no período seguinte decorre somente de base anterior, entradas e saídas agregadas aprovadas.
- A receita não pode ser calculada duas vezes por unidade de uso ou por membro ativo.
- Recebíveis mantêm prazo mínimo positivo e não identificam pagador.
- `restore` rejeita estado de outra empresa, versão incompatível ou relações matemáticas impossíveis antes de mutar o jogo.
- Salvamento sem estado operacional continua válido; saves v1/v2 continuam utilizáveis pelos modelos existentes.

## Família L3i-b: atendimento ambulatorial fictício (`aether`)

A unidade operacional candidata é **atendimento agregado concluído**. A capacidade representa blocos de atendimento disponíveis no trimestre, sem especialidade, profissional, paciente ou horário.

Indicadores candidatos:

- procura agregada;
- capacidade disponível;
- atendimentos concluídos;
- capacidade ociosa;
- procura não atendida;
- recebíveis agregados.

O modelo não deve simular triagem, prioridade clínica, faltas individuais, elegibilidade de convênio, protocolo sanitário ou qualquer decisão de cuidado. Caso seja necessário representar ausência, ela deve ser um único indicador agregado e só após definição de fórmula aprovada.

## Família L3i-c: academia (`edu`)

A unidade recorrente candidata é **membro ativo agregado**, separada de **uso agregado de capacidade**. A distinção é necessária porque uma pessoa pode permanecer ativa sem usar o espaço em um período, mas o modelo não identifica pessoas.

Indicadores candidatos:

- base ativa no início e no fim do período;
- novas adesões agregadas;
- saídas agregadas;
- capacidade de uso e uso efetivo;
- ociosidade;
- recebíveis recorrentes agregados.

O modelo não deve registrar matrícula individual, treino, presença individual, meta corporal ou recomendação de saúde. A renovação e a saída são apenas transições numéricas da base agregada.

## Sequência de decisão antes de código

1. Aprovar ou rejeitar o contrato comum `operations-v2-service`.
2. Confirmar quais campos são comuns e quais pertencem apenas à academia.
3. Definir uma política de compatibilidade: nova chave de estado ou migração explícita de `brOperations` para nova versão.
4. Aprovar fórmulas, parâmetros internos, BMC, marcos, pivôs e decisões para `aether` e `edu` em documentos separados.
5. Implementar primeiro um único empreendimento e testar restauração, isolamento, determinismo e regressão dos modelos v1/v2 existentes.

## Matriz mínima de testes para a futura implementação

- modelo desativado não cria estado;
- modelo ativado inicializa somente os campos aprovados;
- capacidade nunca é excedida;
- base ativa não fica negativa;
- entradas, saídas e base final fecham contabilmente;
- receita, recebimento e custo não duplicam no mesmo trimestre;
- salvar/restaurar preserva resultados determinísticos;
- save antigo v1/v2 permanece válido para os modelos anteriores;
- BMC e marcos gerados equivalem ao catálogo localizado;
- nenhum texto ou estado contém dado pessoal, clínico ou de condição física.
