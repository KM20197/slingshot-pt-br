# Parecer final do ciclo — componentes isolados

**Nota final: 9,0/10. Nota inicial: 6,5/10. Rodada intermediária: 8,2/10.**

Esta avaliação cobre academic.js, finance.js, finance-adapter.js, seus testes, tools/inventory.cjs, supabase/privacy.sql e package.json. Não aprova o jogo completo: tradução, integração final, exportação e funcionamento offline ainda exigem validação própria.

## Evidências verificadas

- `npm test`: 26/26 testes passaram nesta rodada.
- Teste exploratório adicional: 16 combinações de modalidade/principal (inclusive 1, 3 e 100.003 centavos), com três trimestres iniciais sem pagamento e quitação posterior. Todas terminaram sem saldo ou juros atrasados e preservaram o principal integral.
- Repetição independente do contrato inválido em borrow: erro sem alteração de caixa/carteira.
- Modalidades herdadas rejeitadas e total além do inteiro seguro rejeitado.
- Histórico acadêmico rejeita duplicatas, lacunas e excesso de marcos; contador explícito elimina o fallback incorreto de turn-1.
- Adaptador calcula previsão antes de aplicar alterações e converte centavos/milhares explicitamente.
- Evidência JSON do banco agora válida: quatro tabelas com RLS, leitura anônima apenas em benchmarks, inserção anon/authenticated negada. Testes transacionais adicionais de RPC e preservação de referências foram relatados pelo agente principal; não foram reexecutados remotamente por este avaliador.
- SQL contém DROP POLICY IF EXISTS para a policy recriada. Inventário inclui HTML e explicita exclusões, sem alegar tradução concluída. npm test e licença foram corrigidos.

## Problemas corrigidos no ciclo

Contagem ambígua de trimestres; ausência de contrato monetário; modalidades herdadas produzindo NaN; validação insuficiente de saldos; marcos esparsos/duplicados; falta de atomicidade após falhas; policy não reaplicável; metadados padrão incorretos; ausência de HTML no catálogo e evidência de banco inválida.

## Observação menor residual

`settleQuarter(game, NaN)` com carteira vazia retorna zero sem rejeitar o trimestre, porque a validação ocorre apenas dentro de finance.settle quando há cobrança. Validar trimestre na entrada do adaptador para manter contrato uniforme. Não provoca cobrança incorreta no cenário reproduzido, por isso não impede 9,0 neste recorte.

A nota não é 10: ainda não há prova da integração completa de todos os pontos de fechamento de trimestre; o catálogo documenta exclusões que precisam ser inspecionadas durante tradução; e o parecer não substitui testes de partida/exportação no navegador.
