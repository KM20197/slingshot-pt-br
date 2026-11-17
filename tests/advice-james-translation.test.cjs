const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('jamesMorrison advice covers exactly its 21 translated paths in generated HTML',()=>{
 const targets=JSON.parse(fs.readFileSync('locales/advice-james-targets.pt-BR.json','utf8')).jamesMorrison;
 const strings=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8')).FUNDER_ADVICE.strings;
 const entries=Object.entries(strings).filter(([path])=>path.startsWith('["jamesMorrison",'));
 assert.equal(targets.length,21);assert.equal(entries.length,21);const html=fs.readFileSync('index.html','utf8');for(const target of targets)assert.ok(html.includes(target),target);
 const pairs=[['Security clearances take time. Start the process now.','Credenciais de segurança levam tempo. Inicie o processo agora.'],["You can't serve defence without them.",'Sem elas, você não pode atender à defesa.'],["Lancaster's cyber centre has excellent graduates.",'O centro cibernético de Lancaster tem excelentes graduados.'],['I can make introductions.','Posso fazer apresentações.']];for(const [source,target] of pairs)assert.ok(entries.some(([,value])=>value.source===source&&value.target===target),source);
});
