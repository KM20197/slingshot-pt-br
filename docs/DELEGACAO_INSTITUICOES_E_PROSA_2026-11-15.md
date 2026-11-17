# Delegação — Pacotes C e D

**Instituições britânicas, prosa longa e 192 perfis**

- **Data:** 15/11/2026
- **Atualização:** 16/11/2026 — Lotes A/B em `BLOCKED_FOR_REVIEW`; testes dedicados 6/6 e suíte completa 375/375; a revisão independente não emitiu parecer.
- **Checkout:** `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`
- **Estado de referência:** pós-r498, com Lotes A e B implementados e testados, mas em `BLOCKED_FOR_REVIEW`; a revisão independente não emitiu parecer.
- **Público:** LLM executor com leitura e escrita no checkout, acesso a Node/npm e capacidade de produzir artefatos verificáveis.

---

## Aviso de escalonamento obrigatório

O Pacote D inclui revisão integral e comparativa de 192 perfis de candidatos e análise narrativa extensa que cruza perfis, empreendimentos, eventos, BMC, fomento e efeitos econômicos. Conforme `AGENTS.md` e `docs/agent-routes/models.md`, antes de iniciar essa frente o executor deve avisar o usuário e recomendar **Sol, esforço alto**. A escolha é do usuário; nenhum chat troca de modelo silenciosamente.

O Pacote C pode começar no modelo atual. O diagnóstico do Pacote D também pode começar no modelo atual, mas a implementação completa, a calibração de `getHRRecommendation` e a revisão cruzada dos 192 perfis exigem a decisão do usuário sobre o modelo. Se o usuário não autorizar Sol, o Pacote D deve ser dividido em lotes delimitados, sem declarar cobertura global dos 192 perfis.

---

## Resumo executivo

| Pacote | Objetivo | Situação | Primeiro passo |
| --- | --- | --- | --- |
| **C** | Adaptar referências operacionais a instituições britânicas para o contexto brasileiro, sem transformar ficção em orientação legal, fiscal ou regulatória | Não iniciado | Inventário e contrato delimitado (`Prompt 0`) |
| **D** | Adaptar a prosa longa, os 192 perfis de `CANDIDATE_POOL` e o banco `getHRRecommendation`, com triagem por consumidor | Não iniciado | Inventário e contrato delimitado (`Prompt 0`) |

Os dois pacotes compartilham um glossário de instituições. O Pacote C define o glossário; o Pacote D o aplica aos perfis e à prosa. Nenhum dos dois pode começar por substituição global de texto.

**Aviso sobre os números:** 2.615 é a contagem histórica da r482, não a contagem atual. 192 é o total de perfis do `CANDIDATE_POOL`; 1.628 sinais longos cobrem os 192 perfis, 48 por papel. Não confunda sinal técnico com erro de tela, nem 1.628 com o total de 3.840 strings do pool.

---

## 1. Leitura obrigatória antes de qualquer edição

Leia, nesta ordem:

1. `AGENTS.md`
2. `docs/ESTADO_ATUAL.md`
3. `docs/MANUAL_ORQUESTRACAO.md`
4. `docs/DECISOES_APROVADAS.md`, em especial:
   - “Contexto brasileiro dos textos — esclarecimento humano de 12/10/2026”, linhas 165–171;
   - decisão de não substituir regulador britânico por orientação legal brasileira em conteúdo clínico, registrada no histórico da r161.
5. `docs/agent-routes/translation.md`
6. `docs/INVENTARIO_PENDENCIAS_ATUAL.md`
7. `docs/PROTOCOLO_OPENCODE.md`
8. `docs/MAPA_ARQUIVOS.md`
9. `docs/ESTADO_ATUAL.md` novamente depois do diagnóstico, para conferir se o lote atual mudou.

Não use `docs/HANDOFF_LLM_COMPLETO.md` nem handoffs datados como estado vigente. Eles servem apenas como evidência histórica.

---

## 2. Invariantes não negociáveis

- Preservar `source/index.original.html` com SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
- Gerar `index.html` somente com `npm run build`. Nunca editar o HTML gerado como fonte de verdade.
- Não alterar fórmulas, IDs, chaves, valores, ordem de arrays, seletores, condições, efeitos, saves ou marcadores `[NEW]` sem decisão humana específica.
- Preservar autoria, créditos, citação ESRC, licença CC, link “Jogar The Slingshot original” e campos `source` dos catálogos.
- Preservar a fonte histórica e os créditos institucionais. A adaptação do contexto operacional não autoriza apagar o registro de origem.
- Não transformar conteúdo ficcional em orientação jurídica, tributária, trabalhista, migratória, sanitária ou financeira real.
- Não declarar equivalência, endosso, aprovação ou garantia de instituição real.
- Não expor segredos, chaves ou dados de participantes.
- Não usar `git add -A`; staging, commit e push são decisão e execução do usuário.
- Um escritor por arquivo. Revisão independente somente leitura, com nota de 0 a 10 e achados verificáveis. Limite de três ciclos por lote; sem aceite na terceira tentativa, registrar `BLOCKED_FOR_REVIEW`.
- Não reabrir integralmente lotes já aceitos: `CHAR_EVENTS`, `GENERIC_EVENTS`, `COMPETITIVE_EVENTS`, `FUNDER_ADVICE`, NEWS141 e TEAM-CAPACITY-UI r496. Um novo contrato pode delimitar caminhos específicos dentro de uma raiz aceita, mas não pode reescrever o lote inteiro por conveniência.
- Não misturar os Lotes A/B, em `BLOCKED_FOR_REVIEW`, com C ou D. Se a revisão apontar correção, trate-a no lote próprio antes de abrir novo contrato.

---

## 3. Estado de referência

| Item | Valor no momento da redação | Observação |
| --- | --- | --- |
| Fonte original | `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61` | Intacta |
| `index.html` gerado | `6968ed1dea6c5b4d8f3aa77e99b12593a19c04802251c780aafc41b0645e4392` | Pode mudar a cada build |
| Build | concluído | Relatório em `artifacts/build-report.json`; 27 blocos JS e 205 traduções HTML |
| Suíte completa | 375/375, 0 falhas, 0 cancelados, 0 ignorados | Segunda execução completa; `check_project.ps1` retornou `PASS` |
| Lote A | `locales/management-setup.pt-BR.json`; `tests/management-lote-a.test.cjs` | Bio de Marcus implementada; 2 testes dedicados aprovados; sem revisão independente; não aprovada |
| Lote B | `locales/staff-hiring-ui.pt-BR.json`, `tools/staff-hiring-ui-patch.cjs`, `locales/setup-ui.pt-BR.json`, `tools/build.cjs`; `tests/staff-hiring-ui.test.cjs` | 10 métodos, 78 pares, 14 strings estáticas; 4 testes dedicados aprovados; disponibilidade de `1 month` e `3 months` corrigida; sem revisão independente; não aprovado |
| Revisão dos Lotes A/B | `artifacts/revisao-lotes-ab-20261116/BLOCKED_FOR_REVIEW.md` | Três tentativas sem parecer: limite gratuito e HTTP 500; testes dedicados acrescentados depois |

