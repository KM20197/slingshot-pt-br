const test=require('node:test'),assert=require('node:assert/strict');
const {translate}=require('../tools/structured-translation.cjs');
const html='<script>const DATA={id:"keep",description:"Original",amount:24,inner:["Text"]};function rule(){return DATA.amount*2;}</script>';
const catalog=()=>({DATA:{strings:{'["description"]':{source:'Original',target:'Aspas "balanceadas", ${sem execução} e </script>'}}}});
test('translation safely quotes strings and preserves numeric values, keys and functions',()=>{
 const result=translate(html,catalog());assert.equal(result.reports[0].astParity,true);
 assert.match(result.html,/id:"keep"/);assert.match(result.html,/amount:24/);assert.match(result.html,/return DATA.amount\*2/);
 assert.equal([...result.html.matchAll(/<\/script>/g)].length,1);
});
test('fails closed on stale strings or nonexistent fields',()=>{
 const stale=catalog();stale.DATA.strings['["description"]'].source='Unexpected';assert.throws(()=>translate(html,stale),/Fonte divergente/);
 const missing={DATA:{strings:{'["id2"]':{source:'keep',target:'changed'}}}};assert.throws(()=>translate(html,missing),/Campo não encontrado/);
});
