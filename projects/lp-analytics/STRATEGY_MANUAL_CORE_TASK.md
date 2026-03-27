# STRATEGY MANUAL CORE TASK

## Goal

Реализовать первый рабочий модуль Strategy layer: Manual Strategy Core.

## Scope

Inputs:
- total capital `C`
- current price `P`
- manual width `W`
- asset percent `A_pct`
- usdc percent `U_pct`

Outputs:
- lower bound `L`
- upper bound `H`
- initial asset units `Q_0`
- bought asset units `Q_buy`
- total asset units `Q_total`
- PnL at lower bound `PnL_L`

## Validation rules

- `C > 0`
- `P > 0`
- `W > 0`
- `A_pct >= 0`
- `U_pct >= 0`
- `A_pct + U_pct = 100`
- `L > 0`

## Source formulas

Use `STRATEGY_FORMULAS_SPEC.md` as the source of truth for this module.

## Deliverables

- pure calculation function(s)
- validation logic
- deterministic test inputs/outputs
- integration plan for UI layer

## Explicit non-goals

- Auto Split
- `k`
- target income automation
- rebalance / liquidation risk
- top-up effect
