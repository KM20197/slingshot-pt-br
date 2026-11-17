> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Handoff de continuidade — L3g após parecer do Astra

## Como retomar

Este documento destina-se ao próximo chat criado dentro do projeto `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`.

Converse em português do Brasil, com objetividade e linguagem compreensível. Oriente o usuário por resultados e decisões, não por jargão ou passos ocultos. Não declare a edição pronta para turma. Preserve a árvore de trabalho existente; ela contém alterações de lotes anteriores e arquivos novos ainda sem commit.

Antes de qualquer ação no checkout, leia:

1. `AGENTS.md`
2. `docs/DECISOES_APROVADAS.md`
3. `docs/HANDOFF_LLM_COMPLETO.md`
4. `docs/REVISAO_L3F_2026-09-30.md`
5. `docs/HANDOFF_ASTRA_L3G_DECISOES_OPERACIONAIS_2026-09-30.md`
6. A resposta que o usuário trouxer do Astra.

Também consulte o roteiro pertinente em `docs/agent-routes/` antes de explorar, implementar ou revisar.

## Estado atual e fato prioritário

O lote L3f criou Pessoas e Contratos v1 e corrigiu a rota de caixa para assistência técnica de celulares (`avam`), minimercado (`dream`) e gráfica/embalagens (`quant`). A revisão independente recebeu **9/10, aprovada, sem bloqueador estático**.

A inspeção visual, porém, revelou um bloqueio funcional: depois de confirmar **Pessoas e contratos iniciais**, não aparecem decisões e não é possível iniciar o primeiro trimestre. A tela inicial está correta: não há Gerente Geral, Gerente de Marketing ou participação societária como condição da configuração.

Causa confirmada: L3f substituiu a equipe SaaS, mas o motor legado só cria decisões para `this.team.research`, `this.team.dev` e `this.team.marketing`. O trio não cria esses gestores; `currentEvents` fica vazio e `renderDecision()` mostra `No decision pending`.

Não corrigir isso reintroduzindo gestores SaaS ou eventos tecnológicos. O usuário priorizou a adaptação econômica e operacional antes de tradução ampla, eventos globais ou Ada.

## Trabalho já feito neste chat

- Exploração L3g somente leitura concluída; nenhuma alteração de código, build ou teste foi executado durante essa exploração.
- Handoff ao Astra criado em `docs/HANDOFF_ASTRA_L3G_DECISOES_OPERACIONAIS_2026-09-30.md`.
- O Astra deve devolver uma proposta arquitetural para decisões operacionais exclusivas do trio, com matriz de decisões, efeitos, desvio de sistemas legados, save versionado, arquivos e testes.
- Este handoff foi criado antes de a resposta do Astra chegar.

## Como tratar a resposta do Astra

1. Leia a resposta como análise externa: ela não comprova estado do checkout, build, teste ou edição local.
2. Compare-a com as decisões aprovadas e com os caminhos reais do projeto. Rejeite recomendações que reativem SaaS, VC, ações/diluição, `VENTURE_MARKETS`, Ada, Supabase, concorrentes gerais ou os outros nove empreendimentos sem autorização nova.
3. Apresente ao usuário, de forma curta, o que a proposta resolve, quais decisões dele ainda são necessárias e o que será explicitamente adiado.
4. Se a proposta introduzir parâmetros numéricos novos de caixa, demanda, capacidade, custo, estoque ou prazo, tratá-los como didáticos e provisórios. Solicite autorização explícita para os valores antes de implementar.
5. Só depois da confirmação do usuário, produza uma especificação fechada de implementação e peça autorização do lote. Não inferir permissão de escrita a partir da exploração L3g.

## Direção arquitetural mínima já identificada

A solução provavelmente precisa de um domínio próprio de decisões operacionais para `avam`, `dream` e `quant`, com frentes que **não são empregados**:

- controle e administração;
- operação;
- comercial.

As decisões devem tratar, conforme o empreendimento, de:

| Empreendimento | Situações adequadas |
|---|---|
| Assistência técnica | triagem, orçamento, peças, ordens, prazo e retorno pós-serviço |
| Minimercado | compra, reposição, perdas, exposição, giro e caixa de mercadorias |
| Gráfica/embalagens | orçamento, insumos, fila, refugo, qualidade, produção e entrega |

Os efeitos devem ficar limitados a capacidade, demanda, qualidade/perdas, estoque/insumos, recebíveis, custo operacional ou métricas de marcos já adaptadas. Não apresentar os valores como condições reais de mercado, legislação, contabilidade ou salários.

É provável que o lote tenha de desviar, somente para o trio, eventos de startup, mini-games, conselhos de investidores, eventos de receita SaaS, rivais tecnológicos, choques de IA, narrativa bootstrap, transições de mercado, eventos de vida, mensagens de superávit e penalidades de desengajamento. A resposta do Astra deve separar o que é necessário agora do que pode ser lote posterior.

