# Glossário C — hipótese A (genérica/fictícia)

Data: 17/11/2026
Status: **aprovado em 17/11/2026** — hipótese A para D-1 a D-13.
Documento autônomo para decisão humana. Detalhes e consumidores estão em `CONTRATO_C.md`.

## 1. Regra geral

1. Nenhum nome real de instituição, programa, cargo, índice ou empresa é apresentado como parceiro, aprovador, financiador ou benfeitor.
2. O texto adaptado não dá conselho jurídico, fiscal, sanitário, migratório ou financeiro.
3. Nenhuma alegação clínica: sem diagnóstico, prescrição, triagem clínica, validação clínica ou resultado em pacientes.
4. Nomes próprios fictícios de pessoas, empresas e empreendimentos são preservados.
5. Valores, IDs, fórmulas, ordem de arrays, seletores, saves e marcadores `[NEW]` são preservados.
6. Cada troca é por caminho, com catálogo/patch; substituição global é proibida.
7. A hipótese A é a recomendação técnica; a alternativa B (equivalência brasileira real) aumenta o risco de endosso e de orientação real.

## 2. Instituições e regimes

| Referência | Tratamento A | Não usar | Risco evitado |
| --- | --- | --- | --- |
| NHS | rede pública de saúde | SUS como parceiro ou aprovador | endosso, dever sanitário |
| NHS Trust / Trusts | hospital público / hospitais públicos | unidade do SUS | idem |
| NHS Digital / NHS England / NHSX | área de dados / coordenação nacional / área de transformação digital da rede pública | DATASUS / Ministério da Saúde | idem |
| MHRA | autoridade sanitária | ANVISA | registro/approvação real |
| NICE | órgão de avaliação de tecnologias em saúde | CONITEC | incorporação real |
| FCA | autoridade do mercado de capitais | CVM | regulação real |
| NCSC | autoridade de segurança cibernética | GSI/DSIC | certificação real |
| ICO | autoridade de proteção de dados | ANPD | fiscalização real |
| HMRC | autoridade tributária | Receita Federal | regra fiscal real |
| Home Office | autoridade de imigração | Polícia Federal / Ministério da Justiça | regra migratória real |
| Innovate UK | agência pública de fomento | FINEP | edital/benefício real |
| UKRI | conselho de pesquisa | CNPq | idem |
| British Business Bank | banco de desenvolvimento | BNDES | idem |
| EIS / Enterprise Investment Scheme | incentivo fiscal a investimento-anjo (fictício) | incentivo real | benefício fiscal real |
| R&D Tax Credits | incentivos fiscais à P&D (fictícios) | Lei do Bem | idem |
| Skilled Worker visa | visto de trabalho | regra migratória brasileira | conselho migratório |
| FTSE 100 | grandes empresas de capital aberto | Ibovespa | índice real |
| Bank of England | banco central | Banco Central do Brasil | autoridade real |
| Chancellor | autoridade econômica nacional | Ministro da Fazenda | cargo real |
| Prime Minister | autoridade nacional | Presidente da República | cargo real |
| Crown Court | tribunal | tribunal brasileiro | jurisdição real |
| Dragons' Den | programa de investidores-anjo | programa brasileiro | marca real |
| City | mercado financeiro | cidade real | metonímia ambígua |

## 3. Geografia e cultura

| Referência | Tratamento A | Observação |
| --- | --- | --- |
| London / Londres | cidade-sede fictícia ou “capital” | não usar endereço real de instituição |
| Cambridge / Oxford | universidade fictícia ou “universidade de pesquisa” | não declarar vínculo real |
| Scotland / England / UK | região fictícia ou “mercado nacional” | manter coerência com a cidade escolhida |
| Reino Unido / British | Brasil / brasileiro | quando o contexto for mercado interno |
| £ | R$ (apresentação) | dígitos preservados; sem conversão cambial |
| Prime Minister / Chancellor | autoridade nacional / autoridade econômica | evitar cargo real e endosso |

## 4. Moeda

- Símbolo visível: `R$`.
- Dígitos e proporções: preservados. Não há conversão cambial.
- `currencyMultiplier`: 1.
- Aviso de ficção: valores ilustrativos, não são projeção financeira nem conselho de investimento.
- Exceção: gráfico, ícone ou string técnica que quebre layout pode manter o símbolo original, com justificativa registrada.

## 5. Termos proibidos no texto adaptado

- “aprovado pelo SUS”, “aprovado pela ANVISA”, “aprovado pela CVM”, “certificado pelo NCSC”;
- “parceria com o NHS”, “contratado pelo NHS”, “financiado pela Innovate UK”;
- “elegível ao EIS”, “enquadrado na Lei do Bem”, “crédito fiscal garantido”;
- “garantimos o visto”, “direito de trabalhar no Reino Unido”, “sponsor licence”;
- “diagnóstico clínico”, “triagem clínica”, “validação clínica”, “resultado em pacientes”;
- “recomendação de investimento”, “retorno garantido”, “isenção fiscal”.

## 6. Exemplos de aplicação (ilustrativos, não aprovados)

| Antes (ficção britânica) | Depois (hipótese A) |
| --- | --- |
| `NHS Research Partnership` | `Parceria de pesquisa da rede pública de saúde` |
| `MHRA Pre-Submission` | `Consulta prévia à autoridade sanitária` |
| `FCA Sandbox Approval` | `Aprovação em ambiente regulatório controlado` |
| `NCSC Approved` | `Avaliação de segurança cibernética concluída` |
| `Innovate UK grant` | `Fomento público à inovação` |
| `£250,000` | `R$ 250.000` |
| `London, UK` | `capital` ou cidade fictícia coerente |

Os exemplos mostram a direção; cada caminho real precisa de classificação e justificativa próprias.

## 7. O que preservar sem traduzir

- créditos ESRC, licença CC, link “Jogar The Slingshot original”;
- campos `source`;
- nomes próprios fictícios de pessoas, empresas e empreendimentos;
- painel legal ICO/PECR/GDPR (documento operacional do site);
- `REGIONS` e `LOCATIONS` como legado, sem consumidor visível;
- IDs, fórmulas, valores, ordem de arrays, seletores, saves e `[NEW]`.

## 8. Decisão registrada

O usuário aprovou a hipótese A como padrão para C1–C5 em 17/11/2026, sem exceções por termo. A decisão está registrada em `CONTRATO_C.md`, seção 10.