**Não use este documento como certificado dos Lotes A/B.** A revisão independente não emitiu `APROVADO` com nota igual ou superior a 9,0/10. Os dois lotes permanecem abertos em `BLOCKED_FOR_REVIEW` e não devem ser misturados com C ou D. Em 16/11/2026, o usuário decidiu manter o bloqueio e entregar este documento para execução dos Pacotes C/D; a decisão não aprova os Lotes A/B.

Evidências úteis:

- `artifacts/build-report.json`
- `artifacts/inventario-restante-20261022-r482/RELATORIO_FINAL.md`
- `artifacts/inventario-restante-20261022-r482/INVENTARIO_ESTRUTURAS.json`
- `artifacts/inventario-restante-20261022-r482/INVENTARIO_CAMADAS.json`
- `artifacts/recorte-pos-news-20261023-r489/INVENTARIO_CONSUMIDORES_R494.md`
- `artifacts/recorte-pos-news-20261023-r489/TRILHA_CONSUMIDORES.json`
- `docs/INVENTARIO_PENDENCIAS_ATUAL.md`

---

# Pacote C — Instituições britânicas

## 4. Decisão que enquadra o pacote

A decisão humana de 12/10/2026 determina que os textos da edição brasileira descrevam os empreendimentos e as regras da versão brasileira, que não se relaciona com uma startup na Inglaterra. Créditos, autoria, licenças e fonte histórica devem ser preservados, mas não definem o contexto operacional.

A decisão da r161 acrescenta um limite: não substituir regulador britânico por orientação legal brasileira em conteúdo clínico, nem usar dados reais de diagnóstico ou prescrição. O Pacote C deve adaptar a apresentação ficcional, não criar conduta profissional ou garantia jurídica.

Consequência prática: o pacote não é uma tradução de nomes. É uma triagem de referências por consumidor, com três resultados possíveis:

1. **Preservar** — crédito, autoria, licença, fonte histórica, chave interna, ID, seletor, save ou dado legado sem consumidor visível.
2. **Adaptar** — texto ficcional visível que descreve o contexto operacional brasileiro.
3. **Neutralizar** — referência sensível que não tem equivalente brasileiro seguro; usar rótulo genérico ou fictício, sem afirmar instituição, benefício ou aprovação real.

## 5. Inventário lexical de referência

O levantamento abaixo foi feito em 15/11/2026 sobre a fonte original e o `index.html` gerado. É um retrato lexical, não uma prova de consumidor ativo. Reextraia antes de contratar o lote.

| Referência | Fonte | Gerado | Raízes principais na fonte | Prioridade |
| --- | ---: | ---: | --- | --- |
| NHS | 202 | 138 | `CANDIDATE_POOL` 41, `BMC_DATA` 31, `class Game` 20, HTML 15, `GENERIC_EVENTS` 15, `VENTURE_MARKETS` 12, `REVENUE_MARKETING_EVENTS` 11, `PIVOT_RIVALS` 9, `FUNDERS` 7, `FUNDER_ADVICE` 7 | Alta |
| NICE | 10 | 9 | `REVENUE_MARKETING_EVENTS` 4, `BMC_DATA`, `FUNDERS`, `FUNDER_ADVICE`, `VENTURE_MARKETS`, `PIVOT_RIVALS`, `class Game` | Média |
| HMRC | 3 | 2 | `CANDIDATE_POOL`, `NEWS`, `LIFE_EVENTS` | Média |
| EIS | 2 | 2 | `REGIONS`, `NEWS` | Média |
| Innovate UK | 36 | 24 | `class Game` 24, HTML 5, `BMC_DATA` 2, `FUNDER_ADVICE` 2, `REGIONS`, `GENERIC_EVENTS`, `NEWS` | Alta |
| UKRI | 4 | 3 | `class Game` 2, `REGIONS`, `BMC_DATA` | Média |
| British Business Bank | 2 | 2 | `REGIONS`, `M3_FUNDERS` | Baixa |
| MHRA | 20 | 12 | `MILESTONES` 3, HTML 3, `BMC_DATA` 2, `FUNDER_ADVICE` 2, `VENTURE_MARKETS` 2, `GENERIC_EVENTS` 2, `REGIONS`, `M2_FUNDERS`, `M3_FUNDERS`, `CHAR_EVENTS`, `RIVALS`, `class Game` | Média |
| FCA | 14 | 7 | `BMC_DATA` 3, `MILESTONES` 2, `CANDIDATE_POOL` 2, `REGIONS`, `VENTURE_DETAILS`, `FUNDERS`, `FUNDER_ADVICE`, `TICKER_LINES`, `class Game`, HTML | Média |
| ICO | 10 | 2 | HTML 5, `GENERIC_EVENTS` 3, `REGIONS`, `SHOCKS` | Baixa |
| NCSC | 14 | 6 | `BMC_DATA` 5, `MILESTONES` 3, `VENTURE_MARKETS` 2, `RIVALS` 2, `REGIONS`, HTML | Baixa |
| Home Office | 13 | 9 | `CANDIDATE_POOL` 7, `CHAR_EVENTS` 3, `REGIONS` 2, `LIFE_EVENTS` | Média |
| FTSE 100 | 12 | 9 | `class Game` 4, `FUNDERS` 2, `REGIONS`, `BMC_DATA`, `FUNDER_ADVICE`, `FOLLOW_ON_INVESTORS`, `CHAR_EVENTS`, `GENERIC_EVENTS` | Baixa |
| Bank of England | 2 | 0 | `REGIONS`, `NEWS` | Baixa |
| Chancellor | 1 | 0 | `REGIONS` | Baixa |
| Prime Minister | 2 | 1 | `REGIONS`, `SHOCKS` | Baixa |
| Crown Court | 2 | 1 | `REGIONS`, `LIFE_EVENTS` | Baixa |
| Dragons' Den | 2 | 3 | `REGIONS`, `FUNDERS` | Baixa |
| Enterprise Investment Scheme | 1 | 1 | `REGIONS` | Baixa |
| R&D Tax Credits | 1 | 1 | `REGIONS` | Média |
| Skilled Worker visa | 5 | 0 | `CHAR_EVENTS` 4, `REGIONS` | Média |
| ISA | 0 | 0 | — | Fora do inventário atual |
| SEIS | 0 | 0 | — | Fora do inventário atual |

Leitura do inventário:

