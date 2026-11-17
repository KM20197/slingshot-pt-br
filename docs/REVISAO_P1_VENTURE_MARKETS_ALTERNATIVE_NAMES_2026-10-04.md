# Revisão P1 — nomes das alternativas de `VENTURE_MARKETS` (04/10/2026)

## Escopo e evidências

Foram traduzidos somente os 36 campos `alternatives[i].name` dos doze IDs, preservando os 24 campos `current` já aceitos. IDs, ordem, riscos, oportunidades, efeitos, níveis, descrições e regras não foram modificados. O gerador valida fonte, literal, ordem e IDs; os testes restauram os 60 campos de apresentação e comparam a estrutura inteira à fonte, além de verificar idempotência. Após a correção da preservação entre os dois geradores, `.\check_project.ps1` passou com build de 27 scripts e 214/214 testes. A fonte continua com SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.

## Revisão independente somente leitura

O revisor recebeu os 36 pares fonte/destino. Nota final: **9,2/10**, aprovado sem achados bloqueantes. Refinamentos opcionais indicados: “Esporte de base e saúde de jogadores”, “Apoio ao contencioso” e “Tutoria e mercado consumidor”. O aceite é restrito aos nomes das alternativas; não aprova descrições, efeitos, `VENTURE_MARKETS` inteiro, P1 completo nem adaptação funcional brasileira.
