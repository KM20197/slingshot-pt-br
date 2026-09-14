const {test}=require('node:test');const assert=require('node:assert/strict');
const {calculate}=require('../academic');const {encode,verify}=require('../result-code');
const {createHmac}=require('node:crypto');
function payload(){const score=calculate({milestones:[1,1,.5],completedQuarters:12,success:false,cash:60,nextOperatingCosts:80,nextDebtPayments:20,arrears:0});return {version:'slingshot-br-1',formulaVersion:'1.0.0',nonce:'partida-ficticia-teste',identificacao:'teste@example.invalid',empresa:'Clínica São João',nota:score.grade,componentes:score.components,metricas:score.inputs};}
test('exporta e verifica offline com acentuação e nota 3,85',async()=>{
 const original=payload();const code=await encode(original,'chave-fictícia');const checked=await verify(code,'chave-fictícia');
 assert.deepEqual(checked.data,original);assert.equal(checked.result.grade,3.85);
 const [body,signature]=code.split('.');const text=decodeURIComponent(atob(body));
 assert.equal(signature,createHmac('sha256','chave-fictícia').update(text).digest('hex'));
});
test('rejeita chave errada, código alterado e dados inválidos',async()=>{
 const code=await encode(payload(),'teste');await assert.rejects(()=>verify(code,'outra'));
 await assert.rejects(()=>verify(code+'0','teste'));await assert.rejects(()=>encode({...payload(),nota:5},'teste'));
 await assert.rejects(()=>encode(payload(),''));
});
test('recálculo rejeita nota forjada mesmo com assinatura compatível',async()=>{
 const data={...payload(),nota:5};const text=JSON.stringify(data);
 const code=btoa(encodeURIComponent(text))+'.'+createHmac('sha256','teste').update(text).digest('hex');
 await assert.rejects(()=>verify(code,'teste'),/recálculo/);
});
test('conteúdo é decodificável: não confundir assinatura com criptografia',async()=>{
 const code=await encode(payload(),'teste');assert.equal(JSON.parse(decodeURIComponent(atob(code.split('.')[0]))).identificacao,'teste@example.invalid');
});
