const {replaceMethod}=require('./method-patch.cjs');
function apply(html){
 return replaceMethod(html,'endGame',body=>'    if (typeof SlingshotOperationalEndgame !== "undefined") return SlingshotOperationalEndgame.show(this, reason);\n'+body);
}
module.exports={apply};
