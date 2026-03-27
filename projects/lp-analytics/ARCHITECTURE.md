# ARCHITECTURE

## Status
Draft / to be filled

## Expected high-level components

- Snapshot ingestion / source layer
- Data normalization layer
- Calculator engine
- Strategy layer
- Rebalance / liquidation risk engine
- Portfolio allocation layer
- User input layer / UI
- Output / result presentation layer

## Open questions

- Где и в каком формате живут snapshots?
- Какая точная схема обновления данных?
- Какой интерфейс у калькулятора?
- Где проходит граница между calculation engine и strategy engine?
- Какие части должны быть детерминированными, а какие допускают эвристики?
