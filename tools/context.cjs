const fs=require('node:fs');
const html=fs.readFileSync('source/index.original.html','utf8');
for(const term of process.argv.slice(2)) {
 const index=html.indexOf(term);
 console.log('\n'+term+' @ '+index+'\n'+(index<0?'Não encontrado':html.slice(index,index+6500).split('\n').map(s=>s.length>1400?s.slice(0,1400)+' [linha truncada]':s).join('\n')));
}
