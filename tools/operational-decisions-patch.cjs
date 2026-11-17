const {replaceMethod}=require('./method-patch.cjs');
function prepend(body,code){return code+body;}
function apply(html){
 for(const [method,code] of Object.entries({
  randomizeStartingDomain:'    if (SlingshotOperationalDecisions.enabled(this)) { this.currentDomain = "controle"; return; }\n',
  selectQuarterEvents:'    if (SlingshotOperationalDecisions.enabled(this)) return SlingshotOperationalDecisions.select(this);\n',
  renderExecRow:'    if (SlingshotOperationalDecisions.enabled(this)) return SlingshotOperationalDecisions.renderExecRow(this);\n',
  renderDecision:'    if (SlingshotOperationalDecisions.enabled(this)) return SlingshotOperationalDecisions.renderDecision(this);\n',
  confirmChoice:'    if (SlingshotOperationalDecisions.enabled(this)) return SlingshotOperationalDecisions.confirm(this, d, i);\n',
  allChosen:'    const operational = SlingshotOperationalDecisions.allChosen(this); if (operational !== null) return operational;\n',
  checkFunderAdvice:'    if (SlingshotOperationalDecisions.enabled(this)) return;\n',
  processTokenMarket:'    if (SlingshotOperationalDecisions.enabled(this)) return;\n',
  updateValuationFromRevenue:'    if (SlingshotOperationalDecisions.enabled(this)) return;\n',
  updateMarketConditions:'    if (SlingshotOperationalDecisions.enabled(this)) return;\n',
  processUKGrantFunding:'    if (SlingshotOperationalDecisions.enabled(this)) return;\n',
  processExecutionDebt:'    if (SlingshotOperationalDecisions.enabled(this)) return;\n',
  simulateRivals:'    if (SlingshotOperationalDecisions.enabled(this)) return;\n',
  showMarketShiftModal:'    if (SlingshotOperationalDecisions.enabled(this)) return;\n',
  triggerBootstrapNarrativeEvent:'    if (SlingshotOperationalDecisions.enabled(this)) return;\n',
  triggerRandomShock:'    if (SlingshotOperationalDecisions.enabled(this)) return;\n'
 }))html=replaceMethod(html,method,body=>prepend(body,code));
 html=replaceMethod(html,'commitTurn',body=>{
  const start=body.indexOf('    // Apply choices\n');
  const end=body.indexOf('    // === MANCHESTER PRIZE: Check for winner announcement',start);
  if(start<0||end<0)throw new Error('Bloco de aplicação de escolhas L3g ausente.');
  const replacement='    // Decisões operacionais L3g têm efeitos tipados, aplicados somente no próximo trimestre.\n    if (SlingshotOperationalDecisions.enabled(this)) {\n      totalCost += SlingshotOperationalDecisions.apply(this);\n    } else {\n'+body.slice(start,end)+'    }\n\n';
  let result=body.slice(0,start)+replacement+body.slice(end);
  result=result.replace('    if (this.revenueModel && this.completedMilestones.length >= 1) {','    if (!SlingshotOperationalDecisions.enabled(this) && this.revenueModel && this.completedMilestones.length >= 1) {');
  result=result.replace('    if (quarterSurplus >= 25) {','    if (!SlingshotOperationalDecisions.enabled(this) && quarterSurplus >= 25) {');
  result=result.replace('    } else if (quarterSurplus > 0) {','    } else if (!SlingshotOperationalDecisions.enabled(this) && quarterSurplus > 0) {');
  result=result.replace('    if (this.pendingMarketShift.length > 0 && this.milestone) {','    if (!SlingshotOperationalDecisions.enabled(this) && this.pendingMarketShift.length > 0 && this.milestone) {');
  result=result.replace(/    if \(!_msImminent && this\.turn >= 2 && this\.turn <= 14 &&\r?\n        \(forceTokenShock \|\| Math\.random\(\) < 0\.15\) && !this\.pendingShock\) \{/,'    if (!SlingshotOperationalDecisions.enabled(this) && !_msImminent && this.turn >= 2 && this.turn <= 14 &&\n        (forceTokenShock || Math.random() < 0.15) && !this.pendingShock) {');
  return result;
 });
 return html;
}
module.exports={apply};
