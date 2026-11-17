const acorn=require('acorn');
const walk=require('acorn-walk');
const {replaceMethod}=require('./method-patch.cjs');
const operating=require('../locales/operating-models.pt-BR.json');
const ids=Object.keys(operating.models);
const literal=value=>JSON.stringify(value).replaceAll('<','\\u003c');
function replaceProperties(html,structure,propertyValues){
 const edits=[];
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(match[1])||/application\/ld\+json/.test(match[1]))continue;
  const offset=match.index+match[0].indexOf('>')+1;
  const ast=acorn.parse(match[2],{ecmaVersion:'latest'});
  walk.simple(ast,{VariableDeclarator(node){
   if(node.id.name!==structure||node.init?.type!=='ObjectExpression')return;
   for(const property of node.init.properties){const key=property.key?.name||property.key?.value;if(Object.hasOwn(propertyValues,key))edits.push({start:offset+property.value.start,end:offset+property.value.end,value:literal(propertyValues[key])});}
  }});
 }
 if(edits.length!==ids.length)throw new Error(`Estrutura ${structure} não contém todos os empreendimentos operacionais ativos.`);
 for(const edit of edits.sort((a,b)=>b.start-a.start))html=html.slice(0,edit.start)+edit.value+html.slice(edit.end);
 return html;
}
function before(body,anchor,addition,method){const i=body.indexOf(anchor);if(i<0||body.indexOf(anchor,i+anchor.length)>=0)throw new Error(`Âncora L3b ausente ou ambígua em ${method}`);return body.slice(0,i)+addition+body.slice(i);}
function after(body,anchor,addition,method){const i=body.indexOf(anchor);if(i<0||body.indexOf(anchor,i+anchor.length)>=0)throw new Error(`Âncora L3b ausente ou ambígua em ${method}`);return body.slice(0,i+anchor.length)+addition+body.slice(i+anchor.length);}
function exact(body,before,after,method){const i=body.indexOf(before);if(i<0||body.indexOf(before,i+before.length)>=0)throw new Error(`Âncora L3b ausente ou ambígua em ${method}`);return body.slice(0,i)+after+body.slice(i+before.length);}
function apply(html){
 html=replaceProperties(html,'BMC_DATA',Object.fromEntries(ids.map(id=>[id,operating.models[id].bmc])));
 html=replaceProperties(html,'MILESTONES',Object.fromEntries(ids.map(id=>[id,operating.models[id].milestones])));
 html=replaceMethod(html,'initializeRevenueModel',body=>after(body,'    this.quarterlySupportCosts = 0;','\n    SlingshotOperations.init(this);','initializeRevenueModel'));
 html=replaceMethod(html,'calculateQuarterlyRevenue',body=>before(body,'    const model = this.revenueModel;','    const operating = SlingshotOperations.revenue(this);\n    if (operating) return operating;\n','calculateQuarterlyRevenue'));
 html=replaceMethod(html,'commitTurn',body=>exact(body,'    if (this.revenueModel) {\n      this.processCustomerChurn();\n      this.processPipeline();\n      this.processGrantApplications();\n    }','    if (SlingshotOperations.enabled(this)) {\n      SlingshotOperations.advance(this);\n    } else if (this.revenueModel) {\n      this.processCustomerChurn();\n      this.processPipeline();\n      this.processGrantApplications();\n    }','commitTurn'));
 html=replaceMethod(html,'commitTurn',body=>exact(body,'    if (this.revenueModel && this.customers.length > 0) {','    if (SlingshotOperations.enabled(this) || (this.revenueModel && this.customers.length > 0)) {','commitTurn'));
 html=replaceMethod(html,'processRevenueEffect',body=>before(body,'    if (!effect) return;','    if (SlingshotOperations.enabled(this)) return SlingshotOperations.ignoreLegacyEffect(this, effect);\n','processRevenueEffect'));
 html=replaceMethod(html,'calculateMilestoneProgress',body=>before(body,'    // === IMMEDIATE COMPLETION CHECK ===','    this.milestoneProgress = SlingshotOperations.milestoneProgress(this, this.milestoneProgress);\n\n','calculateMilestoneProgress'));
 html=replaceMethod(html,'completeMilestone',body=>exact(body,'if (this.revenueModel && pipelineBoost.deals > 0) {','if (this.revenueModel && !SlingshotOperations.enabled(this) && pipelineBoost.deals > 0) {','completeMilestone'));
 html=replaceMethod(html,'getPivotMilestones',body=>before(body,"    const archetype = this.company?.archetype || 'general';",'    const operating = SlingshotOperations.pivotMilestones(this, pivotType);\n    if (operating) return operating;\n','getPivotMilestones'));
 html=replaceMethod(html,'applyPivotRevenueImpact',body=>before(body,'    if (!this.revenueModel) return;','    if (SlingshotOperations.enabled(this)) return SlingshotOperations.applyPivot(this, pivot);\n','applyPivotRevenueImpact'));
 html=replaceMethod(html,'saveGame',body=>after(body,'        brManagement: this.brManagement || null,','\n        brOperations: SlingshotOperations.save(this),','saveGame'));
 html=replaceMethod(html,'loadGame',body=>{
  body=after(body,'      this.brManagement = s.brManagement ? JSON.parse(JSON.stringify(s.brManagement)) : null;','\n      this.brOperations = s.brOperations ? JSON.parse(JSON.stringify(s.brOperations)) : null;','loadGame');
  return after(body,'      this.revenueModel = s.revenueModel;','\n      SlingshotOperations.restore(this, s);','loadGame');
 });
 return html;
}
module.exports={apply};
