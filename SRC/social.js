import { json, uuid, requireUser } from './utils.js';

export async function handleLike(request, env, mediaId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const existing = await env.DB.prepare('SELECT 1 FROM likes WHERE user_id = ? AND media_id = ?')
    .bind(user.id, mediaId).first();

  if (existing) {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM likes WHERE user_id = ? AND media_id = ?').bind(user.id, mediaId),
      env.DB.prepare('UPDATE media SET likes_count = likes_count - 1 WHERE id = ?').bind(mediaId),
    ]);
    return json({ liked: false });
  } else {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO likes (user_id, media_id, created_at) VALUES (?, ?, ?)')
        .bind(user.id, mediaId, Date.now()),
      env.DB.prepare('UPDATE media SET likes_count = likes_count + 1 WHERE id = ?').bind(mediaId),
    ]);
    return json({ liked: true });
  }
}

export async function handleSave(request, env, mediaId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const existing = await env.DB.prepare('SELECT 1 FROM saves WHERE user_id = ? AND media_id = ?')
    .bind(user.id, mediaId).first();

  if (existing) {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM saves WHERE user_id = ? AND media_id = ?').bind(user.id, mediaId),
      env.DB.prepare('UPDATE media SET saves_count = saves_count - 1 WHERE id = ?').bind(mediaId),
    ]);
    return json({ saved: false });
  } else {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO saves (user_id, media_id, created_at) VALUES (?, ?, ?)')
        .bind(user.id, mediaId, Date.now()),
      env.DB.prepare('UPDATE media SET saves_count = saves_count + 1 WHERE id = ?').bind(mediaId),
    ]);
    return json({ saved: true });
  }
}

export async function handleComment(request, env, mediaId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const { text } = await request.json();
  if (!text || !text.trim()) return json({ error: 'empty_comment' }, 400);

  const id = uuid();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO comments (id, media_id, user_id, text, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(id, mediaId, user.id, text.trim().slice(0, 500), Date.now()),
    env.DB.prepare('UPDATE media SET comments_count = comments_count + 1 WHERE id = ?').bind(mediaId),
  ]);
  return json({ ok: true, id });
}

export async function handleListComments(request, env, mediaId) {
  const { results } = await env.DB.prepare(
    `SELECT comments.*, users.name as author_name, users.avatar_url as author_avatar
     FROM comments JOIN users ON users.id = comments.user_id
     WHERE media_id = ? ORDER BY created_at ASC LIMIT 200`
  ).bind(mediaId).all();
  return json({ items: results });
}
