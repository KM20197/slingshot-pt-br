# Slingshot — edição acadêmica brasileira

**Em desenvolvimento. Esta versão ainda não está pronta para aplicação em turma.**

Adaptação do Slingshot original de Ammon Salter, Stefano Baruffaldi e Federico Bignone, para uso acadêmico em engenharia, administração, computação e saúde. A licença do original, **CC BY-NC-SA 4.0**, está preservada em [LICENSE](LICENSE), com atribuição em [NOTICE](NOTICE) e [CITATION.cff](CITATION.cff). A licença MIT gerada durante a criação deste repositório não se aplica ao código original nem a esta adaptação.

## Estado atual

- Inventário do original: 83.574 linhas, 71 estruturas de dados e oito scripts internos. Identificadores, nomes próprios e dados gráficos não são tratados como prosa.
- Catálogo estruturado: 360 campos tratados em oito estruturas examinadas, das quais três foram preservadas integralmente. O modelo de negócio Aether tem seus 154 campos textuais cobertos, incluindo seletores de remoção. Os demais modelos de negócio e o restante do conteúdo ainda não foram traduzidos por completo.
- Exportação local de nota entre 0 e 5 e página de conferência do professor. Matrícula ou e-mail entram somente no arquivo que o aluno decide entregar; não são enviados ao servidor.
- Juros didáticos e amortização implementados. A escolha inicial, a captação normal posterior e o socorro financeiro de crise oferecem empréstimos sem participação societária. A negociação antiga, eventos e remuneração societária da equipe ainda aguardam substituição.
- Os perfis brasileiros de empreendimentos e a calibração monetária ainda estão pendentes. As descrições britânicas traduzidas não devem ser interpretadas como dados atuais do Brasil.
- Abertura direta por `file://` ainda exige validação manual. O teste no navegador por servidor local conferiu corretamente um resultado sintético de 3,85/5 e a limpeza dos dados.

Não há versão final publicada nem liberação para uso acadêmico. Os pareceres de revisão se referem aos componentes examinados, não à conclusão integral da adaptação.

## Executar e verificar localmente

Com Node.js instalado:

```sh
npm ci
npm test
node tools/build.cjs
```

Abra `index.html` para testar o jogo ou `professor.html` para conferir um resultado. Para testes por servidor local, pode-se servir a pasta com `python -m http.server 8767 --bind 127.0.0.1` e acessar `http://127.0.0.1:8767/`. Não coloque chaves de turma reais em testes públicos.

O build parte de `source/index.original.html`, aplica o catálogo por caminho de campo e as exceções aprovadas e verifica os scripts com Acorn e `node --check`. As bibliotecas de execução estão em `vendor/`; dependências de desenvolvimento não são necessárias para abrir os HTMLs já gerados.

## Nota e entrega ao professor

Nota = marcos de desenvolvimento (até 3) + continuidade (até 1) + capacidade financeira (até 1).

Cada um dos três marcos vale seu progresso de 0 a 1. A continuidade vale trimestres concluídos/16, ou 1 para sucesso antecipado com os três marcos completos. A capacidade financeira é caixa dividido pelas despesas operacionais e parcelas previstas, limitada ao intervalo 0–1. Atrasos zeram esse componente; ausência de obrigações e de atrasos resulta em 1. O total é arredondado para duas casas decimais.

O aluno informa matrícula **ou** e-mail e a chave compartilhada da turma, gera um `.txt` e entrega o arquivo ao professor. A página `professor.html` verifica a assinatura e recalcula a nota localmente. HMAC não criptografa os dados e, com uma chave compartilhada e execução local, não comprova autoria nem impede a fabricação de resultados.

## Financiamento aprovado

| Modalidade | Taxa efetiva anual | Prazo |
|---|---:|---:|
| Banco público | 24% | 12 trimestres |
| Familiares | 6% | 8 trimestres |
| ONG elegível | 8% | 12 trimestres |
| Agiotagem fictícia | 120% | 4 trimestres |

São parâmetros didáticos fixos, não ofertas reais. A amortização é constante; a taxa trimestral é `(1 + taxa anual)^(1/4) - 1`. A parcela começa no trimestre posterior à contratação. A escolha inicial mantém, provisoriamente, a referência numérica de capital próprio de 350 e crédito de 80 do original, nas unidades de mil do motor, com os multiplicadores originais dos modos. Essa referência não é uma estimativa de capital necessário para abrir uma microempresa no Brasil.

Crédito de ONG exige finalidade compatível explicitamente definida no perfil do empreendimento. Recursos de pesquisa não reembolsáveis, bolsas e empréstimos terão rotas distintas. A implantação dessas rotas ainda não está concluída.

A captação normal posterior permite um contrato por etapa de desenvolvimento, com custo de um ponto de atenção. O valor deriva do cálculo original de captação, preservando seus fatores de etapa e mercado como referência provisória. Contratos, parcelas e limites são restaurados com a partida salva. A revisão independente desta etapa terminou em 9,2/10, com 55 testes aprovados; consulte [o parecer de 15/09/2026](docs/REVISAO_2026-09-15.md).

Na crise de caixa, o socorro financeiro utiliza a modalidade pessoal fictícia a 120% ao ano por quatro trimestres. O painel informa a primeira parcela e o total sem atrasos. A única oportunidade de recuperação e o valor de referência do original foram preservados; dívida e carência sobrevivem à retomada. A revisão desta integração passou de 8,5 para 9,2/10, com 63 testes aprovados. Valores de capital ainda dependem de calibração brasileira.

## Privacidade e Supabase

Foi autorizado reutilizar o projeto existente `slingshot-pt-br`, na organização KM20197 e região São Paulo, mantendo o plano gratuito. A aplicação não cria contas nem grava participantes no Supabase. As políticas e permissões foram restringidas; as tabelas existentes foram preservadas. `supabase/privacy.sql` registra a alteração e `supabase/verify_privacy.sql` contém a verificação transacional.

Para recriar o esquema **somente em um projeto Supabase vazio**, a ordem é `supabase/bootstrap.sql` → `supabase/privacy.sql` → `supabase/seed-reference.sql` (opcional). O bootstrap não deve ser executado no projeto existente. As seis referências do seed são históricas britânicas, com amostra declarada de 260; não representam participantes desta edição nem valores brasileiros. A receita e seus limites estão em [supabase/README.md](supabase/README.md).

`npm test` inclui a recriação e os testes SQL em um PostgreSQL local em memória, por PGlite, sem conexão com o projeto remoto. O teste compara 38 colunas, sete restrições de chave e sete índices com os metadados consultados, verifica RLS e permissões e confirma a preservação das referências. A etapa de documentação e testes locais não aplicou novas migrações ao Supabase.

A telemetria do original foi desativada no build. As conexões automáticas externas são bloqueadas pela política de conteúdo. Resultados e identificação não são enviados ao GitHub ou Supabase pela aplicação.

## Continuidade

Consulte [docs/DECISOES_APROVADAS.md](docs/DECISOES_APROVADAS.md) e [docs/INVENTARIO.md](docs/INVENTARIO.md). Ainda faltam a tradução integral, adaptação dos empreendimentos, eliminação de todas as rotas de emissão de ações, fomento brasileiro, calibração e testes completos online/offline.