- **NHS concentra o esforço.** A maior parte está em dados de mercado de saúde, eventos, financiadores e perfis. Não é um único bloco.
- **Innovate UK aparece muito em `class Game`.** São textos de ajuda, aconselhamento e lógica de fomento. Parte pode ser apresentação; parte pode estar presa a condições. Exige leitura de consumidor.
- **NICE, HMRC, EIS, ISA e SEIS são menores do que o pedido sugere.** `ISA` e `SEIS` não aparecem como tokens isolados na fonte atual. `EIS` aparece duas vezes; `HMRC`, três.
- **Créditos e Sobre não entram.** O bloco de autoria, ESRC, Warwick, licença e link do original deve ser preservado. O build report rastreia `aboutContextTranslations`; não o use como lista de substituição.
- **Algumas referências já foram traduzidas.** O gerado tem menos ocorrências que a fonte; isso não prova que o consumidor visível está resolvido.

Comando de reconferência:

```powershell
rg -n -i "\b(NHS|NICE|HMRC|SEIS|ISA|EIS|Innovate UK|UKRI|British Business Bank|MHRA|FCA|ICO|NCSC|Home Office|FTSE 100|Bank of England|Chancellor|Prime Minister|Crown Court|Dragons' Den|Enterprise Investment Scheme|R&D Tax Credits|Skilled Worker visa)\b" source/index.original.html index.html locales tools
```

Para atribuir cada linha a uma raiz AST, use um auxiliar próprio ou o padrão de `artifacts/inventario-restante-20261022-r482/inventariar-camadas.cjs`. Não edite produto com base apenas na saída de `rg`.

## 6. Classificação obrigatória por ocorrência

Antes de propor qualquer substituição, classifique cada ocorrência em uma destas categorias:

| Categoria | Exemplos | Ação |
| --- | --- | --- |
| **Crédito, autoria ou licença** | ESRC, “Profiting from Science”, Warwick, licença CC, link do original, citação de Salter/Baruffaldi/Bignone | Preservar integralmente |
| **Chave, ID, seletor ou save** | `REGIONS.uk.healthcare.name`, IDs de evento, chaves de catálogo, seletores CSS, campos de save | Não alterar. Se precisar exibir outro rótulo, use camada de apresentação |
| **Nome próprio de pessoa, empresa ou obra** | NHS em nome de hospital fictício, “Barts Health Trust”, “Cambridge University Hospitals” | Classificar como nome próprio; não traduzir automaticamente. Propor equivalente apenas se o contrato autorizar |
| **Prosa ficcional visível** | Descrição de mercado, evento, conselho, ajuda, notícia | Adaptar com o glossário aprovado |
| **Referência factual sensível** | Regulador sanitário, benefício fiscal, visto, regra societária | Neutralizar ou usar equivalente genérico; não afirmar aprovação, elegibilidade ou garantia |
| **Legado sem consumidor ativo** | Caminhos bloqueados pelo fluxo operacional, campos sem acesso no AST | Documentar e preservar; não traduzir por aparência |
| **Dado técnico ou numérico** | Valores, prazos, contagens, efeitos, bônus | Preservar; não converter moeda nem unidade sem decisão |

Regra de ouro: se a ocorrência estiver em uma raiz já aceita e o novo contrato não delimitar o caminho exato, registre como resíduo fora do escopo. Não reabra o lote inteiro.

## 7. Glossário proposto

**Nenhuma linha desta tabela está aprovada.** É uma hipótese de trabalho para o contrato. O executor deve confirmar consumidor, contexto e risco antes de aplicar.

| Referência britânica | Equivalente brasileiro proposto | Risco e limite |
| --- | --- | --- |
| NHS | SUS; secretaria de saúde; hospital público; rede pública | Não afirmar vínculo, compra ou contrato real. Em perfil, pode ser experiência fictícia em hospital público |
| NHS Trust | secretaria de saúde; hospital público; unidade da rede | Evitar “trust” como se fosse figura jurídica brasileira |
| NHS Digital | área de dados do SUS; setor de informação em saúde | Evitar DATASUS como se houvesse integração real |
| NICE | CONITEC; órgão de avaliação de tecnologias em saúde | Não afirmar incorporação, cobertura ou recomendação |
| MHRA | ANVISA | Não afirmar aprovação, registro ou autorização |
| HMRC | Receita Federal | Não transformar em orientação tributária; preservar a ficção |
| EIS | incentivo fiscal a investimento-anjo (fictício); “instrumento de investimento com benefício fiscal” | O Brasil não tem EIS. Não inventar benefício, alíquota ou elegibilidade |
| SEIS | sem equivalente direto; usar “programa fictício de incentivo a startups” | Não criar regra real. Se não houver ocorrência, não inventar string |
| ISA | sem equivalente direto; usar “conta de investimento” genérica, se necessário | Não criar produto financeiro real |
| Innovate UK | FINEP; agência pública de fomento à inovação; “agência de fomento” | Preservar a mecânica de grant. Não afirmar programa, edital ou aprovação |
| UKRI | CNPq; FINEP; conselho de pesquisa | Usar “conselho de pesquisa” quando a especificidade não for necessária |
| British Business Bank | BNDES; banco de desenvolvimento | Não afirmar linha de crédito real |
| FCA | CVM | Não afirmar regra, autorização ou supervisão |
| ICO | ANPD | Não afirmar conformidade ou tratamento de dados real |
| NCSC | autoridade de segurança cibernética; centro de segurança cibernética | Não usar sigla real sem necessidade |
| Home Office | autoridade de imigração; Polícia Federal; consulado | Não afirmar regra migratória ou visto |
| FTSE 100 | Ibovespa | Apresentação apenas; não alterar índice interno |
| Bank of England | Banco Central do Brasil | Apresentação apenas |
| Chancellor | Ministro da Fazenda | Apresentação apenas |
| Prime Minister | Presidente da República | Apresentação apenas |
| Crown Court | Tribunal de Justiça | Apresentação apenas; não afirmar competência |
| Dragons' Den | programa de investidores-anjo; “programa de pitch” | Evitar marca de TV sem necessidade |
| R&D Tax Credits | incentivos fiscais à P&D; Lei do Bem | Não afirmar elegibilidade ou benefício |
| Skilled Worker visa | visto de trabalho; autorização de trabalho | Não afirmar regra migratória |
| “British AI”, “UK” em notícias | “Brasil”, “IA brasileira” ou região fictícia | Preservar nomes próprios e créditos; não converter geografia interna sem consumidor |

Diretrizes editoriais:

