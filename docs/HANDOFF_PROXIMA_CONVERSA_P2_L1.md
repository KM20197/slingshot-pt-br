> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Handoff — Continuação da adaptação P2 após L0 e L1

> Estado em 28/09/2026. Este documento orienta a próxima conversa deste projeto. Não autoriza implementação, build, testes, staging, commit ou push por si só.

## 1. Ponto de partida obrigatório

- **Checkout correto:** `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`.
- **Não confundir com:** `C:\Users\Administrador\Downloads\Stingshot`, que contém referências e anexos, não o checkout a editar.
- **Fonte canônica imutável:** `source/index.original.html`.
- **SHA-256 obrigatório da fonte:** `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.
- **Saída gerada:** `index.html`; nunca editar manualmente como fonte de verdade.
- **Leitura inicial obrigatória:** `AGENTS.md`, `docs/HANDOFF_LLM_COMPLETO.md`, `docs/DECISOES_APROVADAS.md`, este handoff e o roteiro pertinente em `docs/agent-routes/`.

O arquivo `AGENTS.md` prevalece sobre este resumo quando houver divergência.

## 2. Estado aprovado e commits locais

| Commit | Conteúdo | Situação |
|---|---|---|
| `4da1a7c` | `docs/MATRIZ_P2.md` | matriz documental P2 aprovada e registrada |
| `7fbc333` | `docs/PACOTE_DECISAO_P2_1.md` | briefing conceitual P2.1 aprovado e registrado |
| `bff7d72` | `docs/ESPECIFICACAO_CONCEITUAL_L0.md` e `docs/REVISAO_L0_2026-09-27.md` | L0 aprovado e registrado |
| `3671475` | `docs/ESPECIFICACAO_TECNICA_L1.md` | L1 aprovado e registrado |

L0 define a adaptação conceitual dos 12 empreendimentos. L1 define os contratos técnicos para futuras camadas de apresentação, tutorial e Ada. Nenhum dos dois autoriza alterar código.

## 3. Decisões de conteúdo vigentes

Os IDs internos permanecem na ordem abaixo e não podem mudar:

| ID | Caso brasileiro aprovado |
|---|---|
| `aether` | Clínica popular |
| `edu` | Academia |
| `avam` | Assistência técnica de celulares |
| `voed` | Restaurante por quilo |
| `legal` | Farmácia |
| `dream` | Minimercado |
| `arene` | Loja de roupas |
| `vanguard` | Material de construção |
| `terra` | Produtos de limpeza |
| `sorgente` | Alimentos congelados |
| `cyber` | Confecção |
| `quant` | Gráfica/embalagens |

Restrições de saúde e privacidade não podem ser atenuadas:

- `aether`: sem dados pessoais ou de pacientes, triagem, diagnóstico, exames, prescrição, aconselhamento clínico ou alegação terapêutica;
- `legal`: sem venda ou dispensação de medicamentos, receitas, dados de pacientes, diagnóstico, aconselhamento médico ou alegação clínica;
- `terra`: sem alegação de eficácia, esterilização, aplicação hospitalar, certificação, registro ou conformidade regulatória;
- `avam`: sem coleta, extração, visualização ou menção a dados pessoais nos aparelhos;
- Ada: apenas cenários fictícios, com aviso explícito antes de serviço externo e sem dados pessoais, médicos, financeiros reais ou corporativos factuais.

Em lotes descritivos, continuam congelados IDs, `archetype`, `revenueModel`, `crowdfundFit`, `staff`, `burn`, números, fórmulas, probabilidades, multiplicadores, ordem de arrays, chaves internas, seletores e marcadores `[NEW]`.

## 4. Diagnóstico da versão parcial rejeitada

O lote P2.2a aplicou 60 textos em caminhos de catálogo aprovados: 12 `COMPANIES.desc` e 48 campos `VENTURE_DETAILS.product`, `customers`, `revenue` e `competition`. A correção final desses 60 valores foi auditada como literalmente consistente nos catálogos e em `locales/structures.pt-BR.json`.

Essa entrega **não é a adaptação brasileira final**. A análise do usuário da versão gerada foi aceita como diagnóstico de produto: permaneceram nomes e setores originais, textos de `whyWork` e `whyHard`, BMC, marcos, pivôs, tutorial, referências britânicas e caminhos da Ada incompatíveis com a proposta brasileira. Não tratar P2.2a como aprovada de forma integrada e não ampliar seus catálogos por edição cega.

As mudanças relacionadas a P2.2a continuam no diretório de trabalho como alterações preexistentes. Elas não devem ser descartadas, corrigidas, incluídas no staging ou usadas como prova de conclusão sem lote, diff, testes e revisão próprios.

## 5. Achados técnicos L1 confirmados

- `tools/build.cjs` lê a fonte canônica, valida o SHA, aplica traduções estruturadas e usa `replaceOnce` e `replaceMethod` para patches delimitados.
- O build injeta módulos locais antes de `const game = new Game();`; `index.html` resulta desse processo.
- A grade e o modal exibem diretamente `company.name` e `company.archetype`. Uma futura apresentação brasileira precisa de camada de leitura indexada por `company.id`; não pode mutar objetos de `COMPANIES` apenas para localização.
- A restauração encontra a empresa por `companyId`. `companyName` e `startupName` são estado exibido e devem ser preservados, sem se tornarem chaves.
- Pivôs reatribuem `this.company.name`. Pivôs estão fora do primeiro lote de apresentação e exigem especificação própria.
- `locales/pt-BR.json` trata somente texto estático do DOM e atributos permitidos. Tutorial, cartões e dicas dinâmicas exigem patch de apresentação separado.
- Existem dois fluxos Ada: o link externo direto “Meet Ada” e o carregador local `ada-loader`. O carregador atual contém rótulos ingleses, correspondência por palavras-chave, fallback silencioso e pode alterar o nome da empresa. Os dois fluxos devem ser tratados via build e nunca pela edição da fonte canônica.

## 6. Próximo gate recomendado: L1a — nomes e setores exibidos

**Estado:** pendente de autorização expressa do usuário para implementação.

**Objetivo único:** exibir, por ID, os 12 nomes e setores brasileiros aprovados, sem alterar dados canônicos do motor ou o comportamento econômico.

**Escopo candidato, a confirmar em inspeção prévia:**

- novo módulo local de apresentação, somente leitura, por exemplo `company-display.js`;
- inclusão controlada do módulo em `tools/build.cjs`;
- patches delimitados das telas de grade, modal e elementos de exibição durante a partida;
- `index.html` apenas como resultado do build;
- testes e revisão somente depois de a mudança ser autorizada e implementada.

**Fora de L1a:** pivôs, `COMPANIES.name`, `COMPANIES.archetype`, `VENTURE_DETAILS`, BMC, marcos, mercados, rivais, fórmulas, saves, tutorial dinâmico, Ada, financiamento, nota, dados pessoais e qualquer mudança em `source/index.original.html`.

Antes de implementar L1a, fazer uma exploração somente leitura dos consumidores de nome e setor, inclusive telas de resultado, exportação e restauração. Não presumir que os quatro pontos conhecidos esgotam os consumidores.

## 7. Fluxo de trabalho e papéis

### Coordenador — Codex nesta conversa, substituto temporário do Antigravitu

Enquanto o Antigravitu não estiver liberado, o Codex coordena o lote: interpreta decisões aprovadas, delimita escopo, faz ou supervisiona a implementação autorizada, executa validações e preserva o estado preexistente. Esse papel não equivale a uma revisão independente do próprio trabalho.

O coordenador deve decidir questões técnicas rotineiras com base nos documentos aprovados. Deve parar e pedir decisão do usuário quando houver mudança de escopo, escolha pedagógica/econômica nova, acesso externo, custo, dados pessoais, publicação ou alteração dos campos congelados.

### Gemini — orientador de planejamento e crítica

Use o Gemini para analisar estratégia, riscos, ordem de lotes e qualidade de prompts. Não aceitar afirmações factuais de arquivo, linha, seção, contagem ou resultado de comando sem evidência literal fornecida pelo checkout. O Gemini não escreve código, não executa validação local, não autoriza implementação e não substitui revisão independente.

Quando houver divergência entre uma orientação do Gemini e fonte/relatório verificável, prevalecem a fonte, as decisões aprovadas e o revisor com evidência.

### OpenCode `explore` — leitura técnica

Usar somente para inventário direcionado, com Read, Glob e Grep nos arquivos autorizados. Sem shell, Git, Node.js, build, testes, rede, escrita, delegação ou criação de relatório em arquivo. Deve informar caminhos e citações reais, declarar ausências e parar ao entregar o relatório.

### OpenCode `slingshot-worker` — implementação autorizada

Usar apenas após autorização explícita do usuário e definição de lote fechado. O worker não delega, não aprova a própria mudança e não publica. Antes e depois do lote, deve apresentar `git status --short`; deve tocar somente os arquivos autorizados e não fazer staging, commit ou push salvo autorização expressa.

### OpenCode `gauntlet-reviewer` / `slingshot-reviewer` — revisão independente

Usar em sessão separada, somente leitura, depois de o coordenador executar as verificações. Não permitir shell, edição, Git, Node.js, build, testes, rede ou delegação. Exigir nota de 0 a 10, veredito, linhas reais, citações literais, achados e declaração de permissões efetivas.

Não declarar isolamento externo absoluto: o ambiente pode conceder ao revisor acesso gerenciado às próprias saídas de ferramentas. Não incluir credenciais ou dados de participantes nas evidências fornecidas.

### Papel `Mastery`

Não existe papel `Mastery` definido no OpenCode deste projeto. Não criar TOML, agentes, rotas ou configurações para simulá-lo sem decisão explícita do usuário. Ele não é necessário para L1a: os papéis vigentes são `explore`, `slingshot-worker` e `gauntlet-reviewer`/`slingshot-reviewer`.

## 8. Processo obrigatório por lote funcional

1. Ler `AGENTS.md`, decisões, este handoff e roteiro pertinente.
2. Confirmar o usuário autorizou o lote específico.
3. Executar `git status --short` e registrar alterações preexistentes; nunca fazer limpeza ampla, `reset --hard` ou `checkout --`.
4. Fazer exploração restrita se faltar evidência de caminho, consumidor ou impacto.
5. Definir arquivos permitidos, arquivos proibidos, critérios de aceite e limites do lote.
6. Implementar somente o lote aprovado.
7. Inspecionar o diff e executar `git diff --check`.
8. Para código, executar `.check_project.ps1`; ele gera `index.html` e artefatos ignorados. Conferir diffs depois.
9. Fazer a verificação visual pertinente em navegador local, registrando passos e evidência. Sem navegador disponível, registrar a pendência; não substituir por leitura de fonte.
10. Enviar diff, saídas sanitizadas e evidências ao revisor independente.
11. Corrigir e reavaliar até nota mínima 9/10, em no máximo três ciclos. Ao persistir pendência relevante no terceiro, registrar `BLOCKED_FOR_REVIEW`.
12. Só após aceite, fazer staging seletivo, `git diff --cached --check`, commit local e confirmação de status. Push depende de instrução explícita.

## 9. Estado do diretório de trabalho ao encerrar esta conversa

O commit mais recente é `3671475 docs: formalizar especificação técnica L1`.

Há alterações e arquivos não rastreados preexistentes fora dos commits L0/L1, incluindo `.opencode/agents/gauntlet-reviewer.md`, `AGENTS.md`, documentos de planejamento, `index.html`, `locales/structures.pt-BR.json`, `tools/catalogue-first-structures.cjs` e `tools/catalogue-venture-details.cjs`. Há também diversos documentos não rastreados e um arquivo com nome composto por glifos. O próximo agente deve obter o status atual com `git status --short`, preservar tudo e nunca assumir autoria dessas mudanças.

Não há afirmação de sincronização atual com GitHub neste handoff. Não fazer push, fetch ou publicação sem instrução específica.

## 10. Prompt inicial recomendado para a próxima conversa

> Continue o projeto em `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`. Leia primeiro `AGENTS.md`, `docs/HANDOFF_PROXIMA_CONVERSA_P2_L1.md`, `docs/HANDOFF_LLM_COMPLETO.md` e `docs/DECISOES_APROVADAS.md`. O L0 e o L1 estão aprovados nos commits `bff7d72` e `3671475`; P2.2a é parcial e não representa aceitação integrada. Preserve todas as alterações preexistentes. Não implemente, gere, teste, faça staging, commit ou push até confirmar qual lote foi explicitamente autorizado. Enquanto o Antigravitu não estiver disponível, atue como coordenador técnico, sem se apresentar como revisor independente. Use Gemini somente para planejamento crítico e OpenCode conforme os papéis definidos neste handoff.
