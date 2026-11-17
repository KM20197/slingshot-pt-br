'use strict';

// Export only the reviewed documentation allowlist. Never copy a workspace tree.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const childProcess = require('node:child_process');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'artifacts', 'gemini-drive', 'atual');
const sources = [
  ['docs/LEIA_PRIMEIRO_GEMINI.md', 'conhecimento/00_LEIA_PRIMEIRO.txt'],
  ['docs/ESTADO_ATUAL.md', 'conhecimento/01_ESTADO_ATUAL.txt'],
  ['docs/MANUAL_ORQUESTRACAO.md', 'conhecimento/02_MANUAL_ORQUESTRACAO.txt'],
  ['docs/DECISOES_APROVADAS.md', 'conhecimento/03_DECISOES_APROVADAS.txt'],
  ['docs/PLANO_CONCLUSAO.md', 'conhecimento/04_PLANO_CONCLUSAO.txt'],
  ['docs/MAPA_ARQUIVOS.md', 'conhecimento/05_MAPA_ARQUIVOS.txt'],
  ['docs/PROTOCOLO_OPENCODE.md', 'conhecimento/06_PROTOCOLO_OPENCODE.txt'],
  ['docs/CALIBRACAO_L3KB0_CONTEXTO.md', 'conhecimento/07_CALIBRACAO_L3KB0.txt'],
  ['artifacts/l3k-arquitetural/ESPECIFICACAO_ADAPTADOR_MEMORIA_L3KB.md', 'conhecimento/08_ESPECIFICACAO_ADAPTADOR_MEMORIA_L3KB.txt'],
  ['artifacts/l3k-arquitetural/RELATORIO_E2_MULLVAD_Q1.md', 'conhecimento/09_RELATORIO_E2_MULLVAD_Q1.txt'],
  ['artifacts/l3k-arquitetural/REVISAO_E2_MULLVAD_Q1.md', 'conhecimento/10_REVISAO_E2_MULLVAD_Q1.txt'],
  ['artifacts/l3k-arquitetural/CONTRATO_PARIDADE_CAUSAL_E1_E2_E3_Q1.md', 'conhecimento/11_CONTRATO_PARIDADE_CAUSAL_E1_E2_E3_Q1.txt'],
  ['artifacts/l3k-arquitetural/paridade-q1/RELATORIO_PARIDADE_CAUSAL_Q1.md', 'conhecimento/12_RELATORIO_PARIDADE_CAUSAL_Q1.txt'],
  ['artifacts/l3k-arquitetural/paridade-q1/REVISAO_PARIDADE_CAUSAL_Q1.md', 'conhecimento/13_REVISAO_PARIDADE_CAUSAL_Q1.txt'],
  ['artifacts/l3k-arquitetural/CONTRATO_CALIBRACAO_INTEGRADA_L3KB_Q1_Q16.md', 'conhecimento/14_CONTRATO_CALIBRACAO_L3KB_Q1_Q16.txt'],
  ['docs/HANDOFF_CONTINUIDADE_GEMINI_OPENCODE_2026-10-11.md', 'conhecimento/15_HANDOFF_CONTINUIDADE_GEMINI_OPENCODE.txt'],
  ['docs/PROMPT_GEMINI_ORIENTADOR.md', 'INSTRUCOES_DO_GEM.txt'],
  ['docs/MENSAGEM_INICIAL_GEMINI.md', 'MENSAGEM_INICIAL.txt'],
];
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const loaded = sources.map(([source, target]) => {
  const absolute = path.resolve(root, source);
  if (!absolute.startsWith(root + path.sep)) throw new Error('Source outside checkout');
  const bytes = fs.readFileSync(absolute);
  const text = bytes.toString('utf8');
  // Fail closed without printing a match or its contents.
  if (/sk-[a-z0-9_-]{12,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|"apiKey"\s*:\s*"(?!\{)[^"]+"/i.test(text)) {
    throw new Error('Possible secret in documentation: ' + source);
  }
  return { source, target, absolute, bytes, text, sourceSha256: hash(bytes) };
});
const state = loaded.find(item => item.source === 'docs/ESTADO_ATUAL.md');
const revision = /\*\*Revisão:\s*([^\s.]+)/.exec(state.text)?.[1];
if (!revision) throw new Error('State revision missing; update ESTADO_ATUAL before export');
const packageId = hash(loaded.map(item => item.source + ':' + item.sourceSha256).join('\n')).slice(0, 16);
const generatedAt = new Date().toISOString();
const generatedAtSaoPaulo = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'medium',
}).format(new Date());
let head = null;
try { head = childProcess.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', windowsHide: true }).trim(); } catch {}
const expectedKnowledge = sources.filter(([, target]) => target.startsWith('conhecimento/')).map(([, target]) => path.basename(target));
const knowledge = path.join(output, 'conhecimento');
if (fs.existsSync(knowledge)) {
  const unexpected = fs.readdirSync(knowledge).filter(name => !expectedKnowledge.includes(name));
  if (unexpected.length) throw new Error('Unexpected files in conhecimento; review separately before export: ' + unexpected.join(', '));
}
fs.mkdirSync(knowledge, { recursive: true });
const manifestFiles = [];
for (const item of loaded) {
  const isKnowledge = item.target.startsWith('conhecimento/');
  const header = isKnowledge
    ? `SLINGSHOT BRASIL — pacote ${packageId}\nRevisão do estado: ${revision}\nExportado: ${generatedAtSaoPaulo} America/Sao_Paulo\nOrigem local: ${item.absolute}\nEsta exportação não comprova envio ao Drive, leitura pelo Gemini ou novos testes.\n\n`
    : '';
  const bytes = Buffer.from(header + item.text.replace(/\r\n/g, '\n'), 'utf8');
  const absolute = path.resolve(output, item.target);
  if (!absolute.startsWith(output + path.sep)) throw new Error('Destination outside output');
  fs.writeFileSync(absolute, bytes);
  const verified = fs.readFileSync(absolute);
  if (!verified.equals(bytes)) throw new Error('Export verification failed: ' + item.target);
  manifestFiles.push({ source: item.source, target: item.target, knowledge: isKnowledge,
    sourceSha256: item.sourceSha256, exportSha256: hash(verified), bytes: verified.length });
}
const manifest = { schemaVersion: 1, packageId, stateRevision: revision, generatedAt,
  generatedAtSaoPaulo, timezone: 'America/Sao_Paulo', checkout: root, localHead: head,
  uploadedToDrive: false, geminiReadConfirmed: false, knowledgeFileCount: expectedKnowledge.length,
  files: manifestFiles };
fs.writeFileSync(path.join(output, 'MANIFESTO.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ output, packageId, stateRevision: revision, knowledgeFiles: expectedKnowledge.length,
  uploadStatus: 'not_performed', verified: true }, null, 2));
