> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Prompt OpenCode — proposta de matriz P2

Use este prompt somente quando `docs/FORMULARIO_DECISAO_P2.md` estiver completo: os 18 casos Johgo devem estar classificados uma única vez e os casos originais do Slingshot devem ter orientação de manter, substituir ou mapear na proposta.

> Atue como `slingshot-explorer`, estritamente em leitura. Leia `AGENTS.md`, `docs/HANDOFF_LLM_COMPLETO.md`, `docs/PLANO_CONCLUSAO.md`, `docs/FORMULARIO_DECISAO_P2.md` e `docs/REVISAO_EXPLORACAO_JOHGO_P2_2026-09-26.md`.
>
> Se o formulário estiver incompleto, tiver caso duplicado/omitido ou não definir o destino dos casos originais, pare e relate somente a lacuna. Não peça ao usuário que escolha tecnologia, arquivo ou etapa.
>
> Para cada caso Johgo marcado como `manter` ou `adaptar`, leia em `source/index.original.html` apenas as estruturas necessárias: `COMPANIES`, `VENTURE_DETAILS`, `BMC_DATA`, `REVENUE_MODELS`, `MILESTONES`, `RIVALS`, `FOUNDER_PROFILES` e `VENTURE_MARKETS`. Preserve IDs, números, fórmulas, efeitos, seletores e marcadores `[NEW]`; a tarefa não autoriza nenhuma edição.
>
> Não invente um setor original equivalente: os empreendimentos originais do Slingshot são arquétipos de startups, não o catálogo `services`/`commerce`/`industry` do Johgo. Faça a correspondência por compatibilidade pedagógica e operacional, explicitando produto, cliente, receita, BMC, marcos, equipe e rivais que terão de ser revisados. Classifique o impacto como `baixo`, `médio` ou `alto` e justifique com fatos da fonte.
>
> Não crie, grave, extraia, faça staging, commit, push, build, teste, acesso de rede ou qualquer alteração local. Não proponha valores, custos, juros, regras de pagamento, estoque ou concorrentes do Johgo como dados do Slingshot.
>
> Resposta final: tabela Markdown com `ID original`, `nome/arquetipo original`, `caso brasileiro`, `situação decidida`, `compatibilidade`, `estruturas Slingshot afetadas`, `impacto` e `justificativa factual`. Liste separadamente os casos Johgo em `referência` ou `descartar`. Termine com limitações e pontos que exigem aprovação do usuário; não declare a matriz aprovada e não faça perguntas genéricas.
