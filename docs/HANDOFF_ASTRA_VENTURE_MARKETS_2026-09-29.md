> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Handoff para Astra — `VENTURE_MARKETS`

## Configuração solicitada

- Modelo: Astra
- Esforço: médio
- Papel: arquitetura e revisão técnica; não implementar
- Checkout: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`

## Objetivo

Decidir uma arquitetura segura para adaptar progressivamente o subsistema `VENTURE_MARKETS` à edição brasileira, começando pelos três empreendimentos que já têm núcleo econômico operacional:

- `avam`: assistência técnica de celulares;
- `dream`: minimercado;
- `quant`: gráfica/embalagens.

O mecanismo conceitual deve permanecer: conhecimento de mercado, entendimento de clientes e prontidão para alternativas estratégicas. O catálogo e os efeitos herdados de startups de tecnologia não podem continuar sendo apresentados como se fossem compatíveis com esses empreendimentos.

## Limites obrigatórios

- Somente leitura. Não editar arquivos, não executar build/testes, não fazer staging, commit ou push.
- Não propor remoção integral de `VENTURE_MARKETS` sem mapear todos os consumidores e impactos em saves.
- Não inventar parâmetros econômicos, preços, tamanho de mercado, salários, probabilidades ou regras de financiamento.
- Não alterar Ada/importador, crédito, exportação, eventos gerais ou concorrentes gerais neste estudo.
- Não depender dos 192 perfis de candidatos: eles estão em adaptação externa.
- Preservar IDs, chaves de save e o hash de `source/index.original.html`.

## Estado confirmado

1. `VENTURE_MARKETS` é mais que apresentação. Ele alimenta `marketIntel`, alternativas/pivôs, oportunidades, informações competitivas e termos de financiamento. O estado é salvo e restaurado.
2. O catálogo atual é o da versão original de startups de tecnologia, inclusive para `avam`, `dream` e `quant`; portanto, seus compradores, concorrência, ciclos e insights são incompatíveis com a edição brasileira.
3. O núcleo `operations-v1` já calcula, para os três IDs acima, demanda, capacidade, estoque/insumos, ordens concluídas, perdas/refugo e recebimentos. Seus modelos estão em `locales/operating-models.pt-BR.json` e a lógica em `operations-runtime.js`.
4. BMC e metas desses três IDs já usam os modelos operacionais. Eles não devem voltar a prometer SaaS, API, licenciamento ou contratos institucionais inexistentes.
5. A interface de novos candidatos é salarial, sem nova equity. Saves antigos com `hiredStaff` e `equityGrants` continuam aceitos e preservados.
6. Fomento e Cap Table estão ocultos visualmente, mas a lógica interna foi preservada.

## Arquivos e pontos de partida

- `source/index.original.html`
  - `const VENTURE_MARKETS` inicia aproximadamente na linha 17607.
  - inicialização e renderização de mercado: aproximadamente linhas 66950–68194.
  - consumidores adicionais: referências a `marketIntel`, `marketOpp` e `VENTURE_MARKETS` em todo o arquivo.
  - salvamento/restauração: aproximadamente linhas 80918 e 81045.
- `operations-runtime.js`
- `locales/operating-models.pt-BR.json`
- `tools/operations-patch.cjs`
- `save-validation.js`
- `docs/HANDOFF_LLM_COMPLETO.md`
- `docs/DECISOES_APROVADAS.md`
- `AGENTS.md`

## Perguntas que a análise deve responder

1. Quais consumidores de `VENTURE_MARKETS`, `marketIntel`, `marketOpp` e alternativas realmente alteram estado econômico, financiamento, metas, pivôs, rivais, interface e save?
2. Quais partes podem ser preservadas como mecanismo genérico de conhecimento comercial e quais são inseparáveis da lógica de startup original?
3. Para `avam`, `dream` e `quant`, qual estrutura de dados mínima deve substituir o catálogo atual sem inventar números? Diferenciar explicitamente:
   - contexto narrativo;
   - estado calculado já disponível em `operations-v1`;
   - efeito calculado existente que pode ser reaproveitado;
   - efeito que deve permanecer desligado ou pendente de calibração.
4. É possível introduzir um catálogo local por ID que mantenha as chaves de save existentes e seja compatível com saves anteriores? Descrever migração/fallback.
5. Como impedir que conhecimento de mercado melhore termos de financiamento ou pivôs de modo incoerente enquanto a calibração econômica não foi aprovada?
6. Qual é o menor lote inicial seguro, com arquivos permitidos/proibidos e testes de aceitação?

## Formato obrigatório da resposta

Entregue aqui, para ser encaminhado ao chat coordenador:

1. Veredito: manter, encapsular/substituir progressivamente ou remover partes específicas.
2. Tabela de consumidores: caminho, função, estado alterado, impacto em save e risco.
3. Matriz dos três empreendimentos: assistência técnica, minimercado e gráfica/embalagens.
4. Proposta fechada do lote inicial: arquivos permitidos, proibidos, mudanças de dados, mudanças de código e critérios de aceite.
5. Riscos e decisões que exigem autorização humana.

Não reproduza arquivos inteiros nem trate o resultado como autorização para editar. A saída será trazida de volta ao chat coordenador para decisão e implementação.
