# Especificação Técnica L1 — Camada de apresentação brasileira

> Mapeamento técnico em leitura para orientar lotes posteriores. Não autoriza alterações em código, catálogos, dados, build, testes, staging, commit ou push.

## 1. Objetivo e escopo

L1 define os contratos técnicos necessários para que a experiência exibida ao jogador possa refletir a adaptação conceitual aprovada em `docs/ESPECIFICACAO_CONCEITUAL_L0.md`, sem alterar chaves internas, regras econômicas ou o arquivo-fonte original.

O escopo futuro inclui somente camada de apresentação para nomes e setores, conteúdo tutorial e o acesso externo à Ada. A aplicação efetiva dependerá de lote funcional específico, revisão independente e autorização expressa.

## 2. Fontes e restrições confirmadas

- `source/index.original.html` é a fonte canônica e não pode ser editado. O hash validado pelo build permanece obrigatório.
- `index.html` é gerado por `tools/build.cjs`; não deve receber edição manual.
- `tools/build.cjs` já usa `replaceOnce` e `replaceMethod` após validar o hash da fonte, além de injetar módulos locais antes da criação de `Game`.
- `locales/pt-BR.json` e `locales/structures.pt-BR.json` cobrem rotas estáticas aprovadas. O primeiro traduz nós estáticos do DOM e atributos permitidos; nenhum deles traduz conteúdo criado dinamicamente por JavaScript.
- IDs, ordem de arrays, chaves internas, fórmulas, números, probabilidades, multiplicadores, `archetype`, `revenueModel`, `staff`, `burn` e `crowdfundFit` permanecem congelados.

## 3. Contrato para nomes e setores exibidos

`COMPANIES` contém os identificadores e os dados canônicos usados pelo motor. As telas de seleção e de informações atualmente exibem diretamente `company.name`, `company.archetype` e `company.desc`.

O lote futuro deverá introduzir uma camada somente de leitura, indexada por `company.id`, para retornar o nome e o setor exibidos em português. A camada não poderá alterar objetos de `COMPANIES` nem reatribuir `company.name` para fins de localização.

Os caminhos mínimos que exigem mapeamento e inspeção específica são:

- grade de empreendimentos;
- modal de informações do empreendimento;
- atualizações de nome na interface durante a partida;
- quaisquer telas de resultado, exportação ou retomada que exibam nome ou setor.

O mapeamento deverá usar exclusivamente os 12 IDs aprovados: `aether`, `edu`, `avam`, `voed`, `legal`, `dream`, `arene`, `vanguard`, `terra`, `sorgente`, `cyber` e `quant`.

## 4. Contrato de compatibilidade com partidas salvas

O carregamento localiza a empresa por `companyId`; esse identificador deve continuar sendo a chave de restauração. O estado salvo também registra `companyName`, que pode refletir mudanças ocorridas durante a partida, e `startupName`, que deverá ser preservado sem ser convertido em chave.

Uma camada de apresentação brasileira deverá preferir o nome correspondente ao ID atual, sem transformar o valor salvo em nova chave de negócio. Antes de qualquer mudança, o lote funcional deverá definir e verificar o comportamento de partidas antigas, partidas novas e partidas após pivô.

## 5. Pivôs

O motor pode reatribuir `this.company.name` durante um pivô e atualizar elementos de interface a partir desse valor. Por isso, a exibição brasileira de pivôs não pode ser inferida apenas pelo mapeamento inicial de empresas.

Pivôs ficam fora do primeiro lote de apresentação. Um lote próprio deverá mapear cada pivô por identificador ou nome canônico, definir sua narrativa brasileira e comprovar que não modifica métricas, marcos, fórmulas, arrays ou restauração de partidas.

## 6. Tutorial e conteúdo dinâmico

O tutorial contém conteúdo dinâmico em métodos e coleções JavaScript, incluindo cartões temáticos, dicas de acompanhamento e textos de tutorial iniciante. Esse conteúdo não é alcançado pela tradução estática do DOM.

O lote futuro deverá aplicar patch limitado aos pontos de apresentação do tutorial, preservando:

- IDs, classes e ordem de etapas;
- seleção de modo e navegação;
- cálculos de atenção, financiamento e progresso;
- comportamento de acessibilidade já existente.

Textos estáticos, tais como rótulos HTML, poderão usar `locales/pt-BR.json` quando houver correspondência literal segura. Textos dinâmicos deverão usar mecanismo de patch validado pelo build.

## 7. Ada e importação de cenário

Há dois fluxos distintos relacionados à Ada no arquivo-fonte original: um link externo direto “Meet Ada” e um carregador local de cenário. O link direto não contém o aviso prévio exigido por L0. O carregador contém rótulos, mapeamentos e fallbacks em inglês e pode alterar o nome da empresa a partir do arquivo importado. Ambos são incompatíveis com a camada de apresentação definida neste documento e com os perfis conceituais L0.

Qualquer lote futuro deverá substituir ou neutralizar os dois fluxos no processo de build, sem editar a fonte original. O novo fluxo deverá:

- aceitar apenas um esquema documentado de cenário fictício;
- usar identificadores canônicos explicitamente permitidos;
- recusar entradas desconhecidas, incompletas ou incompatíveis, sem fallback silencioso para empresa ou perfil;
- impedir que dados importados alterem `companyId`, IDs internos, fórmulas, métricas ou o nome canônico do objeto da empresa;
- exibir aviso explícito antes de qualquer acesso ao serviço externo;
- proibir dados pessoais, médicos, financeiros reais ou informações corporativas factuais.

O aviso deverá oferecer retorno à experiência local e o jogo seguirá utilizável sem a Ada. Como constantes léxicas do carregador não se tornam propriedades de `window`, uma sobreposição posterior não deve depender de acesso indireto a essas constantes. O ponto de substituição deverá ser definido e validado no build.

## 8. Atribuição e privacidade

A adaptação deverá preservar autores, atribuição e licença CC BY-NC-SA 4.0 do original. Textos brasileiros podem contextualizar a adaptação, mas não remover créditos ou atribuição existentes.

O jogo precisa continuar utilizável sem a Ada. Nenhuma telemetria, conexão automática ou coleta de dados pessoais será introduzida pelo lote de apresentação.

## 9. Critérios de aceite para futuros lotes L1

Um lote funcional só poderá ser aceito se demonstrar que:

1. `source/index.original.html` permanece com o hash canônico;
2. nenhuma edição manual foi feita em `index.html`;
3. a exibição de nomes e setores usa mapeamento por ID sem alterar `COMPANIES`;
4. a seleção, o modal, a atualização de interface e a restauração foram cobertos sem alterar pivôs; pivôs foram verificados como fora de escopo, sem regressão;
5. o tutorial dinâmico preserva fluxo e regras do motor;
6. a Ada recusa esquema inválido e não possui fallback silencioso;
7. limites de saúde, privacidade, atribuição e conteúdo fictício de L0 permanecem visíveis;
8. as verificações proporcionais ao lote, a revisão independente e a aprovação explícita ocorreram antes de commit ou push.

## 10. Limite desta especificação

Este documento registra decisões de arquitetura e riscos. Ele não autoriza implementação, alterações em catálogo, geração de `index.html`, execução de build, testes, staging, commit ou push.
