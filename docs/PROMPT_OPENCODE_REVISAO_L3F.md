> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Prompt para OpenCode — revisão independente L3f, somente leitura

Trabalhe somente em leitura no checkout `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. Não edite arquivos, não execute build, testes, Git com escrita, staging, commit, push, rede ou delegação.

Revise o lote L3f para `avam`, `dream` e `quant`. Dê nota de 0 a 10 e veredito. Cite caminhos, linhas e trechos reais.

Confirme especialmente:

1. `operations-runtime.js`: `net` pode ser negativo; `purchases`, `consumed`, `charge`, `cashCosts` e `cashDelta` têm papéis distintos; não há dupla saída de caixa por compra e consumo.
2. `tools/operations-patch.cjs` e `index.html`: o trio passa por `SlingshotOperations.advance`, e a contribuição operacional chega ao cálculo de caixa sem depender de `customers.length`.
3. Compatibilidade: `operations-runtime.js` aceita saves `brOperations` versão 1 e exige os campos novos somente na versão 2; `save-validation.js` valida `brBusiness` antes de restaurar.
4. `people-contracts-runtime.js`, `business-adapter.js`, `locales/people-contracts.pt-BR.json` e `tools/people-contracts-patch.cjs`: proprietário não é empregado; contratos externos não alteram `metrics.staff`, `hiredStaff`, `maxAP` ou `baseAP`; a nova rota está limitada aos três IDs.
5. `tools/build.cjs`: os módulos entram na ordem correta e `index.html` é gerado, não fonte manual.
6. Não houve alteração funcional em Ada, Supabase, crédito, nota, exportação, eventos, concorrentes, `VENTURE_MARKETS`, outros nove IDs ou `source/index.original.html`.
7. Leia também `docs/ESPECIFICACAO_L3F_PESSOAS_CONTRATOS.md`, `docs/REVISAO_L3F_2026-09-30.md`, `tests/business-cashflow.test.cjs` e `tests/people-contracts.test.cjs`.

Contexto de verificação já executada pelo coordenador: hash do original preservado; build reprodutível e testes específicos passaram. `check_project.ps1` registrou 158/160, com duas falhas preexistentes em `tests/location-translation.test.cjs` por `Channels` versus `Canais` numa pergunta de fomento legado, fora deste lote. Não trate essas duas falhas como defeito criado por L3f, mas informe se achar impacto indireto comprovável.
