# HOSTING REVIEW — 2026-03-27

## Objective

Подобрать лучшие варианты бесплатного/почти бесплатного онлайн-хостинга для текущего состояния LP Analytics.

## Current project state

Сейчас проект выглядит как frontend-first / static app:
- `index.html`
- `styles.css`
- `script.js`
- assets/images

Это значит, что для первичного онлайн-тестирования полноценный backend/VPS не нужен.

## Recommended options

### 1. Cloudflare Pages — best overall recommendation
Плюсы:
- free tier
- быстрый CDN
- GitHub integration
- auto deploy on push
- preview deployments
- хороший путь роста

Минусы:
- если позже понадобится тяжёлый backend, понадобится отдельный слой

### 2. Netlify
Плюсы:
- очень простой старт
- drag-and-drop или git deploy
- preview deploys

Минусы:
- free tier местами быстрее упирается в ограничения

### 3. Vercel
Плюсы:
- polished deploy UX
- отлично для JS app workflows

Минусы:
- для текущего plain static состояния может быть overkill

### 4. GitHub Pages
Плюсы:
- очень просто
- бесплатно

Минусы:
- слабее по preview/deploy workflow
- меньше гибкости

### 5. Firebase Hosting
Плюсы:
- хороший путь, если скоро нужен auth/db ecosystem

Минусы:
- overkill для текущего static prototype

## Best recommendation

### Current best pick: Cloudflare Pages

Это лучший баланс:
- бесплатно
- просто
- быстро
- удобно для тестирования
- есть путь роста

## Suggested deployment path

1. положить проект в GitHub
2. подключить репозиторий к Cloudflare Pages
3. если проект static:
   - build command: none
   - output dir: root or dist
4. использовать auto deploy and preview deploys

## Future upgrade path

Если позже понадобится backend/db:
- frontend оставить на Cloudflare Pages
- backend/auth/db добавить через Supabase
