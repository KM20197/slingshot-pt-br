const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const acorn = require('acorn');
const walk = require('acorn-walk');

const counts = {marcusWebb: 21, michaelOkonkwo: 21, annaLindqvist: 19};
const ids = Object.keys(counts);
const plain = value => JSON.parse(JSON.stringify(value));
const cataloguePath = 'locales/structures.pt-BR.json';
const targetsPath = 'locales/advice-next-three-targets.pt-BR.json';
const generatorPath = 'tools/catalogue-advice-next-three.cjs';
const original = fs.readFileSync('source/index.original.html', 'utf8');

function extract(file) {
  const data = {}, methods = {};
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
    const code = match[2];
    walk.simple(acorn.parse(code, {ecmaVersion: 'latest'}), {
      VariableDeclarator(node) {
        if (['FUNDER_ADVICE', 'M2_FUNDER_OPTIONS', 'M3_FUNDER_OPTIONS'].includes(node.id.name)) {
          data[node.id.name] = plain(vm.runInNewContext('(' + code.slice(node.init.start, node.init.end) + ')', {}, {timeout: 1000}));
        }
      },
      MethodDefinition(node) {
        if (['pickFunderChoice', 'generateAllFunderAdvice', 'generateContextualAdvice'].includes(node.key.name)) {
          methods[node.key.name] = 'function(' + node.value.params.map(p => code.slice(p.start, p.end)).join(',') + ')' + code.slice(node.value.body.start, node.value.body.end);
        }
      }
    });
  }
  return {data, methods};
}

const before = extract('source/index.original.html');
const after = extract('index.html');

test('next three advice profiles cover exactly 61 paths and preserve technical data, emojis and original methods', () => {
  const catalogue = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
  const expected = [];
  for (const id of ids) {
    const start = expected.length;
    for (const [domain, rows] of Object.entries(before.data.FUNDER_ADVICE[id].advice)) {
      rows.forEach((_, index) => {
        for (const field of ['text', 'reason']) expected.push(JSON.stringify([id, 'advice', domain, index, field]));
      });
    }
    for (const field of ['followedReaction', 'ignoredReaction', 'hostileWarning']) expected.push(JSON.stringify([id, field]));
    assert.equal(expected.length - start, counts[id]);
    for (const field of ['followedReaction', 'ignoredReaction']) {
      assert.equal(after.data.FUNDER_ADVICE[id][field].split(' ').at(-1), before.data.FUNDER_ADVICE[id][field].split(' ').at(-1));
    }
  }
  assert.equal(expected.length, 61);
  const selected = Object.keys(catalogue.FUNDER_ADVICE.strings).filter(key => ids.includes(JSON.parse(key)[0]));
  assert.deepEqual(selected, expected);
  const restored = plain(after.data.FUNDER_ADVICE);
  for (const [key, {source, target}] of Object.entries(catalogue.FUNDER_ADVICE.strings)) {
    const parts = JSON.parse(key);
    let a = before.data.FUNDER_ADVICE, b = restored;
    for (const part of parts.slice(0, -1)) { a = a[part]; b = b[part]; }
    const leaf = parts.at(-1);
    assert.equal(source, a[leaf]);
    assert.equal(target, b[leaf]);
    assert.ok(target.trim());
    if (ids.includes(parts[0])) {
      assert.notEqual(target, source);
      for (const acronym of source.match(/\b(?:CTOs|CFOs|B2B|ESG|IP)\b/g) || []) assert.ok(target.includes(acronym));
    }
    b[leaf] = source;
  }
  assert.deepEqual(restored, before.data.FUNDER_ADVICE);
  assert.equal(after.data.FUNDER_ADVICE.self, null);
  for (const name of ['M2_FUNDER_OPTIONS', 'M3_FUNDER_OPTIONS']) {
    assert.deepEqual(catalogue[name].strings, {});
    assert.deepEqual(after.data[name], before.data[name]);
  }
  assert.equal(Object.keys(before.methods).length, 3);
  assert.deepEqual(after.methods, before.methods);
});

test('actual choice scoring preserves recommendations for the three investors in 108 deterministic comparisons', () => {
  const sets = [
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
    for (const id of ids) for (const domain of ['research', 'dev', 'marketing', 'hr']) for (const choices of sets) {
      const context = {funder: {id}};
      assert.equal(b.call(context, after.data.FUNDER_ADVICE[id], choices, domain, id), a.call(context, before.data.FUNDER_ADVICE[id], choices, domain, id));
      comparisons++;
    }
  }
  assert.equal(comparisons, 108);
});

function fixture() {
  fs.mkdirSync('artifacts', {recursive: true});
  const dir = fs.mkdtempSync(path.resolve('artifacts/advice-next-three-generator-'));
  for (const folder of ['tools', 'source', 'locales']) fs.mkdirSync(path.join(dir, folder));
  for (const file of [generatorPath, 'tools/structured-translation.cjs', cataloguePath, targetsPath, 'source/index.original.html']) {
    fs.copyFileSync(file, path.join(dir, file));
  }
  return {
    dir,
    run: () => spawnSync(process.execPath, [generatorPath], {cwd: dir, encoding: 'utf8', timeout: 30000})
  };
}

test('generator adds only the selected profiles, preserves previous entries and is byte-idempotent', () => {
  const {dir, run} = fixture();
  const input = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
  for (const key of Object.keys(input.FUNDER_ADVICE.strings)) {
    if (ids.includes(JSON.parse(key)[0])) delete input.FUNDER_ADVICE.strings[key];
  }
  const file = path.join(dir, cataloguePath);
  fs.writeFileSync(file, JSON.stringify(input));
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  const generated = fs.readFileSync(file);
  const output = JSON.parse(generated);
  assert.equal(Object.keys(output.FUNDER_ADVICE.strings).length - Object.keys(input.FUNDER_ADVICE.strings).length, 61);
  for (const key of Object.keys(output.FUNDER_ADVICE.strings)) {
    if (ids.includes(JSON.parse(key)[0])) delete output.FUNDER_ADVICE.strings[key];
  }
  assert.deepEqual(output, input);
  const repeated = run();
  assert.equal(repeated.status, 0, repeated.stderr);
  assert.deepEqual(fs.readFileSync(file), generated);
});

test('generator rejects missing, extra and empty targets and changed source before writing the catalogue', () => {
  const {dir, run} = fixture();
  const catalogue = fs.readFileSync(path.join(dir, cataloguePath));
  const targets = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));
  const cases = [
    {change: value => value.marcusWebb.pop(), error: /Cobertura de campos divergente/},
    {change: value => value.annaLindqvist.push('Extra'), error: /Cobertura de campos divergente/},
    {change: value => { value.michaelOkonkwo[0] = ' '; }, error: /Texto inválido/},
    {change: value => { value.unexpected = []; }, error: /Cobertura de perfis divergente/}
  ];
  for (const {change, error} of cases) {
    const bad = plain(targets);
    change(bad);
    fs.writeFileSync(path.join(dir, targetsPath), JSON.stringify(bad));
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, error);
    assert.deepEqual(fs.readFileSync(path.join(dir, cataloguePath)), catalogue);
  }
  fs.writeFileSync(path.join(dir, targetsPath), JSON.stringify(targets));
  const changed = original.replace('50 angels, 50 networks.', '51 angels, 51 networks.');
  assert.notEqual(changed, original);
  fs.writeFileSync(path.join(dir, 'source/index.original.html'), changed);
  const result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Fonte original divergente/);
  assert.deepEqual(fs.readFileSync(path.join(dir, cataloguePath)), catalogue);
});
