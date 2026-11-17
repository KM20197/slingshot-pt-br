const fs = require('node:fs'), crypto = require('node:crypto'), acorn = require('acorn'), walk = require('acorn-walk'), vm = require('node:vm');
const {translate} = require('./structured-translation.cjs');
const sourceHash = 'a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61', structureHash = 'b83cbb4e4ae97e0e9307459c9444ccbc6c7041d70eb62b647f8a55ea5dc86d18';
const html = fs.readFileSync('source/index.original.html', 'utf8');
if (crypto.createHash('sha256').update(html).digest('hex') !== sourceHash) throw Error('Fonte original divergente');
let literal;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
  if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
  const code = match[2];
  walk.ancestor(acorn.parse(code, {ecmaVersion: 'latest'}), {
    VariableDeclarator(node, ancestors) {
      if (node.id.name !== 'STRATEGIC_PIVOTS' || ancestors.some(ancestor => /Function/.test(ancestor.type))) return;
      if (literal) throw Error('STRATEGIC_PIVOTS duplicado');
      literal = code.slice(node.init.start, node.init.end);
    }
  });
}
if (!literal || crypto.createHash('sha256').update(literal).digest('hex') !== structureHash) throw Error('Estrutura de origem divergente');
const source = vm.runInNewContext('(' + literal + ')'), targets = JSON.parse(fs.readFileSync('locales/strategic-pivots-targets.pt-BR.json', 'utf8'));
if (!Array.isArray(targets) || targets.length !== source.length) throw Error('Cobertura divergente');
const strings = {}, fields = [['name'], ['subtitle'], ['description'], ['preserves', 0], ['preserves', 1], ['preserves', 2], ['costs', 0], ['costs', 1], ['costs', 2], ['timeImpact'], ['bestWhen'], ['teamQuotes', 'research'], ['teamQuotes', 'product'], ['teamQuotes', 'sales'], ['teamQuotes', 'investor']];
for (const [i, item] of source.entries()) for (const path of fields) { let from = item, to = targets[i]; for (const segment of path) { from = from?.[segment]; to = to?.[segment]; } if (typeof from !== 'string' || typeof to !== 'string' || !to.trim() || to === from) throw Error('Texto inválido: ' + i + '/' + path.join('/')); strings[JSON.stringify([i, ...path])] = {source: from, target: to}; }
if (Object.keys(strings).length !== 45) throw Error('Total divergente');
const file = 'locales/structures.pt-BR.json', catalogue = JSON.parse(fs.readFileSync(file, 'utf8'));
catalogue.STRATEGIC_PIVOTS = {classification: 'Prosa de apresentação dos três pivôs estratégicos; IDs, ícones, cores, custos, tempo, suporte da equipe e demais regras foram preservados.', status: 'translated-presentation', sourceSha256: structureHash, strings};
translate(html, {STRATEGIC_PIVOTS: catalogue.STRATEGIC_PIVOTS});
fs.writeFileSync(file, JSON.stringify(catalogue, null, 2) + '\n');
console.log('STRATEGIC_PIVOTS: ' + Object.keys(strings).length + ' caminhos');
