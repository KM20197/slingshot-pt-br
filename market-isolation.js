(function(root){
  const operatingIds=Object.freeze(['avam','dream','quant','vanguard','legal','arene','voed','aether','edu','cyber','terra','sorgente']);
  const enabled=game=>operatingIds.includes(game?.company?.id);
  const api=Object.freeze({
    operatingIds:()=>operatingIds.slice(),
    isolated:enabled,
    hidden:()=>true
  });
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.SlingshotMarketIsolation=api;
})(typeof globalThis==='undefined'?this:globalThis);
