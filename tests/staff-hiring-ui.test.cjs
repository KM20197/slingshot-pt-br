const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const acorn = require('acorn');
const parse5 = require('parse5');
const patch = require('../tools/staff-hiring-ui-patch.cjs');
const dashboard = require('../tools/dashboard-localization-patch.cjs');
const { replaceMethod } = require('../tools/method-patch.cjs');
const cat = require('../locales/staff-hiring-ui.pt-BR.json');
const setup = require('../locales/setup-ui.pt-BR.json');
const source = fs.readFileSync('source/index.original.html', 'utf8');
const generated = fs.readFileSync('index.html', 'utf8');
const intermediate = dashboard.apply(source);
const applied = patch.apply(intermediate);
const setupScopes = ['staffBurnImpact', 'staffTierCurrent', 'staffTierNext', 'fireStaffModal', 'staffHelpModal', 'fireModalCash', 'fireModalBurn', 'fireModalNewBurn', 'fireModalNewCash'];
const plain = value => JSON.parse(JSON.stringify(value));
const count = (text, pattern) => (text.match(pattern) || []).length;
const digits = text => (text.match(/\d/g) || []).join('');

function methodBodies(html) {
  const bodies = {};
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/.test(match[1])) continue;
    let ast;
    try {
      ast = acorn.parse(match[2], { ecmaVersion: 'latest' });
    } catch {
      continue;
    }
    for (const node of ast.body) {
      if (node.type !== 'ClassDeclaration' || node.id?.name !== 'Game') continue;
      for (const element of node.body.body) {
        if (element.type === 'MethodDefinition') bodies[element.key.name] = match[2].slice(element.value.body.start + 1, element.value.body.end - 1);
      }
    }
  }
  return bodies;
}

function restoreStatic(html) {
  const changes = [];
  function visit(node, scope) {
    if (['script', 'style'].includes(node.tagName)) return;
    const id = node.attrs?.find(attr => attr.name === 'id')?.value;
    if (id && Object.hasOwn(cat.static, id)) scope = id;
    if (scope && node.nodeName === '#text') {
      const key = node.value.trim();
      for (const [sourceText, target] of [...Object.entries(cat.static[scope])].reverse()) {
        if (key !== target) continue;
        const location = node.sourceCodeLocation;
        changes.push({ start: location.startOffset, end: location.endOffset, text: node.value.replace(key, sourceText) });
        break;
      }
    }
    for (const child of node.childNodes || []) visit(child, scope);
  }
  visit(parse5.parse(html, { sourceCodeLocationInfo: true }));
  assert.equal(changes.length, 14);
  for (const change of changes.sort((a, b) => b.start - a.start)) html = html.slice(0, change.start) + change.text + html.slice(change.end);
  return html;
}

