# Handoff completo para outro LLM — Slingshot Brasil

Data do handoff: 20/09/2026  
Repositório: `https://github.com/KM20197/slingshot-pt-br`  
Commit entregue: `b98524acd9bd2e80eed865292d437259115f0e0c`  
Diretório local: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`

## Atualização de continuidade — 21/09/2026

O texto abaixo preserva o retrato do handoff de 20/09. Depois dele, foram concluídos `M2_FUNDERS` e `M3_FUNDERS` (104 textos) e classificadas como técnicas `M2_FUNDER_OPTIONS` e `M3_FUNDER_OPTIONS`. `FUNDER_ADVICE` está parcialmente traduzido: 130 campos dos perfis dragon, techAngel, operatorAngel, academicAngel, priyaSharma e thomasEriksson. Restam 35 perfis com conselhos; o próximo é klausMuller.

O catálogo atual tem 2.987 campos, 2.935 alterações e 22 estruturas registradas: 21 examinadas integralmente e uma parcial. Comparando diretamente com as 71 estruturas de `docs/INVENTARIO.md`, restam 49 ainda sem entrada no catálogo, além da parte pendente de `FUNDER_ADVICE`. A antiga contagem de 48 abaixo corresponde à lista operacional daquele retrato, não à subtração integral do inventário. Isso não mede a cobertura de mensagens HTML ou de textos fora das estruturas.

Consulte os pareceres `REVISAO_FINANCIADORES_2026-09-21.md` e `REVISAO_CONSELHOS_2026-09-21.md` para os resultados e limites dos lotes.

## Objetivo

Continuar a edição brasileira acadêmica do Slingshot, preservando o motor do jogo e traduzindo os textos por caminho exato. O público é de graduação e pós-graduação em engenharia, administração, computação e saúde. A aplicação deve funcionar online e offline, sem coletar dados dos participantes, com exportação local da nota para entrega ao professor.

O original está em `source/index.original.html` e deve permanecer imutável. Seu SHA-256 é:

`a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`

O original possui 83.574 linhas, 71 estruturas de dados, oito scripts internos e cerca de 40.693 candidatos textuais. O catálogo de tradução atual contém 2.753 campos em 17 estruturas, com 2.701 alterações efetivas.

## Estado já concluído

Estão cobertos e testados:

- `BMC_DATA` dos 12 modelos de negócio;
- `REVENUE_MODELS`;
- `FOUNDER_PROFILES`, `FOUNDER_GRANT_PROFILES` e preservação de `FOUNDER_PORTRAITS`;
- `LOCATIONS` e apresentação geográfica por `location-display.js`;
- `FUNDING_STAGES` e `STAT_LABELS`;
- `FUNDERS`, com 32 perfis e 192 textos;
- nota acadêmica de 0 a 5 e exportação local;
- financiamento brasileiro didático, sem emissão de ações nas rotas já substituídas;
- persistência e validação de empréstimos;
- crise financeira;
- políticas de privacidade e testes locais do esquema Supabase.

Última verificação: `npm test` — 97 testes aprovados, sem falhas, cancelamentos ou testes ignorados. O build verifica 19 scripts com Acorn e `node --check`.

As revisões independentes dos lotes concluídos foram limitadas a três ciclos. Os lotes mais recentes terminaram em 9,3/10 após dois ciclos.

## Trabalho restante

Há 48 estruturas catalogadas ainda sem tradução no inventário operacional:

`M2_FUNDERS`, `M3_FUNDERS`, `M2_FUNDER_OPTIONS`, `M3_FUNDER_OPTIONS`, `FUNDER_ADVICE`, `FUNDER_OPTIONS`, `VENTURE_ANGELS`, `FOLLOW_ON_INVESTORS`, `MILESTONES`, `PIVOT_TEAM`, `VENTURE_MARKETS`, `MO_RISK_WEIGHTS`, `STRATEGIC_PIVOTS`, `FORCED_RESPONSES`, `PIVOT_MILESTONES`, `ARCHETYPE_PIVOT_MAP`, `EXECUTIVES`, `HR_EXECS`, `CANDIDATE_POOL`, `CHAR_EVENTS`, `GENERIC_EVENTS`, `RIVALS`, `PIVOT_RIVALS`, `REVENUE_MARKETING_EVENTS`, `FUNDER_EVENTS`, `COMPETITIVE_EVENTS`, `MARKETS`, `NEWS`, `SHOCKS`, `TOKEN_SETTINGS`, `TOKEN_BASELINES`, `TOKEN_PER_STAFF`, `LIFE_EVENTS`, `CONFERENCES`, `VENUE_THEMES`, `TICKER_LINES`, `DELEGATE_TYPES`, `SKIN_TONES`, `HAIR_TONES`, `OUTFITS`, `CONF_COSTS`, `CONF_SLOT_OFFSETS`, `PITCH_FIGURES`, `PITCH_SEATS`, `PITCH_CHAIR_COLOURS`, `PITCH_TROUSER_COLOURS`, `PITCH_TOP_COLOURS` e `PITCH_POSES`.

Além dessas estruturas, ainda faltam:

1. tradução completa de textos HTML, atributos e mensagens fora dos catálogos;
2. adaptação dos empreendimentos brasileiros escolhidos a partir do Johgo, mantendo alguns empreendimentos britânicos factíveis;
3. rotas brasileiras de CAPES, CNPq e Fundações Estaduais de Amparo à Pesquisa, separando bolsas, recursos não reembolsáveis e empréstimos;
4. remoção ou substituição das rotas societárias legadas que ainda não foram alcançadas pelos módulos brasileiros;
5. calibração de valores para micro e pequenos empreendimentos brasileiros;
6. teste visual completo, abertura por `file://`, partida completa online e offline;
7. revisão final de acessibilidade, exportação e entrega ao professor;
8. decisão posterior sobre hospedagem. O GitHub já está autorizado; nenhuma nova migração ou alteração remota no Supabase foi autorizada neste handoff.

