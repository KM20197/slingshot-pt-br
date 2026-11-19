'use strict';
// C1-bis: moeda de apresentação nas telas e modais.
// Somente símbolo monetário visível. Não altera REGIONS, valores, fórmulas,
// IDs, ordem de arrays, seletores, saves, [NEW], créditos ou o painel legal.
const parse5=require('parse5');
const {replaceMethod}=require('./method-patch.cjs');
const catalogue=require('../locales/currency-presentation.pt-BR.json');

function once(text,before,after,label){
  const first=text.indexOf(before);
  if(first<0||text.indexOf(before,first+before.length)>=0)throw Error('Âncora de moeda ausente ou ambígua: '+label);
  return text.slice(0,first)+after+text.slice(first+before.length);
}
const count=(s,re)=>s.match(re)?.length||0;
const digits=s=>(s.match(/\d/g)||[]).join('');
function validatePair(scope,source,target,options={}){
  const label=scope+': '+String(source).slice(0,80);
  if(typeof source!=='string'||typeof target!=='string'||!source.trim()||!target.trim())throw Error('Par de moeda inválido em '+label);
  if(source===target)throw Error('Par de moeda idêntico em '+label);
  if(/[£€]/.test(target))throw Error('Moeda residual em '+label);
  if(options.literalToTemplate){
    const quote=source[0];
    if((quote!=='"'&&quote!=="'")||source[source.length-1]!==quote)throw Error('Literal de origem inválido em '+label);
    if(target[0]!=='`'||target[target.length-1]!=='`')throw Error('Template de destino inválido em '+label);
    const sourceInner=source.slice(1,-1);
    const targetInner=target.slice(1,-1).replaceAll('${getRegion().currency}','£');
    if(targetInner!==sourceInner)throw Error('Alteração além do símbolo monetário em '+label);
  }else{
    const reversed=target.replaceAll('${getRegion().currency}','£').replaceAll('R$','£');
    if(reversed!==source)throw Error('Alteração além do símbolo monetário em '+label);
  }
  if(digits(source)!==digits(target))throw Error('Dígitos alterados em '+label);
  if(count(source,/\[NEW\]/g)!==count(target,/\[NEW\]/g))throw Error('Marcador [NEW] alterado em '+label);
}
function validateTrailingWhitespace(entry){
  if(!entry||typeof entry.scope!=='string'||!entry.scope.trim())throw Error('Higiene de espaço final sem escopo');
  const {scope,source,target,expected}=entry;
  if(typeof source!=='string'||typeof target!=='string'||!source.trim()||!target.trim())throw Error('Higiene de espaço final inválida em '+scope);
  if(source===target)throw Error('Higiene de espaço final idêntica em '+scope);
  if(!source.endsWith(' ')||target!==source.trimEnd())throw Error('Higiene de espaço final altera algo além do espaço final em '+scope);
  if(/[£€]/.test(source)||/[£€]/.test(target))throw Error('Higiene de espaço final com moeda em '+scope);
  if(digits(source)!==digits(target))throw Error('Higiene de espaço final altera dígitos em '+scope);
  if(count(source,/\[NEW\]/g)!==count(target,/\[NEW\]/g))throw Error('Higiene de espaço final altera [NEW] em '+scope);
  if(!Number.isInteger(expected)||expected<1||expected>9)throw Error('Contagem de higiene de espaço final inválida em '+scope);
}
function addPairs(merged,method,pairs,section){
  const list=merged.get(method)||[];
  for(const [source,target,expected] of pairs){
    if(list.some(x=>x[0]===source))throw Error('Âncora de moeda duplicada em '+method+' ('+section+')');
    list.push([source,target,expected,section]);
  }
  merged.set(method,list);
}
function mergedSections(){
  const merged=new Map();
  const sections=[
    ['domWrites',catalogue.domWrites],
    ['uiWrites',catalogue.uiWrites||{}],
    ['flowWrites',catalogue.flowWrites||{}]
  ];
  for(const [name,section] of sections){
    if(!section||typeof section!=='object')throw Error('Seção de moeda ausente: '+name);
    for(const [method,pairs] of Object.entries(section)){
      if(!Array.isArray(pairs)||!pairs.length)throw Error('Lista vazia de moeda em '+name+'.'+method);
      for(const pair of pairs){
        if(!Array.isArray(pair)||pair.length!==3)throw Error('Formato de par de moeda inválido em '+name+'.'+method);
        const [source,target,expected]=pair;
        if(name==='flowWrites'&&(source[0]!=='`'||source[source.length-1]!=='`'))throw Error('Fluxo de moeda sem template em '+method);
        validatePair(name+'.'+method,source,target);
        if(!Number.isInteger(expected)||expected<1||expected>9)throw Error('Contagem de moeda inválida em '+name+'.'+method);
      }
      addPairs(merged,method,pairs,name);
    }
  }
  for(const entry of catalogue.literalConversions||[]){
    if(!entry||typeof entry.scope!=='string'||!entry.scope.trim())throw Error('Conversão de moeda sem escopo');
    const {scope,source,target,expected}=entry;
    validatePair('literalConversions.'+scope,source,target,{literalToTemplate:true});
    if(!Number.isInteger(expected)||expected<1||expected>9)throw Error('Contagem de conversão de moeda inválida em '+scope);
    addPairs(merged,scope,[[source,target,expected]],'literalConversions');
  }
  return merged;
}
function validateMeta(meta,expectedClassification,label){
  if(!meta||meta.classification!==expectedClassification||meta.version!==1)throw Error('Metadados de '+label+' divergentes');
}
function apply(html){
  if(catalogue.classification!=='presentation-only-currency')throw Error('Classificação de moeda divergente');
  if(catalogue.version!==1)throw Error('Versão de moeda divergente');
  if(!catalogue.domWrites||!Object.keys(catalogue.domWrites).length)throw Error('Catálogo de moeda sem gravações DOM');
  if(!Array.isArray(catalogue.helpers)||catalogue.helpers.length!==1)throw Error('Helper de moeda divergente');
  const uiMeta=catalogue.uiWritesMeta;
  validateMeta(uiMeta,'presentation-only-ui-sinks','UI de moeda');

  const flowMeta=catalogue.flowWritesMeta;
  if(flowMeta)validateMeta(flowMeta,'presentation-only-innerhtml-flow','fluxos de moeda');
  const globalMeta=catalogue.globalWritesMeta;
  if(globalMeta)validateMeta(globalMeta,'presentation-only-global-helper','helper global de moeda');
  const literalMeta=catalogue.literalConversionsMeta;
  if(literalMeta)validateMeta(literalMeta,'presentation-only-literal-to-template','conversão de literal de moeda');

  let out=html;
  const report={methods:0,uniqueAnchors:0,assignments:0,domSymbols:0,uiMethods:0,uiAnchors:0,uiAssignments:0,uiSymbols:0,flowMethods:0,flowAnchors:0,flowAssignments:0,flowSymbols:0,globalWrites:0,globalSymbols:0,literalConversions:0,literalSymbols:0,trailingWhitespace:0,staticNodes:0,staticOccurrences:0,helperReplacements:0};

  const [helperSource,helperTarget]=catalogue.helpers[0];
  if(helperTarget.replaceAll("'R$'","'£'")!==helperSource)throw Error('Helper de moeda não é troca de símbolo');
  out=once(out,helperSource,helperTarget,'helper formatValuation');
  report.helperReplacements=1;

  if(flowMeta){
    let anchors=0,symbols=0;
    const methods=Object.keys(catalogue.flowWrites||{});
    for(const pairs of Object.values(catalogue.flowWrites||{}))for(const [source,,expected] of pairs){anchors++;symbols+=expected*count(source,/£/g);}
    if(flowMeta.methods!==methods.length)throw Error('Métodos de fluxo de moeda divergentes');
    if(flowMeta.anchors!==anchors)throw Error(`Âncoras de fluxo divergentes: catálogo ${flowMeta.anchors}, atual ${anchors}`);
    if(flowMeta.symbols!==symbols)throw Error(`Símbolos de fluxo divergentes: catálogo ${flowMeta.symbols}, atual ${symbols}`);
  }
  if(globalMeta){
    const list=catalogue.globalWrites||[];
    if(!Array.isArray(list)||list.length!==globalMeta.anchors)throw Error('Âncoras do helper global divergentes');
    let symbols=0;
    for(const pair of list){
      if(!Array.isArray(pair)||pair.length!==3)throw Error('Formato de helper global inválido');
      validatePair('globalWrites',pair[0],pair[1]);
      symbols+=pair[2]*count(pair[0],/£/g);
    }
    if(globalMeta.symbols!==symbols)throw Error('Símbolos do helper global divergentes');
  }
  if(literalMeta){
    const list=catalogue.literalConversions||[];
    if(!Array.isArray(list)||list.length!==literalMeta.anchors)throw Error('Âncoras de conversão de literal divergentes');
    let symbols=0;
    for(const entry of list)symbols+=entry.expected*count(entry.source,/£/g);
    if(literalMeta.symbols!==symbols)throw Error('Símbolos de conversão de literal divergentes');
  }

  const merged=mergedSections();
  let uiAnchorCount=0,uiSymbolCount=0;
  for(const [method,pairs] of Object.entries(catalogue.uiWrites)){
    uiAnchorCount+=pairs.length;
    for(const [source,,expected] of pairs)uiSymbolCount+=expected*count(source,/£/g);
  }
  if(uiMeta.methods!==Object.keys(catalogue.uiWrites).length)throw Error('Métodos de UI divergentes');
  if(uiMeta.anchors!==uiAnchorCount)throw Error(`Âncoras de UI divergentes: catálogo ${uiMeta.anchors}, atual ${uiAnchorCount}`);
  if(uiMeta.symbols!==uiSymbolCount)throw Error(`Símbolos de UI divergentes: catálogo ${uiMeta.symbols}, atual ${uiSymbolCount}`);

  for(const [method,pairs] of merged){
    out=replaceMethod(out,method,body=>{
      let next=body;
      for(const [source,target,expected,section] of pairs){
        const found=next.split(source).length-1;
        if(found!==expected)throw Error(`Ocorrências de moeda em ${method}: esperado ${expected}, encontrado ${found}`);
        next=next.split(source).join(target);
        const symbols=found*count(source,/£/g);
        if(section==='domWrites'){
          report.assignments+=found;
          report.domSymbols+=symbols;
        }else if(section==='uiWrites'){
          report.uiAssignments+=found;
          report.uiSymbols+=symbols;
        }else if(section==='flowWrites'){
          report.flowAssignments+=found;
          report.flowSymbols+=symbols;
        }else{
          report.literalConversions+=found;
          report.literalSymbols+=symbols;
        }
      }
      return next;
    });
    report.methods++;
    report.uniqueAnchors+=pairs.length;
  }
  for(const [method,pairs] of Object.entries(catalogue.uiWrites)){
    report.uiMethods++;
    report.uiAnchors+=pairs.length;
  }
  report.flowMethods=Object.keys(catalogue.flowWrites||{}).length;
  report.flowAnchors=Object.values(catalogue.flowWrites||{}).reduce((sum,pairs)=>sum+pairs.length,0);

  for(const [source,target,expected] of catalogue.globalWrites||[]){
    const found=out.split(source).length-1;
    if(found!==expected)throw Error(`Ocorrências do helper global: esperado ${expected}, encontrado ${found}`);
    out=once(out,source,target,'globalWrites');
    report.globalWrites+=found;
    report.globalSymbols+=found*count(source,/£/g);
  }

  for(const entry of catalogue.trailingWhitespace||[]){
    validateTrailingWhitespace(entry);
    out=replaceMethod(out,entry.scope,body=>{
      const found=body.split(entry.source).length-1;
      if(found!==entry.expected)throw Error(`Higiene de espaço final em ${entry.scope}: esperado ${entry.expected}, encontrado ${found}`);
      return body.split(entry.source).join(entry.target);
    });
    report.trailingWhitespace+=entry.expected;
  }

  const tree=parse5.parse(out,{sourceCodeLocationInfo:true});
  const nodes=[];
  function visit(node){
    if(node.tagName==='script'||node.tagName==='style')return;
    if(node.nodeName==='#text'&&node.value.includes('£'))nodes.push(node);
    for(const child of node.childNodes||[])visit(child);
  }
  visit(tree);
  const expectedTexts=catalogue.staticText.manifest.map(x=>x.text).sort();
  const actualTexts=nodes.map(x=>x.value).sort();
  if(JSON.stringify(expectedTexts)!==JSON.stringify(actualTexts))throw Error('Texto estático com moeda divergiu do catálogo');
  if(nodes.length!==catalogue.staticText.expectedNodes)throw Error('Contagem de nós estáticos de moeda divergente');
  const edits=[];
  for(const node of nodes){
    const p=node.sourceCodeLocation;
    if(!p)throw Error('Nó estático de moeda sem localização');
    const raw=out.slice(p.startOffset,p.endOffset);
    if(!raw.includes('£'))throw Error('Nó estático de moeda sem símbolo no intervalo');
    edits.push({start:p.startOffset,end:p.endOffset,text:raw.replaceAll('£','R$')});
    report.staticNodes++;
    report.staticOccurrences+=count(raw,/£/g);
  }
  if(report.staticNodes!==catalogue.staticText.expectedNodes)throw Error('Nós estáticos de moeda divergentes');
  if(report.staticOccurrences!==catalogue.staticText.expectedOccurrences)throw Error('Ocorrências estáticas de moeda divergentes');
  for(const edit of edits.sort((a,b)=>b.start-a.start))out=out.slice(0,edit.start)+edit.text+out.slice(edit.end);

  const after=parse5.parse(out,{sourceCodeLocationInfo:true});
  let residual=0;
  function check(node){
    if(node.tagName==='script'||node.tagName==='style')return;
    if(node.nodeName==='#text')residual+=count(node.value,/£/g);
    for(const child of node.childNodes||[])check(child);
  }
  check(after);
  if(residual!==0)throw Error('Moeda estática residual após o patch: '+residual);
  return {html:out,report};
}
module.exports={apply};
