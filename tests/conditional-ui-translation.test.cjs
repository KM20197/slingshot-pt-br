const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const acorn=require('acorn'),walk=require('acorn-walk'),vm=require('node:vm'),parse5=require('parse5');
const patch=require('../tools/conditional-ui-translation-patch.cjs');
const original=fs.readFileSync('source/index.original.html','utf8');
function update(html){
 const matches=[];
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=|application\/ld\+json/.test(match[1]))continue;
  walk.ancestor(acorn.parse(match[2],{ecmaVersion:'latest'}),{MethodDefinition(node,parents){
   if(node.key.name==='update'&&parents.some(p=>p.type==='ClassDeclaration'&&p.id?.name==='Game'))matches.push(match[2].slice(node.value.body.start+1,node.value.body.end-1));
  }});
 }
 assert.equal(matches.length,1);return matches[0];
}
const before=update(original),after=update(patch.apply(original));
function tree(body,restore=false){
 const ast=acorn.parse('function probe(){'+body+'}',{ecmaVersion:'latest'});
 if(restore)walk.simple(ast,{TemplateLiteral(node){
  if(node.quasis[0].value.raw==='Pessoas da equipe em adaptação: '){node.quasis[0].value={raw:'',cooked:''};node.quasis[1].value={raw:' staff integrating',cooked:' staff integrating'};}
  if(node.quasis[0].value.raw==='Equipe em reorganização após mudanças')node.quasis[0].value={raw:'Team reorganising after changes',cooked:'Team reorganising after changes'};
 }});
 return JSON.parse(JSON.stringify(ast,(key,value)=>['start','end'].includes(key)?undefined:value));
}
test('conditional UI patch preserves the entire update AST after restoring only presentation values',()=>{
 assert.deepEqual(tree(after,true),tree(before));
 const fixture='<script>class Game{update(){disruptionText.textContent = `${this.integratingStaff} staff integrating`;disruptionText.textContent = `Team reorganising after changes`;}other(){return `Team reorganising after changes`;}}class Other{update(){return `Team reorganising after changes`;}}</script>';
 const result=patch.apply(fixture);assert.ok(result.includes('other(){return `Team reorganising after changes`;}'));assert.ok(result.includes('class Other{update(){return `Team reorganising after changes`;}'));assert.throws(()=>patch.apply(result),/ausentes/);
});
function runIntegration(body,penalty,staff,present=true){
 const code='function probe(){'+body+'}',ast=acorn.parse(code,{ecmaVersion:'latest'});let block;
 walk.simple(ast,{IfStatement(node){if(node.test.type==='Identifier'&&node.test.name==='integrationNotice'){assert.equal(block,undefined);block=code.slice(node.start,node.end);}}});assert.ok(block);
 const classes=new Set(['hidden']),text={textContent:'default'},number={textContent:'default'},notice={classList:{add:value=>classes.add(value),remove:value=>classes.delete(value)}};let reads=0;
 const context={integrationNotice:present?notice:null,document:{getElementById(id){reads++;assert.ok(['disruptionText','disruptionPenalty'].includes(id));return id==='disruptionText'?text:number;}}};
 vm.runInNewContext('(function(){'+block+'})',context).call({staffAPPenalty:penalty,integratingStaff:staff});
 return {text:text.textContent,number:number.textContent,hidden:classes.has('hidden'),reads};
}
test('actual integration branches preserve visibility and penalty while translating dynamic messages',()=>{
 for(const [penalty,staff,present,expected]of [[1,2,true,'Pessoas da equipe em adaptação: 2'],[1,0,true,'Equipe em reorganização após mudanças'],[0,2,true,'default'],[-1,2,true,'default'],[1,2,false,'default']]){
  const old=runIntegration(before,penalty,staff,present),now=runIntegration(after,penalty,staff,present);
  assert.equal(now.text,expected);assert.deepEqual({...now,text:old.text},old);
 }
});
test('conditional patch rejects missing, duplicate, changed interpolation and changed destination',()=>{
 const first='disruptionText.textContent = `${this.integratingStaff} staff integrating`;';
 const second='disruptionText.textContent = `Team reorganising after changes`;';
 const wrap=body=>'<script>class Game{update(){'+body+'}}</script>';
 for(const body of [first,first+first+second,first.replace('this.integratingStaff','this.staffAPPenalty')+second,first.replace('disruptionText','anotherNode')+second,first+second.replace('Team reorganising','Changed message')])assert.throws(()=>patch.apply(wrap(body)),/divergente|ausentes|duplicados/);
});
test('generated conditional UI has five translated DOM targets and unchanged handlers and numeric markup',()=>{
 const html=fs.readFileSync('index.html','utf8'),nodes={};
 function scan(node){const id=node.attrs?.find(a=>a.name==='id')?.value;if(id)nodes[id]=node;for(const child of node.childNodes||[])scan(child);}scan(parse5.parse(html));
 const text=node=>(node.childNodes||[]).map(n=>n.nodeName==='#text'?n.value:text(n)).join('');
 assert.equal(text(nodes.disruptionText),'Impacto na equipe neste trimestre');assert.match(text(nodes.integrationNotice),/\. Capacidade normal no próximo trimestre\./);assert.equal(text(nodes.disruptionPenalty),'1');assert.match(text(nodes.integrationNotice),/AP\)/);
 assert.equal(nodes.tokenDownBtn.attrs.find(a=>a.name==='title').value,'Menos IA — economize caixa, mais trabalho manual');assert.equal(nodes.tokenDownBtn.attrs.find(a=>a.name==='onclick').value,'game.stepTokenSetting(-1)');
 assert.match(text(nodes.conflictWarning),/Seus investidores discordam nesta decisão\./);assert.match(text(nodes.conflictWarning),/Escolha a abordagem em que acredita — os investidores entendem que não é possível agradar a todos quando as recomendações divergem\./);assert.ok(nodes.conflictWarning.attrs.find(a=>a.name==='class').value.split(/\s+/).includes('hidden'));
});
