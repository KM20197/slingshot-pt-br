# Handoff completo — Slingshot Brasil, continuidade após L3k-a

> **Snapshot de 07/10/2026.** Continuidade viva em `docs/ESTADO_ATUAL.md`; protocolo permanente em `docs/MANUAL_ORQUESTRACAO.md`. O antigo `docs/PROMPT_GEMINI_ORIENTADOR.md` foi corrigido nesta reconciliação: a observação de desatualização no corpo abaixo é histórica. Gemini e Codex seguem coorquestrando na transição. Consulte o estado vivo antes de usar o prompt final deste snapshot.

**Consolidado em 07/10/2026.** Use este documento como ponto de entrada do próximo chat. O usuário quer continuidade autônoma: executar leituras, análises, testes, correções e lotes já autorizados sem interrompê-lo por decisões técnicas rotineiras. Solicitar intervenção somente quando uma escolha de conteúdo ou parâmetros concretos realmente mudar o resultado, quando for necessário que ele opere o OpenCode/Gemini, ou para ações externas ainda não autorizadas. Explicar o motivo e mostrar o resultado concreto antes de pedir aprovação. Comunicar em português do Brasil, com tom formal, objetivo e prático.

## 1. Onde trabalhar e o que preservar

- **Checkout editável:** `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`.
- **CWD de muitos chats Codex:** `C:\Users\Administrador\Documents\ChatGPT\Estilingue`; não é o checkout do jogo.
- **Anexos de referência:** `C:\Users\Administrador\Downloads\Stingshot`; não é o checkout.
- **Repositório:** `KM20197/slingshot-pt-br`, remoto `https://github.com/KM20197/slingshot-pt-br.git`.
- **Git observado em 07/10:** branch `main`, HEAD `36714758dd64c7b4bd9107633c946f969b5d3706`. Trata-se de observação local, não prova de sincronização remota atual.
- **Árvore local:** muito suja e intencional, com centenas de caminhos alterados/não rastreados. Preservar tudo. Não usar reset, clean, staging, commit ou push por iniciativa do agente; a prática do projeto reserva essa integração Git ao usuário após revisão.
- **Fonte original imutável:** `source/index.original.html`, SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
- **HTML gerado:** `index.html` somente por `npm run build`; nunca editar como fonte.
- **Dados de participantes:** somente navegador/arquivo local de exportação acadêmica; não enviar a OpenCode, Gemini, logs ou serviços externos. Não copiar credenciais nem configuração global de provedores para o repo.

Leia primeiro `AGENTS.md`, `docs/DECISOES_APROVADAS.md`, `docs/HANDOFF_LLM_COMPLETO.md` e apenas a rota pertinente em `docs/agent-routes/`. Os registros antigos em `HANDOFF_LLM_COMPLETO.md` são históricos; os checkpoints mais recentes e as retificações neste documento prevalecem quando houver divergência.

## 2. Estado de entrega comprovado

Os 12 empreendimentos brasileiros têm modelos operacionais em `locales/operating-models.pt-BR.json`, executados por `operations-runtime.js`:

`avam`, `dream`, `quant`, `vanguard`, `legal`, `arene`, `voed`, `aether`, `edu`, `cyber`, `terra`, `sorgente`.

L3k-a ampliou `market-isolation.js` para os 12 IDs, neutralizando os efeitos econômicos legados de mercado para operações locais. Revisão independente Faraday: 9,4/10 inicialmente e 9,8/10 após ligar a lista testada ao catálogo operacional. `npm run build` gerou o HTML; testes direcionados passaram 25/25 após correção do cenário legado de `tests/management-setup.test.cjs`. Em 06/10, `check_project.ps1` terminou com **exit 0 e 263/263 testes aprovados** (aproximadamente 782,5 s), conferiu build e hash original e avisou que 247 arquivos não rastreados não entram em `git diff --check`. Esses números são o último teste integral concluído; não são validação de qualquer trabalho posterior de calibração.

O catálogo `locales/people-contracts.pt-BR.json` ainda cobre somente os seis primeiros IDs (`avam`, `dream`, `quant`, `vanguard`, `legal`, `arene`). `people-contracts-runtime.js` implementa configuração, custos recorrentes, contratação, desligamento, contratos, redução emergencial e validação de `brBusiness` v1. `business-adapter.js` aplica bônus de capacidade/demanda somente quando esse catálogo reconhece o ID. `locales/operational-decisions.pt-BR.json` e `operational-decisions-runtime.js` também cobrem apenas os seis primeiros; L3k-c será necessário para os demais. O encerramento e a localização já servem ao conjunto de 12. Não declarar partida completa ou pronta para turma.

Arquivos de registro centrais:

