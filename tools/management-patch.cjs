// L2: adaptation of the approved venture content and identity-free profile artwork.
// Original IDs, attributes and financial formulas remain unchanged in this module.
const acorn = require('acorn');
const walk = require('acorn-walk');
const {replaceMethod} = require('./method-patch.cjs');
const ventures = require('../locales/ventures.pt-BR.json');
const guidance = require('../locales/setup-guidance.pt-BR.json');
const symbols = [
  ['Livro', '<path d="M18 22h18l4 5 4-5h18v38H44l-4 5-4-5H18z M40 27v38"/>'],
  ['Lâmpada', '<path d="M31 52c0-8-10-10-10-22a19 19 0 0 1 38 0c0 12-10 14-10 22z M31 59h18 M35 66h10 M40 4v5 M10 30h6 M64 30h6"/>'],
  ['Bússola', '<circle cx="40" cy="40" r="25"/><path d="m50 25-6 19-19 11 11-19z M40 10v5 M40 65v5 M10 40h5 M65 40h5"/>'],
  ['Calculadora', '<rect x="23" y="12" width="34" height="56" rx="5"/><path d="M29 21h22v12H29z M30 43h3 M40 43h3 M50 43h1 M30 53h3 M40 53h3 M50 53h1"/>'],
  ['Engrenagem', '<circle cx="40" cy="40" r="18"/><circle cx="40" cy="40" r="7"/><path d="M40 12v10 M40 58v10 M12 40h10 M58 40h10 M20 20l8 8 M52 52l8 8 M20 60l8-8 M52 28l8-8"/>'],
  ['Maleta', '<rect x="13" y="26" width="54" height="36" rx="5"/><path d="M29 26v-9h22v9 M13 39h54 M36 35v10h8V35"/>'],
  ['Mapa', '<path d="m12 20 18-6 20 8 18-6v45l-18 6-20-8-18 6z M30 14v45 M50 22v45"/>'],
  ['Gráfico', '<path d="M15 13v53h53 M24 56V43h8v13 M40 56V33h8v23 M56 56V21h8v35"/>'],
  ['Caixas', '<path d="m15 41 15-7 15 7v21l-15 6-15-6z M15 41l15 6 15-6 M30 47v21 M35 19l15-7 15 7v20l-15 7-5-2 M35 19l15 7 15-7 M50 26v20"/>'],
  ['Megafone', '<path d="m14 33 39-17v48L14 47z M14 33v14 M24 51l3 16h10l-6-19 M60 26l9-6 M62 40h11 M60 54l9 6"/>'],
  ['Prancheta', '<rect x="20" y="17" width="40" height="51" rx="4"/><path d="M31 17v-6h18v12H31z M28 36h24 M28 46h24 M28 56h17"/>'],
  ['Ferramentas', '<path d="m23 13 9 9-6 6-9-9c-8 16 9 25 17 18l24 24 6-6-24-24c7-13-3-23-17-18z"/>']
];
function artwork(index) {
  const [label, paths] = symbols[index % symbols.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-label="${label}"><rect width="80" height="80" rx="20" fill="#eef2ff"/><g fill="none" stroke="#4338ca" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;
}
const portraits = Object.fromEntries(Array.from({length:12},(_,i)=>['style'+(i+1),artwork(i)]));
// Preserve the canonical style IDs referenced by existing saved games.
portraits.style3=artwork(0);
portraits.style11=artwork(1);
portraits.style6=artwork(2);
function apply(html) {
  const edits=[],found=new Set();
  const literal = value => JSON.stringify(value).replaceAll('<','\\u003c');
  const details=Object.fromEntries(Object.entries(ventures).map(([id,v])=>[id,Object.fromEntries(['product','customers','revenue','whyWork','whyHard','competition'].map(k=>[k,v[k]]))]));
  const replacements = {
    VENTURE_DETAILS:literal(details),
    FOUNDER_PORTRAITS:literal(portraits),
    getAvatar:`(seed) => {const icons=${literal(symbols.map((_,i)=>artwork(i)))};return icons[Array.from(String(seed||'')).reduce((n,c)=>n+c.codePointAt(0),0)%icons.length];}`,
    renderAvatar:'(avatar, name) => getAvatar(name)'
  };
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1])) continue;
    const offset=m.index+m[0].indexOf('>')+1;
    walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{
      VariableDeclarator(n) {
        if (!Object.hasOwn(replacements,n.id.name)) return;
        if(found.has(n.id.name))throw new Error('Estrutura L2 duplicada: '+n.id.name);
        found.add(n.id.name);edits.push({start:offset+n.init.start,end:offset+n.init.end,value:replacements[n.id.name]});
      },
      FunctionDeclaration(n) {
        if(n.id.name!=='renderCandidatePortrait')return;
        if(found.has(n.id.name))throw new Error('Retrato de candidato duplicado');
        found.add(n.id.name);
        edits.push({start:offset+n.body.start,end:offset+n.body.end,value:`{return '<div style="width:'+Number(sizePx)+'px;height:'+Number(sizePx)+'px">'+getAvatar(c?.id || role)+'</div>';}`});
      },
      PropertyDefinition(n) {
        if(n.key.name!=='coachingTips')return;
        for(const p of n.value.properties){
          const id=p.key.name||p.key.value;
          if(!guidance[id])continue;
          for(const field of p.value.properties){
            const key=field.key.name||field.key.value;
            if(!Object.hasOwn(guidance[id],key))continue;
            const marker='coachingTips.'+id+'.'+key;
            if(found.has(marker))throw new Error('Dica duplicada: '+marker);
            found.add(marker);
            edits.push({start:offset+field.value.start,end:offset+field.value.end,value:literal(guidance[id][key])});
          }
        }
      }
    });
  }
  for(const name of [...Object.keys(replacements),'renderCandidatePortrait'])if(!found.has(name))throw new Error('Estrutura L2 ausente: '+name);
  for(const [id,tip]of Object.entries(guidance))for(const key of Object.keys(tip))if(!found.has('coachingTips.'+id+'.'+key))throw new Error('Dica L2 ausente: '+id+'.'+key);
  for(const e of edits.sort((a,b)=>b.start-a.start))html=html.slice(0,e.start)+e.value+html.slice(e.end);
  for(const method of ['showCoachingTip','showCoachingTipForce'])html=replaceMethod(html,method,body=>body
    .replace('Guided Play • Setup','Tutorial guiado • Preparação')
    .replace('Guided Play • Help Guide','Tutorial guiado • Ajuda')
    .replace('Guided Play • Quarter ${Math.min(this.turn, 4)} of 4','Tutorial guiado • Trimestre ${Math.min(this.turn, 4)} de 4'));
  return html;
}
module.exports={apply,artwork,portraits};