- Preferir “rede pública de saúde”, “agência de fomento”, “autoridade reguladora” quando o nome real criar atribuição indevida.
- Não usar nomes de instituições reais em contexto que sugira endosso, aprovação, contratação ou benefício.
- Não inserir marcas, programas ou leis brasileiras novas como se fossem fatos do jogo.
- Manter o tom fictício e administrativo já usado nos lotes aceitos.
- Preservar siglas de produto, IDs e seletores. Se a sigla for chave lógica, traduza apenas o rótulo exibido.

## 8. Caminhos e consumidores

### 8.1 Fonte original

Use `source/index.original.html` como referência de caminho e conteúdo. As linhas abaixo são estáveis; o `index.html` gerado muda de linha a cada build.

| Raiz | Linhas | Uso |
| --- | ---: | --- |
| `REGIONS` | 9182–9290 | Configuração do Reino Unido: NHS, MHRA, NCSC, ICO, FCA, Home Office, FTSE 100, UKRI, Innovate UK, ESRC, British Business Bank, EIS, R&D Tax Credits, visto, cultura, banco central, títulos |
| `VENTURE_DETAILS` | 9883–10112 | Mercado de saúde: clientes NHS, procurement, concorrência |
| `BMC_DATA` | 10116–12214 | BMC de saúde: parceiros, canais, segmentos, regulação |
| `LOCATIONS` | 12891–13195 | Cidades britânicas; parte é chave interna. A camada de gestão usa dados brasileiros |
| `FUNDERS` | 13226–14597 | Anjo ligado ao NHS, corporate VC farmacêutico, British Business Bank |
| `M2_FUNDERS`, `M3_FUNDERS` | 14603–15115 | Financiadores de estágio |
| `FUNDER_ADVICE` | 15250–16449 | Conselhos com NHS, NICE, MHRA, Innovate UK |
| `MILESTONES` | 16796–17532 | Marco de parceria de pesquisa com NHS |
| `VENTURE_MARKETS` | 17607–18544 | Mercados alternativos com NHS, ICB, NICE, ORCHA |
| `PIVOT_MILESTONES` | 18710–18937 | Marcos de pivô |
| `CANDIDATE_POOL` | 19528–23030 | Perfis com HMRC, DWP, NHS, Home Office; tratar no Pacote D |
| `CHAR_EVENTS` | 23036–32424 | Eventos de personagens; maioria já aceita. Não reabrir |
| `GENERIC_EVENTS` | 32429–35351 | Eventos genéricos; maioria já aceita. Só caminhos delimitados |
| `RIVALS`, `PIVOT_RIVALS` | 35355–36842 | Concorrentes e pivôs |
| `REVENUE_MARKETING_EVENTS` | 36846–37540 | Caminho legado; confirmar consumidor antes |
| `FUNDER_EVENTS` | 37544–38234 | Caminho legado; confirmar consumidor antes |
| `COMPETITIVE_EVENTS` | 38237–38326 | Eventos competitivos |
| `NEWS` | 38339–38495 | Notícias, incluindo `uk` com HMRC, Innovate UK, EIS |
| `SHOCKS` | 38498–38874 | Choques, incluindo Prime Minister e “UK AI ecosystem” |
| `LIFE_EVENTS` | 38891–39050 | Vida, incluindo HMRC e Crown Court |

### 8.2 Camadas de apresentação e dados brasileiros

- `tools/dashboard-localization-patch.cjs` — moeda de apresentação, `getRegion()` retornando `R`, textos de resumo.
- `tools/management-patch.cjs` — camada `SlingshotManagement`.
- `tools/setup-patch.cjs` — `getLocations`, `getExecutives`, `getLocationTier` e textos de setup.
- `location-display.js` (raiz) — exibição de localidades; conferir antes de mexer em `LOCATIONS`.
- `locales/management-setup.pt-BR.json` — cidades, gestores e metas brasileiras.
- `locales/structures.pt-BR.json`, `locales/setup-ui.pt-BR.json`, `locales/staff-hiring-ui.pt-BR.json` — catálogos de apresentação.
- `tools/catalogue-locations.cjs` — classificação explícita: nomes de cidades e chaves regionais podem ser preservados internamente porque controlam regras; a exibição é traduzida em outra camada.

### 8.3 Locales que contêm referências institucionais

O scan de 15/11/2026 encontrou tokens institucionais em 29 catálogos:

`about-context`, `advice-crown-targets`, `advice-healthcare-targets`, `advice-helix-targets`, `advice-initial-targets`, `advice-zenith-targets`, `char-aisha-context`, `char-david-context`, `char-emma-context`, `char-fatima-context`, `char-kwame-context`, `char-marcus-context`, `char-priya-context`, `clinic-legacy-decisions`, `funders-targets`, `generic-development-context`, `generic-general-context`, `generic-marketing-context`, `generic-operations-context`, `later-funders-targets`, `life-conference-context`, `news-context`, `pivot-milestones-descriptions-targets`, `pivot-milestones-notes-targets`, `structures`, `venture-markets-alternative-descriptions-targets`, `venture-markets-alternative-level-insights-targets`, `venture-markets-current-level-insights-targets`, `venture-markets-current-targets`.

Não trate essa lista como autorização para editar todos. Muitos são lotes aceitos. Use-a para localizar o par `source`/`target` e confirmar se o caminho já foi coberto.

## 9. Sub-lotes do Pacote C

| Sub-lote | Escopo | Dependência |
| --- | --- | --- |
| **C0** | Diagnóstico e contrato: inventário, classificação, glossário, lista de caminhos, riscos | Nenhuma |
| **C1** | `REGIONS` e apresentação global: rótulos de sistema, moeda, títulos, índice, banco central | C0 aprovado |
| **C2** | Mercado de saúde: `VENTURE_DETAILS`, `BMC_DATA`, `VENTURE_MARKETS`, `PIVOT_MILESTONES` | C1 ou glossário aprovado |
| **C3** | Fomento e financiadores: `FUNDERS`, `M2_FUNDERS`, `M3_FUNDERS`, `FUNDER_ADVICE`, `MILESTONES`, `FOLLOW_ON_INVESTORS` | Glossário aprovado |
| **C4** | Eventos, notícias e choques: `GENERIC_EVENTS`, `REVENUE_MARKETING_EVENTS`, `NEWS`, `SHOCKS`, `LIFE_EVENTS`, `COMPETITIVE_EVENTS`, `CHAR_EVENTS` apenas em caminhos delimitados | Confirmação de consumidor |
| **C5** | Textos de ajuda e `class Game`: fomento, aconselhamento, coaching, mensagens de sistema | C1 aprovado |
| **C6** | Perfis de candidatos | Entregar ao Pacote D com o glossário de C |

Ordem sugerida: C0 → C1 → C2 → C3 → C5 → C4 → C6. C4 é o mais arriscado porque mistura caminhos ativos e legados; deixe por último.

## 10. Entregáveis e validação do Pacote C

Cada sub-lote deve entregar:

