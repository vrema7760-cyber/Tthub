-- 🎃 SpookyTok — полная схема D1 (идемпотентная)
-- Запускай при каждом деплое: npx wrangler d1 execute halloweentok-main-db --file=schema.sql --remote

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- === ПОЛЬЗОВАТЕЛИ ===
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  github_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_github ON users(github_id);

-- === СЕССИИ ===
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- === ШАРДЫ ===
CREATE TABLE IF NOT EXISTS shards (
  id TEXT PRIMARY KEY,
  binding_name TEXT NOT NULL,
  capacity_bytes INTEGER NOT NULL DEFAULT 5000000000,
  used_bytes INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);

-- === МЕДИА ===
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  shard_id TEXT NOT NULL,
  blob_key TEXT NOT NULL,
  caption TEXT DEFAULT '',
  size_bytes INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  deleted_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_user ON media(user_id);

-- === ЛАЙКИ / СЕЙВЫ / КОММЕНТЫ ===
CREATE TABLE IF NOT EXISTS likes (
  user_id TEXT NOT NULL,
  media_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, media_id)
);
CREATE INDEX IF NOT EXISTS idx_likes_media ON likes(media_id);

CREATE TABLE IF NOT EXISTS saves (
  user_id TEXT NOT NULL,
  media_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, media_id)
);
CREATE INDEX IF NOT EXISTS idx_saves_media ON saves(media_id);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  media_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_comments_media ON comments(media_id);

-- === ЧАТЫ ===
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  user1_id TEXT NOT NULL,
  user2_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(user1_id, user2_id)
);
CREATE INDEX IF NOT EXISTS idx_chats_user1 ON chats(user1_id);
CREATE INDEX IF NOT EXISTS idx_chats_user2 ON chats(user2_id);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id, created_at);

-- === ПРОФИЛИ ===
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  profile_emoji TEXT DEFAULT '👻',
  bg_color TEXT DEFAULT '#1a1a2e',
  bg_image_url TEXT,
  updated_at INTEGER
);

-- === СТРИМЫ ✅ (теперь в схеме!) ===
CREATE TABLE IF NOT EXISTS streams (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT CHECK(type IN ('screen','camera')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  stream_url TEXT,
  thumbnail_url TEXT,
  is_live INTEGER DEFAULT 1,
  viewers INTEGER DEFAULT 0,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_streams_live ON streams(is_live, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_streams_user ON streams(user_id);

-- === ПОДПИСКИ ===
CREATE TABLE IF NOT EXISTS follows (
  follower_id TEXT NOT NULL,
  following_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);

-- === НАЧАЛЬНЫЕ ДАННЫЕ ===
INSERT OR IGNORE INTO shards (id, binding_name, capacity_bytes, used_bytes, active)
VALUES ('shard-1', 'SHARD_1', 5000000000, 0, 1);