- `docs/AUDITORIA_L3K_INTEGRACAO_OPERACIONAL_2026-10-06.md`: lacunas entre módulos.
- `docs/PROPOSTA_L3KA_ISOLAMENTO_MERCADOS_2026-10-06.md`: escopo e resultado do L3k-a.
- `docs/HANDOFF_ASTRA_MEDIO_L3KB_PESSOAS_CONTRATOS_2026-10-06.md`: pedido original ao Astra.
- `docs/PROPOSTA_L3KB0_CALIBRACAO_PESSOAS_2026-10-07.md`: cenários planejados.
- `docs/RELATORIO_L3KB0_CALIBRACAO_2026-10-07.md`: **tabela histórica invalidada**; ler a retificação no topo antes de qualquer uso.
- `docs/ESPECIFICACAO_L3F_PESSOAS_CONTRATOS.md`, `docs/ESPECIFICACAO_L3G_DECISOES_OPERACIONAIS.md`, `docs/ESPECIFICACAO_L3I_SERVICOS_2026-10-06.md`, `docs/ESPECIFICACAO_L3J_INDUSTRIA_2026-10-06.md`: contratos e limites por família.
- `docs/PLANO_CONCLUSAO.md`: visão ampla, com checkpoints antigos a reconciliar.

## 3. Última resposta do Astra Médio

O chat Codex **“AstraMedio Jogo”**, ID `01a10ee3-0dda-7cd2-8f95-aff47c00c69d`, foi lido em 07/10. Sua resposta final mais recente concorda em adiar a implementação dos parâmetros de L3k-b e recomenda:

1. Separar calibração de valores da limitação estrutural de `edu`: `activeBase` é limitado a `baseCapacity` (32), então o bônus de equipe pode elevar capacidade disponível sem ampliar a base ativa.
2. Simular os perfis ainda ausentes do catálogo **em memória**, aplicando de fato custos e bônus candidatos, sem alterar arquivos do projeto.
3. Medir caixa completo: caixa inicial, despesas existentes, reposição, recebíveis, encargos locais e obrigações financeiras aplicáveis; separar competência de fluxo de caixa e registrar insolvência antes de Q16.
4. Comparar a mesma situação e semente inicial: operação atual sem `brBusiness`; equipe inicial nas quatro combinações dos dois contratos; equipe de 0 a 5 pessoas com supervisor; e trajetória explícita de contratações/redução emergencial. Apurar menor caixa, trimestre de insolvência, custos acumulados, efeito marginal e ponto de equilíbrio alcançável.

O Astra ressalvou que essa análise isolada não comprova a partida completa, porque as decisões trimestrais dos seis casos novos ainda dependem de L3k-c. A proposta inicial do Astra (no mesmo chat) sugeria custos trimestrais completos de 38 para `voed`/`edu`, 41 para `aether`, 46 para `cyber`/`terra`/`sorgente`, equipes iniciais de 2 e máximas de 5, e bônus comercial de demanda `+1`. São **candidatos**, não valores aprovados.

## 4. Correção essencial da calibração anterior

A simulação temporária que gerou a tabela de `RELATORIO_L3KB0_CALIBRACAO_2026-10-07.md` tinha dois defeitos verificáveis:

- O laço incrementava `g.turn` tanto no corpo quanto no `for`. Executou Q1, Q3, ..., Q15: **oito**, não dezesseis avanços.
- O cenário `max` adicionava bônus de capacidade, mas não os custos dos três integrantes extras. Portanto, a igualdade de caixa entre `initial` e `max` era artificial.

Ela também subtraiu custos temporários de `cashDelta` operacional sem partir do caixa inicial nem integrar todas as despesas e obrigações do jogo. A tabela e a antiga conclusão de inviabilidade foram explicitamente retificadas no relatório e no handoff geral. **Não transportar seus números como resultado econômico.** A restrição `edu.activeBase <= m.baseCapacity`, porém, é confirmada diretamente em `operations-runtime.js` e seus testes.

## 5. Próxima tarefa executável: refazer L3k-b0

Este é o próximo lote. O usuário já mandou prosseguir com a calibração e pediu este handoff; não é preciso pedir nova permissão para análise local, documentação e testes. A implementação econômica L3k-b exige, ao fim da análise, proposta concreta de valores e decisão do usuário, conforme `AGENTS.md` e `docs/DECISOES_APROVADAS.md` (não mudam números/fórmulas/save sem decisão aprovada).

