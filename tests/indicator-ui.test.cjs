const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),acorn=require('acorn'),walk=require('acorn-walk'),crypto=require('node:crypto');
const patch=require('../tools/indicator-ui-patch.cjs'),cat=require('../locales/indicator-ui.pt-BR.json'),source=fs.readFileSync('source/index.original.html','utf8');
function undo(before,after){const a=patch.inspect(before),b=patch.inspect(after);let out=after;for(const p of [...b.points].sort((a,b)=>b.start-a.start)){const old=a.points.find(x=>x.id===p.id);out=out.slice(0,p.start)+old.raw+out.slice(p.end);}return out;}
function methods(html,name){const result=[];for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(/\bsrc\s*=|application\/ld\+json/.test(m[1]))continue;const code=m[2],add=n=>{if((n.key?.name??n.key?.value)===name)result.push(code.slice(n.start,n.end));};walk.simple(acorn.parse(code,{ecmaVersion:'latest'}),{MethodDefinition:add,Property(n){if(/Function/.test(n.value?.type))add(n);}});}assert.equal(result.length,1,name);return result[0];}
test('indicators replace exactly seven literals and generated labels retain the original thresholds, calls and all other bytes',()=>{
 assert.equal(crypto.createHash('sha256').update(source).digest('hex'),'a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61');
 const result=patch.apply(source);assert.equal(result.report.labels,7);assert.equal(undo(source,result.html),source);assert.equal(Object.keys(cat.strings).length,7);
 const built=fs.readFileSync('index.html','utf8'),points=patch.inspect(built).points;for(const p of points)assert.equal(p.source,cat.strings[p.id].target,p.id);
 assert.equal(methods(built,'showKPIChange'),methods(source,'showKPIChange'));
});
test('indicator guards reject stale sources, changed thresholds or toast mechanics, duplicate methods and unsafe/extra targets',()=>{
 const clone=()=>JSON.parse(JSON.stringify(cat)),score=patch.inspect(source).methods.score;
 for(const [a,b]of [['pct >= 80','pct >= 81'],['max = 100','max = 99'],["return 'Excellent'","return 'Excellent altered'"]]){assert.ok(score.includes(a));assert.throws(()=>patch.apply(source.replace(score,score.replace(a,b))),/AST protegido/);}
 assert.throws(()=>patch.apply(source.replace("showKPIChange('Cash', prevCash, newCash", "showKPIChange('Cash', prevBurn, newCash")),/AST protegido/);
 assert.throws(()=>patch.apply(source.replace(score,score+'\n'+score)),/duplicado/);
 assert.throws(()=>patch.apply(source.replace('class Game {','class OtherGame {')),/Classe Game/);
 const missing=clone();delete missing.strings.scoreEarly;assert.throws(()=>patch.apply(source,missing),/Catálogo/);
 const extra=clone();extra.strings.unknown={source:'x',target:'Outro'};assert.throws(()=>patch.apply(source,extra),/Catálogo/);
 for(const target of ['',' Excelente','<b>Excelente</b>','Excelente\n','Excelente 80','Excellent']){const c=clone();c.strings.scoreExcellent.target=target;assert.throws(()=>patch.apply(source,c),/inválido/);}
 const stale=clone();stale.strings.scoreExcellent.source='Wrong';assert.throws(()=>patch.apply(source,stale),/inválido/);
 const fields=clone();fields.strings.scoreExcellent.extra='field';assert.throws(()=>patch.apply(source,fields),/inválido/);
 assert.throws(()=>patch.apply(patch.apply(source).html),/AST protegido/);
});
test('real generated score method and toast consumer preserve boundaries, custom maxima, formatters, thresholds and state',()=>{
 const built=fs.readFileSync('index.html','utf8'),originalScore=vm.runInNewContext('({'+patch.inspect(source).methods.score+'}).getScoreLabel'),actualScore=vm.runInNewContext('({'+patch.inspect(built).methods.score+'}).getScoreLabel');
 const map=Object.fromEntries(Object.values(cat.strings).map(e=>[e.source,e.target]));
 for(const max of [undefined,100,200,0])for(const value of [-1,0,19.999,20,39.999,40,59.999,60,79.999,80,100,160,Infinity,NaN])assert.equal(actualScore(value,max),map[originalScore(value,max)]);
 assert.equal(actualScore(80),cat.strings.scoreExcellent.target);assert.equal(actualScore(19.999),cat.strings.scoreEarly.target);
 const update=patch.inspect(built).methods.update,ast=acorn.parse('({'+update+'})',{ecmaVersion:'latest'}),calls=[];
 walk.simple(ast,{CallExpression(n){if(n.callee.type==='MemberExpression'&&n.callee.object.name==='UIEffects'&&n.callee.property.name==='showKPIChange')calls.push(n);}});assert.equal(calls.length,2);
 const wrapped='({'+update+'})',sandbox={region:{currency:'R$'},cashDiff:25,runwayDiff:-1},toast=vm.runInNewContext('({'+methods(built,'showKPIChange')+'}).showKPIChange'),messages=[],state={marker:'intacto',showToast(...args){messages.push(args);}};
 const options=calls.map(n=>vm.runInNewContext('('+wrapped.slice(n.arguments[3].start,n.arguments[3].end)+')',sandbox));
 toast.call(state,calls[0].arguments[0].value,0,25,options[0]);toast.call(state,calls[1].arguments[0].value,4,3,options[1]);
 assert.deepEqual(messages,[[cat.strings.cashToast.target+': R$0k → R$25k','good','📈'],[cat.strings.runwayToast.target+': 4q → 3q','bad','📉']]);
 toast.call(state,'ignored',1,1.01,{});assert.equal(messages.length,2);assert.equal(state.marker,'intacto');
});
