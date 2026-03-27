# CALCULATOR_V1_SPEC

## Purpose

Calculator v1 — это упрощённый projection-инструмент для быстрой оценки потенциальной LP-доходности на основе эталонного пула.

Он не является полноценным стратегическим симулятором и не пытается моделировать time-in-range, path dependence цены, динамику потока сделок или глубокую структуру liquidity distribution.

## Product positioning

Calculator v1 должен позиционироваться как:
- simplified projection model
- quick estimate
- reference-pool-based estimator

Он не должен позиционироваться как точный прогноз будущих комиссий.

## Inputs

- Reference pool
- Historical performance of reference pool
- User liquidity (USD)
- User input range width
- Current market price

## Core logic

1. Берётся эталонный pool.
2. Из historical data рассчитывается historical daily fees.
3. Рассчитывается reference price:
   - `sqrt(min_range * max_range)`
4. Рассчитывается price scale:
   - `current_market_price / reference_price`
5. Рассчитывается scaled reference range width:
   - `reference_range_width * price_scale`
6. Рассчитывается yield multiplier:
   - `scaled_reference_range_width / user_input_range_width`
7. Рассчитываются projected daily fees:
   - `historical_daily_fees * (user_liquidity / reference_pool_liquidity) * yield_multiplier`
8. Рассчитывается APR:
   - `(projected_daily_fees * 365.25 / user_liquidity) * 100`

## Explicit non-goals

Calculator v1 не моделирует:
- time in range
- out-of-range probability
- volatility path
- active liquidity around current tick
- changing competition inside range
- confidence interval / model uncertainty as hard math layer

## Belongs to Strategy, not Calculator

Следующие вещи должны жить в Strategy v2+, а не в Calculator v1:
- scenario analysis
- risk modeling
- range survival / out-of-range dynamics
- path-dependent price behavior
- advanced yield realism
- strategy comparison engine

## Validation tasks

Команда должна проверить:
1. Соответствует ли код именно этой продуктовой модели.
2. Нет ли багов в реализации формул.
3. Нет ли несоответствий между описанием AI Studio и кодом Codex.
4. Какие ограничения модели нужно явно показать в UI.
