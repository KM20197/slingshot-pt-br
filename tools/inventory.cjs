const fs = require('node:fs');
const crypto = require('node:crypto');
const acorn = require('acorn');
const walk = require('acorn-walk');
const parse5 = require('parse5');
const html = fs.readFileSync('source/index.original.html', 'utf8');
fs.mkdirSync('artifacts/scripts', {recursive:true});
const structures = [], strings = [], scripts = [];
let index = 0;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
  if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
  const code = match[2];
  const offset = match.index + match[0].indexOf('>') + 1;
  const baseLine = html.slice(0, offset).split('\n').length;
  const file = `artifacts/scripts/${String(index++).padStart(2,'0')}.js`;
  fs.writeFileSync(file, code);
  const ast = acorn.parse(code, {ecmaVersion:'latest',sourceType:'script',locations:true});
  scripts.push({file,baseLine,bytes:Buffer.byteLength(code),sha256:crypto.createHash('sha256').update(code).digest('hex')});
  walk.ancestor(ast, {
    VariableDeclarator(node, ancestors) {
      if (node.id.type !== 'Identifier' || !node.init || !['ObjectExpression','ArrayExpression'].includes(node.init.type)) return;
      if (ancestors.some(a => /Function/.test(a.type))) return;
      const end = baseLine + node.loc.end.line - 1;
      structures.push({name:node.id.name,start:baseLine+node.loc.start.line-1,end,type:node.init.type,entries:(node.init.elements||node.init.properties).length});
    },
    Literal(node, ancestors) {
      if (typeof node.value !== 'string' || node.value.length > 30000 || node.value.startsWith('data:')) return;
      const parent = ancestors.at(-2);
      if (parent?.type === 'Property' && parent.key === node) return;
      strings.push({id:`s${scripts.length-1}:${node.start}`,line:baseLine+node.loc.start.line-1,start:offset+node.start,end:offset+node.end,text:node.value,context:parent?.type,status:'pending'});
    },
    TemplateElement(node) {
      if (node.value.raw.length > 30000 || node.value.raw.startsWith('data:')) return;
      strings.push({id:`t${scripts.length-1}:${node.start}`,line:baseLine+node.loc.start.line-1,start:offset+node.start,end:offset+node.end,text:node.value.raw,context:'TemplateElement',status:'pending'});
    }
  });
}
const htmlStrings=[];
const tree=parse5.parse(html,{sourceCodeLocationInfo:true});
function visit(node, excluded=false) {
  const skip=excluded || ['script','style'].includes(node.tagName);
  if (!skip && node.nodeName==='#text' && node.value.trim() && node.sourceCodeLocation) {
    const loc=node.sourceCodeLocation;
    htmlStrings.push({line:loc.startLine,start:loc.startOffset,end:loc.endOffset,text:node.value,context:'HTMLText',status:'pending'});
  }
  if (!skip && node.attrs) for (const attr of node.attrs) {
    if (['title','alt','placeholder','aria-label'].includes(attr.name)) {
      const loc=node.sourceCodeLocation?.attrs?.[attr.name];
      if(loc) htmlStrings.push({line:loc.startLine,start:loc.startOffset,end:loc.endOffset,text:attr.value,context:'HTMLAttribute:'+attr.name,status:'pending'});
    }
  }
  for(const child of node.childNodes||[]) visit(child,skip);
}
visit(tree);
structures.sort((a,b)=>a.start-b.start);
strings.sort((a,b)=>a.start-b.start);
fs.writeFileSync('artifacts/inventory.json',JSON.stringify({lines:html.split('\n').length,scripts,structures,strings,htmlStrings},null,2));
fs.writeFileSync('docs/INVENTARIO.md', '# Inventário estrutural do original\n\nGerado por `node tools/inventory.cjs`; nenhuma tradução é inferida como concluída.\n\n'+`Linhas: ${html.split('\n').length}. Scripts internos: ${scripts.length}. Estruturas de dados fora de funções: ${structures.length}. Strings e segmentos de template candidatos: ${strings.length}.\n\n`+'| Estrutura | Início | Fim | Entradas |\n|---|---:|---:|---:|\n'+structures.map(s=>`| ${s.name} | ${s.start} | ${s.end} | ${s.entries} |`).join('\n')+'\n');
console.log(JSON.stringify({lines:html.split('\n').length,scripts:scripts.length,structures:structures.length,stringCandidates:strings.length}));
fs.appendFileSync('docs/INVENTARIO.md',`\nCandidatos em texto HTML e atributos de interface: ${htmlStrings.length}.\n\nOs candidatos não equivalem a traduções obrigatórias: incluem identificadores e nomes próprios. Literais maiores que 30.000 caracteres e data URLs são excluídos do catálogo compacto e exigem inspeção separada; a análise sintática inclui os scripts completos. Atributos de eventos, metadados, comentários e CSS não são traduzidos automaticamente.\n`);
