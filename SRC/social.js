import { json, uuid, requireUser } from './utils.js';

export async function handleLike(request, env, mediaId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  // Проверяем существование медиа
  const media = await env.DB.prepare('SELECT id FROM media WHERE id = ? AND deleted_at IS NULL').bind(mediaId).first();
  if (!media) return json({ error: 'media_not_found' }, 404);

  const existing = await env.DB.prepare('SELECT 1 FROM likes WHERE user_id = ? AND media_id = ?')
    .bind(user.id, mediaId).first();

  if (existing) {
    // Удаляем лайк
    await env.DB.batch([
      env.DB.prepare('DELETE FROM likes WHERE user_id = ? AND media_id = ?').bind(user.id, mediaId),
      env.DB.prepare('UPDATE media SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').bind(mediaId),
    ]);
    return json({ liked: false });
  } else {
    // Добавляем лайк (INSERT OR IGNORE чтобы не падало при дубликатах)
    await env.DB.batch([
      env.DB.prepare('INSERT OR IGNORE INTO likes (user_id, media_id, created_at) VALUES (?, ?, ?)')
        .bind(user.id, mediaId, Date.now()),
      env.DB.prepare('UPDATE media SET likes_count = likes_count + 1 WHERE id = ?').bind(mediaId),
    ]);
    return json({ liked: true });
  }
}

export async function handleSave(request, env, mediaId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  // Проверяем существование медиа
  const media = await env.DB.prepare('SELECT id FROM media WHERE id = ? AND deleted_at IS NULL').bind(mediaId).first();
  if (!media) return json({ error: 'media_not_found' }, 404);

  const existing = await env.DB.prepare('SELECT 1 FROM saves WHERE user_id = ? AND media_id = ?')
    .bind(user.id, mediaId).first();

  if (existing) {
    // Удаляем сохранение
    await env.DB.batch([
      env.DB.prepare('DELETE FROM saves WHERE user_id = ? AND media_id = ?').bind(user.id, mediaId),
      env.DB.prepare('UPDATE media SET saves_count = MAX(0, saves_count - 1) WHERE id = ?').bind(mediaId),
    ]);
    return json({ saved: false });
  } else {
    // Добавляем сохранение (INSERT OR IGNORE)
    await env.DB.batch([
      env.DB.prepare('INSERT OR IGNORE INTO saves (user_id, media_id, created_at) VALUES (?, ?, ?)')
        .bind(user.id, mediaId, Date.now()),
      env.DB.prepare('UPDATE media SET saves_count = saves_count + 1 WHERE id = ?').bind(mediaId),
    ]);
    return json({ saved: true });
  }
}

export async function handleComment(request, env, mediaId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const media = await env.DB.prepare('SELECT id FROM media WHERE id = ? AND deleted_at IS NULL').bind(mediaId).first();
  if (!media) return json({ error: 'media_not_found' }, 404);

  const body = await request.json();
  const { text } = body;
  if (!text || !text.trim()) return json({ error: 'empty_comment' }, 400);
  if (text.length > 500) return json({ error: 'comment_too_long' }, 400);

  const id = uuid();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO comments (id, media_id, user_id, text, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(id, mediaId, user.id, text.trim(), Date.now()),
    env.DB.prepare('UPDATE media SET comments_count = comments_count + 1 WHERE id = ?').bind(mediaId),
  ]);

  return json({ ok: true, id, user_id: user.id, text: text.trim(), created_at: Date.now() });
}

export async function handleListComments(request, env, mediaId) {
  const media = await env.DB.prepare('SELECT id FROM media WHERE id = ?').bind(mediaId).first();
  if (!media) return json({ error: 'media_not_found' }, 404);

  const { results } = await env.DB.prepare(
    `SELECT comments.*, users.name as author_name, users.avatar_url as author_avatar
     FROM comments 
     JOIN users ON users.id = comments.user_id
     WHERE comments.media_id = ? 
     ORDER BY comments.created_at ASC 
     LIMIT 200`
  ).bind(mediaId).all();

  return json({ items: results });
}