1. Contrato com caminhos exatos, strings `source`, `target`, classificação e consumidor.
2. Catálogo ou patch por caminho, sem substituição global.
3. Relatório de diferenças: arquivos alterados, contagem de strings, o que ficou preservado.
4. Prova de que IDs, fórmulas, valores, ordem, seletores, `[NEW]` e saves não mudaram.
5. Build e `check_project.ps1` com saída registrada.
6. Revisão independente somente leitura, nota igual ou superior a 9,0/10, sem bloqueadores.
7. Atualização de `docs/ESTADO_ATUAL.md` e `docs/MAPA_ARQUIVOS.md` após o aceite.
8. Reexportação do pacote com `node tools/export-gemini-drive.cjs` após alteração de fonte exportada.

Critérios de aceite:

- Nenhuma referência operacional britânica permanece em tela alcançável do escopo, ou cada permanência tem justificativa de crédito, chave, nome próprio ou legado.
- Nenhuma instituição brasileira real é usada de forma que sugira endosso, aprovação, benefício ou garantia.
- Nenhuma fórmula, valor, ID, seletor, ordem ou save mudou.
- A fonte original continua com o SHA-256 esperado.
- O build é reproduzível e a suíte passa.

---

# Pacote D — Prosa longa, 192 perfis e `getHRRecommendation`

## 11. Base técnica e caveat

O inventário técnico da r482 comparou raízes do AST original e do AST gerado por nome e caminho. Encontrou **2.615 sinais de prosa longa iguais ao original** em 12 raízes. Isso não é contagem de erros, de telas restantes ou de tradução pendente. Também não cobre todos os strings: o `CANDIDATE_POOL`, por exemplo, tem 3.840 strings, das quais 1.628 são sinais longos.

Arquivo principal:

