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
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    if (!code) return json({ error: 'missing_code' }, 400);

    // ✅ Валидация redirect_uri для безопасности
    const expectedRedirect = new URL(redirectUri).origin;
    const actualRedirect = url.origin;
    if (expectedRedirect !== actualRedirect) {
      return json({ error: 'redirect_uri_mismatch' }, 400);
    }

    // Обмен кода на токен с обработкой ошибок
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

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('GitHub token exchange failed:', errorText);
      return json({ error: 'oauth_failed', detail: errorText }, 502);
    }

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return json({ error: 'oauth_failed', detail: tokenData }, 400);
    }

    // Получение профиля пользователя
    const profileRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'halloweentok-worker'
      },
    });

    if (!profileRes.ok) {
      const errorText = await profileRes.text();
      console.error('GitHub profile fetch failed:', errorText);
      return json({ error: 'profile_fetch_failed', detail: errorText }, 502);
    }

    const profile = await profileRes.json();

    // Получение email (если не публичный)
    let email = profile.email;
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'halloweentok-worker'
        },
      });
      if (emailsRes.ok) {
        const emails = await emailsRes.json();
        const primaryEmail = emails.find(e => e.primary && e.verified);
        if (primaryEmail) email = primaryEmail.email;
      }
    }

    // Поиск или создание пользователя
    let user = await env.DB.prepare('SELECT * FROM users WHERE github_id = ?').bind(profile.id).first();
    if (!user) {
      const id = uuid();
      await env.DB.prepare(
        'INSERT INTO users (id, github_id, email, name, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(id, profile.id, email || '', profile.login, profile.avatar_url, Date.now()).run();
      user = { 
        id, 
        github_id: profile.id, 
        email: email || '', 
        name: profile.login, 
        avatar_url: profile.avatar_url 
      };
    }

    // Создание сессии
    const token = uuid() + uuid();
    await env.DB.prepare(
      'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)'
    ).bind(token, user.id, Date.now() + 30 * 24 * 3600 * 1000).run();

    return new Response(null, {
      status: 302,
      headers: { 
        Location: '/', 
        'Set-Cookie': setSessionCookie(token),
        'Cache-Control': 'no-store'
      },
    });
  } catch (err) {
    console.error('Auth callback error:', err);
    return json({ error: 'server_error', detail: err.message }, 500);
  }
}
