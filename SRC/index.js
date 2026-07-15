import { json } from './utils.js';
import { getCurrentUser } from './utils.js';
import { githubLoginRedirect, githubCallback } from './auth.js';
import { handleUpload, handleFeed, handleMediaContent, handleDeleteMedia } from './media.js';
import { handleLike, handleSave, handleComment, handleListComments } from './social.js';
import { handleListChats, handleOpenChat, handleSendMessage, handleGetMessages } from './chat.js';
import { handleSearch } from './search.js';
import {
  handleGetMyProfile, handleGetUserProfile, handleUpdateProfile, handleChangeUsername,
  handleListStreams, handleCreateStream, handleDeleteStream, handleEndStream,
  handleFollow, handleGetFollowStatus, handleGetFollowers, handleGetFollowing
} from './profile.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const redirectUri = `${url.origin}/auth/github/callback`;

    try {
      // --- Auth ---
      if (path === '/auth/github') return githubLoginRedirect(env, redirectUri);
      if (path === '/auth/github/callback') return githubCallback(request, env, redirectUri);

      // --- User ---
      if (path === '/api/me' && request.method === 'GET') {
        const user = await getCurrentUser(request, env);
        if (!user) return json({ error: 'unauthorized' }, 401);
        return json(user);
      }

      // --- Profile ---
      if (path === '/api/profile/me' && request.method === 'GET') return handleGetMyProfile(request, env);
      if (path === '/api/profile/update' && request.method === 'POST') return handleUpdateProfile(request, env);
      if (path === '/api/profile/username' && request.method === 'POST') return handleChangeUsername(request, env);
      
      let m;
      if ((m = path.match(/^\/api\/profile\/([\w-]+)$/)) && request.method === 'GET') {
        return handleGetUserProfile(request, env, m[1]);
      }
      if ((m = path.match(/^\/api\/profile\/([\w-]+)\/followers$/)) && request.method === 'GET') {
        return handleGetFollowers(request, env, m[1]);
      }
      if ((m = path.match(/^\/api\/profile\/([\w-]+)\/following$/)) && request.method === 'GET') {
        return handleGetFollowing(request, env, m[1]);
      }

      // --- Follow ---
      if ((m = path.match(/^\/api\/follow\/([\w-]+)$/)) && request.method === 'POST') {
        return handleFollow(request, env, m[1]);
      }
      if ((m = path.match(/^\/api\/follow\/([\w-]+)\/status$/)) && request.method === 'GET') {
        return handleGetFollowStatus(request, env, m[1]);
      }

      // --- Streams ---
      if (path === '/api/streams' && request.method === 'GET') return handleListStreams(request, env);
      if (path === '/api/streams' && request.method === 'POST') return handleCreateStream(request, env);
      if ((m = path.match(/^\/api\/streams\/([\w-]+)$/)) && request.method === 'DELETE') {
        return handleDeleteStream(request, env, m[1]);
      }
      if ((m = path.match(/^\/api\/streams\/([\w-]+)\/end$/)) && request.method === 'POST') {
        return handleEndStream(request, env, m[1]);
      }

      // --- Media ---
      if (path === '/api/upload' && request.method === 'POST') return handleUpload(request, env);
      if (path === '/api/feed' && request.method === 'GET') return handleFeed(request, env);

      if ((m = path.match(/^\/api\/media\/([\w-]+)\/content$/)) && request.method === 'GET') {
        return handleMediaContent(request, env, m[1]);
      }
      if ((m = path.match(/^\/api\/media\/([\w-]+)$/)) && request.method === 'DELETE') {
        return handleDeleteMedia(request, env, m[1]);
      }
      if ((m = path.match(/^\/api\/media\/([\w-]+)\/like$/)) && request.method === 'POST') {
        return handleLike(request, env, m[1]);
      }
      if ((m = path.match(/^\/api\/media\/([\w-]+)\/save$/)) && request.method === 'POST') {
        return handleSave(request, env, m[1]);
      }
      if ((m = path.match(/^\/api\/media\/([\w-]+)\/comments$/))) {
        if (request.method === 'POST') return handleComment(request, env, m[1]);
        if (request.method === 'GET') return handleListComments(request, env, m[1]);
      }

      // --- Search ---
      if (path === '/api/search' && request.method === 'GET') return handleSearch(request, env);

      // --- Chat ---
      if (path === '/api/chats' && request.method === 'GET') return handleListChats(request, env);
      if (path === '/api/chats/open' && request.method === 'POST') return handleOpenChat(request, env);
      if ((m = path.match(/^\/api\/chats\/([\w-]+)\/messages$/))) {
        if (request.method === 'POST') return handleSendMessage(request, env, m[1]);
        if (request.method === 'GET') return handleGetMessages(request, env, m[1]);
      }

      // --- Frontend ---
      if (path === '/' || path === '/index.html') {
        return new Response(INDEX_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }

      return json({ error: 'not_found' }, 404);
    } catch (err) {
      return json({ error: 'internal_error', detail: String(err) }, 500);
    }
  },
};

import INDEX_HTML from './index.html.js';
