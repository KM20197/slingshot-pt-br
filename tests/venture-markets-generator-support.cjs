const fs=require('node:fs'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const plain=value=>JSON.parse(JSON.stringify(value));
exports.assertAtomic=(generatorPath,targetsPath,prefix,mutations)=>{
 fs.mkdirSync('artifacts',{recursive:true});const dir=fs.mkdtempSync(path.resolve('artifacts/'+prefix+'-'));
 for(const folder of ['tools','source','locales'])fs.mkdirSync(path.join(dir,folder));
 for(const file of [generatorPath,'tools/structured-translation.cjs','locales/structures.pt-BR.json',targetsPath,'source/index.original.html'])fs.copyFileSync(file,path.join(dir,file));
 const run=()=>spawnSync(process.execPath,[generatorPath],{cwd:dir,encoding:'utf8',timeout:120000}),catalogue=path.join(dir,'locales/structures.pt-BR.json');
 const first=run();if(first.status!==0)throw Error(first.stderr);const bytes=fs.readFileSync(catalogue),targets=JSON.parse(fs.readFileSync(path.join(dir,targetsPath),'utf8'));
 if(run().status!==0||!fs.readFileSync(catalogue).equals(bytes))throw Error('Gerador não idempotente');
 for(const mutate of mutations){const invalid=plain(targets);mutate(invalid);fs.writeFileSync(path.join(dir,targetsPath),JSON.stringify(invalid));const result=run();if(result.status===0||!fs.readFileSync(catalogue).equals(bytes))throw Error('Entrada inválida alterou o catálogo');}
 fs.writeFileSync(path.join(dir,targetsPath),JSON.stringify(targets));const sourceFile=path.join(dir,'source/index.original.html');fs.writeFileSync(sourceFile,fs.readFileSync(sourceFile,'utf8').replace('const VENTURE_MARKETS','const VENTURE_MARKETS_CHANGED'));const stale=run();if(stale.status===0||!fs.readFileSync(catalogue).equals(bytes))throw Error('Fonte divergente alterou o catálogo');
};
