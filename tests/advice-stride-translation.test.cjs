const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('strideVC advice covers 19 translated paths', () => {
  const targets = JSON.parse(fs.readFileSync('locales/advice-stride-targets.pt-BR.json', 'utf8')).strideVC;
  const strings = JSON.parse(fs.readFileSync('locales/structures.pt-BR.json', 'utf8')).FUNDER_ADVICE.strings;
  const entries = Object.entries(strings).filter(([path]) => path.startsWith('["strideVC",'));
  const html = fs.readFileSync('index.html', 'utf8');

  assert.equal(targets.length, 19);
  assert.equal(entries.length, 19);
  for (const target of targets) assert.ok(html.includes(target), target);
});
