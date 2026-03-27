# CALCULATOR PATCH PLAN

## Goal

Довести Calculator v1 до корректного и честного simplified estimator state без превращения его в Strategy engine.

## Priority 1 — must fix now

### P1. Fix AVAX dataset consistency
- проверить `currentPrice`, `minRange`, `maxRange`
- привести к единой шкале
- проверить fallback marketPrices для AVAX

### P2. Add user range validation
- запретить `0` и почти `0`
- показывать warning/error
- не маскировать это молча через safe fallback

### P3. Clarify reference liquidity
- зафиксировать, используется ли `startLiquidityUsd` как reference model liquidity
- обновить label в UI
- обновить описание модели

### P4. Improve snapshot validation
- не допускать отрицательные totals
- предупреждать, если cumulative fees уменьшаются
- предупреждать о suspicious snapshot deltas

### P5. Fix wording in UI
- `Projected APR` -> `Estimated APR`
- `Projection results` -> `Estimate results`
- `Simulate returns` -> `Estimate yield from a reference pool`
- `Yield multiplier` -> `Range-based multiplier`
- `Pool liquidity` -> `Reference liquidity used in model`
- `Quick select best yield` -> `Top reference pool` / similar

## Priority 2 — should fix next

### P6. Mark default range as example assumption
- не выдавать default range за рекомендацию

### P7. Check pair orientation consistency
- особенно BTC-related and cross-oriented pools
- убедиться, что range and price are in the same scale system

### P8. Clarify historical daily fees source
- явно указать, что daily fees derived from selected snapshot window

## Output expected from coder/reviewer

- list of changed files
- summary of fixed issues
- note on any unresolved data ambiguity
