-- SpookyTok — главная D1 база

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  github_id     TEXT UNIQUE NOT NULL,
  email         TEXT NOT NULL,
  name          TEXT NOT NULL,
  avatar_url    TEXT,
  created_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token         TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  expires_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS shards (
  id            TEXT PRIMARY KEY,
  binding_name  TEXT NOT NULL,
  capacity_bytes INTEGER NOT NULL DEFAULT 5000000000,
  used_bytes    INTEGER NOT NULL DEFAULT 0,
  active        INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS media (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  type          TEXT NOT NULL CHECK(type IN ('video','photo')),
  shard_id      TEXT NOT NULL REFERENCES shards(id),
  blob_key      TEXT NOT NULL,
  caption       TEXT DEFAULT '',
  size_bytes    INTEGER NOT NULL,
  resolution    TEXT,
  bitrate_kbps  INTEGER,
  created_at    INTEGER NOT NULL,
  likes_count   INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  saves_count   INTEGER NOT NULL DEFAULT 0,
  deleted_at    INTEGER
);

CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_user ON media(user_id);
CREATE INDEX IF NOT EXISTS idx_media_deleted ON media(deleted_at);

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

-- Новые таблицы для профилей и стримов
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id       TEXT PRIMARY KEY REFERENCES users(id),
  display_name  TEXT,
  bio           TEXT,
  avatar_url    TEXT,
  updated_at    INTEGER
);

CREATE TABLE IF NOT EXISTS streams (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  title         TEXT,
  description   TEXT,
  stream_url    TEXT,
  thumbnail_url TEXT,
  viewers       INTEGER DEFAULT 0,
  is_live       INTEGER DEFAULT 1,
  created_at    INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_streams_user ON streams(user_id);
CREATE INDEX IF NOT EXISTS idx_streams_live ON streams(is_live);
CREATE INDEX IF NOT EXISTS idx_profiles_user ON user_profiles(user_id);

INSERT OR IGNORE INTO shards (id, binding_name, capacity_bytes, used_bytes, active)
VALUES ('shard-1', 'SHARD_1', 5000000000, 0, 1);
