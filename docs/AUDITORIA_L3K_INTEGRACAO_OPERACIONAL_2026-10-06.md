# Auditoria de integração operacional L3k — 06/10/2026

## Escopo e método

Auditoria somente de leitura após a ativação dos doze modelos em `locales/operating-models.pt-BR.json`. Foram examinados os módulos que consomem ou alteram a operação: isolamento de mercados, pessoas e contratos, decisões operacionais, localização, encerramento e seus testes. Não foram alterados valores, fórmulas, catálogo, runtime ou formato de save nesta auditoria.

## Estado confirmado

`operations-runtime.js` já habilita doze empreendimentos: `avam`, `dream`, `quant`, `vanguard`, `legal`, `arene`, `voed`, `aether`, `edu`, `cyber`, `terra` e `sorgente`. O estado operacional é versionado por modelo e os testes cobrem invariantes de estoque, serviço, produção, recebíveis e compatibilidade v1.

`management-runtime.js` e `operational-endgame-runtime.js` atendem ao conjunto atual sem lista restritiva: a localização reconhece as quatro indústrias (`quant`, `cyber`, `terra`, `sorgente`) e o encerramento é comum. Eles não requerem ampliação neste lote.

## Lacunas de integração

| Módulo | Cobertura atual | Efeito nos seis modelos ativados depois | Decisão necessária |
| --- | --- | --- | --- |
| `market-isolation.js` | `avam`, `dream`, `quant`, `vanguard`, `legal`, `arene` | `voed`, `aether`, `edu`, `cyber`, `terra` e `sorgente` não têm neutralizados os modificadores econômicos legados de mercado, embora a interface de mercados permaneça oculta. | Definir se os seis devem seguir a mesma neutralização enquanto usam a economia local. |
| `people-contracts-runtime.js` | os mesmos seis IDs | os seis restantes não têm equipe operacional inicial, contratos externos ou efeitos de capacidade/demanda pelo adaptador. | Aprovar perfis, custos, limites e efeitos por família, sem reutilizar números por semelhança nominal. |
| `operational-decisions-runtime.js` | os mesmos seis IDs | os seis restantes não recebem as três frentes de decisão local e podem cair no fluxo legado de executivos. | Aprovar textos, custos e multiplicadores por família; decisões devem continuar sem criar empregados ou AP. |
| Testes de integração | verificam as listas de seis como comportamento vigente | a suíte aceita a assimetria porque ela foi deliberada no lote anterior. | Trocar as expectativas somente com a mudança aprovada e testar os doze IDs. |

## Ordem recomendada

1. **L3k-a — isolamento de mercados:** ampliar a lista de isolamento para os doze empreendimentos operacionais e cobrir os seis novos IDs nos testes. É o ajuste de menor superfície e impede que uma interface oculta deixe vantagens econômicas legadas ativas.
2. **L3k-b — pessoas e contratos por famílias:** especificar e implementar separadamente serviços de atendimento, serviço recorrente, comércio alimentício, indústria sob encomenda e produção fictícia. Cada perfil precisa de limites explícitos de equipe, custos e efeitos.
3. **L3k-c — decisões operacionais por famílias:** criar os catálogos somente depois de L3k-b, preservando o contrato de efeitos de um trimestre e a validação do save.
4. Executar build, testes de módulo e partida de integração por família; então submeter cada lote a revisão independente.

## Limites

Os valores e fórmulas de pessoas, contratos e decisões permanecem pendentes de proposta concreta e aprovação. Esta auditoria não autoriza mudar o formato salvo, BMC, pivôs, eventos, Ada ou os parâmetros econômicos dos modelos operacionais.

## Evidências

- SHA-256 de `source/index.original.html`: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
- Testes de integração executados: 34 aprovados em `operations-runtime`, `operational-decisions`, `people-contracts`, `market-isolation`, `operational-endgame` e `management-content`.
