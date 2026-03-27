# DEPLOY WORKFLOW

## Current deployment model

LP Analytics сейчас деплоится как static/frontend-first app через Cloudflare Pages.

## Active deployment targets

- **GitHub repo:** `korovkinoleh-wq/test-project`
- **Cloudflare Pages project:** `lp-analytics-test`
- **Production URL:** `https://lp-analytics-test.pages.dev/`

## Current deploy source

- `projects/lp-analytics/deploy/static-test/`

## Deployment principle

Не деплоить случайный рабочий мусор из workspace.
Деплой идёт из отдельного подготовленного static snapshot.

## Default deploy flow

1. Внести изменения в рабочие проектные файлы.
2. Проверить логику/данные/UI локально.
3. Обновить static deploy snapshot при необходимости.
4. Commit в git.
5. Push в GitHub.
6. Deploy через Cloudflare Pages CLI (`wrangler pages deploy`).
7. Проверить Pages URL после выкладки.
8. Сообщить владельцу, что новая версия доступна.

## Current auth/deploy assumptions

- GitHub auth на Molbot уже настроен.
- Cloudflare API token на Molbot уже настроен.
- Deploy можно выполнять автономно с хоста.

## Safety rules

- Не деплоить большие изменения без краткой валидации.
- Не менять production URL/Pages project без явной причины.
- Перед заметным деплоем обновлять проектную память (`STATUS.md`, `WORKLOG.md` при необходимости).

## Future improvement path

Позже можно добавить:
- отдельную staging/review ветку
- preview deploy policy
- smoke-checklist перед deploy
- автоматизацию deploy по команде или по merge
