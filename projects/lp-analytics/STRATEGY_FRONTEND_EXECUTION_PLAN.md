# STRATEGY FRONTEND EXECUTION PLAN

## Current reality

Current Codex frontend snapshot does not yet contain a Strategy view/panel.
Therefore, the next frontend step should not be a full UI merge directly into existing panels.

## Recommended next execution step

### Option A — preferred
Add a minimal Strategy sandbox panel first.

Why:
- fastest way to validate Strategy Manual Core with visible outputs
- isolates new math from dashboard/calculator complexity
- lets owner test inputs/outputs early

### Option B
Directly design the full Strategy view from AI Studio screenshots/spec.

Why not first:
- larger surface area
- more likely to mix Manual Core with Auto Split and Rebalance too early

## Recommended path

1. Add minimal Strategy sandbox UI
2. Wire sandbox UI to `strategy-manual-core.js`
3. Validate outputs visually and numerically
4. Only then evolve sandbox into real Strategy section

## Minimal Strategy sandbox contents

### Inputs
- Total Capital
- Current Price
- Range Width
- Asset %
- USDC %

### Outputs
- Lower Bound
- Upper Bound
- Initial Asset Units
- Bought Asset Units at Lower Bound
- Total Asset Units at Lower Bound
- PnL at Lower Bound

### Warnings
- Strategy Manual Core only
- Auto Split not included
- Rebalance / liquidation not included

## Decision recommendation

Proceed with Strategy sandbox first.
