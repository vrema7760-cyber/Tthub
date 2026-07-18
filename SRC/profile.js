import { json, requireUser, hashPassword, verifyPassword } from './utils.js';

// === ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ===

export async function handleGetProfile(request, env, userId) {
  const user = await env.DB.prepare(
    'SELECT id, name, avatar_url, bio, created_at FROM users WHERE id = ?'
  ).bind(userId).first();
  
  if (!user) return json({ error: 'not_found' }, 404);
  
  const [stats, mediaCount, streamCount] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) as count FROM likes WHERE user_id = ?').bind(userId).first(),
    env.DB.prepare('SELECT COUNT(*) as count FROM media WHERE user_id = ? AND deleted_at IS NULL').bind(userId).first(),
    env.DB.prepare('SELECT COUNT(*) as count FROM streams WHERE user_id = ? AND is_live = 1').bind(userId).first()
  ]);
  
  return json({
    ...user,
    stats: {
      likes: stats?.count || 0,
      media: mediaCount?.count || 0,
      live_streams: streamCount?.count || 0
    }
  });
}

export async function handleUpdateProfile(request, env) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  
  const { name, bio, avatar_url } = await request.json();
  
  if (name && (name.length < 2 || name.length > 30)) {
    return json({ error: 'invalid_name' }, 400);
  }
  
  const updates = [];
  const binds = [];
  
  if (name) { updates.push('name = ?'); binds.push(name); }
  if (bio !== undefined) { updates.push('bio = ?'); binds.push(bio); }
  if (avatar_url) { updates.push('avatar_url = ?'); binds.push(avatar_url); }
  
  if (updates.length === 0) return json({ ok: true, unchanged: true });
  
  binds.push(user.id);
  await env.DB.prepare(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
  ).bind(...binds).run();
  
  return json({ ok: true, updated: { name, bio, avatar_url } });
}

export async function handleRegister(request, env) {
  const { name, password } = await request.json();
  
  if (!name || !password) return json({ error: 'missing_fields' }, 400);
  if (name.length < 2 || name.length > 30) return json({ error: 'invalid_name' }, 400);
  if (password.length < 6) return json({ error: 'weak_password' }, 400);
  
  const existing = await env.DB.prepare('SELECT id FROM users WHERE name = ?').bind(name).first();
  if (existing) return json({ error: 'name_taken' }, 409);
  
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  
  await env.DB.prepare(
    'INSERT INTO users (id, name, password_hash, created_at) VALUES (?, ?, ?, ?)'
  ).bind(userId, name, passwordHash, Date.now()).run();
  
  return json({ ok: true, user_id: userId, name });
}

export async function handleLogin(request, env) {
  const { name, password } = await request.json();
  
  if (!name || !password) return json({ error: 'missing_fields' }, 400);
  
  const user = await env.DB.prepare(
    'SELECT id, name, password_hash, avatar_url FROM users WHERE name = ?'
  ).bind(name).first();
  
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return json({ error: 'invalid_credentials' }, 401);
  }
  
  // Простая сессия (в продакшене используйте JWT)
  const sessionToken = crypto.randomUUID();
  await env.DB.prepare(
    'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(sessionToken, user.id, Date.now() + 7 * 24 * 60 * 60 * 1000).run();
  
  return json({ 
    ok: true, 
    session_token: sessionToken, 
    user: { id: user.id, name: user.name, avatar_url: user.avatar_url } 
  });
}

export async function handleLogout(request, env) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (token) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
  }
  return json({ ok: true });
}

// === СТРИМЫ (только экран/камера, без YouTube) ===

export async function handleListStreams(request, env) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id');
  const limit = Math.min(Number(url.searchParams.get('limit') || 20), 50);
  
  let query = `SELECT s.*, u.name as author_name, u.avatar_url as author_avatar 
               FROM streams s 
               JOIN users u ON u.id = s.user_id 
               WHERE s.is_live = 1 AND s.ended_at IS NULL`;
  const binds = [];
  
  if (userId) {
    query += ' AND s.user_id = ?';
    binds.push(userId);
  }
  query += ' ORDER BY s.started_at DESC LIMIT ?';
  binds.push(limit);
  
  const { results } = await env.DB.prepare(query).bind(...binds).all();
  return json({ items: results || [] });
}

