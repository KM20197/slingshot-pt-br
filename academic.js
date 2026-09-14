/* Slingshot Brasil — fórmula acadêmica aprovada, versão 1.0.0. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SlingshotAcademic = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function number(value, label) {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(label + ': número finito obrigatório.');
    return value;
  }
  const cap = (value) => Math.max(0, Math.min(1, value));
  function calculate(input) {
    if (!input || !Array.isArray(input.milestones) || input.milestones.length !== 3) {
      throw new TypeError('São necessários os progressos dos três marcos.');
    }
    const milestones = Array.from(input.milestones, (p) => cap(number(p, 'Progresso')));
    const quarters = number(input.completedQuarters, 'Trimestres concluídos');
    if (!Number.isInteger(quarters) || quarters < 0 || quarters > 16) throw new RangeError('Trimestres: inteiro entre 0 e 16.');
    const cash = number(input.cash, 'Caixa');
    const operatingCosts = number(input.nextOperatingCosts, 'Despesas');
    const debtPayments = number(input.nextDebtPayments, 'Parcelas');
    const arrears = number(input.arrears, 'Atrasos');
    if (operatingCosts < 0 || debtPayments < 0 || arrears < 0) throw new RangeError('Obrigações não podem ser negativas.');
    if (typeof input.success !== 'boolean') throw new TypeError('Desfecho de sucesso obrigatório.');
    if (input.success && milestones.some(p => p !== 1)) throw new Error('Sucesso exige três marcos concluídos.');
    const development = milestones.reduce((sum, p) => sum + p, 0);
    const continuity = input.success ? 1 : quarters / 16;
    const obligations = operatingCosts + debtPayments;
    number(obligations, 'Total de obrigações');
    const financial = arrears > 0 ? 0 : obligations === 0 ? 1 : cap(cash / obligations);
    return Object.freeze({
      formulaVersion: '1.0.0', maximum: 5,
      grade: Math.round((development + continuity + financial + Number.EPSILON) * 100) / 100,
      components: Object.freeze({development, continuity, financial}),
      inputs: Object.freeze({...input, milestones: Object.freeze(milestones)})
    });
  }
  function fromGame(game, reason) {
    if (!game || !game.metrics) throw new Error('Partida indisponível.');
    if (!Array.isArray(game.completedMilestones)) throw new Error('Histórico de marcos indisponível.');
    const ids=Array.from(game.completedMilestones);
    if (ids.length>3 || ids.some(id=>typeof id!=='string'||!id.trim()) || new Set(ids).size!==ids.length) throw new Error('Histórico de marcos inválido ou duplicado.');
    if (!Number.isInteger(game.brCompletedQuarters)) throw new Error('Contagem de trimestres concluídos indisponível.');
    const completed = ids.length;
    const progress = [0, 0, 0];
    for (let i = 0; i < completed; i++) progress[i] = 1;
    // Avoid counting a completed milestone a second time during its celebration.
    if (completed < 3 && game.milestone && !game.completedMilestones.includes(game.milestone.id)) {
      progress[completed] = cap(number(game.milestoneProgress, 'Progresso atual') / 100);
    }
    const finance = game.brFinanceSummary || {nextPayments: 0, arrears: 0};
    return calculate({
      milestones: progress,
      completedQuarters: game.brCompletedQuarters,
      success: reason === 'allMilestones',
      cash: number(game.metrics.cash, 'Caixa'),
      nextOperatingCosts: Math.max(0, number(game.metrics.burn, 'Despesas do próximo trimestre')),
      nextDebtPayments: finance.nextPayments,
      arrears: finance.arrears
    });
  }
  return Object.freeze({calculate, fromGame});
});
