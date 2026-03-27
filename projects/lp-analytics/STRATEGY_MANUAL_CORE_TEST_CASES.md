# STRATEGY MANUAL CORE TEST CASES

## Purpose

Набор deterministic test scenarios для Manual Strategy Core.

## Test Case 1 — Balanced split

Inputs:
- C = 1000
- P = 2000
- W = 400
- A_pct = 50
- U_pct = 50

Expectations:
- bounds computed deterministically
- `A_pct + U_pct = 100`
- `L > 0`
- lower bound outputs are finite

## Test Case 2 — Accumulation-style split

Inputs:
- C = 1000
- P = 2000
- W = 400
- A_pct = 5
- U_pct = 95

Expectations:
- downside is larger than upside
- lower bound significantly below current price
- lower-bound asset accumulation exceeds initial asset amount

## Test Case 3 — Invalid split

Inputs:
- C = 1000
- P = 2000
- W = 400
- A_pct = 40
- U_pct = 40

Expectations:
- validation error because split != 100

## Test Case 4 — Invalid width

Inputs:
- C = 1000
- P = 2000
- W = 0
- A_pct = 5
- U_pct = 95

Expectations:
- validation error

## Test Case 5 — Invalid lower bound

Inputs should force `L <= 0`.

Expectations:
- validation error
