const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{spawnSync}=require('node:child_process'),acorn=require('acorn'),walk=require('acorn-walk');
const pools=['M2_FUNDERS','M3_FUNDERS'],fields=['title','desc','personality','benefits','challenges','ongoing'];
const funcs=['getAvailableM2Funders','getAvailableM3Funders'];
const plain=x=>JSON.parse(JSON.stringify(x));
function extract(file){
 const data={},functions={};
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  const code=m[2];walk.simple(acorn.parse(code,{ecmaVersion:'latest'}),{
   VariableDeclarator(n){if([...pools,'M2_FUNDER_OPTIONS','M3_FUNDER_OPTIONS','LOCATIONS'].includes(n.id.name))data[n.id.name]=plain(vm.runInNewContext('('+code.slice(n.init.start,n.init.end)+')',{}, {timeout:1000}));},
   FunctionDeclaration(n){if(funcs.includes(n.id.name))functions[n.id.name]=code.slice(n.start,n.end);}
  });
 }
 return {data,functions};
}
const before=extract('source/index.original.html'),after=extract('index.html');
test('later funders cover all 104 prose and resource descriptions without changing identifiers, financial terms or graphics',()=>{
 const cat=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8'));
 for(const pool of pools){
  const expected=[],restored=plain(after.data[pool]);
  for(const[id,value]of Object.entries(before.data[pool])){
   fields.forEach(f=>expected.push(JSON.stringify([id,f])));
   for(const key of Object.keys(value.resourceBenefits||{}))expected.push(JSON.stringify([id,'resourceBenefits',key]));
  }
  assert.equal(expected.length,pool==='M2_FUNDERS'?55:49);
  assert.deepEqual(Object.keys(cat[pool].strings).sort(),expected.sort());
  for(const[key,{source,target}]of Object.entries(cat[pool].strings)){
   const parts=JSON.parse(key);let a=before.data[pool],b=restored;for(const p of parts.slice(0,-1)){a=a[p];b=b[p];}const leaf=parts.at(-1);
   assert.equal(a[leaf],source);assert.equal(b[leaf],target);assert.ok(target.trim());assert.notEqual(source,target);
   const tokens=s=>s.match(/[£€$]\d+(?:\.\d+)?[kMB]?|\+\d+|\d+%/g)||[];
   assert.deepEqual(tokens(target),tokens(source),key);b[leaf]=source;
  }
  assert.deepEqual(restored,before.data[pool]);
 }
 for(const f of funcs)assert.equal(after.functions[f],before.functions[f]);
 for(const k of ['M2_FUNDER_OPTIONS','M3_FUNDER_OPTIONS'])assert.deepEqual(after.data[k],before.data[k]);
});
test('real M2 and M3 selection retains order, eligibility, exclusivity and affinity for every venture and location',()=>{
 const load=x=>vm.runInNewContext(funcs.map(f=>x.functions[f]).join('\n')+';({getAvailableM2Funders,getAvailableM3Funders})',x.data);
 const a=load(before),b=load(after);
 function mechanical(rows){return plain(rows).map(row=>{for(const key of [...fields,'resourceBenefits'])delete row[key];return row;});}
 const ventures=[...Object.keys(before.data.LOCATIONS),'unknown'];
 const locations=[...new Set(Object.values(before.data.LOCATIONS).flat().map(l=>l.id)),'unknown'];
 for(const venture of ventures){
  for(const location of locations)assert.deepEqual(mechanical(b.getAvailableM2Funders(venture,location)),mechanical(a.getAvailableM2Funders(venture,location)),venture+'/'+location);
  assert.deepEqual(mechanical(b.getAvailableM3Funders(venture)),mechanical(a.getAvailableM3Funders(venture)),venture);
 }
 assert.ok(a.getAvailableM2Funders('aether','oxford').some(x=>x.isExclusive));
 assert.ok(a.getAvailableM2Funders('terra','manchester').some(x=>x.hasLocationAffinity));
 assert.ok(a.getAvailableM3Funders('aether').some(x=>x.isExclusive));
});
test('later funder generation rejects missing nested benefits and stale second pool atomically',()=>{
 const dir=fs.mkdtempSync(path.resolve('artifacts/later-funder-generator-'));
 for(const folder of ['tools','source','locales'])fs.mkdirSync(path.join(dir,folder),{recursive:true});
 for(const file of ['catalogue-later-funders.cjs','structured-translation.cjs'])fs.copyFileSync(path.join('tools',file),path.join(dir,'tools',file));
 const original=fs.readFileSync('source/index.original.html','utf8'),catalogue=fs.readFileSync('locales/structures.pt-BR.json');
 const targets=JSON.parse(fs.readFileSync('locales/later-funders-targets.pt-BR.json','utf8'));
 fs.writeFileSync(path.join(dir,'locales/structures.pt-BR.json'),catalogue);
 fs.writeFileSync(path.join(dir,'source/index.original.html'),original);
 const bad=plain(targets);delete bad.M2_FUNDERS.beaumontVC.resourceBenefits.usNetwork;
 fs.writeFileSync(path.join(dir,'locales/later-funders-targets.pt-BR.json'),JSON.stringify(bad));
 const run=()=>spawnSync(process.execPath,['tools/catalogue-later-funders.cjs'],{cwd:dir,encoding:'utf8',timeout:30000});
 const missing=run();assert.notEqual(missing.status,0);assert.match(missing.stderr,/Cobertura de campos divergente/);
 assert.deepEqual(fs.readFileSync(path.join(dir,'locales/structures.pt-BR.json')),catalogue);
 fs.writeFileSync(path.join(dir,'locales/later-funders-targets.pt-BR.json'),JSON.stringify(targets));
 fs.writeFileSync(path.join(dir,'source/index.original.html'),original.replace('The most prestigious name in venture.','The least prestigious name in venture.'));
 const stale=run();assert.notEqual(stale.status,0);assert.match(stale.stderr,/Fonte divergente: M3_FUNDERS/);
 assert.deepEqual(fs.readFileSync(path.join(dir,'locales/structures.pt-BR.json')),catalogue);
});
