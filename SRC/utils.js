export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
};

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

export function handleOptions() {
  return new Response(null, { headers: corsHeaders, status: 204 });
}

export function uuid() {
  return crypto.randomUUID();
}

export function setSessionCookie(token) {
  return `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`;
}

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const [key, val] = c.trim().split('=');
    if (key) cookies[key] = decodeURIComponent(val || '');
  });
  return cookies;
}

export async function getSessionToken(request) {
  const cookies = parseCookies(request.headers.get('Cookie'));
  return cookies.session || null;
}

export async function requireUser(request, env) {
  try {
    const token = await getSessionToken(request);
    if (!token) return null;

    const session = await env.DB.prepare(
      'SELECT * FROM sessions WHERE token = ? AND expires_at > ?'
    ).bind(token, Date.now()).first();

    if (!session) return null;

    return await env.DB.prepare(
      'SELECT id, name, avatar_url, created_at FROM users WHERE id = ?'
    ).bind(session.user_id).first();
  } catch (err) {
    console.warn('Session check failed:', err.message);
    return null;
  }
}
