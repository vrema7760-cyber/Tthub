/**
 * 🎃 SpookyTok — главный Cloudflare Worker
 * TikTok-стиль платформа с жуткой эстетикой
 * Cloudflare Workers + D1 + Shards
 */

import { json, requireUser } from './utils.js';
import { githubLoginRedirect, githubCallback } from './auth.js';
import {
  handleGetMyProfile,
  handleGetUserProfile,
  handleUpdateProfile,
  handleChangeUsername,
  handleListStreams,
  handleCreateStream,
  handleDeleteStream,
  handleEndStream,
  handleFollow,
  handleGetFollowers,
  handleGetFollowing
} from './profile.js';
import {
  handleUpload,
  handleFeed,
  handleMediaContent,
  handleDeleteMedia
} from './media.js';
import {
  handleListChats,
  handleOpenChat,
  handleSendMessage,
  handleGetMessages
} from './chat.js';
import {
  handleLike,
  handleSave,
  handleComment,
  handleListComments
} from './social.js';
import { handleSearch } from './search.js';
import INDEX_HTML from './index.html.js';

// ============================================
// Вспомогательные функции
// ============================================

function notFound() {
  return new Response('404 Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' }
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Cookie',
    'Access-Control-Allow-Credentials': 'true'
  };
}

// ============================================
// Парсинг URL с параметрами
// ============================================

function parsePath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  return parts;
}

// ============================================
// ОБРАБОТЧИК ЗАПРОСОВ
// ============================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // ==========================================
    // ГЛАВНАЯ СТРАНИЦА
    // ==========================================
    if (pathname === '/' || pathname === '/index.html') {
      return new Response(INDEX_HTML, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // ==========================================
    // GITHUB OAUTH
    // ==========================================
    if (pathname === '/auth/github' && method === 'GET') {
      const redirectUri = `${url.origin}/auth/github/callback`;
      return githubLoginRedirect(env, redirectUri);
    }

    if (pathname === '/auth/github/callback' && method === 'GET') {
      const redirectUri = `${url.origin}/auth/github/callback`;
      return githubCallback(request, env, redirectUri);
    }

    // ==========================================
    // API: МЕДИА
    // ==========================================
    if (pathname === '/api/media/upload' && method === 'POST') {
      return handleUpload(request, env);
    }

    if (pathname === '/api/media/feed' && method === 'GET') {
      return handleFeed(request, env);
    }

    if (pathname === '/api/search' && method === 'GET') {
      return handleSearch(request, env);
    }

    // /api/media/:id — динамические роуты
    const mediaParts = parsePath(pathname);
    if (mediaParts[0] === 'api' && mediaParts[1] === 'media' && mediaParts[2]) {
      const mediaId = mediaParts[2];

      if (mediaParts[3] === 'like' && method === 'POST') {
        return handleLike(request, env, mediaId);
      }
      if (mediaParts[3] === 'save' && method === 'POST') {
        return handleSave(request, env, mediaId);
      }
      if (mediaParts[3] === 'comment' && method === 'POST') {
        return handleComment(request, env, mediaId);
      }
      if (mediaParts[3] === 'comments' && method === 'GET') {
        return handleListComments(request, env, mediaId);
      }
      if (method === 'GET' && !mediaParts[3]) {
        return handleMediaContent(request, env, mediaId);
      }
      if (method === 'DELETE' && !mediaParts[3]) {
        return handleDeleteMedia(request, env, mediaId);
      }
    }

    // ==========================================
    // API: ПРОФИЛЬ
    // ==========================================
    if (pathname === '/api/profile/me' && method === 'GET') {
      return handleGetMyProfile(request, env);
    }

    if (pathname === '/api/profile' && method === 'PUT') {
      return handleUpdateProfile(request, env);
    }

    if (pathname === '/api/profile/username' && method === 'PUT') {
      return handleChangeUsername(request, env);
    }

    // /api/profile/:userId
    const profileParts = parsePath(pathname);
    if (profileParts[0] === 'api' && profileParts[1] === 'profile' && profileParts[2]) {
      const userId = profileParts[2];

      if (profileParts[3] === 'follow' && method === 'POST') {
        return handleFollow(request, env, userId);
      }
      if (profileParts[3] === 'followers' && method === 'GET') {
        return handleGetFollowers(request, env, userId);
      }
      if (profileParts[3] === 'following' && method === 'GET') {
        return handleGetFollowing(request, env, userId);
      }
      if (!profileParts[3] && method === 'GET') {
        return handleGetUserProfile(request, env, userId);
      }
    }

    // ==========================================
    // API: СТРИМЫ
    // ==========================================
    if (pathname === '/api/streams' && method === 'GET') {
      return handleListStreams(request, env);
    }

    if (pathname === '/api/streams' && method === 'POST') {
      return handleCreateStream(request, env);
    }

    const streamParts = parsePath(pathname);
    if (streamParts[0] === 'api' && streamParts[1] === 'streams' && streamParts[2]) {
      const streamId = streamParts[2];

      if (streamParts[3] === 'end' && method === 'POST') {
        return handleEndStream(request, env, streamId);
      }
      if (!streamParts[3] && method === 'DELETE') {
        return handleDeleteStream(request, env, streamId);
      }
    }

    // ==========================================
    // API: ЧАТЫ
    // ==========================================
    if (pathname === '/api/chats' && method === 'GET') {
      return handleListChats(request, env);
    }

    if (pathname === '/api/chats/open' && method === 'POST') {
      return handleOpenChat(request, env);
    }

    const chatParts = parsePath(pathname);
    if (chatParts[0] === 'api' && chatParts[1] === 'chats' && chatParts[2]) {
      const chatId = chatParts[2];

      if (chatParts[3] === 'messages' && method === 'POST') {
        return handleSendMessage(request, env, chatId);
      }
      if (chatParts[3] === 'messages' && method === 'GET') {
        return handleGetMessages(request, env, chatId);
      }
    }

    // ==========================================
    // НЕ НАЙДЕНО
    // ==========================================
    return notFound();
  }
};
