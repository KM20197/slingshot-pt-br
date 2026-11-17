> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Handoff Astra — equipe, contratos e direção arquitetural

## Decisão requerida

Avaliação somente leitura e proposta, sem editar arquivos, executar build/testes, staging, commit ou push.

O jogo adaptado deve representar gestão de pequenos negócios de serviços, comércio e indústria. A intenção do usuário é substituir a contratação inicial de “Gerente Geral” e “Gerente Comercial/Marketing” por contratos de assessoria administrativa-contábil e marketing-promoção. Permaneceriam como pessoas contratadas o supervisor de operações (ou equivalente por empreendimento) e a equipe de trabalho.

Decidir também se a evolução deve continuar como adaptação incremental do Slingshot ou se é melhor iniciar um jogo novo, reaproveitando somente partes selecionadas e os conceitos operacionais do Johgo. Requisitos invariáveis: execução offline, sem backend, sem coleta de dados, sem Supabase e sem credenciais.

## Estado técnico confirmado

- A equipe de gestão é hoje estruturada por quatro chaves legadas: `research`, `dev`, `marketing`, `hr`.
- `research` é exibido como Gerente/Responsável Administrativo e de Qualidade; `dev`, como Supervisor/Responsável de Operações; `marketing`, como Gerente/Responsável Comercial; `hr`, como Pessoas.
- Esses papéis não são só texto: salários entram em `metrics.burn`; bônus alteram métricas; `hr` eleva `maxAP` para `baseAP + 1`.
- A contratação posterior comum usa candidatos legados e ainda exibe a lógica `Team Capacity`, `Post Job`, headcount e AP por equipe.
- `operations-v1` está implementado somente para assistência técnica (`avam`), minimercado (`dream`) e gráfica/embalagens (`quant`).
- `VENTURE_MARKETS` foi ocultado e seus efeitos legados estão isolados para esses três IDs; não é parte da decisão de equipe.

## Caminhos de leitura obrigatória

- `docs/HANDOFF_LLM_COMPLETO.md`
- `docs/DECISOES_APROVADAS.md`
- `docs/REVISAO_L3D_2026-09-30.md`
- `management-runtime.js`
- `locales/management-setup.pt-BR.json`
- `locales/setup-ui.pt-BR.json`
- `locales/tutorial.pt-BR.json`
- `tools/setup-patch.cjs`
- `tools/dashboard-localization-patch.cjs`
- `operations-runtime.js`
- `locales/operating-models.pt-BR.json`
- `source/index.original.html` (somente leitura)

## Entregáveis esperados

1. Uma decisão recomendada: adaptação incremental, reescrita total ou arquitetura híbrida; com critérios verificáveis de custo, risco de save, cobertura de mecânicas e compatibilidade offline.
2. Um modelo comum de pessoas e contratos para os 12 empreendimentos:
   - proprietário/fundador;
   - supervisor de operações ou equivalente por setor;
   - equipe operacional;
   - assessoria administrativa-contábil;
   - assessoria comercial/marketing-promoção;
   - eventual gestão de pessoas;
   - distinção entre salário, contrato recorrente, custo variável e capacidade/AP.
3. Regras explícitas para que contratos externos não sejam apresentados como empregados nem aumentem automaticamente a equipe. Dizer se algum contrato pode afetar AP, e por qual mecanismo didático não ligado a headcount.
4. Matriz de impacto em: caixa/despesas, métricas, AP, cidades, metas, BMC, pivôs, eventos, saves, exportação e telas de resultado.
5. Proposta fechada de lote vertical inicial para `avam`, `dream` e `quant`, com arquivos permitidos/proibidos e testes de aceite.
6. Inventário dos textos em inglês e da lógica Startup citados pelo usuário, classificados em: correção de apresentação, adaptação de conteúdo, substituição de regra, ou lote posterior. Incluir contratação/equipe, Finanças, How to Play, FAQ, funding, eventos, decisões e resultado/PDF.

## Limites

- Não assumir que patente, VC, equity, ARR/MRR, startup, grants britânicos ou SaaS devam ser apenas traduzidos.
- Não criar parâmetros reais de salário, taxa, contabilidade ou legislação sem fonte e aprovação.
- Não apagar estruturas de partidas salvas no primeiro lote.
- Não alterar `source/index.original.html`.
