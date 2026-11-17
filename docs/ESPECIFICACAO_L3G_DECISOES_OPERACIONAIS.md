# Especificação L3g — decisões operacionais do trio

## Escopo aprovado

O lote vale somente para assistência técnica de celulares (`avam`), minimercado (`dream`) e gráfica/embalagens (`quant`). Ele substitui a dependência das decisões legadas de `research`, `dev` e `marketing` por três frentes de trabalho que não representam empregados: controle e administração, operação e comercial.

Não altera Ada, importador, Supabase, rede, credenciais, crédito, nota, exportação, `VENTURE_MARKETS`, candidatos, concorrentes gerais, os outros nove empreendimentos ou `source/index.original.html`.

## Efeito e prazo

Cada trimestre exige uma escolha em cada frente. A escolha cobra somente seu custo didático imediato (0 ou 2 unidades internas) e registra um efeito tipado para **o trimestre seguinte**. A apuração operacional do trimestre corrente ocorre antes desses efeitos, evitando dupla contagem de caixa, estoque, capacidade e custo.

Os multiplicadores aprovados são provisórios e didáticos:

| Frente | Efeitos possíveis | Faixa |
|---|---|---|
| Controle e administração | qualidade, capacidade ou estoque-alvo | 1,03–1,10 |
| Operação | capacidade, qualidade ou estoque-alvo | 1,05–1,15 |
| Comercial | demanda; em alternativa imprudente, qualidade ou capacidade | 0,95–1,15 |

Os valores não representam salários, preços ou práticas de mercado. Contratos externos e pessoas permanecem sob `brBusiness`; decisões não criam empregados, folha, AP, participação societária, clientes SaaS ou receita direta.

## Persistência e compatibilidade

`brOperations` recebe `decisionVersion: 1`, `decisionEffects` e o trimestre já aplicado. Saves L3f sem esses campos continuam válidos e usam efeitos neutros. Um save L3g com versão desconhecida, multiplicador não finito, trimestre impossível ou não positivo é recusado antes de restaurar qualquer estado. Efeitos pendentes são preservados no save e consumidos uma única vez pela próxima apuração; uma reentrada em `commitTurn` não reaplica custo ou multiplicador.

## Arquivos permitidos

- `locales/operational-decisions.pt-BR.json`
- `operational-decisions-runtime.js`
- `operations-runtime.js`
- `tools/operational-decisions-patch.cjs`
- `tools/build.cjs`
- `tests/operational-decisions.test.cjs`

`index.html` é apenas produto do build.

## Critérios de aceite

1. O trio mostra exatamente as três frentes e três opções por frente.
2. Não há gerente SaaS, conselho de investidores, minijogo, mercado, fomento britânico, rival, narrativa bootstrap, choque de IA, mensagem legada de superávit ou evento de receita SaaS nessas rotas.
3. A escolha é aplicada uma vez, no trimestre seguinte, e não altera vínculos de pessoas nem AP.
4. Save/restauração mantém efeitos pendentes; saves L3f sem decisões abrem sem mutação silenciosa.
5. O trio completa trimestre, inclusive resultado negativo, e mantém caixa, inventário, recebíveis e marcos consistentes.
