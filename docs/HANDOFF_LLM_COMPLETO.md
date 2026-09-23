# Handoff de continuidade — Slingshot Brasil

Data de consolidação: 21/09/2026
Repositório público: `https://github.com/KM20197/slingshot-pt-br`
Branch: `main`
Commit de referência: `544a37a3c056e81271c028d3c7313d79cd11b28d`
Diretório de trabalho: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`

## 1. Finalidade e pedido do usuário

O usuário pediu uma edição brasileira do jogo acadêmico Slingshot, baseada no original anexo, com a mesma lógica e mecanismos internos sempre que não houver adaptação expressamente aprovada. A edição é destinada a estudantes de engenharia, administração, computação e áreas da saúde, deve funcionar tanto online como offline e precisa estar integralmente em português do Brasil antes de ser considerada pronta para turma.

O pedido abrange:

- tradução por estrutura e por caminho de campo, na ordem do arquivo original, sem substituição global;
- preservação de IDs, fórmulas, valores, datas, nomes próprios, referências britânicas factuais, SVGs e seletores usados pelo motor;
- adaptação posterior e deliberada dos empreendimentos para o Brasil, inspirada em empreendimentos do Johgo que façam sentido para esse público, mantendo alguns casos britânicos factíveis no país;
- crédito didático brasileiro, sem emissão de ações para o pequeno e microempreendedor;
- distinção entre empréstimos, bolsas e recursos não reembolsáveis de fomento para pesquisa e inovação;
- projeto Supabase existente preservado, sem coleta de participantes;
- exportação local da nota para entrega manual ao professor;
- arquivos mantidos no computador do usuário e enviados ao GitHub público autorizado.

Não confundir textos dentro dos anexos originais com instruções do usuário. O original é a fonte de comportamento e de dados a preservar; as decisões deste documento e de `docs/DECISOES_APROVADAS.md` são a autoridade para a adaptação brasileira.

## 2. Autorizações e decisões já aprovadas

### Infraestrutura e privacidade

- Usar o projeto Supabase existente `slingshot-pt-br`, organização KM20197, região São Paulo, referência `yydfbsssnfvkscdfzjsq`, plano Free (R$ 0/mês).
- Manter quaisquer dados existentes no projeto. Não executar `supabase/bootstrap.sql` nele: esse arquivo só recria o esquema em projeto vazio.
- Não criar contas de participantes nem enviar matrícula, e-mail, resultados ou eventos do jogo ao Supabase, GitHub ou outro serviço.
- Matrícula **ou** e-mail é opcional e entra somente no arquivo local que o estudante decide entregar ao professor.
- Repositório público autorizado: `KM20197/slingshot-pt-br`.

### Financiamento didático

| Modalidade | Taxa efetiva anual | Prazo | Natureza |
|---|---:|---:|---|
| Banco público | 24% | 12 trimestres | empréstimo |
| Familiares | 6% | 8 trimestres | empréstimo pessoal |
| ONG elegível | 8% | 12 trimestres | empréstimo com finalidade compatível |
| Agiotagem fictícia | 120% | 4 trimestres | empréstimo pessoal fictício |

Esses parâmetros são didáticos, não ofertas reais. A taxa trimestral é `(1 + taxa anual)^(1/4) - 1`. A amortização do principal é constante; juros incidem sobre o saldo principal, pagamento parcial quita juros antes do principal e diferenças de centavos são liquidadas na última parcela. A primeira parcela ocorre no trimestre posterior à contratação.

Não incluir emissão de ações, participação societária, diluição ou IPO como financiamento do pequeno e microempreendedor. Ainda há rotas legadas do jogo original com esse comportamento e elas estão pendentes de substituição ou remoção controlada.

As rotas futuras devem distinguir claramente:

- empréstimos de bancos públicos para negócios gerais, com os parâmetros acima;
- crédito familiar, ONG elegível e crédito pessoal fictício;
- bolsas e recursos não reembolsáveis para pesquisa e inovação;
- chamadas de CAPES, CNPq e Fundação Estadual de Amparo à Pesquisa apenas quando a finalidade do empreendimento justificar a modalidade.

Não apresentar programas ou taxas como oferta vigente sem pesquisa factual e aprovação do usuário.

### Nota acadêmica e entrega

A nota é de 0 a 5, arredondada somente no total para duas casas:

`nota = desenvolvimento (0 a 3) + continuidade (0 a 1) + capacidade financeira (0 a 1)`.

- Cada um dos três marcos contribui seu progresso de 0 a 1, usando o cálculo já produzido pelo motor.
- Continuidade é `trimestres concluídos / 16`; vale 1 se houver sucesso antecipado com os três marcos concluídos.
- Capacidade financeira é `caixa / (despesa operacional do próximo trimestre + parcelas previstas)`, limitada a 0–1.
- Atraso zera apenas o componente financeiro. Sem obrigações e sem atraso, o componente financeiro vale 1.
- Exemplo aprovado: `2,50 + 0,75 + 0,60 = 3,85`.

O aluno conclui a partida, gera um arquivo `.txt` assinado com uma chave de turma e o entrega manualmente. `professor.html` confere a assinatura e recalcula a nota localmente. HMAC não criptografa dados, não prova autoria e não impede que alguém com a chave compartilhada produza um resultado; essa limitação deve continuar visível na documentação.

## 3. Forma de trabalho, computador e GitHub

O trabalho é feito diretamente no computador do usuário, dentro de `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. O arquivo distribuível `index.html` é gerado localmente a partir de `source/index.original.html` e de catálogos explícitos. Depois de testes e revisão, as alterações são versionadas localmente e enviadas ao repositório público autorizado.

