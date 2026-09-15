// Cenário sintético local para inspeção visual; não altera partidas salvas.
const fs=require('node:fs'),acorn=require('acorn'),walk=require('acorn-walk');
const methods=[];
for(const m of fs.readFileSync('index.html','utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
 if(/\bsrc\s*=/.test(m[1])||/application\/ld\+json/.test(m[1]))continue;
 walk.simple(acorn.parse(m[2],{ecmaVersion:'latest'}),{MethodDefinition(n){if(['showCrisisModal','resolveCrisis'].includes(n.key.name))methods.push(m[2].slice(n.start,n.end));}});
}
if(methods.length!==2)throw new Error('Métodos de crise ausentes ou duplicados.');
fs.writeFileSync('artifacts/crisis-preview.html',`<!doctype html><html lang="pt-BR"><meta charset="UTF-8"><title>Teste local de crise</title>
<script src="../vendor/tailwind.js"></script><script src="../finance.js"></script><script src="../finance-adapter.js"></script><script src="../crisis-credit.js"></script>
<body><main style="padding:24px"><h1>Cenário sintético de crise</h1><p>Inspeção visual dos métodos extraídos do jogo. Não representa uma partida completa.</p><button onclick="game.showCrisisModal()">Abrir crise</button><pre id="result"></pre></main>
<script>
const SlingshotContinuingCredit={close(){}},soundManager={},UIEffects={showToast(){}},getRegion=()=>({currency:'£'});
class Preview {
 constructor(){Object.assign(this,{turn:1,gameStarted:true,failureState:'runway_crisis',crisisLifelineUsed:false,brLoans:[],metrics:{cash:5,burn:100,equity:100,val:350},hiredStaff:[],completedMilestones:[],pivotHistory:[],journeyEvents:[],moods:{research:0},currentEvents:{research:[]}});}
 closeAllModals(){} log(){} renderExecRow(){} calculateMilestoneProgress(){} checkMilestoneCompletion(){} endGame(){}
 update(){document.getElementById('result').textContent=JSON.stringify({caixa:this.metrics.cash,participacao:this.metrics.equity,contratos:this.brLoans.length,parcelasProximas:this.brFinanceSummary?.nextPayments,recuperacaoUsada:this.crisisLifelineUsed},null,2);}
 ${methods.join('\n')}
}
const game=new Preview();
</script></body></html>`);
