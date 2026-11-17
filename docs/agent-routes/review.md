# Rota de revisão e entrega

## Conferência V2 e limites de ferramentas —17/10/2026,r387

OpenCode observado2.0.32. No lote RajC2,worker executou duas shell e escreveu PROPOSTA_WORKER_UPDATED.json fora do arquivo contratado;comandos restritos a ler/copiar propostas,sem produto tocado. Não adotar autorrelato de ausência de execução contra trace. V2usa permissions/shell/subagent;V1permission/bash/task pode ser convertida,mas a intenção textual não comprova isolamento.

Antes de revisão,usar overlay privado por processo com agents.gauntlet-reviewer.permissions:denygeral,readsomente arquivos públicos do lote,e policies tool.use que negam shell/execute/edit/subagent/webfetch/websearch. Não mudar combos ou credenciais para isso. Prova funcional em artifacts/char-raj-contexto-20261017-r384/SONDA_PERMISSAO_LOCAL_RESULTADO.json:servidor sintético local,sem geração externa,só read oferecido,shell forçada recusada como indisponível antes deexecutar. Essa prova não é revisão do jogo,nem certifica isolamentoabsoluto. Consultas agentes retornaramlistasvazias/404e não foram tomadascomo prova. Conferir novo trace real do revisor.

Documentação oficial:https://opencode.ai/v2/docs/permissions. Não repetir chamadas de modelo sem limite para diagnosticar permissão;usar sonda local pública. Preservar arquivos/logs/falhas.

Procedimento permanente: `docs/MANUAL_ORQUESTRACAO.md`. Entrada atual: `docs/ESTADO_ATUAL.md`. Checkout: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`.

Revisor independente não escreveu o lote; usa sessão separada e somente leitura. Sem shell, edição ou delegação. O coordenador executa testes e fornece provas sanitizadas. Achados citam arquivo/linha, impacto e correção verificável. Não aceitar saída relatada sem prova como execução confirmada.

Código: nota inicial/final justificada 0–10, mínimo 9 e sem bloqueador, até três ciclos. Ao limite, registrar BLOCKED_FOR_REVIEW. A nota de um lote não aprova o projeto inteiro. Para documentação/configuração, revisar coerência, caminhos e funcionamento proporcional, sem impor build/suíte econômica a uma mudança textual.

Provas conforme o lote: original preservado, caminhos/catálogo e paridade AST quando pertinentes, comportamento real, testes afetados, build e check_project.ps1 para código, diff e inspeção visual quando necessária. Esperar exit code; registrar falhas, limites e se o remoto foi realmente consultado.

O revisor sem escrita devolve achados ao coordenador, que atualiza estado/relatório e exporta o pacote. Staging/commit/push ficam com o usuário; não solicitar nova integração de lote já fechado. Publicação de site, Supabase e serviço pago dependem da autorização correspondente. Não enviar segredos ou dados de participantes.