## Regras de tradução

Traduzir somente valores de texto identificados por caminho. Não fazer substituição global por palavra ou expressão.

Preservar sempre:

- IDs, chaves de objeto, nomes usados em comparações, nomes de arquivos e seletores DOM;
- números, percentuais, bônus, penalidades, thresholds, datas, moedas e fórmulas;
- nomes próprios factuais, marcas, universidades, siglas regulatórias e bancos de nomes de personagens;
- SVGs, data URLs, imagens, classes CSS, nomes de métodos e eventos;
- marcadores `[NEW]` e diferenças de ordem dos arrays;
- referências britânicas quando representam o mundo real, salvo exônimo português consagrado em texto narrativo.

As chaves internas de cidade, região e financiador não podem ser traduzidas se participarem de regras. A interface pode receber uma camada de apresentação separada, como foi feito para `LOCATIONS`.

## Financiamento e avaliação aprovados

Os parâmetros didáticos aprovados são: banco público a 24% ao ano por 12 trimestres; familiares a 6% ao ano por 8 trimestres; ONG elegível a 8% ao ano por 12 trimestres; agiotagem fictícia a 120% ao ano por 4 trimestres. A taxa trimestral é `(1 + taxa anual)^(1/4) - 1`, com amortização constante e pagamento de juros antes do principal. Não incluir emissão de ações para os pequenos negócios.

A nota é de 0 a 5: desenvolvimento até 3 pontos, continuidade até 1 ponto e capacidade financeira até 1 ponto. O resultado é arredondado para duas casas. Matrícula ou e-mail são opcionais, entram apenas no arquivo local que o aluno decide entregar e não são enviados ao Supabase.

## Claude e Ada

O jogo não chama Claude durante a partida. O HTML contém um link opcional para o artefato público “Meet Ada”, usado para criar ou carregar uma startup. Todos os eventos, personagens, regras e textos da partida são pré-escritos.

É permitido traduzir os textos de Ada, os botões e as instruções de carregamento. Se o artefato público for remixado, sua tradução deve ser entregue separadamente e não pode virar dependência obrigatória do jogo. O jogo principal deve continuar jogável sem conta Claude. Segundo a documentação da Anthropic, artefatos estão disponíveis nos planos Free, Pro e Max; o usuário precisa autenticar-se, e o uso conta na cota da própria conta. O criador não paga pelo uso dos participantes. Não inserir chave de API no HTML.

