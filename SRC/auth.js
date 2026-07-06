import { json, uuid, setSessionCookie } from './utils.js';

// Шаг 1: редирект на GitHub
export function githubLoginRedirect(env, redirectUri) {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
  });
  return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
}

// Шаг 2: callback — обмениваем code на токен, получаем профиль, создаём/находим юзера
export async function githubCallback(request, env, redirectUri) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return json({ error: 'missing_code' }, 400);

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return json({ error: 'oauth_failed', detail: tokenData }, 400);

  const profileRes = await fetch('https://api.github.com/user', {
    headers: { 
      Authorization: `Bearer ${tokenData.access_token}`,
      'User-Agent': 'halloweentok-worker'
    },
  });
  const profile = await profileRes.json();

  // Если email не публичный, получаем его отдельно
  let email = profile.email;
  if (!email) {
    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: { 
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'halloweentok-worker'
      },
    });
    const emails = await emailsRes.json();
    const primaryEmail = emails.find(e => e.primary && e.verified);
    if (primaryEmail) email = primaryEmail.email;
  }

  let user = await env.DB.prepare('SELECT * FROM users WHERE github_id = ?').bind(profile.id).first();
  if (!user) {
    const id = uuid();
    await env.DB.prepare(
      'INSERT INTO users (id, github_id, email, name, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, profile.id, email, profile.login, profile.avatar_url, Date.now()).run();
    user = { id, github_id: profile.id, email, name: profile.login, avatar_url: profile.avatar_url };
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
