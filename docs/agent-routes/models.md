# Modelos por papel — 24/09/2026

## Raj96 —17/10/2026,r391

OpenCode observado2.0.32,sem instalação pelo coordenador. Explorer/Northworker/Nemotronreviewer solicitados por aliases com modelIDexplícito apenas no processo,combos e opencode.json preservados. Não inferir pesos/modelo real do alias. Preços públicos0/0conferidos. Explorerterminou1comtimeouts/saída parcial;workerC1/C2literalidade rejeitada,C2shell e arquivoextra auditados;Codex reescreveu96alvos. RevisorC1vazio não aceito,C2na rota alternativa kgwdo mesmoNemotronUltra entregou parecer9,5conjunto sem bloqueadores. Prova de ferramentas de revisão:SONDA_PERMISSAO_LOCAL_RESULTADO.json,local/sintética,não revisão. Nunca trocar de rota paga ou alterar configuração compartilhada para contornar indisponibilidade.

## Conciliação manual Aoife —17/10/2026,r383

Parecer manual encaminhado pelo usuário encerrou o bloqueio técnico com9,5/10conjunto,sem bloqueadores. Sessão manual/leituras não observadas diretamente;nota vem do documento preservado,não das chamadas automáticas. C1/C2/C3continuam falhas sem parecer,semC4ou alteração dos combos/opencode.json. O bloqueio r382abaixo é histórico da infraestrutura. Nenhuma nova rota paga ou autorização de reparo permanente foi criada.

## Resultado final Aoife —17/10/2026,r382

C1falhou410Muse;C2/C3terminaram0sem parecer/nota/decisão. Sondas Nemotron em kgw e OpenRouter:HTTP200com corpo503Service temporarily overloaded. Rota temporária não produziu revisão válida. BLOCKED_FOR_REVIEW após3tentativas,semC4automática. Combos e opencode.json preservados. Prompt manual completo nas provas do lote.

## Conferência viva —17/10/2026,final Aoife

O alias slingshot-reviewer retornou410ModelDeprecatedMuse em C1,antes de parecer. A API local mostrou combos divergentes da tabela r269:reviewer contém Muse/DeepSeek/MiMo antes das duas rotas Nemotron;explorer/worker também têm listas ampliadas. A origem da alteração não foi determinada. Não sobrescrever combos nem inferir upstream pelo nome do alias. Provas públicas sanitizadas em artifacts/char-aoife-final-20261016-r373/ROTAS_VIVAS_17.json.

Para a segunda revisão deste lote,Codex anunciou seleção por processo de openrouter/nvidia/nemotron-3-ultra-550b-a55b:free já previsto na lista,preço público0/0reconfirmado. Overlay OPENCODE_CONFIG_CONTENT com providers.9router.models.slingshot-reviewer.modelID mantém alias9router/slingshot-reviewer,agente gauntlet-reviewer e permissões,sem alterar opencode.json ou combos compartilhados. Sonda de inventário confirmou leitura do overlay,sem geração externa. Isso não aprova o lote nem comprova conteúdo de resposta antes da execução real;ver estado/provas. C1conta como tentativa falha e não pode ser apagada. Não trocar para rota paga ou reaproveitar limite de três ciclos.

## Reparo autorizado do 9router — 14/10/2026, r269

O pedido humano deste chat autoriza corrigir combos e modelos após consultar Rodada15. Manutenção concluída pela API autenticada do cliente instalado, mantendo IDs e nomes dos três combos. Configuração efetiva anterior havia divergido da tabela histórica: explorer com Kiro/Cline/Muse; worker e reviewer com Muse e múltiplas rotas Kiro/Cline. Os logs de C1..C4 registram 403; C5..C7 registram timeout após leitura, sem identificar de modo conclusivo o upstream que expirou. Sondas diretas OC gratuitas retornaram 403 FreeTierError; não foi contornada a restrição.

| Combo | Rota principal validada | Alternativa | Interface |
|---|---|---|---|
| slingshot-explorer | openrouter/nvidia/nemotron-3.5-lightning:free | nenhuma | Chat Completions |
| slingshot-worker | openrouter/cohere/north-mini-code:free | nenhuma | Chat Completions |
| slingshot-reviewer | kgw/nvidia/nemotron-3-ultra-550b-a55b:free | openrouter/nvidia/nemotron-3-ultra-550b-a55b:free | Chat Completions |

