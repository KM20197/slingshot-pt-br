const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),acorn=require('acorn'),walk=require('acorn-walk');
const dataNames=['FOUNDER_PROFILES','FOUNDER_GRANT_PROFILES','FOUNDER_PORTRAITS'];
const methodNames=['selectFounderProfile','showProfileInfo'];
function read(n){
 if(n.type==='Literal')return n.value;
 if(n.type==='TemplateLiteral'&&!n.expressions.length)return n.quasis[0].value.cooked;
 if(n.type==='UnaryExpression'&&n.operator==='-'&&n.argument.type==='Literal'&&typeof n.argument.value==='number')return -n.argument.value;
 if(n.type==='ArrayExpression')return n.elements.map(read);
 if(n.type==='ObjectExpression')return Object.fromEntries(n.properties.map(p=>[p.key.name??p.key.value,read(p.value)]));
 throw new Error('Dado não literal: '+n.type);
}
function extract(file){
 const out={data:{},methods:{},bonuses:[]};
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  const code=m[2];walk.simple(acorn.parse(code,{ecmaVersion:'latest'}),{
   VariableDeclarator(n){if(dataNames.includes(n.id.name))out.data[n.id.name]=read(n.init);},
   MethodDefinition(n){
    if(methodNames.includes(n.key.name))out.methods[n.key.name]='function('+n.value.params.map(p=>code.slice(p.start,p.end)).join(',')+')'+code.slice(n.value.body.start,n.value.body.end);
    if(n.key.name==='startGame')for(const statement of n.value.body.body){
     if(statement.type==='IfStatement'&&code.slice(statement.test.start,statement.test.end)==='this.founder && this.founder.profile')out.bonuses.push('function(){'+code.slice(statement.start,statement.end)+'}');
    }
   }
  });
 }
 assert.equal(out.bonuses.length,1);return out;
}
const before=extract('source/index.original.html'),after=extract('index.html');
const allCatalogues=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8'));
const catalogue=allCatalogues.FOUNDER_PROFILES.strings;
const preserved=new Set(['id','icon','color','portraitStyle','stats']);
const plain=x=>JSON.parse(JSON.stringify(x));
test('founder catalogue covers every prose field and preserves all identifiers, graphics and numeric attributes',()=>{
 const expectedPaths=[];
 function visit(v,path){if(typeof v==='string'){expectedPaths.push(JSON.stringify(path));return;}for(const [key,value]of Object.entries(v))visit(value,[...path,Array.isArray(v)?Number(key):key]);}
 for(const [id,p]of Object.entries(before.data.FOUNDER_PROFILES))for(const [key,v]of Object.entries(p))if(!preserved.has(key))visit(v,[id,key]);
 assert.equal(expectedPaths.length,216);assert.deepEqual(Object.keys(catalogue).sort(),expectedPaths.sort());
 const restored=plain(after.data.FOUNDER_PROFILES);
 for(const [key,{source,target}]of Object.entries(catalogue)){
  const path=JSON.parse(key);let original=before.data.FOUNDER_PROFILES,value=restored;
  for(const part of path.slice(0,-1)){original=original[part];value=value[part];}
  const leaf=path.at(-1);assert.equal(source,original[leaf],key);assert.equal(value[leaf],target,key);assert.ok(target.trim());value[leaf]=source;
 }
 assert.deepEqual(restored,before.data.FOUNDER_PROFILES);
 assert.deepEqual(after.data.FOUNDER_PORTRAITS,before.data.FOUNDER_PORTRAITS);
 assert.deepEqual(after.methods,before.methods);assert.deepEqual(after.bonuses,before.bonuses);
});
test('grant profile descriptions are fully translated while all eligibility bonuses and penalties remain unchanged',()=>{
 const entries=allCatalogues.FOUNDER_GRANT_PROFILES.strings,restored=plain(after.data.FOUNDER_GRANT_PROFILES);
 const expected=Object.keys(before.data.FOUNDER_GRANT_PROFILES).map(id=>JSON.stringify([id,'description']));
 assert.equal(expected.length,12);assert.deepEqual(Object.keys(entries).sort(),expected.sort());
 for(const id of Object.keys(restored)){
  const item=entries[JSON.stringify([id,'description'])];assert.equal(item.source,before.data.FOUNDER_GRANT_PROFILES[id].description);
  assert.equal(restored[id].description,item.target);assert.ok(item.target.trim());restored[id].description=item.source;
 }
 assert.deepEqual(restored,before.data.FOUNDER_GRANT_PROFILES);
 assert.deepEqual(allCatalogues.FOUNDER_PORTRAITS.strings,{});
});
test('founder generator refuses a changed English source before modifying the existing catalogue',()=>{
 const path=require('node:path'),{spawnSync}=require('node:child_process');
 fs.mkdirSync('artifacts',{recursive:true});const dir=fs.mkdtempSync(path.resolve('artifacts/founder-source-'));
 fs.mkdirSync(path.join(dir,'source'));fs.mkdirSync(path.join(dir,'locales'));
 const text=fs.readFileSync('source/index.original.html','utf8');assert.ok(text.includes('The Academic'));
 fs.writeFileSync(path.join(dir,'source/index.original.html'),text.replace('The Academic','The Researcher'));
 const file=path.join(dir,'locales/structures.pt-BR.json'),catalogueBytes=fs.readFileSync('locales/structures.pt-BR.json');fs.writeFileSync(file,catalogueBytes);
 const result=spawnSync(process.execPath,[path.resolve('tools/catalogue-founder-profiles.cjs')],{cwd:dir,encoding:'utf8'});
 assert.notEqual(result.status,0);assert.match(result.stderr,/Fonte dos perfis diverge/);assert.deepEqual(fs.readFileSync(file),catalogueBytes);
});
function setup(source){
 const nodes=new Map(),events={sound:0,venture:0};
 const get=id=>{
  if(!nodes.has(id)){
   const classes=new Set(['flex']);
   nodes.set(id,{
    value:id==='founderNameInput'?'  Personagem de teste  ':'',innerHTML:'',textContent:'',focus(){},
    classList:{add(...v){v.forEach(x=>classes.add(x));},remove(...v){v.forEach(x=>classes.delete(x));},contains(v){return classes.has(v);}}
   });
  }
  return nodes.get(id);
 };
 const context=vm.createContext({...source.data,document:{getElementById:get},soundManager:{playFounderSelect(){events.sound++;}},console:{error(){}},setTimeout(){}});
 const g={showVentureModal(){events.venture++;},log(){},metrics:{sci:20,mkt:15,burn:20,hr:4},moods:{research:1,dev:2.7,marketing:0,hr:3},ukGrantExperience:0};
 for(const [name,code]of Object.entries(source.methods))g[name]=vm.runInContext('('+code+')',context);
 g.applyFounderBlock=vm.runInContext('('+source.bonuses[0]+')',context);
 return {g,get,events};
}
test('actual founder selection and information dialog retain routing, portrait and profile identity for all 12 profiles',()=>{
 for(const id of Object.keys(before.data.FOUNDER_PROFILES))for(const source of [before,after]){
  const {g,get,events}=setup(source),profile=source.data.FOUNDER_PROFILES[id];
  g.selectFounderProfile(id);
  assert.equal(g.founder.name,'Personagem de teste');assert.equal(g.founder.profile.id,id);assert.equal(g.selectedProfile,profile);
  assert.equal(g.selectedAppearance,profile.portraitStyle);assert.equal(g.founder.portrait,source.data.FOUNDER_PORTRAITS[profile.portraitStyle]);
  assert.deepEqual(events,{sound:1,venture:1});assert.ok(get('founderModal').classList.contains('hidden'));assert.ok(!get('founderModal').classList.contains('flex'));
  g.showProfileInfo(id);assert.equal(g.viewingProfileId,id);assert.equal(get('profileInfoName').textContent,profile.icon+' '+profile.name);
  assert.equal(get('profileInfoDesc').textContent,profile.desc);assert.equal(get('profileInfoAvatar').innerHTML,g.founder.portrait);
  assert.equal(get('profileInfoGrants').textContent,profile.grantAdvantage);assert.equal(get('profileInfoFundraising').textContent,profile.fundraisingStyle);
  for(const tip of profile.gameplayTips)assert.ok(get('profileInfoTips').innerHTML.includes(tip));
 }
 for(const source of [before,after])for(const [id,name]of [['invalid','Teste'],['academic','   ']]){
  const {g,get,events}=setup(source);get('founderNameInput').value=name;g.selectFounderProfile(id);assert.equal(g.founder,undefined);assert.deepEqual(events,{sound:0,venture:0});
 }
});
test('original founder bonus block produces identical science, sales, costs, moods and grant experience after translation',()=>{
 for(const id of Object.keys(before.data.FOUNDER_PROFILES))for(const burn of [5,10,20,100]){
  const states=[];
  for(const source of [before,after]){
   const {g}=setup(source);g.metrics.burn=burn;g.selectFounderProfile(id);g.applyFounderBlock();
   states.push(plain({metrics:g.metrics,moods:g.moods,bonuses:g.founderBonuses,grantExperience:g.ukGrantExperience,profileId:g.founderProfile.id}));
  }
  assert.deepEqual(states[1],states[0],id+' burn='+burn);
 }
});
