# STRATEGY MANUAL CORE UI CONTRACT

## Purpose

Связать реализованный math core (`src/strategy-manual-core.js`) с будущим Strategy UI.

## Input fields

### Required inputs
- `capital` — Total Capital (USD)
- `currentPrice` — Current Market Price (USD / asset)
- `width` — Range Width (price units)
- `assetPct` — Asset %
- `usdcPct` — USDC %

## Validation behavior

### Hard validation errors
- capital <= 0
- currentPrice <= 0
- width <= 0
- assetPct < 0
- usdcPct < 0
- assetPct + usdcPct != 100
- lowerBound <= 0

### UI response
- show validation error inline
- do not compute result cards until input is valid

## Output cards

### Core outputs
- Lower Bound
- Upper Bound
- Initial Asset Units
- Bought Asset Units at Lower Bound
- Total Asset Units at Lower Bound
- PnL at Lower Bound

## Presentation guidance

- Lower/Upper Bound -> price formatting
- Asset units -> high precision numeric formatting
- PnL -> signed USD formatting

## Suggested warnings

- `This is Strategy Manual Core only. Auto Split and leverage logic are not included yet.`
- `This output reflects lower-bound accumulation math, not full market path simulation.`

## Integration principle

UI should call `validateStrategyManualInputs()` first.
If valid, UI calls `calculateStrategyManualCore()` and maps outputs to cards.
