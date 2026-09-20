(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.SlingshotLocationDisplay=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const cities=Object.freeze({London:'Londres',Edinburgh:'Edimburgo'});
 const regions=Object.freeze({
  'South East':'Sudeste da Inglaterra',Scotland:'Escócia',Wales:'País de Gales',
  South:'Sul da Inglaterra',Midlands:'Midlands',Lincolnshire:'Lincolnshire',Capital:'Capital',
  'Northern Ireland':'Irlanda do Norte','South West':'Sudoeste da Inglaterra',
  'West Midlands':'Midlands Ocidentais',Yorkshire:'Yorkshire','East Midlands':'Midlands Orientais',
  'East of England':'Leste da Inglaterra','Yorkshire and the Humber':'Yorkshire e Humber',
  'North East':'Nordeste da Inglaterra','North West':'Noroeste da Inglaterra'
 });
 const label=(dictionary,value)=>Object.hasOwn(dictionary,value)?dictionary[value]:value;
 return Object.freeze({city:value=>label(cities,value),region:value=>label(regions,value)});
});
