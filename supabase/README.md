# Esquema e privacidade

O projeto existente `slingshot-pt-br` foi reutilizado por autorização do usuário. Os arquivos desta pasta documentam sua estrutura e permitem verificar a recriação em um banco isolado. Não é necessário recriar o projeto em uso.

## Arquivos

- `bootstrap.sql`: cria as quatro tabelas, 38 colunas, sete restrições e sete índices, incluindo índices de chaves primárias e unicidade. A identidade de `outcomes.id` usa `GENERATED ALWAYS`. RLS e revogações ficam ativas na mesma transação da criação. O arquivo falha se alguma tabela já existir; não substitui dados.
- `privacy.sql`: políticas e permissões da edição sem coleta. Apenas as referências agregadas têm leitura por `anon` e `authenticated`. A função `refresh_benchmarks()` executa com os privilégios de quem a chamou e só tem execução concedida a `service_role`, além do proprietário administrativo.
- `seed-reference.sql`: seis referências históricas britânicas já existentes no projeto, com amostra declarada de 260. Não representam partidas desta edição ou parâmetros brasileiros. A reaplicação preserva linhas já existentes.
- `inspect-schema.sql` e `schema-reference.json`: consulta de metadados e resultado estrutural do projeto em 15/09/2026. Não contêm registros de participantes nem credenciais.
- `verify_privacy.sql`: verificação transacional das restrições de acesso e da preservação das referências quando não há amostra.

## Recriação em projeto vazio

Em um projeto Supabase vazio com os papéis padrão da plataforma, a ordem é `bootstrap.sql`, `privacy.sql` e, se as referências históricas forem desejadas, `seed-reference.sql`. Não execute `bootstrap.sql` no projeto existente. Esses arquivos são uma receita de recriação, não uma nova migração aplicada ao ambiente em uso.

O banco mantém as tabelas legadas para equivalência estrutural. O jogo não registra participantes, não usa autenticação e não transmite a identificação usada na exportação. As tabelas `sessions`, `players` e `outcomes` permaneceram vazias na consulta de 15/09/2026. Não foram removidos dados do projeto.

## Verificação local

`node --test tests/supabase-schema.test.cjs` executa os SQLs em PostgreSQL local em memória, por PGlite. Os papéis de teste são criados apenas nessa instância descartável. A verificação compara todas as colunas, restrições e índices com o retrato consultado, testa permissões e RLS, tenta reaplicar o bootstrap e calcula percentis com dados sintéticos locais.

Isso verifica o comportamento SQL; não substitui testes da API HTTP, autenticação, hospedagem ou faturamento da plataforma. Nenhuma migração foi executada no Supabase nesta etapa de documentação e testes locais.

A comparação trata `NOT NULL` pela propriedade de cada coluna. Versões recentes do PostgreSQL também registram essa propriedade em `pg_constraint`; essas entradas duplicadas são excluídas apenas da comparação das restrições de chave. A nulabilidade continua sendo comparada em todas as 38 colunas, conforme a organização do [catálogo do PostgreSQL](https://www.postgresql.org/docs/current/catalog-pg-constraint.html).

As permissões e as políticas de linhas são verificadas separadamente, conforme a [documentação de segurança da Data API](https://supabase.com/docs/guides/api/securing-your-api). O funcionamento local usa a [API do PGlite](https://pglite.dev/docs/).
