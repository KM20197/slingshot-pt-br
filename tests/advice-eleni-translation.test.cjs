const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('eleniStavros advice catalogue covers exactly the 23 translated paths in generated HTML',()=>{
 const targets=JSON.parse(fs.readFileSync('locales/advice-eleni-targets.pt-BR.json','utf8')).eleniStavros;
 const strings=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8')).FUNDER_ADVICE.strings;
 const entries=Object.entries(strings).filter(([path])=>path.startsWith('["eleniStavros",'));
 assert.equal(entries.length,23);assert.equal(targets.length,23);for(const target of targets)assert.ok(entries.some(([,v])=>v.target===target),target);
 const html=fs.readFileSync('index.html','utf8');for(const target of targets)assert.ok(html.includes(target),target);
});
