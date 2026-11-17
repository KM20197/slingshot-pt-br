'use strict';
const crypto=require('node:crypto'),acorn=require('acorn'),walk=require('acorn-walk');
const staticPoints={heading:'Team Capacity',help:'How staffing works',staff:'Staff',bonus:'AP Bonus',burn:'Burn/Q'};
const dynamic={
  'Full capacity (+3 AP)':'Capacidade total (+3 AP)',
  'Maximum reached':'Limite máximo atingido',
  'Scaling team (+2 AP)':'Equipe em expansão (+2 AP)',
  'Growing team (+1 AP)':'Equipe em crescimento (+1 AP)',
  '`Founding team (${startingStaff}) +0 AP`':'`Equipe fundadora (${startingStaff}) +0 AP`',
  '`1 hire → +1 AP`':'`1 contratação → +1 AP`',
  '`$\{5 - hiredStaff} more hires → +3 AP`':'`${5 - hiredStaff} ${5 - hiredStaff === 1 ? "contratação" : "contratações"} → +3 AP`',
  '`$\{3 - hiredStaff} more hires → +2 AP`':'`${3 - hiredStaff} ${3 - hiredStaff === 1 ? "contratação" : "contratações"} → +2 AP`',
  '`🚫 Hiring limit reached (2/quarter). More hiring available next quarter.`':'`🚫 Limite de contratações atingido (2/trimestre). Mais contratações disponíveis no próximo trimestre.`',
  '`⚠️ $\{hiresRemaining} hire left. Warning: 2nd hire after last Q\'s heavy hiring = extra strain penalty`':'`⚠️ ${hiresRemaining} contratação restante. Atenção: a 2ª contratação após um trimestre anterior de muitas admissões gera penalidade extra de sobrecarga.`',
  '`📋 Hiring: $\{hiresRemaining}/2 remaining this quarter. Each hire = -1 AP integration.`':'`📋 Contratações: ${hiresRemaining}/2 restantes neste trimestre. Cada contratação = -1 AP de integração.`'
};
const clean=n=>JSON.stringify(n,(k,v)=>['start','end','raw'].includes(k)?undefined:v),sha=n=>crypto.createHash('sha256').update(clean(n)).digest('hex');
function gameUpdate(html){const found=[];for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=|application\/ld\+json/i.test(m[1]))continue;const code=m[2],ast=acorn.parse(code,{ecmaVersion:'latest'});walk.ancestor(ast,{MethodDefinition(n,parents){if(n.key?.name==='update'&&parents.some(p=>p.type==='ClassDeclaration'&&p.id?.name==='Game'))found.push({code,node:n,body:code.slice(n.value.body.start+1,n.value.body.end-1)});}});}if(found.length!==1)throw Error('Game.update ausente ou duplicado');return found[0];}
function once(text,before,after,label){const at=text.indexOf(before);if(at<0||text.indexOf(before,at+before.length)>=0)throw Error('Âncora divergente: '+label);return text.slice(0,at)+after+text.slice(at+before.length);}
function apply(html,catalogue=require('../locales/team-capacity-ui.pt-BR.json')){
 if(!catalogue||Object.keys(catalogue).sort().join('|')!=='classification|strings'||catalogue.classification!=='presentation-only-team-capacity'||Object.keys(catalogue.strings||{}).join('|')!==Object.keys(staticPoints).join('|'))throw Error('Catálogo de capacidade divergente');
 for(const [id,source] of Object.entries(staticPoints)){const item=catalogue.strings[id];if(!item||Object.keys(item).sort().join('|')!=='source|target'||item.source!==source||typeof item.target!=='string'||item.target.trim()!==item.target||item.target===source||/[<>\r\n"]/.test(item.target))throw Error('Texto de capacidade inválido: '+id);}
 let out=html;
 const anchors={
  heading:['<span class="font-bold text-slate-800">Team Capacity</span>','<span class="font-bold text-slate-800">'+catalogue.strings.heading.target+'</span>'],
  help:['<button onclick="event.stopPropagation(); game.showStaffHelpModal()" class="w-5 h-5 rounded-full bg-slate-300 hover:bg-slate-400 text-slate-700 text-xs font-bold flex items-center justify-center" title="How staffing works">?</button>','<button onclick="event.stopPropagation(); game.showStaffHelpModal()" class="w-5 h-5 rounded-full bg-slate-300 hover:bg-slate-400 text-slate-700 text-xs font-bold flex items-center justify-center" title="'+catalogue.strings.help.target+'">?</button>'],
  staff:['<div class="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Staff</div>','<div class="text-[10px] text-slate-500 font-medium uppercase tracking-wide">'+catalogue.strings.staff.target+'</div>'],
  bonus:['<div class="text-[10px] text-indigo-100 font-medium uppercase tracking-wide">AP Bonus</div>','<div class="text-[10px] text-indigo-100 font-medium uppercase tracking-wide">'+catalogue.strings.bonus.target+'</div>'],
  burn:['<div class="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Burn/Q</div>','<div class="text-[10px] text-slate-500 font-medium uppercase tracking-wide">'+catalogue.strings.burn.target+'</div>']
 };
 for(const id of Object.keys(staticPoints))out=once(out,...anchors[id],id);
 out=once(out,'button[title="How staffing works"]','button[title="'+catalogue.strings.help.target+'"]','seletorAjudaEquipe');
 const before=gameUpdate(out),originalHash=sha(acorn.parse('function probe(){'+before.body+'}',{ecmaVersion:'latest'}));let body=before.body;
 for(const [source,target] of Object.entries(dynamic))body=once(body,source,target,source);
 const afterAst=acorn.parse('function probe(){'+body+'}',{ecmaVersion:'latest'});let restored=body;for(const [source,target] of Object.entries(dynamic))restored=once(restored,target,source,target);if(sha(acorn.parse('function probe(){'+restored+'}',{ecmaVersion:'latest'}))!==originalHash||clean(acorn.parse('function probe(){'+restored+'}',{ecmaVersion:'latest'}))!==clean(acorn.parse('function probe(){'+before.body+'}',{ecmaVersion:'latest'})))throw Error('Paridade de capacidade divergente');
 const at=out.indexOf(before.body);if(at<0||out.indexOf(before.body,at+before.body.length)>=0)throw Error('Corpo de atualização ambíguo');out=out.slice(0,at)+body+out.slice(at+before.body.length);
 return {html:out,report:{staticLabels:Object.keys(staticPoints).length,dynamicMessages:Object.keys(dynamic).length,method:'Game.update',rulesUnchanged:true}};
}
module.exports={apply,gameUpdate,staticPoints,dynamic};
