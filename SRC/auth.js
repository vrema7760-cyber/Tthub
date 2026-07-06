import { json, uuid, setSessionCookie } from './utils.js';

// Шаг 1: редирект на Google
export function googleLoginRedirect(env, redirectUri) {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
  });
  return Response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, 302);
}

// Шаг 2: callback — обмениваем code на токен, получаем профиль, создаём/находим юзера
export async function googleCallback(request, env, redirectUri) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return json({ error: 'missing_code' }, 400);

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return json({ error: 'oauth_failed', detail: tokenData }, 400);

  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const profile = await profileRes.json();

  let user = await env.DB.prepare('SELECT * FROM users WHERE google_id = ?').bind(profile.id).first();
  if (!user) {
    const id = uuid();
    await env.DB.prepare(
      'INSERT INTO users (id, google_id, email, name, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, profile.id, profile.email, profile.name, profile.picture || null, Date.now()).run();
    user = { id, google_id: profile.id, email: profile.email, name: profile.name, avatar_url: profile.picture };
  }

  const token = uuid() + uuid();
  await env.DB.prepare(
    'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(token, user.id, Date.now() + 30 * 24 * 3600 * 1000).run();

  return new Response(null, {
    status: 302,
    headers: { Location: '/', 'Set-Cookie': setSessionCookie(token) },
  });
}
