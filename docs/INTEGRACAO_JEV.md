# Instrução Reutilizável: Triagem com Jev (TypeSafe System One)

## Finalidade

Jev (TypeSafe System One) é um modelo restrito a respostas tipadas e probabilísticas, útil para triagem de classificação de conteúdo (ex.: classificar campos de estruturas JSON como interface, prosa, referência factual, nome próprio, chave técnica ou código a preservar).

Esta integração é **opcional** e deve ser chamada por um script auxiliar local. O 9router local não expõe o endpoint de decisões nesta instalação. O OpenRouter oferece `POST https://openrouter.ai/api/alpha/decisions` para `typesafe/jev-1.13`; a TypeSafe oferece `POST https://api.typesafe.ai/v1/systemone` para `jev-latest`. As duas rotas usam chaves próprias. A existência dos endpoints não comprova que a autenticação desta máquina esteja válida.

## Regras de uso

1. **Escopo estrito:** Jev pode sugerir classificações e escolher entre candidatos previamente extraídos por código. Ele **não pode**:
   - Aprovar código, testes ou a versão final da tradução.
   - Calcular notas de alunos ou autorizar operações do jogo.
   - Substituir a revisão do Gauntlet ou de outro agente independente.

2. **Privacidade e segurança:**
   - **Nenhum** dado de aluno, participante, senha ou chave de API do projeto deve ser enviado ao OpenRouter ou à TypeSafe.
   - Use `OPENROUTER_API_KEY` para a rota do OpenRouter ou `TYPESAFE_API_KEY` para a rota direta da TypeSafe. Forneça a chave somente por um mecanismo local protegido; nunca a armazene no repositório, em logs ou na conversa.

## Como utilizar (exemplo conceitual com script auxiliar Node.js)

Para integrar a triagem sem alterar os agentes de programação, use uma chamada HTTP própria da API escolhida. Envie somente conteúdo fictício ou texto do projeto previamente examinado para excluir dados privados e segredos. Este exemplo mostra a rota do OpenRouter; requer autenticação válida e ainda não foi executado neste projeto.

```javascript
// Exemplo conceitual; não contém credenciais.
const textToAnalyze = "The Bank of England raised rates today.";

const body = {
  state: textToAnalyze,
  model: "typesafe/jev-1.13",
  questions: {
    isProse: {
      type: "noul",
      instructions: "Does this text represent natural language prose meant for reading, rather than a technical key or factual reference that should remain in English?",
      criteria: {
        true: "Natural language sentences, instructions, or dialog",
        false: "Names of institutions, keys, IDs, variables, or un-translatable facts"
      }
    }
  }
};

// Requisição via API fetch padrão
fetch("https://openrouter.ai/api/alpha/decisions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
})
// Trate respostas não 2xx, valide answers e leia usage.cost quando presente.
```

Para a API direta da TypeSafe, troque a URL por `https://api.typesafe.ai/v1/systemone`, o modelo por `jev-latest` e a variável por `TYPESAFE_API_KEY`. Consulte o preço vigente na rota escolhida antes de um teste pago. Um erro `401` indica que a autenticação da chamada falhou; não demonstra que o endpoint ou o modelo sejam incompatíveis. O `404` observado no 9router diz respeito ao endpoint do proxy local.

Fontes: [API da TypeSafe](https://docs.typesafe.ai/api.md), [guia do OpenRouter](https://openrouter.ai/blog/tutorials/how-to-use-jev/) e [modelo no OpenRouter](https://openrouter.ai/typesafe/jev-1.13/api).

**Em caso de revisão:**
Submeta o lote processado à revisão com o Gauntlet, exigindo nota fundamentada de 0 a 10 (mínimo de aprovação 9/10), com até três ciclos, registrando `BLOCKED_FOR_REVIEW` se problemas restarem ao fim.
