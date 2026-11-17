const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), acorn = require('acorn'), walk = require('acorn-walk'), vm = require('node:vm'), {spawnSync} = require('node:child_process');
const hash = 'a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61';
const cataloguePath = 'locales/structures.pt-BR.json', targetsPath = 'locales/strategic-pivots-targets.pt-BR.json', generatorPath = 'tools/catalogue-strategic-pivots.cjs';
const plain = value => JSON.parse(JSON.stringify(value));
function extract(file) {
  const html = fs.readFileSync(file, 'utf8'); let literal;
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
    const code = match[2];
    walk.ancestor(acorn.parse(code, {ecmaVersion: 'latest'}), {VariableDeclarator(n, ancestors) {
      if (n.id.name !== 'STRATEGIC_PIVOTS' || ancestors.some(ancestor => /Function/.test(ancestor.type))) return;
      assert.equal(literal, undefined);
      literal = code.slice(n.init.start, n.init.end);
    }});
  }
  assert.ok(literal);
  return {literal, data: plain(vm.runInNewContext('(' + literal + ')'))};
}
test('strategic pivots cover 45 presentation paths and restore all technical data', () => {
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync('source/index.original.html', 'utf8')).digest('hex'), hash);
  const source = extract('source/index.original.html'), built = extract('index.html'), entry = JSON.parse(fs.readFileSync(cataloguePath, 'utf8')).STRATEGIC_PIVOTS;
  assert.equal(entry.status, 'translated-presentation'); assert.equal(Object.keys(entry.strings).length, 45);
  assert.equal(entry.sourceSha256, crypto.createHash('sha256').update(source.literal).digest('hex'));
  for (const [key, item] of Object.entries(entry.strings)) { const parts = JSON.parse(key); let current = built.data, original = source.data; for (let i = 0; i < parts.length - 1; i++) { current = current[parts[i]]; original = original[parts[i]]; } const leaf = parts.at(-1); assert.equal(item.source, original[leaf]); assert.equal(current[leaf], item.target); current[leaf] = item.source; }
  assert.deepEqual(built.data, source.data);
});

function fixture() {
  fs.mkdirSync('artifacts', {recursive: true});
  const dir = fs.mkdtempSync(path.resolve('artifacts/strategic-pivots-generator-'));
  for (const folder of ['tools', 'source', 'locales']) fs.mkdirSync(path.join(dir, folder));
  for (const file of [generatorPath, 'tools/structured-translation.cjs', cataloguePath, targetsPath, 'source/index.original.html']) fs.copyFileSync(file, path.join(dir, file));
  return {dir, run: () => spawnSync(process.execPath, [generatorPath], {cwd: dir, encoding: 'utf8', timeout: 60000})};
}

test('strategic-pivots generator is byte-idempotent and leaves all other catalogue entries intact', () => {
  const {dir, run} = fixture(), file = path.join(dir, cataloguePath), input = JSON.parse(fs.readFileSync(file, 'utf8'));
  input.STRATEGIC_PIVOTS.strings = {};
  fs.writeFileSync(file, JSON.stringify(input));
  const first = run();
  assert.equal(first.status, 0, first.stderr);
  const bytes = fs.readFileSync(file), output = JSON.parse(bytes);
  delete output.STRATEGIC_PIVOTS;
  delete input.STRATEGIC_PIVOTS;
  assert.deepEqual(output, input);
  assert.equal(run().status, 0);
  assert.deepEqual(fs.readFileSync(file), bytes);
});

test('strategic-pivots generator rejects missing, empty, extra and divergent inputs atomically', () => {
  const {dir, run} = fixture(), file = path.join(dir, cataloguePath), bytes = fs.readFileSync(file), targets = JSON.parse(fs.readFileSync(path.join(dir, targetsPath), 'utf8'));
  for (const mutate of [value => value.pop(), value => { value[1].description = ' '; }, value => value.push({}), value => { value[2].teamQuotes.sales = 1; }]) {
    const invalid = plain(targets);
    mutate(invalid);
    fs.writeFileSync(path.join(dir, targetsPath), JSON.stringify(invalid));
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Cobertura|Texto inválido/);
    assert.deepEqual(fs.readFileSync(file), bytes);
  }
  fs.writeFileSync(path.join(dir, targetsPath), JSON.stringify(targets));
  fs.writeFileSync(path.join(dir, 'source/index.original.html'), fs.readFileSync(path.join(dir, 'source/index.original.html'), 'utf8').replace('Customer Pivot', 'Changed Pivot'));
  const divergent = run();
  assert.notEqual(divergent.status, 0);
  assert.match(divergent.stderr, /Fonte original divergente/);
  assert.deepEqual(fs.readFileSync(file), bytes);
});
