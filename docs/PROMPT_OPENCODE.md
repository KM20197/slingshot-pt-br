# Iniciar OpenCode no checkout correto

Execute no PowerShell:

```powershell
Set-Location -LiteralPath 'C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br'
opencode
```

Entrada: AGENTS.md; estado: docs/ESTADO_ATUAL.md; coordenação: docs/MANUAL_ORQUESTRACAO.md; contratos: docs/PROTOCOLO_OPENCODE.md; caminhos: docs/MAPA_ARQUIVOS.md.

Prompt permanente:

> Continue Slingshot Brasil no checkout C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br. Leia AGENTS.md, docs/ESTADO_ATUAL.md, docs/MANUAL_ORQUESTRACAO.md e docs/DECISOES_APROVADAS.md. Identifique o lote autorizado no estado vivo e carregue só a rota necessária. Gemini e Codex coorquestram durante a preparação do Gemini. Use explorer/explore para leitura, worker para implementar no escopo e gauntlet-reviewer em sessão independente para revisão. Não repetir gates P2 ou tradução de FUNDER_ADVICE vindos de prompts antigos. Confirme arquivos/Git/hash quando o papel permitir shell; explorer e revisor recebem essas provas do coordenador. Preserve a árvore existente, o original, os parâmetros não aprovados e saves. Ao fechar a etapa, o escritor atualiza estado/relatório e executa node tools/export-gemini-drive.cjs. Não fazer staging/commit/push ou publicação por iniciativa própria.

Os papéis e comandos com --dir estão em docs/PROTOCOLO_OPENCODE.md. Confira a configuração efetiva filtrada pelo coordenador; não anexar opencode.json bruto, configurações privadas, chaves ou logs de requisição. Explorer/revisor negam shell e escrita; a exceção gerenciada de tool-output não é isolamento absoluto.

Antigos prompts datados descrevem o escopo histórico indicado. Revalide sua necessidade no estado atual antes de executá-los. Não instalar CodeAF/Jev/RTK como pré-requisito. Não pressupor quotas ou rotas gratuitas ilimitadas.
