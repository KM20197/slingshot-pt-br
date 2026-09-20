# Localidades — 20/09/2026

Etapa de tradução das estruturas `LOCATIONS` e `LOCATION_MAP`, seguindo a ordem do original. Foram tratados 276 campos em 36 opções de localização, com 236 alterações efetivas de texto. Nomes próprios preservados explicam as entradas sem alteração. O catálogo acumulado contém 2.546 campos e 2.494 alterações, em 14 estruturas examinadas.

## Preservação funcional

Nomes de cidades e chaves regionais participam de comparações de elegibilidade, bônus locais e parcerias universitárias. Permanecem iguais internamente, assim como identificadores, salários, bônus e SVGs. O mapa técnico continua vazio na declaração e é preenchido pelo mecanismo original.

O módulo `location-display.js` apresenta Londres, Edimburgo e as regiões traduzidas. Cinco substituições pontuais no build aplicam a apresentação aos cartões, detalhes e cabeçalho; nenhuma comparação de regra foi traduzida. Outros relatórios e mensagens ainda podem usar nomes canônicos e texto em inglês.

## Revisão independente

Nota inicial **9,1/10**; nota final **9,3/10**, após **dois ciclos**, respeitando o limite de três.

- Newcastle: removida a qualificação “grande”, acrescentada indevidamente à referência original aos custos de uma cidade.
- Leeds: explicitado “processos de trabalho jurídico”, para não confundir processos de trabalho com ações judiciais.

O avaliador repetiu os três testes específicos, todos aprovados, e confirmou as duas correções. Não identificou pendência adicional no escopo. Não repetiu a suíte completa nem realizou a conferência visual.

## Validação

- `npm run verify`: **94 testes aprovados**, sem falhas ou testes ignorados.
- **19 scripts** verificados com Acorn e `node --check`.
- Cobertura exata dos 276 campos e paridade estrutural com o original.
- Métodos reais de seleção, detalhes e cabeçalho verificados com documento simulado nas 36 opções.
- **7.560 avaliações de fomento** comparadas com o original: 36 opções, dez programas, sete combinações de parceria e três valores determinísticos de aleatoriedade. Elegibilidade e bônus também comparados.
- Reprodução exata do HTML em diretório novo aprovada pela suíte.

A tentativa de conferência pelo navegador local chegou à seleção de fundador com identificação sintética. Falhas de interação e um tempo limite impediram alcançar a tela de localidades. Portanto, a validação visual desta etapa permanece pendente; os testes com documento simulado não equivalem a uma partida completa. A abertura direta por `file://` também continua pendente.

## Limites e continuidade

Os textos descrevem o cenário britânico original; suas alegações não foram verificadas como fatos atuais nem convertidas para o cenário brasileiro nesta etapa. Permanecem pendentes a tradução integral, empreendimentos brasileiros, fomento brasileiro, calibração de valores e remoção das demais rotas societárias. Não houve alteração remota no Supabase.

As próximas estruturas na ordem do original são `FUNDING_STAGES`, `STAT_LABELS` e `FUNDERS`. A aprovação deste lote não constitui liberação da edição para aplicação em turma.
