import { json } from './utils.js';

export async function handleSearch(request, env) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim();
  if (!q) return json({ media: [], users: [] });

  const like = `%${q}%`;

  const { results: media } = await env.DB.prepare(
    `SELECT media.*, users.name as author_name FROM media
     JOIN users ON users.id = media.user_id
     WHERE media.caption LIKE ? ESCAPE '\\'
     ORDER BY media.created_at DESC LIMIT 30`
  ).bind(like).all();

  const { results: users } = await env.DB.prepare(
    `SELECT id, name, avatar_url FROM users WHERE name LIKE ? ESCAPE '\\' LIMIT 20`
  ).bind(like).all();

  return json({ media, users });
}
