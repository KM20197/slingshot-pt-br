const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const acorn = require('acorn');
const walk = require('acorn-walk');

const cataloguePath = 'locales/structures.pt-BR.json';
const targetsPath = 'locales/venture-markets-current-targets.pt-BR.json';
const generatorPath = 'tools/catalogue-venture-markets-current.cjs';
const plain = value => JSON.parse(JSON.stringify(value));
function extract(file) {
  let literal, data;
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
    const code = match[2];
    walk.ancestor(acorn.parse(code, {ecmaVersion: 'latest'}), {VariableDeclarator(node, ancestors) {
      if (node.id?.name !== 'VENTURE_MARKETS' || ancestors.some(ancestor => /Function/.test(ancestor.type))) return;
      assert.equal(literal, undefined);
      literal = code.slice(node.init.start, node.init.end);
      data = plain(vm.runInNewContext('(' + literal + ')', {}, {timeout: 1000}));
    }});
  }
  assert.ok(literal);
  return {literal, data};
}
const before = extract('source/index.original.html');
const after = extract('index.html');
test('current market labels cover 24 approved paths and preserve the whole technical market catalogue', () => {
  const entry = JSON.parse(fs.readFileSync(cataloguePath, 'utf8')).VENTURE_MARKETS;
  const targets = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));
  const ids = Object.keys(before.data), expected = ids.flatMap(id => ['name', 'description'].map(field => JSON.stringify([id, 'current', field])));
  assert.equal(entry.status, 'partial-translation');
  assert.equal(entry.sourceSha256, crypto.createHash('sha256').update(before.literal).digest('hex'));
  assert.deepEqual(Object.keys(entry.strings).slice(0, expected.length), expected);
  assert.deepEqual(Object.keys(targets), ids);
  const restored = plain(after.data);
  for (const key of expected) {
    const [id, group, field] = JSON.parse(key), item = entry.strings[key];
    assert.equal(item.source, before.data[id][group][field]);
    assert.equal(item.target, targets[id][field]);
    assert.equal(restored[id][group][field], item.target);
    assert.ok(item.target.trim());
    restored[id][group][field] = item.source;
  }
  for (const [key, item] of Object.entries(entry.strings).slice(expected.length)) {
    const [id, group, index, field, nestedField, finalField] = JSON.parse(key);
    if (group === 'current') {
      if (index === 'customerInsights') restored[id].current.customerInsights[field][nestedField] = item.source;
      else {
        assert.equal(index, 'levels');
        restored[id].current.levels[field][nestedField] = item.source;
      }
    } else if (field === 'levels') restored[id].alternatives[index].levels[nestedField][finalField] = item.source;
    else restored[id].alternatives[index][field] = item.source;
  }
  assert.deepEqual(restored, before.data);
});
function fixture() {
  fs.mkdirSync('artifacts', {recursive: true});
  const dir = fs.mkdtempSync(path.resolve('artifacts/venture-markets-current-generator-'));
  for (const folder of ['tools', 'source', 'locales']) fs.mkdirSync(path.join(dir, folder));
  for (const file of [generatorPath, 'tools/structured-translation.cjs', cataloguePath, targetsPath, 'source/index.original.html']) fs.copyFileSync(file, path.join(dir, file));
  return {dir, run: () => spawnSync(process.execPath, [generatorPath], {cwd: dir, encoding: 'utf8', timeout: 120000})};
}
test('current market generator is idempotent and rejects malformed targets before writing', () => {
  const {dir, run} = fixture(), catalogueFile = path.join(dir, cataloguePath);
  const first = run();
  assert.equal(first.status, 0, first.stderr);
  const bytes = fs.readFileSync(catalogueFile);
  assert.equal(run().status, 0);
  assert.deepEqual(fs.readFileSync(catalogueFile), bytes);
  const targets = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));
  for (const mutate of [x => { delete x.voed.name; }, x => { x.edu.description = ' '; }, x => { x.extra = {}; }]) {
    const invalid = plain(targets);
    mutate(invalid);
    fs.writeFileSync(path.join(dir, targetsPath), JSON.stringify(invalid));
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Cobertura|Texto inválido/);
    assert.deepEqual(fs.readFileSync(catalogueFile), bytes);
  }
  fs.writeFileSync(path.join(dir, targetsPath), JSON.stringify(targets));
  fs.writeFileSync(path.join(dir, 'source/index.original.html'), fs.readFileSync('source/index.original.html', 'utf8').replace('Households & Grocery', 'Changed market'));
  const stale = run();
  assert.notEqual(stale.status, 0);
  assert.match(stale.stderr, /Fonte original divergente/);
  assert.deepEqual(fs.readFileSync(catalogueFile), bytes);
});
