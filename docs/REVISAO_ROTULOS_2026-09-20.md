# Etapas de financiamento e indicadores — 20/09/2026

Tradução, na ordem do original, de `FUNDING_STAGES` (seis textos) e `STAT_LABELS` (nove rótulos). O catálogo acumulado contém 2.561 campos e 2.509 alterações de texto em 16 estruturas examinadas.

## Escopo

O gerador `tools/catalogue-funding-labels.cjs` declara cada caminho, fonte e tradução. Antes de gravar, valida a fonte e a paridade estrutural usando o tradutor existente. Identificadores das etapas e chaves dos indicadores continuam iguais. Não houve mudança nos cálculos, valores ou métodos.

As descrições de investidores-anjo e fundos de capital de risco traduzem o modelo britânico legado. A seleção inicial brasileira permanece substituída por `SlingshotInitialCredit`; este lote não reativa ofertas de participação societária. As demais rotas societárias ainda precisam da adaptação autorizada. `equity` é apresentado como participação societária, conforme o sentido utilizado pelo motor.

## Revisão e validação

Revisão independente em **dois ciclos**, dentro do limite de três: **9,1/10 inicial → 9,3/10 final**. A expressão “pouca autonomia financeira” foi substituída por “pouco tempo até o caixa acabar”, preservando o sentido temporal de *tight runway* e evitando confusão com dependência de terceiros.

O avaliador confirmou os 15 campos exatos, a preservação dos demais dados e a correspondência do HTML final com o catálogo corrigido. Não identificou pendência adicional neste escopo.

`npm run verify` aprovou **94 testes**, incluindo reprodução do HTML em pasta nova, antes da última correção de redação. Após a correção, o build foi repetido com sucesso: **19 scripts** verificados por Acorn e `node --check`, com paridade estrutural. A suíte completa não foi repetida após essa alteração exclusivamente textual. `git diff --check` passou. Não foi realizado teste visual deste lote.

## Próxima estrutura

A inspeção de `FUNDERS` encontrou 32 perfis, 449 valores literais de texto e 32 modelos de imagem. A contagem inclui identificadores, chaves de etapa, afinidades geográficas e referências a empreendimentos; não corresponde a 449 frases para tradução. A estrutura ainda não foi traduzida neste lote. É necessário distinguir a prosa das chaves usadas pelas regras e da futura adaptação financeira brasileira.

Não houve mudança remota no Supabase. A versão permanece em desenvolvimento: tradução integral, empreendimentos brasileiros, fomento, calibração, eliminação das demais rotas societárias e validação completa online/offline continuam pendentes. Esta aprovação não libera o jogo para aplicação em turma.
