# Proposta concreta — L3k-a: isolamento de mercados para doze operações

**Data:** 06/10/2026  
**Status:** implementada após aprovação em 06/10/2026. O catálogo de isolamento e o HTML foram gerados e validados; não houve alteração de fórmulas, valores ou formato de save.

## Problema observável

Os doze empreendimentos usam `SlingshotOperations`, mas `SlingshotMarketIsolation.operatingIds()` contém somente seis: `avam`, `dream`, `quant`, `vanguard`, `legal` e `arene`. A aba e os painéis de mercado estão ocultos para a interface inteira, porém os guardas que neutralizam bônus, investimentos, prontidão de pivô, choques e modificadores de financiamento só alcançam esses seis IDs.

Assim, `voed`, `aether`, `edu`, `cyber`, `terra` e `sorgente` podem receber efeitos econômicos herdados do motor de mercado sem que o jogador tenha o controle de mercado correspondente.

## Alteração proposta

1. Em `market-isolation.js`, substituir a lista estática por esta lista ordenada, igual ao catálogo operacional ativo:

   ```js
   ['avam','dream','quant','vanguard','legal','arene','voed','aether','edu','cyber','terra','sorgente']
   ```

2. Em `tests/market-isolation.test.cjs`, exigir os doze IDs como isolados e verificar que cada um retorna `true` em `isolated`.

3. Acrescentar uma asserção cruzada no teste de operações para que os IDs devolvidos por `SlingshotMarketIsolation.operatingIds()` sejam exatamente os IDs habilitados de `SlingshotOperations`.

4. Gerar `index.html` exclusivamente com `npm run build`; não editar o HTML manualmente.

## Contrato preservado

- Nenhum preço, custo, multiplicador, fórmula de operação, estrutura de BMC, pivô, evento, cidade ou marco será alterado.
- O formato de save permanece idêntico; `marketIntel` legado continua gravado e restaurado como hoje.
- A interface de mercados continua oculta e os métodos legados continuam presentes, apenas neutralizados para todos os casos que já usam a economia local.
- Os IDs e a ordem do catálogo de operações não mudam.

## Validação prevista

- SHA-256 de `source/index.original.html` preservado.
- `npm run build`.
- `node --test tests/market-isolation.test.cjs tests/operations-runtime.test.cjs`.
- `git diff --check`, inspeção da lista gerada e revisão independente somente leitura, com nota mínima 9/10.

## Fora de escopo

Pessoas/contratos, decisões operacionais, valores por família, Ada, eventos, BMC e pivôs serão tratados em propostas posteriores. Esta proposta não introduz parâmetros econômicos novos.

## Resultado da implementação

`market-isolation.js` passou a isolar exatamente os doze IDs operacionais. `tests/market-isolation.test.cjs` cobre os doze e `tests/operations-runtime.test.cjs` compara diretamente a lista de isolamento com as chaves de `SlingshotOperations.models()`, evitando divergência quando um modelo futuro for ativado.

Validação: `npm run build` regenerou `index.html`; `node --test tests/market-isolation.test.cjs tests/operations-runtime.test.cjs` passou com 16/16 testes; o SHA-256 de `source/index.original.html` permanece `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.

Revisão independente (Faraday): ciclo 1, nota 9,4/10, aprovou o lote e recomendou derivar a expectativa da lista de isolamento a partir do catálogo operacional. A asserção foi aplicada e o ciclo 2 atribuiu nota final 9,8/10, sem pendências.
