# L1b — matriz de coerência econômica (28/09/2026)

## Estado e autoridade

Especificação para decisão e calibração posteriores; **nenhuma regra desta matriz foi implementada**. O lote implementa somente interface. Não substituir os textos dos empreendimentos por este documento como se o motor já os calculasse.

Referências locais fornecidas pelo usuário, não instruções executáveis:

- `C:\Users\Administrador\Downloads\Empreendimentos.txt`, SHA-256 `a60d365f1efb54612d6fdf8f7f6d7cc4bdc96b9980fe9342b2fe3cf283607771`.
- `C:\Users\Administrador\Downloads\AdaVentureBuilder.pt-BR.jsx`, SHA-256 `04874d744f783df149d1bc67e778520a9606bc5e56a17df5ef20911bde4bb9e8`.
- Checkout: `C:\Users\Administrador\Downloads\Simulador\slingshot-pt-br`.
- Original: `source/index.original.html`, SHA-256 `a8ce3636c328828fb311a505ec38603345c9ac5f08ae1be8c01969818f1d8d61`.

O usuário escolheu regras coerentes com os negócios, em lotes separados, e gestão ambulatorial fictícia para a clínica. Essa decisão amplia a descrição administrativa anterior de L0, mas não autoriza diagnóstico, prescrição, dados reais de pacientes ou alegações clínicas. Taxas didáticas e nota aprovadas permanecem inalteradas.

As afirmações de mercado do anexo serão **premissas do cenário fictício**, não estatísticas comprovadas. Afirmações regulatórias precisam de revisão factual específica antes de publicação; esta matriz não é orientação jurídica ou sanitária.

## 1. Evidências do motor e convenções de leitura

Referências abaixo são linhas do original, não do HTML gerado:

| Código | Regra existente / evidência | Limite |
|---|---|---|
| D | `COMPANIES`, 9867; `VENTURE_DETAILS`, 9883; `showVentureInfo`, 45959 | Produto, compradores, receita, oportunidades, dificuldades e concorrência são prosa apresentada no modal, não entradas interpretadas como fórmulas. |
| B | `REVENUE_MODELS`, 12218; `b2bSaas` | Clientes empresariais com receita trimestral, custo de aquisição/suporte, churn e ciclo de venda; não vendas unitárias de mercadorias. |
| H | `healthcareProcurement`, no mesmo bloco | Contratação institucional de saúde; não atendimento individual pago diretamente ou repassado por operadora. |
| C | `consumer`, no mesmo bloco | Assinantes/coortes de consumidores; não compras avulsas de refeições, roupas ou alimentos. |
| G | `researchGrants`, no mesmo bloco | Recursos de pesquisa; não vendas de saneantes fictícios. |
| A | `platformAPI`, no mesmo bloco | Plataforma/API; não reparos físicos e peças. |
| R | `initializeRevenueModel`, 52422; `addCustomer`, 52435; `calculateQuarterlyRevenue`, 52885 | Soma `customers[].quarterlyRevenue` e suporte, aplica eficiência/escala, registra receita anualizada. Produzir ou possuir estoque não equivale a realizar receita nesse caminho. |
| F | `selectFounderProfile`, 46004; `startGame`, 48668; `calculateHiddenRevenueModifiers`, 52560 | Seleção por ID; bônus reais preservados. Habilidade comercial afeta conversão/churn e liderança pode afetar tamanho do negócio. Não existe interpretação automática do texto do perfil. |

Os modelos já têm nomes/descrições traduzidos, mas isso não muda essas associações. Não afirmar que todo o jogo carece de concorrentes, custos ou eventos: existem subsistemas próprios. A incompatibilidade é entre as regras efetivas e a operação descrita no anexo.

Classificação: **N** = contexto narrativo/limite, sem efeito próprio; **E** = efeito calculado proposto, ainda ausente ou não equivalente no modelo associado. Cada linha de oportunidades/dificuldades identifica uma afirmação na ordem do anexo. Descrição/produto e setores são cobertos pela linha de identidade de cada caso.

Fundador proposto: **Com** = `commercial`; **Lid** = `leadership`; **Tec** = `technical`; **Fin** = `financial`. Os outros atributos reais são `operational` (capacidade de operação) e `adaptability` (resposta a mudanças). A matriz indica os atributos principais; na especificação quantitativa, separar operação de liderança e adaptação de competência técnica, sem criar campos de conhecimento setorial ou rede de contatos que não existem no esquema. Negociação e relacionamentos são processos afetados principalmente por `commercial`, não atributos novos. Nenhum perfil fica impedido de escolher qualquer negócio. Atributos influenciam decisões/processos, não criam receita ou estoque gratuitamente; não contar duas vezes um bônus já existente.

