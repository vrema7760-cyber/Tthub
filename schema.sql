-- === HalloweenTok Database Schema ===
-- Выполняйте миграции через: npx wrangler d1 execute halloweentok-main-db --file=./schema.sql

-- Пользователи
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);

-- Сессии аутентификации
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id, expires_at);

-- Шарды для хранения медиа в D1 (метаданные)
CREATE TABLE IF NOT EXISTS shards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  d1_db_name TEXT NOT NULL,
  max_bytes INTEGER NOT NULL,
  used_bytes INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_shards_active ON shards(is_active, used_bytes);

-- Медиа-контент (фото/видео)
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT CHECK(type IN ('photo', 'video')) NOT NULL,
  shard_id TEXT NOT NULL,
  blob_key TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER NOT NULL,
  caption TEXT,
  likes_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shard_id) REFERENCES shards(id)
);
CREATE INDEX IF NOT EXISTS idx_media_user ON media(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_feed ON media(deleted_at, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_shard ON media(shard_id);

-- Лайки
CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  media_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (media_id)
