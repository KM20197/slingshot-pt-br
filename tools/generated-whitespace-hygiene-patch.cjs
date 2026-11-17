const assert=require('node:assert/strict'),crypto=require('node:crypto'),parse5=require('parse5'),acorn=require('acorn'),walk=require('acorn-walk');
const METHODS=['getCurrentTopicList','renderTopicCard','renderTutorialTopics','openTutorialTopic','closeTutorialTopic','updateTopicCardState','updateTutorialReadCounter','closeTutorialHub','startExperiencedTutorial','skipTutorialFromSelect','closeTutorial','getTutorialTotalSteps','tutorialNext','tutorialBack','renderTutorialStep','getTutorialContent','getBeginnerTutorialContent'];
const SECTION=['tutorialType','tutorialTopicsRead','coreTopics','advancedTopics','topicCards','startTutorial','startGuidedPlay','coachingTips','showCoachingTip','showCoachingTipForce','dismissCoachingTip','checkHRCapacityWarning','checkDomainSkew','updateGuidedPlayProgress','checkGuidedPlayGraduation','graduateFromGuidedPlay','triggerQuarterStartCoaching','backToTutorialType','startBeginnerTutorial','startQuickTutorial','skipTutorial',...METHODS];
const FIELDS=new Set(['tutorialType','tutorialTopicsRead','coreTopics','advancedTopics','topicCards','coachingTips']);
const BEFORE='d555d0636eaead469c5331449911c1494c4efc001fbc6383ff02c67f5b0f9d66',AFTER='666ed500fc1fd19b9f2e0ac0f423073ba5308da7fd5f1909323ae5b9a4938090';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex'),astJSON=n=>JSON.stringify(n,(key,value)=>['start','end','loc','range'].includes(key)?undefined:value);
function dom(n){return{node:n.nodeName,tag:n.tagName,namespace:n.namespaceURI,attrs:n.attrs,text:n.value,children:(n.childNodes||[]).map(dom),content:n.content?dom(n.content):undefined};}
function parse(code){const comments=[],ast=acorn.parse(code,{ecmaVersion:'latest',onComment:(block,text,start,end)=>comments.push({block,text,start,end})}),classes=[],revenues=[],protectedRanges=[...comments];let invalidBinding=false;
 walk.simple(ast,{
  ClassDeclaration(n){if(n.id?.name==='Game')classes.push(n);},
  ClassExpression(n){if(n.id?.name==='Game')invalidBinding=true;},
  FunctionDeclaration(n){if(n.id?.name==='Game')invalidBinding=true;},
  VariableDeclarator(n){if(n.id?.name==='REVENUE_MODELS')revenues.push(n);if(n.id?.name==='Game')invalidBinding=true;},
  Literal(n){protectedRanges.push(n);},TemplateLiteral(n){protectedRanges.push(n);}
 });
 if(invalidBinding||classes.length>1||revenues.length>1)throw Error('Higiene: declaração ambígua ou forma inválida.');
 return{ast,comments,classes,revenues,protectedRanges};
}
function member(n,name){return n?.type==='MethodDefinition'&&!n.computed&&!n.static&&n.kind==='method'&&n.key?.name===name&&!n.value.async&&!n.value.generator;}
function field(n,name){return n?.type==='PropertyDefinition'&&!n.computed&&!n.static&&n.key?.name===name;}
function replace(code,edits){for(const e of [...edits].sort((a,b)=>b.start-a.start))code=code.slice(0,e.start)+code.slice(e.end);return code;}
function tokenRows(code){return [...acorn.tokenizer(code,{ecmaVersion:'latest'})];}
function tokenValues(rows){return rows.map(t=>({type:t.type.label,value:t.value}));}

