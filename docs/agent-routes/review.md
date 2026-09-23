# Rota de revisão, Gauntlet e entrega

Para cada lote: evidência da fonte e do diff; decisão com critérios observáveis; veredito independente; prova com testes executados pelo coordenador. O revisor que não escreveu o lote examina código e artefatos em modo somente leitura. Negar shell e edição ao revisor protege o checkout; ele pode avaliar saídas de teste produzidas por outro agente. Não chame uma revisão do mesmo construtor de independente.

O revisor pontua 0–10, cita erros concretos e indica correções. Reavalie depois das correções. Encerre com pelo menos 9/10 e sem pendência do escopo, em até três ciclos. Ao terceiro ciclo ainda pendente, registre `BLOCKED_FOR_REVIEW`; não invente nota. A nota de um lote não aprova o projeto inteiro.

Prova mínima: hash do original, catálogo e caminhos cobertos, paridade AST, métodos reais quando afetados, `.\check_project.ps1` com exit 0, `git diff --check`, teste visual pertinente e relatório em `docs/REVISAO_*.md`. No relatório, anote nota inicial/final, ciclos, achados, correções, testes, limites e commit.

No fechamento de uma entrega, confirme `git status --short`, commit e estado de sincronização com o GitHub. Não inclua segredos. O repositório público já foi autorizado, mas publicação de site, alterações adicionais no Supabase e gasto em serviços opcionais exigem decisão própria.
