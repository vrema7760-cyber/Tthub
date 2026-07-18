// SRC/index.html.js
const INDEX_HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#0a0a1a">
<title>🎃 SpookyTok — Жуткие Истории</title>
<style>
:root {
  --bg-primary: #0a0a1a;
  --bg-secondary: #151528;
  --bg-card: rgba(25, 25, 50, 0.8);
  --text-primary: #f0f0ff;
  --text-secondary: #a0a0c0;
  --accent-purple: #8b5cf6;
  --accent-orange: #f97316;
  --accent-cyan: #06b6d4;
  --accent-pink: #ec4899;
  --danger: #ef4444;
  --success: #10b981;
  --border: rgba(139, 92, 246, 0.2);
  --shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  height: 100%;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
  position: relative;
  padding-bottom: calc(80px + var(--safe-bottom));
  padding-top: var(--safe-top);
}

/* ===== AURORA ФОН ===== */
.aurora-bg {
  position: fixed;
  inset: 0;
  z-index: -2;
  overflow: hidden;
  background: var(--bg-primary);
}

.aurora-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: blob-float 20s ease-in-out infinite;
}

.aurora-blob:nth-child(1) {
  width: 400px; height: 400px;
  background: var(--accent-purple);
  top: -100px; left: -100px;
  animation-delay: 0s;
}

.aurora-blob:nth-child(2) {
  width: 350px; height: 350px;
  background: var(--accent-orange);
  top: 40%; right: -100px;
  animation-delay: -7s;
}

.aurora-blob:nth-child(3) {
  width: 300px; height: 300px;
  background: var(--accent-cyan);
  bottom: -100px; left: 30%;
  animation-delay: -14s;
}

@keyframes blob-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(50px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 50px) scale(0.9); }
}

/* ===== ЧАСТИЦЫ ===== */
#particles-canvas {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

/* ===== МАГНИТНЫЙ КУРСОР (только ПК) ===== */
.magnetic-cursor {
  position: fixed;
  width: 20px; height: 20px;
  border: 2px solid var(--accent-purple);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.15s ease-out, width 0.2s, height 0.2s, border-color 0.2s;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
  display: none;
}

.magnetic-cursor.active {
  width: 40px; height: 40px;
  border-color: var(--accent-orange);
}

@media (hover: hover) and (pointer: fine) {
  .magnetic-cursor { display: block; }
  body * { cursor: none !important; }
}

/* ===== HEADER ===== */
.app-header {
  position: sticky;
  top: var(--safe-top);
  z-index: 100;
  padding: 16px 20px;
  background: rgba(10, 10, 26, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-orange), var(--accent-pink));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  user-select: none;
  transition: transform 0.3s;
  cursor: pointer;
}

.logo:hover { transform: scale(1.05); }

.header-actions { display: flex; gap: 12px; align-items: center; }

.icon-btn {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
}

.icon-btn:hover {
  background: var(--accent-purple);
  transform: scale(1.1);
}

.avatar-btn {
  width: 40px; height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--accent-purple);
  background: var(--bg-card);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  text-decoration: none;
}

.avatar-btn img { width: 100%; height: 100%; object-fit: cover; }

/* ===== НАВИГАЦИЯ ===== */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0; right: 0;
  z-index: 100;
  padding: 12px 20px calc(12px + var(--safe-bottom));
  background: rgba(10, 10, 26, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 11px;
  transition: all 0.2s;
  border: none;
  background: none;
  cursor: pointer;
}

.nav-item.active { color: var(--accent-purple); }
.nav-item .nav-icon { font-size: 22px; }

.nav-item.upload-btn .nav-icon {
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-top: -20px;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.5);
}

/* ===== СЕКЦИИ ===== */
.section {
  display: none;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease-out;
}

.section.active { display: block; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-orange));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ===== КАРТОЧКИ МЕДИА (Bento Grid) ===== */
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.media-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  animation: cardAppear 0.5s ease-out;
}

@keyframes cardAppear {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.media-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-purple);
  box-shadow: var(--shadow);
}

.media-card.large { grid-column: span 2; }
.media-card.wide { grid-row: span 2; }

.media-preview {
  width: 100%;
  aspect-ratio: 9/16;
  background: #000;
  position: relative;
  overflow: hidden;
}

.media-preview img, .media-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-type-badge {
  position: absolute;
  top: 10px; left: 10px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  font-size: 12px;
  backdrop-filter: blur(10px);
  color: white;
}

.media-info {
  padding: 12px;
}

.media-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.media-author img {
  width: 28px; height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.media-caption {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 10px;
  word-break: break-word;
}

.media-actions {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.media-action {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: inherit;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  font-size: 13px;
}

.media-action:hover { background: rgba(139, 92, 246, 0.2); color: var(--accent-purple); }
.media-action.liked { color: var(--accent-pink); }
.media-action.saved { color: var(--accent-orange); }
.media-action.delete-btn { color: var(--danger) !important; margin-left: auto; }

/* ===== СТРИМЫ ===== */
.streams-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--danger);
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.live-dot {
  width: 8px; height: 8px;
  background: white;
  border-radius: 50%;
}

.streams-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 16px;
  -webkit-overflow-scrolling: touch;
}

