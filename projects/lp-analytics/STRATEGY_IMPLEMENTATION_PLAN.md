# STRATEGY IMPLEMENTATION PLAN

## Goal

Перевести Strategy layer из AI Studio concept/spec в воспроизводимую реализацию без смешивания heuristic и deterministic частей.

## Guiding principle

Не кодить весь Strategy layer сразу.
Сначала строить deterministic ядро, потом наращивать calibration, затем Auto Split, затем risk layer.

## Phase 1 — Manual Strategy Core

### Objective
Реализовать базовый accumulation engine без Auto Split.

### Scope
- total capital
- current price
- manual width
- asset %
- usdc %
- lower/upper bound
- lower-bound outcome analysis

### Deliverables
- explicit input contract
- validation rules
- pure calculation function(s)
- deterministic test cases
- UI block mapping

### Validation rules
- `A_pct + U_pct = 100`
- `W > 0`
- `L > 0`
- capital > 0
- current price > 0

## Phase 2 — Reference Calibration

### Objective
Привязать manual strategy core к reference pool scaling.

### Scope
- `P_ref`
- `S_price`
- scaled reference width
- reference pool config data

## Phase 3 — Auto Split

### Blocker
Нужно уточнить:
- `Share_asset`
- meaning of `k`
- transform `target income -> k -> W`

### Only after clarification
Реализовать auto-mode через единый internal engine path.

## Phase 4 — Rebalance & Liquidation Risk v1

### Scope
- collateral value
- borrowed amount
- debt accumulation
- health factor
- liquidation price

### Required clarifications
- `P_reb`
- debt interest model
- lending assumptions
- price/oracle semantics

## Phase 5 — Top-up Effect

### Scope
- extra collateral from new LP position
- final liquidation price

## Immediate next task

Build Manual Strategy Core first.
