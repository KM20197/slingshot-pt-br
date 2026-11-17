// L1b: somente apresentação. Nenhuma tabela canônica ou regra de partida é alterada.
const parse5 = require('parse5');
const acorn = require('acorn');
const walk = require('acorn-walk');
const catalogue = require('../locales/onboarding.pt-BR.json');
const founderOrder = Object.freeze(['firsttimer', 'visionary', 'strategist']);
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');
const id = node => node.attrs?.find(a => a.name === 'id')?.value;
function one(items, label) {
  if (items.length !== 1) throw new Error('Âncora L1b ausente ou ambígua: ' + label);
  return items[0];
}
function apply(html) {
  const tree = parse5.parse(html, {sourceCodeLocationInfo: true}), nodes = [], edits = [];
  function collect(node) { nodes.push(node); for (const child of node.childNodes || []) collect(child); }
  collect(tree);
  function remove(node) {
    const loc = node.sourceCodeLocation;
    const lineStart = html.lastIndexOf('\n', loc.startOffset - 1) + 1;
    const lineEnd = html.indexOf('\n', loc.endOffset);
    const start = /^[ \t]*$/.test(html.slice(lineStart, loc.startOffset)) ? lineStart : loc.startOffset;
    const end = lineEnd >= 0 && /^[ \t\r]*$/.test(html.slice(loc.endOffset, lineEnd)) ? lineEnd + 1 : loc.endOffset;
    edits.push({start, end, value: ''});
  }
  const preamble = one(nodes.filter(n => id(n) === 'preambleModal1'), 'preambleModal1');
  function within(node, parent) { for (let n = node; n; n = n.parentNode) if (n === parent) return true; return false; }
  for (const prefix of ["It's 2026. AI may be the defining technology of our era.", 'Economists call it a potential']) {
    remove(one(nodes.filter(n => n.tagName === 'p' && within(n, preamble) && text(n).trim().startsWith(prefix)), prefix));
  }
  const examples = one(nodes.filter(n => id(n) === 'profileInfoExamples'), 'profileInfoExamples');
  if (examples.parentNode.tagName !== 'div' || !text(examples.parentNode).includes('Famous Examples')) throw new Error('Estrutura L1b de exemplos divergente');
  remove(examples.parentNode);
  const comment = one(nodes.filter(n => n.nodeName === '#comment' && n.data.trim() === 'Famous Examples'), 'comentário dos exemplos');
  remove(comment);
  for (const [scope, entries] of Object.entries(catalogue)) {
    const root = one(nodes.filter(n => id(n) === scope), scope);
    for (const [source, target] of Object.entries(entries)) {
      const matches = [];
      for (const node of nodes.filter(n => within(n, root))) {
        if (node.nodeName === '#text' && node.value.trim() === source) {
          const loc = node.sourceCodeLocation;
          matches.push({start: loc.startOffset, end: loc.endOffset, value: escape(node.value.replace(source, target))});
        }
        for (const attr of node.attrs || []) if (['placeholder', 'title', 'aria-label'].includes(attr.name) && attr.value === source) {
          const loc = node.sourceCodeLocation.attrs[attr.name];
          matches.push({start: loc.startOffset, end: loc.endOffset, value: attr.name + '="' + escape(target) + '"'});
          const trailing = html.slice(loc.endOffset).match(/^[ \t]+(?=\r?\n)/);
          if (trailing) edits.push({start: loc.endOffset, end: loc.endOffset + trailing[0].length, value: ''});
        }
      }
      edits.push(one(matches, scope + ': ' + source));
    }
  }
  for (const [scope, action, nameId, chooseId] of [
    ['profileInfoModal', 'game.hideProfileInfo()', 'profileInfoName', 'profileInfoChooseBtn'],
    ['ventureInfoModal', 'game.hideVentureInfo()', 'ventureInfoName', 'ventureInfoChooseBtn']
  ]) {
    const root = one(nodes.filter(n => id(n) === scope), scope);
    const close = one(nodes.filter(n => n.tagName === 'button' && within(n, root) && text(n) === '×' && n.attrs.some(a => a.name === 'onclick' && a.value === action)), action);
    edits.push({start: close.sourceCodeLocation.startTag.endOffset - 1, end: close.sourceCodeLocation.startTag.endOffset - 1, value: ' aria-label="Fechar"'});
    const choose = one(nodes.filter(n => id(n) === chooseId), chooseId);
    edits.push({start: choose.sourceCodeLocation.startTag.endOffset - 1, end: choose.sourceCodeLocation.startTag.endOffset - 1, value: ` aria-labelledby="${chooseId} ${nameId}"`});
  }
  // Descending source offsets preserve all unrelated markup, including the complete Ada card.
  edits.sort((a, b) => b.start - a.start);
  for (let i = 1; i < edits.length; i++) if (edits[i].end > edits[i - 1].start) throw new Error('Patches HTML L1b sobrepostos');
  for (const edit of edits) html = html.slice(0, edit.start) + edit.value + html.slice(edit.end);
  const methodEdits = {
    init: [
      ['<div class="text-lg font-bold text-slate-800">${c.name}</div>', '<div id="ventureLabel_${c.id}" class="text-lg font-bold text-slate-800">${c.name}</div>'],
      ['<button onclick="game.showVentureInfo(\'${c.id}\')"', '<button id="ventureLearn_${c.id}" aria-labelledby="ventureLearn_${c.id} ventureLabel_${c.id}" onclick="game.showVentureInfo(\'${c.id}\')"'],
      ['<button onclick="game.selectVenture(\'${c.id}\')"', '<button id="ventureChoose_${c.id}" aria-labelledby="ventureChoose_${c.id} ventureLabel_${c.id}" onclick="game.selectVenture(\'${c.id}\')"'],
      ['            Learn more\n', '            Saiba mais\n'],
      ['            Choose →\n', '            Escolher →\n']
    ],
    showFounderModal: [
      ['Object.values(FOUNDER_PROFILES).map(p => {', JSON.stringify(founderOrder) + '.map(id => FOUNDER_PROFILES[id]).map(p => {'],
      ['<span class="font-bold text-slate-800 text-base">${p.icon} ${p.name}</span>', '<span id="profileLabel_${p.id}" class="font-bold text-slate-800 text-base">${p.icon} ${p.name}</span>'],
      ['<button onclick="game.showProfileInfo(\'${p.id}\')"', '<button id="profileLearn_${p.id}" aria-labelledby="profileLearn_${p.id} profileLabel_${p.id}" onclick="game.showProfileInfo(\'${p.id}\')"'],
      ['<button onclick="game.selectFounderProfile(\'${p.id}\')"', '<button id="profileChoose_${p.id}" aria-labelledby="profileChoose_${p.id} profileLabel_${p.id}" onclick="game.selectFounderProfile(\'${p.id}\')"'],
      ['              Learn more\n', '              Saiba mais\n'],
      ['              Choose\n', '              Escolher\n']
      ,['onclick="game.showProfileInfo(\'${p.id}\')" \n', 'onclick="game.showProfileInfo(\'${p.id}\')"\n']
      ,['onclick="game.selectFounderProfile(\'${p.id}\')" \n', 'onclick="game.selectFounderProfile(\'${p.id}\')"\n']
    ],
    showProfileInfo: [
      ['    // Famous examples\n    document.getElementById("profileInfoExamples").textContent = profile.famousExamples || "Various successful founders";\n', '']
    ]
  };
  // Work inside exact Game method boundaries; do not rewrap bodies or add whitespace.
  const ranges = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/.test(m[1]) || /application\/ld\+json/.test(m[1])) continue;
    const offset = m.index + m[0].indexOf('>') + 1;
    walk.ancestor(acorn.parse(m[2], {ecmaVersion: 'latest'}), {MethodDefinition(n, ancestors) {
      if (Object.hasOwn(methodEdits, n.key.name) && ancestors.some(a => a.type === 'ClassDeclaration' && a.id?.name === 'Game')) ranges.push({name: n.key.name, start: offset + n.value.body.start, end: offset + n.value.body.end});
    }});
  }
  for (const name of Object.keys(methodEdits)) one(ranges.filter(r => r.name === name), 'Game.' + name);
  for (const range of ranges.sort((a, b) => b.start - a.start)) {
    let body = html.slice(range.start, range.end);
    for (const [source, target] of methodEdits[range.name]) {
      const index = body.indexOf(source);
      if (index < 0 || body.indexOf(source, index + source.length) >= 0) throw new Error('Âncora L1b ausente ou ambígua em ' + range.name + ': ' + source);
      body = body.slice(0, index) + target + body.slice(index + source.length);
    }
    acorn.parse('function test()' + body, {ecmaVersion: 'latest'});
    html = html.slice(0, range.start) + body + html.slice(range.end);
  }
  return html;
}
module.exports = {apply, founderOrder};
