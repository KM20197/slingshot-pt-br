# Proposta P3d — fallback de oportunidades

P3d localiza somente os três fallbacks de ausência de dados em
`Game.renderCurrentMarketTab`, `Game.renderOpportunitiesTab` e
`Game.renderAssumptionsTab`. Cada transformação é limitada ao corpo do próprio método.
Não altera dados de mercado, regras, cálculos, IDs ou saves.
