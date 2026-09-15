const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),acorn=require('acorn'),walk=require('acorn-walk');
const required=['initBMC','applyBMCMilestoneUpdates','applyBMCPivot','clearBMCNewTags'];
function read(node){
 if(node.type==='Literal')return node.value;
 if(node.type==='ArrayExpression')return node.elements.map(read);
 if(node.type==='ObjectExpression')return Object.fromEntries(node.properties.map(p=>[p.key.name??p.key.value,read(p.value)]));
 throw new Error('Conteúdo não literal.');
}
function extract(file){
 const result={methods:{}};
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{
   VariableDeclarator(n){if(n.id.name==='BMC_DATA')result.data=read(n.init);},
   MethodDefinition(n){if(required.includes(n.key.name))result.methods[n.key.name]='function('+n.value.params.map(p=>m[2].slice(p.start,p.end)).join(',')+')'+m[2].slice(n.value.body.start,n.value.body.end);}
  });
 }
 return result;
}
const original=extract('source/index.original.html'),brazil=extract('index.html');
const catalogue=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8')).BMC_DATA.strings;
const dictionary=new Map();
for(const {source,target} of Object.values(catalogue)){
 for(const [before,after] of [[source,target],[source.replace(' [NEW]',''),target.replace(' [NEW]','')]]){
  if(dictionary.has(before))assert.equal(dictionary.get(before),after,'Traduções repetidas devem coincidir.');
  dictionary.set(before,after);
 }
}
function expected(value){
 if(typeof value==='string')return dictionary.get(value)??value;
 if(Array.isArray(value))return value.map(expected);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,expected(item)]));
 return value;
}
function setup(source){
 const g={company:{id:'aether'},quarter:1,updateSidebarBMC(){}};
 const context=vm.createContext({BMC_DATA:source.data,console:{log(){},warn(){}}});
 for(const [name,code] of Object.entries(source.methods))g[name]=vm.runInContext('('+code+')',context);
 g.initBMC();return g;
}
test('Aether catalogue covers every source string at its exact path',()=>{
 const leaves={};
 function visit(value,path){
  if(typeof value==='string'){leaves[JSON.stringify(path)]=value;return;}
  if(value&&typeof value==='object')for(const [key,child] of Object.entries(value)){
   visit(child,[...path,Array.isArray(value)||/^\d+$/.test(key)?Number(key):key]);
  }
 }
 visit(original.data.aether,['aether']);
 const entries=Object.fromEntries(Object.entries(catalogue).filter(([path])=>JSON.parse(path)[0]==='aether'));
 assert.deepEqual(Object.keys(entries).sort(),Object.keys(leaves).sort());
 for(const [path,source] of Object.entries(leaves)){
  assert.equal(entries[path].source,source,path);
  assert.equal(typeof entries[path].target,'string',path);
  assert.ok(entries[path].target.trim().length>0,path);
 }
});

test('BMC Aether translation preserves all markers and leaves other profiles and methods untouched',()=>{
 assert.deepEqual(original.methods,brazil.methods);
 for(const id of Object.keys(original.data))if(id!=='aether')assert.deepEqual(original.data[id],brazil.data[id]);
 assert.deepEqual(expected(original.data.aether),brazil.data.aether);
 for(const {source,target} of Object.values(catalogue))assert.equal(source.includes('[NEW]'),target.includes('[NEW]'));
});
test('distinct BMC source selectors retain distinct translations without semantic collisions',()=>{
 const sourcesByTarget=new Map();
 for(const {source,target} of Object.values(catalogue)){
  const plainSource=source.replace(' [NEW]',''),plainTarget=target.replace(' [NEW]','');
  if(sourcesByTarget.has(plainTarget))assert.equal(sourcesByTarget.get(plainTarget),plainSource,'Colisão: '+plainTarget);
  sourcesByTarget.set(plainTarget,plainSource);
 }
});
test('actual BMC methods retain the same removals, additions and snapshots across milestones and pivots',()=>{
 const paths=[['m1','m2','m3'],['wellness'],['decisionSupport'],['m1','wellness','m2','decisionSupport','m3'],['m1','decisionSupport','m2','wellness','m3']];
 for(const path of paths){
  const before=setup(original),after=setup(brazil);
  for(const step of path){
   for(const g of [before,after]){if(step[0]==='m')g.applyBMCMilestoneUpdates(Number(step[1]));else g.applyBMCPivot(step);g.quarter++;}
   assert.deepEqual(JSON.parse(JSON.stringify(after.bmcState)),expected(JSON.parse(JSON.stringify(before.bmcState))),path.join(' / '));
  }
 }
});
