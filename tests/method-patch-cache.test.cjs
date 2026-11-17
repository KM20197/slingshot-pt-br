'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const old=require('./fixtures/method-patch-legacy.cjs'),fast=require('../tools/method-patch.cjs');
const fixture='<p>Preserve 🌿 ação</p><script src="vendor.js"></script><script type="application/ld+json">{"x":1}</script><script>class Other{x(){return 3;}}class Game{alpha(){return 1;}beta(){return 2;}gamma(){return 3;}}</script>';
function sameFailure(html,name,body){let x,y;try{old.replaceMethod(html,name,body);}catch(e){x=e;}try{fast.replaceMethod(html,name,body);}catch(e){y=e;}assert.ok(x&&y);assert.equal(y.constructor,x.constructor);assert.equal(y.message,x.message);}
test('cached method positions preserve legacy bytes across edits, Unicode, external changes and reentrant callbacks',()=>{
 let a=fixture,b=fixture;
 for(const [name,body]of [['alpha','return "🌿 ação";'],['gamma',s=>s.replace('3','30')],['beta','return {cash:2};'],['alpha',s=>s.replace('ação','gestão')],['gamma','return 9;']]){a=old.replaceMethod(a,name,body);b=fast.replaceMethod(b,name,body);assert.equal(b,a);}
 a='<h1>Prefixo novo</h1>'+a;b='<h1>Prefixo novo</h1>'+b;a=old.replaceMethod(a,'beta','return 8;');b=fast.replaceMethod(b,'beta','return 8;');assert.equal(b,a);
 a=old.replaceMethod(fixture,'alpha',s=>{old.replaceMethod(fixture,'beta','return 12345;');return s.replace('1','11');});
 b=fast.replaceMethod(fixture,'alpha',s=>{fast.replaceMethod(fixture,'beta','return 12345;');return s.replace('1','11');});assert.equal(b,a);a=old.replaceMethod(a,'gamma','return 4;');b=fast.replaceMethod(b,'gamma','return 4;');assert.equal(b,a);
});
test('cache invalidates nested classes/script delimiters and retains all legacy refusal behavior',()=>{
 sameFailure(fixture,'missing','return 0;');sameFailure(fixture.replace('gamma(){','beta(){'),'beta','return 0;');sameFailure(fixture,'alpha','return (');
 let a=old.replaceMethod(fixture,'alpha','class Inner{nested(){return 1;}}return Inner;'),b=fast.replaceMethod(fixture,'alpha','class Inner{nested(){return 1;}}return Inner;');assert.equal(a,b);
 a=old.replaceMethod(a,'nested','return 22;');b=fast.replaceMethod(b,'nested','return 22;');assert.equal(a,b);
 a=old.replaceMethod(a,'alpha','return 5;');b=fast.replaceMethod(b,'alpha','return 5;');assert.equal(a,b);sameFailure(a,'nested','return 0;');
 a=old.replaceMethod(fixture,'alpha','return "</script>";');b=fast.replaceMethod(fixture,'alpha','return "</script>";');assert.equal(a,b);sameFailure(a,'gamma','return 0;');
});
