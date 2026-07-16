import { json, requireUser } from './utils.js';

function convertToEmbedUrl(url) {
  if (!url) return url;
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return 'https://www.youtube.com/embed/' + watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return 'https://www.youtube.com/embed/' + shortMatch[1];
  if (url.includes('youtube.com/embed/')) return url;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return 'https://player.vimeo.com/video/' + vimeoMatch[1];
  if (url.includes('twitch.tv/')) {
    const ch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
    if (ch && !url.includes('/videos/') && !url.includes('/clip/')) return 'https://player.twitch.tv/?channel=' + ch[1] + '&parent=localhost';
  }
  return url;
}

export async function handleGetMyProfile(request, env) {
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
    user_id: user.id, username: user.name,
    display_name: profile.display_name, bio: profile.bio,
    avatar_url: profile.avatar_url || user.avatar_url,
    profile_emoji: profile.profile_emoji || '',
    bg_color: profile.bg_color || '#1a1a2e',
    bg_image_url: profile.bg_image_url,
    media_count: mc.c, followers_count: fc.c, following_count: fgc.c,
    is_me: true, created_at: user.created_at
  });
}

export async function handleGetUserProfile(request, env, userId) {
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
  if (!user) return json({ error: 'user_not_found' }, 404);
  let profile = await env.DB.prepare('SELECT * FROM user_profiles WHERE user_id = ?').bind(userId).first();
  if (!profile) profile = { display_name: user.name, bio: '', avatar_url: user.avatar_url, profile_emoji: '' };
  const mc = await env.DB.prepare('SELECT COUNT(*) as c FROM media WHERE user_id = ? AND deleted_at IS NULL').bind(userId).first();
  const fc = await env.DB.prepare('SELECT COUNT(*) as c FROM follows WHERE following_id = ?').bind(userId).first();
  const fgc = await env.DB.prepare('SELECT COUNT(*) as c FROM follows WHERE follower_id = ?').bind(userId).first();
  const cu = await requireUser(request, env);
  let is_following = false;
  if (cu) { const f = await env.DB.prepare('SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?').bind(cu.id, userId).first(); is_following = !!f; }
  return json({
    user_id: user.id, username: user.name,
    display_name: profile.display_name || user.name, bio: profile.bio || '',
    avatar_url: profile.avatar_url || user.avatar_url,
    profile_emoji: profile.profile_emoji || '👻',
    bg_color: profile.bg_color || '#1a1a2e',
    bg_image_url: profile.bg_image_url,
    media_count: mc.c, followers_count: fc.c, following_count: fgc.c,
    is_me: cu && cu.id === userId, is_following, created_at: user.created_at
  });
}

export async function handleUpdateProfile(request, env) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  const body = await request.json();
  const { display_name, bio, avatar_url, profile_emoji, bg_color, bg_image_url } = body;
  const updates = []; const binds = [];
  if (display_name !== undefined) { if (display_name.length > 50) return json({ error: 'too_long' }, 400); updates.push('display_name = ?'); binds.push(display_name); }
  if (bio !== undefined) { if (bio.length > 500) return json({ error: 'too_long' }, 400); updates.push('bio = ?'); binds.push(bio); }
  if (avatar_url !== undefined) { updates.push('avatar_url = ?'); binds.push(avatar_url); }
  if (profile_emoji !== undefined) { updates.push('profile_emoji = ?'); binds.push(profile_emoji || '👻'); }
  if (bg_color !== undefined) { const c = (bg_color && /^#[0-9A-Fa-f]{6}$/.test(bg_color)) ? bg_color : '#1a1a2e'; updates.push('bg_color = ?'); binds.push(c); }
  if (bg_image_url !== undefined) { updates.push('bg_image_url = ?'); binds.push(bg_image_url); }
  if (updates.length === 0) return json({ error: 'no_changes' }, 400);
  updates.push('updated_at = ?'); binds.push(Date.now()); binds.push(user.id);
  const existing = await env.DB.prepare('SELECT * FROM user_profiles WHERE user_id = ?').bind(user.id).first();
  if (existing) {
    await env.DB.prepare('UPDATE user_profiles SET ' + updates.join(', ') + ' WHERE user_id = ?').bind(...binds).run();
  } else {
    await env.DB.prepare(
      'INSERT INTO user_profiles (user_id, display_name, bio, avatar_url, profile_emoji, bg_color, bg_image_url, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(user.id, display_name || user.name, bio || '', avatar_url || user.avatar_url, profile_emoji || '👻', bg_color || '#1a1a2e', bg_image_url || '', Date.now()).run();
  }
  return json({ ok: true });
}

export async function handleChangeUsername(request, env) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  const { username } = await request.json();
  if (!username || username.length < 3 || username.length > 30) return json({ error: 'username_must_be_3_30_chars' }, 400);
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) return json({ error: 'username_invalid_chars' }, 400);
  const existing = await env.DB.prepare('SELECT id FROM users WHERE name = ? AND id != ?').bind(username, user.id).first();
  if (existing) return json({ error: 'username_taken' }, 400);
  await env.DB.prepare('UPDATE users SET name = ? WHERE id = ?').bind(username, user.id).run();
  return json({ ok: true, new_username: username });
}

