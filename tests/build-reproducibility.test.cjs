const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
test('build in a fresh output directory creates its own reports and reproduces the committed HTML',()=>{
 fs.mkdirSync('artifacts',{recursive:true});
 const dir=fs.mkdtempSync(path.resolve('artifacts/fresh-build-'));
 for(const folder of ['tools','source','locales','vendor'])fs.cpSync(folder,path.join(dir,folder),{recursive:true});
 for(const file of fs.readdirSync('.'))if(file.endsWith('.js'))fs.copyFileSync(file,path.join(dir,file));
 assert.equal(fs.existsSync(path.join(dir,'artifacts')),false);
 execFileSync(process.execPath,['tools/build.cjs'],{cwd:dir,encoding:'utf8',timeout:120000});
 assert.equal(fs.readFileSync(path.join(dir,'index.html'),'utf8'),fs.readFileSync('index.html','utf8'));
 const report=JSON.parse(fs.readFileSync(path.join(dir,'artifacts/build-report.json'),'utf8'));
 assert.equal(report.scriptBlocksChecked,18);
 assert.ok(fs.existsSync(path.join(dir,'artifacts/structured-translation-report.json')));
});