.streams-scroll::-webkit-scrollbar { height: 6px; }
.streams-scroll::-webkit-scrollbar-thumb { background: var(--accent-purple); border-radius: 3px; }

.stream-card {
  flex: 0 0 300px;
  scroll-snap-align: start;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.stream-card:hover { transform: scale(1.02); border-color: var(--accent-orange); }

.stream-preview {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.stream-preview.local-stream video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stream-info {
  padding: 12px;
}

.stream-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stream-author {
  font-size: 13px;
  color: var(--text-secondary);
}

/* ===== ЧАТЫ ===== */
.chat-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 0.2s;
  cursor: pointer;
}

.chat-item:hover { border-color: var(--accent-purple); background: rgba(139, 92, 246, 0.1); }

.chat-avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-purple);
  flex-shrink: 0;
}

.chat-info { flex: 1; min-width: 0; }
.chat-name { font-weight: 600; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chat-preview { font-size: 13px; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.chat-window {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(21, 21, 40, 0.9);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.sent {
  align-self: flex-end;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 4px;
}

.chat-input-area {
  padding: 12px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
  background: rgba(21, 21, 40, 0.9);
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus { border-color: var(--accent-purple); }

/* ===== ПРОФИЛЬ ===== */
.profile-header {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.profile-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.3;
}

.profile-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.profile-avatar {
  width: 100px; height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent-purple);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
}

.profile-name {
  font-size: 24px;
  font-weight: 800;
  text-align: center;
}

.profile-username {
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
}

.profile-bio {
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
  max-width: 400px;
  line-height: 1.5;
  word-break: break-word;
}

.profile-stats {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}

.profile-stat {
  text-align: center;
}

.profile-stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-purple);
}

.profile-stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.profile-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

/* ===== КНОПКИ ===== */
.btn {
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-family: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
  color: white;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6); }

.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover { border-color: var(--accent-purple); }

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-follow {
  background: linear-gradient(135deg, var(--accent-orange), var(--accent-pink));
  color: white;
}

