const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const acorn = require('acorn');
const walk = require('acorn-walk');
const plain = value => JSON.parse(JSON.stringify(value));
function extract(file) {
  const result = {methods: {}};
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
    const code = match[2];
    walk.ancestor(acorn.parse(code, {ecmaVersion: 'latest'}), {
      VariableDeclarator(node, ancestors) {
        if (node.id.name !== 'FUNDER_ADVICE' || ancestors.some(a => /Function/.test(a.type))) return;
        assert.equal(result.data, undefined);
        result.data = plain(vm.runInNewContext('(' + code.slice(node.init.start, node.init.end) + ')', {}, {timeout: 1000}));
      },
      MethodDefinition(node, ancestors) {
        if (!['pickFunderChoice', 'generateAllFunderAdvice', 'generateContextualAdvice'].includes(node.key.name) || !ancestors.some(a => a.type === 'ClassDeclaration' && a.id?.name === 'Game')) return;
        result.methods[node.key.name] = 'function(' + node.value.params.map(p => code.slice(p.start, p.end)).join(',') + ')' + code.slice(node.value.body.start, node.value.body.end);
      }
    });
  }
  assert.ok(result.data);
  assert.equal(Object.keys(result.methods).length, 3);
  return result;
}
const before = extract('source/index.original.html'), after = extract('index.html');
const strings = JSON.parse(fs.readFileSync('locales/structures.pt-BR.json', 'utf8')).FUNDER_ADVICE.strings;
test('complete advice catalogue covers exactly 861 allowed paths in 41 profiles with null self and unchanged technical data', () => {
  const expected = [];
  for (const [id, profile] of Object.entries(before.data)) {
    if (profile === null) continue;
    for (const [domain, rows] of Object.entries(profile.advice)) rows.forEach((row, index) => {
      for (const field of ['text', 'reason']) expected.push(JSON.stringify([id, 'advice', domain, index, field]));
    });
    for (const field of ['followedReaction', 'ignoredReaction', 'hostileWarning']) expected.push(JSON.stringify([id, field]));
  }
  assert.equal(Object.values(before.data).filter(Boolean).length, 41);
  assert.equal(expected.length, 861);
  assert.deepEqual(Object.keys(strings).sort(), expected.slice().sort());
  for (const id of Object.keys(before.data)) {
    assert.deepEqual(Object.keys(strings).filter(key => JSON.parse(key)[0] === id), expected.filter(key => JSON.parse(key)[0] === id));
  }
  const restored = plain(after.data);
  for (const key of expected) {
    const parts = JSON.parse(key), entry = strings[key];
    let original = before.data, output = restored;
    for (const part of parts.slice(0, -1)) { original = original[part]; output = output[part]; }
    const leaf = parts.at(-1);
    assert.equal(entry.source, original[leaf]);
    assert.equal(entry.target, output[leaf]);
    assert.ok(entry.target.trim());
    assert.notEqual(entry.target, entry.source);
    output[leaf] = entry.source;
  }
  assert.deepEqual(restored, before.data);
  assert.equal(after.data.self, null);
  assert.deepEqual(after.methods, before.methods);
});
test('the final five advice target files correspond in source order to exact generated paths', () => {
  const profiles = {meilingKoh: ['meiling', 19], zaraHassan: ['zara', 23], jaylenBrooks: ['jaylenBrooks', 19], yusufDemir: ['yusufDemir', 17], eleanorWhitfield: ['eleanorWhitfield', 19]};
  for (const [id, [file, count]] of Object.entries(profiles)) {
    const targets = JSON.parse(fs.readFileSync('locales/advice-' + file + '-targets.pt-BR.json', 'utf8'))[id];
    const entries = Object.entries(strings).filter(([key]) => JSON.parse(key)[0] === id);
    assert.equal(entries.length, count);
    assert.equal(targets.length, count);
    assert.deepEqual(entries.map(([, item]) => item.target), targets);
  }
});
test('actual advice scoring preserves all 41 profiles in 1476 deterministic comparisons', () => {
  const choices = [
    [{eff: {mkt: 4, dev: -1}, cost: 30, ap: 3}, {eff: {sci: 3, dev: 3}, cost: 15, ap: 2}, {eff: {hr: 4}, cost: 0, ap: 1}],
    [{eff: {sci: -2, hr: -1}, cost: 40, ap: 4}, {eff: {mkt: 2, dev: 2, hr: 1}, cost: 10, ap: 1}],
    [{eff: {}, cost: 0, ap: 0}]
  ];
  let comparisons = 0;
  for (const random of [0.01, 0.5, 0.99]) {
    const math = Object.create(Math);
    math.random = () => random;
    const a = vm.runInNewContext('(' + before.methods.pickFunderChoice + ')', {Math: math});
    const b = vm.runInNewContext('(' + after.methods.pickFunderChoice + ')', {Math: math});
    for (const [id, profile] of Object.entries(before.data)) {
      if (!profile) continue;
      for (const domain of ['research', 'dev', 'marketing', 'hr']) for (const rows of choices) {
        assert.equal(b.call({funder: {id}}, after.data[id], rows, domain, id), a.call({funder: {id}}, profile, rows, domain, id));
        comparisons++;
      }
    }
  }
  assert.equal(comparisons, 1476);
});
