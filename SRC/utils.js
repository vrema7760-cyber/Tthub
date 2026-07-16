export function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

export function uuid() {
  return crypto.randomUUID();
}

// ✅ Динамический CORS: Origin берётся из запроса (не '*')
export function corsHeadersFor(request) {
  const origin = request.headers.get('Origin');
  const allowed = origin || '*'; // в прод-окружении можно ограничить списком
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Cookie',
    'Vary': 'Origin',
  };
}

// ✅ Оборачивает любой Response с CORS
export function withCors(request, response) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(corsHeadersFor(request))) {
    headers.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function getCookie(request, name) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

// ✅ Secure ставится только если запрос пришёл по HTTPS (или localhost — для dev)
export function setSessionCookie(token, request) {
  const url = new URL(request.url);
  const isSecure = url.protocol === 'https:' || url.hostname === 'localhost' || url.hostname === '127.0.0.1';
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
