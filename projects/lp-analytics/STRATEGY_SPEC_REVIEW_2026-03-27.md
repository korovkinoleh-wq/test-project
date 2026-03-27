# STRATEGY SPEC REVIEW — 2026-03-27

## Scope

Review of `STRATEGY_FORMULAS_SPEC.md` as the formal math/product spec for the LP Analytics Strategy layer.

## Main conclusion

Спецификация сильная как skeleton v1 и уже годится как основа для реализации части Strategy.

Однако разные части спецификации имеют разную степень готовности к кодингу.

## What is already strong and implementation-ready

### 1. Reference calibration
- `P_ref = sqrt(L_ref * H_ref)`
- `S_price = P / P_ref`

### 2. Asymmetric bounds construction
- split via `A_pct` and `U_pct`
- lower / upper bound formulas

### 3. Manual strategy core flow
- inputs -> bounds -> lower bound outcome

### 4. Base liquidation model (v1)
- collateral value
- debt
- health factor
- liquidation price

## What needs clarification before coding

### 1. Auto Split semantics
Не определено достаточно строго:
- что такое `Share_asset`
- как именно `k` связан с target income
- как `k` конвертируется обратно в `W`

### 2. `k` as unified internal parameter
Нужна единая формальная связь:
- target income -> `k`
- `k` -> width `W`
- `W` -> bounds / outputs

### 3. Lower-bound inventory math explanation
Формула `Q_buy` требует либо derivation, либо явного описания допущения и области применимости.

### 4. Rebalance price semantics
Нужно определить, что именно такое `P_reb`.

### 5. New split parameters
Нужно зафиксировать происхождение `A_pct_new` and `U_pct_new`.

## Where assumptions are still too vague

- exact APR semantics
- price source vs oracle semantics
- simple vs compound debt accumulation
- protocol-specific assumptions for lending
- explicit percent normalization rules in engine

## Implementation recommendation

Не начинать реализацию со всего Strategy layer сразу.

## Recommended first implementation target

### Manual Strategy Core

Inputs:
- `C`
- `P`
- `W`
- `A_pct`
- `U_pct`

Outputs:
- `L`
- `H`
- `Q_0`
- `Q_buy`
- `Q_total`
- `PnL_L`

## Recommended implementation order

1. Manual Strategy Core
2. Reference Calibration
3. Auto Split (after clarification)
4. Rebalance & Liquidation Risk v1
5. Top-up effect