export async function handleListStreams(request, env) {
  const url = new URL(request.url);
  const cursor = Number(url.searchParams.get('cursor') || Date.now());
  const limit = Math.min(Number(url.searchParams.get('limit') || 10), 30);
  const onlyLive = url.searchParams.get('live') === '1';
  let query = 'SELECT s.*, u.name as author_name, u.avatar_url as author_avatar, COALESCE(p.display_name, u.name) as author_display_name FROM streams s JOIN users u ON u.id = s.user_id LEFT JOIN user_profiles p ON p.user_id = s.user_id WHERE s.created_at < ?';
  const binds = [cursor];
  if (onlyLive) query += ' AND s.is_live = 1';
  query += ' ORDER BY s.is_live DESC, s.created_at DESC LIMIT ?';
  binds.push(limit);
  const { results } = await env.DB.prepare(query).bind(...binds).all();
  return json({ items: results, next_cursor: results.length ? results[results.length - 1].created_at : null });
}

export async function handleCreateStream(request, env) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  const { title, description, stream_url, thumbnail_url } = await request.json();
  if (!title || title.length > 100) return json({ error: 'title_required' }, 400);
  if (!stream_url) return json({ error: 'stream_url_required' }, 400);
  const id = crypto.randomUUID();
  await env.DB.prepare(
    'INSERT INTO streams (id, user_id, title, description, stream_url, thumbnail_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, user.id, title, description || '', convertToEmbedUrl(stream_url), thumbnail_url || '', Date.now()).run();
  return json({ ok: true, stream_id: id });
}

export async function handleDeleteStream(request, env, streamId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  const stream = await env.DB.prepare('SELECT * FROM streams WHERE id = ?').bind(streamId).first();
  if (!stream) return json({ error: 'not_found' }, 404);
  if (stream.user_id !== user.id && user.name !== 'Negr') return json({ error: 'forbidden' }, 403);
  await env.DB.prepare('DELETE FROM streams WHERE id = ?').bind(streamId).run();
  return json({ ok: true });
}

export async function handleEndStream(request, env, streamId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);
  const stream = await env.DB.prepare('SELECT * FROM streams WHERE id = ?').bind(streamId).first();
  if (!stream) return json({ error: 'not_found' }, 404);
  if (stream.user_id !== user.id) return json({ error: 'forbidden' }, 403);
  await env.DB.prepare('UPDATE streams SET is_live = 0 WHERE id = ?').bind(streamId).run();
  return json({ ok: true });
}

export async function handleFollow(request, env, userId) {
  const cu = await requireUser(request, env);
  if (!cu) return json({ error: 'unauthorized' }, 401);
  if (cu.id === userId) return json({ error: 'cannot_follow_self' }, 400);
  const target = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(userId).first();
  if (!target) return json({ error: 'user_not_found' }, 404);
  const existing = await env.DB.prepare('SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?').bind(cu.id, userId).first();
  if (existing) {
    await env.DB.prepare('DELETE FROM follows WHERE follower_id = ? AND following_id = ?').bind(cu.id, userId).run();
    return json({ following: false });
  } else {
    await env.DB.prepare('INSERT INTO follows (follower_id, following_id, created_at) VALUES (?, ?, ?)').bind(cu.id, userId, Date.now()).run();
    return json({ following: true });
  }
}

export async function handleGetFollowers(request, env, userId) {
  const { results } = await env.DB.prepare('SELECT u.*, p.display_name, p.profile_emoji FROM follows f JOIN users u ON u.id = f.follower_id LEFT JOIN user_profiles p ON p.user_id = f.follower_id WHERE f.following_id = ? ORDER BY f.created_at DESC LIMIT 100').bind(userId).all();
  return json({ items: results });
}

export async function handleGetFollowing(request, env, userId) {
  const { results } = await env.DB.prepare('SELECT u.*, p.display_name, p.profile_emoji FROM follows f JOIN users u ON u.id = f.following_id LEFT JOIN user_profiles p ON p.user_id = f.following_id WHERE f.follower_id = ? ORDER BY f.created_at DESC LIMIT 100').bind(userId).all();
  return json({ items: results });
    }