.btn-following {
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

/* ===== МОДАЛКИ ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 200;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s;
}

.modal-overlay.active { display: flex; }

.modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
}

.form-group {
  margin-bottom: 14px;
}

.form-label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
  font-weight: 500;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: var(--accent-purple);
}

.form-textarea { resize: vertical; min-height: 80px; }

.form-select option { background: var(--bg-secondary); }

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.modal-actions .btn { flex: 1; justify-content: center; }

/* ===== УВЕДОМЛЕНИЯ ===== */
.toast {
  position: fixed;
  top: calc(80px + var(--safe-top));
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  z-index: 300;
  animation: toastIn 0.3s ease-out;
  backdrop-filter: blur(20px);
  max-width: 90vw;
  text-align: center;
}

.toast.success { border-color: var(--success); }
.toast.error { border-color: var(--danger); }

@keyframes toastIn {
  from { opacity: 0; transform: translate(-50%, -20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

/* ===== ПУСТОЕ СОСТОЯНИЕ ===== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-state .empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state .empty-text {
  font-size: 16px;
  margin-bottom: 20px;
}

/* ===== ЗАГРУЗКА ===== */
.loader {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.loader-spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent-purple);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 600px) {
  .section { padding: 12px; }
  .section-title { font-size: 22px; }
  .media-grid { grid-template-columns: 1fr; }
  .media-card.large { grid-column: span 1; }
  .profile-stats { gap: 16px; }
  .profile-avatar { width: 80px; height: 80px; }
  .profile-name { font-size: 20px; }
  .stream-card { flex: 0 0 260px; }
}

@media (min-width: 1024px) {
  .media-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1920px) {
  body { font-size: 18px; }
  .section { max-width: 1200px; }
  .icon-btn { width: 48px; height: 48px; font-size: 22px; }
}

/* ===== РЕТРО-РЕЖИМ (кнопочные телефоны) ===== */
@media (max-width: 240px) {
  .aurora-bg, .magnetic-cursor, #particles-canvas { display: none !important; }
  body { background: white; color: black; }
  .media-card, .chat-item, .profile-header, .modal {
    background: white;
    border: 2px solid black;
    border-radius: 0;
  }
  .btn { border: 2px solid black; border-radius: 0; }
}

/* ===== ПАСХАЛКА ===== */
body.easter-egg {
  filter: hue-rotate(180deg) invert(1);
  transition: filter 0.5s;
}

/* ===== СКРОЛЛ-РЕВИЛ ===== */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== УТИЛИТЫ ===== */
.hidden { display: none !important; }
.text-center { text-align: center; }
.mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; }
.mb-2 { margin-bottom: 8px; }
.mb-4 { margin-bottom: 16px; }
.w-full { width: 100%; }
</style>
</head>
<body>

<!-- AURORA ФОН -->
<div class="aurora-bg">
  <div class="aurora-blob"></div>
  <div class="aurora-blob"></div>
  <div class="aurora-blob"></div>
</div>

<!-- ЧАСТИЦЫ -->
<canvas id="particles-canvas"></canvas>

<!-- МАГНИТНЫЙ КУРСОР -->
<div class="magnetic-cursor" id="magneticCursor"></div>

<!-- HEADER -->
<header class="app-header">
  <div class="logo" id="mainLogo">🎃 SpookyTok</div>
  <div class="header-actions">
    <button class="icon-btn" id="searchBtn" title="Поиск">🔍</button>
    <button class="icon-btn" id="notifBtn" title="Уведомления">🔔</button>
    <button class="avatar-btn" id="loginBtn" title="Профиль">👤</button>
  </div>
</header>

<!-- СЕКЦИЯ: ЛЕНТА -->
<section class="section active" id="section-feed">
  <h1 class="section-title reveal">🔥 Лента</h1>
  <div id="feed-container">
    <div class="loader"><div class="loader-spinner"></div></div>
  </div>
</section>

<!-- СЕКЦИЯ: СТРИМЫ -->
<section class="section" id="section-streams">
  <div class="streams-header">
    <h1 class="section-title" style="margin:0;">📺 Стримы</h1>
    <button class="btn btn-primary" id="startStreamBtn">+ Начать стрим</button>
  </div>
  <div class="mb-4">
    <span class="live-badge"><span class="live-dot"></span> LIVE Сейчас в эфире</span>
    <span id="liveCount" style="margin-left:12px;color:var(--text-secondary);">0 стримов</span>
  </div>
  <div id="streams-container">
    <div class="loader"><div class="loader-spinner"></div></div>
  </div>
</section>

<!-- СЕКЦИЯ: ЧАТЫ -->
<section class="section" id="section-chats">
  <h1 class="section-title reveal">💬 Чаты</h1>
  <div id="chats-container">
    <div class="loader"><div class="loader-spinner"></div></div>
  </div>
</section>

<!-- СЕКЦИЯ: ПРОФИЛЬ -->
<section class="section" id="section-profile">
  <div id="profile-container">
    <div class="loader"><div class="loader-spinner"></div></div>
  </div>
</section>

<!-- НИЖНЯЯ НАВИГАЦИЯ -->
<nav class="bottom-nav">
  <button class="nav-item active" data-section="feed">
    <span class="nav-icon">🏠</span>
    <span>Лента</span>
  </button>
  <button class="nav-item" data-section="streams">
    <span class="nav-icon">📺</span>
    <span>Стримы</span>
  </button>
  <button class="nav-item upload-btn" id="uploadBtn">
    <span class="nav-icon">+</span>
  </button>
  <button class="nav-item" data-section="chats">
    <span class="nav-icon">💬</span>
    <span>Чаты</span>
  </button>
  <button class="nav-item" data-section="profile">
    <span class="nav-icon">👤</span>
    <span>Профиль</span>
  </button>
</nav>

<!-- МОДАЛКА: ЗАГРУЗКА МЕДИА -->
<div class="modal-overlay" id="uploadModal">
  <div class="modal">
    <h2 class="modal-title">📤 Загрузить контент</h2>
    <div class="form-group">
      <label class="form-label">Тип</label>
      <select class="form-select" id="uploadType">
        <option value="video">🎬 Видео</option>
        <option value="photo">📷 Фото</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Файл</label>
      <input type="file" class="form-input" id="uploadFile" accept="video/*,image/*">
    </div>
    <div class="form-group">
      <label class="form-label">Описание</label>
      <textarea class="form-textarea" id="uploadCaption" placeholder="Расскажите жуткую историю..."></textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" id="cancelUpload">Отмена</button>
      <button class="btn btn-primary" id="confirmUpload">Загрузить</button>
    </div>
  </div>
</div>

<!-- МОДАЛКА: РЕДАКТИРОВАНИЕ ПРОФИЛЯ -->
<div class="modal-overlay" id="profileModal">
  <div class="modal">
    <h2 class="modal-title">✏️ Редактировать профиль</h2>
    <div class="form-group">
      <label class="form-label">Имя</label>
      <input type="text" class="form-input" id="editDisplayName" placeholder="Ваше имя">
    </div>
    <div class="form-group">
      <label class="form-label">Ник (латиница, _)</label>
      <input type="text" class="form-input" id="editUsername" placeholder="username">
    </div>
    <div class="form-group">
      <label class="form-label">О себе</label>
      <textarea class="form-textarea" id="editBio" placeholder="Расскажите о себе..."></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Эмодзи профиля</label>
      <select class="form-select" id="editProfileEmoji">
        <option value="👻">👻 Призрак</option>
        <option value="🎃">🎃 Тыква</option>
        <option value="🕷️">🕷️ Паук</option>
        <option value="🦇">🦇 Летучая мышь</option>
        <option value="🧛">🧛 Вампир</option>
        <option value="🧟">🧟 Зомби</option>
        <option value="💀">💀 Череп</option>
        <option value="⚰️">⚰️ Гроб</option>
        <option value="🕸️">🕸️ Паутина</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Цвет фона профиля</label>
      <input type="color" class="form-input" id="editBgColor" value="#1a1a2e">
    </div>
    <div class="form-group">
      <label class="form-label">URL фона (опционально)</label>
      <input type="url" class="form-input" id="editBgImageUrl" placeholder="https://...">
    </div>
    <div class="form-group">
      <label class="form-label">URL аватара</label>
      <input type="url" class="form-input" id="editAvatarUrl" placeholder="https://...">
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" id="cancelProfile">Отмена</button>
      <button class="btn btn-primary" id="saveProfile">Сохранить</button>
    </div>
  </div>
</div>

<!-- МОДАЛКА: СОЗДАНИЕ СТРИМА (ЭКРАН/КАМЕРА) -->
<div class="modal-overlay" id="streamModal">
  <div class="modal">
    <h2 class="modal-title">📺 Начать стрим</h2>
    <div class="form-group">
      <label class="form-label">Тип стрима</label>
      <select class="form-select" id="streamType">
        <option value="screen">🖥️ Демонстрация экрана</option>
        <option value="camera">📹 Камера</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Название</label>
      <input type="text" class="form-input" id="streamTitle" placeholder="Жуткий стрим...">
    </div>
    <div class="form-group">
      <label class="form-label">Описание</label>
      <textarea class="form-textarea" id="streamDescription" placeholder="О чём стрим?"></textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" id="cancelStream">Отмена</button>
      <button class="btn btn-primary" id="confirmStream">Запустить</button>
    </div>
  </div>
</div>

<!-- МОДАЛКА: ПОИСК -->
<div class="modal-overlay" id="searchModal">
  <div class="modal">
    <h2 class="modal-title">🔎 Поиск</h2>
    <div class="form-group">
      <input type="text" class="form-input" id="searchInput" placeholder="Поиск по контенту и пользователям...">
    </div>
    <div id="searchResults"></div>
    <div class="modal-actions">
      <button class="btn btn-secondary w-full" id="closeSearch">Закрыть</button>
    </div>
  </div>
</div>

<script>
// ============================================
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ============================================
const state = {
  user: null,
  currentSection: 'feed',
  currentChat: null,
  chatPollInterval: null,
  easterEggClicks: 0,
  feedLoaded: false,
  streamsLoaded: false,
  localStream: null,
  currentStreamId: null
};

// ============================================
// УТИЛИТЫ
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function openModal(id) { $('#' + id).classList.add('active'); }
function closeModal(id) { $('#' + id).classList.remove('active'); }

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function timeAgo(ts) {
  const time = typeof ts === 'number' ? ts : new Date(ts).getTime();
  if (isNaN(time)) return '';
  const diff = Date.now() - time;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'только что';
  if (mins < 60) return mins + ' мин назад';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + ' ч назад';
  const days = Math.floor(hours / 24);
  if (days < 7) return days + ' дн назад';
  return new Date(time).toLocaleDateString('ru-RU');
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ============================================
// API ЗАПРОСЫ
// ============================================
async function api(url, options = {}) {
  const token = localStorage.getItem('session_token');
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
      ...options.headers
    }
  });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { error: 'Неверный ответ сервера' };
  }
  if (!res.ok) throw new Error(data.error || 'Ошибка ' + res.status);
  return data;
}

