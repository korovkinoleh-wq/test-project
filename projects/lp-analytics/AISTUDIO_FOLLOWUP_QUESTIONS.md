# AISTUDIO FOLLOW-UP QUESTIONS

## Purpose

Список уточнений, которые нужно запросить у AI Studio, если/когда команда упрётся в неоднозначности спецификации.

## Auto Split clarifications

1. Что такое `Share_asset` в формуле Auto Split?
2. Почему `I_target` умножается именно на `Share_asset`?
3. Как из `k` получить итоговую ширину диапазона `W`?
4. Является ли `k` универсальным внутренним параметром для обеих стратегий: manual и auto?

## Lower-bound math clarifications

5. Откуда выведена формула `Q_buy = C * (U_pct/100) / (sqrt(L) * sqrt(P))`?
6. Для каких допущений и диапазонов она валидна?
7. Какова ожидаемая погрешность этого упрощения?

## Rebalance / lending clarifications

8. Что именно означает `P_reb`?
9. `P_reb = lower bound`, market price at rebalance, or oracle price?
10. Debt accrual uses simple interest or compounding?
11. Учитываются ли protocol-specific penalties / liquidation bonus?
12. Что именно означают `A_pct_new` и `U_pct_new` — input, inherited split, or recomputed split?

## APR / reference data clarifications

13. Что именно означает `APR_ref` — gross APR, trailing APR, or pool-specific reference APR under the reference range?
14. Какая точная связь между `APR_ref`, monthly target, and expected strategy output?