Produzir um **script reprodutível e isolado**, preferencialmente em `artifacts/` ou diretório temporário ignorado, sem escrever em catálogos/runtime/HTML. Executar os 16 trimestres consecutivos para os seis IDs. O script precisa aplicar os parâmetros candidatos em memória; usar a fórmula real de capacidade/demanda ou um adaptador temporário claramente equivalenciado e testado. Acrescentar custo real de cada integrante nos cenários 0–5, cada combinação de contratos, e os efeitos de contratação/redução emergencial. Reiniciar estado e semente por cenário. Registrar por trimestre demanda, capacidade, unidades, perdas, compras, receitas, recebimentos, custos operacionais, custos de pessoas/contratos, saldo de caixa, base ativa/ociosidade nos serviços, mínimo de caixa e trimestre de insolvência. Separar uma simulação operacional neutra de uma simulação de partida com caixa inicial, custos fixos de cidade/gestão, financiamento e choques/decisões aplicáveis. Se a partida completa ainda não puder ser simulada por L3k-c, documentar exatamente os componentes ausentes, sem imputar sustentabilidade global.

Antes de tirar conclusões, comparar manualmente alguns trimestres com `operations-runtime.js`, validar que Q1–Q16 aparecem uma vez, que os custos do cenário máximo excedem o inicial, que `brBusiness` ausente não recebe bônus/custo, e que `edu` mantém o teto atual. Solicitar revisão independente da metodologia e dos resultados, com nota e correções limitadas a três ciclos. Depois, redigir proposta L3k-b revisada por ID: parâmetros completos, efeito marginal comprovado, tradeoffs e indicação de alteração de regra separada para `edu`, se necessária. Só implementar o catálogo após aprovação dessa proposta. Não iniciar L3k-c por inferência dos resultados.

## 6. Divisão de trabalho desejada pelo usuário

**Gemini:** orientador/orquestrador conceitual principal em transição. Recebe este handoff, propostas e resultados sanitizados para conciliar prioridades, pressupostos econômicos e gates. Não tem acesso automático ao checkout neste ambiente: `gemini` não foi encontrado no PATH em 07/10, e o chat Gemini separado não recebe mensagens automaticamente deste chat. Não declarar que leu ou testou arquivos locais sem evidência. O usuário pode repassar o handoff ao Gemini quando desejar; Codex prossegue com trabalho local autorizado enquanto isso. O antigo `docs/PROMPT_GEMINI_ORIENTADOR.md` contém um gate P2 historicamente ultrapassado; não o usar como estado corrente sem revisão.

**Codex:** coordena em paralelo com Gemini, verifica o checkout e evidências, delimita lotes, resolve integração entre motores/saves e executa ações locais quando o OpenCode não concluir. Não se apresentar como revisor independente do próprio trabalho. Não bloquear trabalho local aguardando resposta do Gemini quando a tarefa já estiver autorizada.

**OpenCode:** preferir seu uso efetivo nos três papéis, com delegação por lotes pequenos e inspeção do resultado pelo Codex:

| Papel | Agente configurado | Permissões/intenção |
| --- | --- | --- |
| Exploração | `explorer` / `explore`, modelo `9router/slingshot-explorer` | leitura/busca/listagem, sem shell/edição |
| Implementação | `worker`, modelo `9router/slingshot-worker` | leitura, edição e comandos locais conforme configuração efetiva; `task` negado para impedir nova delegação |
| Revisão | `gauntlet-reviewer`, modelo `9router/slingshot-reviewer` | somente leitura; shell, edição, rede e delegação negados; sessão independente do construtor |

OpenCode **está instalado** no host (`opencode --version`: `1.18.34`; CLI em `C:\Users\Administrador\AppData\Roaming\npm\opencode.ps1`). `opencode run --help` confirmou opções `--agent`, `--dir` e `--file`; `opencode.json` do repo configura os papéis, e o histórico do projeto registra que o worker leu/editou arquivos locais. Logo, OpenCode pode trabalhar no mesmo checkout como Codex quando o agente e suas permissões efetivas permitirem. Confirmar um smoke test curto de rota/modelo/permissões no início do lote e verificar diffs após cada execução. Para L3k-b0, delegar primeiro a inspeção de consumidores ao `explorer`; depois o script de calibração ao `worker` com diretório de escrita delimitado; por fim revisão independente ao `gauntlet-reviewer`. O coordenador executa e registra as provas de testes e corrige achados. Não conceder ao revisor shell/edição para facilitar a tarefa.