## Compatibilidade obrigatória

- `source/index.original.html` não pode ser editado; SHA-256 esperado: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
- `index.html` somente pode ser regenerado pelo build.
- Não apagar ou reinterpretar saves legados.
- Saves L3f do trio, inclusive os que estão sem decisões criadas, devem abrir sem mudar silenciosamente caixa, estoque, pessoas, contratos, AP ou escolhas já feitas.
- O save L3g, se introduzido, precisa de versão, validação antes da restauração e teste de save/restauração.
- A chave de turma é necessária apenas para a exportação local de resultado acadêmico. Jogar, salvar e restaurar não dependem dela.

## Limites do próximo lote

Sem autorização específica, não alterar:

- Ada/importador, Supabase, rede, credenciais ou APIs;
- crédito, nota e exportação acadêmica;
- `VENTURE_MARKETS`;
- concorrentes e eventos gerais do jogo para os outros nove empreendimentos;
- catálogo dos 192 candidatos;
- os outros nove empreendimentos;
- `source/index.original.html`.

## Uso de Astra, Gemini e OpenCode

### Astra

O parecer pendente é planejamento arquitetural. A matéria cruza economia, eventos e save; por isso Astra com esforço Médio é a escolha adequada. Não use Sol: não há revisão narrativa comparativa integral dos 192 candidatos.

Se o Astra fizer recomendações que atravessam os 12 empreendimentos, BMC, pivôs, eventos, save/exportação e Ada, trate-as como direção futura; não amplie o lote do trio sem escolha explícita do usuário.

### Gemini

Depois de existir uma proposta fechada ou um diff, enviar ao Gemini **somente prompts e documentos**, nunca alegando que ele acessou o checkout. Pedir uma revisão conceitual e semântica:

- os cenários correspondem a serviço, varejo e indústria, e não a startup tecnológica;
- os efeitos prometidos são compatíveis com a economia implementada;
- não houve retorno de VC, ARR/MRR, API, equity, dados reais ou aconselhamento financeiro apresentado como real;
- BMC, metas, pivôs e textos da interface não prometem mecanismos inexistentes.

Gemini não deve aprovar execução local, build, teste ou diff que não tenha recebido como evidência.

### OpenCode

Usar OpenCode apenas após haver especificação delimitada aprovada pelo usuário.

- Para exploração: modelo `9router/slingshot-explorer`, somente leitura, com perguntas concretas e caminhos indicados.
- Para implementação: `9router/slingshot-worker`, somente os arquivos permitidos, sem decidir premissas econômicas e sem autoaprovação.
- Para revisão independente: `9router/slingshot-reviewer`/Gauntlet, somente leitura. Entregar a ele a especificação, o diff, evidências sanitizadas de build/testes e os caminhos exatos. Exigir nota de 0 a 10, veredito e achados verificáveis.

Não envie segredos, chaves, identificação de alunos nem logs com dados pessoais. Não trate resposta do OpenCode como prova de execução se ela não vier acompanhada da evidência solicitada.

## Processo de implementação, quando autorizado

1. Registrar no documento de especificação o escopo, valores provisórios, arquivos permitidos/proibidos, saves e critérios de aceite.
2. Conferir `git status --short` e preservar alterações existentes.
3. Implementar somente no lote aprovado, com módulos fonte e patches de build; nunca editar o HTML gerado como fonte de verdade.
4. Rodar `npm run build`, testes específicos, `check_project.ps1`, hash do original e `git diff --check`.
5. Não considerar as duas falhas preexistentes de `location-translation.test.cjs` como regressão do lote sem evidência concreta; elas tratam de `Channels` versus `Canais` em fomento legado e já existiam antes de L3f.
6. Pedir revisão independente. Corrigir achados até alcançar ao menos 9/10, em no máximo três ciclos.
7. Executar inspeção visual manual de ponta a ponta: configurar Pessoas e Contratos, escolher todas as decisões, encerrar trimestre, verificar caixa/operação, salvar/restaurar, e repetir com trimestre negativo.
8. Só então informar ao usuário o que falta para aceite; não fazer staging, commit ou push sem pedido explícito.

## Pergunta inicial sugerida ao usuário no próximo chat

Após receber o parecer do Astra, começar com um resumo de duas ou três frases e perguntar somente se houver escolha material pendente, por exemplo: aprovação dos efeitos numéricos didáticos provisórios ou da lista de mecanismos legados a desviar. Se o parecer já trouxer uma proposta compatível e o usuário autorizar exatamente aquele escopo, prossiga para a especificação e implementação delimitada.
