const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const config = require('../locales/management-setup.pt-BR.json');
const api = require('../management-runtime');
const generated = fs.readFileSync('index.html', 'utf8');
const source = fs.readFileSync('source/index.original.html', 'utf8');

const approvedBio = 'Acompanhamento de vendas e crescimento de público em negócios.';

test('Lote A altera apenas a bio setorial de Marcus e preserva os demais campos do executivo', () => {
  assert.deepEqual(config.executives.marcus, {
    role: 'marketing',
    name: 'Análise de Crescimento',
    title: 'Responsável Comercial',
    wage: 18.333333333333336,
    bonus: { mkt: 3, dev: 1 },
    origin: 'Perfil de competências do simulador',
    background: approvedBio,
    personality: 'Competências, experiência, forma de trabalhar',
    quote: 'Resultados precisam de planejamento, execução e revisão.',
    cv: {
      education: 'Formação em Economia e análise comercial.',
      experience: [approvedBio],
      strengths: ['Identifica gargalos em canais de venda e testa campanhas.'],
      weaknesses: ['O foco em indicadores pode deixar de lado aspectos do relacionamento.'],
    },
    id: 'marcus',
    avatar: '',
    equity: 0,
    vestingYears: 0,
    cliff: 0,
    metroWage: 22,
  });
  assert.equal(config.executives.marcus.cv.experience.length, 1);
  assert.equal(config.roles.marketing, 'Gerente Comercial');
  assert.equal(config.executives.marcus.title, 'Responsável Comercial');
  assert.equal(JSON.stringify(config.executives.marcus).includes('sales and audience growth'), false);
});

test('Lote A é consumido pelo runtime e aparece no HTML gerado, sem tocar a fonte original', () => {
  const marcus = api.executives('marketing').find(executive => executive.id === 'marcus');
  assert.ok(marcus);
  assert.equal(marcus.background, approvedBio);
  assert.deepEqual(marcus.cv.experience, [approvedBio]);

  const nodes = new Map();
  const get = id => {
    if (!nodes.has(id)) nodes.set(id, { innerHTML: '', textContent: '' });
    return nodes.get(id);
  };
  const context = vm.createContext({ document: { getElementById: get }, console: { log() {}, error() {} } });
  vm.runInContext(fs.readFileSync('management-runtime.js', 'utf8').replace('BR_MANAGEMENT_DATA', JSON.stringify(config)), context);
  context.SlingshotManagement.renderLeaders({ location: context.SlingshotManagement.locations()[0] }, 'leaderCards', 'marketing');
  const cards = nodes.get('leaderCards').innerHTML;
  assert.match(cards, /Acompanhamento de vendas e crescimento de público em negócios\./);
  assert.match(cards, /Responsável Comercial/);

  assert.ok(generated.includes('"background":"' + approvedBio + '"'));
  assert.ok(generated.includes('"experience":["' + approvedBio + '"]'));
  assert.equal(source.includes(approvedBio), false);
});
