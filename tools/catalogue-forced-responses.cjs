const fs = require('node:fs');
const crypto = require('node:crypto');
const acorn = require('acorn');
const walk = require('acorn-walk');
const vm = require('node:vm');
const {translate} = require('./structured-translation.cjs');

const originalHash = 'a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61';
const structureHash = '576ecaafafbdb5292162938b336cd2705a867863f7cdc99d9991aedf8132fc44';
const html = fs.readFileSync('source/index.original.html', 'utf8');
if (crypto.createHash('sha256').update(html).digest('hex') !== originalHash) throw Error('Fonte original divergente');
let literal;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
  if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
  const code = match[2];
  walk.ancestor(acorn.parse(code, {ecmaVersion: 'latest'}), {VariableDeclarator(node, ancestors) {
    if (node.id.name !== 'FORCED_RESPONSES' || ancestors.some(ancestor => /Function/.test(ancestor.type))) return;
    if (literal) throw Error('FORCED_RESPONSES duplicado');
    literal = code.slice(node.init.start, node.init.end);
  }});
}
if (!literal || crypto.createHash('sha256').update(literal).digest('hex') !== structureHash) throw Error('Estrutura de origem divergente');
const source = vm.runInNewContext('(' + literal + ')');
const targets = JSON.parse(fs.readFileSync('locales/forced-responses-targets.pt-BR.json', 'utf8'));
if (!Array.isArray(targets) || targets.length !== source.length) throw Error('Cobertura divergente');
const fields = [['name'], ['subtitle'], ['description'], ['preserves'], ['costs'], ['timeImpact'], ['bestWhen'], ['teamQuotes', 'research'], ['teamQuotes', 'product'], ['teamQuotes', 'sales'], ['teamQuotes', 'investor']];
const strings = {};
for (const [index, item] of source.entries()) for (const field of fields) {
  const values = Array.isArray(item[field[0]]) && field.length === 1 ? item[field[0]].map((value, itemIndex) => [[field[0], itemIndex], value]) : [[field, field.reduce((value, segment) => value?.[segment], item)]];
  for (const [path, sourceText] of values) {
    const fullPath = [index, ...path], target = fullPath.slice(1).reduce((value, segment) => value?.[segment], targets[index]);
    if (typeof sourceText !== 'string' || typeof target !== 'string' || !target.trim() || target === sourceText) throw Error('Texto inválido: ' + JSON.stringify(fullPath));
    strings[JSON.stringify(fullPath)] = {source: sourceText, target};
  }
}
if (Object.keys(strings).length !== 47) throw Error('Total divergente');
const file = 'locales/structures.pt-BR.json', catalogue = JSON.parse(fs.readFileSync(file, 'utf8'));
catalogue.FORCED_RESPONSES = {
  classification: '47 textos de apresentação das três respostas forçadas traduzidos. IDs, ícones, cores, suporte da equipe, marcos, números, efeitos, regras e consumidores legados foram preservados; a tradução não aprova adaptação funcional de pivôs ou concorrência.',
  status: 'translated-presentation', sourceSha256: structureHash, strings
};
translate(html, {FORCED_RESPONSES: catalogue.FORCED_RESPONSES});
fs.writeFileSync(file, JSON.stringify(catalogue, null, 2) + '\n');
console.log('FORCED_RESPONSES: ' + Object.keys(strings).length + ' caminhos');
