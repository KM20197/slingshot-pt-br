# Iniciar o OpenCode neste projeto

Abra um terminal PowerShell no checkout brasileiro:

```powershell
Set-Location 'C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br'
opencode
```

O OpenCode instalado encontra `AGENTS.md` na raiz e já dispõe de uma configuração global de provedor na máquina. Não copie a configuração antiga de `C:\Users\Administrador\Downloads\Stingshot\opencode.json` para o repositório público: ela contém uma credencial. O arquivo central de regras e os roteiros de `docs/agent-routes/` são versionados e também acompanham o checkout obtido pelo GitHub.

Cole este prompt na sessão aberta no diretório acima:

> Continue o projeto Slingshot Brasil desta pasta. Primeiro leia `AGENTS.md`, `docs/HANDOFF_LLM_COMPLETO.md`, `docs/DECISOES_APROVADAS.md` e apenas a rota pertinente em `docs/agent-routes/`. Confirme o diretório, o Git atual, o hash de `source/index.original.html` e o próximo lote realmente pendente; não assuma que números do handoff continuam atuais. A pasta `C:\Users\Administrador\Downloads\Stingshot` contém os anexos e referências, enquanto este checkout é `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. Faça uma alteração delimitada por vez, preserve o motor e os valores salvo adaptações aprovadas, rode `.\check_project.ps1` e teste o comportamento afetado. O script regenera `index.html`; confira o diff depois e inclua arquivos novos antes da auditoria final. Use o agente `gauntlet-reviewer` somente se confirmar que suas permissões efetivas negam shell e escrita e restringem diretórios externos; nesta instalação há uma exceção gerenciada de leitura para saídas de ferramentas do OpenCode. Peça nota fundamentada de 0 a 10 a um revisor que não editou o lote; corrija e reavalie em até três ciclos. Documente evidências, falhas, nota inicial/final, correções e limites. Se o revisor independente não estiver disponível, marque `BLOCKED_FOR_REVIEW` em vez de declarar aprovação. Use `rtk` apenas se o comando estiver instalado e sua integração funcionar; caso contrário, continue normalmente. Não instale CodeAF ou Jev automaticamente. Jev pode auxiliar somente na triagem opcional de decisões fechadas, com dados de código não sensíveis, se houver conta, custo autorizado e integração verificada; não o use para dar veredito, testar código, processar identificação de alunos ou substituir a revisão independente. Ao final, informe arquivos, comandos, testes, revisão, estado local e estado no GitHub. Não declare o jogo pronto para turma antes dos critérios do handoff.

Para uma tarefa específica, substitua a instrução genérica `Faça uma alteração delimitada por vez` por uma descrição observável do lote desejado. Exemplo: “Conclua os próximos perfis de `FUNDER_ADVICE` a partir de `klausMuller`, sem alterar dados técnicos ou perfis anteriores”.

## Estado das ferramentas

- O Gauntlet descrito no handoff é um **procedimento do projeto**. O subagente local `gauntlet-reviewer` implementa a separação de leitura, mas não equivale automaticamente à skill externa Claudex Loop nem garante modelos diferentes.
- O arquivo `check_project.ps1` é a verificação executável do projeto, incluindo build que regenera `index.html`. O ciclo é baseado em um objetivo observável, com máximo de três tentativas por lote. Não existe processo agendado ou loop autônomo infinito.
- CodeAF não foi encontrado como comando instalado. A URL `https://agentfield.ai/get/codeaf` do texto anexado não foi confirmada como instalador oficial. A documentação oficial consultada descreve a CLI `af` do AgentField, um produto distinto; não se deve tratar os nomes como equivalentes sem prova.
- Jev não foi encontrado como comando ou integração local. A documentação consultada o descreve como serviço de classificação e roteamento por API, com planos pagos. Seu uso é opcional, fora do jogo e nunca recebe dados de participantes.
- RTK 0.48.0 foi instalado em 23/09/2026 via `winget`. `rtk --version`, `rtk gain` e `rtk rewrite 'git status'` foram verificados. O plugin global do OpenCode foi criado e adaptado para Windows em `C:\Users\Administrador\.config\opencode\plugins\rtk.ts`. Reinicie o terminal e o OpenCode; a reescrita automática dentro de uma sessão do OpenCode ainda exige teste real. Se falhar, use `rtk` manualmente ou continue sem compressão. A economia de 90% do texto anexado não é uma garantia.

## Mapa de fontes

| Endereço | Papel |
|---|---|
| `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br` | checkout editável e fonte dos commits |
| `https://github.com/KM20197/slingshot-pt-br` | remoto público do checkout |
| `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\source\index.original.html` | original imutável, usado pelo build |
| `C:\Users\Administrador\Downloads\Stingshot\The-Slingshot-Simulation-main.zip` | anexo original recebido |
| `C:\Users\Administrador\Downloads\Stingshot\index_modificado.html` | referência da exportação da nota |
| `C:\Users\Administrador\Downloads\Simulador\Refatorar_orientador\Entradas Operacionais\johgo-v3-2-corrigido.zip` | referência Johgo localizada neste computador para estudar empreendimentos brasileiros |

O checkout brasileiro tem `README.md`, `docs/INVENTARIO.md`, `docs/DECISOES_APROVADAS.md` e o handoff para orientar a IA. Arquivos fora do checkout exigem uma leitura deliberada no computador do usuário; um agente que trabalha somente no GitHub não terá acesso aos anexos locais. O original usado pelo build já está versionado em `source/index.original.html`.

O caminho citado inicialmente, `C:\Users\Administrador\Downloads\Simulador\Refatorar\_orientador`, não existia na conferência de 23/09/2026. Use o ZIP Johgo encontrado acima como ponto de partida e verifique seu conteúdo antes de extrair ou adaptar.
