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
- Настроен рабочий deploy contour: GitHub + Cloudflare Pages + host-based deploy.
- Выполнен первый успешный online deploy и подтверждено, что сайт открывается публично.

## What is next

1. Реализовать Manual Strategy Core как первый модуль Strategy layer.
2. Добавить validation rules и deterministic tests для Strategy Core.
3. Продолжить стабилизацию Calculator v1 после первого patch-pass.
4. Уточнить Auto Split semantics (`k`, `Share_asset`, `k -> W`) через follow-up review / AI Studio.
5. При необходимости выпускать новые online deploy итерации через настроенный workflow.

## Current blockers

- Нужна реализация patch-plan для calculator.
- Нужен выбор момента для первого онлайн-деплоя после исправлений.

## Owner-facing summary

Фундамент проекта уже создан. Сейчас команда перешла к практической стабилизации Calculator v1: математика в целом соответствует модели, но нужно исправить данные, валидацию и интерфейсную честность перед публичным тестированием.
