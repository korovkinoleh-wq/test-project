# STRATEGY UI INTEGRATION PLAN

## Current state

Текущий Codex frontend-срез не содержит реализованного Strategy view.
Есть dashboard, calculator и token calculator, но отдельного strategy panel в текущем `index.html` / `script.js` ещё нет.

## Consequence

Перед полноценной UI-интеграцией Strategy Manual Core нужны два параллельных слоя работы:

1. **Math core implementation**
2. **Future UI container / view design**

## Recommended immediate path

### Step 1 — Implement pure Strategy Manual Core math layer
Сделать чистые функции без привязки к DOM.

### Step 2 — Add deterministic validations and test cases
Сначала проверить корректность ядра отдельно от интерфейса.

### Step 3 — Design Strategy view contract
Определить:
- какие input fields нужны
- какие output cards нужны
- какие warnings/errors нужны

### Step 4 — Add Strategy panel to frontend
Только после стабилизации math layer.

## Proposed Strategy Manual Core UI blocks

### Inputs
- Total capital
- Current market price
- Range width
- Asset %
- USDC %

### Outputs
- Lower bound
- Upper bound
- Initial asset amount
- Bought asset amount at lower bound
- Total asset amount at lower bound
- PnL at lower bound

### Validation / warnings
- split must equal 100%
- width must be > 0
- lower bound must stay above 0
- capital and price must be > 0

## Recommendation

Не пытаться сразу встраивать Strategy во frontend без готового math core.
Сначала делаем engine, потом UI shell.
