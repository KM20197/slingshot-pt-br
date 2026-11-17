(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.SlingshotCompanyDisplay=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const companies=Object.freeze({
  aether:Object.freeze({canonical:'Aether BioLabs',name:'Clínica popular',sector:'Serviços — Saúde'}),
  edu:Object.freeze({canonical:'EduSpark AI',name:'Academia',sector:'Serviços'}),
  avam:Object.freeze({canonical:'Avam AI',name:'Assistência técnica de celulares',sector:'Serviços'}),
  voed:Object.freeze({canonical:'Voed AI',name:'Restaurante por quilo',sector:'Serviços'}),
  legal:Object.freeze({canonical:'LegalMind AI',name:'Farmácia',sector:'Comércio — Saúde'}),
  dream:Object.freeze({canonical:'DreamScape Studios',name:'Minimercado',sector:'Comércio'}),
  arene:Object.freeze({canonical:'Arene AI',name:'Loja de roupas',sector:'Comércio'}),
  vanguard:Object.freeze({canonical:'Vanguard Robotics',name:'Material de construção',sector:'Comércio'}),
  terra:Object.freeze({canonical:'TerraMind Analytics',name:'Produtos de limpeza',sector:'Indústria — Saúde'}),
  sorgente:Object.freeze({canonical:'Sorgente AI',name:'Alimentos congelados',sector:'Indústria'}),
  cyber:Object.freeze({canonical:'CyberShield AI',name:'Confecção',sector:'Indústria'}),
  quant:Object.freeze({canonical:'QuantFlow Systems',name:'Gráfica/embalagens',sector:'Indústria'})
 });
 const entry=company=>companies[company?.id];
 const fallback=company=>company?.name||'';
 function name(company){
  const item=entry(company);
  return item&&(!company.name||company.name===item.canonical)?item.name:fallback(company);
 }
 function sector(company){return entry(company)?.sector||company?.archetype||'';}
 function exportName(game){
  const saved=game?.startupName;
  const item=entry(game?.company);
  return saved&&saved!==item?.canonical?saved:name(game?.company);
 }
 return Object.freeze({name,sector,exportName});
});