## Contrato para o LLM executor

O executor deve trabalhar em branch ou cópia local e produzir:

1. catálogo JSON ou ferramenta de geração;
2. alteração mínima em `tools/build.cjs`, se necessária;
3. testes específicos do lote;
4. relatório de cobertura e paridade;
5. relatório da revisão Gauntlet;
6. commit identificável ou patch aplicável.

O executor não deve:

- alterar `source/index.original.html`;
- fazer substituições globais;
- traduzir chaves usadas pelo motor;
- alterar regras, fórmulas, valores ou eventos para “melhorar” o equilíbrio sem uma decisão aprovada;
- executar `supabase/bootstrap.sql` no projeto existente;
- acessar ou alterar credenciais, Supabase remoto, GitHub remoto ou arquivos pessoais;
- declarar o projeto pronto para turma com base em um lote parcial.

## Gauntlet loop — procedimento obrigatório

O Gauntlet é um ciclo fechado de ataque independente. Cada lote passa por no máximo três ciclos.

### Preparação

1. Identificar a próxima estrutura na ordem do original.
2. Extrair os valores e caminhos originais com Acorn.
3. Classificar cada string: interface, prosa narrativa, nome próprio, chave técnica, dado numérico, SVG ou referência externa.
4. Registrar fontes, destinos e exceções aprovadas.
5. Fixar hash da estrutura original antes de gravar qualquer catálogo.

### Implementação

1. Criar catálogo explícito por caminho.
2. Fazer o build somente a partir do original imutável.
3. Rejeitar fonte divergente, caminho ausente, caminho excedente, destino vazio e colisão semântica.
4. Comparar AST antes e depois, permitindo somente os literais aprovados.
5. Criar testes que restaurem os textos originais e comparem todos os demais dados.

### Ataque independente

Um revisor que não editou o lote deve:

- procurar omissões e traduções excedentes;
- verificar números, moeda, percentuais, nomes próprios e siglas;
- procurar alteração involuntária de IDs, regras, métodos, arrays e SVGs;
- executar os testes específicos e uma parte representativa dos métodos reais;
- dar nota de 0 a 10 e listar falhas concretas, sem elevar a nota por conveniência.

### Correção e revalidação

1. Corrigir somente os problemas apontados ou comprovados.
2. Reexecutar os testes específicos, `node --check`, `git diff --check` e `npm test` quando o lote tocar no build.
3. Pedir nova nota ao revisor.
4. Encerrar ao atingir pelo menos 9/10 sem pendências do escopo, ou ao chegar ao terceiro ciclo.
5. Se ainda houver pendência no terceiro ciclo, registrar `BLOCKED_FOR_REVIEW`, explicar o risco e não publicar como etapa aprovada.

### Evidência mínima para fechar um lote

O relatório deve informar: ciclo inicial e final, nota inicial e final, arquivos alterados, número exato de caminhos, estruturas preservadas, testes executados, testes aprovados, limitações e commit. A aprovação de um lote não aprova o projeto inteiro.

## Comandos

Na raiz do projeto:

```powershell
$env:GIT_TERMINAL_PROMPT='0'
$env:GCM_INTERACTIVE='never'
npm run verify
git diff --check
git status --short
```

Cada gerador deve ser executado antes do build quando o catálogo correspondente for alterado. O teste deve ser específico o bastante para detectar omissão silenciosa e amplo o bastante para provar que o motor continuou igual.

## Critério de conclusão do projeto

Só considerar a edição pronta depois de: catálogo integral ou exclusões justificadas; empreendimentos brasileiros aprovados; financiamento e fomento brasileiros completos; rotas societárias restantes resolvidas; nota e exportação verificadas; navegação em português; partida completa online e offline; auditoria de aspas, chaves e scripts; revisão Gauntlet final; documentação atualizada; e decisão explícita sobre hospedagem e uso do artefato Ada.