// Only two AST regions are eligible. Strings/templates/comments are protected.
function normalize(code,p){
 const game=p.classes[0],revenue=p.revenues[0];if(!game||!revenue||revenue.init?.type!=='ObjectExpression')throw Error('Higiene: Game/REVENUE_MODELS ausente ou inválido.');
 const members=game.body.body,first=members.findIndex(n=>field(n,SECTION[0])),last=first+SECTION.length-1;
 if(first<1||!field(members[first-1],'tutorialTopics')||!member(members[last+1],'toggleExtremeMode')||SECTION.some((name,i)=>!(FIELDS.has(name)?field:member)(members[first+i],name)))throw Error('Higiene: âncoras ou ordem da seção divergente.');
 if(SECTION.some(name=>members.filter(n=>n.key?.name===name).length!==1))throw Error('Higiene: membro duplicado.');
 const ranges=[{start:revenue.init.start,end:revenue.init.end},{start:members[first-1].end,end:members[last+1].start}],lexical=[];
 for(const m of code.matchAll(/[ \t]+(?=\r?$)/gm)){const start=m.index,end=start+m[0].length;if(ranges.some(r=>start>=r.start&&end<=r.end)&&!p.protectedRanges.some(r=>r.start<end&&r.end>start))lexical.push({start,end});}
 const method=members[first+SECTION.indexOf('renderTopicCard')],returns=method.value.body.body.filter(n=>n.type==='ReturnStatement');
 if(returns.length!==1||returns[0].argument?.type!=='TemplateLiteral')throw Error('Higiene: retorno renderTopicCard divergente.');
 const template=returns[0].argument,raw=code.slice(template.start+1,template.end-1),hash=sha(raw),needle='id="topic-${topicId}" \n',replacement='id="topic-${topicId}"\n';
 if(hash!==BEFORE&&hash!==AFTER)throw Error('Higiene: template não aprovado.');
 let exception=null,quasi=null,afterRaw=raw;
 if(hash===BEFORE){
  if(raw.split(needle).length!==2)throw Error('Higiene: separador ambíguo.');
  afterRaw=raw.replace(needle,replacement);assert.equal(sha(afterRaw),AFTER);
  const start=template.start+1+raw.indexOf(needle)+needle.length-2;exception={start,end:start+1};
  quasi=template.quasis.find(q=>q.start<=start&&q.end>start);assert(quasi);assert.equal(quasi.value.raw,quasi.value.cooked);assert.equal(quasi.value.raw[start-quasi.start],' ');
 }
 // Raw interpolation expressions remain inert; compare the complete HTML tree.
 assert.deepEqual(dom(parse5.parseFragment(raw)),dom(parse5.parseFragment(afterRaw)),'Higiene: DOM/textos/atributos/handlers divergentes.');
 const plain=replace(code,lexical),plainParsed=lexical.length?parse(plain):p;
 assert.equal(astJSON(p.ast),astJSON(plainParsed.ast),'Higiene: AST lexical divergente.');
 const tokens=tokenRows(code),expectedTokens=tokenValues(tokens);assert.deepEqual(expectedTokens,tokenValues(tokenRows(plain)),'Higiene: tokens lexicais divergentes.');
 const commentValues=comments=>comments.map(c=>[c.block,c.text]);assert.deepEqual(commentValues(p.comments),commentValues(plainParsed.comments));
 if(exception){
  const tokenIndex=tokens.findIndex(t=>t.type.label==='template'&&t.start<=exception.start&&t.end>exception.start);assert(tokenIndex>=0);assert.equal(expectedTokens[tokenIndex].value,quasi.value.cooked);
  const offset=exception.start-quasi.start,newValue=quasi.value.raw.slice(0,offset)+quasi.value.raw.slice(offset+1);
  // This one TemplateElement is the explicit HTML separator exception.
  quasi.value={raw:newValue,cooked:newValue};expectedTokens[tokenIndex].value=newValue;
 }
 const output=replace(code,[...lexical,...(exception?[exception]:[])]),finalParsed=output===code?p:parse(output);
 assert.equal(astJSON(p.ast),astJSON(finalParsed.ast),'Higiene: AST fora da exceção divergente.');assert.deepEqual(expectedTokens,tokenValues(tokenRows(output)),'Higiene: tokens fora da exceção divergentes.');assert.deepEqual(commentValues(p.comments),commentValues(finalParsed.comments));
 return{code:output,report:{lexicalLineEnds:lexical.length,lexicalSpacesRemoved:lexical.reduce((sum,e)=>sum+e.end-e.start,0),templateAttributeSeparators:exception?1:0,approvedDOMUnchanged:true,ASTAndTokensEqualExceptApprovedSeparator:true,scope:'REVENUE_MODELS and tutorial/coaching section (38 members)',templateAfterSHA256:sha(afterRaw)}};
}
function apply(html){
 if(typeof html!=='string')throw Error('Higiene: HTML inválido.');const scripts=[];
 (function visit(n){if(n.tagName==='script'&&!n.attrs.some(a=>a.name==='src')&&!n.attrs.some(a=>a.name==='type'&&a.value==='application/ld+json')){const loc=n.sourceCodeLocation;if(!loc?.endTag)throw Error('Higiene: script sem fechamento.');const start=loc.startTag.endOffset,end=loc.endTag.startOffset,code=html.slice(start,end);scripts.push({start,end,code,parsed:parse(code)});}for(const c of n.childNodes||[])visit(c);})(parse5.parse(html,{sourceCodeLocationInfo:true}));
 const selected=scripts.filter(s=>s.parsed.classes.length||s.parsed.revenues.length);
 if(selected.length!==1||selected[0].parsed.classes.length!==1||selected[0].parsed.revenues.length!==1)throw Error('Higiene: regiões ausentes, duplicadas ou em scripts distintos.');
 const s=selected[0],out=normalize(s.code,s.parsed);return{html:html.slice(0,s.start)+out.code+html.slice(s.end),report:out.report};
}
module.exports={apply};
