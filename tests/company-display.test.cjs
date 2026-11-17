const test=require('node:test'),assert=require('node:assert/strict');
const display=require('../company-display.js');

const cases={
 aether:['Aether BioLabs','Clínica popular','Serviços — Saúde'],edu:['EduSpark AI','Academia','Serviços'],avam:['Avam AI','Assistência técnica de celulares','Serviços'],voed:['Voed AI','Restaurante por quilo','Serviços'],legal:['LegalMind AI','Farmácia','Comércio — Saúde'],dream:['DreamScape Studios','Minimercado','Comércio'],arene:['Arene AI','Loja de roupas','Comércio'],vanguard:['Vanguard Robotics','Material de construção','Comércio'],terra:['TerraMind Analytics','Produtos de limpeza','Indústria — Saúde'],sorgente:['Sorgente AI','Alimentos congelados','Indústria'],cyber:['CyberShield AI','Confecção','Indústria'],quant:['QuantFlow Systems','Gráfica/embalagens','Indústria']
};

test('the approved twelve IDs map to Brazilian names and sectors without mutating canonical data',()=>{
 for(const [id,[canonical,name,sector]]of Object.entries(cases)){
  const company={id,name:canonical,archetype:'canonical sector'};
  assert.equal(display.name(company),name,id);
  assert.equal(display.sector(company),sector,id);
  assert.equal(company.name,canonical,id);
 }
 assert.ok(Object.isFrozen(display));
});

test('unknown IDs and renamed ventures preserve their existing presentation labels',()=>{
 assert.equal(display.name({id:'unknown',name:'Original'}),'Original');
 assert.equal(display.sector({id:'unknown',archetype:'Original sector'}),'Original sector');
 const pivoted={id:'aether',name:'Novo nome após pivô',archetype:'BioTech'};
 assert.equal(display.name(pivoted),'Novo nome após pivô');
 assert.equal(display.sector(pivoted),'Serviços — Saúde');
});

test('export labels preserve a custom startup name and localize only the canonical fallback',()=>{
 const company={id:'aether',name:'Aether BioLabs'};
 assert.equal(display.exportName({company}),'Clínica popular');
 assert.equal(display.exportName({company,startupName:'Clínica do Bairro'}),'Clínica do Bairro');
 assert.equal(display.exportName({company,startupName:'Aether BioLabs'}),'Clínica popular');
});
