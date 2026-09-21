# Conselhos iniciais e opções técnicas — 21/09/2026

`M2_FUNDER_OPTIONS` e `M3_FUNDER_OPTIONS` contêm referências internas, sem prosa a traduzir. Foram classificadas e preservadas integralmente. A estrutura seguinte, `FUNDER_ADVICE`, foi iniciada pelos quatro primeiros perfis com conselhos: dragon, techAngel, operatorAngel e academicAngel.

## Cobertura e preservação

São **90 campos** de recomendações, justificativas e reações. `self` permanece nulo. Nomes, preferências de domínio e suas repetições usadas como peso, escolhas preferidas e efeitos hostis permanecem iguais. Os demais perfis ainda não foram traduzidos neste lote.

O catálogo acumulado contém **2.947 campos e 2.895 alterações** em 22 estruturas registradas: 21 examinadas integralmente e uma parcial. Das 71 estruturas do inventário, 49 ainda não têm entrada no catálogo, além da parte pendente de `FUNDER_ADVICE`. Essa contagem não cobre mensagens fora das estruturas.

`tools/catalogue-advice-initial.cjs` verifica hashes das três estruturas e gera caminhos explícitos a partir de `locales/advice-initial-targets.pt-BR.json`. Preserva traduções já catalogadas de outros perfis e valida o catálogo completo de conselhos antes de gravar. Não altera a fonte original.

## Revisão independente

Primeira nota: **9,2/10**. Foram corrigidos “Ciência é bom” para “Ciência é boa” e uma fala suavizada sobre retratação de artigo, que voltou a preservar o tom categórico do personagem original.

A segunda revisão foi inicialmente interrompida por limite de uso e retomada sem iniciar outro ciclo. O avaliador confirmou as correções, executou os **três testes específicos**, todos aprovados, e encerrou em **9,3/10**, sem pendências neste escopo. Foram dois ciclos, abaixo do limite de três. O avaliador não repetiu a suíte completa nem realizou verificação visual.

## Validação e limites

Os testes cobrem os 90 caminhos, restauram a estrutura inteira para comparação e verificam as opções técnicas, pesos, penalidades e código dos métodos reais. O método `pickFunderChoice` é comparado em **144 cenários**: quatro perfis, quatro domínios, três conjuntos de escolhas e três valores determinísticos de aleatoriedade. A rejeição de fonte modificada e de tradução ausente é verificada antes de qualquer gravação.

O build corrigido validou **19 scripts** com Acorn e `node --check`, além da paridade estrutural. Não houve teste visual neste lote. Outras mensagens de aconselhamento, inclusive textos contextuais dentro dos métodos, ainda aguardam tradução.

`npm run verify` aprovou **103 testes**, sem falhas, cancelamentos ou testes ignorados, incluindo a reprodução do HTML em diretório novo. A saída está no arquivo local de trabalho `artifacts/advice-initial-verify.log`, ignorado pelo Git. `git diff --check` passou.

Conteúdo britânico legado, sem adaptação financeira nesta etapa. Nenhuma mudança remota no Supabase. A edição completa não está liberada para turma. A próxima parte de `FUNDER_ADVICE` começa em `priyaSharma`.

A estrutura contém 42 entradas: `self` nulo, quatro perfis traduzidos e **37 perfis com conselhos ainda pendentes**.
