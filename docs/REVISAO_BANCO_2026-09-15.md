# Revisão do esquema de recriação — 15/09/2026

Nota inicial independente: **9,2/10**. Nota final: **9,3/10**.

O avaliador conferiu o bootstrap, as referências históricas, a consulta de metadados, o retrato do esquema e os testes locais. Confirmou **71 testes aprovados**, incluindo quatro testes com PostgreSQL em memória por PGlite 0.5.8. A recomendação foi tornar a sequência de recriação explícita no README principal; isso foi corrigido e reavaliado. A última reavaliação foi documental e não repetiu os testes.

## Evidências

- As 38 colunas, sete restrições de chave e sete índices recriados são comparados com os metadados consultados no projeto existente. Tipos, nulabilidade, valores padrão e identidade fazem parte da comparação.
- O bootstrap cria e restringe o acesso na mesma transação. Sua reaplicação falha sem substituir dados já presentes.
- Os testes simulam permissões automáticas amplas e verificam sua revogação. `anon` e `authenticated` não leem tabelas de participantes, não gravam nas quatro tabelas e não acessam a sequência ou a função administrativa. A leitura das referências é permitida.
- A proteção por RLS também é verificada depois de conceder acesso à tabela de participantes apenas na instância local de teste: nenhuma linha é revelada e a inserção permanece bloqueada.
- `refresh_benchmarks()` preserva as referências quando não há amostra e calcula quartis por nível e para o conjunto com dados sintéticos. Reaplicar as referências não sobrescreve valores já existentes.

## Preservação do projeto existente

Nesta etapa, as consultas remotas foram somente de leitura. Foram encontrados zero registros em `sessions`, `players` e `outcomes`, seis referências históricas em `benchmarks`, RLS ativo nas quatro tabelas e uma política de leitura para as referências. Não houve migração remota, remoção de registros, criação de projeto ou alteração de plano.

Os arquivos novos são uma receita para projeto vazio e uma verificação local. Não certificam a API HTTP, a hospedagem, o faturamento, o funcionamento completo offline ou a conclusão da edição brasileira. As seis referências preservam o contexto britânico original e não devem ser usadas como estatísticas atuais do Brasil.
