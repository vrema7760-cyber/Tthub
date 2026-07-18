// SRC/utils.js

export const json = (data, status = 200, headers = {}) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers }
  });
};

export const requireUser = async (request, env) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  
  // Очистка просроченных сессий
  await env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(Date.now()).run();
  
  const session = await env.DB.prepare(
    'SELECT user_id FROM sessions WHERE token = ? AND expires_at > ?'
  ).bind(token, Date.now()).first();
  
  if (!session) return null;
  
  return await env.DB.prepare(
    'SELECT id, name, avatar_url FROM users WHERE id = ?'
  ).bind(session.user_id).first();
};

// === БЕЗОПАСНОЕ ХЕШИРОВАНИЕ ПАРОЛЕЙ (Web Crypto API) ===
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 },
    keyMaterial, 256
  );
  const hashArray = Array.from(new Uint8Array(hash));
  const saltArray = Array.from(salt);
  return saltArray.map(b => b.toString(16).padStart(2, '0')).join('') + ':' + 
         hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPassword = async (password, storedHash) => {
  const [saltHex, hashHex] = storedHash.split(':');
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const encoder = new TextEncoder();
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 },
    keyMaterial, 256
  );
  const hashArray = Array.from(new Uint8Array(hash));
  const computedHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return computedHex === hashHex;
};

// === CORS HEADERS ===
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const handleOptions = () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};