Testes abaixo são critérios para futura implementação, não testes executados neste lote. Comparações usam o mesmo estado inicial e a mesma sequência aleatória, variando somente a entrada indicada. Valores e intensidades ficam pendentes de calibração.

## 2. Matriz por empreendimento

### aether — Clínica popular — Serviços / Saúde

Base H+R+D+F. Incompatibilidade: contratos institucionais recorrentes versus atendimentos realizados, capacidade ambulatorial e dois pagadores. Nada de diagnóstico, prontuários ou dados de pessoas reais.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Unidade ambulatorial; recepção à saída; exclusões clínicas | N: gestão de instalações e fluxo fictício; exclusões obrigatórias | — | Nenhum campo de paciente/diagnóstico/prescrição |
| Quem compra: pagamento direto e operadora | E: separar demanda de pessoas, pagador e prazo de recebimento | Com, Fin | Mesmo atendimento não recebe duas vezes |
| Receita por atendimento realizado | E: realizados × valor negociado por canal, limitados pela capacidade | Lid, Fin | Agendamento ou falta não gera receita de atendimento |
| O1 filas públicas; O2 especialistas concentrados | N: contexto fictício de demanda, sem estatística ou bônus automático | — | Prosa não altera números |
| O3 operadoras ampliam rede | E: canal sujeito a credenciamento fictício | Com | Sem credenciamento não surgem recebíveis desse canal |
| D1 alvará, CNES, responsável técnico | N: alegação do anexo pendente de revisão factual; não codificar obrigação universal | — | Não publicar como checklist legal comprovado |
| D2 credenciamento lento | E: atraso/custo administrativo do canal | Com, Fin | Atraso adia o canal sem paralisar pagamento direto |
| D3 faltas | E: taxa de comparecimento e capacidade não aproveitada | Lid | Mais faltas reduz realizados, nunca receita aumenta por faltar |
| D4 preços/margens comprimidos | E: preço por canal menos custos variáveis/fixos | Fin, Com | Mais volume não garante lucro quando margem é negativa |
| D5 atrair/reter profissionais | E: disponibilidade de equipe e custo limitam capacidade | Lid, Com | Sem equipe, instalações não geram atendimento ilimitado |
| Concorrência: clínicas e redes genéricas | N: identidade; E: disputa por demanda/preço, uma única aplicação | Com | Concorrência não é debitada duas vezes por evento e mercado |

### vanguard — Material de construção — Comércio

Base B+R+D+F. Incompatibilidade: clientes de software versus cestas de mercadorias, armazenagem, entrega e venda a prazo.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Loja de materiais, ferramentas e acabamentos | N: identidade varejista; E: categorias agregadas de estoque | Tec | Não criar serviço de robótica como produto |
| Compradores profissionais e moradores | E: dois segmentos com frequência/cesta próprias | Com | Segmentos reconciliam com vendas totais |
| Volume × valor médio da compra | E: receita somente de vendas atendidas; CMV separado | Fin | Compra de estoque não é receita; venda reduz saldo |
| O1 reformas graduais; O2 manutenção recorrente | N: contexto; E: demanda de reposição, não assinatura obrigatória | Com | Recompra não vira contrato SaaS |
| O3 frequência e indicações | E: retorno/indicação alteram demanda futura | Com | Indicação sem venda não gera caixa |
| O4 urgência/proximidade/entrega no dia | E: prazo e capacidade logística afetam conversão | Lid | Não prometer entrega acima da capacidade |
| D1 estoque imobilizado | E: desembolso e capital em mercadorias | Fin | Caixa e estoque reconciliados |
| D2 espaço/carga/entrega | E: capacidade e custos logísticos | Lid | Entregas respeitam limite físico |
| D3 falha de fornecimento | E: prazo de reposição e ruptura | Com | Sem saldo/reposição não vende unidade inexistente |
| D4 insumos oscilam | E: custo de compra independente do preço de venda | Fin | Alta de custo reduz margem se preço não muda |
| D5 renda/chuvas | E: cenários sazonais de demanda, sem dados meteorológicos reais | Com | Choque atua na demanda, não cria perda contábil duplicada |
| D6 inadimplência | E: contas a receber, atraso e perda explícita | Fin | Venda a prazo não entra integralmente no caixa imediatamente |
| Concorrência local/home centers | N: nomes genéricos; E: preço/disponibilidade/prazo | Com | Disputa afeta demanda atendida uma vez |

