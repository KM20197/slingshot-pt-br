const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{spawnSync}=require('node:child_process'),acorn=require('acorn'),walk=require('acorn-walk');
const ids=['klausMuller','davidAdeyemi','ananyaKrishnamurthy','patriciaHoffman','amitPatel'];
const plain=x=>JSON.parse(JSON.stringify(x));
function extract(file){
 const data={},methods={};
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  const code=m[2];walk.simple(acorn.parse(code,{ecmaVersion:'latest'}),{
   VariableDeclarator(n){if(['FUNDER_ADVICE','M2_FUNDER_OPTIONS','M3_FUNDER_OPTIONS'].includes(n.id.name))data[n.id.name]=plain(vm.runInNewContext('('+code.slice(n.init.start,n.init.end)+')',{}, {timeout:1000}));},
   MethodDefinition(n){if(['pickFunderChoice','generateAllFunderAdvice','generateContextualAdvice'].includes(n.key.name))methods[n.key.name]='function('+n.value.params.map(p=>code.slice(p.start,p.end)).join(',')+')'+code.slice(n.value.body.start,n.value.body.end);}
  });
 }
 return {data,methods};
}
const before=extract('source/index.original.html'),after=extract('index.html');
test('five mobility/enterprise/PLG advice profiles cover exactly 105 paths and preserve weights, effects, other profiles and funding option IDs',()=>{
 const cat=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8')),expected=[];
 for(const id of ids){
  for(const[domain,rows]of Object.entries(before.data.FUNDER_ADVICE[id].advice))rows.forEach((_,i)=>{for(const f of ['text','reason'])expected.push(JSON.stringify([id,'advice',domain,i,f]));});
  for(const f of ['followedReaction','ignoredReaction','hostileWarning'])expected.push(JSON.stringify([id,f]));
 }
 assert.equal(expected.length,105);
 const selected=Object.keys(cat.FUNDER_ADVICE.strings).filter(k=>ids.includes(JSON.parse(k)[0]));assert.deepEqual(selected.sort(),expected.sort());
 const restored=plain(after.data.FUNDER_ADVICE);
 for(const[key,{source,target}]of Object.entries(cat.FUNDER_ADVICE.strings)){
  const parts=JSON.parse(key);let a=before.data.FUNDER_ADVICE,b=restored;for(const p of parts.slice(0,-1)){a=a[p];b=b[p];}const leaf=parts.at(-1);
  assert.equal(source,a[leaf]);assert.equal(target,b[leaf]);assert.ok(target.trim());b[leaf]=source;
 }
 assert.deepEqual(restored,before.data.FUNDER_ADVICE);assert.equal(after.data.FUNDER_ADVICE.self,null);
 for(const name of ['M2_FUNDER_OPTIONS','M3_FUNDER_OPTIONS']){assert.deepEqual(cat[name].strings,{});assert.deepEqual(after.data[name],before.data[name]);}
 assert.deepEqual(after.methods,before.methods);
});
test('actual choice scoring returns the same recommendation for five mobility investors across domains and choices',()=>{
 const sets=[
  [{eff:{mkt:4,dev:-1},cost:30,ap:3},{eff:{sci:3,dev:3},cost:15,ap:2},{eff:{hr:4},cost:0,ap:1}],
  [{eff:{sci:-2,hr:-1},cost:40,ap:4},{eff:{mkt:2,dev:2,hr:1},cost:10,ap:1}],
  [{eff:{},cost:0,ap:0}]
 ];
 for(const random of [0.01,0.5,0.99]){
  const math=Object.create(Math);math.random=()=>random;
  const a=vm.runInNewContext('('+before.methods.pickFunderChoice+')',{Math:math});
  const b=vm.runInNewContext('('+after.methods.pickFunderChoice+')',{Math:math});
  for(const id of ids)for(const domain of ['research','dev','marketing','hr'])for(const choices of sets){
   const ctx={funder:{id}};
   assert.equal(b.call(ctx,after.data.FUNDER_ADVICE[id],choices,domain,id),a.call(ctx,before.data.FUNDER_ADVICE[id],choices,domain,id));
  }
 }
});
test('mobility advice generation rejects missing translations and changed source without modifying catalogue',()=>{
 const dir=fs.mkdtempSync(path.resolve('artifacts/advice-mobility-generator-'));
 for(const folder of ['tools','source','locales'])fs.mkdirSync(path.join(dir,folder),{recursive:true});
 for(const f of ['catalogue-advice-mobility.cjs','structured-translation.cjs'])fs.copyFileSync(path.join('tools',f),path.join(dir,'tools',f));
 const original=fs.readFileSync('source/index.original.html','utf8'),catalogue=fs.readFileSync('locales/structures.pt-BR.json');
 const targets=JSON.parse(fs.readFileSync('locales/advice-mobility-targets.pt-BR.json','utf8'));
 fs.writeFileSync(path.join(dir,'locales/structures.pt-BR.json'),catalogue);
 fs.writeFileSync(path.join(dir,'source/index.original.html'),original);
 const bad=plain(targets);bad.amitPatel.pop();
 fs.writeFileSync(path.join(dir,'locales/advice-mobility-targets.pt-BR.json'),JSON.stringify(bad));
 const run=()=>spawnSync(process.execPath,['tools/catalogue-advice-mobility.cjs'],{cwd:dir,encoding:'utf8',timeout:30000});
 const missing=run();assert.notEqual(missing.status,0);assert.match(missing.stderr,/Cobertura de campos divergente/);
 assert.deepEqual(fs.readFileSync(path.join(dir,'locales/structures.pt-BR.json')),catalogue);
 fs.writeFileSync(path.join(dir,'locales/advice-mobility-targets.pt-BR.json'),JSON.stringify(targets));
 fs.writeFileSync(path.join(dir,'source/index.original.html'),original.replace("OEMs don't respond to marketing.","OEMs don't respond to sales."));
 const stale=run();assert.notEqual(stale.status,0);assert.match(stale.stderr,/Fonte divergente: FUNDER_ADVICE/);
 assert.deepEqual(fs.readFileSync(path.join(dir,'locales/structures.pt-BR.json')),catalogue);
});