const apiGet = (url) => api(url);
const apiPost = (url, body) => api(url, { method: 'POST', body: JSON.stringify(body) });
const apiPut = (url, body) => api(url, { method: 'PUT', body: JSON.stringify(body) });
const apiDelete = (url) => api(url, { method: 'DELETE' });

// ============================================
// SCROLL REVEAL
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function initScrollReveal() {
  $$('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

// ============================================
// НАВИГАЦИЯ
// ============================================
function switchSection(sectionName) {
  state.currentSection = sectionName;
  $$('.section').forEach(s => s.classList.remove('active'));
  $('#section-' + sectionName).classList.add('active');
  $$('.nav-item[data-section]').forEach(n => n.classList.remove('active'));
  const navBtn = document.querySelector('.nav-item[data-section="' + sectionName + '"]');
  if (navBtn) navBtn.classList.add('active');

  if (sectionName === 'feed') loadFeed();
  else if (sectionName === 'streams') loadStreams();
  else if (sectionName === 'chats') loadChats();
  else if (sectionName === 'profile') loadMyProfile();

  if (sectionName !== 'chats' && state.chatPollInterval) {
    clearInterval(state.chatPollInterval);
    state.chatPollInterval = null;
  }

  setTimeout(initScrollReveal, 100);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$$('.nav-item[data-section]').forEach(btn => {
  btn.addEventListener('click', () => switchSection(btn.dataset.section));
});

// ============================================
// АВТОРИЗАЦИЯ
// ============================================
async function checkAuth() {
  const token = localStorage.getItem('session_token');
  if (!token) return;
  try {
    const profile = await apiGet('/api/profile?id=' + (JSON.parse(localStorage.getItem('user_data')||'{}').id || ''));
    if (profile && profile.id) {
      state.user = profile;
      updateAuthUI();
    }
  } catch (e) {}
  loadFeed();
}

function updateAuthUI() {
  const loginBtn = $('#loginBtn');
  if (state.user) {
    const avatarUrl = state.user.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    loginBtn.innerHTML = '<img src="' + escapeHtml(avatarUrl) + '" alt="avatar">';
    loginBtn.onclick = (e) => { e.preventDefault(); switchSection('profile'); };
  }
}

// ============================================
// ЛЕНТА
// ============================================
async function loadFeed(force = false) {
  const container = $('#feed-container');
  if (state.feedLoaded && !force) {
    setTimeout(initScrollReveal, 100);
    initMediaVideoHover();
    return;
  }
  container.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';
  try {
    const data = await apiGet('/api/media/feed?limit=20');
    state.feedLoaded = true;
    if (!data.items || data.items.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">👻</div><div class="empty-text">Лента пуста. Загрузите первый контент!</div></div>';
      return;
    }
    container.innerHTML = '<div class="media-grid">' + data.items.map(renderMediaCard).join('') + '</div>';
    initMediaActions();
    initMediaVideoHover();
    setTimeout(initScrollReveal, 50);
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">😱</div><div class="empty-text">Ошибка загрузки: ' + escapeHtml(e.message) + '</div></div>';
  }
}

function renderMediaCard(item) {
  const previewUrl = '/api/media/' + item.id;
  const isVideo = item.type === 'video';
  const authorAvatar = item.author_avatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  const authorName = item.author_name || 'Аноним';
  const canDelete = state.user && (state.user.id === item.user_id);

  return '<div class="media-card reveal">' +
    '<div class="media-preview">' +
      (isVideo
        ? '<video src="' + previewUrl + '" muted loop playsinline preload="metadata"></video>'
        : '<img src="' + previewUrl + '" alt="media" loading="lazy">') +
      '<span class="media-type-badge">' + (isVideo ? '🎬 Видео' : '📷 Фото') + '</span>' +
    '</div>' +
    '<div class="media-info">' +
      '<div class="media-author">' +
        '<img src="' + escapeHtml(authorAvatar) + '" alt="avatar">' +
        '<span>' + escapeHtml(authorName) + '</span>' +
      '</div>' +
      (item.caption ? '<div class="media-caption">' + escapeHtml(item.caption) + '</div>' : '') +
      '<div class="media-actions">' +
        '<button class="media-action like-btn" data-id="' + item.id + '">❤️ <span>' + (item.likes_count || 0) + '</span></button>' +
        '<button class="media-action comment-btn" data-id="' + item.id + '">💬 <span>' + (item.comments_count || 0) + '</span></button>' +
        '<button class="media-action save-btn" data-id="' + item.id + '">🔖 <span>' + (item.saves_count || 0) + '</span></button>' +
        (canDelete ? '<button class="media-action delete-btn" data-id="' + item.id + '">🗑️</button>' : '') +
      '</div>' +
    '</div>' +
  '</div>';
}

function initMediaActions() {
  $$('.like-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!state.user) { showToast('Нужно войти', 'error'); return; }
      try {
        await apiPost('/api/media/' + btn.dataset.id + '/like');
        const span = btn.querySelector('span');
        const current = parseInt(span.textContent) || 0;
        span.textContent = current + 1;
        btn.classList.add('liked');
      } catch (e) { showToast('Ошибка: ' + e.message, 'error'); }
    });
  });

  $$('.save-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!state.user) { showToast('Нужно войти', 'error'); return; }
      try {
        await apiPost('/api/media/' + btn.dataset.id + '/save');
        const span = btn.querySelector('span');
        const current = parseInt(span.textContent) || 0;
        span.textContent = current + 1;
        btn.classList.add('saved');
      } catch (e) { showToast('Ошибка: ' + e.message, 'error'); }
    });
  });

  $$('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Удалить этот контент?')) return;
      try {
        await apiDelete('/api/media/' + btn.dataset.id);
        showToast('Удалено');
        btn.closest('.media-card').remove();
      } catch (e) { showToast('Ошибка: ' + e.message, 'error'); }
    });
  });

  $$('.comment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Комментарии скоро!', 'success');
    });
  });
}

