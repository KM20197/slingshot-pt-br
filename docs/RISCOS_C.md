# Riscos C — registro, mitigação e gates

Data: 17/11/2026
Base: `main` / `061e990c8cfa0a8b21f50ad0858b924aba525349`
Fonte: `source/index.original.html` — SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`
Gerado: `index.html` — SHA-256 `6968ed1dea6c5b4d8f3aa77e99b12593a19c04802251c780aafc41b0645e4392`
Natureza: C0 somente leitura. Este documento registra riscos; não aprova nem inicia C1.
Gate G0: **aprovado em 17/11/2026** — hipótese A em D-1 a D-13; D-14 opção B.

## 1. Escala

| Nível | Significado |
| --- | --- |
| Probabilidade | Baixa / Média / Alta |
| Impacto | Baixo / Médio / Alto / Crítico |
| Exposição | Produto, juridico, reputação, operação ou continuidade |

Um risco com impacto **Crítico** bloqueia o gate correspondente mesmo que a probabilidade seja baixa.

## 2. Responsabilidades

| Papel | Responsabilidade |
| --- | --- |
| Agente | Diagnosticar, propor, implementar por caminho, testar, registrar provas e apontar riscos residuais. |
| Usuário | Aprovar glossário e D-1 a D-14, autorizar staging/commit/push e decidir onde guardar o C0. |
| Revisor independente | Avaliar o lote somente leitura, com nota e achados verificáveis. Não corrige. |
| Revisão jurídica/privacidade | Tratar painel legal, LGPD e conteúdo sensível quando aplicável. |

O agente **não** aprova o próprio lote, **não** declara endosso institucional e **não** substitui revisão jurídica.

## 3. Registro de riscos

### 3.1 Continuidade e operação

| ID | Risco | Prob. | Impacto | Mitigação | Gate |
| --- | --- | --- | --- | --- | --- |
| R-01 | Apagar o checkout local antes de resolver D-14 e perder o pacote C0 (`artifacts/` está no `.gitignore`). | Alta | Alto | Resolver D-14 antes de qualquer exclusão; copiar os entregáveis para `docs/` ou `git add -f`; confirmar que o commit contém os arquivos. | G0 |
| R-02 | Apagar `opencode.json` ou `.env*` e perder configuração/credenciais locais não versionadas. | Média | Médio | Fazer backup fora do repositório; confirmar quais arquivos são ignorados antes de excluir a pasta. | Operação |
| R-03 | Apagar `node_modules` e não conseguir reconstruir o ambiente. | Baixa | Baixo | `node_modules` é reinstalável por `npm install`; registrar a versão do Node usada. | Operação |
| R-04 | Trabalhar em clone diferente do checkout validado e reintroduzir divergência. | Média | Alto | Conferir `git rev-parse HEAD`, `git status --short` e os dois hashes antes de cada lote. | Todos |
| R-05 | Editar `index.html` à mão ou rodar build fora do fluxo. | Baixa | Crítico | `index.html` só via `npm run build`; conferir hash; build reprodutível no gate. | Todos |
| R-06 | Alterar `source/index.original.html` por acidente. | Baixa | Crítico | Hash de controle antes/depois; qualquer divergência bloqueia o lote. | Todos |

### 3.2 Conteúdo e reputação

| ID | Risco | Prob. | Impacto | Mitigação | Gate |
| --- | --- | --- | --- | --- | --- |
| R-07 | Nome real de instituição ser lido como parceria, aprovação ou endosso. | Alta | Crítico | Hipótese A (rótulos genéricos/fictícios); varredura por token e por resíduo semântico; revisão independente. | G0–G5 |
| R-08 | Texto virar orientação jurídica, fiscal, sanitária, migratória ou financeira. | Média | Crítico | Lista de conteúdo proibido no contrato; revisão item a item; nenhum programa/benefício real. | G0–G5 |
| R-09 | Aether manter alegação clínica (diagnóstico, triagem, paciente, validação clínica). | Alta | Crítico | D-4: Aether administrativo; varredura clínica nos 78 caminhos de C2; revisão. | G2 |
| R-10 | Texto adaptado prometer benefício, crédito fiscal ou elegibilidade real. | Média | Alto | D-6: fomento fictício; nenhuma regra de elegibilidade; revisão. | G3, G4 |
| R-11 | Geografia britânica permanecer sem explicação e confundir o aluno. | Alta | Médio | D-8: geografia fictícia/brasileira; varredura de 101 pares; decisão por caminho. | G0, G2–G4 |
| R-12 | `£` visível ou mistura de moeda quebrar a leitura econômica. | Média | Médio | D-2: `R$` na apresentação, dígitos preservados, multiplicador 1; exceções justificadas. | G0–G5 |
| R-13 | Painel legal ICO/PECR/GDPR ser tratado como ficção e perder validade operacional. | Baixa | Alto | D-11: preservar; revisão de privacidade/LGPD separada. | G0 |

### 3.3 Integridade técnica

| ID | Risco | Prob. | Impacto | Mitigação | Gate |
| --- | --- | --- | --- | --- | --- |
| R-14 | Substituição global alterar caminhos fora do escopo. | Média | Crítico | Proibida substituição global; catálogo/patch por caminho; diff conferido contra `CAMINHOS_C.csv`. | G1–G5 |
| R-15 | `BMC_DATA` mudar `initial` sem mudar `pivots.*.changes.*.remove`, quebrando a remoção do pivô. | Alta | Alto | Teste de consistência `initial` ↔ `remove`; mesmo texto de origem gera o mesmo target. | G2 |
| R-16 | Relabel Ada virar no-op porque `MILESTONES` está traduzido e as chaves de `PATHWAY_TABLE`/`NEUTRAL_RELABELS` continuam em inglês. | Alta | Alto | D-9: atualizar chaves no mesmo lote; teste de que cada chave existe e a substituição ocorre. | G2, G3 |
| R-17 | IDs, fórmulas, valores, ordem de arrays, seletores ou saves alterados. | Média | Crítico | Invariantes do contrato; revisão de diff; suíte completa; `check_project.ps1`. | G1–G5 |
| R-18 | Marcador `[NEW]` perdido ou traduzido de forma inconsistente. | Média | Médio | Preservar o marcador; teste de higiene do gerado. | G2–G4 |
| R-19 | Paridade AST `source`/`target` quebrada em catálogo. | Média | Alto | Testes de estrutura; build falha em divergência. | G1–G5 |
| R-20 | Build não reproduzível ou `index.html` divergente do catálogo. | Baixa | Alto | Build limpo no gate; hash registrado; teste de reprodutibilidade. | Todos |

### 3.4 Lotes aceitos e escopo

| ID | Risco | Prob. | Impacto | Mitigação | Gate |
| --- | --- | --- | --- | --- | --- |
| R-21 | Reabrir integralmente `FUNDER_ADVICE` (861 entradas) e perder revisão já aceita. | Média | Alto | D-10: adendo delimitado de 14 caminhos; teste de conjunto provando que os outros 847 pares não mudaram. | G3 |
| R-22 | Reabrir integralmente `NEWS` (141 entradas) por causa de 5 resíduos. | Média | Alto | D-10: adendo delimitado de 5 caminhos; teste de conjunto. | G5 |
| R-23 | Tocar `CHAR_EVENTS`, `GENERIC_EVENTS`, `COMPETITIVE_EVENTS`, `LIFE_EVENTS`, `FUNDER_EVENTS` ou `TEAM-CAPACITY-UI` sem necessidade. | Média | Médio | Lista de não reabertura; varredura no target; diff restrito. | G4, G5 |
| R-24 | Misturar Lotes A/B (`BLOCKED_FOR_REVIEW`) com C ou D e contaminar o histórico. | Média | Alto | Escopo separado; nenhum caminho de A/B no inventário C; commit C com mensagem própria. | Todos |
| R-25 | Iniciar C1 sem aprovação do glossário e de D-1 a D-14. | Alta | Alto | Gate G0 explícito; C0 permanece somente leitura até a decisão humana. | G0 |
| R-26 | Iniciar o Pacote D (192 perfis) no modelo atual, sem capacidade e sem contrato próprio. | Média | Alto | D-13: não iniciar; exigir aviso e recomendação de **Sol, esforço alto**; contrato próprio. | G6 |

### 3.5 Revisão e aceite

| ID | Risco | Prob. | Impacto | Mitigação | Gate |
| --- | --- | --- | --- | --- | --- |
| R-27 | Revisão independente indisponível e lote ser declarado aprovado sem parecer. | Alta | Crítico | Sem revisor, registrar `BLOCKED_FOR_REVIEW`; nenhuma nota inventada; nenhum aceite implícito. | G1–G5 |
| R-28 | Revisor avaliar o próprio trabalho ou usar shell/edição. | Baixa | Alto | Revisor somente leitura, sem fallback de modelo, conforme configuração do projeto. | G1–G5 |
| R-29 | Nota ≥9/10 sem achados verificáveis. | Média | Médio | Exigir achados com arquivo, linha e prova; correção e reavaliação em até três ciclos. | G1–G5 |
| R-30 | `docs/ESTADO_ATUAL.md` não refletir o estado real e a próxima conversa partir de premissa errada. | Média | Alto | Atualizar estado, provas, limites e próxima ação a cada gate. | Todos |

## 4. Riscos residuais aceitos no C0

Estes riscos existem **hoje**, antes de C1, e não são resolvidos pelo diagnóstico:

1. 103 alvos de catálogo ainda exibem referência institucional britânica.
2. 19 caminhos em lotes aceitos (`FUNDER_ADVICE` 14, `NEWS` 5) continuam com resíduo.
3. `PATHWAY_TABLE`/`NEUTRAL_RELABELS` estão funcionalmente quebrados nos pares com nomes traduzidos.
4. 81 pares com `£`, 101 com geografia britânica e 133 com vocabulário clínico seguem nos catálogos.
5. Lotes A/B continuam em `BLOCKED_FOR_REVIEW`, sem parecer independente.
6. O pacote C0 não está no GitHub enquanto D-14 não for decidida.
7. A edição não está pronta para turma: tradução/adaptação global, rotas societárias, fomento, calibração e partida completa pendentes.

## 5. Gatilhos de parada

Parar o lote imediatamente e registrar `BLOCKED_FOR_REVIEW` se ocorrer qualquer um:

- hash de `source/index.original.html` diferente de `a8ce3636...`;
- `index.html` alterado fora do build;
- diff em caminho fora do escopo;
- substituição global detectada;
- ID, fórmula, valor, ordem de array, seletor ou save alterado;
- conteúdo jurídico, fiscal, sanitário, migratório ou financeiro introduzido;
- nome real de instituição apresentado como parceiro/benfeitor;
- lote aceito reaberto além do adendo autorizado;
- revisão independente ausente ou abaixo de 9/10 após três ciclos;
- tentativa de misturar A/B com C ou D.

## 6. Verificações mínimas por gate

```powershell
git rev-parse HEAD
git status --short
Get-FileHash source\index.original.html -Algorithm SHA256
Get-FileHash index.html -Algorithm SHA256
npm run build
npm test
.\check_project.ps1
```

Resultado esperado no C0 e em cada gate:

- `source/index.original.html` = `A8CE3636C328828FB311A505EC38603345C9AC5F08AE1BE8C01969818F1D8D61`;
- `index.html` = hash registrado no gate anterior, ou novo hash justificado por build aprovado;
- `git status --short` sem caminho inesperado;
- suíte sem regressão;
- `check_project.ps1` = `PASS`.

## 7. Decisões que reduzem risco

| Decisão | Risco reduzido |
| --- | --- |
| D-1 A (rótulos genéricos/fictícios) | R-07, R-08 |
| D-2 A (`R$`, sem conversão) | R-12 |
| D-3 A (rede pública de saúde) | R-07, R-09 |
| D-4 A (Aether não clínico) | R-09 |
| D-5 A (reguladores genéricos) | R-07, R-08 |
| D-6 A (fomento fictício) | R-08, R-10 |
| D-7 A (visto genérico) | R-08 |
| D-8 A (geografia fictícia/brasileira) | R-11 |
| D-9 A (relabel íntegro) | R-16 |
| D-10 A (adendos delimitados) | R-21, R-22 |
| D-11 A (preservar painel legal) | R-13 |
| D-12 A (preservar créditos) | R-07 |
| D-13 A (D com Sol, esforço alto) | R-26 |
| D-14 A ou B (C0 versionado) | R-01 |

## 8. Limitações deste registro

1. É um registro de C0; não substitui teste, revisão independente nem parecer jurídico.
2. Probabilidade e impacto são qualitativos, baseados no inventário e no contrato.
3. Novos riscos devem ser adicionados ao abrir cada sub-lote, com ID novo e gate associado.
4. Este documento não altera produto, não roda build e não autoriza C1.
