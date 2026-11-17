# Contrato C — instituições, prosa e apresentação

Data: 17/11/2026
Base: `main` / `061e990c8cfa0a8b21f50ad0858b924aba525349`
Fonte: `source/index.original.html` — SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`
Status: **aprovado em 17/11/2026.** Hipótese A para D-1 a D-13; D-14 opção B (documentos em `docs/`; provas brutas locais). C1 autorizado a iniciar após o registro documental.

## 1. Objetivo

Delimitar a adaptação brasileira das referências institucionais britânicas, da prosa visível e da apresentação global, sem:

- transformar ficção em orientação jurídica, fiscal, sanitária, migratória ou financeira;
- declarar endosso, aprovação ou parceria de instituição real;
- alterar fórmulas, IDs, valores, ordem de arrays, seletores, saves ou marcadores `[NEW]`;
- reabrir integralmente lotes já aceitos;
- misturar Lotes A/B (em `BLOCKED_FOR_REVIEW`) com C ou D.

O contrato cobre C1–C6. O Pacote D (192 perfis) tem contrato próprio e não é executado aqui.

## 2. Invariantes

1. `source/index.original.html` permanece com SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
2. `index.html` é gerado somente por `npm run build`; nunca editado à mão.
3. Nenhum ID, fórmula, valor numérico, ordem de array, seletor, chave de save ou marcador `[NEW]` muda sem decisão específica.
4. Créditos ESRC, licença CC, link “Jogar The Slingshot original” e campos `source` são preservados.
5. O painel legal ICO/PECR/GDPR é documento operacional do site, não ficção; fica fora do Pacote C.
6. Cada caminho tem classificação, consumidor e justificativa. Substituição global é proibida.
7. O texto adaptado não afirma que uma instituição real aprovou, financiou, contratou ou endossou o produto.
8. O texto adaptado não dá conselho jurídico, fiscal, sanitário, migratório ou financeiro.
9. Alegações clínicas de diagnóstico, prescrição, triagem clínica ou resultado em pacientes não entram no produto.
10. Staging, commit e push ficam com o usuário, salvo autorização explícita.

## 3. Glossário — hipótese A (genérica/fictícia)

A hipótese A evita nomes reais e usa rótulos funcionais genéricos. É a recomendação técnica, não uma aprovação.

### 3.1 Instituições e regimes

| Referência | Tratamento A | Alternativa B (equivalência brasileira) | Risco de B |
| --- | --- | --- | --- |
| NHS | rede pública de saúde | SUS | implica instituição real, endosso e deveres sanitários |
| NHS Trust / Trusts | hospital público / hospitais públicos | unidades do SUS | idem |
| NHS Digital / NHS England / NHSX | área de dados / coordenação nacional / área de transformação digital da rede pública | DATASUS / Ministério da Saúde | idem |
| MHRA | autoridade sanitária | ANVISA | implica registro/approvação real |
| NICE | órgão de avaliação de tecnologias em saúde | CONITEC | implica incorporação real |
| FCA | autoridade do mercado de capitais | CVM | implica regulação real |
| NCSC | autoridade de segurança cibernética | GSI/DSIC | implica certificação real |
| ICO | autoridade de proteção de dados | ANPD | implica fiscalização real |
| HMRC | autoridade tributária | Receita Federal | implica regra fiscal real |
| Home Office | autoridade de imigração | Polícia Federal / Ministério da Justiça | implica regra migratória real |
| Innovate UK | agência pública de fomento | FINEP | implica edital/benefício real |
| UKRI | conselho de pesquisa | CNPq | idem |
| British Business Bank | banco de desenvolvimento | BNDES | idem |
| EIS / Enterprise Investment Scheme | incentivo fiscal a investimento-anjo (fictício) | incentivo real | implica benefício fiscal real |
| R&D Tax Credits | incentivos fiscais à P&D | Lei do Bem | idem |
| Skilled Worker visa | visto de trabalho | visto de trabalho brasileiro | implica regra migratória real |
| FTSE 100 | grandes empresas de capital aberto | Ibovespa | implica índice real |
| Bank of England | banco central | Banco Central do Brasil | implica autoridade real |
| Chancellor | autoridade econômica nacional | Ministro da Fazenda | implica cargo real |
| Prime Minister | autoridade nacional | Presidente da República | implica cargo real |
| Crown Court | tribunal | tribunal brasileiro | idem |
| Dragons' Den | programa de investidores-anjo | programa brasileiro | implica marca real |
| City | mercado financeiro | mercado financeiro | baixo |

### 3.2 Geografia e cultura

| Referência | Tratamento A | Observação |
| --- | --- | --- |
| London / Londres | cidade-sede fictícia ou “capital” | não usar endereço real de instituição |
| Cambridge / Oxford | universidade fictícia ou “universidade de pesquisa” | não declarar vínculo real |
| Scotland / England / UK | região fictícia ou “mercado nacional” | manter coerência com a cidade escolhida |
| Reino Unido / British | Brasil / brasileiro | quando o contexto for mercado interno |
| £ | R$ (apresentação) | dígitos preservados; sem conversão cambial |
| Prime Minister / Chancellor | autoridade nacional / autoridade econômica | evitar cargo real e endosso |

### 3.3 Moeda

- Símbolo: `£` → `R$`.
- Dígitos e proporções: preservados. Não há conversão cambial.
- `currencyMultiplier`: 1.
- Aviso de ficção: valores são ilustrativos, não são projeção financeira nem conselho de investimento.
- Exceção: gráficos, ícones e strings técnicas que não são texto visível podem manter o símbolo original se a alteração quebrar layout; cada exceção precisa de justificativa.

## 4. Decisões humanas necessárias

### D-1 — Estratégia de referência institucional

- **A (recomendada):** rótulo genérico/fictício, sem nome real.
- B: equivalência brasileira explícita (SUS, ANVISA, FINEP etc.).
- C: manter nomes britânicos como ficção estrangeira.

Consequência: D-1 bloqueia C1–C6. Sem ela, não há como classificar 195 ocorrências de NHS nem 66 alvos.

### D-2 — Moeda e valores

- **A (recomendada):** R$ como apresentação; dígitos preservados; sem conversão.
- B: manter £ como ficção estrangeira.
- C: converter por câmbio (rejeitada: altera a calibração econômica).

Consequência: 81 pares em `structures.pt-BR.json` e 3 em `news-context` têm `£`. A camada `R` já força `R$`, mas os catálogos ainda exibem `£` em textos.

### D-3 — NHS

- **A (recomendada):** “rede pública de saúde”.
- B: “SUS” explícito, com aviso de ficção e sem endosso.
- C: manter NHS.

Consequência: 195 ocorrências na fonte; 66 alvos no target. A escolha define todo o vocabulário de C2–C5.

### D-4 — Aether clínico ou administrativo

- **A (recomendada):** manter Aether não clínico — fluxo administrativo, recepção, organização de atendimento; remover “diagnóstico”, “triagem”, “validação clínica” e “pacientes”.
- B: healthtech com alegações clínicas (rejeitada: risco sanitário e legal).

Consequência: C2, C4 e C5 têm textos clínicos que precisam ser neutralizados mesmo depois da troca de NHS. A decisão de 12/10/2026 já restringe conteúdo clínico; D-4 confirma a aplicação.

### D-5 — Reguladores

- **A (recomendada):** rótulos funcionais genéricos (tabela 3.1).
- B: equivalentes brasileiros reais.
- C: manter nomes britânicos.

Consequência: 20 MHRA, 10 NICE, 14 FCA, 14 NCSC, 10 ICO, 3 HMRC, 13 Home Office na fonte.

### D-6 — Fomento e incentivos

- **A (recomendada):** programas fictícios genéricos; nenhuma regra de elegibilidade, benefício ou crédito fiscal.
- B: programas brasileiros reais.
- C: manter nomes britânicos.

Consequência: 23 Innovate UK, 3 UKRI, 2 British Business Bank, 3 EIS/Enterprise Investment Scheme, 2 R&D Tax Credits; C5 tem 4 nomes de programas de grant.

### D-7 — Imigração e vistos

- **A (recomendada):** “visto de trabalho”, “autoridade de imigração”; remover sponsor licence, right to work e prazos específicos.
- B: manter regra britânica.
- C: regra brasileira real (rejeitada: conselho migratório).

Consequência: 13 Home Office, 5 Skilled Worker visa, 4 sponsor/right-to-work em `CHAR_EVENTS`; C6/D tem 7 Home Office em `CANDIDATE_POOL`.

### D-8 — Geografia e cultura

- **A (recomendada):** geografia fictícia brasileira ou genérica; sem endereço real de instituição.
- B: manter geografia britânica como ficção.
- C: geografia genérica sem cidade.

Consequência: 101 pares com geografia britânica em `structures`; 13 em `news-context`; `REGIONS` e `LOCATIONS` são legado e ficam preservados.

### D-9 — Relabel Ada, `MILESTONES` e `PATHWAY_TABLE`

- **A (recomendada):** manter `MILESTONES` substituído por `setup-patch.cjs`/`operations-patch.cjs`; atualizar as chaves de `PATHWAY_TABLE`/`NEUTRAL_RELABELS` para os nomes traduzidos no mesmo lote; teste de integridade.
- B: preservar as chaves em inglês e aceitar relabel no-op.
- C: reverter `MILESTONES` para inglês (rejeitada: regride lote aceito).

Consequência: o relabel atual está quebrado nos pares com NHS/MHRA/NCSC/FCA. C2/C3 precisam corrigir isso ou registrar a limitação.

### D-10 — Lotes aceitos

- **A (recomendada):** não reabrir integralmente; autorizar apenas os adendos delimitados:
  - `FUNDER_ADVICE`: 14 caminhos;
  - `NEWS`: 5 caminhos (`stable.16`, `uk.12`, `uk.13`, `uk.14`, `uk.15`).
- B: não tocar nos lotes aceitos; documentar o resíduo como limitação.
- C: reabrir os lotes inteiros (rejeitada).

Consequência: sem A, 19 caminhos visíveis continuam com referência britânica.

### D-11 — Painel legal ICO/PECR/GDPR

- **A (recomendada):** preservar como documento operacional; revisão de privacidade/LGPD separada.
- B: adaptar para LGPD no Pacote C (rejeitada: muda documento legal sem revisão jurídica).

### D-12 — Créditos, licença e fonte

- **A (recomendada):** preservar ESRC, CC, link original, campos `source` e agradecimentos.
- B: traduzir nomes de financiadores históricos (rejeitada: descaracteriza crédito).

### D-13 — Pacote D e modelo

- **A (recomendada):** não iniciar D neste contrato; quando iniciar, usar **Sol, esforço alto**, com revisão independente.
- B: iniciar D no modelo atual (rejeitada para a implementação ampla dos 192 perfis).

### D-14 — Onde guardar o C0

- **A:** `git add -f artifacts/lote-cd-diagnostico-20261116` e commitar o pacote C0.
- B: copiar `INVENTARIO_C.md`, `CONTRATO_C.md`, `RISCOS.md` e `GLOSSARIO_C.md` para `docs/` e commitar.
- C: manter só local (padrão do `.gitignore`).

Consequência: `artifacts/` está ignorado; sem A ou B, o pacote não viaja para o GitHub.

## 5. Sub-lotes

### C1 — `REGIONS` e apresentação global

**Escopo:** 18 entradas de `REGIONS`, 22 ocorrências; `getCity`, `getUniversity`, `getLocations`, moeda, títulos, índice e banco central.

**Caminhos:** `REGIONS.uk.regulators.*`, `REGIONS.uk.healthcare.*`, `REGIONS.uk.stockIndex`, `REGIONS.uk.government.*`, `REGIONS.uk.immigration.workVisa`, `REGIONS.uk.culture.*`, `REGIONS.uk.centralBank`, `REGIONS.uk.titles.*`.

**Consumidor:** `R.cities`/`R.universities` sem chamadas; `region.currency`/`currencyMultiplier` na formatação; `R` congelado com R$/BRL/1.

**Trabalho:**
- Não alterar `REGIONS`; documentar como legado.
- Verificar o patch `const R = {...REGIONS.uk, currency: "R$", currencyName: "BRL", currencyMultiplier: 1}` e `getRegion()`.
- Confirmar que nenhuma tela exibe nome de regulador, banco central ou título político a partir de `REGIONS`.
- Se um consumidor visível aparecer, abrir patch delimitado — não traduzir a tabela inteira.

**Aceite:**
- `REGIONS` sem diff.
- `dashboard-localization.test.cjs` PASS.
- Nenhum token institucional visível no gerado por causa de `REGIONS`.
- Build + testes + `check_project.ps1`.

**Observação:** C1 pode ser um lote de verificação com diff zero. Isso é aceitável se as provas forem registradas.

### C2 — mercado e produto

**Escopo:** 78 caminhos.
- 45 `BMC_DATA`;
- 16 `VENTURE_MARKETS`;
- 3 `PIVOT_MILESTONES`;
- 2 `LOCATIONS` (preservar);
- 12 novos `RIVALS`/`PIVOT_RIVALS`.

**Trabalho:**
- Catálogo/patch por caminho.
- Preservar IDs, ordem, valores, `[NEW]`, fórmulas e seletores.
- `BMC_DATA`: consistência `initial` ↔ `pivots.*.changes.*.remove`; o mesmo texto de origem deve gerar o mesmo target.
- `VENTURE_MARKETS`: preservar níveis e ordem dos arrays.
- `PIVOT_MILESTONES`: não alterar `desc`/`notes` fora do caminho aprovado.
- `LOCATIONS`: preservar; só reabrir se `SlingshotManagement.locations` deixar de existir.
- `RIVALS`/`PIVOT_RIVALS`: criar entradas novas; não usar substituição global.
- Aplicar D-4 (neutralidade clínica) e D-9 (relabel).

**Aceite:**
- 0 tokens institucionais nos 76 caminhos ativos (excluídos os 2 de `LOCATIONS`).
- Nenhuma alegação de diagnóstico/triagem clínica/paciente nos caminhos de Aether.
- `BMC_DATA` initial/remove consistentes.
- Relabel Ada resolve as chaves e aplica as substituições.
- Build + testes + `check_project.ps1`.
- Revisão independente ≥9/10.

### C3 — fomento e financiadores

**Escopo:** 32 caminhos.
- 10 `FUNDERS`;
- 5 `M2_FUNDERS`;
- 2 `M3_FUNDERS`;
- 14 `FUNDER_ADVICE` (adendo delimitado);
- 1 `FOLLOW_ON_INVESTORS`;
- `MILESTONES` (verificação, sem catálogo paralelo).

**Trabalho:**
- Catálogo/patch por caminho.
- Preservar nomes próprios fictícios, valores, efeitos, `benefits` e `ongoing`.
- `FUNDER_ADVICE`: diff limitado aos 14 caminhos; nenhum outro par muda.
- `MILESTONES`: verificar patches `setup-patch.cjs`/`operations-patch.cjs`; não criar tradução duplicada.
- Atualizar `PATHWAY_TABLE`/`NEUTRAL_RELABELS` no mesmo lote (D-9).
- Aplicar D-6 (fomento fictício) e D-2 (moeda).

**Aceite:**
- 0 tokens nos 32 caminhos.
- `FUNDER_ADVICE` com diff restrito a 14 caminhos (teste de conjunto).
- `MILESTONES` sem regressão; relabel íntegro.
- Build + testes + `check_project.ps1`.
- Revisão independente ≥9/10.

### C4 — eventos, notícias e choques

**Escopo:** 25 caminhos.
- `NEWS`: 4 tokens + `uk.12` semântico;
- `SHOCKS`: 3 headlines + 3 textos + 1 ícone;
- `REVENUE_MARKETING_EVENTS`: 13 caminhos.

**Trabalho:**
- `NEWS`: adendo delimitado de 5 caminhos; não reabrir as 141 entradas.
- `SHOCKS`: headline, texto e ícone coerentes; nada de endosso político.
- `REVENUE_MARKETING_EVENTS`: preservar IDs, efeitos, custos, AP e ordem das escolhas.
- Não tocar em `CHAR_EVENTS`, `GENERIC_EVENTS`, `COMPETITIVE_EVENTS`, `LIFE_EVENTS`, `FUNDER_EVENTS`.

**Aceite:**
- 0 tokens nos 25 caminhos.
- `NEWS` com diff restrito a 5 caminhos.
- Nenhum efeito, custo ou ID alterado.
- Build + testes + `check_project.ps1`.
- Revisão independente ≥9/10.

### C5 — ajuda e `class Game`

**Escopo:** 36 caminhos.
- 33 em `class Game`;
- 2 em HTML de ajuda;
- 1 em `pitchSlideSVG`.

**Trabalho:**
- Textos de ajuda, tutoriais, coaching, orientação estratégica, demo day, pitch, finanças, grants e SVG.
- Programas de fomento fictícios; nenhuma elegibilidade, taxa ou benefício real.
- Preservar HTML, IDs, seletores e handlers.
- Não alterar fórmulas, valores ou efeitos.

**Aceite:**
- 0 tokens nos 36 caminhos.
- Nenhum conselho jurídico, fiscal, sanitário ou migratório.
- Seletores/IDs/handlers preservados.
- Build + testes + `check_project.ps1`.
- Revisão independente ≥9/10.

### C6 — perfis de candidatos

**Escopo:** 192 perfis; 52 ocorrências na fonte; referências não tokenizadas (universidades, cidades, vistos).
**Estado:** não executar no Pacote C. Entregar ao Pacote D com o glossário aprovado.
**Modelo:** exigir aviso e recomendação de **Sol, esforço alto** antes da implementação ampla.
**Aceite futuro:** contrato próprio, revisão de coerência dos 192 perfis, nenhuma instituição real, nenhum conselho migratório.

## 6. Ordem e gates

Ordem: **C1 → C2 → C3 → C5 → C4 → C6/D**.

| Gate | Condição |
| --- | --- |
| G0 | Aprovação humana do glossário e de D-1 a D-14 |
| G1 | C1 verificado; diff zero ou patch delimitado |
| G2 | C2 com 78 caminhos, relabel íntegro e revisão ≥9/10 |
| G3 | C3 com 32 caminhos, adendo de 14 e revisão ≥9/10 |
| G4 | C5 com 36 caminhos e revisão ≥9/10 |
| G5 | C4 com 25 caminhos, adendo de 5 e revisão ≥9/10 |
| G6 | C6/D com contrato próprio e modelo aprovado |

Cada gate exige:

1. `git status --short` conferido antes de editar.
2. Catálogo/patch por caminho, sem substituição global.
3. `npm run build`.
4. Suíte completa (`npm test` ou equivalente) sem regressão.
5. `.\check_project.ps1` com `PASS`.
6. Hashes de `source/index.original.html` e `index.html` registrados.
7. Diff conferido; nenhum caminho fora do escopo.
8. Revisão independente somente leitura, nota ≥9/10, com achados verificáveis.
9. `docs/ESTADO_ATUAL.md` atualizado com resultados, provas, limites e próxima ação.

## 7. Critérios transversais de aceite

### 7.1 Inventário e classificação

- Todo caminho alterado aparece em `CAMINHOS_C.csv`/`PROPOSTAS_C.csv` com classe, consumidor e justificativa.
- Nenhum caminho alterado fora do sub-lote.
- Nenhuma substituição global.

### 7.2 Integridade técnica

- IDs, fórmulas, valores, ordem de arrays, seletores e saves preservados.
- `[NEW]` preservado.
- `source`/`target` com paridade AST quando o catálogo exigir.
- Build reproduzível.
- `index.html` gerado, não editado.

### 7.3 Conteúdo

- Nenhum nome real de instituição, programa, cargo ou empresa é apresentado como parceiro/benfeitor.
- Nenhum endosso, aprovação ou benefício real.
- Nenhum conselho jurídico, fiscal, sanitário, migratório ou financeiro.
- Nenhuma alegação clínica.
- Nenhuma referência geográfica britânica inexplicada.
- Nenhum `£` em texto visível, salvo exceção justificada.

### 7.4 Revisão

- Revisor independente que não escreveu o lote.
- Somente leitura, sem shell nem edição.
- Nota de 0 a 10 com achados verificáveis.
- Correção e reavaliação até ≥9/10, no limite de três ciclos.
- Sem aceite na terceira tentativa: registrar `BLOCKED_FOR_REVIEW`.

## 8. Definição de pronto por sub-lote

Um sub-lote só está pronto quando:

1. Todos os caminhos do escopo têm diff ou preservação justificada.
2. Os critérios de aceite específicos passam.
3. Os critérios transversais passam.
4. A revisão independente atinge ≥9/10.
5. `docs/ESTADO_ATUAL.md` registra o resultado.
6. O usuário autoriza o commit (o agente não faz staging/commit/push por conta própria).

## 9. Fora de escopo

- Lotes A/B e o `BLOCKED_FOR_REVIEW`.
- Pacote D e os 192 perfis.
- Tradução/adaptação do painel legal ICO/PECR/GDPR.
- Alteração de `source/index.original.html`.
- Substituição global de termos.
- Mudança de fórmulas, valores, IDs, ordem de arrays, seletores ou saves.
- Novos provedores/modelos sem autorização.
- Publicação, cobrança, Supabase remoto ou START42.

## 10. Aprovação

O usuário aprovou, em 17/11/2026, a hipótese A para D-1 a D-13 e a opção B para D-14.

| Item | Decisão | Data | Responsável |
| --- | --- | --- | --- |
| D-1 estratégia institucional | A — rótulos genéricos/fictícios | 17/11/2026 | Usuário |
| D-2 moeda | A — `R$` na apresentação; sem conversão | 17/11/2026 | Usuário |
| D-3 NHS | A — rede pública de saúde | 17/11/2026 | Usuário |
| D-4 Aether não clínico | A — administrativo, sem alegação clínica | 17/11/2026 | Usuário |
| D-5 reguladores | A — rótulos funcionais genéricos | 17/11/2026 | Usuário |
| D-6 fomento | A — programas fictícios, sem benefício real | 17/11/2026 | Usuário |
| D-7 imigração | A — visto de trabalho genérico | 17/11/2026 | Usuário |
| D-8 geografia | A — geografia fictícia brasileira/genérica | 17/11/2026 | Usuário |
| D-9 relabel Ada | A — corrigir chaves no mesmo lote | 17/11/2026 | Usuário |
| D-10 lotes aceitos | A — adendos delimitados (14 + 5) | 17/11/2026 | Usuário |
| D-11 painel legal | A — preservar; revisão separada | 17/11/2026 | Usuário |
| D-12 créditos | A — preservar ESRC, CC, link e `source` | 17/11/2026 | Usuário |
| D-13 Pacote D/modelo | A — não iniciar; Sol, esforço alto | 17/11/2026 | Usuário |
| D-14 C0 no GitHub | B — documentos em `docs/`; provas brutas locais | 17/11/2026 | Usuário |

Sem essa aprovação registrada, C1 não começa.
