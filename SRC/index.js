/**
 * 🎃 SpookyTok — главный Cloudflare Worker
 * TikTok-стиль платформа с жуткой эстетикой
 * Cloudflare Workers + D1 + Shards
 */

import { json } from './utils.js';
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
// КРИТИЧНО: CORS HEADERS (динамический Origin)
// ============================================
// БРАУЗЕРЫ БЛОКИРУЮТ 'Access-Control-Allow-Origin: *' ВМЕСТЕ С 'credentials: include'!
// Поэтому берём Origin из запроса и возвращаем его же.
function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Cookie, Authorization',
    'Vary': 'Origin',
  };
}

// Оборачивает любой Response добавляя CORS headers
function withCors(request, response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(request))) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// ============================================
// ОБЁРТКА ОБРАБОТЧИКОВ (ловит все ошибки)
// ============================================
// Без этого при любой ошибке в handler-е Worker падает с 500 БЕЗ тела,
// и фронтенд получает пустой ответ → всё ломается.
async function safeHandler(request, handler) {
  try {
    const response = await handler();
    return withCors(request, response);
  } catch (err) {
    console.error('❌ Handler error:', err);
    return withCors(request, json(
      { error: err.message || 'internal_server_error' },
      500
    ));
  }
}

function notFound(request) {
  return withCors(request, new Response('404 Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' }
  }));
}

// ============================================
// ПАРСИНГ URL
// ============================================
function parsePath(pathname) {
  return pathname.split('/').filter(Boolean);
}

// ============================================
// ОБРАБОТЧИК ЗАПРОСОВ
// ============================================
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // Удобная обёртка: передаём async-функцию, получаем Response с CORS и обработкой ошибок
    const wrap = (handler) => safeHandler(request, handler);

    // ==========================================
    // CORS PREFLIGHT (OPTIONS)
    // ==========================================
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    // ==========================================
    // ГЛАВНАЯ СТРАНИЦА
    // ==========================================
    if (pathname === '/' || pathname === '/index.html') {
      return withCors(request, new Response(INDEX_HTML, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      }));
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
      return wrap(() => handleUpload(request, env));
    }

    if (pathname === '/api/media/feed' && method === 'GET') {
      return wrap(() => handleFeed(request, env));
    }

    if (pathname === '/api/search' && method === 'GET') {
      return wrap(() => handleSearch(request, env));
    }

    // /api/media/:id — динамические роуты
    const mediaParts = parsePath(pathname);
    if (mediaParts[0] === 'api' && mediaParts[1] === 'media' && mediaParts[2]) {
      const mediaId = mediaParts[2];

      if (mediaParts[3] === 'like' && method === 'POST') {
        return wrap(() => handleLike(request, env, mediaId));
      }
      if (mediaParts[3] === 'save' && method === 'POST') {
        return wrap(() => handleSave(request, env, mediaId));
      }
      if (mediaParts[3] === 'comment' && method === 'POST') {
        return wrap(() => handleComment(request, env, mediaId));
      }
      if (mediaParts[3] === 'comments' && method === 'GET') {
        return wrap(() => handleListComments(request, env, mediaId));
      }
      if (method === 'GET' && !mediaParts[3]) {
        return wrap(() => handleMediaContent(request, env, mediaId));
      }
      if (method === 'DELETE' && !mediaParts[3]) {
        return wrap(() => handleDeleteMedia(request, env, mediaId));
      }
    }

    // ==========================================
    // API: ПРОФИЛЬ
    // ==========================================
    if (pathname === '/api/profile/me' && method === 'GET') {
      return wrap(() => handleGetMyProfile(request, env));
    }

    if (pathname === '/api/profile' && method === 'PUT') {
      return wrap(() => handleUpdateProfile(request, env));
    }

    if (pathname === '/api/profile/username' && method === 'PUT') {
      return wrap(() => handleChangeUsername(request, env));
    }

    // /api/profile/:userId
    const profileParts = parsePath(pathname);
    if (profileParts[0] === 'api' && profileParts[1] === 'profile' && profileParts[2]) {
      const userId = profileParts[2];

      if (profileParts[3] === 'follow' && method === 'POST') {
        return wrap(() => handleFollow(request, env, userId));
      }
      if (profileParts[3] === 'followers' && method === 'GET') {
        return wrap(() => handleGetFollowers(request, env, userId));
      }
      if (profileParts[3] === 'following' && method === 'GET') {
        return wrap(() => handleGetFollowing(request, env, userId));
      }
      if (!profileParts[3] && method === 'GET') {
        return wrap(() => handleGetUserProfile(request, env, userId));
      }
    }

    // ==========================================
    // API: СТРИМЫ
    // ==========================================
    if (pathname === '/api/streams' && method === 'GET') {
      return wrap(() => handleListStreams(request, env));
    }

    if (pathname === '/api/streams' && method === 'POST') {
      return wrap(() => handleCreateStream(request, env));
    }

    const streamParts = parsePath(pathname);
    if (streamParts[0] === 'api' && streamParts[1] === 'streams' && streamParts[2]) {
      const streamId = streamParts[2];

      if (streamParts[3] === 'end' && method === 'POST') {
        return wrap(() => handleEndStream(request, env, streamId));
      }
      if (!streamParts[3] && method === 'DELETE') {
        return wrap(() => handleDeleteStream(request, env, streamId));
      }
    }

    // ==========================================
    // API: ЧАТЫ
    // ==========================================
    if (pathname === '/api/chats' && method === 'GET') {
      return wrap(() => handleListChats(request, env));
    }

    if (pathname === '/api/chats/open' && method === 'POST') {
      return wrap(() => handleOpenChat(request, env));
    }

    const chatParts = parsePath(pathname);
    if (chatParts[0] === 'api' && chatParts[1] === 'chats' && chatParts[2]) {
      const chatId = chatParts[2];

      if (chatParts[3] === 'messages' && method === 'POST') {
        return wrap(() => handleSendMessage(request, env, chatId));
      }
      if (chatParts[3] === 'messages' && method === 'GET') {
        return wrap(() => handleGetMessages(request, env, chatId));
      }
    }

    // ==========================================
    // НЕ НАЙДЕНО
    // ==========================================
    return notFound(request);
  }
};
