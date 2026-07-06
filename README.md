# 🎃 HalloweenTok

TikTok-стиль воркер на Cloudflare Workers + D1 (без R2, без Dispatch Namespace, без Dynamic Worker).

## Архитектура

- **halloweentok** (главный воркер) — фид, лайки/сохранения/комменты, чат, поиск, Google OAuth, роутинг загрузок по шардам.
- **halloweentok-shard-N** (шард-воркеры) — каждый со своей D1 (~5GB), хранит только бинарники видео/фото чанками (чтобы не упереться в лимит размера строки D1). Главный воркер видит их через **service bindings**.
- Сжатие видео/фото происходит **на клиенте в браузере** (в Worker нет ffmpeg): фото — через canvas, видео — через перерисовку кадров на canvas нужного разрешения + `MediaRecorder` с заданным битрейтом.

Лестница сжатия видео (как просили): 720p → 480p, на каждом разрешении битрейт 800 → 400 → 100 kbps, до тех пор пока итоговый файл не станет ≤3MB. Фото ужимается по качеству/разрешению до ≤0.5MB.

## Деплой

```bash
# 1. Главная БД
npx wrangler d1 create halloweentok-main-db
# вставь полученный database_id в wrangler.toml

npx wrangler d1 execute halloweentok-main-db --file=./schema.sql

# 2. Первый шард
cd shard-worker
npx wrangler d1 create halloweentok-shard-1-db
# вставь database_id в shard-worker/wrangler.toml
npx wrangler d1 execute halloweentok-shard-1-db --file=./schema.sql
npx wrangler deploy

# 3. Главный воркер
cd ..
# впиши GOOGLE_CLIENT_ID/SECRET (из Google Cloud Console, OAuth consent + Web application,
# redirect URI: https://<твой-домен>/auth/google/callback)
# впиши INTERNAL_SECRET — одинаковый в главном воркере и во всех shard-worker'ах
npx wrangler deploy
```

## Как добавить ещё +5GB (новый шард)

1. Скопируй папку `shard-worker` → `shard-worker-2`.
2. В `shard-worker-2/wrangler.toml` смени `name` и `database_name`/`database_id`.
3. `npx wrangler d1 create ...`, выполни `schema.sql`, `npx wrangler deploy`.
4. В главном `wrangler.toml` добавь:
   ```toml
   [[services]]
   binding = "SHARD_2"
   service = "halloweentok-shard-2"
   ```
5. В главной БД добавь строку:
   ```sql
   INSERT INTO shards (id, binding_name, capacity_bytes, used_bytes, active)
   VALUES ('shard-2', 'SHARD_2', 5000000000, 0, 1);
   ```
6. Задеплой главный воркер заново (`npx wrangler deploy`) — координатор (`src/shards.js`) сам начнёт писать в наименее заполненный шард.

## Важные оговорки

- **Лимит размера значения в D1** сейчас ограничен (был около 1MB на строку), поэтому blob'ы режутся на чанки по 900KB в `shard-worker`. Перепроверь актуальный лимит в документации Cloudflare перед продакшеном — если он изменится, поправь `CHUNK_SIZE` в `shard-worker/src/index.js`.
- **MediaRecorder-перекодирование** в браузере — не такой гибкий инструмент, как настоящий кодек-энкодер (ffmpeg/x264): битрейт соблюдается приблизительно, а не точно. Тестируй лестницу на реальных видео и подстрой пороги при необходимости.
- Сессии сейчас — простой токен в таблице `sessions` + HttpOnly cookie. Для продакшена стоит добавить ротацию токенов и логаут.
- В коде нет rate-limiting на upload/comment/like — стоит добавить (например, через Durable Objects как счётчик) от спама.
