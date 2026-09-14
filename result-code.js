(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./academic'):root.SlingshotAcademic);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.SlingshotResult=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(academic){
 'use strict';
 function validate(data){
  if(data.version!=='slingshot-br-1'||data.formulaVersion!=='1.0.0')throw new Error('Versão de resultado não suportada.');
  if(typeof data.identificacao!=='string'||!data.identificacao.trim()||data.identificacao.length>254)throw new Error('Identificação inválida.');
  if(typeof data.nonce!=='string'||!data.nonce)throw new Error('Código de partida ausente.');
  const recalculated=academic.calculate(data.metricas);
  if(data.nota!==recalculated.grade)throw new Error('Nota diferente do recálculo.');
  for(const component of ['development','continuity','financial'])if(data.componentes?.[component]!==recalculated.components[component])throw new Error('Componente da nota inconsistente.');
  return recalculated;
 }
 async function key(secret,operation){
  if(typeof secret!=='string'||!secret.trim())throw new Error('Informe a chave da turma.');
  return crypto.subtle.importKey('raw',new TextEncoder().encode(secret.trim()),{name:'HMAC',hash:'SHA-256'},false,[operation]);
 }
 async function encode(data,secret){
  validate(data);
  const payload=JSON.stringify(data);
  const signature=new Uint8Array(await crypto.subtle.sign('HMAC',await key(secret,'sign'),new TextEncoder().encode(payload)));
  return btoa(encodeURIComponent(payload))+'.'+Array.from(signature,b=>b.toString(16).padStart(2,'0')).join('');
 }
 async function verify(code,secret){
  if(typeof code!=='string'||code.length>100000)throw new Error('Código inválido ou acima do tamanho esperado.');
  const parts=code.trim().split('.');
  if(parts.length!==2||!/^[0-9a-f]{64}$/i.test(parts[1]))throw new Error('Formato de código inválido.');
  const payload=decodeURIComponent(atob(parts[0]));
  const signature=Uint8Array.from(parts[1].match(/../g),pair=>parseInt(pair,16));
  if(!await crypto.subtle.verify('HMAC',await key(secret,'verify'),signature,new TextEncoder().encode(payload)))throw new Error('Assinatura não confere com a chave da turma.');
  const data=JSON.parse(payload);return {data,result:validate(data)};
 }
 return Object.freeze({encode,verify});
});