function initMediaVideoHover() {
  $$('.media-card').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    card.addEventListener('mouseenter', () => { video.play().catch(() => {}); });
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
}

// ============================================
// СТРИМЫ (ЭКРАН/КАМЕРА, БЕЗ YOUTUBE)
// ============================================
async function loadStreams() {
  const container = $('#streams-container');
  container.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';
  try {
    const data = await apiGet('/api/streams');
    const count = data.items ? data.items.length : 0;
    $('#liveCount').textContent = count + (count === 1 ? ' стрим' : ' стримов');
    if (!data.items || count === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">📺</div><div class="empty-text">Нет активных стримов. Начните свой!</div></div>';
      return;
    }
    container.innerHTML = '<div class="streams-scroll">' + data.items.map(renderStreamCard).join('') + '</div>';
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><div class="empty-text">Ошибка: ' + escapeHtml(e.message) + '</div></div>';
  }
}

function renderStreamCard(stream) {
  const typeIcon = stream.type === 'screen' ? '🖥️' : '📹';
  const authorName = stream.author_name || 'Стример';
  return '<div class="stream-card reveal" data-stream-id="' + stream.id + '">' +
    '<div class="stream-preview">' +
      '<div style="text-align:center;padding:20px;">' +
        '<div style="font-size:48px;margin-bottom:10px;">' + typeIcon + '</div>' +
        '<div>Прямой эфир</div>' +
        '<div style="font-size:12px;color:var(--text-secondary);margin-top:5px;">' + escapeHtml(stream.type === 'screen' ? 'Демонстрация экрана' : 'Камера') + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="stream-info">' +
      '<div class="stream-title">' + escapeHtml(stream.title || 'Без названия') + '</div>' +
      '<div class="stream-author">' + escapeHtml(authorName) + '</div>' +
    '</div>' +
  '</div>';
}

