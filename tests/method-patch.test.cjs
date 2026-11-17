const test=require('node:test'),assert=require('node:assert/strict');
const {replaceMethod}=require('../tools/method-patch.cjs');
test('callback patches preserve method boundary whitespace even after repeated edits',()=>{
 const original='<script>class Game {\n  init() {\n    this.value = 1;\n  }\n}</script>';
 assert.equal(replaceMethod(original,'init',body=>body),original);
 const first=replaceMethod(original,'init',body=>body.replace('= 1;','= 2;'));
 assert.equal(replaceMethod(first,'init',body=>body.replace('= 2;','= 1;')),original);
 assert.equal(replaceMethod(original,'init','    this.value = 3;'),original.replace('= 1;','= 3;'));
});
test('method patch rejects absent/duplicate methods and invalid replacement syntax',()=>{
 assert.throws(()=>replaceMethod('<script>class Game {}</script>','init',''),/ausente/);
 assert.throws(()=>replaceMethod('<script>class Game {init(){} init(){}}</script>','init',''),/duplicado/);
 assert.throws(()=>replaceMethod('<script>class Game {init(){}}</script>','init','const =;'));
});
