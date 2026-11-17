# Validação manual — L3f: Pessoas e Contratos v1

Abra `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\index.html` no Chrome, Edge ou Firefox instalado. Não use o navegador integrado do Codex: ele bloqueia arquivos `file://`.

Repita o roteiro para **Assistência técnica de celulares** (`avam`), **Minimercado** (`dream`) e **Gráfica/embalagens** (`quant`):

1. Inicie uma partida nova, escolha um perfil, um dos três empreendimentos e uma cidade brasileira.
2. Ao terminar a escolha de empreendimento, confirme que aparece **Pessoas e contratos iniciais**. Deve haver um supervisor, duas pessoas na equipe operacional e o proprietário; o proprietário não tem salário.
3. Escolha os contratos de contabilidade e de marketing. Confirme que não aparecem as opções legadas **Gerente Geral** ou **Gerente de Marketing**, nem participação societária como condição para essa configuração inicial.
4. Avance um trimestre. Confirme que a operação mostra dados coerentes com o tipo de negócio (ordens e peças; vendas e estoque; pedidos, produção e insumos) e que o caixa muda sem `NaN`, tela vazia ou alerta JavaScript. **Estado em 30/09/2026:** este passo está bloqueado no trio: não são criadas decisões após a configuração inicial.
5. Avance pelo menos mais um trimestre. Verifique que a capacidade continua limitada pela equipe e que os contratos não criam pontos de atenção, salários de fundador ou uma segunda equipe invisível.
6. Salve a partida, recarregue a página, restaure-a e avance outro trimestre. Confirme a preservação de caixa, cidade, meta, BMC, equipe, contratos e operação.
7. Se o resultado operacional de algum trimestre for negativo, salve e restaure esse estado também. O jogo deve aceitar o salvamento; o resultado negativo não pode bloquear a restauração.

Registre, para cada empreendimento: cidade, trimestre alcançado, opções de contratos escolhidas, caixa antes/depois de um trimestre, se o salvamento foi restaurado e a mensagem literal de qualquer falha. Capturas de tela são opcionais.

Fora deste aceite: Ada/importador, Supabase, crédito, nota, eventos gerais, concorrentes, `VENTURE_MARKETS`, exportação e os outros nove empreendimentos. A chave de turma não é necessária para jogar ou salvar; ela será verificada somente quando for feita a validação específica de exportação acadêmica.

Não use `git add`, commit ou push durante a validação.
