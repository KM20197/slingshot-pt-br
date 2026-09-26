# Matriz de Empreendimentos Brasileiros — Planejamento P2

**Data:** 26/09/2026
**Status:** proposta documental P2; não autoriza implementação
**Escopo de autorização:** a autorização vigente abrange a elaboração desta proposta. Não autoriza alteração de código, dados, catálogos, valores, regras, IDs ou arquivos gerados.

## 1. Leitura da matriz

Esta matriz associa os 12 IDs existentes do Slingshot aos 12 casos que o formulário P2 marca como `adaptar`. A associação é uma proposta de planejamento, não uma equivalência factual entre os negócios.

- **Evidência do original** identifica somente o ID, o nome e o arquétipo registrados em `COMPANIES`.
- **Decisão registrada** reproduz a classificação e a diretriz curta do formulário P2.
- **Tema pedagógico proposto** é uma hipótese para discussão posterior; não descreve o mercado brasileiro, a operação real, a regulamentação, a margem, o canal ou o modelo de receita do caso.

| # | Evidência do original | Decisão registrada | Tema pedagógico proposto | Limite da proposta |
|---|---|---|---|---|
| 1 | `aether` — Aether BioLabs; BioTech. | Clínica popular; `adaptar`; Serviços — Saúde. | Relação de confiança e conhecimento especializado. | Manter a simulação sem dados de pacientes, diagnóstico, prescrição, aconselhamento médico ou alegação clínica. A adequação de qualquer mecânica depende de decisão posterior. |
| 2 | `edu` — EduSpark AI; EdTech. | Academia; `adaptar`; Serviços. | Experiência do membro, instrutores, manutenção e segurança. | Não presumir modelo de receita, canal, dados pessoais ou recurso de IA. A adequação de mecânicas depende de decisão posterior. |
| 3 | `avam` — Avam AI; Model Infrastructure. | Assistência técnica de celulares; `adaptar`; Serviços. | Demanda, peças, garantia e produtividade. | Não inferir equivalência entre infraestrutura de modelos e serviço técnico. Preços, prazos e regras permanecem fora desta matriz. |
| 4 | `voed` — Voed AI; FoodTech. | Restaurante por quilo; `adaptar`; Serviços. | Operação, cardápio, higiene e atendimento. | Não inferir receita, demanda, desperdício ou requisitos sanitários reais. Qualquer regra simulada requer aprovação posterior. |
| 5 | `legal` — LegalMind AI; LegalTech. | Farmácia; `adaptar`; Comércio — Saúde. | Gestão comercial e serviços farmacêuticos simulados. | Não incluir prescrição, dispensação regulada, diagnóstico, aconselhamento médico ou alegação clínica. A análise jurídica do original não é transferida. |
| 6 | `dream` — DreamScape Studios; Creative AI. | Minimercado; `adaptar`; Comércio. | Giro, mix, perdas, reposição e atendimento. | Não presumir margem, estoque, escala ou canal. Esses elementos exigem definição e validação específicas. |
| 7 | `arene` — Arene AI; SportsTech. | Loja de roupas; `adaptar`; Comércio. | Coleção, giro, estoque sazonal e apresentação visual. | Não afirmar que contratos, clientes ou métricas do original se aplicam ao varejo. |
| 8 | `vanguard` — Vanguard Robotics; Robotics. | Material de construção; `adaptar`; Comércio. | Logística, mix pesado, entrega e capital imobilizado. | Não transferir automação, custos, depreciação, preços ou prazos do original. |
| 9 | `terra` — TerraMind Analytics; CleanTech. | Produtos de limpeza; `adaptar`; Indústria — Saúde. | Higiene profissional para clínicas, escolas e empresas. | Não fazer alegação sanitária ou médica não fundamentada. Não inferir financiamento, demanda ou conformidade regulatória. |
| 10 | `sorgente` — Sorgente AI; Consumer Wellbeing. | Alimentos congelados; `adaptar`; Indústria. | Produção, refrigeração, contratos e capacidade. | Não inferir cadeia de frio, perecibilidade, receita ou exigência sanitária real. |
| 11 | `cyber` — CyberShield AI; CyberSec. | Confecção; `adaptar`; Indústria. | Lotes, qualidade, uniformes e capacidade produtiva. | Não estabelecer paralelismo factual entre segurança cibernética e produção têxtil. |
| 12 | `quant` — QuantFlow Systems; FinTech. | Gráfica/embalagens; `adaptar`; Indústria. | Impressão, prazos, acabamento, máquinas e materiais. | Não transferir trading, preços, fila de pedidos, penalidades ou outros parâmetros sem aprovação e validação próprias. |

## 2. Cláusulas normativas

### 2.1 Natureza da relação entre arquétipos

Os arquétipos do Slingshot e os casos brasileiros não são equivalentes. Cada associação serve apenas para organizar uma proposta de adaptação futura e não comprova compatibilidade operacional, financeira, regulatória ou pedagógica.

### 2.2 Hipóteses de adaptação