Reviewer mantém modelo fixo Nemotron 3 Ultra nas duas rotas. As duas rotas passaram individualmente em ferramenta/resposta; a transição automática não foi provocada. Worker distinto do reviewer. Gratuidade de entrada/saída conferida no catálogo vivo do OpenRouter (preços 0/0); quotas e disponibilidade não são ilimitadas. Nenhuma assinatura/crédito/ativação paga. As condições do endpoint NVIDIA gratuito proíbem informações pessoais/confidenciais; enviar somente código público autorizado e provas sanitizadas, como já exige AGENTS.md.

O opencode.json local usa @ai-sdk/openai-compatible em todos os três aliases; removida a exceção Responses do reviewer. Timeout total300s/cabeçalhos120s/trecho90s substitui180s/45s/45s, sem promessa de duração total das tentativas internas do router. Modalidade text apenas, coerente com modelos usados. Permissões/agentes/aliases/chave preservados. Configuração global atual já não continha provedor9router e foi preservada; o reparo vale para este checkout e para consumidores dos três combos. esteira-infinita e demais provedores não mudaram.

OpenCode real no checkout, nova sessão por papel, leu SINTETICO.txt e concluiu resposta final com saída0 nas três rotas. Reviewer identificou multiplicação por3 em contrato de dobro; worker propôs n*2 e explorer recuperou o valor. Isso valida transporte/adaptador/ciclo de ferramenta; não certifica qualidade geral, contexto longo, edição do worker ou revisão editorial do jogo. Não foi iniciada C8 nem alterado BLOCKED_FOR_REVIEW do lote real. Provas sanitizadas: artifacts/9router-reparo-20261014. Backup privado: C:/Users/Administrador/.config/opencode/backups/9router-20261014-reparo. Não copiar configurações privadas para o Git.

