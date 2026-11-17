const {replaceMethod}=require('./method-patch.cjs');
function after(body,anchor,addition,method){const i=body.indexOf(anchor);if(i<0||body.indexOf(anchor,i+anchor.length)>=0)throw new Error(`Âncora L3f ausente ou ambígua em ${method}`);return body.slice(0,i+anchor.length)+addition+body.slice(i+anchor.length);}
function staticOnce(html,before,after){if(!html.includes(before)||html.indexOf(before)!==html.lastIndexOf(before))throw new Error(`Âncora de pessoas ausente ou ambígua: ${before}`);return html.replace(before,after);}
function apply(html){
 html=replaceMethod(html,'showHiringModal',body=>'\n    if (typeof SlingshotPeopleContracts !== "undefined" && SlingshotPeopleContracts.enabled(this)) { this.gameStarted ? SlingshotPeopleContracts.showManage(this) : SlingshotPeopleContracts.showSetup(this); return; }'+body);
 html=replaceMethod(html,'showJobPostModal',body=>'\n    if (typeof SlingshotPeopleContracts !== "undefined" && SlingshotPeopleContracts.enabled(this)) { SlingshotPeopleContracts.showManage(this); return; }'+body);
 html=replaceMethod(html,'showFireStaffModal',body=>'\n    if (typeof SlingshotPeopleContracts !== "undefined" && SlingshotPeopleContracts.enabled(this)) { SlingshotPeopleContracts.showManage(this); return; }'+body);
 html=replaceMethod(html,'getStaffAPBonus',body=>'\n    if (typeof SlingshotPeopleContracts !== "undefined" && SlingshotPeopleContracts.enabled(this)) return 0;'+body);
 html=replaceMethod(html,'startGame',body=>{
  const start=body.indexOf('    // Apply exec bonuses, wages (adjusted by location), and equity');
  const end=body.indexOf('    // Log journey event for game start');
  if(start<0||end<0||start>=end)throw new Error('Bloco de gestão L3f ausente em startGame.');
  const legacy=body.slice(start,end);
  const replacement='    // Pessoas e contratos v1 só substituem a equipe SaaS nos negócios operacionais aprovados.\n    if (typeof SlingshotPeopleContracts !== "undefined" && SlingshotPeopleContracts.enabled(this)) {\n      SlingshotManagement.begin(this);\n      SlingshotPeopleContracts.applyStart(this);\n      this.equityGrants = [];\n    } else {\n'+legacy+'    }\n\n';
  return body.slice(0,start)+replacement+body.slice(end);
 });
 html=replaceMethod(html,'saveGame',body=>after(body,'        brOperations: SlingshotOperations.save(this),','\n        brBusiness: this.brBusiness ? JSON.parse(JSON.stringify(this.brBusiness)) : null,','saveGame'));
 html=replaceMethod(html,'loadGame',body=>after(body,'      this.brOperations = s.brOperations ? JSON.parse(JSON.stringify(s.brOperations)) : null;','\n      this.brBusiness = s.brBusiness ? JSON.parse(JSON.stringify(s.brBusiness)) : null;','loadGame'));
 html=staticOnce(html,'>Post Job<','>Gerir pessoas<');
 html=staticOnce(html,'>Layoff Staff<','>Gerir contratos<');
 html=staticOnce(html,'1 AP · Review candidates','Equipe e assessorias');
 html=staticOnce(html,'£40k · −£25k/q burn · −1 AP','Custos e contratos trimestrais');
 return html;
}
module.exports={apply};