- `artifacts/inventario-restante-20261022-r482/INVENTARIO_ESTRUTURAS.json`
  - `candidates`: 2.615 entradas com `root`, `path`, `source`, `current`, `line`, `status`.
  - `roots`: 60 raízes, das quais 12 têm `unchangedProseSignals > 0`.
  - `sourceHash`: `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
  - `generatedHash`: `bbf1571d3574d875ecc48e9bb3133fac8fda1640da0425d0e779713c4d5e7563` (r482, histórico).

Arquivos de contexto:

- `artifacts/inventario-restante-20261022-r482/INVENTARIO_CAMADAS.json` — 3.635 sinais lexicais em camadas. Não somar com 2.615.
- `artifacts/inventario-restante-20261022-r482/RESUMO_CAMADAS.json` — resumo e limites.
- `docs/INVENTARIO_PENDENCIAS_ATUAL.md` — caveats editoriais.
- `artifacts/recorte-pos-news-20261023-r489/INVENTARIO_CONSUMIDORES_R494.md` — confirma que caminhos legados de receita, financiadores e choques estão bloqueados no fluxo operacional.

**Regra:** reextraia a contagem antes de contratar. Use o arquivo r482 como índice de caminhos, não como prova de cobertura atual.

## 12. Os 2.615 sinais por raiz

| Raiz | Sinais longos (r482) | Strings da raiz | Observação |
| --- | ---: | ---: | --- |
| `CANDIDATE_POOL` | 1.628 | 3.840 | 192 perfis com sinal longo, 48 por papel |
| `FUNDER_EVENTS` | 338 | 780 | Confirmar consumidor; parte pode ser legado |
| `RIVALS` | 230 | 1.356 | Concorrentes; muitos nomes próprios |
| `PIVOT_RIVALS` | 106 | 608 | Concorrentes de pivô |
| `REVENUE_MARKETING_EVENTS` | 102 | 255 | Caminho legado bloqueado no fluxo operacional (r494) |
| `NEWS` | 101 | 141 | Histórico: NEWS141 foi executado na r488; reextrair |
| `SHOCKS` | 68 | 220 | Caminho legado bloqueado no fluxo operacional (r494) |
| `PIVOT_MILESTONES` | 27 | 260 | 26 strings já alteradas; reextrair |
| `FOUNDER_PROFILES` | 8 | 264 | Apenas `famousExamples`; consumidor removido; não é tela |
| `TOKEN_SETTINGS` | 4 | 12 | Verificar consumidor |
| `FUNDERS` | 2 | 449 | 192 strings já alteradas; reextrair |
| `REGIONS` | 1 | 149 | Nome completo do MHRA; tratar no Pacote C |
| **Total** | **2.615** | — | — |

Notas:

- `NEWS` e `PIVOT_MILESTONES` são contagens históricas. Não use 101 ou 27 como meta atual.
- `REGIONS` pertence ao Pacote C, não ao D.
- `FOUNDER_PROFILES.famousExamples` são nomes próprios e exemplos históricos. Preservar ou substituir apenas com decisão humana.
- `REVENUE_MARKETING_EVENTS`, `SHOCKS` e `FUNDER_EVENTS` exigem trilha de consumidor antes de qualquer tradução. Texto inglês em caminho bloqueado não é defeito de tela ativa.

## 13. `CANDIDATE_POOL` — 192 perfis

### 13.1 Estrutura

- Fonte: `source/index.original.html`, linhas 19528–23030.
- Consumidor: `Game.showCandidatesModal` e métodos de contratação; a pool é lida em `const pool = CANDIDATE_POOL[job.role] || [];` (linha 62069 da fonte).
- 4 papéis × 48 perfis: `research`, `product`, `marketing`, `people`.
- Cada papel: 12 `lead`, 16 `senior`, 20 `junior`.
- Total: 192 perfis, 3.840 strings.
- 1.628 sinais longos iguais ao original, distribuídos em 192 perfis, 48 por papel. Cada perfil tem de 7 a 11 sinais:
  - `cv`: 1.219 sinais, presente nos 192 perfis
  - `background`: 192 sinais, um por perfil
  - `quote`: 172 sinais, em 172 perfis
  - `weaknesses`: 36 sinais, em 35 perfis
  - `origin`: 9 sinais, em 9 perfis

### 13.2 Catálogo de adaptação

`docs/CANDIDATOS_PARA_ADAPTACAO.txt`:

- Gerado por `tools/export-candidate-biographies.cjs`.
- 192 entradas, 15 campos cada: `ID`, `ÁREA`, `NÍVEL`, `NOME`, `CONTEXTO`, `ORIGEM`, `CITAÇÃO`, `FORMAÇÃO`, `EXPERIÊNCIA`, `REALIZAÇÕES`, `COMPETÊNCIAS`, `PERFIL`, `PONTOS FORTES`, `PONTOS DE ATENÇÃO`.
- Instrução explícita: não alterar ID, ÁREA, NÍVEL nem separadores; não incluir salários, participação, cidades ou regras econômicas.
- O arquivo é uma visão editorial. Nem todos os campos técnicos do pool estão nele.

O executor deve criar um catálogo de pares `source`/`target` por caminho, no padrão de `tools/catalogue-founder-profiles.cjs`, e um patch que aplique somente os caminhos aprovados. Não edite o pool por substituição global.

### 13.3 O que preservar

- `id`, `seniority`, `portrait`, `currentCity`, `willingToRelocate`, `remotePreference`.
- `salaryExpect`, `equityExpect`, `interest`, `availability`, `nonCompeteRisk`.
- `statBonus`, bônus, efeitos, números, anos, contagens e métricas.
- Ordem dos perfis e dos arrays.
- IDs de eventos, escolhas e saves.
- Marcadores como `↑`, `↑↑`, `↑↑↑`, `[NEW]`, emojis e pontuação.
- Nomes próprios, salvo decisão humana específica.

### 13.4 O que adaptar

- `background`, `quote`, `origin`, `cv.education`, `cv.experience`, `cv.achievements`, `cv.skills`, `cv.personality`, `strengths`, `weaknesses`.
- Instituições, empresas e programas citados, conforme o glossário do Pacote C.
- Contexto cultural, desde que não invente fato, benefício ou regra.
- Datas e números permanecem; nomes de empresas e instituições podem mudar com aprovação.

### 13.5 Nomes e identidade

Nomes próprios não são tradução. A decisão sobre manter, adaptar ou substituir nomes é humana. Se o contrato exigir nomes brasileiros, o executor deve propor uma lista, preservar a diversidade e não alterar IDs. Não invente biografias que atribuam fatos a pessoas reais.

## 14. `getHRRecommendation` — lógica e apresentação

Fonte: `source/index.original.html`, linhas 62320–62494.

O método contém:

- `execBiases` para `david`, `sofia`, `aisha`;
- `hiredBiases` para `h1` a `h7`;
- fallback genérico;
- `favors` e `dislikes` usados em `candidateText.includes(...)`;
- `safetyBias` e `salaryBias` numéricos;
- comentários `strong`, `weak`, `salary`.

Separação obrigatória:

| Parte | Tipo | Ação |
| --- | --- | --- |
| `comments.strong`, `comments.weak`, `comments.salary` | Apresentação | Traduzir/adaptar com segurança |
| `favors`, `dislikes` | Pontuação | Não traduzir como texto. Exige decisão e teste de paridade |
| `safetyBias`, `salaryBias` | Valores | Preservar |
| IDs `david`, `sofia`, `aisha`, `h1..h7` | Chaves | Preservar |
| `recommended`, `score` | Regra | Preservar comportamento ou obter aprovação para recalibrar |

O problema: `candidateText` é o JSON do candidato. Se os perfis forem adaptados para português e as listas continuarem em inglês, o scoring muda. Opções:

1. Manter as listas e adaptar os perfis para conter os mesmos marcadores. Risco: inglês residual e perda de naturalidade.
2. Traduzir as listas e recalibrar. Risco: mudar recomendação sem intenção.
3. Substituir o scoring por tags estruturadas. Risco: alteração de arquitetura e save.

Nenhuma opção está aprovada. O executor deve apresentar as três, com teste de paridade sobre os 192 perfis, e aguardar decisão humana. Não altere `favors`/`dislikes` silenciosamente.

## 15. Demais raízes do Pacote D

Ordem sugerida, depois do pool:

1. `FUNDER_EVENTS` — 338 sinais; confirmar consumidor e efeitos.
2. `RIVALS` — 230; classificar nomes próprios e descrições.
3. `PIVOT_RIVALS` — 106; idem.
4. `REVENUE_MARKETING_EVENTS` — 102; confirmar bloqueio operacional antes.
5. `SHOCKS` — 68; confirmar bloqueio operacional antes.
6. `PIVOT_MILESTONES` — 27; reextrair; 26 já alteradas.
7. `FOUNDER_PROFILES` — 8; nomes próprios históricos; provavelmente preservar.
8. `TOKEN_SETTINGS` — 4; verificar.
9. `FUNDERS` — 2; verificar.
10. `REGIONS` — 1; pertence ao Pacote C.

Para cada raiz, o contrato deve responder:

- Qual é o consumidor? Estático, dinâmico, evento, ajuda, tooltip, legado?
- O caminho é alcançável no fluxo operacional?
- Há efeito econômico, RNG, save ou condição associada?
- O texto é prosa, nome próprio, crédito, dado técnico ou chave?
- A tradução/adaptação muda alguma decisão do jogador?
- Qual é o teste que prova que a mudança é apenas de apresentação?

## 16. Sub-lotes do Pacote D

| Sub-lote | Escopo | Observação |
| --- | --- | --- |
| **D0** | Diagnóstico e contrato do pool + `getHRRecommendation` | Não editar |
| **D1** | `research` — 48 perfis | Primeiro papel; calibrar o padrão |
| **D2** | `product` — 48 perfis | Reutilizar o padrão |
| **D3** | `marketing` — 48 perfis | Reutilizar o padrão |
| **D4** | `people` — 48 perfis | Inclui `h1..h7` usados no HR |
| **D5** | Raízes restantes, uma por contrato | Confirmar consumidor |
| **D6** | `getHRRecommendation` + paridade dos 192 | Exige decisão sobre scoring |
| **D7** | Revisão cruzada dos 192 perfis | Sol, esforço alto |

D1–D4 podem ser executados em sequência no mesmo modelo, com revisão independente por papel. D7 é a revisão comparativa global e exige o aviso de escalonamento.

## 17. Entregáveis e validação do Pacote D

Cada sub-lote deve entregar:

1. Contrato com caminhos, strings, classificação, consumidor e efeito esperado.
2. Catálogo `source`/`target` por caminho, com validação de IDs, números, marcadores, interpolações e quebras de linha.
3. Patch que aplica somente os caminhos aprovados e falha se a âncora estiver ausente ou ambígua.
4. Teste que prova:
   - mesmos IDs, ordem, estatísticas, salários, equity, cidades e regras;
   - mesmos efeitos, RNG, saves e seletores;
   - textos adaptados apenas nos caminhos aprovados;
   - nenhum resíduo inglês no escopo, ou justificativa para cada permanência.
5. Build e `check_project.ps1` com saída registrada.
6. Revisão independente com nota igual ou superior a 9,0/10.
7. Atualização de estado, mapa e pacote.

Critérios de aceite:

- 48/48 perfis do papel cobertos, sem declarar cobertura dos 192 antes de D7.
- Nenhum caminho fora do contrato alterado.
- Nenhuma fórmula, valor, ID, seletor, ordem ou save mudou.
- `getHRRecommendation` preserva o comportamento aprovado ou tem recalibração aprovada e testada.
- Nenhuma referência institucional contradiz o glossário do Pacote C.
- A fonte original continua intacta.

---

## 18. Prompts prontos

Use um prompt por vez. Não execute C e D no mesmo ciclo. Anexe este documento ao prompt ou informe o caminho dele.

### Prompt 0 — diagnóstico e contrato (C e D)

~~~text
Você é o executor designado para os Pacotes C e D do Slingshot Brasil, no checkout C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br.

Leia AGENTS.md, docs/ESTADO_ATUAL.md, docs/MANUAL_ORQUESTRACAO.md, docs/DECISOES_APROVADAS.md (linhas 165–171 e histórico da r161), docs/agent-routes/translation.md, docs/INVENTARIO_PENDENCIAS_ATUAL.md, docs/PROTOCOLO_OPENCODE.md e docs/MAPA_ARQUIVOS.md.

Tarefa: produzir um diagnóstico somente leitura e um contrato delimitado para os Pacotes C e D. Não altere produto, não rode build e não faça staging/commit/push.

Entregue em artifacts/lote-cd-diagnostico-<AAAAMMDD>/:

1. INVENTARIO_C.md
   - Referências institucionais britânicas na fonte e no gerado, com arquivo, linha, raiz AST e trecho.
   - Classificação por consumidor: crédito, chave/ID, nome próprio, prosa visível, referência sensível, legado, dado técnico.
   - Lista de caminhos que pertencem a lotes já aceitos e não devem ser reabertos sem contrato específico.
   - Proposta de glossário, com risco e limite de cada equivalente.
2. INVENTARIO_D.md
   - Reextraia a contagem atual de sinais longos e compare com os 2.615 da r482.
   - Tabela por raiz, com consumidor, alcançabilidade, efeitos e tipo de texto.
   - Para CANDIDATE_POOL: 192 perfis, 4 papéis, 48 cada; campos textuais e campos a preservar.
   - Para getHRRecommendation: separe comentários de apresentação de favors/dislikes de pontuação.
3. CONTRATO_C.md
   - Sub-lotes C1..C6, caminhos exatos, strings source/target propostos, consumidor, teste e critério de aceite.
   - O que fica de fora e por quê.
4. CONTRATO_D.md
   - Sub-lotes D1..D7, caminhos exatos, estratégia de catálogo/patch, validação e critério de aceite.
   - Três opções para favors/dislikes, com impacto e teste de paridade.
5. RISCOS.md
   - Riscos de atribuição, orientação legal, regressão econômica, save, seletor, duplicidade e falso positivo lexical.

Regras:
- Não trate 2.615 como contagem atual nem como lista de erros.
- Não trate 1.628 como total de strings do pool.
- Não proponha substituição global.
- Não invente equivalente brasileiro para instituição sensível sem marcar como hipótese.
- Não declares cobertura global dos 192 perfis.
- Se o Pacote D exigir revisão comparativa ampla, avise que a recomendação é Sol, esforço alto, e aguarde decisão.

Critério de saída: contratos revisáveis, com caminhos e provas, sem edição de produto.
~~~

### Prompt C1 — implementação de um sub-lote do Pacote C

~~~text
Implemente somente o sub-lote <C1|C2|C3|C4|C5> aprovado no contrato artifacts/lote-cd-diagnostico-<AAAAMMDD>/CONTRATO_C.md.

Checkout: C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br.
Antes de editar, confira git status --short, o SHA-256 de source/index.original.html e o estado dos Lotes A/B. Se a fonte original não estiver em a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61, pare.

Escopo: exatamente os caminhos listados no contrato. Não altere caminhos fora dele.

Invariantes:
- Não edite index.html como fonte.
- Não altere fórmulas, IDs, valores, ordem, seletores, condições, efeitos, saves ou marcadores [NEW].
- Preserve créditos, ESRC, licença, link do original e campos source.
- Não transforme ficção em orientação legal, fiscal, sanitária, migratória ou financeira.
- Use catálogo/patch por caminho, com âncora única e falha explícita.
- Um escritor por arquivo.

Entregue:
1. Catálogo ou patch novo, com validação de source/target, dígitos, moeda, marcadores e interpolações.
2. Teste proporcional ao risco.
3. Relatório de diferenças e de preservação.
4. npm run build e .\check_project.ps1 com saída registrada em artifacts/.
5. Pedido de revisão independente somente leitura, nota 0–10.

Não faça staging, commit ou push. Não declare o lote pronto antes de revisão ≥9,0/10 e sem bloqueadores.
~~~

### Prompt D1 — diagnóstico do `CANDIDATE_POOL`

~~~text
Analise somente o CANDIDATE_POOL do Slingshot Brasil. Não edite produto.

Fonte: source/index.original.html, linhas 19528–23030.
Catálogo editorial: docs/CANDIDATOS_PARA_ADAPTACAO.txt (192 entradas, 15 campos).
Inventário técnico: artifacts/inventario-restante-20261022-r482/INVENTARIO_ESTRUTURAS.json (use como índice histórico, não como contagem atual).

Tarefa:
1. Confirme 192 perfis, 4 papéis × 48, e a distribuição 12 lead / 16 senior / 20 junior por papel.
2. Liste todos os campos textuais e os campos técnicos que devem ser preservados.
3. Reconcilie o catálogo de 15 campos com os 3.840 strings do pool; aponte o que o catálogo não cobre.
4. Classifique cada campo: traduzir, adaptar, preservar, decidir.
5. Proponha um catálogo de pares source/target por caminho, no padrão de tools/catalogue-founder-profiles.cjs.
6. Defina validações para IDs, ordem, estatísticas, salários, equity, cidades, efeitos, marcadores e quebras de linha.
7. Proponha a divisão em D1 research, D2 product, D3 marketing, D4 people.
8. Trate nomes próprios e origens como decisão humana; não os altere por inferência.

Entregue artifacts/lote-d-pool-diagnostico-<AAAAMMDD>/ com INVENTARIO.md, PROPOSTA_CATALOGO.md, VALIDACOES.md e RISCOS.md.

Não declare cobertura dos 192 perfis antes da revisão cruzada. Se a tarefa evoluir para comparação narrativa ampla, avise que a recomendação é Sol, esforço alto, e aguarde decisão.
~~~

### Prompt D2 — implementação de um papel do pool

~~~text
Implemente somente o papel <research|product|marketing|people> do CANDIDATE_POOL, conforme o contrato aprovado.

Escopo: 48 perfis do papel, nos caminhos exatos do contrato. Não altere os outros três papéis.

Use docs/CANDIDATOS_PARA_ADAPTACAO.txt como referência editorial e o catálogo source/target por caminho como fonte de aplicação. Não faça substituição global.

Preserve:
- id, seniority, portrait, currentCity, willingToRelocate, remotePreference;
- salaryExpect, equityExpect, interest, availability, nonCompeteRisk, statBonus;
- ordem, números, anos, contagens, efeitos, marcadores, emojis e pontuação;
- IDs, chaves, seletores e saves.

Adapte apenas os campos textuais aprovados, com o glossário do Pacote C. Nomes próprios e origens exigem decisão humana; não os mude por conta própria.

Entregue:
1. Catálogo JSON de pares source/target por caminho.
2. Patch que aplica somente os caminhos aprovados e falha em âncora ausente/ambígua.
3. Teste que prova preservação de IDs, ordem, estatísticas, salários, equity, cidades, efeitos e marcadores.
4. Relatório de cobertura 48/48 do papel, sem alegar 192/192.
5. npm run build e .\check_project.ps1.
6. Revisão independente somente leitura.

Não faça staging, commit ou push.
~~~

### Prompt D3 — implementação de uma raiz restante

~~~text
Implemente somente a raiz <FUNDER_EVENTS|RIVALS|PIVOT_RIVALS|REVENUE_MARKETING_EVENTS|SHOCKS|PIVOT_MILESTONES|FOUNDER_PROFILES|TOKEN_SETTINGS|FUNDERS> conforme o contrato aprovado.

Antes de editar:
1. Reconferir o consumidor no AST e no fluxo operacional.
2. Confirmar se o caminho é alcançável ou legado bloqueado.
3. Identificar efeitos, RNG, save, condições e seletores associados.
4. Separar prosa, nome próprio, crédito, dado técnico e chave.

Se o caminho for legado sem consumidor ativo, não traduza: registre a justificativa e preserve. Se houver dúvida de consumidor, pare e peça decisão.

Entregue catálogo/patch por caminho, teste de preservação, relatório de consumidor, build, check_project e revisão independente ≥9,0/10. Não faça staging, commit ou push.
~~~

### Prompt D4 — `getHRRecommendation` com paridade

~~~text
Analise e proponha a adaptação de getHRRecommendation (source/index.original.html, linhas 62320–62494) sem alterar produto nesta etapa.

Separe:
- comentários strong/weak/salary: apresentação;
- favors/dislikes: pontuação via candidateText.includes;
- safetyBias/salaryBias: valores;
- IDs david, sofia, aisha, h1..h7: chaves;
- recommended/score: regra.

Tarefa:
1. Construir um teste de paridade sobre os 192 perfis, comparando recomendação e score antes/depois.
2. Apresentar três opções: manter listas e adaptar perfis; traduzir listas e recalibrar; substituir por tags estruturadas.
3. Para cada opção, informar impacto em comportamento, save, testes, naturalidade e risco.
4. Recomendar uma opção com justificativa, sem aplicar.
5. Se a opção escolhida exigir mudança de arquitetura ou recalibração, avise que a decisão é humana e que a revisão comparativa ampla recomenda Sol, esforço alto.

Entregue artifacts/lote-d-hr-<AAAAMMDD>/ com PARIDADE.md, OPCOES.md, TESTE_PROPOSTO.md e RISCOS.md. Não edite produto.
~~~

### Prompt R — revisão independente

~~~text
Revise somente leitura o lote <C|D> do Slingshot Brasil. Não use shell, não edite arquivos e não confie no relatório do escritor sem conferir os arquivos.

Leia o contrato, o catálogo/patch, o teste, o build report e as faixas do index.html gerado. Confira:
1. Caminhos e strings exatamente dentro do escopo.
2. Preservação de fórmulas, IDs, valores, ordem, seletores, condições, efeitos, saves e [NEW].
3. Preservação de créditos, ESRC, licença, link do original e campos source.
4. Ausência de instituição real usada como endosso, aprovação, benefício ou garantia.
5. Qualidade editorial: concordância, gênero, clareza, glossário, consistência entre perfis.
6. Consistência do patch: âncora única, falha explícita, validação de dígitos/moeda/interpolações/quebras.
7. Cobertura declarada: 48/48 do papel, não 192/192; raiz delimitada, não global.
8. Regressões fora do escopo.

Entregue nota de 0 a 10, bloqueadores com arquivo:linha e correção mínima, achados não bloqueadores, evidências lidas e veredito APROVADO somente se nota ≥9,0 e sem bloqueadores.
~~~

---

## 19. Comandos de verificação

```powershell
# Estado do repositório
git status --short
git diff --check

