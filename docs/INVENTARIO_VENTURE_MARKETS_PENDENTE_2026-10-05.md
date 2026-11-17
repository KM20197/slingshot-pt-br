# Inventário do próximo recorte — VENTURE_MARKETS

Data: 05/10/2026. Leitura da estrutura imutável `source/index.original.html`, sem edição de dados de mercado ou regras.

O recorte já aceito cobre 194 campos: 24 rótulos/descrições atuais, 36 nomes, 36 descrições, 36 resumos, 26 lacunas de equipe e 36 comentários de financiadores. A revisão independente final atribuiu 9/10 e aprovou o lote; as observações sobre alvos posicionais foram classificadas como não bloqueantes.

Próxima prosa candidata, ainda não traduzida:

| Grupo | Caminhos de apresentação | Preservar sem mudança |
|---|---:|---|
| `current.levels` | 120 (`name` + `insight`, 12 mercados × 5 níveis) | `threshold`, `bonus.type`, `bonus.value` |
| `current.customerInsights` | 120 (`name` + `insight`, 12 mercados × 5 níveis) | `threshold`, `bonus.type`, `bonus.value` |
| `alternatives[].levels` | 288 (`name` + `insight`, 36 alternativas × 4 níveis) | `threshold`, `bonus.type`, `bonus.value`, IDs e ordem |

Total de prosa candidata mapeada: **528 caminhos**. `marketOpp` (valor, potencial, desafio e risco), `pivotType`, `funderView`, `teamFit` e todos os bônus/efeitos ficam fora deste recorte: são dados/regras ou dependem da adaptação funcional P2/P3.

Antes de implementar, dividir os 528 caminhos por grupo e criar alvos por ID/caminho, não por posição. Exigir SHA da fonte, paridade AST, restauração integral, idempotência e rejeição atômica. Não alterar `index.html` manualmente.
