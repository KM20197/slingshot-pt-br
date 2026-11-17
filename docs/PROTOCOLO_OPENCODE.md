# Protocolo dos três papéis — OpenCode

## Conferência V2 e limites de ferramentas —17/10/2026,r387

OpenCode observado2.0.32. No lote RajC2,worker executou duas shell e escreveu PROPOSTA_WORKER_UPDATED.json fora do arquivo contratado;comandos restritos a ler/copiar propostas,sem produto tocado. Não adotar autorrelato de ausência de execução contra trace. V2usa permissions/shell/subagent;V1permission/bash/task pode ser convertida,mas a intenção textual não comprova isolamento.

Para novos workers/explorers,antes de delegar,negar shell/execute/subagent/web explicitamente por processo e permitir ao worker edição somente no artefato do contrato. Não confiar apenas na proibição escrita no prompt ou em permissões ask/salvas. Em r393,worker real CHAR-RAJ-FINAL-R392 terminou0com duas leituras da raiz negadas e única escrita em PROPOSTA_WORKER.json,sem shell. Proposta32literal rejeitada pelo coordenador por conteúdo,sem confundir permissão com qualidade. Sondas locais deste lote confirmaram shellindisponível/writeexternanegada/propostapermitida. A sonda sintética adicional do revisor expirou45ssem requisições:falha preservada,não valida novas permissões nem é parecer. Sonda localC2do revisor neste lote passou0:apenas read oferecido,shell forçada recusada antes deexecutar,sem modelo externo. C1timeout preservado. Conferir trace real de cada chamada;sonda não é parecer nem isolamento absoluto.

Antes de revisão,usar overlay privado por processo com agents.gauntlet-reviewer.permissions:denygeral,readsomente arquivos públicos do lote,e policies tool.use que negam shell/execute/edit/subagent/webfetch/websearch. Não mudar combos ou credenciais para isso. Prova funcional em artifacts/char-raj-contexto-20261017-r384/SONDA_PERMISSAO_LOCAL_RESULTADO.json:servidor sintético local,sem geração externa,só read oferecido,shell forçada recusada como indisponível antes deexecutar. Essa prova não é revisão do jogo,nem certifica isolamentoabsoluto. Consultas agentes retornaramlistasvazias/404e não foram tomadascomo prova. Conferir novo trace real do revisor.

Documentação oficial:https://opencode.ai/v2/docs/permissions. Não repetir chamadas de modelo sem limite para diagnosticar permissão;usar sonda local pública. Preservar arquivos/logs/falhas.

Atualizado em 07/10/2026. Gemini e Codex coorquestram na transição; OpenCode explora, implementa e revisa. Estado: `docs/ESTADO_ATUAL.md`; manual: `docs/MANUAL_ORQUESTRACAO.md`.

## Diretório e descoberta

### Conferência documental de 14/10/2026 — handoff r230

`opencode --version` retornou `opencode v2.0.29`, saída nativa0; prova em `artifacts/handoff-chat-20261014-r230/OPENCODE_VERSION.log` e `_EXIT.txt`. Nesta etapa, explorer explícito executou `run --standalone --agent explorer --model 9router/slingshot-explorer`, somente leitura, saída0. A2.0.27 abaixo é registro histórico; a rejeição de `--dir` foi observada naquela versão, não retestada aqui. Continuar iniciando a CLI no checkout canônico, sem `--dir`, com agente/modelo explícitos, capturando cabeçalho/log/exit. Nenhuma instalação, migração, configuração de provedor ou serviço pago foi feita para esta conferência.

### Compatibilidade observada em 12/10/2026 — lote de entrada/ajuda r142

O comando instalado passou de 1.19.0 (registro histórico r139) para 2.0.27, no mesmo launcher npm local. A versão atual de `run` recusa `--dir`. Execute a partir do checkout obrigatório e use `run --standalone --agent ...`; não migrar configuração nem mudar modelos por essa diferença de CLI. O primeiro comando V1 falhou com saída1 antes de criar produtos. A execução V2 confirmou `9router/slingshot-worker`, mas terminou com saída1 ao encontrar `exo-free` descontinuado, depois de leituras e sem criar os produtos. O modelo citado difere da cadeia histórica descrita em models.md; não pressupor que a rota continua tendo exatamente os mesmos membros ou disponibilidade.

Worker apresentou relatos contraditórios de shell indisponível/disponível; houve saída de Git em leitura, mas nenhum `node --check`, build ou suíte entregue. Capacidade observada e declaração do agente são fatos distintos. Codex assume o contrato delimitado; revisão independente segue necessária. Configuração não foi alterada e nenhum serviço/fallback pago foi habilitado. Logs sanitizados: artifacts/entrada-ajuda-br-20261012-r142/WORKER.log e WORKER_V2.log. A ressalva de tool-output e as permissões pretendidas abaixo continuam; não declarar isolamento técnico absoluto da versão nova sem verificação específica.

