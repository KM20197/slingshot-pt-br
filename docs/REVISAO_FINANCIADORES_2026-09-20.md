# Financiadores do catálogo legado — 20/09/2026

Etapa da estrutura `FUNDERS`, com 32 perfis e 192 textos traduzidos: título, descrição, personalidade, benefícios, desafios e efeitos contínuos. O catálogo acumulado contém 2.753 campos e 2.701 alterações de texto em 17 estruturas examinadas.

## Preservação

Os nomes canônicos permanecem iguais porque são utilizados em comparações internas para reconhecer investidores e suas participações. Isso inclui nomes genéricos, como Personal Savings, e o título militar incorporado a um nome. A apresentação desses nomes fora dos módulos brasileiros continua pendente. Identificadores, etapas, empreendimentos, afinidades geográficas, bônus, valores e os 32 modelos de imagem foram preservados.

O arquivo `locales/funders-targets.pt-BR.json` contém as traduções na ordem title, desc, personality, benefits, challenges, ongoing. `node tools/catalogue-funders.cjs` reconstrói as entradas por caminho, verifica a assinatura SHA-256 da estrutura original e valida a paridade antes de gravar. Uma fonte diferente ou tradução ausente/vazia interrompe a execução sem modificar o catálogo.

## Revisão independente

Foram necessários **dois ciclos**, dentro do limite de três. A avaliação inicial do conteúdo foi **9,0/10**; a avaliação final do conteúdo e integração foi **9,3/10**.

- Preservada a categoria específica de fundos do tipo hedge, anteriormente descrita de forma genérica.
- Especificada a função de prospecção de investimentos da rede de scouts.
- Mantida a unidade monetária britânica “pêni” no texto sobre economias próprias.

O avaliador executou os três testes específicos, todos aprovados, sem encontrar pendência adicional no escopo.

## Evidências e limites

Os testes verificam cobertura exata dos 192 campos, restauração integral dos dados originais e preservação de valores monetários, percentuais e bônus explícitos. Comparam o método real `modeFunder` em **128 combinações** de perfil e modo, incluindo o ajuste dos valores escritos nas descrições. Também comparam as quatro fontes brasileiras com a versão anterior à tradução e verificam a rejeição de fonte alterada e traduções inválidas antes da gravação.

A primeira execução geral teve 95 aprovações e duas falhas no teste novo: ele desconsiderava a adaptação já aprovada de `getFunder`, que consulta `SlingshotInitialCredit` antes dos catálogos legados. O teste foi corrigido para exigir exatamente essa adaptação e executar o módulo real. O jogo não foi modificado para acomodar o teste. O build corrigido verificou **19 scripts** com Acorn e `node --check`, além da paridade estrutural.

Não foi realizado teste visual desta etapa. Os textos descrevem o cenário britânico original; não houve validação factual das biografias. Este lote não conclui a adaptação do financiamento brasileiro nem remove todas as rotas societárias. Não houve alteração remota no Supabase. A edição ainda não está liberada para aplicação em turma.

A execução geral final de `npm test`, após as correções, aprovou **97 testes**, sem falhas, cancelamentos ou testes ignorados, incluindo a reprodução exata do HTML em diretório novo. O resultado foi salvo localmente em `artifacts/funders-test-suite.log` (arquivo de trabalho ignorado pelo Git). A execução imediatamente anterior ficou sem saída final recuperável; não foi contabilizada como aprovação. `git diff --check` também passou.

As próximas estruturas, na ordem do original, são `M2_FUNDERS` e `M3_FUNDERS`.
