import { json, requireUser } from './utils.js';
import { pickShardForWrite, storeBlobInShard, fetchBlobFromShard, bumpShardUsage } from './shards.js';

const MAX_VIDEO_BYTES = 3 * 1024 * 1024;
const MAX_PHOTO_BYTES = 0.5 * 1024 * 1024;

export async function handleUpload(request, env) {
  try {
    const user = await requireUser(request, env);
    if (!user) return json({ error: 'unauthorized' }, 401);

    const body = await request.json();
    const { type, mime, base64, caption } = body;

    if (!['video', 'photo'].includes(type)) return json({ error: 'bad_type' }, 400);
    if (!base64) return json({ error: 'missing_data' }, 400);

    const approxBytes = Math.ceil((base64.length * 3) / 4);
    const limit = type === 'video' ? MAX_VIDEO_BYTES : MAX_PHOTO_BYTES;

    if (approxBytes > limit) {
      return json({
        error: 'too_large',
        detail: `Файл ${approxBytes} байт превышает лимит ${limit} байт`
      }, 413);
    }

    const shard = await pickShardForWrite(env, approxBytes);
    const mediaId = crypto.randomUUID();
    const blobKey = 'media/' + mediaId;

    await storeBlobInShard(env, shard, blobKey, mime, base64);
    await bumpShardUsage(env, shard.id, approxBytes);

    await env.DB.prepare(
      `INSERT INTO media (id, user_id, type, shard_id, blob_key, caption, size_bytes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(mediaId, user.id, type, shard.id, blobKey, caption || '', approxBytes, Date.now()).run();

    return json({ ok: true, media_id: mediaId });
  } catch (err) {
    console.error('Upload error:', err);
    return json({ error: 'upload_failed', detail: err.message }, 500);
  }
}

export async function handleFeed(request, env) {
  try {
    const url = new URL(request.url);
    const cursor = Number(url.searchParams.get('cursor') || Date.now());
    const limit = Math.min(Number(url.searchParams.get('limit') || 10), 30);
    const userId = url.searchParams.get('user_id');

    let query = `SELECT media.*, users.name as author_name, users.avatar_url as author_avatar
      FROM media
      JOIN users ON users.id = media.user_id
      WHERE media.created_at < ? AND media.deleted_at IS NULL`;
    const binds = [cursor];

    if (userId) {
      query += ' AND media.user_id = ?';
      binds.push(userId);
    }
    query += ' ORDER BY media.created_at DESC LIMIT ?';
    binds.push(limit);

    const { results } = await env.DB.prepare(query).bind(...binds).all();
    return json({
      items: results,
      next_cursor: results.length ? results[results.length - 1].created_at : null
    });
  } catch (err) {
    console.error('Feed error:', err);
    return json({ error: 'feed_error', detail: err.message }, 500);
  }
}

export async function handleSaved(request, env) {
  try {
    const user = await requireUser(request, env);
    if (!user) return json({ error: 'unauthorized' }, 401);

    const { results } = await env.DB.prepare(
      `SELECT media.*, users.name as author_name, users.avatar_url as author_avatar
      FROM saves
      JOIN media ON media.id = saves.media_id
      JOIN users ON users.id = media.user_id
      WHERE saves.user_id = ? AND media.deleted_at IS NULL
      ORDER BY saves.created_at DESC LIMIT 50`
    ).bind(user.id).all();

    return json({ items: results });
  } catch (err) {
    console.error('Saved fetch error:', err);
    return json({ error: 'saved_fetch_error', detail: err.message }, 500);
  }
}

export async function handleMediaContent(request, env, mediaId) {
  try {
    const media = await env.DB.prepare(
      'SELECT * FROM media WHERE id = ? AND deleted_at IS NULL'
    ).bind(mediaId).first();

    if (!media) return json({ error: 'not_found' }, 404);

    const shard = await env.DB.prepare(
      'SELECT * FROM shards WHERE id = ?'
    ).bind(media.shard_id).first();

    if (!shard) return json({ error: 'shard_not_found' }, 500);

    const blobResult = await fetchBlobFromShard(env, shard, media.blob_key);
    
    if (!blobResult || !blobResult.body) {
      console.error(`Blob missing for media ${mediaId}`);
      return json({ error: 'blob_missing' }, 500);
    }

    // ✅ Поддержка Range запросов для стриминга видео
    const range = request.headers.get('Range');
    const contentType = media.mime_type || (media.type === 'video' ? 'video/mp4' : 'image/jpeg');
    
    if (range) {
      const matches = range.match(/bytes=(\d+)-(\d*)/);
      if (matches) {
        const start = parseInt(matches[1], 10);
        const end = matches[2] ? parseInt(matches[2], 10) : media.size_bytes - 1;
        
        return new Response(blobResult.body, {
          status: 206, // Partial Content
          headers: {
            'Content-Type': contentType,
            'Content-Range': `bytes ${start}-${end}/${media.size_bytes}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': (end - start + 1).toString(),
            'Cache-Control': 'public, max-age=31536000'
          }
        });
      }
    }

    return new Response(blobResult.body, {
      headers: {
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Content-Length': media.size_bytes?.toString() || '',
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (err) {
    console.error('Media fetch error:', err);
    return json({ error: 'server_error', detail: err.message }, 500);
  }
}

export async function handleDeleteMedia(request, env, mediaId) {
  try {
    const user = await requireUser(request, env);
    if (!user) return json({ error: 'unauthorized' }, 401);

    const media = await env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(mediaId).first();
    if (!media) return json({ error: 'not_found' }, 404);
    if (media.deleted_at) return json({ error: 'already_deleted' }, 400);

    const isAdmin = user.name === 'Negr';
    const isOwner = media.user_id === user.id;
    if (!isAdmin && !isOwner) return json({ error: 'forbidden' }, 403);

    await env.DB.prepare('UPDATE media SET deleted_at = ? WHERE id = ?')
      .bind(Date.now(), mediaId).run();

    return json({ ok: true, deleted: true });
  } catch (err) {
    console.error('Delete media error:', err);
    return json({ error: 'delete_failed', detail: err.message }, 500);
  }
}
