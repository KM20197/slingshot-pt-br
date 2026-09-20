const fs = require('node:fs');
const { translate } = require('./structured-translation.cjs');
const stages = [
  ['bootstrap', 'name', 'Independent', 'Independente'],
  ['bootstrap', 'desc', 'Your savings, friends & family, or crowdfunding. Full control, tight runway.', 'Suas economias, amigos e familiares ou financiamento coletivo. Controle total, pouco tempo até o caixa acabar.'],
  ['angel', 'name', 'Angel Round', 'Rodada de investimento-anjo'],
  ['angel', 'desc', 'Smart money from experienced operators.', 'Capital acompanhado da experiência de gestores experientes.'],
  ['vc', 'name', 'VC Seed', 'Capital semente de fundos de capital de risco'],
  ['vc', 'desc', 'Institutional capital with institutional expectations.', 'Capital institucional com expectativas institucionais.']
];
const stats = [
  ['sci', 'Research', 'Pesquisa'],
  ['dev', 'Product', 'Produto'],
  ['mkt', 'Sales & Marketing', 'Vendas e marketing'],
  ['hr', 'People', 'Pessoas'],
  ['cash', 'Cash', 'Caixa'],
  ['val', 'Valuation', 'Avaliação da empresa'],
  ['burn', 'Burn Rate', 'Consumo de caixa'],
  ['staff', 'Staff', 'Equipe'],
  ['equity', 'Equity', 'Participação societária']
];
const file = 'locales/structures.pt-BR.json';
const catalogue = JSON.parse(fs.readFileSync(file, 'utf8'));
catalogue.FUNDING_STAGES = {
  classification: 'Seis textos do modelo britânico legado traduzidos; identificadores preservados. A seleção inicial brasileira já usa o módulo de crédito. Esta tradução não reintroduz investimento-anjo ou capital de risco nas rotas substituídas, nem conclui a remoção das demais rotas societárias.',
  strings: Object.fromEntries(stages.map(([id, field, source, target]) => [JSON.stringify([id, field]), { source, target }]))
};
catalogue.STAT_LABELS = {
  classification: 'Nove rótulos de apresentação traduzidos; chaves dos indicadores e seus cálculos preservados. Equity significa participação societária neste motor, não patrimônio líquido.',
  strings: Object.fromEntries(stats.map(([id, source, target]) => [JSON.stringify([id]), { source, target }]))
};
// Validate the exact original values and AST parity before writing any catalogue bytes.
translate(fs.readFileSync('source/index.original.html', 'utf8'), {
  FUNDING_STAGES: catalogue.FUNDING_STAGES,
  STAT_LABELS: catalogue.STAT_LABELS
});
fs.writeFileSync(file, JSON.stringify(catalogue, null, 2) + '\n');
console.log('FUNDING_STAGES: 6 textos; STAT_LABELS: 9 rótulos.');
