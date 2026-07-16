export function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

export function uuid() {
  return crypto.randomUUID();
}

export function getCookie(request, name) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

// ✅ КРИТИЧНЫЙ ФИКС: Secure ставится ТОЛЬКО на HTTPS
// Иначе на http://localhost:8787 браузер откажется сохранять cookie
export function setSessionCookie(token, request) {
  const url = new URL(request.url);
  const isSecure = url.protocol === 'https:' 
    || url.hostname === 'localhost' 
    || url.hostname === '127.0.0.1';
  
  const parts = [
    `session=${token}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    'Max-Age=2592000',
  ];
  if (isSecure) parts.push('Secure');
  return parts.join('; ');
}

export async function requireUser(request, env) {
  const token = getCookie(request, 'session');
  if (!token) return null;
  const row = await env.DB.prepare(
    'SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = ? AND sessions.expires_at > ?'
  ).bind(token, Date.now()).first();
  return row || null;
}
