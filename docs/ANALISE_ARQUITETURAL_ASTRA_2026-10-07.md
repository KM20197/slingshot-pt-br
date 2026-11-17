# Análise arquitetural econômica — parecer Astra Médio

**Data:** 07/10/2026  
**Escopo:** somente leitura; não aprova valores nem mudanças no jogo.

## Conclusão

A reexecução de L3k-b0 mede sensibilidade dos candidatos no estado simplificado, mas não é equivalente a uma partida. Não demonstra que reduzir folha mascararia necessariamente um problema estrutural. Antes de nova calibração, é preciso provar a equivalência de um trimestre e decompor os componentes econômicos.

## Achados relevantes

- O cenário mínimo de Rodada11 ainda cobra supervisor candidato. A referência sem `brBusiness` cobra a gestão legada de Yuki, Wei e Marcus. Nenhuma delas representa “equipe zero”.
- Os seis IDs pendentes não existem no catálogo de pessoas/contratos; `brBusiness` por si só não habilita o runtime. O caminho candidato é um adaptador temporário, não uma partida real.
- O burn legado herdado não demonstra adequação aos negócios brasileiros. Ocupação, estoque inicial e composição do burn exigem reconciliação antes de mudanças.
- O script avança até Q16 após caixa não positivo e não executa integralmente falência, crise, decisões, marcos e choques. Seus saldos posteriores à insolvência são contrafactuais.
- Há hipótese concreta a auditar em indústria: perdas podem reduzir unidades e também entrar na baixa de estoque. Não tratar como erro confirmado sem prova de intenção de consumo adicional.
- Os custos adicionais relatados como 288, 336 e 432 representam milhares de reais no motor.

## Próximo experimento

`L3k-arquitetural-1` deve comparar um trimestre com mesmo estado entre o fechamento real e adaptador isolado. Fixar cidade, fundador, modo, gestão, crédito, decisões e crise; registrar caixa, burn, folha, ocupação, recebíveis, estoque, perdas, reposição, compras, receita, parcela, juros e principal. Só depois avaliar Q1–Q16 ou parâmetros.

## Execução OpenCode

O explorador local identificou o fluxo real em `index.html:45820–46289`: operação, decisões, receita, caixa, parcelas, falência e crise. A primeira sessão do worker recebeu contrato restrito a `artifacts/l3k-arquitetural/`, mas foi interrompida após exaustão de contexto sem criar script, resultado ou relatório. Isso não é uma falha do jogo nem prova de equivalência; a próxima tentativa deve ser menor e focada apenas em extrair/exercitar o fechamento de um trimestre.