### quant — Gráfica/embalagens — Indústria

Base B+R+D+F. Incompatibilidade: contrato de software versus ordem de produção/entrega. Sem certificação, garantia técnica ou alegação de adequação alimentar.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Impressos, caixas, invólucros; exclusões | N: identidade e limites; E: pedidos agregados | Tec | Não exibir garantia técnica inexistente |
| Compradores pequenos comércios/fábricas | E: demanda empresarial por encomendas | Com | Encomenda não é assinatura automática |
| Receita por ordens entregues | E: valor por pedido × entregues, recebimento separado | Fin | Pedido incompleto não fatura como entregue |
| O1 materiais de identidade visual | N: contexto de usos | — | Não cria receita adicional |
| O2 tiragens pequenas | E: tamanho de lote e custo de preparação | Tec, Fin | Menor lote não ganha economia ilimitada de escala |
| O3 datas/campanhas | E: sazonalidade trimestral de pedidos | Com | Calendário reproduzível em save |
| O4 proximidade e ajustes de arte | E: prazo e retrabalho | Tec, Com | Ajuste consome capacidade definida |
| D1 investimento/manutenção | E: equipamento, disponibilidade e gasto de manutenção | Tec, Fin | Máquina indisponível reduz capacidade |
| D2 papel/tinta/chapas | E: custo e prazo de insumos | Fin, Com | Falta de insumo limita produção |
| D3 refugo/retrabalho | E: material perdido e capacidade consumida | Tec, Lid | Refugo não conta como entregue |
| D4 concentração/ociosidade | E: demanda sazonal e custo fixo mantido | Fin | Trimestre sem pedidos não zera custos fixos |
| D5 pequenos pedidos urgentes | E: preparação, fila e margem por pedido | Lid, Fin | Urgência não elimina fila/custo |
| D6 inadimplência | E: recebíveis e perdas | Fin | Receita, recebível e caixa separados |
| Concorrência gráfica/publicitária | N: identidade; E: preço e prazo | Com | Mesmo efeito não duplicado com evento competitivo |

### dream — Minimercado — Comércio

Base C+R+D+F. Incompatibilidade: assinantes digitais versus compras de reposição, estoque e margem varejista.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Alimentos secos, bebidas, limpeza; loja local | N: identidade; E: estoque por categoria agregada | Tec | Sem criação de assinaturas digitais |
| Moradores, compras rápidas/frequentes | E: fluxo e frequência de visita | Com | Visita sem compra não fatura |
| Fluxo × compra média | E: vendas limitadas por saldo, CMV e recebimento | Fin | Sem estoque não há venda |
| O1 proximidade/última hora; O2 deslocamento | E: conveniência altera atração local | Com | Demanda não aumenta duas vezes pelo mesmo fator |
| O3 necessidade constante | N: premissa de demanda-base, não garantia de vendas | — | Concorrência/ruptura ainda podem reduzir vendas |
| O4 confiança/horário | E: retorno e custo de operação por horário | Com, Lid | Abrir mais não é benefício gratuito |
| D1 pequena margem/controle | E: CMV e custos fixos | Fin | Receita positiva pode coexistir com prejuízo |
| D2 escala de concorrentes | E: pressão de preço | Com | Não impor margem fixa protegida |
| D3 vencimento/avarias/furtos | E: perdas fictícias agregadas de estoque | Lid | Perda baixa estoque sem gerar venda |
| D4 licenças/obrigações | N: texto regulatório a revisar; futura despesa didática não representa exigência real | — | Sem lista legal universal ou valores reais inventados |
| D5 fornecedor e repasse limitado | E: custo variável e sensibilidade a preço | Fin, Com | Custo maior não reajusta preço automaticamente |
| D6 fiado/cartão da loja | E: recebíveis e risco de atraso/perda | Fin | Compra a prazo não é caixa imediato |
| Concorrência supermercados/mercearias | N: identidade; E: disputa local | Com | Participação/demanda permanecem limitadas |

### cyber — Confecção — Indústria

