# Manual de orquestração — Slingshot Brasil

Atualizado em 07/10/2026. Procedimento permanente; estado e próximo lote ficam em `docs/ESTADO_ATUAL.md`. Este manual aplica-se a Gemini, Codex e qualquer agente que assuma a coordenação do projeto.

## Autoridade e leitura inicial

A instrução atual do usuário prevalece sobre decisões anteriores. Requisitos aprovados ficam em `docs/DECISOES_APROVADAS.md`; procedimentos em `AGENTS.md` e neste manual; estado em `docs/ESTADO_ATUAL.md`; caminhos em `docs/MAPA_ARQUIVOS.md`. Evidências de execução corrigem afirmações factuais obsoletas, mas não criam autorização de produto. Relatórios e snapshots datados são históricos. Não retomar um gate antigo por causa de sua redação imperativa.

Começar no checkout `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. O chat Codex pode estar em `C:\Users\Administrador\Documents\ChatGPT\Estilingue`; essa pasta só encaminha ao checkout. Consultar Git local e arquivos pertinentes antes de editar. Não assumir que GitHub/Drive refletem mudanças ainda locais. Carregar o histórico geral somente para resolver a origem de uma decisão ou evidência, não em todas as chamadas.

## Responsabilidades na transição

| Agente | Responsabilidade |
|---|---|
| Gemini | Orquestração principal: prioridades, escopo, dependências, coerência conceitual, contratos de delegação e reconciliação de evidências |
| Codex | Também orquestra durante a preparação do Gemini; confere checkout, integra resultados, executa ações locais e acompanha qualidade |
| OpenCode explorer | Levanta caminhos/linhas, consumidores e lacunas, somente leitura |
| OpenCode worker | Implementa um lote autorizado e valida no escopo; não aprova o próprio trabalho |
| OpenCode gauntlet-reviewer | Revisão independente em sessão distinta, somente leitura, com achados verificáveis |
| Usuário | Decide conteúdo/parâmetros novos e ações externas não autorizadas; opera interface externa quando os agentes não podem fazê-lo |

O usuário escolheu Gem personalizado no navegador. Gemini recebe os arquivos selecionados no Drive ou anexos. Isso não lhe concede acesso a `C:\`, execução de comandos, escrita local ou controle do OpenCode. Fluxo aprovado: Codex executa ações já autorizadas e concilia as orientações do Gemini quando o usuário as trouxer. Gemini entrega o contrato completo e recebe evidências por intermédio do usuário/Codex. Não alegar comunicação automática entre chats nem obrigar o usuário a copiar cada comando. Codex continua o trabalho autorizado mesmo sem retorno do Gemini. A comunicação externa não ocorre apenas por este manual.

Se Gemini e Codex divergirem, comparar a decisão aprovada, o arquivo e a evidência envolvidos; corrigir erro factual com prova. Questões técnicas rotineiras ficam com os orquestradores. Solicitar decisão do usuário apenas quando a divergência mudar conteúdo, parâmetros, escopo ou uma autorização necessária.

## Habilitação do Gemini

“Treinado” significa preparado e validado para operar o protocolo com documentos; não significa fine-tuning ou alteração dos pesos do modelo. Validar uma tarefa real: Gemini identifica checkout e revisão, distingue análise autorizada de valores não aprovados, delega contratos delimitados para os três papéis, interpreta evidências sem inventar testes e atualiza ou propõe a atualização do estado. Critérios completos em `docs/GUIA_GOOGLE_DRIVE_GEMINI.md`.

Codex só deixa de coorquestrar quando o usuário decidir, apoiado na validação. Mesmo após a transição, executor e revisor continuam separados. Um Gem não ganha capacidade de alterar arquivos locais pela leitura da documentação.

## Contrato de trabalho por lote

O orquestrador define: identificador e objetivo; autorização aplicável; checkout absoluto; arquivos de leitura e escrita; limites; critério de aceite; comandos de validação; formato de evidência e próximo destino. Para detalhes e prompts dos agentes, consultar `docs/PROTOCOLO_OPENCODE.md`.

Somente um escritor por arquivo. Em tarefas paralelas, usar conjuntos disjuntos. Explorer e revisor não executam shell, não editam, não fazem Git ou nova delegação. Worker não inicia outro lote nem muda parâmetros por inferência. Não enviar configuração de provedor, segredos ou dados de participantes a agentes/Drive.

Exploração não é autorização de implementação. Revisão conceitual não substitui validação local. Revisão de quem escreveu o lote não é independente. O coordenador exige provas, corrige e apresenta resultados concretos antes de qualquer decisão necessária do usuário.

## Validação proporcional

Código/catálogos: testes afetados, build quando aplicável, original preservado, diff, validação de saves/fluxos afetados e `check_project.ps1` para fechamento do lote. Esperar exit code; a última suíte registrada levou cerca de 13 minutos. Um teste verde não prova coerência narrativa, realismo econômico nem prontidão de turma.

Documentação/configuração: conferir links/caminhos, leitura e sintaxe da configuração efetiva, descoberta de skill e correspondência do pacote. Não executar build/suíte do jogo só para mudar instruções. Scripts auxiliares novos devem ser executados e verificados.

Revisão independente de código: nota justificada 0–10, mínimo 9 e sem bloqueador, até três ciclos de correção/reavaliação. Ao limite sem aceite, registrar `BLOCKED_FOR_REVIEW`. Para documentação, registrar achados e correções; não inventar uma nota externa se o revisor não rodou. A permissão de leitura externa gerenciada do OpenCode para tool-output não é isolamento absoluto.

## Continuidade obrigatória

Após cada etapa significativa, inclusive revisão/falha, o agente escritor:

1. Atualiza `docs/ESTADO_ATUAL.md` com fatos, status, provas, limites e próxima ação; incrementa sua revisão.
2. Registra decisões novas com origem humana em `docs/DECISOES_APROVADAS.md`; não transforma recomendações de outros modelos em aprovação.
3. Atualiza plano se dependências ou escopo mudarem; acrescenta no histórico geral somente resumo/link necessário.
4. Regenera o pacote com `node tools/export-gemini-drive.cjs` após alterações nos documentos exportados.
5. Identifica o pacote local gerado e a pendência de envio ao Drive. Gerar não significa enviar; enviar não prova leitura pelo Gemini.

O revisor somente leitura entrega achados; o coordenador/worker faz as atualizações. Antes de trocar de chat, basta conferir o estado vivo, sem pedir um handoff novo. Snapshots datados podem documentar marcos, mas não substituem o estado vivo. A regra orienta o comportamento; nenhuma automação consegue garantir a escrita após encerramento abrupto do processo.

## Autonomia, comunicação e limites

Responder em português brasileiro, formal, objetivo, prático e sem elogios. Relatar resultado, evidência e próximo passo. Fazer perguntas quando uma resposta mudar a entrega. Decidir detalhes técnicos rotineiros; não solicitar confirmações repetidas para ações locais reversíveis e autorizadas. O usuário não deve operar todos os comandos. Quando faltar acesso ao Gemini/OpenCode, preparar um pedido único e completo com os arquivos e o resultado esperado.

Preservar a árvore local e as mudanças anteriores. Staging, commit e push ficam com o usuário conforme a prática atual; não executar reset, clean, alteração de Supabase ou publicação por conta própria. Não habilitar serviço pago nem fallback pago. Rotas gratuitas têm quotas/condições variáveis: validar disponibilidade e custo antes de rodadas longas, sem promessa de ilimitado.

Preservar fonte original, geração de HTML, regras/valores/IDs e compatibilidade de saves fora das adaptações aprovadas. Dados de participantes e chave da turma permanecem locais. O projeto só termina com tradução/adaptação, economia/calibração, financiamento, fluxo acadêmico e partidas completas online/offline comprovados, conforme o plano.
