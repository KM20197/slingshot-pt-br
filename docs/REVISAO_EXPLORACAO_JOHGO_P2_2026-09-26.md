# Reconciliação da exploração Johgo para P2

Data: 26/09/2026. Este documento reconcilia o relatório de leitura do OpenCode apresentado pelo usuário. Ele é evidência de inventário, não matriz P2, decisão de negócio, autorização de edição ou fonte de valores para o Slingshot.

## Fonte identificada

- Caminho: `C:\Users\Administrador\Downloads\Simulador\Johgo Original\Refatorar_orientador\Entradas Operacionais\johgo-v3-2-corrigido.zip`.
- SHA-256 confirmado: `b758657c20688bed173932e7c2bbaec87f7acd38f667f20e37e23b829bfa50e1`.
- O arquivo interno `johgo_pacote_final/README_FRONTEND.md` identifica o frontend como Johgo v3.2. Essa identificação não equivale a uma versão única de todos os schemas, migrações ou regras do pacote.
- Arquivos internos reportados como consultados: worker, seed SQL, frontend `app.js` e `config.js`, e os dois READMEs. Não houve extração para disco nem alteração no checkout, segundo o relatório recebido.

## Fatos aceitos para a futura proposta

O seed SQL identifica três setores (`services`, `commerce`, `industry`) e 18 tipos de empreendimento: clínica popular, restaurante por quilo, pet shop, salão/barbearia, academia, assistência técnica de celulares, minimercado, farmácia, loja de roupas, loja de eletrônicos, material de construção, cosméticos, alimentos congelados, confecção, móveis, produtos de limpeza, gráfica/embalagens e metalúrgica.

O seed também fornece linhas de produto/serviço por empreendimento. O worker contém perfis de decisão que descrevem temas operacionais. Esses elementos podem inspirar a seleção e a descrição acadêmica de casos, desde que cada escolha seja aprovada para o Slingshot.

O relatório não apresentou evidência de público-alvo estruturado, BMC, marcos de negócio, concorrentes estáticos ou justificativa acadêmica por empreendimento. Esses campos permanecem pendentes de decisão e elaboração específicas para o Slingshot.

## Limites obrigatórios

Não transferir diretamente valores de custo, preço, demanda, juros, relatórios pagos, itens de compra, regras de pagamento, estruturas de receita, eventos ou concorrentes gerados por IA. O Johgo e o Slingshot têm modelos econômicos e estruturas de dados diferentes; a conversão de unidades aprovada para módulos do Slingshot não converte automaticamente valores do Johgo.

O relatório original tinha duas versões sobrepostas. Elas divergiam quanto ao estatuto da versão, à contagem de itens de compra e a detalhes de mecanismos econômicos. Esses detalhes não são necessários para a decisão P2 e ficam fora deste registro até receberem auditoria própria.

## Gate atual

`DECISÃO_DE_NEGÓCIO_PENDENTE`. O usuário deve classificar cada um dos 18 casos Johgo como: `referência`, `manter`, `adaptar` ou `descartar`. A classificação deve indicar também quais empreendimentos originais do Slingshot serão mantidos ou substituídos. Depois disso, pode ser redigida uma proposta de matriz P2 para aprovação. Nenhum arquivo de jogo pode ser alterado antes dessa aprovação.