Checkout obrigatório: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`.
Não iniciar o trabalho em `C:\Users\Administrador\Documents\ChatGPT\Estilingue` ou `C:\Users\Administrador\Downloads\Stingshot`.

`AGENTS.md` é a entrada. `opencode.json` carrega automaticamente os dois documentos curtos `docs/ESTADO_ATUAL.md` e `docs/MANUAL_ORQUESTRACAO.md`; decisões, mapa e rotas são lidos conforme a tarefa. A skill em `.agents/skills/slingshot-orchestrator/SKILL.md` é descoberta sob a raiz do projeto. `explorer`, `explore`, `worker` e `gauntlet-reviewer` usam modo `all`, permitindo seleção direta e delegação como subagente. Conferir o nome/modelo efetivo no início; não aceitar fallback silencioso para um agente com escrita numa exploração/revisão.

| Papel | Agente CLI | Modelo | Permissões pretendidas |
|---|---|---|---|
| Explorar | `explorer` ou `explore` | `9router/slingshot-explorer` | leitura/busca/lista e skill do projeto; sem shell/edição/rede/delegação |
| Implementar | `worker` | `9router/slingshot-worker` | leitura/edição/comandos locais para o lote; sem nova delegação |
| Revisar | `gauntlet-reviewer` | `9router/slingshot-reviewer` | leitura/busca/lista e skill do projeto; sem shell/edição/rede/delegação |

Modo `all` não concede ferramentas: as permissões de cada papel continuam válidas. O coordenador confere a configuração efetiva sem compartilhar providers/chaves. A exceção gerenciada de leitura de tool-output existe; não alegar sandbox absoluto. Proteções de ferramenta não substituem a delimitação do contrato, especialmente quando há shell no worker.

## Contrato obrigatório

Fornecer em um pedido: lote e objetivo, autorização humana aplicável, checkout absoluto, arquivos de entrada, diretórios/arquivos de escrita permitidos, invariantes, aceite, validação e evidências a devolver. Todos os caminhos fora do checkout são explícitos e somente leitura, salvo autorização própria. Novos parâmetros/regras não estão aprovados só porque um outro LLM sugeriu.

Prompt de exploração:

> Use o agente explorer no checkout C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br. Leia a entrada atual e apenas as fontes do lote [identificador e objetivo fornecidos pelo coordenador]. Localize consumidores, arquivos, linhas e lacunas; se precisar de estado Git/hash, peça a prova ao coordenador, pois você não tem shell. Não edite, execute comandos, delegue ou leia configurações privadas. Entregue lista curta de achados com fonte, limites e arquivos necessários ao worker.

Prompt do worker:

> Use worker no checkout C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br. Execute somente o contrato anexado: objetivo, autorização, arquivos de leitura/escrita, limites e aceite precisam estar preenchidos pelo coordenador. Preserve alterações anteriores e original; não edite HTML gerado como fonte. Faça validações proporcionais, registre arquivos/saídas/exit codes e entregue para revisão independente. Atualize estado/relatório e execute node tools/export-gemini-drive.cjs ao fechar a etapa. Não aprovar o próprio trabalho, iniciar outro lote, publicar ou fazer staging/commit/push. Para L3k-b0, escrita de script/resultados restrita a artifacts/l3kb0; somente documentação do lote pode ser atualizada além disso, sem alterar catálogos/runtime/save/HTML.

Prompt do revisor:

> Use gauntlet-reviewer em sessão nova no checkout C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br. Revise o lote e as provas identificadas pelo coordenador. Leia só fonte/documentos pertinentes e artefatos sanitizados; sem shell, edição, rede, delegação ou leitura de configuração privada. Verifique se as provas sustentam o aceite, identifique erro concreto e impacto por arquivo/linha e dê nota justificada de 0–10 para o escopo. Falta de prova é pendência. Não atualizar arquivos: entregue achados para o coordenador. Não confundir aprovação do lote com jogo concluído.

## Comandos prontos de conferência

Os comandos abaixo fazem apenas leitura documental. Não são autorização de implementação econômica.

```powershell
Set-Location -LiteralPath 'C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br'
opencode run --standalone --agent explorer 'Leia docs/ESTADO_ATUAL.md e docs/MAPA_ARQUIVOS.md. Informe o checkout, a revisao do estado e a proxima tarefa, citando arquivos. Somente leitura; sem shell, escrita ou configuracoes privadas.'
```

```powershell
Set-Location -LiteralPath 'C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br'
opencode run --standalone --agent worker 'Confira por leitura docs/ESTADO_ATUAL.md e docs/PROTOCOLO_OPENCODE.md. Informe seu papel, checkout e escrita permitida em L3k-b0. Nao implemente nem altere arquivos nesta conferência.'
```

```powershell
Set-Location -LiteralPath 'C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br'
opencode run --standalone --agent gauntlet-reviewer 'Confira somente por leitura docs/ESTADO_ATUAL.md, docs/MANUAL_ORQUESTRACAO.md e docs/PROTOCOLO_OPENCODE.md. Avalie coerencia dos papeis, limites e proxima tarefa. Cite achados e nota; nao execute shell nem edite.'
```

Uma sessão nova por execução mantém a revisão distinta da implementação. Em uso interativo, selecionar o agente correto; não reusar a conversa do construtor como revisor independente. Modelos/rotas não garantem gratuidade permanente; o smoke test verifica disponibilidade, não qualidade econômica nem custo futuro. Se houver rota falha, registrar e usar Codex para ações locais autorizadas; revisão permanece pendente até ser independente.

## Fechamento

O worker/coordenador registra lote, arquivos, comandos e provas; o revisor informa achados. Correções de código têm até três ciclos e mínimo 9/10. Conferir o diff do lote e os arquivos novos. Atualizar o estado mesmo em falha; reexportar as fontes do Drive. Não manter loop infinito nem aguardar o usuário para ações técnicas executáveis localmente.
