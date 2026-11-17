# Revisão P1 — recorte `VENTURE_MARKETS/current` (04/10/2026)

## Escopo

O lote traduz exclusivamente `current.name` e `current.description` dos doze IDs canônicos de `VENTURE_MARKETS`: 24 caminhos. Não altera IDs, regras, valores, riscos, bônus, alternativas, efeitos, metas, seletores ou os demais textos. A estrutura completa continua mista/legada e não está aprovada como tradução integral nem como adaptação funcional brasileira.

## Evidências

- Gerador: `tools/catalogue-venture-markets-current.cjs`; valida o SHA-256 da fonte imutável e o hash do literal, a ordem e os 12 IDs, restringe os campos a `current.name`/`current.description` e exige 24 destinos.
- Teste: `tests/venture-markets-current-translation.test.cjs`; restaura os 24 textos e compara profundamente a estrutura inteira à fonte, verifica idempotência e rejeita alvo ausente, vazio ou extra e fonte divergente.
- A fonte `source/index.original.html` permaneceu com SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
- Após o ajuste final, `.\check_project.ps1` passou com build de 27 scripts e 212/212 testes; `git diff --check` dos arquivos rastreados não apresentou erro.

## Revisão independente somente leitura

O revisor recebeu os 24 pares fonte/destino e as evidências acima. No primeiro ciclo, atribuiu 8,7/10 e apontou dois problemas objetivos de fidelidade: `dream.name` omitira o segmento *prosumer* e `quant.description` tornava ambígua a negociação com capital próprio. Os destinos foram corrigidos para `Criadores de perfil prosumer` e `Empresas pequenas e médias de trading quantitativo e empresas de negociação com capital próprio`.

No segundo ciclo, o revisor atribuiu 9,5/10 e aprovou o lote, com a ressalva expressa de que o aceite é restrito aos 24 campos e não aprova `VENTURE_MARKETS` inteiro, P1 completo ou qualquer adaptação funcional.
