# Reavaliação independente — rodada 2

**Nota: 8,2/10**, ante 6,5/10. A nota cobre apenas fórmula, financiamento, adaptador monetário, inventário e configuração SQL/package. Não certifica tradução, navegador ou jogo concluído.

`npm test`: 23/23 passaram. As correções de modalidades herdadas, marcos esparsos, overflow acadêmico, contador explícito de trimestres, unidades milhares/centavos, policy reaplicável e comando npm/licença foram confirmadas. Inventário inclui HTML e atributos e documenta as exclusões de strings grandes. Teste exploratório de três trimestres sem pagamento, seguido de quitação de empréstimo de 100.003 centavos, terminou com saldo e atrasos zero; principal residual não desapareceu. Total de dívida acima do inteiro seguro é rejeitado.

## Pendências impeditivas para 9

1. **Média — operação borrow não atômica.** Com `brLoans:[{kind:'BAD',id:'bad'}]`, `borrow(game,'family',1,'new')` lança erro ao calcular resumo, mas já acrescentou contrato e crédito ao caixa. Preparar e validar contratos/resumo/caixa em estado temporário, aplicando somente quando todo cálculo concluir. `settleQuarter` também aplica estado antes de chamar summary, que pode falhar em previsões futuras ou agregação; mesma correção.
2. **Média — histórico de marcos corrompido concede pontuação.** `fromGame` aceita `completedMilestones:['m1','m1','m1']`, zero trimestres e sucesso, concedendo 5/5 com caixa suficiente. Rejeitar repetição, lacunas, identificadores inválidos e mais de três entradas; não truncar corrupção com Math.min.
3. **Média — evidência de banco inválida no arquivo.** `docs/database-verification.json` contém literalmente `undefined`. O agente principal relata teste remoto aprovado, mas o artefato não o demonstra. Registrar retorno real de grants/testes. Não executei mudanças remotas. O SQL e script de teste transacional foram revisados estaticamente; reaplicação da policy está corrigida.

## Limites residuais

O catálogo de tradução ainda exclui strings grandes e chaves, explicitamente documentado; não deve ser usado sozinho para alegar cobertura integral. O adaptador distingue devedor por metadado e paga a dívida uma vez com caixa do negócio conforme modelo aprovado; não implementa orçamento pessoal independente. A exigência do contador explícito evita erro silencioso, mas atualização correta desse contador ainda exige teste da integração do motor.

Reavaliar após corrigir atomicidade, histórico e evidência, acrescentando testes de regressão para os contraexemplos.
