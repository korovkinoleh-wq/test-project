# DEPLOYMENT PLAN

## Current target

Первый online testing deploy для текущего static/frontend-first состояния проекта.

## Recommended platform

Cloudflare Pages

## Current deploy source

- `projects/lp-analytics/deploy/static-test/`

## Why this folder

Это очищенный static deploy snapshot текущего Codex-среза после первого patch-pass.

## Current contents

- `index.html`
- `styles.css`
- `script.js`
- image assets

## Cloudflare Pages setup

### Option A — direct static folder via git repo

Если репозиторий уже лежит в GitHub:
1. подключить репозиторий в Cloudflare Pages
2. framework preset: none
3. build command: none
4. output directory: `projects/lp-analytics/deploy/static-test`

### Option B — separate deploy repo/branch

Если нужен более чистый release flow:
1. вынести `static-test` в отдельную publish-ветку
2. подключить эту ветку в Cloudflare Pages

## Pre-deploy checklist

- проверить калькулятор вручную в браузере
- проверить asset paths
- проверить Binance API fallback
- проверить localStorage snapshots flow
- проверить mobile layout

## Next recommended step

После локальной проверки — подготовить либо GitHub push flow, либо отдельную publish branch strategy.
