// Full Brazilian venture arrays are maintained in locales/ventures.pt-BR.json.
const fs=require('node:fs');
const catalogue=JSON.parse(fs.readFileSync('locales/structures.pt-BR.json','utf8'));
const ventures=require('../locales/ventures.pt-BR.json');
if(Object.keys(ventures).length!==12)throw new Error('Esperados 12 empreendimentos');
for(const [id,item]of Object.entries(ventures))for(const key of ['product','customers','revenue','whyWork','whyHard','competition'])if(!item[key]?.length)throw new Error('Conteúdo ausente: '+id+'.'+key);
catalogue.VENTURE_DETAILS={classification:'Substituído integralmente pelo conteúdo brasileiro autorizado, em tools/management-patch.cjs.',strings:{}};
fs.writeFileSync('locales/structures.pt-BR.json',JSON.stringify(catalogue,null,2)+'\n');
