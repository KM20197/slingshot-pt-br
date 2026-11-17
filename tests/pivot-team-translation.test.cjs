const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const acorn = require('acorn');
const walk = require('acorn-walk');
const plain = value => JSON.parse(JSON.stringify(value));
const counts = {research: 18, product: 19, sales: 19, investor: 19};
const cataloguePath = 'locales/structures.pt-BR.json';
const targetsPath = 'locales/pivot-team-targets.pt-BR.json';
const generatorPath = 'tools/catalogue-pivot-team.cjs';

function extract(file) {
  const result = {methods: {}};
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
    const code = match[2];
    walk.ancestor(acorn.parse(code, {ecmaVersion: 'latest'}), {
      VariableDeclarator(node, ancestors) {
        if (node.id.name !== 'PIVOT_TEAM' || ancestors.some(a => /Function/.test(a.type))) return;
        assert.equal(result.data, undefined);
        result.literal = code.slice(node.init.start, node.init.end);
        result.data = plain(vm.runInNewContext('(' + result.literal + ')', {}, {timeout: 1000}));
      },
      MethodDefinition(node, ancestors) {
        if (!['showPivotTeamDetail', 'showTeamMemberDetail'].includes(node.key.name) || !ancestors.some(a => a.type === 'ClassDeclaration' && a.id?.name === 'Game')) return;
        result.methods[node.key.name] = 'function(' + node.value.params.map(p => code.slice(p.start, p.end)).join(',') + ')' + code.slice(node.value.body.start, node.value.body.end);
      }
    });
  }
  assert.ok(result.data);
  assert.equal(Object.keys(result.methods).length, 2);
  return result;
}
const before = extract('source/index.original.html');
const after = extract('index.html');
const entry = JSON.parse(fs.readFileSync(cataloguePath, 'utf8')).PIVOT_TEAM;
const targets = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));
function allowedPaths(data, prefix = [], result = []) {
  for (const [key, value] of Object.entries(data)) {
    const parts = [...prefix, Array.isArray(data) ? Number(key) : key];
    if (typeof value === 'string' && (['role', 'moodText', 'background', 'pivotView', 'forcedView', 'note'].includes(key) || ['expertise', 'concerns'].includes(parts[1]))) result.push(JSON.stringify(parts));
    else if (value && typeof value === 'object') allowedPaths(value, parts, result);
  }
  return result;
}

test('PIVOT_TEAM covers exactly 75 source-ordered text paths and restores every technical field', () => {
  const expected = allowedPaths(before.data);
  assert.equal(expected.length, 75);
  assert.equal(entry.sourceSha256, crypto.createHash('sha256').update(before.literal).digest('hex'));
  assert.deepEqual(Object.keys(entry.strings), expected);
  assert.deepEqual(Object.keys(targets), Object.keys(counts));
  const restored = plain(after.data);
  for (const [role, count] of Object.entries(counts)) {
    const keys = expected.filter(key => JSON.parse(key)[0] === role);
    assert.equal(keys.length, count);
    assert.equal(targets[role].length, count);
    keys.forEach((key, index) => {
      const parts = JSON.parse(key), item = entry.strings[key];
      let source = before.data, output = restored;
      for (const part of parts.slice(0, -1)) { source = source[part]; output = output[part]; }
      const leaf = parts.at(-1);
      assert.equal(item.source, source[leaf]);
      assert.equal(item.target, targets[role][index]);
      assert.equal(output[leaf], item.target);
      assert.ok(item.target.trim());
      assert.notEqual(item.target, item.source);
      assert.deepEqual(item.target.match(/\d+(?:\+|x|M)?/g), item.source.match(/\d+(?:\+|x|M)?/g));
      for (const acronym of item.source.match(/\b(?:PhD|PM|IP|MBA|PPE|SaaS|ARR)\b/g) || []) assert.ok(item.target.includes(acronym));
      output[leaf] = item.source;
    });
  }
  assert.deepEqual(restored, before.data);
  assert.deepEqual(after.methods, before.methods);
});

