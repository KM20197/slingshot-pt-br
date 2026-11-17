const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('cortexCVC advice covers 23 translated paths', () => {
  const targets = JSON.parse(fs.readFileSync('locales/advice-cortex-targets.pt-BR.json', 'utf8')).cortexCVC;
  const strings = JSON.parse(fs.readFileSync('locales/structures.pt-BR.json', 'utf8')).FUNDER_ADVICE.strings;
  const entries = Object.entries(strings).filter(([path]) => path.startsWith('["cortexCVC",'));
  const html = fs.readFileSync('index.html', 'utf8');

  assert.equal(targets.length, 23);
  assert.equal(entries.length, 23);
  for (const target of targets) assert.ok(html.includes(target), target);
});
