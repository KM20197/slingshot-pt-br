const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};}
function environment(){
 const nodes=new Map(),timers=[];
 class Element{
  constructor(){this.value='';this.textContent='';this.disabled=false;this.open=false;this.style={};this.listeners={};this.children=[];}
  set id(id){this._id=id;nodes.set(id,this);}get id(){return this._id;}
  set innerHTML(html){for(const m of html.matchAll(/\bid="([^"]+)"/g)){const el=new Element();el.id=m[1];}}
  append(el){this.children.push(el);}get firstElementChild(){return this.children[0];}
  addEventListener(name,fn){this.listeners[name]=fn;}
  setAttribute(){}remove(){nodes.delete(this.id);}
  showModal(){this.open=true;}
  close(){this.open=false;this.listeners.close?.();}
  reset(){for(const el of nodes.values())el.value='';}
 }
 const document={createElement:()=>new Element(),getElementById:id=>nodes.get(id)||null,body:new Element()};
 const context=vm.createContext({document,window:{},crypto:{randomUUID:()=> 'fixture-id'},SlingshotAcademic:require('../academic'),setTimeout:fn=>timers.push(fn),console});
 return {context,nodes,document,flush:()=>{while(timers.length)timers.shift()();}};
}
const game={metrics:{cash:60,burn:80},completedMilestones:['m1','m2'],milestone:{id:'m3'},milestoneProgress:50,brCompletedQuarters:12,brFinanceSummary:{nextPayments:20,arrears:0},company:{name:'Clínica São João'}};
function exportPage(pending){
 const env=environment();env.context.SlingshotResult={encode:()=>pending.promise};
 vm.runInContext(fs.readFileSync('academic-export.js','utf8'),env.context);
 const api=env.context.window.SlingshotExport;api.capture(game,'bankrupt');env.flush();
 env.nodes.get('br-export-access').firstElementChild.onclick();
 env.nodes.get('br-student').value='matricula-123';env.nodes.get('br-class-key').value='teste';
 return {...env,api,submit:()=>env.nodes.get('br-export-form').listeners.submit({preventDefault(){}})};
}
test('close during signing cannot restore personal data or download controls',async()=>{
 const pending=deferred(),env=exportPage(pending);const operation=env.submit();
 env.nodes.get('br-export-dialog').close();pending.resolve('personal-data');await operation;
 assert.equal(env.nodes.get('br-export-code').value,'');assert.equal(env.nodes.get('br-download').disabled,true);
 assert.equal(env.nodes.get('br-student').value,'');assert.equal(env.nodes.get('br-class-key').value,'');
});
test('new game reset closes dialog and cancels pending export',async()=>{
 const pending=deferred(),env=exportPage(pending);const operation=env.submit();env.api.reset();pending.resolve('old-game');await operation;
 assert.equal(env.nodes.has('br-export-access'),false);assert.equal(env.nodes.get('br-export-dialog').open,false);assert.equal(env.nodes.get('br-export-code').value,'');
});
test('latest export submission wins even when earlier signature resolves last',async()=>{
 const first=deferred(),second=deferred(),env=exportPage(first);const a=env.submit();
 env.context.SlingshotResult.encode=()=>second.promise;env.nodes.get('br-student').value='new-id';const b=env.submit();
 second.resolve('latest');await b;first.resolve('stale');await a;assert.equal(env.nodes.get('br-export-code').value,'latest');
});
test('invalid academic snapshot reports failure without throwing into endGame',()=>{
 const env=environment();vm.runInContext(fs.readFileSync('academic-export.js','utf8'),env.context);
 assert.doesNotThrow(()=>env.context.window.SlingshotExport.capture({},'bankrupt'));env.flush();
 assert.match(env.nodes.get('br-export-access').firstElementChild.textContent,/não foi possível preparar a nota/);
});
test('repeated endGame capture retains original snapshot and nonce until reset',async()=>{
 const pending=deferred(),env=exportPage(pending);let sent;
 env.context.SlingshotResult.encode=data=>{sent=data;return Promise.resolve('code');};
 env.api.capture({...game,metrics:{cash:0,burn:80}},'bankrupt');env.flush();
 // The same instance may already have been reset by the original endGame implementation.
 const same={...game};env.api.reset();env.api.capture(same,'bankrupt');env.flush();same.metrics={cash:0,burn:80};env.api.capture(same,'bankrupt');
 env.nodes.get('br-export-access').firstElementChild.onclick();env.nodes.get('br-student').value='id';env.nodes.get('br-class-key').value='test';
 await env.submit();assert.equal(sent.nota,3.85);assert.equal(sent.nonce,'fixture-id');
});
test('copy completion cannot add stale status after closing export dialog',async()=>{
 const pending=deferred(),env=exportPage(deferred());env.context.navigator={clipboard:{writeText:()=>pending.promise}};
 const operation=env.nodes.get('br-copy').onclick();env.nodes.get('br-export-dialog').close();pending.resolve();await operation;
 assert.equal(env.nodes.get('br-export-status').textContent,'');
});
test('teacher clear during verification cannot restore participant identification',async()=>{
 const env=environment(),pending=deferred();const html=fs.readFileSync('professor.html','utf8');env.document.body.innerHTML=html;
 env.context.SlingshotResult={verify:()=>pending.promise};
 vm.runInContext([...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1],env.context);
 const operation=env.nodes.get('verify-form').onsubmit({preventDefault(){}});env.nodes.get('clear').onclick();
 pending.resolve({data:{identificacao:'private-id'},result:{}});await operation;
 assert.equal(env.nodes.get('result').textContent,'Dados removidos da tela.');
});