function countScopedText(html, scopes) {
  const counts = new Map();
  function visit(node, scope) {
    if (['script', 'style'].includes(node.tagName)) return;
    const id = node.attrs?.find(attr => attr.name === 'id')?.value;
    if (id && Object.hasOwn(scopes, id)) scope = id;
    if (scope && node.nodeName === '#text') {
      const text = node.value.trim();
      for (const target of Object.values(scopes[scope])) {
        if (text !== target) continue;
        const key = scope + '|' + target;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    for (const child of node.childNodes || []) visit(child, scope);
  }
  visit(parse5.parse(html), null);
  return counts;
}

function scopedText(html, id) {
  const parts = [];
  function visit(node, inside) {
    if (['script', 'style'].includes(node.tagName)) return;
    if (inside && node.nodeName === '#text') parts.push(node.value);
    const nodeId = node.attrs?.find(attr => attr.name === 'id')?.value;
    const next = inside || nodeId === id;
    for (const child of node.childNodes || []) visit(child, next);
  }
  visit(parse5.parse(html), false);
  return parts.join('\n');
}

test('catálogo do Lote B tem 10 métodos, 78 pares e 14 textos estáticos no escopo jobPostModal', () => {
  assert.deepEqual(Object.keys(cat).sort(), ['classification', 'methods', 'static']);
  assert.equal(cat.classification, 'presentation-only-hiring-ui');
  assert.deepEqual(Object.keys(cat.methods), patch.expectedMethods);
  const counts = Object.fromEntries(Object.entries(cat.methods).map(([method, pairs]) => [method, pairs.length]));
  assert.deepEqual(counts, {
    update: 1,
    showFireStaffModal: 9,
    selectFireStaff: 2,
    showCandidatesModal: 4,
    renderCandidateCard: 11,
    showCandidateDetail: 15,
    hireCandidate: 22,
    confirmJobPost: 3,
    confirmFireStaff: 7,
    showDecline: 4,
  });
  assert.equal(Object.values(counts).reduce((sum, value) => sum + value, 0), 78);
  assert.deepEqual(Object.keys(cat.static), ['jobPostModal']);
  assert.equal(Object.keys(cat.static.jobPostModal).length, 14);
  for (const [sourceText, target] of Object.entries(cat.static.jobPostModal)) assert.equal(digits(sourceText), digits(target), 'número estático alterado: ' + target);
  assert.throws(() => patch.apply(source), /Texto estático de contratação ausente/);
  assert.deepEqual(applied.report, {
    methods: 10,
    strings: 78,
    staticStrings: 14,
    rulesUnchanged: true,
    staticScope: 'locales/staff-hiring-ui.pt-BR.json › jobPostModal',
  });
});

test('Lote B restaura exatamente o ponto intermediário do build, depois do patch de dashboard', () => {
  let restored = applied.html;
  for (const [method, pairs] of Object.entries(cat.methods)) {
    restored = replaceMethod(restored, method, body => {
      let next = body;
      for (const [sourceText, target] of [...pairs].reverse()) {
        const at = next.indexOf(target);
        assert.notEqual(at, -1, method + ' sem alvo para restaurar: ' + target.slice(0, 60));
        assert.equal(next.indexOf(target, at + target.length), -1, method + ' com alvo duplicado: ' + target.slice(0, 60));
        next = next.slice(0, at) + sourceText + next.slice(at + target.length);
      }
      return next;
    });
  }
  restored = restoreStatic(restored);
  assert.equal(restored, intermediate);
  assert.throws(() => patch.apply(applied.html), /Âncora ausente|ausente|ambígua|Texto estático/i);
});

test('HTML gerado contém os 78 alvos, os 14 textos e os 56 pares dos nove escopos estáticos', () => {
  const bodies = methodBodies(generated);
  for (const [method, pairs] of Object.entries(cat.methods)) {
    assert.ok(bodies[method], 'método ausente no HTML gerado: ' + method);
    for (const [sourceText, target] of pairs) {
      assert.equal(count(bodies[method], new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')), 1, method + ': ' + target.slice(0, 80));
      assert.equal(bodies[method].includes(sourceText), false, method + ' ainda exibe a origem: ' + sourceText.slice(0, 80));
    }
  }
  for (const target of Object.values(cat.static.jobPostModal)) assert.ok(generated.includes(target), target);
  const counts = countScopedText(generated, setup);
  let staticPairs = 0;
  for (const scope of setupScopes) {
    assert.ok(setup[scope], 'escopo estático ausente: ' + scope);
    for (const [sourceText, target] of Object.entries(setup[scope])) {
      staticPairs += 1;
      assert.equal(counts.get(scope + '|' + target), 1, scope + ': alvo ausente ou duplicado: ' + target);
      assert.equal(/[£€]/.test(target), false, scope + ': moeda residual: ' + target);
      assert.equal(count(sourceText, /\[NEW\]/g), count(target, /\[NEW\]/g), scope + ': marcador NEW alterado: ' + target);
      if (sourceText.includes('£')) assert.ok(target.includes('R$'), scope + ': moeda não convertida: ' + target);
    }
  }
  assert.equal(staticPairs, 56);
  const jobPostText = scopedText(generated, 'jobPostModal');
  for (const approved of ['Processos, normas e padronização', 'Entrega, atendimento e suporte', 'Clientes, marca e relacionamento', 'Equipe, clima e desenvolvimento']) assert.ok(jobPostText.includes(approved), approved);
  for (const residual of ['Post a Job', 'Create a job listing', 'Role *', 'Science & Innovation', '£']) assert.equal(jobPostText.includes(residual), false, residual);
  const build = fs.readFileSync('tools/build.cjs', 'utf8');
  const setupAt = build.indexOf("require('./setup-ui-patch.cjs')");
  const dashboardAt = build.indexOf("require('./dashboard-localization-patch.cjs')");
  const staffAt = build.indexOf("require('./staff-hiring-ui-patch.cjs')");
  assert.ok(setupAt >= 0 && setupAt < dashboardAt, 'setup-ui deve anteceder dashboard-localization');
  assert.ok(dashboardAt < staffAt, 'dashboard-localization deve anteceder staff-hiring-ui');
});

test('Lote B renderiza senioridade, áreas, moeda dinâmica e disponibilidade sem perder a distinção conhecida', () => {
  const roleLabels = plain(vm.runInNewContext('(' + cat.methods.showFireStaffModal[0][1].replace('const roleLabels = ', '').replace(/;$/, '') + ')'));
  assert.deepEqual(roleLabels, { research: 'Operações e Qualidade', product: 'Produção e Serviços', marketing: 'Vendas e Marketing', people: 'Gestão de Pessoas' });
  const candidatesLabels = plain(vm.runInNewContext('(' + cat.methods.showCandidatesModal[0][1].replace('const roleLabels = ', '').replace(/;$/, '') + ')'));
  assert.deepEqual(candidatesLabels, roleLabels);

  const seniority = cat.methods.showFireStaffModal[1][1];
  const renderSeniority = (value, role) => vm.runInNewContext('`' + seniority + '`', { staff: { seniority: value }, roleLabels, role });
  assert.equal(renderSeniority('junior', 'research'), 'Júnior Operações e Qualidade');
  assert.equal(renderSeniority('senior', 'product'), 'Sênior Produção e Serviços');
  assert.equal(renderSeniority('lead', 'marketing'), 'Liderança Vendas e Marketing');
  assert.equal(renderSeniority('outro', 'people'), 'outro Gestão de Pessoas');

  const shortNames = plain(vm.runInNewContext('(' + cat.methods.showFireStaffModal[2][1].replace('const statNames = ', '').replace(/;$/, '') + ')'));
  assert.deepEqual(shortNames, { sci: 'Operações', dev: 'Produção', mkt: 'Vendas', hr: 'Pessoas' });
  const longNames = plain(vm.runInNewContext('(' + cat.methods.confirmFireStaff[3][1].replace('const statNames = ', '').replace(/;$/, '') + ')'));
  assert.deepEqual(longNames, { sci: 'Operações e Qualidade', dev: 'Produção e Serviços', mkt: 'Vendas e Marketing', hr: 'Gestão de Pessoas' });
  assert.notDeepEqual(shortNames, longNames);

  const burnImpact = { textContent: '' };
  vm.runInNewContext(cat.methods.update[0][1], { staffBurnImpact: burnImpact, staffBurn: 50, getRegion: () => ({ currency: 'R$' }) });
  assert.equal(burnImpact.textContent, 'R$50k');

  const salary = cat.methods.showFireStaffModal[3][1];
  assert.equal(vm.runInNewContext('`' + salary + '`', { getRegion: () => ({ currency: 'R$' }), staff: { salary: 50, hiredTurn: 3 } }), '· R$50k/ano · Entrou no T3');

  const nodes = {};
  const document = { getElementById: id => (nodes[id] ||= { textContent: '' }) };
  const fireCode = cat.methods.showFireStaffModal.slice(5, 9).map(pair => pair[1]).join('\n');
  vm.runInNewContext('(function(newBurn, newCash){' + fireCode + '})', { document, getRegion: () => ({ currency: 'R$' }) }).call({ metrics: { cash: 120, burn: 45 } }, 30, 100);
  assert.equal(nodes.fireModalCash.textContent, 'R$120k');
  assert.equal(nodes.fireModalBurn.textContent, 'R$45k/trim');
  assert.equal(nodes.fireModalNewBurn.textContent, 'R$30k/trim');
  assert.equal(nodes.fireModalNewCash.textContent, 'R$100k');

  const availability = cat.methods.hireCandidate[12][1];
  const renderAvailability = value => vm.runInNewContext('`' + availability + '`', { candidate: { availability: value } });
  assert.equal(renderAvailability('immediate'), 'No próximo trimestre');
  assert.equal(renderAvailability('1 month'), 'Em cerca de um mês');
  assert.equal(renderAvailability('3 months'), 'Em cerca de três meses');
  assert.equal(renderAvailability(undefined), 'No próximo trimestre');

  const roleTarget = cat.methods.hireCandidate[1][1];
  const roleExpression = roleTarget.replace(/^role:\s*/, '').replace(/,$/, '');
  const renderRole = value => vm.runInNewContext('(function(candidate){return ' + roleExpression + '})', {})({ seniority: value });
  assert.equal(renderRole('junior'), 'Júnior — contratação');
  assert.equal(renderRole('senior'), 'Sênior — contratação');
  assert.equal(renderRole('lead'), 'Liderança — contratação');
  assert.equal(renderRole(undefined), 'Nova — contratação');

  const titleTarget = cat.methods.hireCandidate[0][1];
  const titleExpression = titleTarget.replace(/^title:\s*/, '').replace(/,$/, '');
  const renderTitle = value => vm.runInNewContext('(function(candidate){return ' + titleExpression + '})', {})({ seniority: value });
  assert.equal(renderTitle('lead'), 'Coordenação — Liderança de Pessoas');
  assert.equal(renderTitle(undefined), 'Nova — Liderança de Pessoas');

  for (const method of ['renderCandidateCard', 'hireCandidate']) {
    assert.ok(cat.methods[method].some(([, target]) => target.includes("|| 'RH'")), method + ' sem fallback RH');
  }
});
