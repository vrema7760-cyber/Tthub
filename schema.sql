-- HalloweenTok — главная D1 база (координатор + метаданные)
-- Сами бинарники видео/фото лежат в БД шард-воркеров, тут только ссылки.

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,             -- uuid
  github_id     TEXT UNIQUE NOT NULL,
  email         TEXT NOT NULL,
  name          TEXT NOT NULL,
  avatar_url    TEXT,
  created_at    INTEGER NOT NULL              -- unix ms
);

CREATE TABLE IF NOT EXISTS sessions (
  token         TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  expires_at    INTEGER NOT NULL
);

-- Реестр шард-воркеров (каждый — отдельный Worker со своей D1 ~5GB)
CREATE TABLE IF NOT EXISTS shards (
  id            TEXT PRIMARY KEY,             -- напр. "shard-1"
  binding_name  TEXT NOT NULL,                -- имя service binding в wrangler.toml
  capacity_bytes INTEGER NOT NULL DEFAULT 5000000000,
  used_bytes    INTEGER NOT NULL DEFAULT 0,
  active        INTEGER NOT NULL DEFAULT 1    -- 1 = принимает новые записи
);

CREATE TABLE IF NOT EXISTS media (
  id            TEXT PRIMARY KEY,             -- uuid
  user_id       TEXT NOT NULL REFERENCES users(id),
  type          TEXT NOT NULL CHECK(type IN ('video','photo')),
  shard_id      TEXT NOT NULL REFERENCES shards(id),
  blob_key      TEXT NOT NULL,                -- ключ blob'а внутри шард-БД
  caption       TEXT DEFAULT '',
  size_bytes    INTEGER NOT NULL,
  resolution    TEXT,                         -- '720p' | '480p' (для видео)
  bitrate_kbps  INTEGER,                      -- 800 | 400 | 100 (для видео)
  created_at    INTEGER NOT NULL,
  likes_count   INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  saves_count   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_user ON media(user_id);

CREATE TABLE IF NOT EXISTS likes (
  user_id       TEXT NOT NULL REFERENCES users(id),
  media_id      TEXT NOT NULL REFERENCES media(id),
  created_at    INTEGER NOT NULL,
  PRIMARY KEY (user_id, media_id)
);

CREATE TABLE IF NOT EXISTS saves (
  user_id       TEXT NOT NULL REFERENCES users(id),
  media_id      TEXT NOT NULL REFERENCES media(id),
  created_at    INTEGER NOT NULL,
  PRIMARY KEY (user_id, media_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id            TEXT PRIMARY KEY,
  media_id      TEXT NOT NULL REFERENCES media(id),
  user_id       TEXT NOT NULL REFERENCES users(id),
  text          TEXT NOT NULL,
  created_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_comments_media ON comments(media_id);

CREATE TABLE IF NOT EXISTS chats (
  id            TEXT PRIMARY KEY,
  user1_id      TEXT NOT NULL REFERENCES users(id),
  user2_id      TEXT NOT NULL REFERENCES users(id),
  created_at    INTEGER NOT NULL,
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id            TEXT PRIMARY KEY,
  chat_id       TEXT NOT NULL REFERENCES chats(id),
  sender_id     TEXT NOT NULL REFERENCES users(id),
  text          TEXT NOT NULL,
  created_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id, created_at);

-- Стартовый шард (добавляй новые строки при добавлении shard-воркеров)
INSERT OR IGNORE INTO shards (id, binding_name, capacity_bytes, used_bytes, active)
VALUES ('shard-1', 'SHARD_1', 5000000000, 0, 1);
