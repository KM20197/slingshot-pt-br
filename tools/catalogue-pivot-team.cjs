const fs = require('node:fs');
const crypto = require('node:crypto');
const acorn = require('acorn');
const walk = require('acorn-walk');
const {translate} = require('./structured-translation.cjs');

const originalHash = 'a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61';
const structureHash = 'fbefb8e2e4dea7b242052d3ab4dffe9daedbbaed8fd8149a93e8c55354fe8bf2';
const html = fs.readFileSync('source/index.original.html', 'utf8');
if (crypto.createHash('sha256').update(html).digest('hex') !== originalHash) throw Error('Fonte original divergente');
let initializer, code;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
  if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
  walk.ancestor(acorn.parse(match[2], {ecmaVersion: 'latest'}), {
    VariableDeclarator(node, ancestors) {
      if (node.id.name !== 'PIVOT_TEAM' || ancestors.some(a => /Function/.test(a.type))) return;
      if (initializer) throw Error('PIVOT_TEAM duplicado');
      initializer = node.init;
      code = match[2];
    }
  });
}
if (!initializer || crypto.createHash('sha256').update(code.slice(initializer.start, initializer.end)).digest('hex') !== structureHash) throw Error('Estrutura de origem divergente');
const paths = [];
function collect(node, path) {
  if (node.type === 'ObjectExpression') {
    for (const property of node.properties) {
      if (property.type !== 'Property' || property.computed) throw Error('Propriedade não literal');
      collect(property.value, [...path, property.key.name ?? property.key.value]);
    }
  } else if (node.type === 'ArrayExpression') {
    node.elements.forEach((child, index) => collect(child, [...path, index]));
  } else if (node.type === 'Literal' && typeof node.value === 'string') {
    if (['role', 'moodText', 'background', 'pivotView', 'forcedView', 'note'].includes(path.at(-1)) || ['expertise', 'concerns'].includes(path[1])) paths.push({path, source: node.value});
  }
}
collect(initializer, []);
const targets = JSON.parse(fs.readFileSync('locales/pivot-team-targets.pt-BR.json', 'utf8'));
const roles = ['research', 'product', 'sales', 'investor'];
if (JSON.stringify(Object.keys(targets)) !== JSON.stringify(roles)) throw Error('Cobertura de perfis divergente');
const strings = {};
for (const role of roles) {
  const selected = paths.filter(item => item.path[0] === role);
  if (!Array.isArray(targets[role]) || selected.length !== targets[role].length) throw Error('Cobertura de campos divergente: ' + role);
  selected.forEach(({path, source}, index) => {
    const target = targets[role][index];
    if (typeof target !== 'string' || !target.trim() || target === source) throw Error('Texto inválido: ' + JSON.stringify(path));
    strings[JSON.stringify(path)] = {source, target};
  });
}
if (paths.length !== 75) throw Error('Total de campos divergente');
const file = 'locales/structures.pt-BR.json';
const catalogue = JSON.parse(fs.readFileSync(file, 'utf8'));
catalogue.PIVOT_TEAM = {
  classification: '75 textos de apresentação da equipe legada de pivôs traduzidos; nomes, referências factuais, números, SVGs, cores, emojis, chaves e apoio booleano preservados. Tradução não aprova adaptação funcional de pivôs ou financiamento brasileiro.',
  sourceSha256: structureHash,
  strings
};
translate(html, {PIVOT_TEAM: catalogue.PIVOT_TEAM});
fs.writeFileSync(file, JSON.stringify(catalogue, null, 2) + '\n');
console.log('PIVOT_TEAM: ' + paths.length + ' caminhos');