Base B+R+D+F. Incompatibilidade: software de cibersegurança versus fabricação em série e entregas ao atacado.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Corte/costura/acabamento; sem garantias de origem/sustentabilidade | N: identidade e exclusões; E: gargalos produtivos | Tec | Nenhuma certificação implícita |
| Varejistas e distribuidores | E: carteira de pedidos empresariais | Com | Separar pedido de contrato recorrente |
| Receita por pedidos entregues | E: produção vendável/entrega × preço | Fin | Produção não vendida permanece estoque, não receita |
| O1 renovação de coleções | N: contexto de demanda | — | Sem venda garantida |
| O2 reposição/prazos curtos | E: recompra e prazo de entrega | Com, Lid | Atraso afeta próxima encomenda |
| O3 escala reduz custo | E: diluição limitada de preparação/fixos | Tec, Fin | Custo unitário nunca negativo |
| O4 proximidade | E: prazo logístico | Com | Proximidade não dobra bônus de reposição |
| D1 máquinas/manutenção/ociosidade | E: capacidade disponível e custo fixo | Tec, Lid | Gargalo limita saída; ociosidade não elimina custo |
| D2 tecidos/aviamentos | E: insumos, custo e repasse | Fin | Sem insumo não produzir |
| D3 moda/sazonalidade/encalhe | E: demanda por coleção e estoque depreciado | Tec, Com | Encalhe não se converte automaticamente em vendas |
| D4 prazo no atacado | E: recebíveis e capital de giro | Fin | Lucro e caixa podem divergir |
| D5 grandes indústrias | E: pressão competitiva | Com | Preço menor reduz margem quando custo é mantido |
| Concorrência oficinas/fábricas | N: identidade; E: reutilizar pressão acima | — | Não aplicar segunda penalidade pelo mesmo fato |

### terra — Produtos de limpeza — Indústria / Saúde

Base G+R+D+F. Incompatibilidade especialmente alta: receita de pesquisa versus fornecimento industrial. Setor exibido não autoriza alegações de saúde nem elegibilidade automática a fomento.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Produção/distribuição predial; exclusões de eficácia/conformidade | N: produtos fictícios e limites; E: capacidade produtiva | Tec | Sem alegação de desinfecção ou resultado clínico |
| Empresas/escritórios/condomínios | E: compradores institucionais | Com | Cliente comercial não tratado como agência de pesquisa |
| Receita por pedidos entregues | E: volume vendido × preço; prazo de recebimento | Fin | Não gerar bolsa/fomento por vender |
| O1 consumo contínuo; O2 reposição previsível | E: frequência de recompra com incerteza | Com | Recorrência não implica receita garantida |
| O3 compras em volume | E: planejamento/lotes produtivos | Lid | Pedido acima da capacidade fica pendente ou recusado |
| O4 fabricação e distribuição próprias | E: controle de prazo com custos próprios | Lid, Fin | Logística própria não é gratuita |
| D1 matéria-prima/embalagens | E: custo dos insumos | Fin | Alta de custo diminui margem sem repasse |
| D2 peso/volume | E: custo/capacidade de armazenagem e transporte | Lid | Entrega respeita limite logístico |
| D3 escala dos concorrentes | E: pressão de preço | Com | Sem desconto arbitrário no custo próprio |
| D4 negociação/prazo | E: preço negociado e contas a receber | Fin, Com | Pedido a prazo não antecipa caixa |
| D5 diferenciação/troca | E: retenção/recompra | Com, Tec | Cliente pode reduzir pedidos sem apagar recebível anterior |
| D6 contratos avulsos | E: variabilidade da demanda | Fin | Simulação determinística com mesma semente |
| Concorrência fábricas/distribuidoras | N: identidade; E: fator já descrito em D3/D5 | — | Sem penalidade duplicada |

### legal — Farmácia — Comércio / Saúde

