# Inventário C — referências institucionais britânicas

Data: 17/11/2026
Base: `main` / `061e990c8cfa0a8b21f50ad0858b924aba525349` (push concluído)
Fonte: `source/index.original.html` — SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`
Gerado: `index.html` — SHA-256 `6968ed1dea6c5b4d8f3aa77e99b12593a19c04802251c780aafc41b0645e4392`
Natureza: C0 somente leitura. Nenhum arquivo de produto foi alterado, nenhum build foi executado e não há staging/commit/push deste pacote.
Aprovação: base do contrato C aprovada em 17/11/2026 (hipótese A; D-14 B).

## 1. Método

O inventário foi produzido em duas camadas:

1. **Lexical/AST na fonte.** `inventariar-c.cjs` percorreu a árvore do `<script>` de `source/index.original.html` e registrou cada token institucional com arquivo, linha, raiz AST, caminho e trecho. O resultado está em `INVENTARIO_C_OCORRENCIAS.json` e no anexo legível `ANEXO_OCORRENCIAS_C.md`.
2. **Resíduo no target.** `gerar-caminhos-c.cjs` cruzou os pares `source`/`target` dos catálogos em `locales/*.json` com a lista de tokens e gerou `CAMINHOS_C.csv`/`CAMINHOS_C.json`. A pergunta não é “o token existe na fonte?”, mas “o token ainda aparece no texto que o aluno lê?”.

A contagem por token na fonte é um retrato lexical, não uma prova de consumidor ativo. Por isso a seção 5 classifica cada raiz pelo consumidor real no código.

## 2. Números de controle

| Medida | Total |
| --- | ---: |
| Ocorrências lexicais na fonte (AST) | 338 |
| Alvos de catálogo com token no target | 103 |
| Propostas de caminho no pacote de trabalho | 136 |
| Caminhos ativos sem catálogo adicionados à proposta | 33 |
| Alvos preservados por crédito/legado | 3 |

Distribuição dos **103 alvos de catálogo**:

| Sub-lote | Alvos |
| --- | ---: |
| C2 — mercado e produto | 66 |
| C3 — fomento e financiadores | 32 |
| C4 — eventos e notícias | 4 |
| FORA — crédito/autoria | 1 |

Distribuição das **338 ocorrências na fonte**:

| Sub-lote | Ocorrências |
| --- | ---: |
| C1 — `REGIONS` e apresentação global | 22 |
| C2 — mercado e produto | 92 |
| C3 — fomento e financiadores | 46 |
| C4 — eventos, notícias e choques | 66 |
| C5 — ajuda e `class Game` | 36 |
| C6/D — perfis de candidatos | 52 |
| C2/C3 — tabelas do carregador Ada | 16 |
| FORA — painel legal, créditos e about | 8 |

A diferença entre 338 e 103 é a diferença entre **ocorrência lexical** e **resíduo visível no target**. Muitas raízes já foram adaptadas por lotes anteriores: o token continua na fonte inglesa, mas não chega ao texto em português.

## 3. Alvos de catálogo por raiz

| Sub-lote | Raiz | Alvos | Tokens no target |
| --- | --- | ---: | --- |
| C2 | `BMC_DATA` | 45 | NHS 31, MHRA 2, FCA 3, NCSC 5, Innovate UK 2, UKRI 1, FTSE 100 1, NICE 1 |
| C2 | `VENTURE_MARKETS` | 16 | NHS 11, MHRA 2, NICE 1, NCSC 2 |
| C2 | `PIVOT_MILESTONES` | 3 | NHS 3 |
| C2 | `LOCATIONS` | 2 | NHS 2 (legado) |
| C3 | `FUNDERS` | 10 | Dragons' Den 1, NHS 6, NICE 1, FTSE 100 2, FCA 1 |
| C3 | `M2_FUNDERS` | 5 | NHS 4, MHRA 1 |
| C3 | `M3_FUNDERS` | 2 | British Business Bank 1, MHRA 1 |
| C3 | `FUNDER_ADVICE` | 14 | Innovate UK 2, NHS 7, NICE 1, FTSE 100 1, MHRA 2, FCA 1 |
| C3 | `FOLLOW_ON_INVESTORS` | 1 | FTSE 100 1 |
| C4 | `NEWS` | 4 | NHS 1, HMRC 1, Innovate UK 1, EIS 1 |
| FORA | `translations` (about-context) | 1 | Innovate UK 1 (crédito) |

Observação: a soma de tokens por raiz pode ser maior que o número de alvos porque um mesmo alvo contém mais de um token.

## 4. Ocorrências na fonte por raiz

| Sub-lote | Raiz | Ocorrências |
| --- | --- | ---: |
| C1 | `REGIONS` | 22 |
| C2 | `BMC_DATA` | 46 |
| C2 | `VENTURE_MARKETS` | 17 |
| C2 | `PIVOT_MILESTONES` | 6 |
| C2 | `VENTURE_DETAILS` | 6 |
| C2 | `PIVOT_RIVALS` | 9 |
| C2 | `RIVALS` | 3 |
| C2 | `LOCATIONS` | 2 |
| C2 | `HTML` (placeholders BMC) | 3 |
| C3 | `FUNDER_ADVICE` | 14 |
| C3 | `FUNDERS` | 12 |
| C3 | `MILESTONES` | 12 |
| C3 | `M2_FUNDERS` | 5 |
| C3 | `M3_FUNDERS` | 2 |
| C3 | `FOLLOW_ON_INVESTORS` | 1 |
| C4 | `GENERIC_EVENTS` | 22 |
| C4 | `REVENUE_MARKETING_EVENTS` | 15 |
| C4 | `CHAR_EVENTS` | 14 |
| C4 | `NEWS` | 6 |
| C4 | `SHOCKS` | 3 |
| C4 | `LIFE_EVENTS` | 3 |
| C4 | `FUNDER_EVENTS` | 1 |
| C4 | `script` (textos diversos) | 2 |
| C5 | `class Game` | 33 |
| C5 | `HTML` (ajuda) | 2 |
| C5 | `script` (`pitchSlideSVG`) | 1 |
| C6/D | `CANDIDATE_POOL` | 51 |
| C6/D | `script` (`EXECUTIVES`) | 1 |
| C2/C3 | `PATHWAY_TABLE` + `NEUTRAL_RELABELS` | 16 |
| FORA | `HTML` (painel legal/créditos) | 8 |

A lista completa, com linha e trecho, está em `ANEXO_OCORRENCIAS_C.md`; a versão estruturada está em `CAMINHOS_C.json`.

## 5. Classificação por consumidor

### 5.1 `REGIONS` (C1) — preservar como legado

- Fonte: `source/index.original.html` L9182–L9290, 18 entradas.
- Consumidores reais: `R.cities[type]` em `getCity` (L9326–L9327), `R.universities[type]` em `getUniversity` (L9331–L9332), `region.currency` e `region.currencyMultiplier` na formatação de valores.
- `getCity` e `getUniversity` **não têm chamadas** no arquivo; `R.cities` e `R.universities` só aparecem dentro dessas duas funções.
- A camada de dashboard substitui `const R = REGIONS.uk` por um objeto congelado com `currency: "R$"`, `currencyName: "BRL"` e `currencyMultiplier: 1`; `getRegion()` retorna `R` (`tools/dashboard-localization-patch.cjs` L28–L29).
- Conclusão: nomes institucionais de `REGIONS` não têm consumidor visível. **Preservar** os valores e documentar como legado. Não traduzir `REGIONS` por substituição global.

### 5.2 `VENTURE_DETAILS` (C2) — falso positivo no target

- Fonte: L9883; consumidor em L45961 (`showVentureDetails`).
- 6 ocorrências na fonte (5 NHS, 1 FCA), **0 no target**.
- O texto em português já foi adaptado e descreve a operação sem alegação clínica.
- Conclusão: **não editar** neste pacote.

### 5.3 `BMC_DATA` (C2) — ativo, 45 alvos

- Consumidor: renderização do Canvas e das atualizações de marco; `BMC_DATA` é lido por `renderBMC` e pelo carregador Ada.
- 45 alvos em `aether`, `quant`, `cyber`, `terra`, `legal`, `sorgente` e `avam`.
- Inclui pares `initial`/`pivots.*.changes.*.remove` que precisam continuar idênticos: se o valor inicial muda, o valor de remoção do pivô tem de mudar junto, ou o pivô não remove nada.
- Conclusão: **adaptar** com catálogo por caminho e teste de consistência entre `initial` e `remove`.

### 5.4 `VENTURE_MARKETS` (C2) — ativo, 16 alvos

- Consumidor: telas de mercado, níveis, insights e comentários de financiadores.
- 16 alvos: 11 NHS, 2 MHRA, 1 NICE, 2 NCSC.
- Conclusão: **adaptar**, mantendo a estrutura de níveis e a ordem dos arrays.

### 5.5 `PIVOT_MILESTONES` (C2) — ativo, 3 alvos

- Consumidor: `getPivotMilestones` e a apresentação de pivôs.
- 3 alvos com NHS.
- Conclusão: **adaptar**; `desc` e `notes` têm tratamento próprio no build (whitespace aprovado), não alterar fora do caminho.

### 5.6 `LOCATIONS` (C2) — legado, preservar

- Fonte: L12891; `getLocations` em L9336; chamadas em L45569 e L45827.
- No gerado, `getLocations(ventureId)` foi substituído por `return SlingshotManagement.locations(ventureId);` (`index.html` L528879). A tabela `LOCATIONS` deixou de ser a fonte efetiva.
- 2 alvos com NHS em Edimburgo.
- Conclusão: **preservar** e registrar como legado. Só reabrir se o patch de `SlingshotManagement.locations` for removido.

### 5.7 `RIVALS` e `PIVOT_RIVALS` (C2) — ativos, sem catálogo

- `RIVALS`: L35355; `PIVOT_RIVALS`: L36274. São lidos pela apresentação de concorrentes e pelo carregador Ada.
- 3 + 9 ocorrências na fonte; **não há alvos de catálogo** porque esses textos não passam pelo `structures.pt-BR.json`.
- Conclusão: **criar catálogo/patch por caminho** para 12 caminhos. Não usar substituição global.

### 5.8 `FUNDERS`, `M2_FUNDERS`, `M3_FUNDERS` (C3) — ativos, 17 alvos

- Consumidores: seleção de financiador, cartões de oferta e recursos desbloqueados.
- 10 + 5 + 2 alvos.
- Conclusão: **adaptar** com catálogo por caminho; preservar nomes próprios fictícios, valores e efeitos.

### 5.9 `FUNDER_ADVICE` (C3) — lote aceito, 14 alvos delimitados

- `FUNDER_ADVICE` tem 861 entradas e foi aceito em lote anterior.
- 14 caminhos ainda contêm token no target: 2 Innovate UK, 7 NHS, 1 NICE, 1 FTSE 100, 2 MHRA, 1 FCA.
- Conclusão: **não reabrir as 861 entradas**. Autorizar, se o humano decidir, um adendo delimitado de 14 caminhos, com teste de que nenhum outro par de `FUNDER_ADVICE` mudou.

### 5.10 `FOLLOW_ON_INVESTORS` (C3) — ativo, 1 alvo

- 1 caminho com FTSE 100 em `vc_unlocked[2].benefits`.
- Conclusão: **adaptar** por caminho.

### 5.11 `MILESTONES` (C3) — substituído por patches, 0 alvos de catálogo

- `MILESTONES` na fonte: L16796; 12 ocorrências (4 NHS, 3 MHRA, 2 FCA, 3 NCSC).
- O `structures.pt-BR.json` declara `MILESTONES` como `replaced-by-approved-layer`, com 0 pares: `setup-patch.cjs` substitui os marcos dos doze empreendimentos e `operations-patch.cjs` substitui os marcos dos seis modelos operacionais.
- Conclusão: **não criar catálogo paralelo** para `MILESTONES`. O trabalho de C3 é verificar a integridade dos nomes substituídos e das tabelas de relabel.

### 5.12 `NEWS` (C4) — lote aceito, 4 alvos + 1 resíduo semântico

- `NEWS` tem 141 entradas; 4 targets ainda com token: `stable.16` (NHS), `uk.13` (HMRC), `uk.14` (Innovate UK), `uk.15` (EIS).
- Há um quinto resíduo não capturado por token: `uk.12` contém “Banco da Inglaterra”.
- Conclusão: **não reabrir as 141 entradas**. Adendo delimitado de 5 caminhos, se aprovado.

### 5.13 `SHOCKS` (C4) — ativo, sem catálogo

- Fonte: L38498; `ALL_SHOCKS` em L38877; consumidores em L56069 e L56103.
- 3 ocorrências: `economic.[1].headline` (Prime Minister), `regulatory.[1].headline` (ICO), `regulatory.[2].headline` (NHS).
- Os textos e o ícone associados também precisam de tratamento; a busca por headline não os captura.
- Conclusão: **criar catálogo/patch** para 7 caminhos (3 headlines, 3 textos, 1 ícone).

### 5.14 `REVENUE_MARKETING_EVENTS` (C4) — ativo, sem catálogo

- Fonte: L36846; consumidor em L53000 (`selectRevenueEvent`).
- 15 ocorrências em 13 caminhos (intro, aside, nomes de pipeline e reações).
- Conclusão: **criar catálogo/patch** para 13 caminhos. Não há catálogo atual; o texto inglês chega ao gerado.

### 5.15 Lotes aceitos de C4 — não reabrir

- `CHAR_EVENTS`: 14 ocorrências na fonte, 0 no target. O lote foi aceito; o texto visível já está adaptado. Não reabrir.
- `GENERIC_EVENTS`: 22 ocorrências na fonte, 0 no target. Cenários já reescritos para ficção; falso positivo. Não reabrir.
- `COMPETITIVE_EVENTS`: 0 ocorrências na varredura; lote aceito. Não reabrir.
- `LIFE_EVENTS`: 3 ocorrências na fonte, 0 no target. Não reabrir.
- `FUNDER_EVENTS`: 1 ocorrência na fonte (Chancellor), 0 no target. Não reabrir.
- `TEAM-CAPACITY-UI` r496: 0 ocorrências; não reabrir.

### 5.16 `CANDIDATE_POOL` e `EXECUTIVES` (C6/D) — diferir

- 51 ocorrências em `CANDIDATE_POOL` e 1 em `EXECUTIVES`.
- Inclui NHS, Home Office, FCA, HMRC, além de universidades, cidades e vistos não capturados pela lista de tokens.
- Conclusão: **não editar no Pacote C**. Entregar ao Pacote D com o glossário aprovado. A implementação ampla dos 192 perfis exige aviso e recomendação de **Sol, esforço alto**.

### 5.17 `PATHWAY_TABLE` e `NEUTRAL_RELABELS` (C2/C3) — dependência funcional

- Fonte: `PATHWAY_TABLE` L81917; `NEUTRAL_RELABELS` L81935; uso em `relabelMilestones`/`relabelPathway` L81961–L81982.
- 16 ocorrências: 9 em `PATHWAY_TABLE`, 7 em `NEUTRAL_RELABELS`.
- **Achado funcional:** no gerado, `MILESTONES` está em português (substituído por `setup-patch.cjs`/`operations-patch.cjs`), mas as chaves de `PATHWAY_TABLE`/`NEUTRAL_RELABELS` continuam em inglês (`NHS Research Partnership`, `MHRA Pre-Submission`, `NHS & Public Health`, `Faster triage in overstretched NHS trusts`, `NCSC Approved`, `FCA Sandbox Approval`). O relabel compara `o.name`/strings com essas chaves; como os nomes já foram traduzidos, **o relabel não encontra os pares e vira no-op**.
- Conclusão: qualquer tradução de nomes de `MILESTONES`, `VENTURE_MARKETS` ou `BMC_DATA` precisa atualizar as chaves de relabel no mesmo lote. Exigir teste de integridade: cada chave de relabel deve existir em pelo menos um dos três catálogos e a substituição deve ocorrer.

### 5.18 C5 — ajuda e `class Game`

- 36 ocorrências: 33 em `class Game`, 2 em HTML de ajuda (`helpContent-money`, `grantHelpModal`) e 1 em `pitchSlideSVG`.
- Inclui `getUKGrantProgrammes` (4 nomes), `generateGrantDraft`, `renderGrantFundingModal`, `showFinanceHelpModal`, `generateMarketAssumptions`, `selectFundingStage`, `getTutorialContent`, `getBeginnerTutorialContent`.
- Conclusão: **C5** trata fomento, ajuda e mensagens de sistema. Não misturar com C1–C4.

### 5.19 HTML — painel legal, créditos e placeholders

- `legalDetailsPanel` L2833–L2902: ICO, PECR e GDPR. É documento legal operacional do site, não ficção. **Preservar** e tratar em revisão de privacidade/LGPD separada.
- `aboutModal` L2996–L3003 e `contributorsModal` L5613: créditos, ESRC, licença CC e link “Jogar The Slingshot original”. **Preservar**.
- `bmcCustomerSegment` L2329, `bmcKeyPartners` L8490, `bmcCustomerSegments` L8530: placeholders do Canvas. Confirmar se são substituídos em tempo de execução; não editar como texto estático sem confirmação.
- `helpContent-money` L8950 e `grantHelpModal` L81698: C5.
- `pitchSlideSVG` L81582: rótulo NHS no SVG; C5.

### 5.20 FORA — crédito/autoria

- 8 ocorrências: 5 ICO no painel legal, 2 Innovate UK em about, 1 Innovate UK em contributors.
- 1 alvo de catálogo: `translations.[14]` em `locales/about-context.pt-BR.json`, que menciona Innovate UK no texto de crédito.
- Conclusão: **preservar**. Não traduzir nome de financiador histórico nem remover agradecimento.

## 6. Lotes aceitos e limites de reabertura

| Lote | Estado | Regra neste pacote |
| --- | --- | --- |
| `CHAR_EVENTS` | aceito | não reabrir; 14 ocorrências na fonte são falso positivo no target |
| `GENERIC_EVENTS` | aceito | não reabrir; 22 ocorrências na fonte são falso positivo no target |
| `COMPETITIVE_EVENTS` | aceito | não reabrir; 0 ocorrências |
| `FUNDER_ADVICE` | aceito | não reabrir as 861 entradas; adendo delimitado de 14 caminhos, se aprovado |
| `NEWS` | aceito (141) | não reabrir as 141; adendo delimitado de 5 caminhos, se aprovado |
| `TEAM-CAPACITY-UI` r496 | aceito | não reabrir; 0 ocorrências |
| Lotes A/B | `BLOCKED_FOR_REVIEW` | fora do Pacote C; nenhum caminho deste inventário pertence a A/B |

## 7. Falsos positivos no target

Estas raízes têm token na fonte, mas o texto visível já foi adaptado. Não devem entrar em C2/C3/C4:

- `VENTURE_DETAILS` — 6 ocorrências na fonte, 0 no target.
- `CHAR_EVENTS` — 14 na fonte, 0 no target.
- `GENERIC_EVENTS` — 22 na fonte, 0 no target.
- `LIFE_EVENTS` — 3 na fonte, 0 no target.
- `FUNDER_EVENTS` — 1 na fonte, 0 no target.
- `MILESTONES` — 12 na fonte, 0 no catálogo; substituído por patches.
- `COMPETITIVE_EVENTS` — 0 na varredura.

## 8. Resíduos semânticos não capturados pela lista de tokens

A lista de 23 tokens é uma **primeira aproximação**, não o inventário completo. Os casos abaixo exigem varredura complementar:

| Resíduo | Onde | Observação |
| --- | --- | --- |
| “Banco da Inglaterra” | `NEWS.uk.12` | não contém token em inglês; é resíduo semântico |
| `UKCA`, `CE marking`, “marcação CE” | `BMC_DATA` aether | não estão na lista de tokens |
| “National Cyber Security Centre” | `BMC_DATA` cyber | nome por extenso dentro de parênteses |
| “integrated care boards” / “conselhos de atenção integrada” | `BMC_DATA` sorgente | estrutura do NHS sem equivalente brasileiro direto |
| `trusts`, `trust` | vários targets | palavra genérica que pode permanecer após a troca de NHS |
| `City` | `FUNDERS.meilingKoh`, `class Game` | metonímia do mercado financeiro londrino |
| `Cambridge`, `Oxford`, `London`, `Scotland`, `England` | targets de mercado, financiadores e perfis | geografia britânica |
| `£` | 81 pares em `structures.pt-BR.json`, 3 em `news-context` | moeda; decisão D-2 |
| Alegações clínicas | `BMC_DATA` aether, `VENTURE_MARKETS`, `PIVOT_MILESTONES`, eventos | “diagnóstico”, “triagem”, “validação clínica”, “pacientes” |
| `PM`, `Prime Minister`, `Chancellor` | `SHOCKS`, `FUNDER_EVENTS`, `REGIONS` | títulos políticos |
| `Skilled Worker visa`, `sponsor licence`, `right to work` | `REGIONS`, `CHAR_EVENTS`, `CANDIDATE_POOL` | imigração; C6/D |

Contagem complementar (targets em `locales/structures.pt-BR.json`): 81 pares com `£`, 101 com geografia britânica, 133 com vocabulário clínico. Esses números **não** estão incluídos nos 103 alvos institucionais; são a base da varredura C-2 do contrato.

## 9. Provas e reprodutibilidade

- `inventariar-c.cjs` → `INVENTARIO_C_OCORRENCIAS.json`, `INVENTARIO_C_RESUMO.json`, `CONFERENCIA_C.txt`.
- `gerar-caminhos-c.cjs` → `CAMINHOS_C.csv`, `CAMINHOS_C.json`.
- `gerar-anexo-c.cjs` → `ANEXO_OCORRENCIAS_C.md` (338 ocorrências, 1.132 linhas).
- `inspecionar-c.cjs` → conferência de `GENERIC_EVENTS` e `NEWS`.
- `propor-c.cjs` → `PROPOSTAS_C.csv`, `PROPOSTAS_C.md` (136 caminhos propostos; hipótese A, não aprovada).

Os scripts são de diagnóstico e não fazem parte do build. Nenhum deles altera `source/` ou `index.html`.

## 10. Limitações

1. A varredura é lexical. Nomes já traduzidos (“Banco da Inglaterra”) e estruturas equivalentes (“conselhos de atenção integrada”) não são detectados por token.
2. A contagem de 103 alvos cobre o recorte institucional; moeda, geografia e vocabulário clínico exigem a varredura C-2.
3. O inventário não decide tradução. Cada caminho precisa de classificação (preservar, adaptar, neutralizar) e justificativa.
4. O pacote não substitui a revisão humana do glossário nem a revisão independente de código.
5. `artifacts/` é ignorado pelo `.gitignore`; este documento e as provas não estão no GitHub. Para continuidade a partir do repositório, é preciso `git add -f artifacts/lote-cd-diagnostico-20261116` ou copiar os entregáveis para `docs/`.
