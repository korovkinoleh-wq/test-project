# CALCULATOR REVIEW — 2026-03-27

## Scope

Проверка Calculator v1 в текущем Codex-срезе проекта.

Исходные артефакты:
- `inbox/codex-drop-2026-03-27/index.html`
- `inbox/codex-drop-2026-03-27/script.js`
- `inbox/codex-drop-2026-03-27/styles.css`
- `CALCULATOR_V1_SPEC.md`

## Main conclusion

Calculator v1 в целом соответствует задуманной упрощённой product model:
- reference pool based estimate
- historical fees based projection
- price scaling
- range multiplier
- projected daily fees / projected APR

То есть архитектурно калькулятор не нужно ломать и превращать в strategy engine.

## Confirmed matches with spec

- `referencePrice = sqrt(minRange * maxRange)`
- `priceScale = currentMarketPrice / referencePrice`
- `scaledReferenceRange = referenceRange * priceScale`
- `yieldMultiplier = scaledReferenceRange / userRangeWidth`
- `projectedDailyFees = historicalDailyFees * (userLiquidity / referenceLiquidity) * yieldMultiplier`
- `projectedApr = projectedDailyFees * 365.25 / userLiquidity * 100`

## Main issues found

### 1. AVAX data inconsistency
В текущем dataset AVAX currentPrice и диапазон выглядят несогласованными.
Это ломает `priceScale`, `yieldMultiplier` и projection для AVAX pools.

### 2. Ambiguous reference liquidity
Сейчас используется `startLiquidityUsd`, но в данных есть и `currentLiquidity`.
Нужно явно определить и подписать, какая именно liquidity является reference input model.

### 3. Weak validation for user range width
Нулевой или почти нулевой диапазон сейчас не блокируется должным образом.
Это может давать мусорные экстремальные APR.

### 4. Snapshot validation is too weak
Историческая база fees через snapshots сейчас почти не валидируется.
Это позволяет некорректным history values искажать calculator output.

### 5. UI wording is too strong
Некоторые подписи звучат сильнее, чем допускает simplified estimator model.
Нужно сместить wording в сторону estimate, а не forecast/simulation.

### 6. Quick select wording is misleading
`best yield` по факту выбирается по historical APR, а не по реальному projected best output под текущий user input.

## Product decision

Calculator v1 остаётся упрощённым estimator.
Сложная модель переносится в Strategy v2.

## Recommendation

Не переписывать calculator как стратегический движок.
Сначала починить данные, валидацию, терминологию и честность интерфейса.
