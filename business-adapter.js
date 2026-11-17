(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./people-contracts-runtime'):root.SlingshotPeopleContracts);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.SlingshotBusinessAdapter=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(people){
 'use strict';
 function enabled(game){return Boolean(people&&people.enabled(game));}
 function capacity(game,fallback){return enabled(game)?people.capacity(game,fallback):fallback;}
 function demand(game,fallback){return enabled(game)?people.demand(game,fallback):fallback;}
 return Object.freeze({enabled,capacity,demand});
});
