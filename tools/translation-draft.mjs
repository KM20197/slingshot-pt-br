// Rascunho local: nunca marca traduções como revisadas nem altera o HTML.
import fs from 'node:fs';
import path from 'node:path';
import {pipeline,env} from '@huggingface/transformers';
env.cacheDir=path.resolve('artifacts/model-cache');
const translator=await pipeline('translation','Xenova/opus-mt-en-ROMANCE',{dtype:'q8',device:'cpu'});
const inventory=JSON.parse(fs.readFileSync('artifacts/inventory.json','utf8'));
const candidates=inventory.strings.filter(s=>['Property','ArrayExpression','ReturnStatement','ConditionalExpression'].includes(s.context)
  && s.text.length>=25 && s.text.length<=1500 && /[a-zA-Z]{2} [a-zA-Z]{2}/.test(s.text)
  && !/[<>{}\\]|https?:|data:/.test(s.text));
const target='artifacts/translation-draft.jsonl';
const done=new Set(fs.existsSync(target)?fs.readFileSync(target,'utf8').trim().split('\n').filter(Boolean).map(line=>JSON.parse(line).source):[]);
let count=0;
const limit=Number(process.argv[2]||200);
for(const item of candidates) {
 if(done.has(item.text))continue;
 const result=await translator('>>pt<< '+item.text,{max_new_tokens:384});
 fs.appendFileSync(target,JSON.stringify({line:item.line,source:item.text,target:result[0].translation_text,status:'draft-unreviewed',engine:'local-opus-en-ROMANCE'})+'\n');
 done.add(item.text);count++;
 if(count%20===0)console.log(JSON.stringify({drafts:count,lastLine:item.line}));
 if(count>=limit)break;
}
console.log(JSON.stringify({drafts:count,status:'requires-review'}));
