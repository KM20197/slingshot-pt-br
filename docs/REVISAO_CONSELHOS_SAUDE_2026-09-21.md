# Conselhos dos especialistas em saúde — 21/09/2026

Continuação de `FUNDER_ADVICE`, na ordem da fonte: Priya Sharma (21 campos) e Thomas Eriksson (19 campos). São **40 traduções**, acrescentadas aos 90 campos anteriores. A estrutura agora tem seis perfis traduzidos e 35 perfis com conselhos ainda pendentes; `self` permanece nulo.

## Preservação e arquivos

`locales/advice-healthcare-targets.pt-BR.json` contém os destinos de recomendações, justificativas e reações. `tools/catalogue-advice-healthcare.cjs` valida a assinatura da fonte, a cobertura por perfil e a paridade antes de atualizar o catálogo, conservando traduções anteriores.

NHS, NICE, FDA, EMA e Karolinska, os prazos de 18 meses, nomes dos personagens, pesos dos domínios, escolhas preferidas e penalidades permanecem preservados. Os textos representam o cenário britânico legado, sem adaptação das instituições para o Brasil neste lote.

O catálogo acumulado tem **2.987 campos e 2.935 alterações**, em 22 estruturas registradas: 21 examinadas integralmente e uma parcial. O README e a atualização de continuidade do handoff refletem esses números.

## Verificação

`tests/advice-healthcare-translation.test.cjs` verifica os 40 caminhos, restauração de todos os dados originais, preservação dos demais perfis e das opções técnicas. Compara o método real de escolha de recomendações em **72 cenários**: dois perfis, quatro domínios, três conjuntos de escolhas e três valores determinísticos de aleatoriedade. Também verifica a rejeição de tradução ausente e fonte alterada, sem modificar o catálogo.

## Revisão independente e resultado

A avaliação foi concluída em **um ciclo**, com **9,3/10 inicial e final**, sem correção obrigatória. O avaliador executou os três testes específicos, todos aprovados, e confirmou a preservação dos 90 campos anteriores. A sugestão opcional de explicitar “janela de contratação” não foi aplicada: a versão atual foi considerada adequada. Não houve aumento artificial de nota nem repetição sem necessidade.

`npm run verify` aprovou **106 testes**, sem falhas, cancelamentos ou testes ignorados. O build verificou **19 scripts** com Acorn e `node --check`, além da paridade estrutural. A reprodução do HTML em diretório novo passou. O resultado está salvo localmente em `artifacts/advice-healthcare-verify.log`, ignorado pelo Git. O avaliador não repetiu a suíte completa. `git diff --check` passou.

## Limites da entrega

Não houve teste visual, validação factual de alegações do cenário nem alteração remota no Supabase. As mensagens contextuais fora do catálogo e os demais perfis ainda aguardam tradução. A edição permanece em desenvolvimento, sem liberação para turma. O próximo perfil é `klausMuller`.
