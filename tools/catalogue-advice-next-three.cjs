const fs = require('node:fs');
const crypto = require('node:crypto');
const acorn = require('acorn');
const walk = require('acorn-walk');
const {translate} = require('./structured-translation.cjs');

const counts = {marcusWebb: 21, michaelOkonkwo: 21, annaLindqvist: 19};
const ids = Object.keys(counts);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const html = fs.readFileSync('source/index.original.html', 'utf8');
if (hash(html) !== 'a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61') {
  throw Error('Fonte original divergente.');
}

function read(node) {
  if (node.type === 'Literal') return node.value;
  if (node.type === 'TemplateLiteral' && !node.expressions.length) return node.quasis[0].value.cooked;
  if (node.type === 'UnaryExpression' && node.operator === '-' && node.argument.type === 'Literal' && typeof node.argument.value === 'number') return -node.argument.value;
  if (node.type === 'ArrayExpression') return node.elements.map(read);
  if (node.type === 'ObjectExpression') return Object.fromEntries(node.properties.map(property => {
    if (property.type !== 'Property' || property.computed) throw Error('Propriedade não literal.');
    return [property.key.name ?? property.key.value, read(property.value)];
  }));
  throw Error('Dado não literal: ' + node.type);
}

let advice;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
  if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
  walk.simple(acorn.parse(match[2], {ecmaVersion: 'latest'}), {
    VariableDeclarator(node) {
      if (node.id.name !== 'FUNDER_ADVICE') return;
      if (advice) throw Error('Estrutura duplicada: FUNDER_ADVICE');
      advice = read(node.init);
    }
  });
}
if (!advice || hash(JSON.stringify(advice)) !== '02cb400289da66bc466aa0b48dc6b7292e234d91e8c20c47bc3ff5d8629db1a2') {
  throw Error('Fonte divergente: FUNDER_ADVICE');
}

const targets = JSON.parse(fs.readFileSync('locales/advice-next-three-targets.pt-BR.json', 'utf8'));
if (JSON.stringify(Object.keys(targets).sort()) !== JSON.stringify([...ids].sort())) {
  throw Error('Cobertura de perfis divergente.');
}
const file = 'locales/structures.pt-BR.json';
const catalogue = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!catalogue.FUNDER_ADVICE?.strings) throw Error('Catálogo anterior de FUNDER_ADVICE ausente.');
const strings = {...catalogue.FUNDER_ADVICE.strings};
for (const id of ids) {
  const paths = [];
  for (const [domain, rows] of Object.entries(advice[id].advice)) {
    rows.forEach((row, index) => {
      for (const field of ['text', 'reason']) paths.push({path: [id, 'advice', domain, index, field], source: row[field]});
    });
  }
  for (const field of ['followedReaction', 'ignoredReaction', 'hostileWarning']) {
    paths.push({path: [id, field], source: advice[id][field]});
  }
  if (paths.length !== counts[id] || !Array.isArray(targets[id]) || targets[id].length !== paths.length) {
    throw Error('Cobertura de campos divergente: ' + id);
  }
  paths.forEach(({path, source}, index) => {
    const target = targets[id][index];
    if (typeof target !== 'string' || !target.trim()) throw Error('Texto inválido: ' + id);
    strings[JSON.stringify(path)] = {source, target};
  });
}

// Preserve every existing entry and order the resulting paths as in the original.
const ordered = {};
function visit(value, path = []) {
  if (typeof value === 'string') {
    const key = JSON.stringify(path);
    if (Object.hasOwn(strings, key)) ordered[key] = strings[key];
  } else if (Array.isArray(value)) value.forEach((item, index) => visit(item, [...path, index]));
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) visit(item, [...path, key]);
  }
}
visit(advice);
if (Object.keys(ordered).length !== Object.keys(strings).length) throw Error('Caminho excedente.');
catalogue.FUNDER_ADVICE = {...catalogue.FUNDER_ADVICE, strings: ordered};
translate(html, {FUNDER_ADVICE: catalogue.FUNDER_ADVICE});
fs.writeFileSync(file, JSON.stringify(catalogue, null, 2) + '\n');
console.log('FUNDER_ADVICE (marcusWebb/michaelOkonkwo/annaLindqvist): 61 campos do lote; ' + Object.keys(ordered).length + ' acumulados.');
