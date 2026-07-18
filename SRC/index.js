// SRC/index.js
import { handleUpload, handleFeed, handleMediaContent, handleDeleteMedia } from './media.js';
import { 
  handleGetProfile, handleUpdateProfile, handleRegister, handleLogin, handleLogout,
  handleListStreams, handleCreateStream, handleEndStream, handleDeleteStream, handleGetStream,
  handleLike, handleSave, handleGetSaved 
} from './profile.js';
import { json, corsHeaders, handleOptions } from './utils.js';
import INDEX_HTML from './index.html.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') return handleOptions();

    // === HTML / FRONTEND ===
    if (path === '/' || path === '/index.html') {
      return new Response(INDEX_HTML, { 
        headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders } 
      });
    }

    // === МЕДИА API ===
    if (path === '/api/media/upload' && method === 'POST') 
      return handleUpload(request, env);
    
    if (path === '/api/media/feed' && method === 'GET') 
      return handleFeed(request, env);
    
    if (path.match(/^\/api\/media\/[^/]+\/like$/) && method === 'POST') {
      const mediaId = path.split('/')[3];
      return handleLike(request, env, mediaId);
    }
    
    if (path.match(/^\/api\/media\/[^/]+\/save$/) && method === 'POST') {
      const mediaId = path.split('/')[3];
      return handleSave(request, env, mediaId);
    }
    
    if (path.match(/^\/api\/media\/[^/]+$/) && method === 'GET') {
      const mediaId = path.split('/')[3];
      return handleMediaContent(request, env, mediaId);
    }
    
    if (path.match(/^\/api\/media\/[^/]+$/) && method === 'DELETE') {
      const mediaId = path.split('/')[3];
      return handleDeleteMedia(request, env, mediaId);
    }

    // === СТРИМЫ API ===
    if (path === '/api/streams' && method === 'GET') 
      return handleListStreams(request, env);
    
    if (path === '/api/streams' && method === 'POST') 
      return handleCreateStream(request, env);
    
    if (path.match(/^\/api\/streams\/[^/]+\/end$/) && method === 'POST') {
      const streamId = path.split('/')[3];
      return handleEndStream(request, env, streamId);
    }
    
    if (path.match(/^\/api\/streams\/[^/]+$/) && !path.includes('/end')) {
      const streamId = path.split('/')[3];
      if (method === 'GET') return handleGetStream(request, env, streamId);
      if (method === 'DELETE') return handleDeleteStream(request, env, streamId);
    }

    // === ПРОФИЛЬ / АВТОРИЗАЦИЯ ===
    if (path === '/api/auth/register' && method === 'POST') 
      return handleRegister(request, env);
    
    if (path === '/api/auth/login' && method === 'POST') 
      return handleLogin(request, env);
    
    if (path === '/api/auth/logout' && method === 'POST') 
      return handleLogout(request, env);
    
    if (path === '/api/profile' && method === 'GET') {
      const userId = url.searchParams.get('id');
      if (!userId) return json({ error: 'missing_id' }, 400);
      return handleGetProfile(request, env, userId);
    }
    
    if (path === '/api/profile' && method === 'PUT') 
      return handleUpdateProfile(request, env);
    
    if (path === '/api/profile/saved' && method === 'GET') 
      return handleGetSaved(request, env);

    // === 404 ===
    return json({ error: 'not_found', path }, 404);
  }
};