Os temas pedagógicos desta matriz são hipóteses de desenho. Nenhum deles comprova fatos sobre empresas brasileiras ou autoriza mudanças no jogo. Valores, taxas, custos, regras de pagamento, itens de estoque, concorrentes, estruturas de receita e eventos do Johgo não podem ser transferidos para o Slingshot por esta matriz.

### 2.3 Diretrizes de segurança sanitária — Saúde

Para Clínica popular, Farmácia e Produtos de limpeza:

- Não usar dados de pacientes.
- Não simular diagnóstico, prescrição, aconselhamento médico ou dispensação regulada.
- Não fazer alegações clínicas.
- Não fazer alegações sanitárias não fundamentadas.

### 2.4 Escopo deste documento

Este documento não autoriza alterações em código, dados ou catálogos do jogo. A implementação requer aprovação posterior da matriz e de cada lote de alteração.

### 2.5 Base de decisão e rastreabilidade

| Fonte | Localização verificável | O que sustenta nesta matriz | O que não sustenta |
|---|---|---|---|
| Fonte imutável do Slingshot | `source/index.original.html`, estrutura `COMPANIES`, IDs `aether`, `edu`, `avam`, `voed`, `legal`, `dream`, `arene`, `vanguard`, `terra`, `sorgente`, `cyber` e `quant`; estruturas `VENTURE_DETAILS` correspondentes. | Os 12 IDs, nomes e arquétipos originais; contexto a ser preservado para análise futura. | A seleção brasileira, a equivalência entre os negócios, custos, receita, mercado, regulamentação ou regras novas. |
| Decisão do usuário registrada | `docs/FORMULARIO_DECISAO_P2.md`, linhas de casos Johgo e seção “Casos originais do Slingshot”. | Os 12 casos marcados como `adaptar`, os quatro casos de `referência`, os dois `descartar`, a restrição de quatro casos por setor e as restrições de saúde. | Implementação, valores, dados, novos IDs ou parâmetros econômicos. |
| Inventário da referência Johgo | `docs/REVISAO_EXPLORACAO_JOHGO_P2_2026-09-26.md`, seções “Fonte identificada”, “Fatos aceitos para a futura proposta” e “Limites obrigatórios”. | A existência dos 18 tipos de empreendimento no inventário, o hash observado da cópia candidata e a vedação de transferência direta de dados e regras. | Que a cópia candidata seja a referência definitiva, ou que ela autorize qualquer alteração no Slingshot. |
| Governança do projeto | `docs/HANDOFF_LLM_COMPLETO.md`, seções “Referência Johgo para planejamento de P2”, “Trabalho pendente” e “Adaptações funcionais ainda necessárias”. | A necessidade de aprovação explícita antes de alterar dados ou código e a separação entre planejamento, calibração e implementação. | Aprovação automática desta proposta como lote de implementação. |

**Lacunas registradas.** Esta matriz não contém fonte citada para mercado, demanda, margem, preços, custos, legislação, requisitos sanitários, concorrência, modelo de receita ou viabilidade operacional dos casos brasileiros. Esses temas ficam fora do escopo até receberem fonte apropriada, decisão explícita e, quando cabível, validação própria.

## 3. Verificação de integridade da matriz

| Critério | Resultado | Fonte de conferência |
|---|---|---|
| 12 IDs originais distintos | 12 identificados | `source/index.original.html` — `COMPANIES` |
| 12 casos brasileiros distintos | 12 marcados como `adaptar` | `docs/FORMULARIO_DECISAO_P2.md` |
| Quatro casos em Serviços | Contagem derivada dos 12 casos `adaptar`: Clínica popular, Restaurante por quilo, Academia e Assistência técnica de celulares | Casos e restrição de quatro por setor em `docs/FORMULARIO_DECISAO_P2.md` |
| Quatro casos em Comércio | Contagem derivada dos 12 casos `adaptar`: Farmácia, Minimercado, Loja de roupas e Material de construção | Casos e restrição de quatro por setor em `docs/FORMULARIO_DECISAO_P2.md` |
| Quatro casos em Indústria | Contagem derivada dos 12 casos `adaptar`: Produtos de limpeza, Alimentos congelados, Confecção e Gráfica/embalagens | Casos e restrição de quatro por setor em `docs/FORMULARIO_DECISAO_P2.md` |
| Casos de referência fora da matriz | Pet shop, Loja de eletrônicos, Cosméticos e Móveis | `docs/FORMULARIO_DECISAO_P2.md` |
| Casos descartados fora da matriz | Salão/barbearia e Metalúrgica | `docs/FORMULARIO_DECISAO_P2.md` |

## 4. Casos não mapeados

### 4.1 Casos de referência

- Pet shop
- Loja de eletrônicos
- Cosméticos
- Móveis

### 4.2 Casos descartados

- Salão/barbearia — baixa prioridade pedagógica registrada no formulário.
- Metalúrgica — capital intensivo e riscos de segurança acima do escopo inicial, conforme o formulário.
