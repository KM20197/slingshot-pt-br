const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const helper=path.resolve('tools/bmc-catalogue.cjs');
function fixture(){
 fs.mkdirSync('artifacts',{recursive:true});
 const dir=fs.mkdtempSync(path.resolve('artifacts/bmc-catalogue-'));
 fs.mkdirSync(path.join(dir,'source'));fs.mkdirSync(path.join(dir,'locales'));
 const file=path.join(dir,'locales/structures.pt-BR.json');
 const original={aether:{initial:{item:'First source'}},vanguard:{initial:{item:'Second source'}}};
 fs.writeFileSync(path.join(dir,'source/index.original.html'),'<script>const BMC_DATA='+JSON.stringify(original)+';</script>');
 fs.writeFileSync(file,JSON.stringify({BMC_DATA:{strings:{'["aether","initial","item"]':{source:'First source',target:'Primeiro texto'}}}}));
 return {dir,file,original};
}
function run(f,profile,pairs){
 return spawnSync(process.execPath,['-e','require('+JSON.stringify(helper)+')('+JSON.stringify(profile)+','+JSON.stringify(pairs)+')'],{cwd:f.dir,encoding:'utf8'});
}
test('catalogue rejects cross-profile collision before writing any bytes',()=>{
 const f=fixture(),before=fs.readFileSync(f.file,'utf8');
 const result=run(f,'vanguard','Second source|Primeiro texto');
 assert.notEqual(result.status,0);assert.match(result.stderr,/Colisão entre perfis/);assert.equal(fs.readFileSync(f.file,'utf8'),before);
});
test('catalogue rejects inconsistent repeated source and unknown retained profile without writing',()=>{
 const f=fixture();f.original.vanguard.initial.item='First source';
 fs.writeFileSync(path.join(f.dir,'source/index.original.html'),'<script>const BMC_DATA='+JSON.stringify(f.original)+';</script>');
 let before=fs.readFileSync(f.file,'utf8');
 let result=run(f,'vanguard','First source|Segundo texto');assert.notEqual(result.status,0);assert.match(result.stderr,/Tradução inconsistente/);assert.equal(fs.readFileSync(f.file,'utf8'),before);
 const catalogue=JSON.parse(before);catalogue.BMC_DATA.strings['["unknown","item"]']={source:'Unknown source',target:'Outro texto'};
 fs.writeFileSync(f.file,JSON.stringify(catalogue));before=fs.readFileSync(f.file,'utf8');
 result=run(f,'vanguard','First source|Primeiro texto');assert.notEqual(result.status,0);assert.match(result.stderr,/Perfil desconhecido/);assert.equal(fs.readFileSync(f.file,'utf8'),before);
});
test('regenerating first profile preserves second profile, source order and classification',()=>{
 const f=fixture();assert.equal(run(f,'vanguard','Second source|Segundo texto').status,0);
 const before=JSON.parse(fs.readFileSync(f.file,'utf8'));
 assert.equal(run(f,'aether','First source|Primeiro texto').status,0);
 const after=JSON.parse(fs.readFileSync(f.file,'utf8'));
 assert.deepEqual(after,before);assert.match(after.BMC_DATA.classification,/aether, vanguard/);
 assert.deepEqual(Object.keys(after.BMC_DATA.strings).map(p=>JSON.parse(p)[0]),['aether','vanguard']);
});
