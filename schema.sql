-- ============================================
-- 🎃 SpookyTok — полная схема D1 базы
-- Можно запускать повторно — всё идемпотентно
-- ============================================

-- Включаем WAL-режим (быстрее для D1)
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- ============================================
-- 1. ПОЛЬЗОВАТЕЛИ И СЕССИИ
-- ============================================
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
  user_id       TEXT NOT NULL,
  expires_at    INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ============================================
-- 2. ШАРДЫ (хранилище файлов)
-- ============================================
CREATE TABLE IF NOT EXISTS shards (
  id              TEXT PRIMARY KEY,
  binding_name    TEXT NOT NULL,
  capacity_bytes  INTEGER NOT NULL DEFAULT 5000000000,
  used_bytes      INTEGER NOT NULL DEFAULT 0,
  active          INTEGER NOT NULL DEFAULT 1
);

-- ============================================
-- 3. МЕДИА (фото и видео)
-- ============================================
CREATE TABLE IF NOT EXISTS media (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  type            TEXT NOT NULL,
  shard_id        TEXT NOT NULL,
  blob_key        TEXT NOT NULL,
  caption         TEXT DEFAULT '',
  size_bytes      INTEGER NOT NULL,
  resolution      TEXT,
  bitrate_kbps    INTEGER,
  created_at      INTEGER NOT NULL,
  likes_count     INTEGER NOT NULL DEFAULT 0,
  comments_count  INTEGER NOT NULL DEFAULT 0,
  saves_count     INTEGER NOT NULL DEFAULT 0,
  deleted_at      INTEGER
);

CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_user ON media(user_id);
CREATE INDEX IF NOT EXISTS idx_media_deleted ON media(deleted_at);

-- ============================================
-- 4. ЛАЙКИ, СОХРАНЕНИЯ, КОММЕНТАРИИ
-- ============================================
CREATE TABLE IF NOT EXISTS likes (
  user_id     TEXT NOT NULL,
  media_id    TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  PRIMARY KEY (user_id, media_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_media ON likes(media_id);

CREATE TABLE IF NOT EXISTS saves (
  user_id     TEXT NOT NULL,
  media_id    TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  PRIMARY KEY (user_id, media_id)
);

CREATE INDEX IF NOT EXISTS idx_saves_media ON saves(media_id);

CREATE TABLE IF NOT EXISTS comments (
  id          TEXT PRIMARY KEY,
  media_id    TEXT NOT NULL,
  user_id     TEXT NOT NULL,
  text        TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_media ON comments(media_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- ============================================
-- 5. ЧАТЫ И СООБЩЕНИЯ
-- ============================================
CREATE TABLE IF NOT EXISTS chats (
  id          TEXT PRIMARY KEY,
  user1_id    TEXT NOT NULL,
  user2_id    TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX IF NOT EXISTS idx_chats_user1 ON chats(user1_id);
CREATE INDEX IF NOT EXISTS idx_chats_user2 ON chats(user2_id);

CREATE TABLE IF NOT EXISTS messages (
  id          TEXT PRIMARY KEY,
  chat_id     TEXT NOT NULL,
  sender_id   TEXT NOT NULL,
  text        TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- ============================================
-- 6. ПРОФИЛИ ПОЛЬЗОВАТЕЛЕЙ
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id         TEXT PRIMARY KEY,
  display_name    TEXT,
  bio             TEXT,
  avatar_url      TEXT,
  profile_emoji   TEXT,
  bg_color        TEXT DEFAULT '#1a1a2e',
  bg_image_url    TEXT,
  updated_at      INTEGER
);

CREATE INDEX IF NOT EXISTS idx_profiles_user ON user_profiles(user_id);

-- ============================================
-- 7. СТРИМЫ
-- ============================================
CREATE TABLE IF NOT EXISTS streams (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  title           TEXT,
  description     TEXT,
  stream_url      TEXT,
  thumbnail_url   TEXT,
  viewers         INTEGER DEFAULT 0,
  is_live         INTEGER DEFAULT 1,
  created_at      INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_streams_user ON streams(user_id);
CREATE INDEX IF NOT EXISTS idx_streams_live ON streams(is_live);
CREATE INDEX IF NOT EXISTS idx_streams_created ON streams(created_at DESC);

-- ============================================
-- 8. ПОДПИСКИ
-- ============================================
CREATE TABLE IF NOT EXISTS follows (
  follower_id   TEXT NOT NULL,
  following_id  TEXT NOT NULL,
  created_at    INTEGER NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);

-- ============================================
-- 9. ДОБАВЛЕНИЕ НОВЫХ КОЛОНОК
-- (если таблица уже существует, но нет колонки)
-- Ошибка "duplicate column name" — НОРМАЛЬНА, игнорируйте её
-- ============================================
ALTER TABLE user_profiles ADD COLUMN display_name TEXT;
ALTER TABLE user_profiles ADD COLUMN bio TEXT;
ALTER TABLE user_profiles ADD COLUMN avatar_url TEXT;
ALTER TABLE user_profiles ADD COLUMN profile_emoji TEXT;
ALTER TABLE user_profiles ADD COLUMN bg_color TEXT DEFAULT '#1a1a2e';
ALTER TABLE user_profiles ADD COLUMN bg_image_url TEXT;
ALTER TABLE user_profiles ADD COLUMN updated_at INTEGER;

ALTER TABLE streams ADD COLUMN viewers INTEGER DEFAULT 0;
ALTER TABLE streams ADD COLUMN is_live INTEGER DEFAULT 1;

-- ============================================
-- 10. НАЧАЛЬНЫЕ ДАННЫЕ
-- ============================================

-- Стартовый шард для хранения файлов
INSERT OR IGNORE INTO shards (id, binding_name, capacity_bytes, used_bytes, active)
VALUES ('shard-1', 'SHARD_1', 5000000000, 0, 1);

-- ============================================
-- 11. ПРОВЕРКА (после выполнения покажет все таблицы)
-- ============================================
SELECT name FROM sqlite_master 
WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != '_cf_KV'
ORDER BY name;