$('#startStreamBtn').addEventListener('click', () => {
  if (!state.user) { showToast('Нужно войти', 'error'); return; }
  openModal('streamModal');
});

$('#confirmStream').addEventListener('click', async () => {
  const type = $('#streamType').value;
  const title = $('#streamTitle').value.trim();
  const description = $('#streamDescription').value.trim();
  if (!title) { showToast('Заполните название', 'error'); return; }
  try {
    const data = await apiPost('/api/streams', { type, title, description });
    showToast('Стрим создан! Запускаем...', 'success');
    closeModal('streamModal');
    await startLocalStream(type);
    state.currentStreamId = data.stream_id;
    state.streamsLoaded = false;
    loadStreams();
  } catch (e) { showToast('Ошибка: ' + e.message, 'error'); }
});

$('#cancelStream').addEventListener('click', () => closeModal('streamModal'));

async function startLocalStream(type) {
  try {
    const opts = type === 'screen' 
      ? { video: { cursor: 'always' }, audio: true } 
      : { video: true, audio: true };
    const stream = type === 'screen' 
      ? await navigator.mediaDevices.getDisplayMedia(opts) 
      : await navigator.mediaDevices.getUserMedia(opts);
    
    state.localStream = stream;
    
    // Показываем локальное превью в карточке стрима
    const preview = document.createElement('div');
    preview.className = 'stream-preview local-stream';
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.srcObject = stream;
    preview.appendChild(video);
    
    // Заменяем превью в первой карточке (своего стрима)
    const myStreamCard = document.querySelector('.stream-card[data-stream-id="' + state.currentStreamId + '"] .stream-preview');
    if (myStreamCard) {
      myStreamCard.innerHTML = '';
      myStreamCard.appendChild(video);
      myStreamCard.classList.add('local-stream');
    }
    
    showToast('🔴 Стрим запущен (локально)', 'success');
  } catch (e) {
    showToast('❌ ' + (e.name === 'NotAllowedError' ? 'Разрешите доступ' : e.message), 'error');
  }
}

async function stopLocalStream() {
  if (state.localStream) {
    state.localStream.getTracks().forEach(t => t.stop());
    state.localStream = null;
  }
  if (state.currentStreamId) {
    try { await apiPost('/api/streams/' + state.currentStreamId + '/end'); } catch {}
    state.currentStreamId = null;
  }
  showToast('⏹️ Стрим остановлен', 'info');
  loadStreams();
}

// ============================================
// ЧАТЫ
// ============================================
async function loadChats() {
  const container = $('#chats-container');
  if (state.currentChat) {
    renderChatWindow(state.currentChat);
    return;
  }
  if (!state.user) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">💬</div><div class="empty-text">Войдите, чтобы общаться</div></div>';
    return;
  }
  container.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';
  try {
    // Заглушка: чаты пока не реализованы на бэкенде
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">💬</div><div class="empty-text">Чаты скоро! Следите за обновлениями 👻</div></div>';
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><div class="empty-text">Ошибка: ' + escapeHtml(e.message) + '</div></div>';
  }
}

function renderChatItem(chat) {
  const displayName = chat.other_user_display_name || chat.other_user_name || ('Пользователь ' + (chat.other_user_id || '').substring(0, 8));
  const avatarUrl = chat.other_user_avatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  return '<div class="chat-item" ' +
    'data-chat-id="' + escapeHtml(chat.id) + '" ' +
    'data-other-user-id="' + escapeHtml(chat.other_user_id) + '" ' +
    'data-other-user-name="' + escapeHtml(displayName) + '" ' +
    'data-other-user-avatar="' + escapeHtml(avatarUrl) + '">' +
    '<img class="chat-avatar" src="' + escapeHtml(avatarUrl) + '" alt="avatar">' +
    '<div class="chat-info">' +
      '<div class="chat-name">' + escapeHtml(displayName) + '</div>' +
      '<div class="chat-preview">Нажмите, чтобы открыть чат</div>' +
    '</div>' +
  '</div>';
}

async function renderChatWindow(chat) {
  const container = $('#chats-container');
  const avatarUrl = chat.otherUserAvatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  container.innerHTML = '<div class="chat-window">' +
    '<div class="chat-header">' +
      '<button class="icon-btn" id="backToChats">←</button>' +
      '<img class="chat-avatar" src="' + escapeHtml(avatarUrl) + '" alt="avatar" style="width:36px;height:36px;">' +
      '<div class="chat-info"><div class="chat-name">' + escapeHtml(chat.otherUserName || 'Чат') + '</div></div>' +
    '</div>' +
    '<div class="chat-messages" id="chatMessages">' +
      '<div class="empty-state" style="padding:20px;"><div class="empty-text">Чаты скоро! 👻</div></div>' +
    '</div>' +
    '<div class="chat-input-area">' +
      '<input type="text" class="chat-input" id="chatInput" placeholder="Чаты в разработке..." disabled>' +
      '<button class="btn btn-primary" id="sendMessageBtn" disabled>➤</button>' +
    '</div>' +
  '</div>';
  $('#backToChats').addEventListener('click', () => {
    state.currentChat = null;
    if (state.chatPollInterval) clearInterval(state.chatPollInterval);
    loadChats();
  });
}

