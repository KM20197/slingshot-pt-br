const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),parse5=require('parse5'),acorn=require('acorn'),walk=require('acorn-walk');
const metadata=require('../locales/funding-pathway-static-help.pt-BR.json');
const modalId='fundingPathwayHelpModal',sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const literal=(n,value)=>n?.type==='Literal'&&n.value===value;
const identifier=(n,name)=>n?.type==='Identifier'&&n.name===name;
function visitDOM(n,fn){fn(n);for(const c of n.childNodes||[])visitDOM(c,fn);if(n.content)visitDOM(n.content,fn);}

// Parse only: never evaluate the runtime, create a Game or consume randomness.
function extract(code,required){
 const ast=acorn.parse(code,{ecmaVersion:'latest'}),functions=[];
 let otherBinding=false;
 walk.simple(ast,{
  FunctionDeclaration(n){if(identifier(n.id,'fundingHelp'))functions.push(n);},
  FunctionExpression(n){if(identifier(n.id,'fundingHelp'))otherBinding=true;},
  VariableDeclarator(n){if(identifier(n.id,'fundingHelp'))otherBinding=true;},
  AssignmentExpression(n){if(identifier(n.left,'fundingHelp'))otherBinding=true;},
  Property(n){if((identifier(n.key,'fundingHelp')||literal(n.key,'fundingHelp'))&&['FunctionExpression','ArrowFunctionExpression'].includes(n.value.type))otherBinding=true;}
 });
 if(otherBinding||functions.length>1||required&&functions.length!==1)throw Error('fundingHelp: forma ou declaração ambígua.');
 if(!functions.length)return null;
 const fn=functions[0],body=fn.body.body;
 if(fn.params.length||fn.async||fn.generator||body.length!==2)throw Error('fundingHelp: corpo divergente.');
 const write=body[0].type==='ExpressionStatement'&&body[0].expression,left=write?.left;
 if(write?.type!=='AssignmentExpression'||write.operator!=='='||left?.type!=='MemberExpression'||left.computed||!identifier(left.property,'innerHTML')||left.object.type!=='CallExpression'||!identifier(left.object.callee,'node')||left.object.arguments.length!==1||!literal(left.object.arguments[0],modalId))throw Error('fundingHelp: writer ou destino divergente.');
 const value=write.right;
 if(value.type!=='TemplateLiteral'||value.expressions.length||value.quasis.length!==1||typeof value.quasis[0].value.cooked!=='string'||!value.quasis[0].value.cooked.trim())throw Error('fundingHelp: literal inválido ou com expressões.');
 const toggle=body[1].type==='ExpressionStatement'&&body[1].expression;
 if(toggle?.type!=='CallExpression'||!identifier(toggle.callee,'toggle')||toggle.arguments.length!==2||!literal(toggle.arguments[0],modalId)||!literal(toggle.arguments[1],true))throw Error('fundingHelp: abertura divergente.');
 return value.quasis[0].value.cooked;
}

function validatePayload(payload){
 const fragment=parse5.parseFragment(payload),roots=fragment.childNodes.filter(n=>n.nodeName!=='#text'||n.value.trim());
 if(roots.length!==1||roots[0].tagName!=='section')throw Error('fundingHelp: raiz inválida.');
 const allowed=new Set(['section','h2','h3','p','ul','li','button']),buttons=[];
 visitDOM(fragment,n=>{
  if(n.tagName&&!allowed.has(n.tagName))throw Error('fundingHelp: elemento não aprovado.');
  for(const a of n.attrs||[])if(a.name!=='class'&&!(n.tagName==='button'&&a.name==='onclick'&&a.value==='game.closeFundingPathwayHelp()'))throw Error('fundingHelp: atributo não aprovado.');
  if(n.tagName==='button')buttons.push(n);
 });
 if(buttons.length!==1||buttons[0].attrs.filter(a=>a.name==='onclick').length!==1||buttons[0].childNodes.length!==1||buttons[0].childNodes[0].nodeName!=='#text'||buttons[0].childNodes[0].value!=='Entendi')throw Error('fundingHelp: fechamento divergente.');
}

function applyFundingPathwayStaticHelp(html,options={}){
 const data=options.metadata||metadata;
 if(typeof html!=='string'||data.modalId!==modalId||!['beforeInnerSHA256','runtimePayloadSHA256'].every(k=>typeof data[k]==='string'&&/^[a-f0-9]{64}$/.test(data[k])))throw Error('fundingHelp: entrada/metadados inválidos.');
 const runtime=options.runtimeSource??fs.readFileSync(path.join(__dirname,'..','management-runtime.js'),'utf8'),payload=extract(runtime,true);
 if(sha(payload)!==data.runtimePayloadSHA256)throw Error('fundingHelp: hash do literal não aprovado.');
 validatePayload(payload);
 const document=parse5.parse(html,{sourceCodeLocationInfo:true}),modals=[],embedded=[];
 visitDOM(document,n=>{
  if(n.attrs?.some(a=>a.name==='id'&&a.value===modalId))modals.push(n);
  if(n.tagName==='script'&&!n.attrs.some(a=>a.name==='src')&&!n.attrs.some(a=>a.name==='type'&&a.value==='application/ld+json')){
   const code=n.childNodes.map(c=>c.value||'').join(''),value=extract(code,false);
   if(value!==null)embedded.push(value);
  }
 });
 if(embedded.length!==1||embedded[0]!==payload)throw Error('fundingHelp: paridade externa/embutida divergente.');
 if(modals.length!==1)throw Error('fundingHelp: modal ausente ou duplicado.');
 const loc=modals[0].sourceCodeLocation;
 if(!loc?.startTag||!loc.endTag)throw Error('fundingHelp: fechamento do modal ausente.');
 const start=loc.startTag.endOffset,end=loc.endTag.startOffset;
 if(sha(html.slice(start,end))!==data.beforeInnerSHA256)throw Error('fundingHelp: interior stale ou reaplicação.');
 return html.slice(0,start)+payload+html.slice(end);
}
module.exports={applyFundingPathwayStaticHelp,modalId};