Base B+R+D+F. O nome aprovado é mantido, mas o anexo descreve **somente higiene/perfumaria/conveniência, sem medicamentos**. Incompatibilidade: software jurídico versus varejo físico.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Higiene/perfumaria/cuidados pessoais; exclusões clínicas | N: limite obrigatório; E: estoque varejista | Tec | Não inserir medicamentos, dispensação ou pacientes |
| Público da região | E: fluxo local | Com | Pessoa que passa não equivale a cliente pagante |
| Fluxo × compra média | E: vendas, CMV e margem | Fin | Venda baixa estoque e registra custo |
| O1 reposição frequente | E: frequência de compra | Com | Não tratar cada comprador como licença SaaS |
| O2 localização | E: atração local com custo do ponto | Com, Fin | Local melhor não remove custo correspondente |
| O3 conveniência/urgência | E: conversão de demanda local | Com | Não contar duas vezes localização e conveniência |
| O4 horário/confiança | E: retorno e custo de horário | Lid, Com | Horário estendido consome recursos |
| D1 margem pequena/estoque | E: controle de CMV e capital | Fin | Receita alta não garante lucro |
| D2 escala das redes | E: pressão competitiva de preço | Com | Margem responde ao preço |
| D3 furto/avaria/vencimento | E: perdas fictícias agregadas | Lid | Perda reduz estoque/resultado sem receita |
| D4 aluguel | E: custo fixo do ponto | Fin | Custo persiste com baixa venda |
| D5 outros comércios | E: disputa de demanda | Com | Não duplicar pressão já modelada |
| Concorrência drogarias/minimercados | N: identidade, não autorização para ampliar mix | — | Nenhuma venda de medicamento introduzida |

### edu — Academia — Serviços

Base B+R+D+F. Há afinidade com recorrência, mas cliente empresarial/ciclo escolar não equivale a matrícula individual/capacidade de salão.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Adultos/equipamentos/instrutores; continuidade/conservação | N: identidade; E: capacidade e manutenção | Lid, Tec | Sem promessa de resultado clínico |
| Adultos moradores/trabalhadores | E: demanda individual local | Com | Uma matrícula não é contrato empresarial |
| Mensalidades × matrículas ativas/permanência | E: meses faturados no trimestre, cancelamentos e recebimento | Fin, Com | Não cobrar trimestre completo de matrícula encerrada sem regra explícita |
| O1 receita previsível | E: recorrência sujeita a cancelamento | Fin | Receita futura não entra como caixa atual |
| O2 proximidade | E: atração/retenção local | Com | Não substitui capacidade física |
| O3 instrutores | E: qualidade de atendimento/custo | Lid | Equipe traz despesa, não benefício gratuito |
| O4 diluição da estrutura | E: capacidade por faixa horária e custo fixo | Fin | Diluição não permite lotação infinita |
| D1 desistência | E: cancelamento aplicado a matrículas | Com, Lid | Churn não aplicado duas vezes |
| D2 investimento/manutenção/desgaste | E: equipamento e indisponibilidade | Tec, Fin | Manutenção afeta caixa e capacidade de forma explícita |
| D3 picos/ociosidade | E: ocupação por faixas agregadas | Lid | Vagas ociosas fora de pico não resolvem lotação no pico |
| D4 imóvel/energia/água/limpeza | E: custos fixos e variáveis | Fin | Custo continua sem novas matrículas |
| D5 redes/preços | E: concorrência por preço/serviço | Com | Preço menor não garante receita maior |
| Concorrência redes/espaços locais | N: identidade; reutilizar D5 | — | Sem segundo redutor automático |

### voed — Restaurante por quilo — Serviços

Base C+R+D+F. Incompatibilidade: assinatura de aplicativo versus refeição avulsa cobrada em peso e perecibilidade.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Bufê/autosserviço/peso/desperdício; exclusões de saúde | N: identidade e limites; E: produção e atendimento agregados | Tec | Sem dados nutricionais ou garantias sanitárias |
| Trabalhadores/moradores no horário comercial | E: fluxo concentrado | Com | Fluxo é limitado pelo atendimento |
| Peso vendido e valor médio do prato | E: receita = peso vendido × preço por unidade de peso | Fin | Peso produzido não vendido não fatura; não multiplicar ticket e peso duas vezes |
| O1 almoço rápido | E: demanda e tempo de atendimento | Lid | Fila pode perder demanda |
| O2 cliente escolhe tamanho/valor | N: descrição; E: peso médio da compra | Com | Unidades consistentes no cálculo |
| O3 variedade | E: atratividade com custo/complexidade | Tec | Variedade não aumenta demanda sem contrapartida definida |
| O4 rotatividade de mesas | E: capacidade de atendimento | Lid | Mesa/tempo limitam refeições |
| D1 previsão/desperdício | E: preparado menos vendido = sobra/perda fictícia | Fin, Lid | Sobra reduz resultado e não gera venda |
| D2 concentração/ociosidade | E: capacidade por período agregado | Lid | Ociosidade posterior não recupera almoço perdido automaticamente |
| D3 insumos/gás/energia | E: custos variáveis e repasse limitado | Fin | Custo aumenta sem reajuste automático de preço |
| D4 imóvel/equipe/equipamentos | E: custo fixo e capacidade | Fin, Lid | Sem duplicar custo de equipe com subsistema existente |
| D5 substitutos preço/prazo | E: disputa por demanda | Com | Comparação afeta demanda uma vez |
| Concorrência restaurantes/lanchonetes/redes | N: identidade; reutilizar D5 | — | Sem assinatura mensal imposta aos clientes |