**Google Antigravity:** pode ler/editar/rodar testes quando instalado e com acesso ao workspace, mas **não é o único meio** de fazê-lo. Não foi encontrado no PATH deste host em 07/10; isso não prova ausência do aplicativo gráfico. Seu plano gratuito tem quota semanal de agentes sujeita à capacidade e a mudanças. Portanto, é alternativa opcional quando disponível, não bloqueio de L3k-b0 nem substituto obrigatório do OpenCode. Não presumir agentes ilimitados. Fontes oficiais conferidas em 07/10: [planos do Antigravity](https://antigravity.google/docs/plans) e [preços](https://antigravity.google/pricing).

**Gratuidade e dados:** as rotas `9router/slingshot-*` foram configuradas como gratuitas em data anterior, mas disponibilidade, preço e limites podem mudar; conferir antes de rodadas longas e não ativar fallback pago. A [documentação de permissões do OpenCode](https://opencode.ai/docs/agents/) confirma que `read`, `edit`, `bash` e `task` são controláveis por agente. Gemini CLI, se futuramente instalado, também tem quotas gratuitas; [os limites oficiais](https://geminicli.com/docs/resources/quota-and-pricing/) variam por autenticação e modelo. O usuário pediu preferência por recursos gratuitos, não contratação automática de serviço ou plano.

## 7. Rotina de execução e comunicação

1. Conferir `git status --short`, HEAD e hash original no checkout correto; não confundir mudanças anteriores com o lote atual.
2. Delimitar um único lote e seus arquivos. O explorador OpenCode devolve caminhos/achados curtos; o Codex decide o contrato com base em decisões já aprovadas.
3. Worker OpenCode implementa somente o escopo autorizado. Evitar trabalho concorrente de escrita nos mesmos arquivos. Se a rota falhar, Codex pode executar o lote sem esperar o usuário operar ferramenta externa.
4. Rodar testes proporcionais, build quando fonte/HTML mudou, `check_project.ps1` após código, hash, diff e inspeção do HTML gerado. A última suíte integral levou cerca de 13 minutos; comunicar progresso e esperar seu exit code antes de afirmar aprovação.
5. Revisão independente em leitura, nota inicial/final, achados e correções, até 9/10 em no máximo três ciclos. Se não completar, registrar a limitação real; não inventar nota.
6. Atualizar proposta, relatório e `docs/HANDOFF_LLM_COMPLETO.md` com resultados, limites e próximo passo. Não declarar edição pronta para turma sem partida de ponta a ponta online/offline, revisão visual, tradução/adaptação pendente e calibração.

O usuário não deve ser tratado como operador de cada comando. Pedir sua intervenção no OpenCode ou no Gemini apenas quando a ferramenta não puder ser acionada/observada localmente ou quando for necessária uma decisão dele. Não interromper para aprovar correções reversíveis de teste, documentação ou implementação já delimitada por decisão aprovada. Para números ou regras econômicas novas, entregar proposta concreta e revisável antes da decisão.

## 8. Próximos lotes após L3k-b0

1. Revisar resultados da calibração correta com Gemini (conceito) e revisor OpenCode (evidência/código); decidir valores de L3k-b por ID e eventual lote de regra específico para `edu`.
2. Implementar L3k-b em catálogo/testes e, somente se demonstrado necessário, runtime/adaptador, preservando saves anteriores de `brBusiness` v1 e os seis perfis já existentes. Validar configuração, custos uma vez, contratação/desligamento, contratos, emergência, ausência de AP/equity e restauração.
3. Projetar L3k-c para decisões operacionais dos seis IDs novos; respeitar as famílias e o contrato de efeito de um trimestre. Testar integração no HTML gerado e saves.
4. Executar partidas representativas completas, inclusive crise, marcos, pivôs, caixa e restauração, por família. Revisar conteúdo médico/alimentar/industrial apenas dentro dos limites didáticos aprovados.
5. Retomar P1/P3 e critérios do plano de conclusão; não confundir aprovação de um lote econômico com conclusão geral do jogo.

## 9. Prompt inicial para o novo chat

> Continue o Slingshot Brasil no checkout `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. Leia `AGENTS.md`, `docs/DECISOES_APROVADAS.md` e este handoff, depois apenas as rotas e arquivos necessários. Sua primeira tarefa é refazer L3k-b0 porque a tabela histórica foi invalidada por incremento duplo do trimestre e ausência de custo marginal da equipe máxima. Preserve a árvore intencionalmente suja, a fonte original e o contrato de saves. Use preferencialmente o OpenCode como explorador, worker e revisor independente, validando rota/permissões; coordene em paralelo com o Gemini sem esperar intervenção humana para trabalho local já autorizado. Produza análise comparável dos 16 trimestres consecutivos e caixa completo, esclareça os limites de L3k-c, atualize os documentos e apresente proposta concreta de L3k-b antes de alterar valores. Não faça staging, commit, push, Supabase ou publicação por conta própria. Mantenha respostas em pt-BR objetivas e só me interrompa quando uma decisão minha ou intervenção efetiva no OpenCode/Gemini for indispensável.
