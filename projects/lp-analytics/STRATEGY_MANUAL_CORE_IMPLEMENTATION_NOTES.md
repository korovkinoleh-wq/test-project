# STRATEGY MANUAL CORE IMPLEMENTATION NOTES

## Purpose

Подготовка к кодовой реализации Manual Strategy Core.

## Implementation style

Use pure deterministic functions first.
Do not couple formulas directly to DOM or view rendering.

## Suggested function contract

### `validateStrategyManualInputs(input)`
Input:
- capital
- currentPrice
- width
- assetPct
- usdcPct

Output:
- `{ valid: true }`
- or `{ valid: false, message: string }`

### `calculateStrategyManualCore(input)`
Input:
- capital
- currentPrice
- width
- assetPct
- usdcPct

Output:
- lowerBound
- upperBound
- initialAssetUnits
- boughtAssetUnitsAtLower
- totalAssetUnitsAtLower
- pnlAtLower

## Formula mapping

### Bounds
- `downside = width * (usdcPct / 100)`
- `upside = width * (assetPct / 100)`
- `lowerBound = currentPrice - downside`
- `upperBound = currentPrice + upside`

### Initial asset units
- `initialAssetUnits = (capital * (assetPct / 100)) / currentPrice`

### Bought asset units at lower bound
- `boughtAssetUnitsAtLower = (capital * (usdcPct / 100)) / (Math.sqrt(lowerBound) * Math.sqrt(currentPrice))`

### Total asset units at lower bound
- `totalAssetUnitsAtLower = initialAssetUnits + boughtAssetUnitsAtLower`

### PnL at lower bound
- `pnlAtLower = (totalAssetUnitsAtLower * lowerBound) - capital`

## Required validation

- capital > 0
- currentPrice > 0
- width > 0
- assetPct >= 0
- usdcPct >= 0
- assetPct + usdcPct === 100
- lowerBound > 0

## Immediate coding target

Implement this as a separate math module or a clearly isolated block inside the frontend script before any Strategy UI is added.