function render(data, method, game, role) {
  const nodes = new Map();
  const get = id => {
    if (!nodes.has(id)) {
      const classes = new Set();
      nodes.set(id, {innerHTML: '', textContent: '', className: '', classes,
        classList: {add: value => classes.add(value), remove: value => classes.delete(value)}});
    }
    return nodes.get(id);
  };
  vm.runInNewContext('(' + method + ')', {PIVOT_TEAM: data, document: {getElementById: get}, soundManager: {playTeamFocus() {}}}).call(game, role);
  return plain(Object.fromEntries([...nodes].map(([id, node]) => [id, {innerHTML: node.innerHTML, textContent: node.textContent, className: node.className, classes: [...node.classes]}])));
}
function restoreText(value) {
  const entries = Object.values(entry.strings).sort((a, b) => b.target.length - a.target.length);
  if (typeof value === 'string') return entries.reduce((text, item) => text.replaceAll(item.target, item.source), value);
  if (Array.isArray(value)) return value.map(restoreText);
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, restoreText(item)]));
}
test('real pivot-team renderers retain roles, advice selection, support status and DOM classes in 58 cases', () => {
  let cases = 0;
  for (const mode of ['strategic', 'forced']) {
    const game = {pivotState: {mode}};
    assert.deepEqual(restoreText(render(after.data, after.methods.showPivotTeamDetail, game)), render(before.data, before.methods.showPivotTeamDetail, game));
    cases++;
    for (const role of Object.keys(counts)) for (const id of ['customer', 'problem', 'tech', 'pivot', 'compete', 'niche', null]) {
      const state = {pivotState: {mode, currentPivotData: id ? {id, name: 'Fixed pivot name'} : null}};
      assert.deepEqual(restoreText(render(after.data, after.methods.showTeamMemberDetail, state, role)), render(before.data, before.methods.showTeamMemberDetail, state, role));
      cases++;
    }
  }
  assert.equal(cases, 58);
});

function fixture() {
  fs.mkdirSync('artifacts', {recursive: true});
  const dir = fs.mkdtempSync(path.resolve('artifacts/pivot-team-generator-'));
  for (const folder of ['tools', 'source', 'locales']) fs.mkdirSync(path.join(dir, folder));
  for (const file of [generatorPath, 'tools/structured-translation.cjs', cataloguePath, targetsPath, 'source/index.original.html']) fs.copyFileSync(file, path.join(dir, file));
  return {dir, run: () => spawnSync(process.execPath, [generatorPath], {cwd: dir, encoding: 'utf8', timeout: 30000})};
}
test('pivot-team generator preserves every other catalogue entry and is byte-idempotent', () => {
  const {dir, run} = fixture(), input = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
  input.PIVOT_TEAM.strings = {};
  const file = path.join(dir, cataloguePath);
  fs.writeFileSync(file, JSON.stringify(input));
  const first = run();
  assert.equal(first.status, 0, first.stderr);
  const bytes = fs.readFileSync(file), output = JSON.parse(bytes);
  delete output.PIVOT_TEAM;
  delete input.PIVOT_TEAM;
  assert.deepEqual(output, input);
  assert.equal(run().status, 0);
  assert.deepEqual(fs.readFileSync(file), bytes);
});
test('pivot-team generator rejects missing, extra, blank, non-string targets and changed source before writing', () => {
  const {dir, run} = fixture(), file = path.join(dir, cataloguePath), bytes = fs.readFileSync(file);
  for (const change of [x => x.research.pop(), x => x.sales.push('Extra'), x => { x.product[0] = ' '; }, x => { x.investor[0] = 1; }, x => { x.extra = []; }]) {
    const bad = plain(targets);
    change(bad);
    fs.writeFileSync(path.join(dir, targetsPath), JSON.stringify(bad));
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Cobertura|Texto inválido/);
    assert.deepEqual(fs.readFileSync(file), bytes);
  }
  fs.writeFileSync(path.join(dir, targetsPath), JSON.stringify(targets));
  fs.writeFileSync(path.join(dir, 'source/index.original.html'), fs.readFileSync('source/index.original.html', 'utf8').replace('Research Lead', 'Changed Lead'));
  const changed = run();
  assert.notEqual(changed.status, 0);
  assert.match(changed.stderr, /Fonte original divergente/);
  assert.deepEqual(fs.readFileSync(file), bytes);
});
