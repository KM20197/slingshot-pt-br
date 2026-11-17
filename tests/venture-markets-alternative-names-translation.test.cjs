const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const acorn = require('acorn');
const walk = require('acorn-walk');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');

const originalHash = 'a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61';
function extractMarkets(file) {
  let literal;
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
    const code = match[2];
    walk.ancestor(acorn.parse(code, {ecmaVersion: 'latest'}), {VariableDeclarator(node, ancestors) {
      if (node.id?.name !== 'VENTURE_MARKETS' || ancestors.some(ancestor => /Function/.test(ancestor.type))) return;
      if (literal) throw Error('VENTURE_MARKETS duplicado');
      literal = code.slice(node.init.start, node.init.end);
    }});
  }
  if (!literal) throw Error('VENTURE_MARKETS ausente');
  return JSON.parse(JSON.stringify(vm.runInNewContext('(' + literal + ')')));
}
const originalHtml = fs.readFileSync('source/index.original.html', 'utf8');
assert.equal(crypto.createHash('sha256').update(originalHtml).digest('hex'), originalHash);
const source = extractMarkets('source/index.original.html');
const targets = JSON.parse(fs.readFileSync('locales/venture-markets-alternative-names-targets.pt-BR.json', 'utf8'));

test('alternative market names cover 36 source-ordered paths and restore the entire technical catalogue', () => {
  const catalogue = JSON.parse(fs.readFileSync('locales/structures.pt-BR.json', 'utf8')).VENTURE_MARKETS;
  assert.equal(catalogue.status, 'partial-translation');
  assert.equal(Object.keys(catalogue.strings).length, 662);
  const restored = structuredClone(source);
  for (const [marketId, market] of Object.entries(source)) {
    assert.deepEqual(Object.keys(targets[marketId]), Array.from(market.alternatives, item => item.id));
    for (const [index, alternative] of market.alternatives.entries()) {
      const key = JSON.stringify([marketId, 'alternatives', index, 'name']);
      assert.deepEqual(catalogue.strings[key], {source: alternative.name, target: targets[marketId][alternative.id]});
      restored[marketId].alternatives[index].name = catalogue.strings[key].source;
    }
  }
  for (const [key, item] of Object.entries(catalogue.strings)) {
    const path = JSON.parse(key);
    if (path[1] === 'current') {
      if (path[2] === 'levels') restored[path[0]].current.levels[path[3]][path[4]] = item.source;
      else if (path[2] === 'customerInsights') restored[path[0]].current.customerInsights[path[3]][path[4]] = item.source;
      else restored[path[0]].current[path[2]] = item.source;
    } else if (path[3] === 'levels') restored[path[0]].alternatives[path[2]].levels[path[4]][path[5]] = item.source;
    else restored[path[0]].alternatives[path[2]][path[3]] = item.source;
  }
  assert.deepEqual(restored, source);
  const built = extractMarkets('index.html');
  for (const [marketId, marketTargets] of Object.entries(targets)) for (const [alternativeId, target] of Object.entries(marketTargets)) {
    const index = source[marketId].alternatives.findIndex(item => item.id === alternativeId);
    assert.equal(built[marketId].alternatives[index].name, target);
  }
});

test('alternative-name generator is byte-idempotent', () => {
  execFileSync(process.execPath, ['tools/catalogue-venture-markets-alternative-names.cjs'], {stdio: 'pipe'});
  const before = fs.readFileSync('locales/structures.pt-BR.json');
  execFileSync(process.execPath, ['tools/catalogue-venture-markets-alternative-names.cjs'], {stdio: 'pipe'});
  assert.deepEqual(fs.readFileSync('locales/structures.pt-BR.json'), before);
});

test('alternative-name generator rejects malformed targets atomically', () => require('./venture-markets-generator-support.cjs').assertAtomic('tools/catalogue-venture-markets-alternative-names.cjs', 'locales/venture-markets-alternative-names-targets.pt-BR.json', 'venture-market-names', [
  value => { delete value.voed.retailInsights; }, value => { value.arene.broadcastFan = ' '; }, value => { value.extra = {}; }
]));