// ============================================
// ПРОФИЛЬ
// ============================================
async function loadMyProfile() {
  const container = $('#profile-container');
  if (!state.user) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">👤</div><div class="empty-text">Войдите, чтобы увидеть профиль</div></div>';
    return;
  }
  container.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';
  try {
    const profile = await apiGet('/api/profile?id=' + state.user.id);
    state.user = profile;
    updateAuthUI();
    container.innerHTML = renderProfile(profile, true);
    initProfileActions(profile);
    setTimeout(initScrollReveal, 100);
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><div class="empty-text">Ошибка: ' + escapeHtml(e.message) + '</div></div>';
  }
}

function renderProfile(profile, isMe) {
  const bgStyle = profile.bg_image_url
    ? 'background-image:url(' + escapeHtml(profile.bg_image_url) + ');'
    : 'background-color:' + (profile.bg_color || '#1a1a2e') + ';';
  const avatarUrl = profile.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  const displayName = (profile.profile_emoji || '') + ' ' + (profile.name || profile.username || '');
  return '<div class="profile-header" style="' + bgStyle + '">' +
    '<div class="profile-bg" style="' + bgStyle + '"></div>' +
    '<div class="profile-content">' +
      '<img class="profile-avatar" src="' + escapeHtml(avatarUrl) + '" alt="avatar">' +
      '<div class="profile-name">' + escapeHtml(displayName.trim()) + '</div>' +
      '<div class="profile-username">@' + escapeHtml(profile.username || '') + '</div>' +
      (profile.bio ? '<div class="profile-bio">' + escapeHtml(profile.bio) + '</div>' : '') +
      '<div class="profile-stats">' +
        '<div class="profile-stat"><div class="profile-stat-value">' + (profile.stats?.media || 0) + '</div><div class="profile-stat-label">постов</div></div>' +
        '<div class="profile-stat"><div class="profile-stat-value">' + (profile.stats?.likes || 0) + '</div><div class="profile-stat-label">лайков</div></div>' +
        '<div class="profile-stat"><div class="profile-stat-value">' + (profile.stats?.live_streams || 0) + '</div><div class="profile-stat-label">стримов</div></div>' +
      '</div>' +
      (isMe ? '<div class="profile-actions"><button class="btn btn-primary" id="editProfileBtn">✏️ Редактировать</button></div>' : '') +
    '</div>' +
  '</div>' +
  '<h2 class="section-title">Мои посты</h2>' +
  '<div id="profile-media"></div>';
}

function initProfileActions(profile) {
  const editBtn = $('#editProfileBtn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      $('#editDisplayName').value = profile.name || '';
      $('#editUsername').value = profile.username || '';
      $('#editBio').value = profile.bio || '';
      $('#editProfileEmoji').value = profile.profile_emoji || '👻';
      $('#editBgColor').value = profile.bg_color || '#1a1a2e';
      $('#editBgImageUrl').value = profile.bg_image_url || '';
      $('#editAvatarUrl').value = profile.avatar_url || '';
      openModal('profileModal');
    });
  }
}

$('#saveProfile').addEventListener('click', async () => {
  try {
    await apiPut('/api/profile', {
      name: $('#editDisplayName').value.trim(),
      bio: $('#editBio').value.trim(),
      avatar_url: $('#editAvatarUrl').value.trim(),
      profile_emoji: $('#editProfileEmoji').value,
      bg_color: $('#editBgColor').value,
      bg_image_url: $('#editBgImageUrl').value.trim()
    });
    const newUsername = $('#editUsername').value.trim();
    if (newUsername && state.user && newUsername !== state.user.username) {
      // username пока не меняется через API
    }
    showToast('Профиль обновлён!');
    closeModal('profileModal');
    state.user = null;
    await checkAuth();
    loadMyProfile();
  } catch (e) { showToast('Ошибка: ' + e.message, 'error'); }
});

$('#cancelProfile').addEventListener('click', () => closeModal('profileModal'));

// ============================================
// ЗАГРУЗКА МЕДИА
// ============================================
$('#uploadBtn').addEventListener('click', () => {
  if (!state.user) { showToast('Нужно войти', 'error'); return; }
  openModal('uploadModal');
});

$('#confirmUpload').addEventListener('click', async () => {
  const file = $('#uploadFile').files[0];
  const caption = $('#uploadCaption').value.trim();
  const type = $('#uploadType').value;
  if (!file) { showToast('Выберите файл', 'error'); return; }
  const maxMb = type === 'video' ? 3 : 0.5;
  const maxBytes = maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    showToast('Файл слишком большой (макс ' + maxMb + ' МБ)', 'error');
    return;
  }
  const btn = $('#confirmUpload');
  btn.disabled = true;
  btn.textContent = 'Загрузка...';
  try {
    const base64 = await fileToBase64(file);
    await apiPost('/api/media/upload', {
      type,
      mime: file.type,
      base64: base64.split(',')[1],
      caption
    });
    showToast('Загружено!');
    closeModal('uploadModal');
    $('#uploadFile').value = '';
    $('#uploadCaption').value = '';
    state.feedLoaded = false;
    switchSection('feed');
  } catch (e) {
    showToast('Ошибка: ' + e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Загрузить';
  }
});