Fluxo operacional atual:

1. editar somente arquivos da cópia brasileira, nunca `source/index.original.html`;
2. regenerar o catálogo específico quando aplicável;
3. executar `npm run verify` e `git diff --check`;
4. realizar revisão independente pelo Gauntlet;
5. registrar evidências em `docs/REVISAO_*.md`;
6. criar commit e enviar para `origin/main` com as credenciais já configuradas no computador do usuário.

Não há necessidade de mexer no GitHub para testes locais. Não acessar, exportar ou alterar credenciais. Não fazer novas alterações remotas no Supabase sem uma autorização específica posterior. A aplicação gerada bloqueia conexões automáticas externas por política de conteúdo e não possui telemetria do original.

Comandos usuais:

```powershell
Set-Location C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br
npm ci
npm run verify
git diff --check
git status --short

$env:GIT_TERMINAL_PROMPT='0'
$env:GCM_INTERACTIVE='never'
git push origin main
```

## 4. Fonte imutável e arquitetura de build

Fonte original: `source/index.original.html`
SHA-256 obrigatório: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`

O original tem 83.574 linhas, oito scripts internos, 71 estruturas de dados de nível superior, cerca de 40.693 candidatos textuais em JavaScript e 2.486 candidatos textuais em HTML e atributos. `docs/INVENTARIO.md` é a lista de estruturas e linhas; execute `node tools/inventory.cjs` se a fonte for conferida novamente.

Arquivos centrais:

| Arquivo | Responsabilidade |
|---|---|
| `tools/build.cjs` | parte do original, aplica catálogos por AST, patches delimitados, tradução de HTML e valida os scripts gerados |
| `tools/structured-translation.cjs` | substitui apenas literais autorizados por caminho e verifica paridade AST |
| `locales/structures.pt-BR.json` | catálogo de estruturas, com `source`, `target` e caminho JSON explícito |
| `locales/pt-BR.json` | textos de interface e atributos HTML selecionados |
| `tools/catalogue-*.cjs` | geradores por lote, com hash da fonte e rejeição de cobertura incompleta |
| `tests/*.test.cjs` | testes de paridade, regras acadêmicas, crédito, exportação, build e esquema Supabase local |
| `academic.js` | cálculo da nota sem alterar resultados econômicos |
| `finance.js` e `finance-adapter.js` | dívida em centavos e conversão explícita para as unidades do motor |
| `initial-credit.js`, `continuing-credit.js`, `crisis-credit.js` | rotas brasileiras já substituídas |
| `academic-export.js`, `result-code.js`, `professor.html` | exportação e conferência local de resultado |
| `save-validation.js` | validação e restauração do estado brasileiro salvo |
| `supabase/` | documentação, bootstrap para projeto vazio, privacidade, seed de referência e verificações locais |

O build já injeta os módulos locais no HTML final e confere todos os scripts com Acorn e `node --check`. A alteração de um texto deve passar por catálogo e não por `replaceAll` genérico no HTML gerado.

## 5. Tradução: regras que não podem ser quebradas

Traduzir string por string e bloco por bloco. Um texto idêntico em duas posições pode ter destino diferente; por isso o caminho do campo é obrigatório.

Preservar:

- chaves de objetos, IDs, nomes de métodos, eventos, classes CSS, seletores DOM e nomes de arquivos;
- números, percentuais, datas, valores, bônus, penalidades, thresholds, fórmulas e ordem de arrays;
- SVGs, data URLs, imagens e identificadores de recursos;
- marcadores `[NEW]`, pois métodos reais removem itens por comparação textual;
- bancos de nomes e sobrenomes de personagens;
- marcas, universidades, siglas de reguladores e nomes próprios factuais.

Aplicar exônimo português consolidado na prosa: London → Londres, Edinburgh → Edimburgo, Prague → Praga, Bank of England → Banco da Inglaterra. Traduzir cargos genéricos de governo em prosa, como primeiro-ministro e chanceler do Tesouro. Manter universidades, marcas e siglas como MHRA, NCSC, ICO, FCA, NHS, FTSE 100 e UKRI. Traduzir palavras genéricas isoladas, como `train`, quando forem prosa.

Quando uma referência britânica interfere na lógica, preserve o dado interno e crie uma camada de apresentação, como em `location-display.js`. Não trocar uma cidade, financiador ou nome canônico dentro do objeto sem prova de que ele não é usado em comparações.

## 6. Estado implementado e evidências

### Base brasileira, privacidade e avaliação

- Nota acadêmica, exportação `.txt`, confirmação do professor, assinatura HMAC, limpeza de chave e proteção contra exportação obsoleta foram implementadas.
- O resultado é capturado antes dos resets de `endGame`; a exportação é local e o fluxo não coleta dados de participantes.
- Crédito inicial, captação posterior e socorro de crise funcionam por contratos de dívida sem participação societária nas rotas já substituídas.
- Contratos sobrevivem ao salvamento e são recalculados/validados na retomada.
- O Supabase existente foi preservado com RLS e permissões restritas. Os testes de esquema usam PGlite local e não se conectam ao projeto remoto.

### Estruturas já examinadas

O catálogo corrente contém 22 estruturas registradas, 2.987 caminhos e 2.935 textos efetivamente alterados. Estão completas as 21 primeiras entradas de catálogo; `FUNDER_ADVICE` está parcial. Cobertura atual:

| Estrutura | Situação |
|---|---|
| `REGIONS` | 18 textos traduzidos; referências e identificadores preservados |
| `GEOGRAPHY_REGIONS`, `PORTRAITS`, `LOGOS` | classificados como dados técnicos ou gráficos; sem prosa a alterar |
| `HALL_OF_FAME_LEGENDS`, `COMPANIES`, `VENTURE_DETAILS` | prosa original traduzida; adaptação brasileira dos empreendimentos ainda pendente |
| `BMC_DATA` | 1.826 campos dos 12 perfis cobertos; `[NEW]` e seletores preservados |
| `REVENUE_MODELS` | cinco nomes e descrições traduzidos; calibração brasileira pendente |
| `FOUNDER_PROFILES`, `FOUNDER_GRANT_PROFILES`, `FOUNDER_PORTRAITS` | perfis e prosa traduzidos; retratos SVG mantidos |
| `LOCATIONS`, `LOCATION_MAP` | 276 textos de apresentação; nomes canônicos permanecem em inglês para regras |
| `FUNDING_STAGES`, `STAT_LABELS` | rótulos traduzidos; sem mudar a semântica interna |
| `FUNDERS` | 192 textos dos 32 perfis legados traduzidos |
| `M2_FUNDERS`, `M3_FUNDERS` | 104 textos traduzidos; opções técnicas preservadas |
| `M2_FUNDER_OPTIONS`, `M3_FUNDER_OPTIONS` | classificados como referências internas, sem texto a alterar |
| `FUNDER_ADVICE` | 130 campos em seis perfis: `dragon`, `techAngel`, `operatorAngel`, `academicAngel`, `priyaSharma`, `thomasEriksson`; faltam 35 perfis com conselhos |

Os lotes fechados possuem relatórios em `docs/REVISAO_*.md`. As avaliações independentes mais recentes terminaram em 9,3/10: rodadas posteriores, conselhos iniciais e conselhos de saúde. Esses resultados aprovam somente o lote correspondente, não a edição completa.

O commit de referência atual é `544a37a` (`Translate healthcare investor advice with recommendation parity`). O checkout estava limpo e sincronizado com `origin/main` quando este handoff foi consolidado. Reconfira antes de editar: esse dado muda com novos commits.

## 7. Trabalho pendente, em ordem segura

### Próxima unidade imediata

Continuar `FUNDER_ADVICE` no perfil `klausMuller`, mantendo os seis perfis já catalogados. Há 35 perfis ainda pendentes nessa estrutura. O executor deve estender um gerador de catálogo ou criar um novo gerador limitado aos perfis seguintes; nunca sobrescrever as entradas existentes.

### Estruturas posteriores ainda sem entrada de catálogo

Depois de concluir `FUNDER_ADVICE`, seguir a ordem do original:

1. `FUNDER_OPTIONS`, `VENTURE_ANGELS`, `FOLLOW_ON_INVESTORS`;
2. `MILESTONES`, `PIVOT_TEAM`, `VENTURE_MARKETS`, `MO_RISK_WEIGHTS`, `STRATEGIC_PIVOTS`, `FORCED_RESPONSES`, `PIVOT_MILESTONES`, `ARCHETYPE_PIVOT_MAP`;
3. `EXECUTIVES`, `HR_EXECS`, `CANDIDATE_POOL`, `CHAR_EVENTS`, `GENERIC_EVENTS`;
4. `RIVALS`, `PIVOT_RIVALS`, `REVENUE_MARKETING_EVENTS`, `FUNDER_EVENTS`, `COMPETITIVE_EVENTS`;
5. `MARKETS`, `NEWS`, `SHOCKS`, `TOKEN_SETTINGS`, `TOKEN_BASELINES`, `TOKEN_PER_STAFF`, `LIFE_EVENTS`;
6. `CONFERENCES`, `VENUE_THEMES`, `TICKER_LINES`, `DELEGATE_TYPES`, `SKIN_TONES`, `HAIR_TONES`, `OUTFITS`, `CONF_COSTS`, `CONF_SLOT_OFFSETS`;
7. `UIEffects`, `PITCH_FIGURES`, `PITCH_SEATS`, `PITCH_CHAIR_COLOURS`, `PITCH_TROUSER_COLOURS`, `PITCH_TOP_COLOURS`, `PITCH_POSES`;
8. os textos HTML, atributos, modais e mensagens de métodos que não pertençam às 71 estruturas.

Há 49 estruturas sem entrada no catálogo e a parte remanescente de `FUNDER_ADVICE`. Essa contagem não equivale a 49 tarefas homogêneas: `CHAR_EVENTS`, `GENERIC_EVENTS` e os textos HTML exigem lotes menores por volume e risco.

### Adaptações funcionais ainda necessárias

1. Criar e aprovar a matriz de empreendimentos brasileiros antes de substituir dados de `COMPANIES`, `VENTURE_DETAILS`, BMCs, mercados, marcos, eventos e concorrentes. Considerar academia, supermercado, clínica médica e demais empreendimentos da referência Johgo adequados ao perfil de estudantes; conservar casos britânicos que sejam factíveis no Brasil. Não improvisar esses valores.
2. Implementar as modalidades brasileiras de fomento, com elegibilidade explícita e sem juros para bolsas/recursos não reembolsáveis. Não reutilizar investimento-anjo ou capital de risco como disfarce de crédito.
3. Identificar e substituir as rotas societárias ainda legadas: negociação de financiamento, remuneração e contratação com participação, eventos que aplicam diluição e finais de IPO. Os módulos de crédito já substituídos são referências de integração, mas não cobrem todas as rotas.
4. Calibrar em R$ os custos, receitas, salários, caixa inicial, metas e riscos depois que os negócios brasileiros forem aprovados. Até então, valores originais em unidades internas são apenas referências de teste e não estimativas para microempresas brasileiras.
5. Traduzir a landing page inteira: título, desafio, transcrição do vídeo, botões, estatísticas do ecossistema britânico, créditos e modo extremo. Conferir `splice` nas bordas, aspas e chaves em cada bloco.
6. Executar teste visual acessível e partida completa até Q16, com sucesso, falha, salvamento/retomada e exportação da nota, tanto por servidor local quanto por abertura `file://`.
7. Rever acessibilidade, avisos de privacidade, instruções ao professor e documentação antes de qualquer liberação para turma.
8. Só depois decidir hospedagem. Não existe autorização registrada neste handoff para publicar em provedor ou alterar novamente o Supabase remoto.

## 8. Procedimento obrigatório: Gauntlet de revisão independente

Cada lote tem no máximo três ciclos. O revisor não pode ser quem editou o lote. Se a pendência relevante sobreviver ao terceiro ciclo, registrar `BLOCKED_FOR_REVIEW`; não aumentar a nota para encerrar o trabalho.

### Preparação

1. verificar o SHA-256 do original e o estado limpo do checkout;
2. selecionar a próxima estrutura na ordem de `docs/INVENTARIO.md`;
3. extrair caminhos e valores com Acorn;
4. classificar cada item como interface, prosa, referência factual, nome próprio, chave técnica, dado numérico, SVG ou item sem tradução;
5. registrar fontes, destinos e exceções no catálogo ou no gerador;
6. fixar hash da estrutura de origem antes de escrever o catálogo.

### Implementação e testes

1. alterar somente destinos explicitamente aprovados por caminho;
2. rejeitar fonte divergente, caminho inexistente, caminho extra, destino vazio e colisão que descaracterize textos distintos;
3. comparar AST antes/depois, permitindo somente os literais catalogados;
4. criar teste que restaure os literais originais e compare todos os demais dados;
5. quando houver método dependente da estrutura, comparar cenários determinísticos do método original e do gerado;
6. executar gerador, `npm run verify`, `git diff --check` e, se o build for modificado, `node --check` dos scripts gerados.

### Ataque independente

O revisor deve dar nota de 0 a 10, listar problemas concretos e verificar:

- omissões, traduções excedentes e destinos em inglês que sejam prosa;
- números, datas, moeda, percentuais, siglas, nomes próprios e termos técnicos;
- IDs, regras, métodos, arrays, SVGs e `[NEW]`;
- testes específicos e pelo menos uma amostra representativa de métodos reais;
- documentação de limites e ausência de alegação de conclusão global.

### Correção e encerramento

Corrigir somente falhas comprovadas, rodar novamente a validação e pedir nova nota ao revisor. O relatório final do lote precisa informar nota inicial/final, número de ciclos, arquivos, contagem de caminhos, preservações, testes, limitações e commit. Só fechar com nota igual ou superior a 9/10 e sem pendência do escopo do lote.

## 9. Como avaliar o trabalho entregue por outro LLM

O avaliador pode executar esta sequência sem acessar serviços externos:

```powershell
Set-Location C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br
Get-FileHash source\index.original.html -Algorithm SHA256
git status --short
npm ci
npm run verify
git diff --check
```

Critérios objetivos:

| Área | Evidência necessária |
|---|---|
| Fonte | hash do original idêntico e arquivo sem alteração |
| Tradução | catálogo por caminho, fonte exata, destinos não vazios e classificação de exceções |
| Lógica | paridade AST e testes diferenciais de métodos tocados |
| Build | `npm run verify` aprovado, scripts validados e reprodução do HTML quando aplicável |
| Privacidade | nenhum dado de participante em rede, armazenamento remoto ou repositório |
| Financiamento | taxas/prazos aprovados, parcelas posteriores, dívida sem participação nas rotas alcançadas |
| Nota | cálculo 0–5, exportação local, conferência e recálculo pelo professor |
| Revisão | Gauntlet independente com nota documentada e máximo de três ciclos |
| Publicação | commit identificável, diff limpo, documentação atualizada; não afirmar que está pronto para turma enquanto houver pendências |

Para inspeção manual, abra `index.html` e `professor.html` por servidor local e por `file://`. Percorra uma partida de início a fim, force um cenário de crise, salve/retome e gere um resultado. A abertura por `file://` é requisito, não uma garantia já comprovada por testes automatizados.

## 10. Uso pelo OpenCode e mapa operacional

`AGENTS.md` na raiz é o ponto de entrada do OpenCode. Ele encaminha para três roteiros curtos em `docs/agent-routes/`, registra o limite de três ciclos do Gauntlet e exige revisão independente. `check_project.ps1` é o verificador executável: confere o hash da fonte, executa build e testes e valida o diff. O prompt para iniciar outra sessão e o mapa dos caminhos estão em `docs/PROMPT_OPENCODE.md`.

A pasta `C:\Users\Administrador\Downloads\Stingshot` contém anexos e uma configuração antiga do OpenCode, mas o código brasileiro editável e o Git estão em `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. O código original usado pelo build já está em `source/index.original.html`, dentro do checkout. Um agente que só vê o GitHub não acessa automaticamente os anexos da pasta Downloads. A configuração global de provedor do OpenCode permanece fora do repositório; nunca copie credenciais para o GitHub.

O Gauntlet registrado neste projeto é um processo de revisão, não uma instalação comprovada da skill externa Claudex Loop. CodeAF, JEV e a integração RTK com OpenCode não devem ser presumidos ativos apenas porque são mencionados em um prompt. O verificador local e o subagente somente leitura podem ser usados sem esses serviços, depois de confirmar as permissões efetivas do revisor.

## 11. Limites e condição de conclusão

O projeto ainda não está pronto para aplicação em turma. A tradução dos primeiros blocos e os módulos brasileiros isolados não substituem: adaptação dos empreendimentos, fomento completo, remoção das rotas societárias remanescentes, calibração monetária, tradução de toda a interface, teste integral online/offline e revisão final.

Só declarar a edição concluída quando houver catálogo completo ou exclusões justificadas, empreendimentos brasileiros aprovados, modalidades de fomento implementadas, todas as rotas de ações resolvidas, nota/exportação confirmadas em jogo completo, interface em português, auditoria de scripts/aspas/chaves, Gauntlet final e decisão explícita de hospedagem.

O link opcional para o artefato público “Meet Ada” não integra a lógica da partida. Pode-se traduzir seus textos de uso, mas o jogo deve continuar jogável sem conta Claude e sem chave de API. Não inserir credenciais no HTML.
