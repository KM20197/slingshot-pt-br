const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const patch=require('../tools/operational-endgame-patch.cjs');
const source=fs.readFileSync(require.resolve('../source/index.original.html'),'utf8');
test('all game endings are redirected to the local academic result before legacy SaaS reporting',()=>{
 const html=patch.apply(source);
 const atMethod=html.indexOf('endGame(reason) {'),atGuard=html.indexOf('SlingshotOperationalEndgame.show(this, reason)'),atLegacy=html.indexOf('// Time-played stat:',atMethod);
 assert.ok(atMethod>=0);assert.ok(atGuard>atMethod);assert.ok(atLegacy>=0);assert.ok(atGuard<atLegacy,'guard must run before legacy report');
 const runtime=fs.readFileSync(require.resolve('../operational-endgame-runtime.js'),'utf8');
 for(const phrase of ['Metas concluídas','Caixa insuficiente','Trimestres concluídos','Aprendizado da simulação'])assert.ok(runtime.includes(phrase),phrase);
 assert.match(runtime,/querySelectorAll\('\[href\*="claude"\]/);
});
