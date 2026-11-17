# Especificação proposta — L3f: operação, pessoas e contratos v1

Status: implementado em 30/09/2026 após autorização do usuário e aprovado na revisão independente (9/10, sem bloqueador); aguardando inspeção visual. Os parâmetros são didáticos e continuam sujeitos a calibração futura, sem representar condições reais.

## Objetivo

Corrigir o fluxo econômico do núcleo `operations-v1` e introduzir, exclusivamente para assistência técnica de celulares (`avam`), minimercado (`dream`) e gráfica/embalagens (`quant`), uma representação compatível de proprietário, empregados, contratos externos e capacidade operacional.

## Correções obrigatórias antes da nova interface

1. A receita operacional deve chegar ao caixa pelo recebimento efetivo do trimestre, sem depender de `customers` do modelo SaaS legado.
2. O livro operacional deve permitir resultado líquido negativo e validar cada campo pelo seu domínio: valores de receita, custo e recebimento não negativos; resultado líquido pode ser negativo.
3. Compras de estoque ou insumo devem afetar o caixa uma vez. O custo consumido deve servir ao resultado operacional, sem repetir a saída de caixa já registrada pela compra.
4. O estado salvo deve identificar explicitamente sua versão de regras. Saves legados continuam no caminho legado; saves do trio já existentes devem continuar restauráveis ou receber adaptação determinística e documentada no restaurador, nunca alteração silenciosa por ID.

## Regras de Pessoas e Contratos v1

| Categoria | Regra |
|---|---|
| Proprietário | Participa da gestão; não é empregado, não recebe salário automático e não amplia AP. |
| Supervisor de operações | Empregado; custo recorrente e efeito explícito sobre capacidade operacional. |
| Equipe operacional | Empregados; custo recorrente e efeito explícito sobre atendimento, produção ou reposição. |
| Assessoria administrativa e contábil | Contrato externo recorrente; gera custo, não é pessoa e não amplia AP. |
| Marketing e promoção | Contrato externo recorrente; gera custo e efeito comercial explícito, não é pessoa e não amplia AP. |
| Gestão de pessoas | Não é contratação automática no trio. Uma função futura só poderá afetar capacidade se a regra e o teste forem aprovados. |

Os contratos podem terminar no trimestre seguinte, mas não alteram `metrics.staff`, `hiredStaff`, `maxAP`, `baseAP` ou o contador de empregados. A capacidade do trio deve ser calculada pelo domínio operacional novo, e não por bônus automáticos de AP do mecanismo de startup.

Para preservar o painel legado, `metrics.staff` exibe proprietário + supervisor + equipe operacional. `startingStaff` recebe o mesmo total no início; portanto o proprietário não cria bônus de AP, não entra na folha e não é tratado como contratação posterior.

## Compatibilidade e nota

- Não remover, reordenar ou reinterpretar `team`, `hiredStaff`, `metrics.staff`, `brOperations` ou `brManagement` de saves legados.
- Novo estado recomendado: `brBusiness`, com `version`, `companyId`, empregados, contratos, capacidade e regras de caixa próprias. A presença de `brBusiness.version` seleciona a rota nova; sua ausência preserva a rota anterior.
- A fórmula acadêmica, as parcelas, os parâmetros de crédito, a chave da turma e a exportação local não mudam neste lote.
- A chave de turma continua necessária somente para assinar o arquivo de nota exportado. Jogar, salvar e retomar não dependem dela.

## Arquivos permitidos para futura implementação

- Novos: `people-contracts-runtime.js`, `business-adapter.js`, `locales/people-contracts.pt-BR.json`, `locales/business-ui.pt-BR.json`, `tests/people-contracts.test.cjs`, `tests/business-cashflow.test.cjs`.
- Alterações delimitadas: `operations-runtime.js`, `save-validation.js`, `tools/operations-patch.cjs`, novo `tools/people-contracts-patch.cjs`, `tools/build.cjs`, `tools/setup-patch.cjs`, `tools/dashboard-localization-patch.cjs`, `locales/operating-models.pt-BR.json`.
- `index.html` somente como resultado do build.

## Arquivos e áreas proibidos

- `source/index.original.html`.
- Ada/importador, Supabase, rede, credenciais e APIs.
- Os outros nove empreendimentos.
- Taxas, prazos, amortização e regras de crédito.
- Eventos gerais, concorrentes, `VENTURE_MARKETS`, exportação acadêmica e cálculo da nota.
- Catálogo dos 192 candidatos.

## Testes de aceite do futuro lote

1. Para cada um dos três IDs, receita recebida altera caixa sem `customers` SaaS.
2. Um trimestre operacional negativo é salvo e restaurado sem erro, preservando o livro.
3. Uma reposição de estoque/insumo é descontada uma vez do caixa e corretamente refletida no resultado operacional.
4. Contrato externo não altera número de empregados nem AP; empregado altera somente a capacidade definida pela regra nova.
5. Save legado sem `brBusiness` restaura sem alteração de estado econômico.
6. Jogar, salvar e retomar funcionam sem chave de turma; exportar nota continua exigindo chave.