### arene — Loja de roupas — Comércio

Base B+R+D+F. Incompatibilidade: contratos de software versus venda de peças/acessórios, coleções e estoque por variedade.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Roupas/acessórios/tendências fictícias | N: identidade; E: categorias/variedades agregadas | Tec | Não atribuir tendências a dados reais |
| Consumidores da região | E: fluxo e conversão local | Com | Fluxo não é venda garantida |
| Venda direta/compra média | E: unidades vendidas × preço, CMV | Fin | Receita só de peças disponíveis vendidas |
| O1 renovação do guarda-roupa | N: contexto | — | Sem renda automática |
| O2 orçamento limitado | E: sensibilidade a preço/mix | Com | Preço alto pode reduzir conversão |
| O3 datas comerciais | E: sazonalidade de demanda | Com | Calendário persiste após carregar |
| O4 prova/ajuste/atendimento | E: conversão com capacidade de equipe | Lid, Com | Atendimento não excede tempo disponível |
| D1 tendência/estação/liquidação | E: encalhe, desconto e margem | Tec, Fin | Liquidação não vende acima do estoque |
| D2 tamanhos/cores/modelos | E: variedade e capital imobilizado | Fin | Estoque total não garante disponibilidade da variedade demandada |
| D3 sazonalidade/baixo movimento | E: reutilizar calendário O3 | Fin | Não aplicar sazonalidade duas vezes |
| D4 aluguel/equipe | E: custo fixo | Fin, Lid | Custos sem venda permanecem |
| D5 preço/promoções concorrentes | E: pressão sobre conversão e margem | Com | Promoção tem custo de desconto |
| Concorrência lojas/redes | N: identidade; reutilizar D5 | — | Sem receitas SaaS recorrentes |

### sorgente — Alimentos congelados — Indústria

Base C+R+D+F. Incompatibilidade: assinaturas versus produção/distribuição física. O anexo cita consumidor final em compradores, mas também pontos de venda e negociação com varejistas. **Proposta explícita:** consumidor é usuário final; varejista pode ser comprador do canal indireto. Isso precisa constar do futuro texto, sem duplicar a mesma venda nos dois canais.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Refeições em série/distribuição; exclusões de validade/saúde | N: identidade e limites; E: produção agregada | Tec | Não inventar prazo de validade, composição ou alegação nutricional |
| Consumidores/famílias e pontos de venda | E: canais direto/indireto com pagador explícito | Com | Unidade vendida ao varejista não gera também receita da revenda final |
| Volume e valor médio do pedido | E: receita de itens vendidos/entregues, não apenas produzidos | Fin | Produção não vendida não é receita |
| O1 conveniência para famílias | N: contexto de demanda | — | Sem venda garantida |
| O2 reposição frequente | E: recompra por canal | Com | Reposição não cria assinatura artificial |
| O3 escala/custo unitário | E: diluição limitada de preparação/fixos | Tec, Fin | Custo unitário não negativo |
| O4 linha atende vários pontos | E: capacidade alocada entre pedidos/canais | Lid | Soma das entregas não supera produção vendável |
| D1 equipamentos/câmaras/energia | E: investimento, capacidade e custo energético fictícios | Tec, Fin | Sem parâmetros técnicos de conservação real |
| D2 armazenagem/transporte | E: capacidade/custo logístico abstrato | Lid | Entregas limitadas pela logística |
| D3 ingredientes/embalagens | E: custo variável e margem | Fin | Repasse de custo não é automático |
| D4 marcas/espaço nos pontos | E: acesso ao canal e demanda | Com | Não vender a ponto de venda não contratado |
| D5 troca de marca | E: probabilidade de recompra | Com | Perda futura de demanda não apaga recebíveis |
| D6 preços/prazos varejistas | E: negociação e recebíveis no canal indireto | Fin, Com | Caixa só no recebimento; sem dupla contagem |
| Concorrência marcas/negócios locais | N: identidade; reutilizar D4/D5 | — | Não aplicar penalidade duplicada |

