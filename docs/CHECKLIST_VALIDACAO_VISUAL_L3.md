# Validação manual — L3b/L3c

Abra `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\index.html` no navegador instalado no computador. Não use o navegador integrado do Codex: ele bloqueia arquivos `file://`.

Repita o roteiro para **Assistência técnica de celulares**, **Minimercado** e **Gráfica/embalagens**:

1. Inicie uma nova partida, selecione um perfil, o empreendimento e uma das três cidades brasileiras.
2. Na primeira tela de situação, confirme: “Capítulo 1”, “Resumo da situação”, “Autonomia financeira”, “Meta atual”, “Foco sugerido”, “Iniciar trimestre” e `R$` no painel. Os valores continuam em milhares de simulação; L3c não faz conversão cambial.
3. Contrate os gestores. Confirme que há salário trimestral e nenhuma oferta de participação societária ou negociação individual. Isso é o comportamento aprovado do L2b.
4. Escolha uma meta, distribua pontos e inicie ao menos dois trimestres. Observe se o jogo continua sem tela vazia, alerta JavaScript ou valor `NaN`.
5. No minimercado, confirme que há vendas, reposição e estoque não negativo. Na gráfica, confirme produção/pedidos, insumos e perdas agregadas. Na assistência, confirme ordens, peças e capacidade. Os valores são didáticos, não dados reais.
6. Salve a partida, recarregue a página, restaure-a e avance mais um trimestre. Confirme que cidade, caixa, meta, BMC e operação permanecem consistentes.

Anote para cada empresa: cidade escolhida, trimestre alcançado, mensagem textual exata de falha (se houver), se ocorreu antes/depois de salvar, e captura de tela apenas se for conveniente. Não use `git add`, commit ou push.

Não testar ainda Ada/importador, eventos gerais, concorrentes, crédito posterior, nota ou exportação como parte deste aceite: esses componentes não foram adaptados no L3b/L3c.
