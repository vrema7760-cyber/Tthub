import { json, uuid, requireUser } from './utils.js';

function chatPairKey(a, b) {
  return a < b ? [a, b] : [b, a];
}

export async function handleListChats(request, env) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const { results } = await env.DB.prepare(
    `SELECT chats.*,
       CASE WHEN user1_id = ? THEN user2_id ELSE user1_id END as other_user_id
     FROM chats WHERE user1_id = ? OR user2_id = ?
     ORDER BY created_at DESC`
  ).bind(user.id, user.id, user.id).all();

  return json({ items: results });
}

export async function handleOpenChat(request, env) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const { with_user_id } = await request.json();
  if (!with_user_id) return json({ error: 'bad_request' }, 400);

  const [user1_id, user2_id] = chatPairKey(user.id, with_user_id);
  let chat = await env.DB.prepare('SELECT * FROM chats WHERE user1_id = ? AND user2_id = ?')
    .bind(user1_id, user2_id).first();

  if (!chat) {
    const id = uuid();
    await env.DB.prepare('INSERT INTO chats (id, user1_id, user2_id, created_at) VALUES (?, ?, ?, ?)')
      .bind(id, user1_id, user2_id, Date.now()).run();
    chat = { id, user1_id, user2_id, created_at: Date.now() };
  }
  return json({ chat });
}

export async function handleSendMessage(request, env, chatId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const chat = await env.DB.prepare('SELECT * FROM chats WHERE id = ?').bind(chatId).first();
  if (!chat || (chat.user1_id !== user.id && chat.user2_id !== user.id)) {
    return json({ error: 'forbidden' }, 403);
  }

  const { text } = await request.json();
  if (!text || !text.trim()) return json({ error: 'empty_message' }, 400);

  const id = uuid();
  await env.DB.prepare(
    'INSERT INTO messages (id, chat_id, sender_id, text, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, chatId, user.id, text.trim().slice(0, 2000), Date.now()).run();

  return json({ ok: true, id });
}

export async function handleGetMessages(request, env, chatId) {
  const user = await requireUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const chat = await env.DB.prepare('SELECT * FROM chats WHERE id = ?').bind(chatId).first();
  if (!chat || (chat.user1_id !== user.id && chat.user2_id !== user.id)) {
    return json({ error: 'forbidden' }, 403);
  }

  const { results } = await env.DB.prepare(
    'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC LIMIT 500'
  ).bind(chatId).all();

  return json({ items: results });
}