$('#cancelUpload').addEventListener('click', () => closeModal('uploadModal'));

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsDataURL(file);
  });
}

// ============================================
// ПОИСК
// ============================================
$('#searchBtn').addEventListener('click', () => {
  openModal('searchModal');
  setTimeout(() => $('#searchInput').focus(), 100);
});
$('#closeSearch').addEventListener('click', () => {
  closeModal('searchModal');
  $('#searchInput').value = '';
  $('#searchResults').innerHTML = '';
});

const debouncedSearch = debounce(async (q) => {
  const results = $('#searchResults');
  if (!q) { results.innerHTML = ''; return; }
  try {
    // Заглушка: поиск пока не реализован
    results.innerHTML = '<div class="empty-state mt-4"><div class="empty-text">Поиск в разработке 👻</div></div>';
  } catch (e) {
    results.innerHTML = '<div class="empty-state"><div class="empty-text">Ошибка поиска</div></div>';
  }
}, 400);

$('#searchInput').addEventListener('input', (e) => {
  debouncedSearch(e.target.value.trim());
});

// ============================================
// ЧАСТИЦЫ НА CANVAS
// ============================================
const canvas = $('#particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle(x, y) {
  const emojis = ['👻', '🎃', '🕷️', '💀', '🦇'];
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4 - 2,
    life: 1,
    decay: 0.02 + Math.random() * 0.02,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    size: 16 + Math.random() * 16
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life -= p.decay;
    ctx.globalAlpha = p.life;
    ctx.font = p.size + 'px sans-serif';
    ctx.fillText(p.emoji, p.x, p.y);
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.modal-overlay, .chat-input, .form-input, .form-textarea')) return;
  for (let i = 0; i < 6; i++) createParticle(e.clientX, e.clientY);
});

// ============================================
// МАГНИТНЫЙ КУРСОР
// ============================================
const cursor = $('#magneticCursor');
let cursorX = 0, cursorY = 0;
let targetX = 0, targetY = 0;

document.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function updateCursor() {
  cursorX += (targetX - cursorX) * 0.15;
  cursorY += (targetY - cursorY) * 0.15;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(updateCursor);
}
updateCursor();

document.addEventListener('mouseover', (e) => {
  if (e.target.matches('button, a, .media-card, .chat-item, .icon-btn, input, textarea, select')) {
    cursor.classList.add('active');
  }
});
document.addEventListener('mouseout', (e) => {
  if (e.target.matches('button, a, .media-card, .chat-item, .icon-btn, input, textarea, select')) {
    cursor.classList.remove('active');
  }
});

// ============================================
// ПАСХАЛКА (5 кликов на логотип)
// ============================================
$('#mainLogo').addEventListener('click', () => {
  state.easterEggClicks++;
  if (state.easterEggClicks >= 5) {
    document.body.classList.toggle('easter-egg');
    state.easterEggClicks = 0;
    for (let i = 0; i < 30; i++) {
      createParticle(window.innerWidth / 2, window.innerHeight / 2);
    }
    showToast(document.body.classList.contains('easter-egg') ? '🎃 Пасхалка активирована!' : '🔄 Возвращаем в нормальный режим');
  }
  setTimeout(() => { state.easterEggClicks = Math.max(0, state.easterEggClicks - 1); }, 2000);
});

// ============================================
// ГЛИТЧ ПРИ БЫСТРОМ СКРОЛЛЕ
// ============================================
let lastScrollY = 0;
let scrollVelocity = 0;
let glitchTimeout;

window.addEventListener('scroll', () => {
  const delta = Math.abs(window.scrollY - lastScrollY);
  scrollVelocity = delta;
  lastScrollY = window.scrollY;
  if (scrollVelocity > 50 && !document.body.classList.contains('easter-egg')) {
    document.body.style.filter = 'hue-rotate(' + (Math.random() * 20 - 10) + 'deg)';
    clearTimeout(glitchTimeout);
    glitchTimeout = setTimeout(() => { document.body.style.filter = ''; }, 100);
  }
});

// ============================================
// ЗАКРЫТИЕ МОДАЛОК
// ============================================
$$('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $$('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  }
});

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initScrollReveal();
  if (window.location.hash && window.location.hash.startsWith('#')) {
    const section = window.location.hash.substring(1);
    if (['feed', 'streams', 'chats', 'profile'].includes(section)) {
      setTimeout(() => switchSection(section), 100);
    }
  }
});

console.log('%c🎃 SpookyTok', 'font-size:32px;font-weight:bold;background:linear-gradient(135deg,#8b5cf6,#f97316);color:white;padding:10px 20px;border-radius:10px;');
console.log('%cЖуткие истории в TikTok-стиле', 'font-size:14px;color:#a0a0c0;');
</script>
</body>
</html>`;

export default INDEX_HTML;
