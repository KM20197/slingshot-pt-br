const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{spawnSync}=require('node:child_process'),acorn=require('acorn'),walk=require('acorn-walk');
const fields=['title','desc','personality','benefits','challenges','ongoing'];
const initialCredit=require('../initial-credit.js');
const approvedLookup=code=>code.replace('function getFunder(funderId) {','function getFunder(funderId) {\n  const brazil = SlingshotInitialCredit.source(funderId, FUNDERS.personalSavings);\n  if (brazil) return brazil;');
const plain=x=>JSON.parse(JSON.stringify(x));
function extract(file){
 const result={};
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  const code=m[2];walk.simple(acorn.parse(code,{ecmaVersion:'latest'}),{
   VariableDeclarator(n){if(n.id.name==='FUNDERS')result.data=plain(vm.runInNewContext('('+code.slice(n.init.start,n.init.end)+')',{}, {timeout:1000}));},
   FunctionDeclaration(n){if(n.id.name==='getFunder')result.getFunder=code.slice(n.start,n.end);},
   MethodDefinition(n){if(n.key.name==='modeFunder')result.modeFunder='function('+n.value.params.map(p=>code.slice(p.start,p.end)).join(',')+')'+code.slice(n.value.body.start,n.value.body.end);}
  });
 }
 return result;
}
const before=extract('source/index.original.html'),after=extract('index.html');
test('all 192 funder prose paths are translated while canonical names, geography, SVGs and economic attributes stay intact',()=>{
 const cat=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8')).FUNDERS.strings;
 const expected=Object.keys(before.data).flatMap(id=>fields.map(field=>JSON.stringify([id,field])));
 assert.equal(Object.keys(before.data).length,32);assert.equal(expected.length,192);
 assert.deepEqual(Object.keys(cat).sort(),expected.sort());
 const restored=plain(after.data);
 for(const [key,{source,target}]of Object.entries(cat)){
  const [id,field]=JSON.parse(key);assert.equal(source,before.data[id][field]);assert.equal(after.data[id][field],target);assert.ok(target.trim());assert.notEqual(source,target);
  // Currency tokens drive modeFunder's rescaling regex; bonuses must retain sign and amount.
  const tokens=s=>s.match(/£\d+(?:\.\d+)?[kMB]|\+\d+|\d+%/g)||[];
  assert.deepEqual(tokens(target),tokens(source),key);
  restored[id][field]=source;
 }
 assert.deepEqual(restored,before.data);
 assert.equal(after.modeFunder,before.modeFunder);assert.equal(after.getFunder,approvedLookup(before.getFunder));
});
test('real lookup and modeFunder preserve all 32 identities, cash scaling and displayed currency tokens in four modes',()=>{
 const make=x=>vm.runInNewContext('('+x.modeFunder+')',{});
 const lookup=x=>vm.runInNewContext(x.getFunder+';getFunder',{FUNDERS:x.data,M2_FUNDERS:{},M3_FUNDERS:{},SlingshotInitialCredit:initialCredit});
 const a=make(before),b=make(after),getA=lookup(before),getB=lookup(after);
 for(const id of Object.keys(before.data))for(const [cheque,pack]of [[1,1],[2,1.5],[1,1.5],[2,1]]){
  const ctx={funderChequeMult:cheque,funderCashMult:pack};
  const old=plain(a.call(ctx,getA(id))),translated=plain(b.call(ctx,getB(id)));
  assert.deepEqual(translated.desc.match(/£\d+(?:\.\d+)?[kMB]/g),old.desc.match(/£\d+(?:\.\d+)?[kMB]/g),id);
  for(const field of fields)delete old[field],delete translated[field];
  assert.deepEqual(translated,old,id);
 }
 assert.equal(getA('unknown'),undefined);assert.equal(getB('unknown'),undefined);
 assert.equal(a.call({},null),null);assert.equal(b.call({},null),null);
 const brazilBaseline=lookup({...before,getFunder:approvedLookup(before.getFunder)});
 for(const id of ['brPublic','brFamily','brNgo','brInformal'])assert.deepEqual(plain(getB(id)),plain(brazilBaseline(id)),id);
});
test('funder generator rejects stale source and missing or empty translations before writing catalogue bytes',()=>{
 const dir=fs.mkdtempSync(path.resolve('artifacts/funder-generator-'));
 for(const folder of ['tools','source','locales'])fs.mkdirSync(path.join(dir,folder),{recursive:true});
 for(const name of ['catalogue-funders.cjs','structured-translation.cjs'])fs.copyFileSync(path.join('tools',name),path.join(dir,'tools',name));
 const original=fs.readFileSync('source/index.original.html','utf8');
 const target=fs.readFileSync('locales/funders-targets.pt-BR.json','utf8');
 const catalogue=fs.readFileSync('locales/structures.pt-BR.json');
 fs.writeFileSync(path.join(dir,'locales/structures.pt-BR.json'),catalogue);
 const run=()=>spawnSync(process.execPath,['tools/catalogue-funders.cjs'],{cwd:dir,encoding:'utf8',timeout:30000});
 fs.writeFileSync(path.join(dir,'source/index.original.html'),original.replace('£350k from your savings account and ISAs.','£351k from your savings account and ISAs.'));
 fs.writeFileSync(path.join(dir,'locales/funders-targets.pt-BR.json'),target);
 const stale=run();assert.notEqual(stale.status,0);assert.match(stale.stderr,/Fonte FUNDERS divergente/);
 assert.deepEqual(fs.readFileSync(path.join(dir,'locales/structures.pt-BR.json')),catalogue);
 fs.writeFileSync(path.join(dir,'source/index.original.html'),original);
 for(const change of [t=>delete t.dragon,t=>t.dragon[0]=' ']){
  const t=JSON.parse(target);change(t);fs.writeFileSync(path.join(dir,'locales/funders-targets.pt-BR.json'),JSON.stringify(t));
  const bad=run();assert.notEqual(bad.status,0);assert.match(bad.stderr,/Cobertura de financiadores divergente|Texto inválido/);
  assert.deepEqual(fs.readFileSync(path.join(dir,'locales/structures.pt-BR.json')),catalogue);
 }
});
