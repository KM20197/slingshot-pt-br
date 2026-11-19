const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const acorn=require('acorn');
const walk=require('acorn-walk');
const parse5=require('parse5');
const crypto=require('node:crypto');

const html=fs.readFileSync('index.html','utf8');
const catalogue=JSON.parse(fs.readFileSync('locales/currency-presentation.pt-BR.json','utf8'));
const POUND='\u00a3';

function method(name){
  const found=[];
  for(const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
    if(/\bsrc\s*=/.test(script[1]))continue;
    const offset=script.index+script[0].indexOf('>')+1;
    walk.ancestor(acorn.parse(script[2],{ecmaVersion:'latest'}),{MethodDefinition(node,parents){
      if(node.key.name===name&&parents.some(p=>p.type==='ClassDeclaration'&&p.id?.name==='Game'))found.push(html.slice(offset+node.value.body.start,offset+node.value.body.end));
    }});
  }
  assert.equal(found.length,1,name);
  return found[0];
}
function functionBody(name){
  const found=[];
  for(const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
    if(/\bsrc\s*=/.test(script[1]))continue;
    const offset=script.index+script[0].indexOf('>')+1;
    walk.simple(acorn.parse(script[2],{ecmaVersion:'latest'}),{FunctionDeclaration(node){
      if(node.id?.name===name&&node.body)found.push(html.slice(offset+node.body.start,offset+node.body.end));
    }});
  }
  assert.equal(found.length,1,name);
  return found[0];
}
const occurrences=(text,part)=>text.split(part).length-1;
const digits=text=>(text.match(/\d/g)||[]).join('');
const inverse=target=>target.replaceAll('${getRegion().currency}','£').replaceAll('R$','£');
const symbols=text=>(text.match(/£/g)||[]).length;

function assertPair(scope,source,target,expected,literalToTemplate=false){
  assert.equal(digits(source),digits(target),scope+' alterou dígitos');
  assert.equal(occurrences(source,'[NEW]'),occurrences(target,'[NEW]'),scope+' alterou [NEW]');
  assert.ok(!/[£€]/.test(target),scope+' manteve moeda residual');
  if(literalToTemplate){
    const quote=source[0];
    assert.ok((quote==='"'||quote==="'")&&source[source.length-1]===quote,scope+' origem não é literal');
    assert.ok(target[0]==='`'&&target[target.length-1]==='`',scope+' destino não é template');
    assert.equal(target.slice(1,-1).replaceAll('${getRegion().currency}','£'),source.slice(1,-1),scope+' alterou algo além do símbolo');
  }else{
    assert.equal(inverse(target),source,scope+' alterou algo além do símbolo');
  }
}

