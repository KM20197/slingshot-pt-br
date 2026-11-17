const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('redwoodVC advice covers 21 translated paths', () => {
  const targets = JSON.parse(fs.readFileSync('locales/advice-redwood-targets.pt-BR.json', 'utf8')).redwoodVC;
  const strings = JSON.parse(fs.readFileSync('locales/structures.pt-BR.json', 'utf8')).FUNDER_ADVICE.strings;
  const entries = Object.entries(strings).filter(([path]) => path.startsWith('["redwoodVC",'));
  const html = fs.readFileSync('index.html', 'utf8');

  assert.equal(targets.length, 21);
  assert.equal(entries.length, 21);
  for (const target of targets) assert.ok(html.includes(target), target);
});
