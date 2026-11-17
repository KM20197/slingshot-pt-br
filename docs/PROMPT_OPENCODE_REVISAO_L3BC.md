> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Prompt para OpenCode — revisão independente L3b/L3c

Trabalhe somente em leitura no checkout `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`.

Não edite arquivos, não rode build ou testes, não faça staging, commit, push, rede, publicação nem chamada à Ada. A tarefa é revisão independente, não implementação.

Revise o lote L3b/L3c com foco em:

- `operations-runtime.js`, `locales/operating-models.pt-BR.json`, `tools/operations-patch.cjs`, `save-validation.js` e `tools/build.cjs`;
- `tools/dashboard-localization-patch.cjs`;
- testes `operations-runtime.test.cjs`, `dashboard-localization.test.cjs`, `management-setup.test.cjs`, `bmc-translation.test.cjs` e os testes de save relacionados;
- o HTML gerado apenas como produto do build, nunca como fonte de edição.

Verifique e informe, com `caminho:linha` e citação curta:

1. os únicos IDs econômicos novos são `avam`, `dream` e `quant`;
2. operação, cidade, BMC, metas, pivôs e save têm fronteiras coerentes e falham fechados quando o estado é inválido;
3. não há `fetch`, backend, API, credencial ou dependência do Johgo;
4. L3c só muda apresentação de idioma/moeda e conserva multiplicador numérico 1;
5. crédito, nota, exportação, Ada, concorrentes e eventos gerais não foram adaptados acidentalmente;
6. riscos ou regressões reais, distinguindo evidência estática de hipótese.

Entregue nota de 0 a 10, veredito, achados priorizados e limitações. Não considere uma inspeção visual manual como realizada.

Evidência já disponível do coordenador: `check_project.ps1` passou com 150/150 testes, build reprodutível, 22 blocos de script, hash da fonte original e `git diff --check` rastreado aprovados. A árvore já era suja antes deste lote; não atribua automaticamente todo arquivo modificado ao L3b/L3c.
