const acorn=require('acorn'),walk=require('acorn-walk');
const {replaceMethod}=require('./method-patch.cjs');

// Scope changes to the two presentation templates in Game.update.
function apply(html){
 return replaceMethod(html,'update',body=>{
  const prefix='function probe(){',code=prefix+body+'}';
  const ast=acorn.parse(code,{ecmaVersion:'latest'}),matches=[[],[]];
  walk.ancestor(ast,{TemplateLiteral(node,ancestors){
   const raw=node.quasis.map(q=>q.value.raw);
   let target=-1;
   if(raw.length===2&&raw[0]===''&&raw[1]===' staff integrating')target=0;
   if(raw.length===1&&raw[0]==='Team reorganising after changes')target=1;
   if(target<0)return;
   const parent=ancestors.at(-2),left=parent?.left;
   if(parent?.type!=='AssignmentExpression'||parent.operator!=='='||parent.right!==node||left?.type!=='MemberExpression'||left.computed||left.object.type!=='Identifier'||left.object.name!=='disruptionText'||left.property.name!=='textContent')throw Error('Destino de integração divergente.');
   const expression=node.expressions[0];
   if(target===0&&(node.expressions.length!==1||expression.type!=='MemberExpression'||expression.computed||expression.object.type!=='ThisExpression'||expression.property.name!=='integratingStaff'||code.slice(expression.start,expression.end)!=='this.integratingStaff'))throw Error('Interpolação de integração divergente.');
   if(target===1&&node.expressions.length!==0)throw Error('Mensagem de reorganização divergente.');
   matches[target].push({start:node.start-prefix.length,end:node.end-prefix.length,text:target===0?'`Pessoas da equipe em adaptação: ${this.integratingStaff}`':'`Equipe em reorganização após mudanças`'});
  }});
  if(matches.some(list=>list.length!==1))throw Error('Templates de integração ausentes ou duplicados.');
  for(const edit of matches.flat().sort((a,b)=>b.start-a.start))body=body.slice(0,edit.start)+edit.text+body.slice(edit.end);
  return body;
 });
}
module.exports={apply};
