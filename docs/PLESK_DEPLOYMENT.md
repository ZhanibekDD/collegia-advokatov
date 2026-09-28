# Развёртывание KAOJ.KZ в Plesk через Git

## Git

- URL репозитория: `https://github.com/ZhanibekDD/collegia-advokatov.git`
- Ветка: `deploy/plesk`
- Режим: автоматический
- Путь сервера: `/httpdocs`
- Дополнительное действие развёртывания: `bash scripts/plesk-deploy.sh`

Если GitHub-репозиторий станет закрытым, вместо HTTPS нужно подключить SSH-ключ, показанный Plesk.

## Node.js

- версия: Node.js 22.13 или новее;
- режим: `Production`;
- корень приложения: `/httpdocs`;
- корень документов: `/httpdocs/dist/standalone/dist/client`;
- файл запуска: `server.mjs`;
- менеджер пакетов: `npm`.

После первого получения ветки выполните `NPM install`, затем сценарий `build:plesk` и включите Node.js. При последующих Git-развёртываниях сборка выполняется сценарием `scripts/plesk-deploy.sh`.

## Переменные окружения

Обязательные:

- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://kaoj.kz`
- `SQLITE_PATH=/var/www/vhosts/kaoj.kz/private/kaoj.sqlite`
- `ADMIN_PASSWORD` — отдельный сложный пароль панели `/admin`
- `ADMIN_SESSION_SECRET` — случайная строка длиной не менее 32 символов

Для Telegram после создания бота:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`
- `TELEGRAM_ADMIN_IDS`
- `SITE_URL=https://kaoj.kz`

После включения HTTPS зарегистрируйте webhook командой `node scripts/setup-telegram-webhook.mjs` из консоли Plesk.

## Данные

Файл SQLite хранится за пределами `/httpdocs`, поэтому обновление сайта через Git его не перезаписывает. Таблицы и исходные записи адвокатов/новостей создаются автоматически при первом обращении.
