> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Pacote P1 para orientação do Gemini

Data original: 25/09/2026. Este documento é o índice auditável histórico do pacote. Ele não prova, sozinho, o conteúdo integral dos arquivos, a execução dos comandos ou o estado Git corrente.

## Papéis atuais

- Gemini: orientador; analisa evidências recebidas e conduz o protocolo com uma ação por vez.
- OpenCode `slingshot-explorer`: levantamento de escopo e caminhos em leitura.
- OpenCode `slingshot-worker`: implementação de lotes autorizados e validações; não aprova o próprio trabalho.
- OpenCode `gauntlet-reviewer`: revisão independente e somente leitura.
- Codex: coordenação do processo, verificação de evidências e apoio ao Gemini enquanto o Antigravity estiver operacionalmente indisponível.
- Usuário: decide e executa staging, commit e push após os gates.

## Escopo do lote P1

Perfis: `marcusWebb` (21 campos), `michaelOkonkwo` (21) e `annaLindqvist` (19), total de 61. O lote deve preservar os 235 campos anteriores de `FUNDER_ADVICE`, demais estruturas, lógica, IDs, valores, ordem, métodos, emojis, siglas e marcadores.

Arquivos destinados ao lote:

1. `locales/advice-next-three-targets.pt-BR.json`
2. `tools/catalogue-advice-next-three.cjs`
3. `tests/advice-next-three-translation.test.cjs`
4. `locales/structures.pt-BR.json`
5. `index.html`
6. `docs/REVISAO_CONSELHOS_TRES_PERFIS_2026-09-25.md`
7. `docs/HANDOFF_LLM_COMPLETO.md`
8. `docs/PLANO_CONCLUSAO.md`

## Evidência declarada pelo executor

- Fonte original: SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
- Validação repetida: hash da fonte esperado, 19 scripts, 113/113 testes e exit 0.
- Log local: `artifacts/advice-next-three-verify-final.log`.
- Relatório do lote: `docs/REVISAO_CONSELHOS_TRES_PERFIS_2026-09-25.md`.
- Revisão independente anterior: 8,8/10 por lacuna de evidência, depois 9,2/10 após nova execução e fechamento documental.
- No checkpoint original, nenhum staging, commit ou push do P1 havia sido realizado. O lote foi fechado depois no commit `65767d417b985c99bf412506b8f58b535f2712e4`; não reutilizar este pacote como instrução para repetir staging ou commit.

Essas declarações devem ser verificadas pelos arquivos e evidências anexados; não devem ser convertidas em confirmação do Gemini sem acesso ao material correspondente.

## Runtime comprovado e gate de revisão

As rotas `slingshot-worker`, `slingshot-explorer` e `slingshot-reviewer` responderam a testes sintéticos. Uma sessão principal `slingshot-worker` delegou ao `gauntlet-reviewer` real, que confirmou leitura, glob e grep permitidos e edição, shell, delegação, web e diretórios externos negados. O ciclo 1 deu 7,8/10 por lacunas de evidência. Após hash original recalculado e `check_project.ps1` repetido com exit 0, 19 scripts e 113/113 testes, o ciclo 2 deu 9,2/10 e aprovou o lote. Registro: `docs/REVISAO_GAUNTLET_RUNTIME_P1_2026-09-25.md`.

Estado histórico do gate de revisão: `APROVADO_LOCALMENTE`. O fechamento posterior do lote está no commit `65767d417b985c99bf412506b8f58b535f2712e4`. Uma conferência em 26/09 observou `HEAD` e a referência local `origin/main` iguais a esse hash, sem nova consulta de rede. Para alegar o estado remoto atual, ainda é preciso atualizar e conferir as referências.

## Itens que devem permanecer fora do lote

Alterações preexistentes ou operacionais fora dos oito caminhos não podem entrar automaticamente no staging. Em especial, conferir `AGENTS.md`, `.opencode/agents/gauntlet-reviewer.md`, `docs/agent-routes/models.md`, o handoff avulso na raiz e o artefato residual de terminal registrado no status local.

## Ordem histórica de fechamento

1. Gemini conferir o pacote completo e distinguir material observado de declarações.
2. Atualizar referências remotas com `git fetch origin`.
3. Conferir sincronia, índice e caminhos externos ao lote.
4. Usuário fazer staging explícito somente dos oito arquivos.
5. Executar `git diff --cached --check` e inspecionar o diff preparado.
6. Criar commit e fazer push apenas por avanço normal, após confirmação do usuário.

Esta sequência já foi superada pelo commit `65767d417b985c99bf412506b8f58b535f2712e4`. Não iniciar execução de P2 nem declarar o projeto pronto para turma a partir deste lote; investigação somente de leitura para preparar a matriz P2 requer referência Johgo identificada e permanece sem autorização para alterar dados.
