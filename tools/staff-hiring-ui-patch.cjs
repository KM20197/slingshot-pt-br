'use strict';
// Lote B: rótulos, botões, alertas e moeda das telas acessíveis de contratação.
// Somente apresentação. Fórmulas, IDs, valores, ordem de arrays e seletores permanecem intactos.
const parse5=require('parse5');
const {replaceMethod}=require('./method-patch.cjs');
const catalogue=require('../locales/staff-hiring-ui.pt-BR.json');

const expectedMethods=[
  'update','showFireStaffModal','selectFireStaff','showCandidatesModal','renderCandidateCard',
  'showCandidateDetail','hireCandidate','confirmJobPost','confirmFireStaff','showDecline'
];

function once(text,before,after,label){
  const first=text.indexOf(before);
  if(first<0||text.indexOf(before,first+before.length)>=0)throw Error('Âncora de contratação ausente ou ambígua: '+label);
  return text.slice(0,first)+after+text.slice(first+before.length);
}
const digits=s=>(s
  .replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g,'')
  .replace(/(?:charAt|slice|toFixed)\(\s*\d+\s*\)/g,'')
  .match(/\d/g)||[]).join('');
const count=(s,re)=>s.match(re)?.length||0;
function placeholderIdentifiers(text){
  const parts=[];
  for(let i=0;i<text.length;i++){
    if(text[i]!=='$'||text[i+1]!=='{')continue;
    let depth=1,j=i+2,quote=null;
    for(;j<text.length&&depth>0;j++){
      const c=text[j];
      if(quote){
        if(c==='\\'){j++;continue;}
        if(c===quote)quote=null;
        continue;
      }
      if(c==="'"||c==='"'||c==='`'){quote=c;continue;}
      if(c==='{')depth++;
      else if(c==='}')depth--;
    }
    if(depth!==0)throw Error('Interpolação não fechada na origem');
    parts.push(text.slice(i+2,j-1));
    i=j-1;
  }
  const ids=new Set();
  for(const part of parts){
    const code=part.replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g,'');
    for(const m of code.matchAll(/(^|[^.\w$])([A-Za-z_$][\w$]*)/g))ids.add(m[2]);
  }
  return [...ids];
}
function preserved(text,id){
  const escaped=id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return new RegExp('(^|[^\\w$])'+escaped+'(?![\\w$])').test(text);
}

function validate(method,source,target){
  const label=method+': '+String(source).slice(0,60);
  if(typeof source!=='string'||typeof target!=='string'||!source.trim()||!target.trim())throw Error('Par inválido em '+label);
  if(source===target)throw Error('Par idêntico em '+label);
  if(/[£€]/.test(target))throw Error('Moeda residual em '+label);
  if(digits(source)!==digits(target))throw Error('Número alterado em '+label);
  if(count(source,/\[NEW\]/g)!==count(target,/\[NEW\]/g))throw Error('Marcador NEW alterado em '+label);
  if(count(target,/getRegion\(\)\.currency/g)!==count(source,/£/g))throw Error('Conversão de moeda divergente em '+label);
  const lost=placeholderIdentifiers(source).filter(id=>!preserved(target,id));
  if(lost.length)throw Error('Interpolação perdida em '+label+': '+lost.join(', '));
  if(taskLineBreaks(source)!==taskLineBreaks(target))throw Error('Quebras de linha divergentes em '+label);
}
function taskLineBreaks(s){return count(s,/\n/g);}

function validateStatic(scope,source,target){
  const label=scope+': '+String(source).slice(0,60);
  if(typeof source!=='string'||typeof target!=='string'||!source.trim()||!target.trim())throw Error('Par estático inválido em '+label);
  if(source===target)throw Error('Par estático idêntico em '+label);
  if(/[£€]/.test(target))throw Error('Moeda estática residual em '+label);
  if(digits(source)!==digits(target))throw Error('Número estático alterado em '+label);
  if(count(source,/\[NEW\]/g)!==count(target,/\[NEW\]/g))throw Error('Marcador NEW estático alterado em '+label);
}

function applyStatic(html){
  const changes=[],seen=new Map();
  const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  function visit(node,scope){
    if(['script','style'].includes(node.tagName))return;
    const id=node.attrs?.find(a=>a.name==='id')?.value;
    if(id&&Object.hasOwn(catalogue.static,id))scope=id;
    if(scope&&node.nodeName==='#text'){
      const key=node.value.trim(),target=catalogue.static[scope][key];
      if(target){
        const marker=scope+':'+key;
        seen.set(marker,(seen.get(marker)||0)+1);
        const p=node.sourceCodeLocation;
        changes.push({start:p.startOffset,end:p.endOffset,text:escape(node.value.replace(key,target))});
      }
    }
    for(const child of node.childNodes||[])visit(child,scope);
  }
  visit(parse5.parse(html,{sourceCodeLocationInfo:true}));
  for(const [scope,entries]of Object.entries(catalogue.static))for(const source of Object.keys(entries)){
    if(seen.get(scope+':'+source)!==1)throw Error('Texto estático de contratação ausente/ambíguo: '+scope+':'+source);
  }
  for(const edit of changes.sort((a,b)=>b.start-a.start))html=html.slice(0,edit.start)+edit.text+html.slice(edit.end);
  return html;
}

function apply(html){
  if(!catalogue||Object.keys(catalogue).sort().join('|')!=='classification|methods|static')throw Error('Catálogo de contratação divergente');
  if(catalogue.classification!=='presentation-only-hiring-ui')throw Error('Classificação de contratação divergente');
  if(Object.keys(catalogue.methods).join('|')!==expectedMethods.join('|'))throw Error('Métodos de contratação divergentes');
  if(!catalogue.static||Object.keys(catalogue.static).join('|')!=='jobPostModal')throw Error('Escopos estáticos de contratação divergentes');
  let out=html;
  const report={methods:0,strings:0,staticStrings:0};
  for(const method of expectedMethods){
    const pairs=catalogue.methods[method];
    if(!Array.isArray(pairs)||!pairs.length)throw Error('Lista vazia em '+method);
    for(const pair of pairs){
      if(!Array.isArray(pair)||pair.length!==2)throw Error('Formato de par inválido em '+method);
      validate(method,pair[0],pair[1]);
    }
    out=replaceMethod(out,method,body=>{
      let next=body;
      for(const [source,target] of pairs)next=once(next,source,target,method+' › '+source.slice(0,48));
      let restored=next;
      for(const [source,target] of [...pairs].reverse())restored=once(restored,target,source,method+' ‹ '+target.slice(0,48));
      if(restored!==body)throw Error('Paridade de contratação divergente: '+method);
      return next;
    });
    report.methods+=1;
    report.strings+=pairs.length;
  }
  for(const [scope,entries]of Object.entries(catalogue.static)){
    for(const [source,target]of Object.entries(entries)){
      validateStatic(scope,source,target);
      report.staticStrings+=1;
    }
  }
  out=applyStatic(out);
  return {html:out,report:{...report,rulesUnchanged:true,staticScope:'locales/staff-hiring-ui.pt-BR.json › jobPostModal'}};
}

module.exports={apply,expectedMethods};