### avam — Assistência técnica de celulares — Serviços

Base A+R+D+F. Incompatibilidade: uso de API versus reparos físicos, peças, orçamento e autorização. Reforço do limite aprovado: **não acessar conteúdo pessoal dos aparelhos**, em vez de apenas dizer que o caso não exige acesso.

| Afirmação do anexo | Classe e regra proposta | Fundador | Aceite futuro |
|---|---|---|---|
| Avaliação física/troca de componentes/orçamento/autorização | N: identidade e privacidade; E: ordens de serviço | Tec | Sem coleta de fotos, contatos, mensagens ou credenciais |
| Consumidores com aparelho danificado | E: demanda por reparos | Com | Aparelho recebido não equivale a serviço aprovado |
| Receita de serviço e peças | E: reparo entregue × preço de mão de obra + peças cobradas; deduzir custo das peças | Fin | Sem receita por chamadas de API; não somar peça duas vezes |
| O1 urgência de funcionamento | E: sensibilidade a prazo | Com | Atraso pode reduzir aprovação |
| O2 reparo mais barato que substituição | E: aprovação do orçamento; premissa fictícia, não preço real | Com | Orçamento rejeitado não gera receita de reparo |
| O3 telas/baterias frequentes | N: contexto de mix | Tec | Sem estatística de falhas inventada |
| O4 reparos simples no dia/proximidade | E: duração/capacidade de serviço | Tec, Lid | Serviço exige peça e tempo disponíveis |
| D1 custo/prazo de peças | E: reposição, ruptura e margem | Fin, Com | Sem peça não concluir reparo dependente dela |
| D2 variedade/obsolescência | E: estoque por famílias e desvalorização fictícia | Tec, Fin | Peça de família distinta não substitui qualquer outra |
| D3 ferramentas/treinamento | E: capacidade técnica com investimento/tempo | Tec | Treinamento não concede receita imediata |
| D4 retrabalho/devolução | E: capacidade extra, custo e estorno quando aplicável | Tec, Lid | Mesmo reparo refeito não recebe segunda cobrança automática |
| D5 concorrentes baratos | E: pressão de preço/conversão | Com | Preço menor não reduz custo magicamente |
| Concorrência quiosques/franquias | N: identidade; reutilizar D5 | — | Sem bônus/penalidade duplicado |

## 3. Integrações que a futura implementação deve fechar

| Subsistema | Estado/risco atual | Proposta e teste obrigatório |
|---|---|---|
| Perfis | Doze IDs, atributos/bônus já usados; posição visual não é ID | Preservar escolha livre. Comparar cenários por todos os perfis; explicitar cada dimensão afetada, limite e contrapartida. Não apenas mudar descrição de vantagens. |
| Marcos | Estruturas `MILESTONES` e `PIVOT_MILESTONES` ainda representam metas originais | Especificar três metas por negócio, unidade, denominador e progresso; preservar nota 0–5. Produção não vendida não conta como receita. Metas novas exigem aprovação antes de código. |
| BMC | `BMC_DATA` contém relações e marcadores `[NEW]` usados por métodos | Mapear segmentos, canais, parceiros, custos e receita da matriz; manter chaves/marcadores técnicos e testar os consumidores, não somente o modal. |
| Equipe | `calculateStaffRevenueEffects` e funções de contratação têm categorias/bônus originais | Traduzir papéis não basta: definir capacidade, custo, treinamento, manutenção e sobreposição com bônus existentes. Não descontar salários duas vezes. |
| Eventos/concorrência | `RIVALS`, `REVENUE_MARKETING_EVENTS`, `COMPETITIVE_EVENTS`, `NEWS`, `SHOCKS` e mercados possuem lógica própria | Classificar cada efeito por destino (demanda, custo, prazo, capacidade, recebível). Mesmo fato tem um efeito principal; execução determinística antes/depois de save. Não apresentar anedota como regra. |
| Pivôs | Alteram nome/arquétipo e tabelas, não só a apresentação | Definir para cada transição permitida o destino de estoque, equipe, recebíveis, contratos e marcos. Proibir conversão silenciosa de estoque em caixa ou apagamento de passivos. |
| Financiamento | Crédito didático já integrado, outras rotas legadas pendentes | Não alterar taxas/nota neste lote. Separar receita operacional de empréstimo, aporte e fomento; elegibilidade a pesquisa não decorre do setor ou perfil exibido. |
| Resultado/exportação | Há anualização de receita e medição acadêmica existente | Separar receita do trimestre, resultado, caixa, estoque, recebíveis e dívida. Não rotular receita anualizada como assinatura contratada. Manter cálculo acadêmico aprovado. |
| Salvamento | Save brasileiro atual não contém novo estado operacional | L1b não altera formato. Futuro motor precisa versão econômica explícita. Saves antigos devem continuar no motor legado ou ser recusados com explicação antes de mutar estado; não inventar estoque/recebíveis numa migração silenciosa. Política exata será aprovada com o motor. |

