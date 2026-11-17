const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),parse5=require('parse5'),acorn=require('acorn'),walk=require('acorn-walk'),patch=require('../tools/generated-whitespace-hygiene-patch.cjs');
const original=fs.readFileSync('source/index.original.html','utf8'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function scriptRows(html){const rows=[];(function visit(n){if(n.tagName==='script'&&!n.attrs.some(a=>a.name==='src')&&!n.attrs.some(a=>a.name==='type'&&a.value==='application/ld+json')){const l=n.sourceCodeLocation;rows.push({start:l.startTag.endOffset,end:l.endTag.startOffset,code:html.slice(l.startTag.endOffset,l.endTag.startOffset)});}for(const c of n.childNodes||[])visit(c);})(parse5.parse(html,{sourceCodeLocationInfo:true}));return rows;}
function gameData(html){for(const s of scriptRows(html)){let cls;walk.simple(acorn.parse(s.code,{ecmaVersion:'latest'}),{ClassDeclaration(n){if(n.id?.name==='Game')cls=n;}});if(cls){const method=cls.body.body.find(n=>n.key?.name==='renderTopicCard'),argument=method.value.body.body.find(n=>n.type==='ReturnStatement').argument;return{...s,cls,argument,template:s.code.slice(argument.start+1,argument.end-1)};}}throw Error('fixture Game missing');}
const real=gameData(original),first=real.cls.body.body.findIndex(n=>n.key?.name==='tutorialType'),last=real.cls.body.body.findIndex(n=>n.key?.name==='getBeginnerTutorialContent');
const snippets=real.cls.body.body.slice(first,last+1).map(n=>n.type==='PropertyDefinition'?n.key.name+'={};  \n':n.key.name==='renderTopicCard'?'renderTopicCard(topicId){return `'+real.template+'`;}  \n':n.key.name==='getCurrentTopicList'?'getCurrentTopicList(){const s="keep  ";const t=`  \n    protected  \n`;/* comment\n    \n*/\nreturn s;  \n}  \n':n.key.name+'(){return 1;  \n}  \n').join('');
const code='const OUTSIDE=1;  \nconst REVENUE_MODELS={entry:"keep  ",/* comment\n    \n*/\nvalue:1,  \n};  \nclass Game{prior(){return 2;  \n}  \ntutorialTopics={};  \n'+snippets+'toggleExtremeMode(){return 3;  \n}  \n}  \n';
const frame=body=>'<p title="preserve  ">Before  </p><script>'+body+'</script><script src="external.js"></script><script type="application/ld+json">{"Game":"not JS"}</script><p>After  </p>',fixture=frame(code);
const serialize=s=>parse5.serialize(parse5.parseFragment(s)),AST=s=>JSON.stringify(acorn.parse(s,{ecmaVersion:'latest'}),(key,v)=>['start','end','loc','range'].includes(key)?undefined:v);

test('fonte real preserva tudo fora de um script e muda somente whitespace e o separador HTML aprovado',()=>{
 assert.equal(sha(original),'a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61');const out=patch.apply(original),after=gameData(out.html),beforeRows=scriptRows(original),afterRows=scriptRows(out.html);
 assert.equal(beforeRows.filter((s,i)=>s.code!==afterRows[i].code).length,1);assert.equal(out.html,original.slice(0,real.start)+after.code+original.slice(real.end));
 assert.equal(serialize(real.template),serialize(after.template));assert.equal(after.template,real.template.replace('id="topic-${topicId}" \n','id="topic-${topicId}"\n'));
 // Reinsert the one approved separator: the complete AST must then equal the original.
 const restored=after.code.slice(0,after.argument.start+1)+real.template+after.code.slice(after.argument.end-1);assert.equal(AST(real.code),AST(restored));
 assert(out.report.lexicalLineEnds>0);assert.equal(out.report.templateAttributeSeparators,1);
});

test('regiões sintáticas protegem comentários, strings, outros templates, métodos, scripts e HTML exterior',()=>{
 const out=patch.apply(fixture),next=gameData(out.html).code;
 for(const text of ['const OUTSIDE=1;  \n','prior(){return 2;  \n}','toggleExtremeMode(){return 3;  \n}','"keep  "','`  \n    protected  \n`','/* comment\n    \n*/'])assert(next.includes(text),text);
 assert(!next.includes('value:1,  \n'));assert(!next.includes('return s;  \n'));assert(out.html.startsWith('<p title="preserve  ">Before  </p>'));assert(out.html.endsWith('<p>After  </p>'));assert.equal(serialize(real.template),serialize(gameData(out.html).template));
 const extra='<script>const untouched="value  ";  \n</script>';assert(patch.apply(fixture+extra).html.endsWith(extra));
});

test('rejeita âncoras, ordem, forma, duplicatas e template não aprovado sem execução ou efeito lateral',()=>{
 const variants=[code.replace('REVENUE_MODELS','OTHER'),code.replace('const REVENUE_MODELS={','const REVENUE_MODELS=['),code.replace('class Game','class Other'),code.replace('tutorialTopics={}','wrongTopics={}'),code.replace('tutorialType={}','wrongType={}'),code.replace('toggleExtremeMode()','otherMode()'),code.replace('renderTopicCard(topicId)','async renderTopicCard(topicId)'),code.replace('game.openTutorialTopic','game.startGame'),code.replace('tutorial-topic-card group','changed group'),code.replace('renderTutorialTopics(){','["renderTutorialTopics"](){'),code.replace('class Game{','class Game{getCurrentTopicList(){}')];
 for(const invalid of variants)assert.throws(()=>patch.apply(frame(invalid)));
 for(const extra of ['class Game{}','const Game=class {};','const REVENUE_MODELS={};'])assert.throws(()=>patch.apply(fixture+'<script>'+extra+'</script>'));
 assert.throws(()=>patch.apply(frame(code.replace('tutorialType={};  \n','coreTopics={};  \ntutorialType={};  \n'))));assert.throws(()=>patch.apply(null));
 assert.equal(fixture,frame(code));
});

test('normalização é idempotente e o único quasi alterado preserva atributos, textos e handlers',()=>{
 const first=patch.apply(fixture),second=patch.apply(first.html);assert.equal(second.html,first.html);assert.equal(second.report.lexicalLineEnds,0);assert.equal(second.report.lexicalSpacesRemoved,0);assert.equal(second.report.templateAttributeSeparators,0);
 const before=gameData(fixture),after=gameData(first.html);assert.deepEqual(before.argument.expressions.map(n=>n.type),after.argument.expressions.map(n=>n.type));
 const changed=before.argument.quasis.filter((q,i)=>q.value.raw!==after.argument.quasis[i].value.raw);assert.equal(changed.length,1);assert.equal(changed[0].value.raw.length-after.argument.quasis[before.argument.quasis.indexOf(changed[0])].value.raw.length,1);
 const buttons=[];(function visit(n){if(n.tagName==='button')buttons.push(n);for(const c of n.childNodes||[])visit(c);})(parse5.parseFragment(after.template));assert.equal(buttons.length,1);assert.equal(buttons[0].attrs.find(a=>a.name==='id').value,'topic-${topicId}');assert.equal(buttons[0].attrs.find(a=>a.name==='onclick').value,"game.openTutorialTopic('${topicId}')");assert.equal(serialize(before.template),serialize(after.template));
});
