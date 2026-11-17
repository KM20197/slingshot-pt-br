const fs = require('node:fs');
const crypto = require('node:crypto');
const acorn = require('acorn');
const walk = require('acorn-walk');
const vm = require('node:vm');
const {translate} = require('./structured-translation.cjs');

const originalHash = 'a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61';
const structureHash = '13f1fee373cfa8736284d8d9558af55e4a9e1da5b17e4048053f6a21cbd5d013';
const html = fs.readFileSync('source/index.original.html', 'utf8');
if (crypto.createHash('sha256').update(html).digest('hex') !== originalHash) throw Error('Fonte original divergente');
let literal;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
  if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
  const code = match[2];
  walk.ancestor(acorn.parse(code, {ecmaVersion: 'latest'}), {
    VariableDeclarator(node, ancestors) {
      if (node.id?.name !== 'VENTURE_MARKETS' || ancestors.some(ancestor => /Function/.test(ancestor.type))) return;
      if (literal) throw Error('VENTURE_MARKETS duplicado');
      literal = code.slice(node.init.start, node.init.end);
    }
  });
}
if (!literal || crypto.createHash('sha256').update(literal).digest('hex') !== structureHash) throw Error('Estrutura de origem divergente');
const markets = vm.runInNewContext('(' + literal + ')');
const targets = JSON.parse(fs.readFileSync('locales/venture-markets-current-targets.pt-BR.json', 'utf8'));
const ids = Object.keys(markets);
if (JSON.stringify(Object.keys(targets)) !== JSON.stringify(ids)) throw Error('Cobertura de mercados divergente');
const strings = {};
for (const id of ids) {
  for (const field of ['name', 'description']) {
    const source = markets[id]?.current?.[field];
    const target = targets[id]?.[field];
    if (typeof source !== 'string' || typeof target !== 'string' || target !== target.trim() || !target || target === source) throw Error('Texto inválido: ' + id + '/' + field);
    strings[JSON.stringify([id, 'current', field])] = {source, target};
  }
}
if (Object.keys(strings).length !== 24) throw Error('Total de caminhos divergente');
const file = 'locales/structures.pt-BR.json';
const catalogue = JSON.parse(fs.readFileSync(file, 'utf8'));
const previous = catalogue.VENTURE_MARKETS;
if (!previous || previous.status !== 'partial-translation' || previous.sourceSha256 !== structureHash) throw Error('Recorte atual ausente');
const retained = Object.fromEntries(Object.entries(catalogue.VENTURE_MARKETS?.strings || {}).filter(([key]) => !Object.hasOwn(strings, key)));
const merged = {...strings, ...retained};
catalogue.VENTURE_MARKETS = {
  classification: previous.classification,
  status: 'partial-translation',
  sourceSha256: structureHash,
  strings: merged
};
translate(html, {VENTURE_MARKETS: catalogue.VENTURE_MARKETS});
fs.writeFileSync(file, JSON.stringify(catalogue, null, 2) + '\n');
console.log('VENTURE_MARKETS/current: ' + Object.keys(strings).length + ' caminhos');
