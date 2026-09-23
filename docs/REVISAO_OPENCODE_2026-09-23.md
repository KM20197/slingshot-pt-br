# Revisão da orientação OpenCode — 23/09/2026

## Resultado

Foi criado o ponto de entrada `AGENTS.md`, com rotas para tradução, implementação e revisão; o prompt de continuidade `docs/PROMPT_OPENCODE.md`; o subagente `gauntlet-reviewer` em `.opencode/agents/`; e `check_project.ps1`. O handoff e o README apontam para esses arquivos.

A pasta editável é `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. `C:\Users\Administrador\Downloads\Stingshot` contém anexos, um verificador avulso e uma configuração antiga do OpenCode com credencial, que não foi copiada para o repositório. O ZIP Johgo foi localizado em `C:\Users\Administrador\Downloads\Simulador\Refatorar_orientador\Entradas Operacionais\johgo-v3-2-corrigido.zip`; o caminho `Refatorar\_orientador` indicado inicialmente não existia na conferência.

RTK 0.48.0 foi instalado pelo pacote `rtk-ai.rtk` do winget. A instalação verificou o hash do arquivo. `rtk --version`, `rtk gain` e `rtk rewrite 'git status'` foram executados. O plugin global do OpenCode foi instalado em `C:\Users\Administrador\.config\opencode\plugins\rtk.ts` e adaptado para localizar o executável no Windows, pois o plugin gerado usava `which`. A reescrita automática em uma sessão interativa do OpenCode ainda não foi observada; sua presença no disco não demonstra economia efetiva de tokens.

CodeAF e Jev não foram instalados. A URL de instalação de CodeAF no texto anexado não foi confirmada como oficial; a documentação encontrada apresenta `af`, da AgentField, que não foi assumido equivalente. Jev foi mantido como opção condicionada a conta, custo e finalidade, sem uso de dados de participantes.

## Verificação

- Hash SHA-256 de `source/index.original.html`: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
- `opencode --version`: 1.18.32.
- `opencode agent list` reconheceu `gauntlet-reviewer`. O agente nega edição, shell e delegação. A regra geral nega diretórios externos, mas o OpenCode acrescenta leitura no diretório gerenciado de saídas de ferramentas. Isso está descrito nas instruções; não foi alegado isolamento externo absoluto.
- `.\check_project.ps1` terminou com exit 0: build validou 19 scripts e a suíte aprovou 106/106 testes. O script informa quando arquivos novos ainda não entram em `git diff --check`.
- Uma execução anterior da suíte, concorrendo com outro build, terminou com 104/106: duas tarefas atingiram timeout. Os quatro testes dos dois arquivos afetados passaram isoladamente; a execução completa posterior passou 106/106. Não houve alteração no motor para tratar timeouts provocados por concorrência.
- `git diff --check` passou.

## Gauntlet

Revisor independente não editou os arquivos. Nota inicial: **8,5/10**. Ele identificou três problemas de precisão: o verificador regenera `index.html`; arquivos não rastreados não entram em `git diff --check`; e a descrição do isolamento não mencionava a exceção de leitura das saídas gerenciadas pelo OpenCode. As instruções e o script foram corrigidos. Nota final: **9,2/10**, sem falha bloqueadora no escopo desta configuração.

O revisor não executou um ciclo interativo de OpenCode nem comprovou a reescrita automática pelo plugin RTK. Essa validação permanece para a primeira sessão de uso. A revisão desta configuração não aprova a tradução completa nem a aplicação em turma.
