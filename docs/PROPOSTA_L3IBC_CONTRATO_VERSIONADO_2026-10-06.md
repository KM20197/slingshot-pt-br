# Proposta L3i-b/L3i-c — contrato versionado de serviços recorrentes

**Data:** 06/10/2026  
**Status:** proposta técnica concreta. Não implementada; não aprova parâmetros econômicos, fórmulas, BMC, marcos ou ativação de `aether` e `edu`.

## Decisão proposta

Criar uma família nova, `service_recurring`, com estado `brOperations` de versão **3** e motor `operations-v2-service`. A versão 3 pertence somente aos novos modelos que a declararem; ela não substitui nem migra os estados existentes.

O arquivo `locales/operating-models.pt-BR.json` não deve aumentar sua versão global para introduzir esse contrato. Cada modelo novo declara `stateVersion: 3` e `engine: "operations-v2-service"`; modelos existentes continuam sem esses campos e permanecem em `brOperations` v2.

Essa escolha evita que o validador passe a rejeitar saves v2 de `avam`, `dream`, `quant`, `vanguard`, `legal`, `arene` e `voed` ao adicionar um único contrato novo.

## Forma do estado proposta

```js
{
  version: 3,
  engine: 'operations-v2-service',
  companyId: 'aether' | 'edu',
  family: 'service_recurring',
  rngState: /* inteiro determinístico */,
  completed: /* atendimentos ou usos concluídos, acumulado */,
  lostDemand: /* procura agregada não atendida, acumulado */,
  receivables: [/* valores e vencimentos agregados */],
  ledger: {
    quarter: /* trimestre */, gross: /* receita interna */,
    variable: /* custo interno */, cashReceived: /* caixa recebido */,
    net: /* resultado */, cashCosts: /* custo de caixa */,
    cashDelta: /* variação de caixa */, units: /* uso concluído */
  },
  pivotEffects: { demand: 1, capacity: 1, quality: 1 },
  decisionVersion: 1,
  decisionsAppliedQuarter: 0,
  decisionEffects: { demand: 1, capacity: 1, quality: 1 },
  service: {
    capacity: /* capacidade agregada do período */,
    usedCapacity: /* uso agregado no período */,
    idleCapacity: /* capacidade não utilizada */,
    activeBase: /* somente edu: membros ativos agregados */,
    entries: /* somente edu: novas adesões agregadas */,
    exits: /* somente edu: saídas agregadas */
  }
}
```

Os comentários representam conceitos, não tipos a gravar. Nenhum campo pode receber nome, contato, horário, histórico individual, dado clínico, dado físico ou meio de pagamento.

## Regras de presença por empreendimento

| Campo em `service` | `aether` | `edu` | Motivo |
| --- | --- | --- | --- |
| `capacity`, `usedCapacity`, `idleCapacity` | obrigatório | obrigatório | Ambos dependem de capacidade agregada por trimestre |
| `activeBase`, `entries`, `exits` | ausente | obrigatório | Só a academia depende de uma base recorrente de membros |

O validador deve rejeitar campos de academia no estado da clínica, em vez de aceitá-los silenciosamente. Isso reduz ambiguidade futura e impede que a clínica seja tratada como cadastro de pacientes.

## Inicialização e avanço propostos

1. `init` seleciona o modelo pelo ID técnico e lê `stateVersion`/`engine` do próprio modelo.
2. Para modelos v2 existentes, a execução atual não muda.
3. Para `service_recurring`, `init` cria somente os campos autorizados para aquela subfamília.
4. `advance` calcula procura, capacidade, uso, ociosidade, resultado e recebíveis de forma determinística a partir de parâmetros que ainda serão aprovados.
5. Em `edu`, a base final é fechada por `base inicial + entradas - saídas`; em `aether`, não há base persistente.
6. `save` continua clonando `brOperations`; `restore` valida antes de escrever no jogo.

## Compatibilidade proposta

| Save encontrado | Modelo selecionado | Resultado esperado |
| --- | --- | --- |
| Sem `brOperations` | qualquer modelo | válido; o estado é criado somente se o modelo estiver ativo |
| Versão 1 ou 2 | modelo operacional v2 | válido, conforme regras atuais |
| Versão 3 | `aether` ou `edu` após ativação | válido somente se `engine`, `family`, empresa e campos de serviço coincidirem |
| Versão 3 | modelo v2 | rejeitado antes de mutar o jogo |
| Versão 1/2 | `aether` ou `edu` após ativação | tratado como save anterior sem estado do novo módulo; não há conversão implícita |

Não haverá migração automática de uma clínica ou academia anterior porque esses modelos ainda não possuem estado operacional salvo.

## Validação exigida no runtime

- `version`, `engine`, `companyId` e `family` devem coincidir com o modelo declarado.
- Contadores e valores de ledger devem ser finitos e não negativos, exceto resultado e variação de caixa quando a regra permitir valor negativo.
- `0 <= usedCapacity <= capacity` e `idleCapacity === capacity - usedCapacity`.
- Para `edu`, `activeBase`, `entries` e `exits` são inteiros não negativos e fecham a equação de transição aprovada.
- Para `aether`, campos de base ativa são proibidos.
- Recebíveis preservam as regras atuais de vencimento e valor agregado.
- Estado inválido deve produzir erro antes de alterar `game.brOperations`.

## Mudanças futuras autorizáveis por esta proposta

Depois de aprovar parâmetros próprios de cada empreendimento, a implementação poderá limitar-se a:

1. evoluir `operations-runtime.js` com bifurcação explícita por versão/família;
2. acrescentar modelos `aether` e/ou `edu` ao catálogo localizado;
3. adequar a injeção de BMC/marcos já existente;
4. adicionar testes de save legado, restauração v3, isolamento entre famílias, privacidade e determinismo;
5. gerar `index.html` exclusivamente por `npm run build`.

A proposta não autoriza valores, fórmulas, marcos, decisões operacionais, pivôs, eventos ou textos de interface desses dois empreendimentos. Eles exigem documentos próprios antes de entrar no catálogo.