function auditUiCurrency(){
  const domProps=new Set(['textContent','innerHTML','innerText','value','outerHTML']);
  const callSinks=new Set(['log','logJourneyEvent','demoDayFloat']);
  const findings={dom:[],insert:[],calls:[],other:[],attributes:[],text:[]};
  for(const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
    if(/\bsrc\s*=/.test(script[1])||/application\/ld\+json/.test(script[1]))continue;
    let ast;
    try{ast=acorn.parse(script[2],{ecmaVersion:'latest'});}catch(e){continue;}
    const scopes=[{start:0,end:ast.end,body:ast}];
    walk.simple(ast,{
      FunctionDeclaration(n){if(n.body)scopes.push({start:n.start,end:n.end,body:n.body});},
      FunctionExpression(n){if(n.body)scopes.push({start:n.start,end:n.end,body:n.body});},
      ArrowFunctionExpression(n){if(n.body)scopes.push({start:n.start,end:n.end,body:n.body});},
      MethodDefinition(n){if(n.value?.body)scopes.push({start:n.start,end:n.end,body:n.value.body});}
    });
    const scopesAt=pos=>scopes.filter(s=>pos>=s.start&&pos<=s.end).sort((a,b)=>(a.end-a.start)-(b.end-b.start));
    function declares(scope,name){
      let found=false;
      walk.simple(scope.body,{
        VariableDeclarator(n){if(n.id.type==='Identifier'&&n.id.name===name)found=true;},
        FunctionDeclaration(n){if(n.id?.name===name)found=true;}
      });
      return found;
    }
    function bindingScope(node,name){
      for(const scope of scopesAt(node.start))if(declares(scope,name))return scope;
      return null;
    }
    function assignmentsIn(scope,name){
      const list=[];
      walk.simple(scope.body,{
        VariableDeclarator(n){if(n.id.type==='Identifier'&&n.id.name===name&&n.init)list.push({node:n,value:n.init});},
        AssignmentExpression(n){if(n.left.type==='Identifier'&&n.left.name===name)list.push({node:n,value:n.right});}
      });
      return list.sort((a,b)=>a.node.start-b.node.start);
    }
    function literalHits(node,at,seen,depth){
      if(!node||depth>8)return [];
      if(node.type==='Literal')return typeof node.value==='string'?[node.value]:[];
      if(node.type==='TemplateLiteral'){
        let out=[];
        for(const q of node.quasis)if(q.value.cooked)out.push(q.value.cooked);
        for(const e of node.expressions)out=out.concat(literalHits(e,at,seen,depth+1));
        return out;
      }
      if(node.type==='BinaryExpression'&&node.operator==='+')return literalHits(node.left,at,seen,depth+1).concat(literalHits(node.right,at,seen,depth+1));
      if(node.type==='ConditionalExpression')return literalHits(node.consequent,at,seen,depth+1).concat(literalHits(node.alternate,at,seen,depth+1));
      if(node.type==='Identifier'){
        if(seen.has(node.name))return [];
        const scope=bindingScope(node,node.name);
        if(!scope)return [];
        const nextSeen=new Set(seen);
        nextSeen.add(node.name);
        let out=[];
        for(const a of assignmentsIn(scope,node.name)){
          if(a.node.start>=at)continue;
          out=out.concat(literalHits(a.value,a.node.start,nextSeen,depth+1));
        }
        return out;
      }
      return [];
    }
    function record(node,valueNode,bucket){
      if(!valueNode)return;
      for(const s of literalHits(valueNode,node.start,new Set(),0))if(s.includes(POUND))findings[bucket].push(s);
    }
    walk.simple(ast,{
      AssignmentExpression(node){
        const left=node.left;
        if(left.type!=='MemberExpression')return;
        const prop=left.property&&(left.property.name||left.property.value);
        if(node.operator!=='='&&node.operator!=='+=')return;
        if(domProps.has(prop))record(node,node.right,'dom');
        else if(prop==='title'&&left.object.type==='Identifier'&&left.object.name==='document')record(node,node.right,'other');
      },
      CallExpression(node){
        const c=node.callee;
        if(c.type==='MemberExpression'&&c.object.type==='ThisExpression'){
          const name=c.property.name||c.property.value;
          if(callSinks.has(name))node.arguments.forEach(a=>record(node,a,'calls'));
        }
        if(c.type==='MemberExpression'&&(c.property.name==='insertAdjacentHTML'||c.property.name==='insertAdjacentText'))record(node,node.arguments[1],'insert');
        if(c.type==='MemberExpression'&&c.property.name==='setAttribute')node.arguments.forEach(a=>record(node,a,'other'));
        if(c.type==='Identifier'&&(c.name==='alert'||c.name==='confirm'||c.name==='prompt'))node.arguments.forEach(a=>record(node,a,'other'));
      }
    });
  }
  const tree=parse5.parse(html,{sourceCodeLocationInfo:true});
  function visit(node){
    if(node.tagName==='script'||node.tagName==='style')return;
    for(const attr of node.attrs||[])if(attr.value.includes(POUND))findings.attributes.push(attr.value);
    if(node.nodeName==='#text'&&node.value.includes(POUND))findings.text.push(node.value);
    for(const child of node.childNodes||[])visit(child);
  }
  visit(tree);
  return findings;
}

test('C1-bis troca apenas o símbolo monetário nas gravações DOM catalogadas',()=>{
  assert.equal(catalogue.classification,'presentation-only-currency');
  let assignments=0,anchors=0;
  for(const [name,pairs] of Object.entries(catalogue.domWrites)){
    const body=method(name);
    for(const [source,target,expected] of pairs){
      assert.ok(!body.includes(source),name+' ainda contém '+source);
      assert.equal(occurrences(body,target),expected,name+' › '+target);
      assertPair(name,source,target,expected);
      assignments+=expected;
      anchors++;
    }
  }
  assert.equal(anchors,30);
  assert.equal(assignments,31);
});

test('C1-bis cobre as saídas diretas de UI catalogadas',()=>{
  assert.equal(catalogue.uiWritesMeta.classification,'presentation-only-ui-sinks');
  assert.equal(catalogue.uiWritesMeta.version,1);
  let anchors=0,symbolsCount=0;
  for(const [name,pairs] of Object.entries(catalogue.uiWrites)){
    const body=method(name);
    for(const [source,target,expected] of pairs){
      assert.ok(!body.includes(source),name+' ainda contém âncora de UI');
      assert.equal(occurrences(body,target),expected,name+' › âncora de UI');
      assertPair(name,source,target,expected);
      anchors++;
      symbolsCount+=expected*symbols(source);
    }
  }
  assert.equal(catalogue.uiWritesMeta.methods,Object.keys(catalogue.uiWrites).length);
  assert.equal(catalogue.uiWritesMeta.anchors,anchors);
  assert.equal(catalogue.uiWritesMeta.symbols,symbolsCount);
  assert.equal(anchors,74);
  assert.equal(symbolsCount,100);
  assert.equal(catalogue.trailingWhitespace.length,1);
  const hygiene=catalogue.trailingWhitespace[0];
  const hygieneBody=method(hygiene.scope);
  assert.equal(hygiene.target,hygiene.source.trimEnd());
  assert.equal(digits(hygiene.source),digits(hygiene.target));
  assert.ok(!hygieneBody.includes(hygiene.source),'espaço final pré-existente ainda presente');
  assert.equal(occurrences(hygieneBody,hygiene.target),hygiene.expected);
});

