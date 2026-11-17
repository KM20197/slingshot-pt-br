# Contexto confiável de L3k-b0

Reconciliado em 07/10/2026 com Rodada10 e com a reexecução concluída em Rodada11, ID `01a118cf-39c6-7e71-87f2-a8c192cfa130`. Este documento registra o contrato, as correções e o resultado revisado de L3k-b0.

## Resultado vigente de Rodada11

- Artefato isolado: `artifacts/l3kb0/simulate-l3kb0.cjs`; 324 cenários, 5.184 linhas trimestrais e 312 comparações, sempre Q1–Q16.
- `node --check artifacts/l3kb0/simulate-l3kb0.cjs` e a execução da simulação terminaram com exit 0. Catálogo, runtime, save e HTML não foram alterados pelo lote.
- Revisão independente: 8,5/10 no primeiro ciclo e 9,2/10, APROVADO para o método isolado, no segundo. A revisão não aprovou valores econômicos.
- A proposta original de supervisor, duas pessoas e dois contratos tornou os seis IDs insolventes entre Q7 e Q12 com R$ 350 mil próprios. Mesmo só com o supervisor candidato e sem contratos, `voed`, `aether`, `terra` e `sorgente` terminaram negativos; `cyber` terminou com margem de R$ 2 mil; `edu` terminou positivo, mas equipe adicional não elevou base ativa nem recebimentos.
- O resultado completo está em `docs/RELATORIO_L3KB0_REEXECUCAO_2026-10-07.md`. Não repetir o lote como se ainda estivesse pendente.
- Recomendação técnica: postergar L3k-b e analisar primeiro burn, caixa inicial e operação em um lote arquitetural. Uma segunda varredura apenas de custos de pessoas/contratos não ataca a insolvência observada sem esses custos. Qualquer mudança continua dependente de proposta concreta e decisão humana.

## Fatos e restrições

Checkout: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`.
Diretório de escrita do script/resultados: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\artifacts\l3kb0`.

L3k-a isolou mercados legados para 12 operações. Pessoas/contratos e decisões cobrem somente `avam`, `dream`, `quant`, `vanguard`, `legal`, `arene`. Faltam `voed`, `aether`, `edu`, `cyber`, `terra`, `sorgente`.

A análise anterior é inválida para decisão: oito avanços por incremento duplicado, equipe máxima sem custo extra e ausência do caixa completo da partida. O relatório retificado permanece como histórico. Não usar sua tabela para rejeitar/aprovar parâmetros nem repetir a conclusão de ausência de benefício marginal.

O runtime limita a base ativa de `edu` a `baseCapacity`. O bônus de capacidade não garante aumento dessa base. Separar correção de valores de eventual alteração arquitetural dessa regra.

## Candidatos rejeitados para implementação

A proposta inicial do Astra mencionou custo trimestral completo 38 para `voed`/`edu`, 41 para `aether` e 46 para `cyber`/`terra`/`sorgente`; equipe inicial 2, máxima 5 e bônus comercial de demanda +1. Rodada11 testou esses candidatos em memória e não sustentou sua implementação. Esses totais não autorizam escrever o catálogo nem devem ser tratados como ponto aprovado de uma nova varredura.

## Contrato executado e evidências

- Usar os módulos reais; parâmetros candidatos só em memória. Não escrever catálogo, runtime, save ou HTML. Adaptador temporário precisa demonstrar equivalência com fórmulas reais.
- Executar Q1–Q16 consecutivos exatamente uma vez. Reiniciar o mesmo estado e semente por cenário.
- Comparar operação atual sem `brBusiness`; equipe inicial nas quatro combinações dos dois contratos; equipes de 0–5 com supervisor explicitado; trajetórias de contratação/desligamento/redução emergencial.
- Cobrar cada pessoa/contrato no trimestre correto, sem dupla cobrança. Estado sem `brBusiness` não recebe bônus ou custo novos.
- Separar operação neutra e caixa da partida: caixa inicial, custos locais/cidade/gestão, compras/reposição, recebíveis, parcelas e obrigações, choques/decisões realmente modelados. Documentar o que depende de L3k-c e ainda falta.
- Registrar por trimestre: capacidade, demanda, unidades, perdas, base ativa/ociosidade quando aplicável, receita por competência, recebimentos, compras, custos, parcelas e saldo. Apurar menor caixa, insolvência, custos acumulados, efeito marginal e equilíbrio alcançável.
- Verificar manualmente trimestres de amostra; comprovar 16 linhas por cenário e custos extras reais no máximo. Evitar usar apenas saldo acumulado para afirmar sustentabilidade global.
- Coordenador executa; revisor independente somente leitura examina método, resultados e provas. Ao final, entregar proposta por ID antes da decisão de implementação L3k-b. Não iniciar L3k-c automaticamente.

## Fontes a consultar conforme a necessidade

- `docs/HANDOFF_CONTINUIDADE_L3KB0_ORQUESTRACAO_2026-10-07.md`: snapshot completo de Rodada10.
- `docs/HANDOFF_ASTRA_MEDIO_L3KB_PESSOAS_CONTRATOS_2026-10-06.md`: proposta solicitada ao Astra.
- `docs/PROPOSTA_L3KB0_CALIBRACAO_PESSOAS_2026-10-07.md`: planejamento anterior; aplicar as correções deste contrato.
- `docs/RELATORIO_L3KB0_CALIBRACAO_2026-10-07.md`: relatório invalidado, somente auditoria histórica.
- `docs/AUDITORIA_L3K_INTEGRACAO_OPERACIONAL_2026-10-06.md`: lacunas de integração.
- `operations-runtime.js`, `people-contracts-runtime.js`, `business-adapter.js`, `finance.js`, patches/consumidores do turno e testes: fatos locais a conferir pelo explorador.

O Gemini web usa o TXT exportado deste contexto. Os agentes locais têm acesso às fontes no checkout; nenhum caminho Windows representa um anexo já lido pelo Gemini.
