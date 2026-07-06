import { json, uuid, requireUser } from './utils.js';
import { pickShardForWrite, storeBlobInShard, fetchBlobFromShard, bumpShardUsage } from './shards.js';

const MAX_VIDEO_BYTES = 3 * 1024 * 1024;
const MAX_PHOTO_BYTES = 0.5 * 1024 * 1024;
const ADMIN_NICK = 'vrema7760-cyber';

export async function handleUpload(request, env) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const body = await request.json();
  const { type, mime, base64, caption, resolution, bitrate_kbps } = body;

  if (!['video', 'photo'].includes(type)) return json({ error: 'bad_type' }, 400);
  if (!base64) return json({ error: 'missing_data' }, 400);

  const approxBytes = Math.ceil((base64.length * 3) / 4);
  const limit = type === 'video' ? MAX_VIDEO_BYTES : MAX_PHOTO_BYTES;
  if (approxBytes > limit) {
    return json({
      error: 'too_large',
      detail: `Файл ${approxBytes} байт превышает лимит ${limit} байт`,
    }, 413);
  }

  const shard = await pickShardForWrite(env, approxBytes);
  const mediaId = uuid();
  const blobKey = `media/${mediaId}`;

  await storeBlobInShard(env, shard, blobKey, mime, base64);
  await bumpShardUsage(env, shard.id, approxBytes);

  await env.DB.prepare(
    `INSERT INTO media (id, user_id, type, shard_id, blob_key, caption, size_bytes, resolution, bitrate_kbps, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    mediaId, user.id, type, shard.id, blobKey, caption || '', approxBytes,
    resolution || null, bitrate_kbps || null, Date.now()
  ).run();

  return json({ ok: true, media_id: mediaId, shard: shard.id, size_bytes: approxBytes });
}

export async function handleFeed(request, env) {
  const url = new URL(request.url);
  const cursor = Number(url.searchParams.get('cursor') || Date.now());
  const limit = Math.min(Number(url.searchParams.get('limit') || 10), 30);

  const { results } = await env.DB.prepare(
    `SELECT media.*, users.name as author_name, users.avatar_url as author_avatar
     FROM media JOIN users ON users.id = media.user_id
     WHERE media.created_at < ? AND media.deleted_at IS NULL
     ORDER BY media.created_at DESC LIMIT ?`
  ).bind(cursor, limit).all();

  return json({
    items: results,
    next_cursor: results.length ? results[results.length - 1].created_at : null,
  });
}

export async function handleMediaContent(request, env, mediaId) {
  const media = await env.DB.prepare('SELECT * FROM media WHERE id = ? AND deleted_at IS NULL').bind(mediaId).first();
  if (!media) return json({ error: 'not_found' }, 404);

  const shard = await env.DB.prepare('SELECT * FROM shards WHERE id = ?').bind(media.shard_id).first();
  const res = await fetchBlobFromShard(env, shard, media.blob_key);
  if (!res) return json({ error: 'blob_missing' }, 404);
  return res;
}

export async function handleDeleteMedia(request, env, mediaId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const media = await env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(mediaId).first();
  if (!media) return json({ error: 'not_found' }, 404);
  if (media.deleted_at) return json({ error: 'already_deleted' }, 400);

  const isAdmin = user.name === ADMIN_NICK;
  const isOwner = media.user_id === user.id;

  if (!isAdmin && !isOwner) {
    return json({ error: 'forbidden' }, 403);
  }

  await env.DB.prepare('UPDATE media SET deleted_at = ? WHERE id = ?')
    .bind(Date.now(), mediaId).run();

  return json({ ok: true, deleted: true });
}