Fontes: [OpenCode modelos](https://opencode.ai/v2/docs/console/models/), [Nemotron Ultra gratuito](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free) e catálogo vivo autenticado do OpenRouter. As seções anteriores abaixo passam a ser histórico; a tabela de24/09 não descreve a configuração atual.


## Coordenação atual — 07/10/2026

Gemini será o orquestrador principal; Codex também orquestra até preparação/validação e decisão do usuário. OpenCode usa explorer/explore, worker e gauntlet-reviewer. O manual e estado vivos governam a operação: `docs/MANUAL_ORQUESTRACAO.md`, `docs/ESTADO_ATUAL.md`, `docs/PROTOCOLO_OPENCODE.md`. Gemini web concilia documentos/evidências e não confirma disco local sem conexão real. As decisões anteriores de modelo e dados abaixo são referências de configuração; não indicam o lote atual. A escolha de rotas e credenciais foi preservada; não prometer gratuidade ilimitada nem alterar assinatura/modelo silenciosamente.

## Diretriz de coordenação — 29/09/2026

Para a frente de economia/BMC/pivôs, separar planejamento de alta interdependência da execução delimitada. Codex conduz a arquitetura comum dos 12 empreendimentos, compatibilidade de save, definição de BMC/pivôs, integração posterior da Ada e problemas que cruzem módulos. Quando a tarefa de planejamento atravessar motor, economia, eventos, save/exportação e Ada, preferir Astra Médio; para matriz, inventário, critérios de aceite, documentação e pacotes de trabalho já delimitados, preferir Terra Médio.

## Aviso obrigatório para Sol — 29/09/2026

Antes de iniciar revisão integral e comparativa dos 192 perfis de candidatos adaptados, ou outra análise narrativa ampla que compare perfis, empreendimentos, BMC, eventos e consequências econômicas, o agente deve avisar o usuário e recomendar **Sol, esforço alto**. A escolha continua sendo do usuário; nenhum chat deve trocar de modelo silenciosamente. Sol não é requisito para extração/importação dos perfis, tradução localizada, implementação delimitada, testes, build, revisão de diff ou documentação. Esta regra vale em conjunto com Astra Médio para arquitetura econômica transversal e Terra Médio para planejamento delimitado.

O OpenCode recebe contratos delimitados, fonte e evidências para exploração, implementação e revisão independente; não cria premissas econômicas nem faz autoaprovação. Gemini e Codex coorquestram durante a transição. Sem conexão local, Gemini recebe documentos e provas sanitizadas e não confirma execução/checkout por conta própria. Codex executa/integrará ações locais autorizadas quando o OpenCode não concluir, sob o mesmo contrato e sem autoaprovação.

O padrão do OpenCode é `9router/slingshot-worker`. O pequeno modelo, `explore` e `explorer` usam `9router/slingshot-explorer`. O subagente `worker` implementa lotes. `gauntlet-reviewer` usa exclusivamente `9router/slingshot-reviewer`, em sessão independente e somente leitura.

As configurações local e global foram atualizadas. Outros projetos sem configuração própria também herdam esses padrões globais; instruções específicas do Slingshot permanecem neste repositório.

| Combo | Principal | Fallback | Interface |
|---|---|---|---|
| slingshot-explorer | oc/mimo-v2.6-flash-free | oc/mimo-v2.5-free | Chat Completions |
| slingshot-worker | oc/mimo-v2.5-free | oc/mimo-v2.6-flash-free | Chat Completions |
| slingshot-reviewer | oc/muse-spark-1.3-contributor-free | nenhum | Responses |

Estratégia: fallback. Todos os membros estão anunciados como gratuitos no OpenCode Zen na data desta configuração. A gratuidade pode ser temporária; revalidar antes de trocar rotas. Não adicionar assinaturas ou APIs cobradas sem autorização. `esteira-infinita` continua no 9router e no catálogo para recuperação manual; suas 84 rotas não são garantia de gratuidade e não integram o fluxo normal.

O modelo revisor exige `provider.npm: @ai-sdk/openai` na definição de seu modelo. Os outros combos usam `@ai-sdk/openai-compatible`. Não misturar formatos incompatíveis no mesmo fallback sem teste completo de ferramentas. Testes iniciais do Muse com 256 tokens terminaram incompletos; Responses com 2.048 tokens completou uma chamada de ferramenta. HTTP 200 isoladamente não comprova sucesso.

Foi configurado limite conservador de contexto de 131.072 tokens e saída de 16.384 por modelo, não a capacidade máxima do fornecedor. O cliente tem timeout total de 180 segundos, espera por cabeçalhos e por trecho de resposta de 45 segundos. Esses limites não descrevem tentativas internas do 9router nem garantem duração total de um lote. Não repetir chamadas em ciclo ilimitado.

## Operação

1. O principal delimita um lote e delega exploração somente quando necessário. O explorador retorna caminhos e achados concisos, sem copiar arquivos inteiros.
2. O principal implementa diretamente ou delega ao `worker`. Evitar que ambos editem os mesmos arquivos simultaneamente. Worker não delega, não aprova a própria implementação e não publica sem instrução explícita.
3. O coordenador executa testes determinísticos e entrega evidências sanitizadas ao `gauntlet-reviewer`. Este lê fonte, diff e provas, com shell, edição, delegação e web negados. Há a exceção gerenciada de saídas de ferramentas descrita em AGENTS.md.
4. Corrigir achados até pelo menos 9/10 em no máximo três ciclos. Sem aprovação ao terceiro ciclo: `BLOCKED_FOR_REVIEW`. Indisponibilidade do revisor não autoriza trocar silenciosamente de modelo ou autoaprovar.
5. Sessões já abertas podem conservar modelo escolhido ou estado anterior. Concluir a execução ativa antes de abrir nova sessão e confirmar o modelo. Não matar processos para carregar configurações.

## Evidência e limites

Os três modelos responderam com identificadores explícitos em testes pequenos de ferramenta. Metadados do 9router confirmaram provedor `opencode` e custo registrado zero. Isso valida conectividade e identidade informada pelo serviço, não pesos internos, superioridade em código ou economia de tokens. Os dois fallbacks de MiMo já foram testados como principais; não foi provocada falha de provedor para testar a transição automática. Os três combos dependem atualmente do mesmo serviço e não oferecem redundância contra indisponibilidade de todo o Zen.

O OpenCode real também completou leitura de um arquivo sintético e resposta final em cada um dos três modelos, em diretório isolado com agente de teste somente leitura. Esses testes confirmam os adaptadores e o ciclo ferramenta/resposta, mas não exercitam delegação do principal aos subagentes. A configuração efetiva de `gauntlet-reviewer` foi conferida separadamente. `check_project.ps1` passou: 19 scripts e 109/109 testes, sem mudanças em código, catálogos ou HTML gerado.

O índice da Artificial Analysis orienta candidatos, mas não comprova os modelos acessíveis por `auto`. IDs antigos não representam versões novas só por estarem associados a elas numa tabela. A nota 9/10 de um lote não mede a capacidade geral do modelo que a emitiu.

As rotas gratuitas têm condições próprias de tratamento de prompts. A documentação Zen informa uso para melhoria de modelos nas rotas MiMo gratuitas e treinamento com prompts/respostas no Muse Contributor. Enviar somente código/conteúdo autorizado do projeto público; nunca credenciais, dados de participantes ou material confidencial. Não habilitar logs completos de requisições para medir tokens; usar metadados sanitizados.

Antes de afirmar melhoria, comparar em cópias isoladas do mesmo checkpoint tarefas equivalentes por papel: inventário, implementação com teste determinístico e revisão de defeitos conhecidos. Manter fonte, instruções, orçamento e contexto inicial. Registrar modelo efetivo, entrada/saída/cache, duração incluindo esperas, chamadas, falhas, tentativas e correções até aprovação. Métrica ausente é indisponível, nunca zero presumido. A cadeia antiga só pode participar após verificação de custo; não executá-la para comparação às cegas.

## Recuperação local

Backups anteriores à mudança estão em `C:\Users\Administrador\.config\opencode\backups\slingshot-20260924-specialized`, com acesso restrito ao usuário, administradores e sistema. Não copiar esses arquivos para o repositório: configurações podem conter credenciais. Não restaurar a cadeia antiga automaticamente, pois pode conter rotas pagas. Primeiro comparar os arquivos atuais com os backups para preservar mudanças posteriores.

Usar a API autenticada do cliente instalado do 9router para manter combos; não editar SQLite diretamente. Atualizar pelo nome/id existente e verificar o conteúdo antes de sobrescrever. A criação já foi realizada; um prompt de manutenção deve conferir antes de criar duplicatas.

Fontes: [Zen](https://opencode.ai/docs/zen/), [provedores OpenCode](https://opencode.ai/docs/providers), [Artificial Analysis: Opus 5.5](https://artificialanalysis.ai/articles/claude-opus-5-5).

## Revisão desta configuração

Revisão independente das evidências sanitizadas e dos diffs: plano inicial 8,5/10; configuração final 9,0/10. Os achados levaram à validação antes da troca de padrões, à correção do adaptador Responses do revisor e à documentação de alcance global, recuperação, privacidade e limites. Não foi um novo Gauntlet do Mobility nem avaliação comparativa da qualidade dos modelos. O avaliador consultou inicialmente AGENTS.md por comando e depois recebeu somente evidências; não se alega isolamento técnico sem shell para essa avaliação. O agente de produção `gauntlet-reviewer` continua com suas próprias restrições efetivas conferidas.


## Conferência Muse nativo xhigh — 14/10/2026, r270

O log enviado pelo usuário iniciou em C:/Users/Administrador e falhou em localizar o sintético por caminho relativo; isso não é revisão do produto. Uma tentativa do coordenador no checkout canônico, com caminho absoluto existente e modelo opencode/muse-spark-1.3-contributor-free#xhigh, terminou1 com FreeTierError antes da leitura. A rota nativa também não está validada nesta sessão; não atribuir erro a xhigh nem prometer que eliminar9router resolve acesso. Padrão Nemotron preservado, sem C8. Evidências: artifacts/9router-reparo-20261014/MUSE_NATIVO_RESULTADO.json e logs associados.