export async function handleCreateStream(request, env) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  
  const { type, title, description } = await request.json();
  
  // ✅ Только screen/camera, без YouTube/Twitch
  if (!['screen', 'camera'].includes(type)) {
    return json({ error: 'invalid_stream_type', allowed: ['screen', 'camera'] }, 400);
  }
  
  if (title && title.length > 100) {
    return json({ error: 'title_too_long' }, 400);
  }
  
  // Проверка: пользователь не может иметь 2 активных стрима
  const active = await env.DB.prepare(
    'SELECT id FROM streams WHERE user_id = ? AND is_live = 1 AND ended_at IS NULL'
  ).bind(user.id).first();
  
  if (active) {
    return json({ error: 'stream_already_active', stream_id: active.id }, 400);
  }
  
  const streamId = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO streams (id, user_id, type, title, description, is_live, started_at) 
     VALUES (?, ?, ?, ?, ?, 1, ?)`
  ).bind(streamId, user.id, type, title || 'Без названия', description || '', Date.now()).run();
  
  return json({ ok: true, stream_id: streamId, type, title });
}

export async function handleEndStream(request, env, streamId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  
  const stream = await env.DB.prepare(
    'SELECT * FROM streams WHERE id = ?'
  ).bind(streamId).first();
  
  if (!stream) return json({ error: 'not_found' }, 404);
  
  // Только владелец или админ может завершить стрим
  const isAdmin = user.name === 'Negr';
  if (stream.user_id !== user.id && !isAdmin) {
    return json({ error: 'forbidden' }, 403);
  }
  
  await env.DB.prepare(
    'UPDATE streams SET is_live = 0, ended_at = ? WHERE id = ?'
  ).bind(Date.now(), streamId).run();
  
  return json({ ok: true, ended: true, stream_id: streamId });
}

export async function handleDeleteStream(request, env, streamId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  
  const stream = await env.DB.prepare(
    'SELECT * FROM streams WHERE id = ?'
  ).bind(streamId).first();
  
  if (!stream) return json({ error: 'not_found' }, 404);
  
  const isAdmin = user.name === 'Negr';
  if (stream.user_id !== user.id && !isAdmin) {
    return json({ error: 'forbidden' }, 403);
  }
  
  await env.DB.prepare('DELETE FROM streams WHERE id = ?').bind(streamId).run();
  return json({ ok: true, deleted: true });
}

export async function handleGetStream(request, env, streamId) {
  const stream = await env.DB.prepare(
    `SELECT s.*, u.name as author_name, u.avatar_url as author_avatar 
     FROM streams s 
     JOIN users u ON u.id = s.user_id 
     WHERE s.id = ?`
  ).bind(streamId).first();
  
  if (!stream) return json({ error: 'not_found' }, 404);
  return json({ item: stream });
}

// === ЛИЙКИ И СОХРАНЕНИЯ ===

export async function handleLike(request, env, mediaId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  
  const media = await env.DB.prepare(
    'SELECT id, user_id FROM media WHERE id = ? AND deleted_at IS NULL'
  ).bind(mediaId).first();
  
  if (!media) return json({ error: 'not_found' }, 404);
  
  // Проверка: нельзя лайкать свой контент
  if (media.user_id === user.id) {
    return json({ error: 'cant_like_own' }, 400);
  }
  
  const existing = await env.DB.prepare(
    'SELECT id FROM likes WHERE user_id = ? AND media_id = ?'
  ).bind(user.id, mediaId).first();
  
  if (existing) {
    // Убрать лайк
    await env.DB.prepare('DELETE FROM likes WHERE id = ?').bind(existing.id).run();
    return json({ ok: true, action: 'unliked' });
  } else {
    // Добавить лайк
    await env.DB.prepare(
      'INSERT INTO likes (user_id, media_id, created_at) VALUES (?, ?, ?)'
    ).bind(user.id, mediaId, Date.now()).run();
    return json({ ok: true, action: 'liked' });
  }
}

export async function handleSave(request, env, mediaId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  
  const media = await env.DB.prepare(
    'SELECT id FROM media WHERE id = ? AND deleted_at IS NULL'
  ).bind(mediaId).first();
  
  if (!media) return json({ error: 'not_found' }, 404);
  
  const existing = await env.DB.prepare(
    'SELECT id FROM saves WHERE user_id = ? AND media_id = ?'
  ).bind(user.id, mediaId).first();
  
  if (existing) {
    await env.DB.prepare('DELETE FROM saves WHERE id = ?').bind(existing.id).run();
    return json({ ok: true, action: 'unsaved' });
  } else {
    await env.DB.prepare(
      'INSERT INTO saves (user_id, media_id, created_at) VALUES (?, ?, ?)'
    ).bind(user.id, mediaId, Date.now()).run();
    return json({ ok: true, action: 'saved' });
  }
}

export async function handleGetSaved(request, env) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  
  const { results } = await env.DB.prepare(
    `SELECT m.*, u.name as author_name, u.avatar_url as author_avatar, s.created_at as saved_at
     FROM saves s
     JOIN media m ON m.id = s.media_id
     JOIN users u ON u.id = m.user_id
     WHERE s.user_id = ? AND m.deleted_at IS NULL
     ORDER BY s.created_at DESC LIMIT 50`
  ).bind(user.id).all();
  
  return json({ items: results || [] });
    }
