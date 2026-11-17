> **HISTÓRICO / ESCOPO DATADO — reconciliação de 07/10/2026.** Estado vivo: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br\docs\ESTADO_ATUAL.md`; procedimentos: `docs/MANUAL_ORQUESTRACAO.md`; entrada Gemini atual: `docs/PROMPT_GEMINI_ORIENTADOR.md`. Não anexar este arquivo como instrução corrente ao Gem nem repetir seus gates sem conferir o estado. Gemini e Codex coorquestram; OpenCode explora, implementa e revisa. O conteúdo abaixo foi preservado como evidência/procedimento do escopo indicado.

# Handoff para Astra Médio — L3k-b: pessoas e contratos dos seis modelos restantes

**Data:** 06/10/2026  
**Papel solicitado:** arquitetura econômica e proposta revisável, somente leitura.  
**Não implementar código, não gerar `index.html`, não alterar JSON, não executar staging, commit, push, publicação ou Supabase.**

## Contexto validado

Repositório correto: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`.

`source/index.original.html` é imutável e deve manter SHA-256:

```text
a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61
```

Em 06/10/2026, `check_project.ps1` retornou exit 0: build aprovado e **263/263 testes aprovados**. A árvore de trabalho é intencionalmente suja; preservar alterações preexistentes e não resetar arquivos.

Os doze empreendimentos já possuem modelos em `locales/operating-models.pt-BR.json` e estão isolados do motor legado de mercado por `market-isolation.js`:

```text
avam, dream, quant, vanguard, legal, arene,
voed, aether, edu, cyber, terra, sorgente
```

O L3k-a foi implementado e revisado independentemente com nota final 9,8/10. Ele somente expandiu o isolamento de mercado para os doze IDs e não alterou fórmulas, valores ou saves.

## Problema a resolver

`people-contracts-runtime.js`, `business-adapter.js` e `locales/people-contracts.pt-BR.json` cobrem apenas:

```text
avam, dream, quant, vanguard, legal, arene
```

Os seis empreendimentos abaixo já usam `SlingshotOperations`, porém ainda não possuem equipe local, contratos externos ou efeitos pelo adaptador de capacidade e demanda:

| ID | Empreendimento | Família operacional |
| --- | --- | --- |
| `voed` | Restaurante por quilo fictício | `retail_inventory` |
| `aether` | Atendimento ambulatorial fictício agregado | `service_recurring` / atendimento |
| `edu` | Academia fictícia com base recorrente agregada | `service_recurring` / associação |
| `cyber` | Confecção fictícia | `manufacture_to_order` |
| `terra` | Produtos de limpeza fictícios | `manufacture_to_order` |
| `sorgente` | Alimentos congelados fictícios | `manufacture_to_order` |

O runtime atual assume, para cada negócio coberto, exatamente:

- proprietário fora da folha;
- um supervisor operacional;
- uma categoria de equipe operacional, com quantidade inicial, máximo, custo trimestral e bônus de capacidade por pessoa;
- contrato administrativo/contábil opcional, com custo trimestral;
- contrato comercial opcional, com custo trimestral e bônus aditivo de demanda;
- nenhuma concessão de pontos de atenção por contratos ou empregados;
- estado salvo `brBusiness` na versão 1, com `employees`, `contracts`, custos calculados e `costsApplied`.

## Decisões já aprovadas que devem ser preservadas

- A clínica é uma simulação ambulatorial fictícia e agregada: sem pacientes individuais, prontuários, decisões clínicas, diagnóstico ou aconselhamento médico.
- A academia usa somente base agregada, entradas, saídas e capacidade: sem dados individuais de alunos, saúde ou desempenho físico.
- A produção de alimentos congelados é fictícia e agregada: sem validade, cadeia de frio, nutrição, alergênicos, segurança alimentar ou alegações de saúde.
- Nenhum contrato externo é empregado ou concede AP.
- Custos e parâmetros são didáticos, não salários, preços ou recomendações reais.
- Não mudar IDs, fórmulas de operações, parâmetros de `operating-models`, BMC, pivôs, marcos, eventos ou versão/formato do save nesta proposta.

## Tarefa para Astra Médio

Produza uma **proposta concreta e completa, sem código**, para L3k-b. A proposta precisa indicar, para cada um dos seis IDs:

1. rótulo do supervisor e rótulo da equipe operacional;
2. quantidade inicial e máxima de equipe;
3. custo trimestral didático do supervisor e de cada integrante da equipe;
4. bônus de capacidade do supervisor e de cada integrante;
5. rótulo e custo do contrato administrativo/contábil;
6. rótulo e custo do contrato comercial;
7. bônus inteiro de demanda do contrato comercial;
8. justificativa de coerência com a família operacional e com os parâmetros já ativos;
9. prova de que nenhum termo introduz dados sensíveis, prática profissional regulada ou alegação de conformidade.

Também deve definir a alteração mínima de arquitetura e testes:

- manter `version: 1` e o formato atual de `brBusiness`, se possível;
- confirmar que os seis novos modelos podem usar o mesmo contrato de `people-contracts-runtime.js` sem campos novos;
- propor testes de configuração, validação, contratação, desligamento, contratos, redução emergencial, capacidade, demanda e restauração para todos os doze IDs;
- testar que operações sem `brBusiness` continuam com os valores-base;
- testar que os seis novos IDs não passam a receber executivos SaaS, AP ou participação societária.

## Critérios para aceitar a proposta

- Uma tabela completa de valores, não faixas nem exemplos abertos.
- Valores comparados explicitamente aos seis perfis existentes para evitar salto arbitrário de custo ou capacidade.
- Nenhuma inferência de salário, preço ou prática real brasileira.
- Mudanças de arquivo listadas, mas nenhuma aplicada.
- Plano de validação com `npm run build`, testes direcionados, `check_project.ps1`, `git diff --check`, hash da fonte e revisão independente mínima de 9/10.
- Separar fatos confirmados de recomendações do Astra.

## Arquivos de referência prioritários

- `AGENTS.md`
- `docs/DECISOES_APROVADAS.md`
- `docs/HANDOFF_LLM_COMPLETO.md`
- `docs/AUDITORIA_L3K_INTEGRACAO_OPERACIONAL_2026-10-06.md`
- `docs/PROPOSTA_L3KA_ISOLAMENTO_MERCADOS_2026-10-06.md`
- `locales/people-contracts.pt-BR.json`
- `people-contracts-runtime.js`
- `business-adapter.js`
- `tests/people-contracts.test.cjs`
- `locales/operating-models.pt-BR.json`
- `docs/ESPECIFICACAO_L3I_SERVICOS_2026-10-06.md`
- `docs/ESPECIFICACAO_L3J_INDUSTRIA_2026-10-06.md`

## Saída esperada

Entregar um documento em português do Brasil, pronto para o usuário aprovar ou ajustar. Não declarar L3k-b implementado, validado ou revisado; o objetivo deste handoff é somente obter uma proposta econômica concreta.
