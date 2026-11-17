> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Prompt para o OpenCode — recuperação do Gauntlet P1

Cole o texto abaixo em uma sessão principal do OpenCode aberta em `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. Não tente iniciar `gauntlet-reviewer` diretamente com `opencode run --agent`, pois ele está configurado como subagente.

> Atue somente como coordenador desta revisão. Não edite arquivos, não implemente correções, não faça staging, commit, push ou publicação e não emita você mesmo o parecer. Leia `AGENTS.md`, `docs/agent-routes/review.md`, `.opencode/agents/gauntlet-reviewer.md`, `docs/PACOTE_P1_PARA_GEMINI.md` e `docs/REVISAO_GAUNTLET_RUNTIME_P1_2026-09-25.md`.
>
> Primeiro, confirme que o subagente disponível se chama exatamente `gauntlet-reviewer`, usa a rota configurada `9router/slingshot-reviewer` e tem edição, shell, delegação, diretórios externos e web negados, ressalvada a leitura gerenciada de saídas do OpenCode já documentada. Se não conseguir confirmar ou criar esse subagente, responda `BLOCKED_FOR_REVIEW`, informe a falha exata e pare. Não use `slingshot-worker`, `general`, outro modelo ou fallback como revisor.
>
> Se a confirmação passar, delegue ao `gauntlet-reviewer` uma revisão independente e somente leitura destes oito arquivos do lote P1:
>
> 1. `locales/advice-next-three-targets.pt-BR.json`
> 2. `tools/catalogue-advice-next-three.cjs`
> 3. `tests/advice-next-three-translation.test.cjs`
> 4. `locales/structures.pt-BR.json`
> 5. `index.html`
> 6. `docs/REVISAO_CONSELHOS_TRES_PERFIS_2026-09-25.md`
> 7. `docs/HANDOFF_LLM_COMPLETO.md`
> 8. `docs/PLANO_CONCLUSAO.md`
>
> O revisor pode consultar `source/index.original.html`, `AGENTS.md`, `docs/agent-routes/review.md` e o log local `artifacts/advice-next-three-verify-final.log` somente para validar fonte, regras e evidência. Não forneça credenciais, configurações privadas, dados de participantes ou arquivos externos ao checkout.
>
> Exija que a resposta do subagente declare: identidade do agente; rota/modelo efetivo informado pelo runtime; permissões efetivas observadas; arquivos realmente lidos; achados concretos por gravidade e caminho; limitações; nota justificada de 0 a 10; decisão `APROVADO` apenas com nota mínima 9,0 e nenhum bloqueador, ou `BLOQUEADO`. A revisão deve conferir os 61 campos dos três perfis, preservação dos 235 anteriores, cobertura exata, correspondência da fonte, paridade, casos negativos, ausência de mudanças indevidas no motor e coerência das alegações de 113/113 testes com exit 0.
>
> Devolva integralmente o parecer do `gauntlet-reviewer`, seguido de uma seção curta com a evidência de que a delegação ocorreu. Não aumente a nota, não resuma achados de modo que percam caminhos e não trate a abertura da interface ou um HTTP 200 isolado como prova de revisão.

Se a saída não identificar o `gauntlet-reviewer` e não trouxer seu parecer, a execução não recuperou o Gauntlet.
