# Avaliação crítica inicial — componentes isolados

Nota: **6,5/10**. Avaliação independente em 14/09/2026. Não é avaliação de prontidão do jogo: tradução, integração, exportação e publicação estão fora deste recorte.

## Evidências

`node --test tests/academic.test.cjs tests/finance.test.cjs`: 15/15 testes passaram. `node tools/inventory.cjs`: 83.574 linhas, 8 scripts, 71 estruturas fora de funções, 40.693 candidatos de strings/templates. O financiamento amortiza principal e distingue devedor pessoal/empresa; a fórmula pura reproduz 3,85/5 e preserva componentes na falência. SQL restringe os quatro objetos a leituras de benchmarks para anon/authenticated e restringe refresh ao serviço administrativo, preservando dados existentes.

## Problemas e correções

1. **Alta — contagem final de trimestres.** `fromGame` usa `turn-1` quando não recebe `brCompletedQuarters`. O original encerra no próprio Q16 antes de incrementar (`source/index.original.html:57053`). Uma partida com 16 trimestres concluídos perde 1/16 na continuidade. Definir contador explícito atualizado no fechamento efetivo, cobrir saídas intermediárias e Q16 com teste. Não inferir indiscriminadamente `turn`, pois encerramentos durante um trimestre também existem.
2. **Alta — contrato monetário de integração ausente.** O motor usa caixa/burn em milhares; `finance.js` usa centavos. `fromGame` soma `finance.nextPayments` diretamente a burn. Exigir contrato documentado e conversão testada (100.000 centavos = 1 unidade de mil reais). Hoje não há integração para confirmar a unidade do resumo; trata-se de lacuna impeditiva para conectar os módulos, não erro provado numa conexão existente.
3. **Média — modalidades herdadas aceitas.** `create('toString',100,1,'x')`, `constructor` e `__proto__` são aceitos por `TERMS[kind]`; `due` retorna NaN. Usar verificação de propriedade própria e testar esses nomes.
4. **Média — validação de estado de empréstimo.** `due/settle` aceitam objetos adulterados, sem verificar saldo, atrasos, principal, modalidade e datas; NaN/negativos podem contaminar resultados. Validar estado serializado e limites de aritmética segura, incluindo soma de parcelas e acúmulo de juros. Tornar explícita a política de idempotência para trimestres anteriores.
5. **Média — marcos esparsos passam.** `calculate({milestones:Array(3),completedQuarters:16,success:true,cash:1,nextOperatingCosts:1,nextDebtPayments:0,arrears:0})` retorna nota 2 com sucesso sem nenhum marco. map/some/reduce ignoram lacunas. Validar os três índices explicitamente. Também `fromGame` usa optional chaining na contagem mas chama `.includes` sem proteção quando completedMilestones não existe; validar o contrato e emitir erro descritivo.
6. **Média — SQL não reaplicável.** Cria `benchmarks_read_reference` sem remover a mesma policy antes; uma segunda execução falha e aborta a transação. Adicionar DROP POLICY IF EXISTS dessa policy. Esquema/sequence preexistentes são pressupostos e precisam ser documentados. Não executei SQL remoto; avaliação é estática e não certifica permissões efetivas, views ou outros RPCs no projeto.
7. **Média — inventário não cobre toda a interface.** Texto HTML externo a scripts não é inventariado. Literais usados como chaves são todos descartados, embora uma chave computada possa conter texto; strings/templates acima de 30.000 caracteres são descartados mesmo quando contêm interface. Inventário útil de candidatos JS, mas insuficiente como prova de tradução integral. Criar inventário HTML/atributos e lista explícita de exclusões grandes com motivo. Não mudar IDs/chaves técnicas como se fossem prosa.
8. **Baixa — comando e metadados.** package.json ainda traz npm test com erro padrão e licença ISC, incompatível com a atribuição planejada CC BY-NC-SA. Configurar comando de testes e metadados corretos.

## Reavaliação requerida

Executar novamente todos os testes após correção; acrescentar contraexemplos acima, inadimplência por vários trimestres seguida de quitação, valores de centavos não divisíveis e limite seguro. Verificar SQL com consulta de permissões no projeto autorizado e segunda aplicação. Evidência de sintaxe e testes isolados não substitui validação da integração no navegador.
