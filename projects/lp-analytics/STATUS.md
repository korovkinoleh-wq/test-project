# STATUS

## Current phase

Review -> stabilization of Calculator v1

## Current objective

Зафиксировать Calculator v1 как simplified estimator, исправить найденные проблемы реализации и подготовить проект к первому онлайн-тестированию.

## What is already done

- Определён базовый состав ролей для проекта.
- Принято решение строить работу через одного координатора и внутренние специализированные роли.
- Принято решение хранить промежуточные этапы разработки в проектных файлах, а не только в истории чатов.
- Создан базовый каркас проектной памяти и workflow.
- Получен и сохранён Codex-срез проекта (dashboard + calculator + token calculator).
- Зафиксирована спецификация Calculator v1 (`CALCULATOR_V1_SPEC.md`).
- Выполнен review calculator logic и найден список конкретных проблем.
- Выполнен review вариантов бесплатного хостинга для онлайн-тестирования.

## What is next

1. Зафиксировать Calculator v1 как simplified estimator model.
2. Исправить AVAX data inconsistency.
3. Добавить validation для user range width и snapshots.
4. Уточнить reference liquidity и wording UI.
5. Подготовить первый online testing deploy.

## Current blockers

- Нужна реализация patch-plan для calculator.
- Нужен выбор момента для первого онлайн-деплоя после исправлений.

## Owner-facing summary

Фундамент проекта уже создан. Сейчас команда перешла к практической стабилизации Calculator v1: математика в целом соответствует модели, но нужно исправить данные, валидацию и интерфейсную честность перед публичным тестированием.