Unidades: o motor usa milhares e a dívida centavos. Toda nova conversão deverá ser explícita. Não usar preços, salários ou índices do anexo como dados numéricos: não foram fornecidos. Calibrar demanda-base, preços/custos, capacidade, elasticidades, perdas, prazos, sazonalidade e intensidades de bônus em lote próprio. Cada parâmetro terá unidade, faixa válida, justificativa didática, sensibilidade e cenário determinístico. Não há valor padrão econômico autorizado por este documento.

Critérios transversais: caixa/estoques/recebíveis reconciliáveis; estoque e capacidade não negativos; receita depende de serviço/venda realizado; empréstimo não é venda; perda/retrabalho não gera receita; reinício restaura estado inicial; save/load reproduz próximo trimestre com a mesma aleatoriedade; resultado/exportação não altera estado.

## 4. Ada — especificação futura, não modificação neste lote

O JSX traduzido exporta `SUA STARTUP`, `Você é`, `Empreendimento`, `Sediada em`, `Atitude em relação ao risco`; o carregador original (81915–82080) procura cabeçalho e rótulos ingleses. Usa grupos de startups, sete perfis, correspondências textuais e valores padrão. Os doze casos brasileiros não são definidos por esses grupos. `Vende para` não seleciona modelo econômico; risco armazenado não seleciona automaticamente dificuldade.

Na exploração anterior ao lote, teste sintético isolado em memória com o carregador gerado: entrada PT de assistência técnica/especialista retornou `aether`/`academic` sem erro; controle EN (`Tools`, `The Domain Expert`) retornou `avam`/`domain`. Isso não foi teste visual nem chamada da API. Reverter somente três valores ao inglês não resolve rótulos, cidades e semântica econômica.

Contrato futuro: versão explícita; IDs estáveis para empreendimento, perfil e localização; valores técnicos distintos dos rótulos traduzidos; nome e narrativa em português. Validar tudo antes de alterar qualquer estado, não usar `aether`/`academic`/primeira cidade como fallback. Formato legado somente por adaptador identificado e sem inferência ambígua. Valores desconhecidos devem produzir mensagem acionável e conservar a partida integralmente. Testes: 12 perfis × 12 empreendimentos válidos, IDs inválidos, faltantes, acentos/gênero na prosa, cidade ambígua, arquivo incompleto, conteúdo hostil em nome, versão futura e tentativa de carregar sobre uma partida ativa.

Geografia pode manter IDs canônicos; exônimos pertencem à apresentação. Não traduzir as chaves do dicionário às cegas. Os rótulos de perfis da Ada diferem dos rótulos locais e cinco perfis não são oferecidos: iniciante, visionário, recursos próprios, comunidades e estrategista.

Privacidade: substituir futuramente a promessa absoluta de confidencialidade por aviso que descreva o serviço externo e suas condições; solicitar somente personagens/empresas fictícios. Nenhum arquivo de aluno enviado automaticamente. Manter jogo padrão offline e sem conta/chave. API direta requer autenticação e versão; login em outro site não prova funcionamento do JSX local. Referência consultada na exploração: https://platform.claude.com/docs/en/api/overview . Não introduzir chave no HTML nem relaxar a política `connect-src 'none'` do jogo. Forma de hospedagem/autenticação depende de autorização separada.

## 5. Critério de próxima decisão

Este documento entrega o rastreamento conceitual das afirmações, não uma autorização para modificar as fórmulas. Antes de implementar o motor, fechar parâmetros, metas, eventos, tratamento de pivôs e política de versões de save. Antes de publicar a prosa nova, cada promessa E precisa de implementação/teste ou deve ser explicitamente reclassificada como N. As ressalvas clínicas, privacidade e ausência de medicamentos permanecem obrigatórias.
