/* Generates an editable catalogue; it never changes game data. */
const fs=require('node:fs');
const acorn=require('acorn');
const walk=require('acorn-walk');

const root=require('node:path').resolve(__dirname,'..');
const source=fs.readFileSync(require('node:path').join(root,'source','index.original.html'),'utf8');
const scripts=[...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)].map(m=>m[1]);
let pool;
for(const script of scripts){
  let ast;
  try{ast=acorn.parse(script,{ecmaVersion:'latest'});}catch{continue;}
  walk.simple(ast,{VariableDeclarator(node){if(node.id.type==='Identifier'&&node.id.name==='CANDIDATE_POOL')pool=node.init;}});
  if(pool)break;
}
if(!pool||pool.type!=='ObjectExpression')throw new Error('CANDIDATE_POOL não encontrado no original.');
function key(property){return property.key.type==='Identifier'?property.key.name:String(property.key.value);}
function value(node){
  if(!node)return '';
  if(node.type==='Literal')return String(node.value??'');
  if(node.type==='ArrayExpression')return node.elements.map(value).filter(Boolean);
  if(node.type==='ObjectExpression')return Object.fromEntries(node.properties.filter(p=>p.type==='Property').map(p=>[key(p),value(p.value)]));
  return '';
}
function object(node){return Object.fromEntries(node.properties.filter(p=>p.type==='Property').map(p=>[key(p),value(p.value)]));}
const lines=[
  'CATÁLOGO DE CURRÍCULOS PARA ADAPTAÇÃO — NÃO ALTERAR IDs',
  '',
  'Instruções:',
  '- Traduza/adapte apenas os valores depois de ":" nos campos textuais.',
  '- Não altere ID, ÁREA, NÍVEL, nem remova os separadores "---".',
  '- Não inclua salários, participação, cidades ou regras econômicas neste arquivo.',
  '- Ao devolver, mantenha UTF-8 e o mesmo formato.',
  ''
];
for(const role of pool.properties.filter(p=>p.type==='Property')){
  const entries=role.value?.elements||[];
  for(const entry of entries){
    const c=object(entry),cv=c.cv||{};
    lines.push('---','ID: '+c.id,'ÁREA: '+key(role),'NÍVEL: '+c.seniority,'NOME: '+c.name,'CONTEXTO: '+c.background,'ORIGEM: '+c.origin,'CITAÇÃO: '+c.quote,'FORMAÇÃO: '+cv.education,'EXPERIÊNCIA:');
    for(const item of cv.experience||[])lines.push('- '+item);
    lines.push('REALIZAÇÕES: '+(cv.achievements||''),'COMPETÊNCIAS: '+(cv.skills||''),'PERFIL: '+(cv.personality||''),'PONTOS FORTES: '+(c.strengths||[]).join(' | '),'PONTOS DE ATENÇÃO: '+(c.weaknesses||[]).join(' | '),'');
  }
}
const output=require('node:path').join(root,'docs','CANDIDATOS_PARA_ADAPTACAO.txt');
fs.writeFileSync(output,lines.join('\n'),'utf8');
console.log(JSON.stringify({output,candidates:lines.filter(line=>line.startsWith('ID: ')).length}));
