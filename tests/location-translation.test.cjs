const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),acorn=require('acorn'),walk=require('acorn-walk');
const display=require('../location-display.js');
const ruleMethods=['isGrantProgrammeAvailable','getLocalFundingBonus','getUKGrantProgrammes','getUKGrantQuestions','generateUKGrantAssessment','estimateUKGrantSuccessProbability'];
const uiMethods=['showLocationModal','showLocationInfo','selectLocation'];
const functions=['getLocations','getRegionForCity','getLocationTier'];
function read(n){
 if(n.type==='Literal')return n.value;
 if(n.type==='TemplateLiteral'&&!n.expressions.length)return n.quasis[0].value.cooked;
 if(n.type==='UnaryExpression'&&n.operator==='-'&&n.argument.type==='Literal'&&typeof n.argument.value==='number')return -n.argument.value;
 if(n.type==='ArrayExpression')return n.elements.map(read);
 if(n.type==='ObjectExpression')return Object.fromEntries(n.properties.map(p=>[p.key.name??p.key.value,read(p.value)]));
 throw new Error('Dado não literal: '+n.type);
}
function extract(file){
 const out={data:{},methods:{},functions:{},header:[]};
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
  const code=m[2];walk.simple(acorn.parse(code,{ecmaVersion:'latest'}),{
   VariableDeclarator(n){if(['LOCATIONS','LOCATION_MAP','GEOGRAPHY_REGIONS','FOUNDER_GRANT_PROFILES'].includes(n.id.name))out.data[n.id.name]=read(n.init);},
   FunctionDeclaration(n){if(functions.includes(n.id.name))out.functions[n.id.name]=code.slice(n.start,n.end);},
   MethodDefinition(n){
    if([...ruleMethods,...uiMethods].includes(n.key.name))out.methods[n.key.name]='function('+n.value.params.map(p=>code.slice(p.start,p.end)).join(',')+')'+code.slice(n.value.body.start,n.value.body.end);
    if(n.key.name==='update')for(const statement of n.value.body.body)if(statement.type==='IfStatement'&&code.slice(statement.start,statement.end).includes('getElementById("locationDisplay")'))out.header.push('function(){'+code.slice(statement.start,statement.end)+'}');
   }
  });
 }
 assert.equal(out.header.length,1);return out;
}
const before=extract('source/index.original.html'),after=extract('index.html');
const catalogue=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8')).LOCATIONS.strings;
const plain=x=>JSON.parse(JSON.stringify(x));
test('location catalogue covers 276 display fields and preserves all canonical names, regions, salaries, bonuses and SVGs',()=>{
 const paths=[],restored=plain(after.data.LOCATIONS);
 function visit(value,path){if(typeof value==='string'){paths.push(JSON.stringify(path));return;}value.forEach((x,i)=>visit(x,[...path,i]));}
 for(const [id,locations]of Object.entries(before.data.LOCATIONS))locations.forEach((loc,i)=>{
  for(const field of ['name','tagline','description','pros','cons'])visit(loc[field],[id,i,field]);
  for(const field of ['id','name','region','image','salaryMod','bonuses'])assert.deepEqual(after.data.LOCATIONS[id][i][field],loc[field],id+'/'+field);
 });
 assert.equal(paths.length,276);assert.deepEqual(Object.keys(catalogue).sort(),paths.sort());
 for(const [key,{source,target}]of Object.entries(catalogue)){
  const path=JSON.parse(key);let orig=before.data.LOCATIONS,out=restored;for(const part of path.slice(0,-1)){orig=orig[part];out=out[part];}
  const leaf=path.at(-1);assert.equal(source,orig[leaf]);assert.equal(target,out[leaf]);assert.ok(target.trim());out[leaf]=source;
 }
 assert.deepEqual(restored,before.data.LOCATIONS);assert.deepEqual(after.data.LOCATION_MAP,{});assert.deepEqual(after.data.GEOGRAPHY_REGIONS,before.data.GEOGRAPHY_REGIONS);
 for(const name of ruleMethods)assert.equal(after.methods[name],before.methods[name],name);
 assert.deepEqual(after.functions,before.functions);
});
function setup(source){
 const nodes=new Map(),events={sound:0,creditRender:0},map={};
 Object.values(source.data.LOCATIONS).flat().forEach(loc=>{map[loc.id]=loc;});
 const get=id=>{
  if(!nodes.has(id)){
   const classes=new Set(['hidden']);nodes.set(id,{textContent:'',innerHTML:'',classList:{add(...v){v.forEach(x=>classes.add(x));},remove(...v){v.forEach(x=>classes.delete(x));},contains(x){return classes.has(x);}}});
  }
  return nodes.get(id);
 };
 const math=Object.create(Math);math.random=()=>0.5;
 const context=vm.createContext({...source.data,LOCATION_MAP:map,SlingshotLocationDisplay:display,SlingshotInitialCredit:{render(){events.creditRender++;}},document:{getElementById:get},soundManager:{playLocationSelect(){events.sound++;}},setTimeout(){},console,Math:math});
 for(const code of Object.values(source.functions))vm.runInContext(code,context);
 const g={company:{id:'aether',name:'Teste'},metrics:{sci:50,dev:45,mkt:35,hr:50},founderProfile:{id:'firsttimer'},ukGrantExperience:1,ukGrantStatus:1,investorRelationship:1};
 for(const [name,code]of Object.entries(source.methods))g[name]=vm.runInContext('('+code+')',context);
 g.renderHeader=vm.runInContext('('+source.header[0]+')',context);
 return {g,get,events,math};
}
test('selection cards, detail dialog and header display Portuguese geography while selection retains original keys',()=>{
 const {g,get,events}=setup(after);let count=0;
 for(const [venture,locations]of Object.entries(after.data.LOCATIONS)){
  g.company.id=venture;g.showLocationModal();
  for(const loc of locations){
   assert.ok(get('locationGrid').innerHTML.includes('>'+display.city(loc.name)+'</h3>'));
   assert.ok(get('locationGrid').innerHTML.includes('>'+display.region(loc.region)+'</span>'));
   g.showLocationInfo(loc.id);assert.equal(get('locationInfoName').textContent,'📍 '+display.city(loc.name));assert.equal(get('locationInfoRegion').textContent,display.region(loc.region));
   assert.equal(get('locationInfoDesc').textContent,loc.description);assert.equal(get('locationInfoImage').innerHTML,loc.image);
   g.selectLocation(loc.id);assert.equal(g.location.id,loc.id);assert.equal(g.location.name,loc.name);assert.equal(g.location.region,loc.region);
   g.renderHeader();assert.equal(get('locationDisplay').textContent,'📍 '+display.city(loc.name));assert.ok(get('locationModal').classList.contains('hidden'));assert.ok(!get('fundingModal').classList.contains('hidden'));count++;
  }
 }
 assert.equal(count,36);assert.equal(events.sound,36);assert.equal(events.creditRender,36);
 assert.equal(display.city('London'),'Londres');assert.equal(display.city('Edinburgh'),'Edimburgo');
 assert.equal(display.region('Scotland'),'Escócia');assert.equal(display.region('Wales'),'País de Gales');assert.equal(display.region('Northern Ireland'),'Irlanda do Norte');
 for(const value of ['Oxford','Newcastle upon Tyne','__proto__','constructor','Unknown'])assert.equal(display.city(value),value);
 assert.ok(Object.isFrozen(display));
});
test('all 36 locations retain regional eligibility, local funding bonus and university assessment results',()=>{
 const a=setup(before),b=setup(after);const programmes=a.g.getUKGrantProgrammes();
 assert.deepEqual(plain(b.g.getUKGrantProgrammes()),plain(programmes));
 for(const [venture,locations]of Object.entries(before.data.LOCATIONS))locations.forEach((loc,i)=>{
  a.g.location=loc;b.g.location=after.data.LOCATIONS[venture][i];
  assert.deepEqual(plain(b.g.getLocalFundingBonus()),plain(a.g.getLocalFundingBonus()),loc.id);
  for(const programme of programmes)assert.equal(b.g.isGrantProgrammeAvailable(programme),a.g.isGrantProgrammeAvailable(programme),loc.id+'/'+programme.id);
  for(const partner of ['none','uni_imperial','uni_edinburgh','uni_oxford','uni_hull','industry_nhs','eu_fraunhofer']){
   const app={partner,effort:'standard',advisor:false,quality:1,cashCost:0};
   for(const value of [0.01,0.5,0.99]){
    a.math.random=()=>value;b.math.random=()=>value;
    for(const programme of programmes)assert.deepEqual(plain(b.g.generateUKGrantAssessment(app,programme)),plain(a.g.generateUKGrantAssessment(app,programme)),loc.id+'/'+partner+'/'+programme.id+'/'+value);
   }
  }
 });
 // The local-partner increment must really be exercised, not merely compared at a zero result.
 a.math.random=()=>0.5;a.g.location={name:'London',region:'Capital'};
 const programme={requiresPartner:true,isRegional:false,aiBaseRate:0.2},app={partner:'uni_imperial',effort:'standard'};
 const local=a.g.generateUKGrantAssessment(app,programme).totalScore;
 a.g.location={name:'Edinburgh',region:'Scotland'};assert.ok(local>a.g.generateUKGrantAssessment(app,programme).totalScore);
});