# Fonte original
(Get-FileHash -LiteralPath source\index.original.html -Algorithm SHA256).Hash

# Build e suíte
npm run build
.\check_project.ps1

# Catálogo de perfis (não altera o jogo)
node tools/export-candidate-biographies.cjs

# Exportação do pacote local
node tools/export-gemini-drive.cjs
```

Registre a saída de build e de `check_project.ps1` em `artifacts/`. Não use saída truncada como prova. Se a suíte completa for longa, preserve o log e o código de saída.

---

## 20. Condições de parada

Pare e peça decisão humana se:

- o SHA-256 da fonte original divergir;
- o build ou a suíte falhar sem causa compreendida;
- o consumidor de um caminho não puder ser confirmado;
- a mudança exigir fórmula, valor, ID, seletor, save ou efeito novo;
- o equivalente brasileiro criar orientação legal, fiscal, sanitária, migratória ou financeira;
- o texto exigir nome real de instituição que sugira endosso ou aprovação;
- a revisão independente ficar abaixo de 9,0/10 após três ciclos;
- o Pacote D exigir revisão comparativa ampla sem decisão sobre Sol, esforço alto;
- houver conflito entre este documento e `docs/ESTADO_ATUAL.md` ou `docs/DECISOES_APROVADAS.md`. Nesse caso, prevalece a decisão humana registrada.

---

## 21. Proveniência e limites

- A fonte original é imutável e serve de base para qualquer conferência.
- O `index.html` é produto gerado; não é fonte de verdade.
- As contagens da r482 são históricas. A r488 executou NEWS141; a r494 aceitou sete rótulos; a r496 aceitou a capacidade da equipe; os Lotes A/B estão em `BLOCKED_FOR_REVIEW`, sem parecer independente. Nenhuma dessas etapas autoriza tratar 2.615 como contagem atual.
- A decisão de contexto brasileiro é de 12/10/2026. A restrição sobre regulador clínico é histórica e continua válida.
- O Pacote C não substitui aconselhamento profissional. O Pacote D não certifica coerência narrativa global dos 192 perfis.
- A revisão cruzada dos 192 perfis, a calibração econômica e a adaptação integral de todas as instituições continuam pendentes até contrato, implementação, teste e revisão independente próprios.

**Próximo passo:** executar o `Prompt 0`, revisar os contratos, obter decisão humana sobre o glossário e sobre o modelo do Pacote D, e só então iniciar C1 ou D1.
