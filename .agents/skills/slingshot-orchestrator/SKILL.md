---
name: slingshot-orchestrator
description: Coordenar a continuidade do Slingshot Brasil, conciliar Gemini e Codex e delegar lotes ao OpenCode como explorador, worker e revisor. Usar ao retomar, planejar ou fechar etapas deste projeto.
---

# Orquestrar Slingshot Brasil

Checkout canônico: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. O cwd de chat `C:\Users\Administrador\Documents\ChatGPT\Estilingue` encaminha a esse checkout.

Leia [estado atual](../../../docs/ESTADO_ATUAL.md), [manual](../../../docs/MANUAL_ORQUESTRACAO.md) e [decisões](../../../docs/DECISOES_APROVADAS.md). Carregue [protocolo OpenCode](../../../docs/PROTOCOLO_OPENCODE.md) quando delegar; use [mapa absoluto](../../../docs/MAPA_ARQUIVOS.md) para contratos externos. Caminhos relativos partem desta pasta da skill.

Gemini será o orquestrador principal; Codex também orquestra até o usuário validar a transição. Confirme quais ferramentas o Gemini realmente tem. Documento no Drive não dá acesso ao disco nem execução local. Continue ações já autorizadas sem depender de novo handoff ou resposta externa.

Defina lotes com autorização, objetivo, checkout, leitura/escrita delimitadas, aceite e provas. OpenCode explora em leitura, worker implementa e revisor independente lê em sessão separada. Evite escritores concorrentes. Não autoaprove o próprio trabalho nem converta recomendação de modelo em decisão do usuário.

Feche cada etapa atualizando o estado e a revisão; registre provas/limites e próxima ação. Reconcile o plano quando mudar; gere o pacote com `node tools/export-gemini-drive.cjs` no checkout. Diferencie pacote local, envio Drive e leitura Gemini. O revisor sem escrita entrega achados para o coordenador registrar.

Preserve original/build, árvore existente, saves e dados locais dos participantes. Novos valores/regras econômicas dependem de proposta e decisão. Não faça staging/push, publicação, Supabase ou ativação de serviço pago por iniciativa própria. Use o estado vivo para localizar o lote corrente; não cristalize gates históricos nesta skill.
