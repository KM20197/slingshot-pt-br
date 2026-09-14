/* Exportação local. HMAC verifica a chave, não comprova autoria nem oculta dados. */
(function () {
  'use strict';
  let frozen = null;
  let dialog;
  let revision=0;
  let failure='';
  let capturedGame=null;
  const number = value => value.toLocaleString('pt-BR', {minimumFractionDigits:2,maximumFractionDigits:2});
  window.SlingshotExport = Object.freeze({
    capture(game, reason) {
      if(frozen&&capturedGame===game)return;
      this.reset();
      try {
      const result = SlingshotAcademic.fromGame(game, reason);
      frozen = Object.freeze({
        version:'slingshot-br-1', formulaVersion:result.formulaVersion,
        nonce:crypto.randomUUID(), data:new Date().toISOString(),
        empresa:game.startupName || game.company.name, modo:game.gameMode || 'core',
        razao:reason, nota:result.grade, componentes:result.components, metricas:result.inputs
      });
      capturedGame=game;
      } catch(error) {
        failure='A partida foi encerrada, mas não foi possível preparar a nota: '+error.message;
      }
      setTimeout(showResultButton, 0);
    },
    reset() {
      revision++;frozen=null;failure='';capturedGame=null;
      if(dialog){dialog.close();clear();}
      document.getElementById('br-export-access')?.remove();
    }
  });
  function showResultButton() {
    if (!frozen&&!failure) return;
    let area=document.getElementById('br-export-access');
    if (!area) {
      area=document.createElement('div'); area.id='br-export-access';
      area.style.cssText='position:fixed;bottom:16px;right:16px;z-index:9999;padding:12px;border-radius:12px;background:#123b38;color:white;box-shadow:0 3px 20px #0006';
      const button=document.createElement('button'); button.type='button';
      button.onclick=open; area.append(button); document.body.append(area);
    }
    area.firstElementChild.textContent=failure||'Exportar resultado — nota '+number(frozen.nota)+'/5';
    area.firstElementChild.disabled=!!failure;
    if(failure)area.setAttribute('role','status');
  }
  function open() {
    if (!frozen) return;
    if (!dialog) {
      dialog=document.createElement('dialog'); dialog.id='br-export-dialog';
      dialog.style.cssText='width:min(92vw,540px);padding:24px;border-radius:16px;color:#172c2a;background:white';
      dialog.innerHTML=`<form method="dialog"><button style="float:right" aria-label="Fechar exportação">Fechar ×</button></form>
        <h2 style="font-size:24px;font-weight:bold;margin-bottom:12px">Resultado para o professor</h2>
        <p id="br-grade-breakdown"></p>
        <p style="margin:12px 0">Informe matrícula ou e-mail somente para identificar o arquivo que entregará ao professor. Nada será enviado pelo jogo.</p>
        <form id="br-export-form"><label for="br-student">Matrícula ou e-mail</label>
        <input id="br-student" required maxlength="254" autocomplete="off" style="display:block;border:1px solid #64748b;padding:10px;width:100%;margin-bottom:12px">
        <label for="br-class-key">Chave da turma</label><input id="br-class-key" type="password" required autocomplete="off" style="display:block;border:1px solid #64748b;padding:10px;width:100%;margin-bottom:12px">
        <button type="submit" style="padding:10px;background:#166534;color:white;border-radius:8px">Gerar arquivo de resultado</button></form>
        <p id="br-export-status" role="status" style="margin:12px 0"></p>
        <label for="br-export-code">Código para entrega manual</label><textarea id="br-export-code" readonly rows="5" style="display:block;width:100%;border:1px solid #64748b"></textarea>
        <button id="br-download" type="button" disabled style="padding:10px">Baixar .txt</button>
        <button id="br-copy" type="button" disabled style="padding:10px">Copiar código</button>
        <p style="font-size:12px;margin-top:12px">O código contém os dados informados em formato legível por decodificação. A assinatura verifica a chave utilizada; não comprova que a partida está livre de alterações.</p>`;
      document.body.append(dialog);
      document.getElementById('br-export-form').addEventListener('submit', generate);
      document.getElementById('br-download').onclick=download;
      document.getElementById('br-copy').onclick=copy;
      dialog.addEventListener('close',clear);
    }
    clear();
    const c=frozen.componentes;
    document.getElementById('br-grade-breakdown').textContent=`Nota ${number(frozen.nota)}/5 — Marcos: ${number(c.development)}/3; continuidade: ${number(c.continuity)}/1; capacidade financeira: ${number(c.financial)}/1.`;
    dialog.showModal();
  }
  function clear() {
    revision++;
    for(const id of ['br-student','br-class-key','br-export-code']) document.getElementById(id).value='';
    document.getElementById('br-download').disabled=true;
    document.getElementById('br-copy').disabled=true;
    document.getElementById('br-export-status').textContent='';
  }
  async function generate(event) {
    event.preventDefault();
    const identification=document.getElementById('br-student').value.trim();
    const input=document.getElementById('br-class-key');
    const status=document.getElementById('br-export-status');
    const current=++revision;
    document.getElementById('br-export-code').value='';
    document.getElementById('br-download').disabled=true;
    document.getElementById('br-copy').disabled=true;
    if (!identification || !input.value.trim()) {status.textContent='Preencha a identificação e a chave da turma.';return;}
    try {
      const code=await SlingshotResult.encode({...frozen,identificacao:identification},input.value);
      if(current!==revision||!dialog.open)return;
      document.getElementById('br-export-code').value=code;
      document.getElementById('br-download').disabled=false;
      document.getElementById('br-copy').disabled=false;
      status.textContent='Resultado gerado localmente. Baixe o arquivo e entregue ao professor.';
    } catch(error) {if(current===revision)status.textContent='Não foi possível gerar o resultado: '+error.message;}
    finally {if(current===revision)input.value='';}
  }
  function download() {
    const value=document.getElementById('br-export-code').value;
    if (!value) return;
    const url=URL.createObjectURL(new Blob([value],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='resultado-slingshot.txt';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function copy() {
    const output=document.getElementById('br-export-code');
    const current=revision;
    try {await navigator.clipboard.writeText(output.value);if(current===revision&&dialog.open)document.getElementById('br-export-status').textContent='Código copiado.';}
    catch {if(current===revision&&dialog.open){output.focus();output.select();document.getElementById('br-export-status').textContent='Use Ctrl+C para copiar o código selecionado.';}}
  }
})();
