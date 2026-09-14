const fs=require('node:fs');
const crypto=require('node:crypto');
const dependencies=[
 {url:'https://cdn.tailwindcss.com',file:'vendor/tailwind.js'},
 {url:'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',file:'vendor/jspdf.umd.min.js'}
];
(async()=>{
 fs.mkdirSync('vendor',{recursive:true});const manifest=[];
 for(const dependency of dependencies){
  let data;
  if(fs.existsSync(dependency.file))data=fs.readFileSync(dependency.file);
  else{const response=await fetch(dependency.url);if(!response.ok)throw new Error('Falha no download: '+response.status);data=Buffer.from(await response.arrayBuffer());fs.writeFileSync(dependency.file,data);}
  manifest.push({...dependency,sha256:crypto.createHash('sha256').update(data).digest('hex'),bytes:data.length});
 }
 fs.writeFileSync('vendor/manifest.json',JSON.stringify(manifest,null,2));console.log(manifest);
})().catch(error=>{console.error(error);process.exitCode=1;});
