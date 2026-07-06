import { json } from './utils.js';
import { githubLoginRedirect, githubCallback } from './auth.js';
import { handleUpload, handleFeed, handleMediaContent, handleDeleteMedia } from './media.js';
import { handleLike, handleSave, handleComment, handleListComments } from './social.js';
import {
  handleListChats, handleOpenChat, handleSendMessage, handleGetMessages,
} from './chat.js';
import { handleSearch } from './search.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const redirectUri = \`\${url.origin}/auth/github/callback\`;

    try {
      // --- Auth ---
      if (path === '/auth/github') {
        return githubLoginRedirect(env, redirectUri);
      }
      if (path === '/auth/github/callback') {
        return githubCallback(request, env, redirectUri);
      }

      // --- Media ---
      if (path === '/api/upload' && request.method === 'POST') return handleUpload(request, env);
      if (path === '/api/feed' && request.method === 'GET') return handleFeed(request, env);

      let m;
      if ((m = path.match(/^\\/api\\/media\\/([\\w-]+)\\/content\$/)) && request.method === 'GET') {
        return handleMediaContent(request, env, m[1]);
      }
      if ((m = path.match(/^\\/api\\/media\\/([\\w-]+)\$/)) && request.method === 'DELETE') {
        return handleDeleteMedia(request, env, m[1]);
      }
      if ((m = path.match(/^\\/api\\/media\\/([\\w-]+)\\/like\$/)) && request.method === 'POST') {
        return handleLike(request, env, m[1]);
      }
      if ((m = path.match(/^\\/api\\/media\\/([\\w-]+)\\/save\$/)) && request.method === 'POST') {
        return handleSave(request, env, m[1]);
      }
      if ((m = path.match(/^\\/api\\/media\\/([\\w-]+)\\/comments\$/))) {
        if (request.method === 'POST') return handleComment(request, env, m[1]);
        if (request.method === 'GET') return handleListComments(request, env, m[1]);
      }

      // --- Search ---
      if (path === '/api/search' && request.method === 'GET') return handleSearch(request, env);

      // --- Chat ---
      if (path === '/api/chats' && request.method === 'GET') return handleListChats(request, env);
      if (path === '/api/chats/open' && request.method === 'POST') return handleOpenChat(request, env);
      if ((m = path.match(/^\\/api\\/chats\\/([\\w-]+)\\/messages\$/))) {
        if (request.method === 'POST') return handleSendMessage(request, env, m[1]);
        if (request.method === 'GET') return handleGetMessages(request, env, m[1]);
      }

      // --- Static frontend ---
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
