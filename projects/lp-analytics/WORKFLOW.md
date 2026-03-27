# WORKFLOW

## Default task flow

1. **Coordinator** принимает задачу от пользователя.
2. Coordinator определяет тип задачи:
   - product / scope
   - formulas / logic
   - data / snapshots
   - implementation
   - review
   - deploy
3. Coordinator создаёт подзадачи и подключает нужные роли.
4. Каждая роль возвращает результат в структурированном виде:
   - что проверено
   - что найдено
   - риски
   - next step
5. Coordinator собирает итог.
6. Если решение меняет проектное состояние:
   - обновить `STATUS.md`
   - обновить `WORKLOG.md`
   - при необходимости обновить `DECISIONS.md`, `FORMULAS.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`
7. После существенных изменений — commit.

## Quality gate

Перед завершением значимой продуктовой задачи нужно проверить:
- логика корректна
- данные корректны
- код реализован
- reviewer проверил риски
- изменения отражены в проектной памяти

## Rule: no silent decisions

Любое важное решение должно быть зафиксировано в `DECISIONS.md`.

## Rule: no hidden assumptions

Любое существенное допущение по формулам, данным или поведению пользователя должно быть явно записано в профильный файл.
