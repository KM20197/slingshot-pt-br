const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const acorn = require('acorn');
const walk = require('acorn-walk');
const {spawnSync} = require('node:child_process');

const cataloguePath = 'locales/structures.pt-BR.json';
const targetsPath = 'locales/forced-responses-targets.pt-BR.json';
const generatorPath = 'tools/catalogue-forced-responses.cjs';
const sourceHash = 'a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61';
const plain = value => JSON.parse(JSON.stringify(value));
function extract(file) {
  let literal;
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
    const code = match[2];
    walk.ancestor(acorn.parse(code, {ecmaVersion: 'latest'}), {VariableDeclarator(node, ancestors) {
      if (node.id.name !== 'FORCED_RESPONSES' || ancestors.some(ancestor => /Function/.test(ancestor.type))) return;
      assert.equal(literal, undefined);
      literal = code.slice(node.init.start, node.init.end);
    }});
  }
  assert.ok(literal);
  return {literal, data: plain(vm.runInNewContext('(' + literal + ')'))};
}
test('forced responses cover 47 presentation paths and restore all technical data', () => {
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync('source/index.original.html', 'utf8')).digest('hex'), sourceHash);
  const source = extract('source/index.original.html'), built = extract('index.html');
  const entry = JSON.parse(fs.readFileSync(cataloguePath, 'utf8')).FORCED_RESPONSES;
  assert.equal(entry.status, 'translated-presentation');
  assert.equal(entry.sourceSha256, crypto.createHash('sha256').update(source.literal).digest('hex'));
  assert.equal(Object.keys(entry.strings).length, 47);
  for (const [key, item] of Object.entries(entry.strings)) {
    const parts = JSON.parse(key); let before = source.data, after = built.data;
    for (const part of parts.slice(0, -1)) { before = before[part]; after = after[part]; }
    const leaf = parts.at(-1);
    assert.equal(item.source, before[leaf]);
    assert.equal(after[leaf], item.target);
    after[leaf] = item.source;
  }
  assert.deepEqual(built.data, source.data);
});
function fixture() {
  fs.mkdirSync('artifacts', {recursive: true});
  const dir = fs.mkdtempSync(path.resolve('artifacts/forced-responses-generator-'));
  for (const folder of ['tools', 'source', 'locales']) fs.mkdirSync(path.join(dir, folder));
  for (const file of [generatorPath, 'tools/structured-translation.cjs', cataloguePath, targetsPath, 'source/index.original.html']) fs.copyFileSync(file, path.join(dir, file));
  return {dir, run: () => spawnSync(process.execPath, [generatorPath], {cwd: dir, encoding: 'utf8', timeout: 30000})};
}
test('forced-responses generator is byte-idempotent and rejects malformed targets atomically', () => {
  const {dir, run} = fixture(), catalogue = path.join(dir, cataloguePath), bytes = fs.readFileSync(catalogue);
  assert.equal(run().status, 0);
  const written = fs.readFileSync(catalogue);
  assert.equal(run().status, 0);
  assert.deepEqual(fs.readFileSync(catalogue), written);
  const targets = JSON.parse(fs.readFileSync(path.join(dir, targetsPath), 'utf8'));
  for (const mutate of [value => value.pop(), value => { value[0].name = ' '; }, value => value.push({}), value => { value[2].teamQuotes.sales = 1; }]) {
    const invalid = plain(targets); mutate(invalid);
    fs.writeFileSync(path.join(dir, targetsPath), JSON.stringify(invalid));
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Cobertura|Texto inválido/);
    assert.deepEqual(fs.readFileSync(catalogue), written);
  }
  fs.writeFileSync(path.join(dir, targetsPath), JSON.stringify(targets));
  fs.writeFileSync(path.join(dir, 'source/index.original.html'), fs.readFileSync(path.join(dir, 'source/index.original.html'), 'utf8').replace('Change Direction', 'Changed direction'));
  const divergent = run();
  assert.notEqual(divergent.status, 0);
  assert.match(divergent.stderr, /Fonte original divergente/);
  assert.deepEqual(fs.readFileSync(catalogue), written);
});