test('C1-bis cobre fluxos innerHTML por variável',()=>{
  assert.equal(catalogue.flowWritesMeta.classification,'presentation-only-innerhtml-flow');
  assert.equal(catalogue.flowWritesMeta.version,1);
  let anchors=0,symbolsCount=0;
  for(const [name,pairs] of Object.entries(catalogue.flowWrites)){
    const body=method(name);
    for(const [source,target,expected] of pairs){
      assert.ok(source.startsWith('`')&&source.endsWith('`'),name+' não é template');
      assert.ok(!body.includes(source),name+' ainda contém fluxo de UI');
      assert.equal(occurrences(body,target),expected,name+' › fluxo de UI');
      assertPair(name,source,target,expected);
      anchors++;
      symbolsCount+=expected*symbols(source);
    }
  }
  assert.equal(catalogue.flowWritesMeta.methods,Object.keys(catalogue.flowWrites).length);
  assert.equal(catalogue.flowWritesMeta.anchors,anchors);
  assert.equal(catalogue.flowWritesMeta.symbols,symbolsCount);
  assert.equal(anchors,6);
  assert.equal(symbolsCount,8);
  const journey=method('showJourneyModal');
  assert.ok(journey.includes('content.innerHTML = html'),'showJourneyModal sem gravação esperada');
  assert.ok(journey.includes('getRegion().currency'),'showJourneyModal sem moeda dinâmica');
});

test('C1-bis cobre o helper global e a conversão do literal do unicórnio',()=>{
  assert.equal(catalogue.globalWritesMeta.classification,'presentation-only-global-helper');
  assert.equal(catalogue.globalWritesMeta.anchors,catalogue.globalWrites.length);
  let globalSymbols=0;
  for(const [source,target,expected] of catalogue.globalWrites){
    assert.ok(!html.includes(source),'helper global ainda contém libra');
    assert.equal(occurrences(html,target),expected,'helper global ausente ou duplicado');
    assertPair('globalWrites',source,target,expected);
    globalSymbols+=expected*symbols(source);
  }
  assert.equal(catalogue.globalWritesMeta.symbols,globalSymbols);
  assert.equal(globalSymbols,2);
  assert.ok(functionBody('formatCandidateLocation').includes('getRegion().currency'));

  assert.equal(catalogue.literalConversionsMeta.classification,'presentation-only-literal-to-template');
  assert.equal(catalogue.literalConversionsMeta.anchors,catalogue.literalConversions.length);
  const entry=catalogue.literalConversions[0];
  const body=method(entry.scope);
  assert.ok(!body.includes(entry.source),'literal do unicórnio ainda presente');
  assert.ok(body.includes(entry.target),'template do unicórnio ausente');
  const logLine=body.split('\n').find(line=>line.includes('this.log('));
  assert.ok(logLine&&!logLine.includes(POUND),'log do unicórnio ainda contém libra');
  const commentLines=body.split('\n').filter(line=>line.includes('//')&&line.includes(POUND));
  assert.ok(commentLines.length>=1,'comentário residual de moeda não documentado');
  assertPair(entry.scope,entry.source,entry.target,entry.expected,true);
  assert.equal(entry.target.slice(1,-1).replaceAll('${getRegion().currency}','£'),entry.source.slice(1,-1));
});

test('C1-bis não deixa £ em nenhuma saída de UI, inclusive por cadeia de variáveis',()=>{
  const findings=auditUiCurrency();
  assert.equal(findings.dom.length,0,'atribuição DOM ainda contém £');
  assert.equal(findings.insert.length,0,'insertAdjacentHTML/Text ainda contém £');
  assert.equal(findings.calls.length,0,'log/logJourneyEvent/demoDayFloat ainda contém £');
  assert.equal(findings.other.length,0,'setAttribute/alert/confirm/prompt/document.title ainda contém £');
  assert.equal(findings.attributes.length,0,'atributo HTML ainda contém £');
  assert.equal(findings.text.length,0,'texto estático ainda contém £');
  assert.equal(symbols(method('startDemoDay')),0,'startDemoDay ainda contém £');
  assert.equal(symbols(method('showJourneyModal')),0,'showJourneyModal ainda contém £');
  assert.equal(symbols(method('applyNegotiatedFunding')),0,'applyNegotiatedFunding ainda contém £');
  assert.equal(symbols(functionBody('formatCandidateLocation')),0,'formatCandidateLocation ainda contém £');
});

test('C1-bis preserva REGIONS, o override R$ e o helper de formatação',()=>{
  assert.match(html,/const REGIONS = \{[\s\S]*?currency: "£",[\s\S]*?currencyName: "GBP",[\s\S]*?currencyMultiplier: 1,/);
  assert.match(html,/const R = Object\.freeze\(\{\.\.\.REGIONS\.uk, currency: "R\$", currencyName: "BRL", currencyMultiplier: 1\}\)/);
  assert.match(html,/function getRegion\(\) \{\s*return R;\s*\}/);
  assert.match(html,/function formatValuation\(amountInK, currency = 'R\$'\)/);
  assert.ok(html.includes("'R$' + val + 'k'"));
  assert.ok(!html.includes("'£' + val + 'k'"));
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync('source/index.original.html')).digest('hex'),'a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61');
});
