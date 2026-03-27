# REVIEW REQUEST — 2026-03-27

## Objective

Нужно провести две параллельные проверки:

### A. Calculator v1 review
Проверить точность и корректность реализации упрощённого calculator v1 в текущем Codex-срезе проекта.

### B. Hosting review
Подобрать варианты бесплатного/почти бесплатного онлайн-хостинга, где владелец проекта сможет быстро выкладывать и тестировать продукт.

## Input artifacts

- `projects/lp-analytics/inbox/codex-drop-2026-03-27/index.html`
- `projects/lp-analytics/inbox/codex-drop-2026-03-27/styles.css`
- `projects/lp-analytics/inbox/codex-drop-2026-03-27/script.js`
- `projects/lp-analytics/CALCULATOR_V1_SPEC.md`

## Context from owner

- Calculator должен остаться упрощённым estimate-инструментом.
- Сложная стратегическая логика будет жить в отдельном разделе Strategy.
- В calculator не нужно тащить time-in-range и прочую тяжёлую симуляцию.
- Нужно проверить именно корректность текущей упрощённой модели и её реализации.
- Параллельно нужно предложить удобный бесплатный хостинг для тестирования продукта онлайн.

## Expected outputs

### Calculator review output
- что в calculator реализовано корректно
- где есть баги / несоответствия / опасные места
- какие правки нужны прямо сейчас
- что нужно явно отразить в UI как limitations

### Hosting review output
- 3–5 вариантов хостинга
- плюсы/минусы каждого
- лучший вариант для текущего статического/frontend-first состояния проекта
- рекомендации по деплою
