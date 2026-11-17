const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const patch=require('../tools/company-identity-patch.cjs');
const ventures=require('../locales/ventures.pt-BR.json');
const source=fs.readFileSync(require.resolve('../source/index.original.html'),'utf8');

test('all twelve technical IDs retain their rules while their visible COMPANY identity is Brazilian',()=>{
 const html=patch.apply(source);
 const companies={};
 for(const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=/.test(script[1]))continue;
  walk.simple(acorn.parse(script[2],{ecmaVersion:'latest'}),{VariableDeclarator(node){
   if(node.id.name!=='COMPANIES'||node.init?.type!=='ArrayExpression')return;
   for(const item of node.init.elements){const properties=Object.fromEntries(item.properties.map(property=>[property.key.name,property.value.value]));companies[properties.id]=properties;}
  }});
 }
 for(const [id,venture] of Object.entries(ventures)){
  assert.equal(companies[id]?.name,venture.name,id+' name');
  assert.equal(companies[id]?.desc,venture.desc,id+' description');
 }
});
