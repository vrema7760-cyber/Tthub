// SRC/profile.js
import { json, requireUser } from './utils.js';

function convertToEmbedUrl(url) {
  if (!url) return url;
  const yt = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  if (url.includes('youtube.com/embed/')) return url;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (url.includes('twitch.tv/')) {
    const ch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
    if (ch && !url.includes('/videos/') && !url.includes('/clip/')) {
      return `https://player.twitch.tv/?channel=${ch[1]}&parent=${new URL(url).hostname || 'localhost'}`;
    }
  }
  return url;
}

// === ПРОФИЛИ ===
export async function handleGetMyProfile(request, env) {
  try {
    const user = await requireUser(request, env);
    if (!user) return json({ error: 'unauthorized' }, 401);
    
    let profile = await env.DB.prepare('SELECT * FROM user_profiles WHERE user_id = ?').bind(user.id).first();
    if (!profile) {
      await env.DB.prepare(
        'INSERT INTO user_profiles (user_id, display_name, bio, avatar_url, profile_emoji, bg_color, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(user.id, user.name || '', '', user.avatar_url || '', '👻', '#1a1a2e', Date.now()).run();
      profile = await env.DB.prepare('SELECT * FROM user_profiles WHERE user_id = ?').bind(user.id).first();
    }
    
    const mc = await env.DB.prepare('SELECT COUNT(*) as c FROM media WHERE user_id = ? AND deleted_at IS NULL').bind(user.id).first();
    const fc = await env.DB.prepare('SELECT COUNT(*) as c FROM follows WHERE following_id = ?').bind(user.id).first();
    const fgc = await env.DB.prepare('SELECT COUNT(*) as c FROM follows WHERE follower_id = ?').bind(user.id).first();
    
    return json({
      user_id: user.id, 
      username: user.name,
      display_name: profile?.display_name || user.name, 
      bio: profile?.bio || '',
      avatar_url: profile?.avatar_url || user.avatar_url,
      profile_emoji: profile?.profile_emoji || '',
      bg_color: profile?.bg_color || '#1a1a2e',
      bg_image_url: profile?.bg_image_url || '',
      media_count: mc?.c || 0, 
      followers_count: fc?.c || 0, 
      following_count: fgc?.c || 0,
      is_me: true, 
      created_at: user.created_at
    });
  } catch (err) {
    console.error('Get my profile error:', err);
    return json({ error: 'profile_fetch_error' }, 500);
  }
}

export async function handleGetUserProfile(request, env, userId) {
  try {
    const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
    if (!user) return json({ error: 'user_not_found' }, 404);
    
    let profile = await env.DB.prepare('SELECT * FROM user_profiles WHERE user_id = ?').bind(userId).first();
    if (!profile) profile = { display_name: user.name, bio: '', avatar_url: user.avatar_url, profile_emoji: '' };
    
    const mc = await env.DB.prepare('SELECT COUNT(*) as c FROM media WHERE user_id = ? AND deleted_at IS NULL').bind(userId).first();
    const fc = await env.DB.prepare('SELECT COUNT(*) as c FROM follows WHERE following_id = ?').bind(userId).first();
    const fgc = await env.DB.prepare('SELECT COUNT(*) as c FROM follows WHERE follower_id = ?').bind(userId).first();
    
    const cu = await requireUser(request, env);
    let is_following = false;
    if (cu) { 
      const f = await env.DB.prepare('SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?').bind(cu.id, userId).first(); 
      is_following = !!f; 
    }
    
    return json({
      user_id: user.id, 
      username: user.name,
      display_name: profile.display_name || user.name, 
      bio: profile.bio || '',
      avatar_url: profile.avatar_url || user.avatar_url,
      profile_emoji: profile.profile_emoji || '👻',
      bg_color: profile.bg_color || '#1a1a2e',
      bg_image_url: profile.bg_image_url,
      media_count: mc?.c || 0, 
      followers_count: fc?.c || 0, 
      following_count: fgc?.c || 0,
      is_me: cu && cu.id === userId, 
      is_following, 
      created_at: user.created_at
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    return json({ error: 'profile_fetch_error' }, 500);
  }
}

export async function handleUpdateProfile(request, env) {
  try {
    const user = await requireUser(request, env);
    if (!user) return json({ error: 'unauthorized' }, 401);
    
    const body = await request.json();
    const { display_name, bio, avatar_url, profile_emoji, bg_color, bg_image_url } = body;
    
    const updates = []; 
    const binds = [];
    
    if (display_name !== undefined) { 
      if (display_name.length > 50) return json({ error: 'too_long' }, 400); 
      updates.push('display_name = ?'); 
      binds.push(display_name); 
    }
    if (bio !== undefined) { 
      if (bio.length > 500) return json({ error: 'too_long' }, 400); 
      updates.push('bio = ?'); 
      binds.push(bio); 
    }
    if (avatar_url !== undefined) { 
      updates.push('avatar_url = ?'); 
      binds.push(avatar_url); 
    }
    if (profile_emoji !== undefined) { 
      updates.push('profile_emoji = ?'); 
      binds.push(profile_emoji || '👻'); 
    }
    if (bg_color !== undefined) { 
      const c = (bg_color && /^#[0-9A-Fa-f]{6}$/.test(bg_color)) ? bg_color : '#1a1a2e'; 
      updates.push('bg_color = ?'); 
      binds.push(c); 
    }
    if (bg_image_url !== undefined) { 
      updates.push('bg_image_url = ?'); 
      binds.push(bg_image_url); 
    }
    
    if (updates.length === 0) return json({ error: 'no_changes' }, 400);
    
    updates.push('updated_at = ?'); 
    binds.push(Date.now()); 
    binds.push(user.id);
    
    const existing = await env.DB.prepare('SELECT * FROM user_profiles WHERE user_id = ?').bind(user.id).first();
    if (existing) {
      await env.DB.prepare('UPDATE user_profiles SET ' + updates.join(', ') + ' WHERE user_id = ?').bind(...binds).run();
    } else {
      await env.DB.prepare(
        'INSERT INTO user_profiles (user_id, display_name, bio, avatar_url, profile_emoji, bg_color, bg_image_url, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(user.id, display_name || user.name, bio || '', avatar_url || user.avatar_url, profile_emoji || '👻', bg_color || '#1a1a2e', bg_image_url || '', Date.now()).run();
    }
    return json({ ok: true });
  } catch (err) {
    console.error('Update profile error:', err);
    return json({ error: 'profile_update_failed' }, 500);
  }
}

// === СТРИМЫ ===
export async function handleListStreams(request, env) {
  try {
    const url = new URL(request.url);
    const cursor = Number(url.searchParams.get('cursor') || Date.now());
    const limit = Math.min(Number(url.searchParams.get('limit') || 10), 50);
    const onlyLive = url.searchParams.get('live') === '1';

    let query = `SELECT s.*, u.name as author_name, u.avatar_url as author_avatar 
                 FROM streams s 
                 JOIN users u ON u.id = s.user_id 
                 WHERE s.started_at < ?`;
    const binds = [cursor];

    if (onlyLive) {
      query += ` AND s.is_live = 1 AND s.ended_at IS NULL`;
    }
    query += ` ORDER BY s.started_at DESC LIMIT ?`;
    binds.push(limit);

    const { results } = await env.DB.prepare(query).bind(...binds).all();
    
    return json({ 
      items: results || [], 
      next_cursor: results.length ? results[results.length - 1].started_at : null 
    });
  } catch (err) {
    console.error('Streams list error:', err);
    return json({ items: [], next_cursor: null, error: 'streams_fetch_error' }, 500);
  }
}

export async function handleCreateStream(request, env) {
  try {
    const user = await requireUser(request, env);
    if (!user) return json({ error: 'unauthorized' }, 401);

    const { type, title, description, stream_url, thumbnail_url } = await request.json();
    if (!['screen', 'camera'].includes(type)) return json({ error: 'invalid_stream_type' }, 400);
    if (!title || title.length > 150) return json({ error: 'title_required' }, 400);

    const id = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO streams (id, user_id, type, title, description, stream_url, thumbnail_url, started_at, is_live, viewers, ended_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0, NULL)`
    ).bind(id, user.id, type, title, description || '', convertToEmbedUrl(stream_url), thumbnail_url || '', Date.now()).run();

    return json({ ok: true, stream_id: id });
  } catch (err) {
    console.error('Create stream error:', err);
    return json({ error: 'stream_create_failed' }, 500);
  }
}

export async function handleGetStream(request, env, streamId) {
  try {
    const stream = await env.DB.prepare(
      `SELECT s.*, u.name as author_name, u.avatar_url as author_avatar 
       FROM streams s JOIN users u ON u.id = s.user_id WHERE s.id = ?`
    ).bind(streamId).first();
    
    if (!stream) return json({ error: 'not_found' }, 404);
    return json({ item: stream });
  } catch (err) {
    console.error('Get stream error:', err);
    return json({ error: 'stream_fetch_error' }, 500);
  }
}

export async function handleEndStream(request, env, streamId) {
  try {
    const user = await requireUser(request, env);
    if (!user) return json({ error: 'unauthorized' }, 401);

    const stream = await env.DB.prepare('SELECT * FROM streams WHERE id = ?').bind(streamId).first();
    if (!stream) return json({ error: 'not_found' }, 404);
    if (stream.user_id !== user.id && user.name !== 'Negr') return json({ error: 'forbidden' }, 403);

    await env.DB.prepare('UPDATE streams SET is_live = 0, ended_at = ? WHERE id = ?')
      .bind(Date.now(), streamId).run();

    return json({ ok: true, ended: true });
  } catch (err) {
    console.error('End stream error:', err);
    return json({ error: 'stream_end_failed' }, 500);
  }
}

export async function handleDeleteStream(request, env, streamId) {
  try {
    const user = await requireUser(request, env);
    if (!user) return json({ error: 'unauthorized' }, 401);

    const stream = await env.DB.prepare('SELECT * FROM streams WHERE id = ?').bind(streamId).first();
    if (!stream) return json({ error: 'not_found' }, 404);
    if (stream.user_id !== user.id && user.name !== 'Negr') return json({ error: 'forbidden' }, 403);

    await env.DB.prepare('DELETE FROM streams WHERE id = ?').bind(streamId).run();
    return json({ ok: true, deleted: true });
  } catch (err) {
    console.error('Delete stream error:', err);
    return json({ error: 'stream_delete_failed' }, 500);
  }
}

// === ЛАЙКИ/СЕЙВЫ/ПОДПИСКИ ===
export async function handleLike(request, env, mediaId) {
  try {
    const user = await requireUser(request, env);
    if (!user) return json({ error: 'unauthorized' }, 401);
    
    const existing = await env.DB.prepare('SELECT 1 FROM likes WHERE user_id = ? AND media_id = ?')
      .bind(user.id, mediaId).first();
    
    if (existing) {
      await env.DB.prepare('DELETE FROM likes WHERE user_id = ? AND media_id = ?').bind(user.id, mediaId).run();
      await env.DB.prepare('UPDATE media SET likes_count = likes_count - 1 WHERE id = ?').bind(mediaId).run();
      return json({ liked: false });
    } else {
      await env.DB.prepare('INSERT INTO likes (user_id, media_id, created_at) VALUES (?, ?, ?)')
        .bind(user.id, mediaId, Date.now()).run();
      await env.DB.prepare('UPDATE media SET likes_count = likes_count + 1 WHERE id = ?').bind(mediaId).run();
      return json({ liked: true });
    }
  } catch (err) {
    console.error('Like error:', err);
    return json({ error: 'like_failed' }, 500);
  }
}

export async function handleSave(request, env, mediaId) {
  try {
    const user = await requireUser(request, env);
    if (!user) return json({ error: 'unauthorized' }, 401);
    
    const existing = await env.DB.prepare('SELECT 1 FROM saves WHERE user_id = ? AND media_id = ?')
      .bind(user.id, mediaId).first();
    
    if (existing) {
      await env.DB.prepare('DELETE FROM saves WHERE user_id = ? AND media_id = ?').bind(user.id, mediaId).run();
      return json({ saved: false });
    } else {
      await env.DB.prepare('INSERT INTO saves (user_id, media_id, created_at) VALUES (?, ?, ?)')
        .bind(user.id, mediaId, Date.now()).run();
      return json({ saved: true });
    }
  } catch (err) {
    console.error('Save error:', err);
    return json({ error: 'save_failed' }, 500);
  }
}

export async function handleGetSaved(request, env) {
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
    console.error('Get saved error:', err);
    return json({ error: 'saved_fetch_error' }, 500);
  }
}

export async function handleFollow(request, env, userId) {
  try {
    const cu = await requireUser(request, env);
    if (!cu) return json({ error: 'unauthorized' }, 401);
    if (cu.id === userId) return json({ error: 'cannot_follow_self' }, 400);
    
    const target = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(userId).first();
    if (!target) return json({ error: 'user_not_found' }, 404);
    
    const existing = await env.DB.prepare('SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?')
      .bind(cu.id, userId).first();
    
    if (existing) {
      await env.DB.prepare('DELETE FROM follows WHERE follower_id = ? AND following_id = ?')
        .bind(cu.id, userId).run();
      return json({ following: false });
    } else {
      await env.DB.prepare('INSERT INTO follows (follower_id, following_id, created_at) VALUES (?, ?, ?)')
        .bind(cu.id, userId, Date.now()).run();
      return json({ following: true });
    }
  } catch (err) {
    console.error('Follow error:', err);
    return json({ error: 'follow_failed' }, 500);
  }
      }
