// SRC/index.js
import { handleUpload, handleFeed, handleMediaContent, handleDeleteMedia } from './media.js';
import {
  handleGetMyProfile, 
  handleGetUserProfile, 
  handleUpdateProfile, 
  handleListStreams, 
  handleCreateStream, 
  handleEndStream, 
  handleDeleteStream,
  handleGetStream,
  handleLike, 
  handleSave, 
  handleGetSaved, 
  handleFollow
} from './profile.js';
import { githubLoginRedirect, githubCallback } from './auth.js';
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

    // === GITHUB AUTH ===
    if (path === '/auth/github' && method === 'GET') {
      const redirectUri = url.origin + '/auth/github/callback';
      return githubLoginRedirect(env, redirectUri);
    }
    
    if (path === '/auth/github/callback' && method === 'GET') {
      const redirectUri = url.origin + '/auth/github/callback';
      return githubCallback(request, env, redirectUri);
    }

    // === МЕДИА API ===
    if (path === '/api/media/upload' && method === 'POST')
      return handleUpload(request, env);

    if (path === '/api/media/feed' && method === 'GET')
      return handleFeed(request, env);

    if (path === '/api/media/saved' && method === 'GET')
      return handleGetSaved(request, env);

    // Медиа по ID
    const mediaIdMatch = path.match(/^\/api\/media\/([^/]+)$/);
    if (mediaIdMatch) {
      const mediaId = mediaIdMatch[1];
      if (method === 'GET') return handleMediaContent(request, env, mediaId);
      if (method === 'DELETE') return handleDeleteMedia(request, env, mediaId);
    }

    // Лайки/сейвы
    const mediaLikeMatch = path.match(/^\/api\/media\/([^/]+)\/like$/);
    if (mediaLikeMatch && method === 'POST') {
      return handleLike(request, env, mediaLikeMatch[1]);
    }

    const mediaSaveMatch = path.match(/^\/api\/media\/([^/]+)\/save$/);
    if (mediaSaveMatch && method === 'POST') {
      return handleSave(request, env, mediaSaveMatch[1]);
    }

    // === СТРИМЫ API ===
    if (path === '/api/streams' && method === 'GET')
      return handleListStreams(request, env);

    if (path === '/api/streams' && method === 'POST')
      return handleCreateStream(request, env);

    // Стримы по ID
    const streamEndMatch = path.match(/^\/api\/streams\/([^/]+)\/end$/);
    if (streamEndMatch && method === 'POST') {
      return handleEndStream(request, env, streamEndMatch[1]);
    }

    const streamIdMatch = path.match(/^\/api\/streams\/([^/]+)$/);
    if (streamIdMatch) {
      const streamId = streamIdMatch[1];
      if (method === 'GET') return handleGetStream(request, env, streamId);
      if (method === 'DELETE') return handleDeleteStream(request, env, streamId);
    }

    // === ПРОФИЛЬ API ===
    if (path === '/api/profile' && method === 'GET') {
      const userId = url.searchParams.get('id');
      if (userId) {
        return handleGetUserProfile(request, env, userId);
      }
      return handleGetMyProfile(request, env);
    }

    if (path === '/api/profile' && method === 'PUT')
      return handleUpdateProfile(request, env);

    if (path === '/api/profile/follow' && method === 'POST') {
      const userId = url.searchParams.get('user_id');
      if (!userId) return json({ error: 'missing_user_id' }, 400);
      return handleFollow(request, env, userId);
    }

    // === 404 ===
    return json({ error: 'not_found', path }, 404);
  }
};
