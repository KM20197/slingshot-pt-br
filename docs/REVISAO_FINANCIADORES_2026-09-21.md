# Financiadores das rodadas posteriores — 21/09/2026

Tradução de `M2_FUNDERS` e `M3_FUNDERS`, seguindo a ordem do original: sete perfis da segunda rodada (55 textos) e seis da terceira (49 textos). O catálogo acumulado contém 2.857 campos e 2.805 alterações de texto em 19 estruturas examinadas.

## Escopo e preservação

Foram traduzidos títulos, descrições, personalidade, benefícios, desafios, efeitos contínuos e os campos aninhados de `resourceBenefits`. Nomes canônicos, identificadores, etapas, valores, bônus, afinidades geográficas, afinidades com empreendimentos, exclusividades e imagens permaneceram iguais.

`node tools/catalogue-later-funders.cjs` usa as traduções de `locales/later-funders-targets.pt-BR.json`. O gerador verifica as assinaturas SHA-256 das duas estruturas, exige cobertura exata dos perfis e campos e valida a paridade antes de gravar o catálogo. Uma divergência na segunda estrutura não permite gravação parcial da primeira.

## Revisão

A primeira avaliação independente foi **9,2/10**. O avaliador recomendou delimitar o sentido de *wrapper apps*: a tradução passou a descrever aplicativos que são apenas uma camada de interface sobre modelos prontos, sem generalizar para toda integração de soluções existentes.

A segunda avaliação encerrou o lote em **9,3/10**, após **dois ciclos**, dentro do limite de três. O avaliador executou os três testes específicos, todos aprovados, sem encontrar pendência adicional no escopo. Não repetiu a suíte completa.

## Validação

Os testes verificam os 104 caminhos exatos, valores monetários, bônus e restauração integral dos demais dados. As funções reais de seleção são comparadas com o original em **481 combinações de empreendimento/localidade para M2** e **13 empreendimentos para M3**, incluindo identificadores desconhecidos. Ordem, elegibilidade, afinidades, exclusividades e demais atributos mecânicos devem coincidir. Os catálogos de opções também são comparados integralmente.

Outro teste remove um benefício aninhado e altera a fonte de M3, verificando em ambos os casos que o gerador rejeita a entrada sem modificar os bytes do catálogo. O build corrigido verificou **19 scripts** com Acorn e `node --check`, além da paridade estrutural.

`npm run verify` concluiu com **100 testes aprovados**, sem falhas, cancelamentos ou testes ignorados, incluindo reprodução exata do HTML em diretório novo. A saída foi salva localmente em `artifacts/later-funders-verify.log`, arquivo de trabalho ignorado pelo Git. `git diff --check` passou.

## Limites e continuidade

Esta etapa traduz o conteúdo britânico legado; não conclui sua substituição pelas modalidades brasileiras. Nomes próprios e textos nas imagens permanecem preservados, e outras mensagens das rotas de financiamento ainda aguardam tradução. Não houve validação factual das alegações dos perfis nem teste visual deste lote. Não houve alteração remota no Supabase.

A edição continua em desenvolvimento, sem liberação para aplicação em turma. As próximas estruturas são `M2_FUNDER_OPTIONS` e `M3_FUNDER_OPTIONS`, compostas por referências técnicas que devem ser classificadas e preservadas.
