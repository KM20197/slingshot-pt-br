# Google Drive e Gemini — passo a passo

Preparado em 07/10/2026. Caminho local do pacote: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\artifacts\gemini-drive\atual`.
O usuário confirmou Gem personalizado no navegador e ausência de pasta Drive. O fluxo abaixo cria uma pasta exclusiva; há alternativa em chat comum se um controle não estiver disponível. Codex segue executando trabalho autorizado e concilia orientações do Gemini trazidas pelo usuário. Este roteiro não instala integração nem realiza upload automaticamente.

## 1. Arquivos já preparados

Abra `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\artifacts\gemini-drive\atual\conhecimento`.
Envie somente estes dezesseis arquivos ao conhecimento:

1. `00_LEIA_PRIMEIRO.txt`
2. `01_ESTADO_ATUAL.txt`
3. `02_MANUAL_ORQUESTRACAO.txt`
4. `03_DECISOES_APROVADAS.txt`
5. `04_PLANO_CONCLUSAO.txt`
6. `05_MAPA_ARQUIVOS.txt`
7. `06_PROTOCOLO_OPENCODE.txt`
8. `07_CALIBRACAO_L3KB0.txt`
9. `08_ESPECIFICACAO_ADAPTADOR_MEMORIA_L3KB.txt`
10. `09_RELATORIO_E2_MULLVAD_Q1.txt`
11. `10_REVISAO_E2_MULLVAD_Q1.txt`
12. `11_CONTRATO_PARIDADE_CAUSAL_E1_E2_E3_Q1.txt`
13. `12_RELATORIO_PARIDADE_CAUSAL_Q1.txt`
14. `13_REVISAO_PARIDADE_CAUSAL_Q1.txt`
15. `14_CONTRATO_CALIBRACAO_L3KB_Q1_Q16.txt`
16. `15_HANDOFF_CONTINUIDADE_GEMINI_OPENCODE.txt`

O exportador seleciona fontes explicitamente e registra hashes. Configuração de provedor, chave/API, .env, backup, resultados de participantes, original/HTML inteiro e node_modules não fazem parte do pacote. Não enviar toda a pasta Simulador nem o checkout como substituto desses dezesseis arquivos.

## 2. Criar ou usar a pasta no Drive

1. Em [Google Drive](https://drive.google.com), use a pasta exclusiva informada pelo usuário ou crie `Slingshot Brasil — Orquestração`.
2. Dentro dela, crie `Conhecimento atual` e, se quiser guardar versões antigas, `Histórico`. Mantenha versões antigas fora das fontes ativas do Gem.
3. Em `Conhecimento atual`, escolha Novo → Upload de arquivo e selecione os dezesseis TXT da pasta local `conhecimento`. Espere finalizar.
4. Guarde `MANIFESTO.json` da raiz local como controle; pode enviá-lo à pasta principal do Drive, mas não é uma fonte necessária ao Gem.
5. Use a mesma Conta Google no Drive e no Gemini. Não é necessário tornar a pasta pública.

## 3. Configurar o Gem

1. Abra [Gemini](https://gemini.google.com), entre na área de Gems e crie/edite um Gem chamado `Slingshot Brasil — Orquestrador`.
2. No campo Instruções, cole o conteúdo completo de `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\artifacts\gemini-drive\atual\INSTRUCOES_DO_GEM.txt`.
3. Em Conhecimento → Adicionar arquivos → Drive, selecione os dezesseis TXT de `Conhecimento atual`. Se a interface exigir seleção em lotes, adicione todos os arquivos antes de salvar. Para arquivos do Drive, a ajuda oficial exige atividade ativada e conexão do Google Workspace ao Gemini. A disponibilidade depende da conta/interface; não contratar plano por este roteiro.
4. Salve o Gem. Mantenha as citações de conhecimento habilitadas para conferir fontes.
5. Abra uma conversa com ele e cole `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\artifacts\gemini-drive\atual\MENSAGEM_INICIAL.txt`.

Esses controles são descritos na [ajuda oficial de Gems](https://support.google.com/gemini/answer/15235603?hl=pt-BR). Se adicionar do Drive não estiver disponível, use o upload local dos dezesseis TXT. Isso continua sendo uma cópia que precisa ser atualizada.

## 4. Alternativa em chat comum

No Gemini web, inicie um chat e adicione os dezesseis arquivos pelo Drive ou pelo dispositivo. Como a [ajuda oficial de envio](https://support.google.com/gemini/answer/14903178?hl=pt-BR) limita cada prompt a até dez arquivos, sujeito à disponibilidade, envie `00` a `09` no primeiro comando e `10` a `15` no segundo; só então cole as instruções e a mensagem inicial. O chat comum não garante aplicação das mesmas instruções em novos chats: anexar/referenciar o conjunto e repetir a entrada ao retomá-los.

Se o Gemini for CLI/Antigravity, abrir o checkout correto, conferir leitura de AGENTS.md/GEMINI.md e ferramentas/permissões. Não presumir que a configuração do Gem web governa o agente local.

## 5. Conferir antes de transferir a orquestração

A resposta inicial deve identificar a revisão e o pacote realmente lidos, checkout, papéis, próxima tarefa e invalidação da calibração antiga. Isso comprova leitura básica; não encerra a transição.

Se a resposta disser que nenhuma fonte foi lida, não peça ao Codex/OpenCode para transcrever novamente os mesmos arquivos. Edite o Gem, confira se os dezesseis TXT aparecem em Conhecimento, substitua-os pelas versões da pasta local `conhecimento`, salve e abra uma conversa nova. Cole a versão atual de `MENSAGEM_INICIAL.txt`. Se ainda falhar, use um chat comum e anexe diretamente os dezesseis TXT pelo dispositivo em dois comandos; essa resposta deve citar a revisão e o identificador comuns dos cabeçalhos.

Validar uma etapa real com Codex: Gemini produz um contrato utilizável para explorer/worker/revisor, recebe provas de execução, distingue resultados de alegações, concilia limites e prepara atualização correta do estado. Codex confirma arquivos/testes e registra problemas. O usuário decide quando retirar a coorquestração. Receber documentos é preparação contextual, não treinamento dos pesos do modelo.

## 6. Manutenção a cada etapa

1. O escritor local atualiza estado/relatórios e incrementa a revisão conforme o manual.
2. O coordenador regenera o pacote no checkout com:

```powershell
Set-Location -LiteralPath 'C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br'
node tools/export-gemini-drive.cjs
```

3. Envie ao Drive as versões novas dos dezesseis TXT. Preferir Gerenciar versões → Fazer upload de nova versão para cada TXT existente, quando esse controle estiver disponível, mantendo o mesmo arquivo/ID. Se criar novos arquivos, retire as fontes antigas do Gem e selecione o conjunto novo; apenas duplicar nomes não basta.
4. Se as instruções permanentes mudarem, atualize também o campo Instruções com `INSTRUCOES_DO_GEM.txt`.
5. Peça ao Gemini para conferir a nova revisão/pacote em 00/01. Não presumir atualização instantânea da conversa ou do conhecimento. Se ele ainda ler versão antiga, remova/reanexe fontes e inicie nova conversa se necessário.
6. Registre no estado quais revisões foram realmente enviadas e lidas. Enquanto não houver integração de escrita/sincronização verificada, o upload continua uma ação na interface; Codex pode gerar o pacote local, mas não afirmar que o Drive foi atualizado.

Não é preciso gerar handoff novo para cada chat. A entrada estável é estado + manual + decisões, e o Drive distribui cópias controladas. Os documentos locais continuam sendo a fonte principal.
