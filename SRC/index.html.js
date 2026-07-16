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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

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
  width: 400px;
  height: 400px;
  background: var(--accent-purple);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.aurora-blob:nth-child(2) {
  width: 350px;
  height: 350px;
  background: var(--accent-orange);
  top: 40%;
  right: -100px;
  animation-delay: -7s;
}

.aurora-blob:nth-child(3) {
  width: 300px;
  height: 300px;
  background: var(--accent-cyan);
  bottom: -100px;
  left: 30%;
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
  width: 20px;
  height: 20px;
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
  width: 40px;
  height: 40px;
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

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.icon-btn {
  width: 40px;
  height: 40px;
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
  width: 40px;
  height: 40px;
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

.avatar-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== НАВИГАЦИЯ ===== */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
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
  width: 44px;
  height: 44px;
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

/* ===== КАРТОЧКИ МЕДИА ===== */
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
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  font-size: 12px;
  backdrop-filter: blur(10px);
  color: white;
}

.media-info { padding: 12px; }

.media-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.media-author img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;
}

.media-author img:hover { transform: scale(1.1); }

.media-author span {
  cursor: pointer;
  transition: color 0.2s;
}

.media-author span:hover {
  color: var(--accent-purple);
  text-decoration: underline;
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

.media-action:hover {
  background: rgba(139, 92, 246, 0.2);
  color: var(--accent-purple);
}

.media-action.liked { color: var(--accent-pink); }
.media-action.saved { color: var(--accent-orange); }
.media-action.delete-btn { color: var(--danger) !important; margin-left: auto; }

/* ===== КНОПКА ЧАТА С АВТОРОМ ===== */
.chat-with-author-btn {
  background: var(--accent-purple);
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
}

.chat-with-author-btn:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

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
  width: 8px;
  height: 8px;
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
.streams-scroll::-webkit-scrollbar-thumb {
  background: var(--accent-purple);
  border-radius: 3px;
}

.stream-card {
  flex: 0 0 300px;
  scroll-snap-align: start;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
}

.stream-card:hover {
  transform: scale(1.02);
  border-color: var(--accent-orange);
}

.stream-preview {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  position: relative;
  overflow: hidden;
}

.stream-preview iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Превью стрима (с картинкой) */
.stream-thumb {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-color: #000;
}

.stream-thumb-play {
  width: 60px;
  height: 60px;
  background: rgba(239, 68, 68, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s;
}

.stream-thumb:hover .stream-thumb-play { transform: scale(1.1); }

.stream-live-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

/* Плейсхолдер когда нет превью */
.stream-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e, #0a0a1a);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.stream-placeholder:hover {
  background: linear-gradient(135deg, #2a2a3e, #1a1a2e);
}

.stream-placeholder-content {
  text-align: center;
}

.stream-placeholder-emoji {
  font-size: 64px;
  margin-bottom: 8px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.stream-placeholder-text {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 600;
}

/* Кнопка удаления стрима */
.stream-delete-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  z-index: 10;
  backdrop-filter: blur(10px);
  transition: all 0.2s;
}

.stream-delete-btn:hover {
  background: rgba(220, 38, 38, 1);
  transform: scale(1.05);
}

.stream-info { padding: 12px; }

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

.chat-item:hover {
  border-color: var(--accent-purple);
  background: rgba(139, 92, 246, 0.1);
}

.chat-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-purple);
  flex-shrink: 0;
}

.chat-info { flex: 1; min-width: 0; }

.chat-name {
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-preview {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

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
  width: 100px;
  height: 100px;
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

.profile-stat { text-align: center; }

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

.profile-tabs {
  display: flex;
  gap: 12px;
  margin: 20px 0 16px;
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

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover { border-color: var(--accent-purple); }

.btn-danger { background: var(--danger); color: white; }

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

.form-group { margin-bottom: 14px; }

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
  width: 40px;
  height: 40px;
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

/* ===== РЕТРО-РЕЖИМ ===== */
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

/* ===== SCROLL REVEAL ===== */
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
    <a href="/auth/github" class="avatar-btn" id="loginBtn" title="Войти через GitHub">
      <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Login">
    </a>
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

<!-- МОДАЛКА: СОЗДАНИЕ СТРИМА -->
<div class="modal-overlay" id="streamModal">
  <div class="modal">
    <h2 class="modal-title">📺 Начать стрим</h2>
    <div class="form-group">
      <label class="form-label">Название</label>
      <input type="text" class="form-input" id="streamTitle" placeholder="Жуткий стрим...">
    </div>
    <div class="form-group">
      <label class="form-label">Описание</label>
      <textarea class="form-textarea" id="streamDescription" placeholder="О чём стрим?"></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">URL стрима (YouTube/Twitch/Vimeo)</label>
      <input type="url" class="form-input" id="streamUrl" placeholder="https://youtube.com/watch?v=...">
    </div>
    <div class="form-group">
      <label class="form-label">URL превью (опционально)</label>
      <input type="url" class="form-input" id="streamThumbnail" placeholder="https://...">
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
  feedLoaded: false
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
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
  try {
    const profile = await apiGet('/api/profile/me');
    state.user = profile;
    updateAuthUI();
  } catch (e) {
    state.user = null;
  }
  loadFeed();
}

function updateAuthUI() {
  const loginBtn = $('#loginBtn');
  if (state.user) {
    const avatarUrl = state.user.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    loginBtn.href = '#profile';
    loginBtn.onclick = (e) => { e.preventDefault(); switchSection('profile'); };
    loginBtn.innerHTML = '<img src="' + escapeHtml(avatarUrl) + '" alt="avatar">';
  }
}

function isAdmin() {
  return state.user && (
    (state.user.username || '').toLowerCase() === 'negr' ||
    (state.user.name || '').toLowerCase() === 'negr'
  );
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
  const canDelete = state.user && (state.user.user_id === item.user_id || isAdmin());
  const showChatBtn = state.user && authorName !== 'Аноним' && authorName !== state.user.username && authorName !== state.user.name;

  return '<div class="media-card reveal">' +
    '<div class="media-preview">' +
      (isVideo
        ? '<video src="' + previewUrl + '" muted loop playsinline preload="metadata"></video>'
        : '<img src="' + previewUrl + '" alt="media" loading="lazy">') +
      '<span class="media-type-badge">' + (isVideo ? '🎬 Видео' : '📷 Фото') + '</span>' +
    '</div>' +
    '<div class="media-info">' +
      '<div class="media-author">' +
        '<img src="' + escapeHtml(authorAvatar) + '" alt="avatar" data-username="' + escapeHtml(authorName) + '">' +
        '<span data-username="' + escapeHtml(authorName) + '">' + escapeHtml(authorName) + '</span>' +
        (showChatBtn ? '<button class="chat-with-author-btn" data-username="' + escapeHtml(authorName) + '" title="Написать автору">💬 Чат</button>' : '') +
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
        const data = await apiPost('/api/media/' + btn.dataset.id + '/like');
        const span = btn.querySelector('span');
        const current = parseInt(span.textContent) || 0;
        span.textContent = current + (data.liked ? 1 : -1);
        btn.classList.toggle('liked', data.liked);
      } catch (e) { showToast('Ошибка: ' + e.message, 'error'); }
    });
  });

  $$('.save-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!state.user) { showToast('Нужно войти', 'error'); return; }
      try {
        const data = await apiPost('/api/media/' + btn.dataset.id + '/save');
        const span = btn.querySelector('span');
        const current = parseInt(span.textContent) || 0;
        span.textContent = current + (data.saved ? 1 : -1);
        btn.classList.toggle('saved', data.saved);
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
      if (!state.user) { showToast('Нужно войти', 'error'); return; }
      openCommentsModal(btn.dataset.id);
    });
  });

  // Кнопки чата с автором
  $$('.chat-with-author-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openChatWith(btn.dataset.username);
    });
  });

  // Клик по имени автора
  $$('.media-author span').forEach(span => {
    span.addEventListener('click', (e) => {
      e.stopPropagation();
      const username = span.dataset.username;
      if (username && username !== 'Аноним') {
        openChatWith(username);
      }
    });
  });

  // Клик по аватару автора
  $$('.media-author img').forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      const username = img.dataset.username;
      if (username && username !== 'Аноним') {
        openChatWith(username);
      }
    });
  });
}

// ============================================
// КОММЕНТАРИИ
// ============================================
async function openCommentsModal(mediaId) {
  let modal = $('#commentsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'commentsModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = \`
      <div class="modal" style="max-height:80vh;">
        <h2 class="modal-title">💬 Комментарии</h2>
        <div id="commentsList" style="max-height:50vh;overflow-y:auto;margin-bottom:14px;"></div>
        <div style="display:flex;gap:8px;">
          <input type="text" class="form-input" id="commentInput" placeholder="Написать комментарий..." maxlength="500" style="flex:1;">
          <button class="btn btn-primary" id="sendCommentBtn">➤</button>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary w-full" id="closeComments">Закрыть</button>
        </div>
      </div>\`;
    document.body.appendChild(modal);

    $('#closeComments').addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  modal.dataset.mediaId = mediaId;
  modal.classList.add('active');
  await loadComments(mediaId);

  const send = async () => {
    const input = $('#commentInput');
    const text = input.value.trim();
    if (!text) return;
    try {
      await apiPost('/api/media/' + mediaId + '/comment', { text });
      input.value = '';
      await loadComments(mediaId);
      const counter = document.querySelector('.comment-btn[data-id="' + mediaId + '"] span');
      if (counter) counter.textContent = parseInt(counter.textContent) + 1;
    } catch (e) { showToast('Ошибка: ' + e.message, 'error'); }
  };

  $('#sendCommentBtn').onclick = send;
  $('#commentInput').onkeypress = (e) => { if (e.key === 'Enter') send(); };
  setTimeout(() => $('#commentInput').focus(), 100);
}

async function loadComments(mediaId) {
  const list = $('#commentsList');
  list.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';
  try {
    const data = await apiGet('/api/media/' + mediaId + '/comments');
    if (!data.items || data.items.length === 0) {
      list.innerHTML = '<div class="empty-state" style="padding:20px;"><div class="empty-text">Пока нет комментариев</div></div>';
      return;
    }
    list.innerHTML = data.items.map(c => {
      const avatar = c.author_avatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
      const name = c.author_name || 'Аноним';
      const isMe = state.user && state.user.user_id === c.user_id;
      const showChatBtn = state.user && name !== 'Аноним' && !isMe;

      return '<div style="display:flex;gap:10px;padding:10px;border-bottom:1px solid var(--border);">' +
        '<img src="' + escapeHtml(avatar) + '" style="width:32px;height:32px;border-radius:50%;flex-shrink:0;object-fit:cover;">' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="display:flex;align-items:center;gap:8px;font-weight:600;font-size:13px;">' +
            '<span>' + escapeHtml(name) +
              (isMe ? ' <span style="color:var(--accent-purple);font-size:11px;">(вы)</span>' : '') +
            '</span>' +
            (showChatBtn ? '<button class="chat-with-author-btn" data-username="' + escapeHtml(name) + '" style="background:var(--accent-purple);color:white;border:none;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600;cursor:pointer;">💬</button>' : '') +
          '</div>' +
          '<div style="font-size:14px;margin-top:2px;word-break:break-word;">' + escapeHtml(c.text) + '</div>' +
          '<div style="font-size:11px;color:var(--text-secondary);margin-top:4px;">' + timeAgo(c.created_at) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    // Обработчики на кнопки чата в комментариях
    list.querySelectorAll('.chat-with-author-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openChatWith(btn.dataset.username);
      });
    });
  } catch (e) {
    list.innerHTML = '<div class="empty-state"><div class="empty-text">Ошибка загрузки</div></div>';
  }
}

function initMediaVideoHover() {
  $$('.media-card').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

// ============================================
// СТРИМЫ
// ============================================
function extractYouTubeId(url) {
  if (!url) return null;
  const m1 = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (m1) return m1[1];
  const m2 = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (m2) return m2[1];
  const m3 = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (m3) return m3[1];
  const m4 = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (m4) return m4[1];
  return null;
}

function toEmbedUrl(url) {
  if (!url) return '';
  const yid = extractYouTubeId(url);
  if (yid) return 'https://www.youtube.com/embed/' + yid + '?autoplay=1&rel=0';

  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return 'https://player.vimeo.com/video/' + vm[1] + '?autoplay=1';

  const tw = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
  if (tw && !url.includes('/videos/') && !url.includes('/clip/')) {
    const parent = location.hostname || 'localhost';
    return 'https://player.twitch.tv/?channel=' + tw[1] + '&parent=' + parent + '&autoplay=true';
  }

  return url;
}

function isValidStreamUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  if (!u) return false;
  if (/youtube\.com|youtu\.be/.test(u)) return true;
  if (/twitch\.tv/.test(u)) return true;
  if (/vimeo\.com/.test(u)) return true;
  try {
    new URL(u);
    return true;
  } catch {
    return false;
  }
}

async function loadStreams() {
  const container = $('#streams-container');
  container.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';

  try {
    const data = await apiGet('/api/streams?limit=50');
    const allStreams = data.items || [];

    // Фильтруем валидные/невалидные
    const validStreams = allStreams.filter(s => isValidStreamUrl(s.stream_url));
    const invalidStreams = allStreams.filter(s => !isValidStreamUrl(s.stream_url));

    // Автоудаление битых стримов для админа
    if (isAdmin() && invalidStreams.length > 0) {
      console.log('🗑️ Удаляю ' + invalidStreams.length + ' нерабочих стримов...');
      for (const bad of invalidStreams) {
        try {
          await apiDelete('/api/streams/' + bad.id);
        } catch (e) {
          console.warn('Не удалось удалить стрим ' + bad.id, e);
        }
      }
      showToast('🧹 Удалено нерабочих стримов: ' + invalidStreams.length, 'success');
    }

    // Только LIVE стримы
    const liveStreams = validStreams.filter(s => s.is_live === 1 || s.is_live === true);
    const count = liveStreams.length;

    $('#liveCount').textContent = count + (count === 1 ? ' стрим' : ' стримов');

    if (count === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">📺</div><div class="empty-text">Нет активных стримов. Начните свой!</div></div>';
      return;
    }

    container.innerHTML = '<div class="streams-scroll">' + liveStreams.map(renderStreamCard).join('') + '</div>';

    // Обработчики кликов на превью
    container.querySelectorAll('.stream-thumb, .stream-placeholder').forEach(el => {
      el.addEventListener('click', () => {
        const preview = el.closest('.stream-preview');
        const embedUrl = preview.dataset.embed;
        if (!embedUrl) {
          showToast('Некорректный URL стрима', 'error');
          return;
        }
        preview.innerHTML = '<iframe src="' + escapeHtml(embedUrl) + '" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture; accelerometer; gyroscope; clipboard-write" style="width:100%;height:100%;border:none;"></iframe>';
      });
    });

    // Обработчики кнопок "Удалить"
    container.querySelectorAll('.stream-delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm('Удалить этот стрим?')) return;
        try {
          await apiDelete('/api/streams/' + btn.dataset.streamId);
          showToast('Стрим удалён');
          btn.closest('.stream-card').remove();
          const newCount = container.querySelectorAll('.stream-card').length;
          $('#liveCount').textContent = newCount + ' стримов';
        } catch (e) {
          showToast('Ошибка: ' + e.message, 'error');
        }
      });
    });
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><div class="empty-text">Ошибка: ' + escapeHtml(e.message) + '</div></div>';
  }
}

function renderStreamCard(stream) {
  const url = stream.stream_url || '';
  const customThumb = stream.thumbnail_url || '';
  const youtubeId = extractYouTubeId(url);
  const embedUrl = toEmbedUrl(url);
  const authorName = stream.author_display_name || stream.author_name || 'Стример';
  const isOwner = state.user && state.user.user_id === stream.user_id;
  const canDelete = isOwner || isAdmin();

  // Автопревью для YouTube или пустое
  const autoThumb = (!customThumb && youtubeId)
    ? 'https://img.youtube.com/vi/' + youtubeId + '/hqdefault.jpg'
    : '';
  const finalThumb = customThumb || autoThumb;

  let previewHtml = '';
  if (finalThumb) {
    // Есть превью — показываем картинку с кнопкой play
    previewHtml = '<div class="stream-thumb" style="background-image:url(\'' + escapeHtml(finalThumb) + '\');">' +
      '<div class="stream-thumb-play">▶</div>' +
      '<div class="stream-live-badge">🔴 LIVE</div>' +
    '</div>';
  } else {
    // Нет превью — показываем смайлик 📺
    previewHtml = '<div class="stream-placeholder" title="Нажмите чтобы открыть стрим">' +
      '<div class="stream-placeholder-content">' +
        '<div class="stream-placeholder-emoji">📺</div>' +
        '<div class="stream-placeholder-text">Нажмите чтобы смотреть</div>' +
      '</div>' +
      '<div class="stream-live-badge">🔴 LIVE</div>' +
    '</div>';
  }

  const deleteBtn = canDelete
    ? '<button class="stream-delete-btn" data-stream-id="' + escapeHtml(stream.id) + '" title="Удалить стрим">🗑️ Удалить</button>'
    : '';

  return '<div class="stream-card reveal">' +
    '<div class="stream-preview" data-embed="' + escapeHtml(embedUrl) + '">' +
      previewHtml +
      deleteBtn +
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
  const title = $('#streamTitle').value.trim();
  const description = $('#streamDescription').value.trim();
  const streamUrl = $('#streamUrl').value.trim();
  const thumbnail = $('#streamThumbnail').value.trim();

  if (!title || !streamUrl) { showToast('Заполните название и URL', 'error'); return; }

  try {
    await apiPost('/api/streams', { title, description, stream_url: streamUrl, thumbnail_url: thumbnail });
    showToast('Стрим создан!');
    closeModal('streamModal');
    $('#streamTitle').value = '';
    $('#streamDescription').value = '';
    $('#streamUrl').value = '';
    $('#streamThumbnail').value = '';
    loadStreams();
  } catch (e) { showToast('Ошибка: ' + e.message, 'error'); }
});

$('#cancelStream').addEventListener('click', () => closeModal('streamModal'));

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

  const headerHtml = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
    '<h2 style="font-size:20px;font-weight:700;">Ваши чаты</h2>' +
    '<button class="btn btn-primary" id="newChatBtn">+ Новый чат</button>' +
  '</div>';

  container.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';
  try {
    const data = await apiGet('/api/chats');
    let listHtml;
    if (!data.items || data.items.length === 0) {
      listHtml = '<div class="empty-state"><div class="empty-icon">💬</div><div class="empty-text">У вас пока нет чатов. Нажмите "+ Новый чат" чтобы начать!</div></div>';
    } else {
      listHtml = '<div class="chat-list">' + data.items.map(renderChatItem).join('') + '</div>';
    }
    container.innerHTML = headerHtml + listHtml;

    $('#newChatBtn').addEventListener('click', openNewChatModal);

    $$('.chat-item').forEach(item => {
      item.addEventListener('click', () => {
        state.currentChat = {
          id: item.dataset.chatId,
          otherUserId: item.dataset.otherUserId,
          otherUserName: item.dataset.otherUserName,
          otherUserAvatar: item.dataset.otherUserAvatar
        };
        loadChats();
      });
    });
  } catch (e) {
    container.innerHTML = headerHtml + '<div class="empty-state"><div class="empty-text">Ошибка: ' + escapeHtml(e.message) + '</div></div>';
    const newBtn = $('#newChatBtn');
    if (newBtn) newBtn.addEventListener('click', openNewChatModal);
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

function openNewChatModal() {
  let modal = $('#newChatModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'newChatModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = \`
      <div class="modal">
        <h2 class="modal-title">✉️ Новый чат</h2>
        <div class="form-group">
          <label class="form-label">Username пользователя (без @)</label>
          <input type="text" class="form-input" id="newChatUsername" placeholder="например: Negr" autocomplete="off">
        </div>
        <div id="newChatResult"></div>
        <div class="modal-actions">
          <button class="btn btn-secondary" id="cancelNewChat">Отмена</button>
          <button class="btn btn-primary" id="confirmNewChat">Найти</button>
        </div>
      </div>\`;
    document.body.appendChild(modal);

    $('#cancelNewChat').addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  $('#newChatUsername').value = '';
  $('#newChatResult').innerHTML = '';
  modal.classList.add('active');
  setTimeout(() => $('#newChatUsername').focus(), 100);

  const findUser = async () => {
    const username = $('#newChatUsername').value.trim().replace(/^@/, '');
    const result = $('#newChatResult');
    if (!username) {
      result.innerHTML = '<div style="color:var(--danger);font-size:13px;">Введите username</div>';
      return;
    }
    result.innerHTML = '<div class="loader"><div class="loader-spinner" style="width:24px;height:24px;border-width:2px;"></div></div>';
    try {
      const user = await apiGet('/api/users/by-username/' + encodeURIComponent(username));
      result.innerHTML = '<div class="chat-item" style="margin-top:12px;">' +
        '<img class="chat-avatar" src="' + escapeHtml(user.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png') + '">' +
        '<div class="chat-info">' +
          '<div class="chat-name">' + escapeHtml(user.display_name || user.name) + '</div>' +
          '<div class="chat-preview">@' + escapeHtml(user.name) + '</div>' +
        '</div>' +
        '<button class="btn btn-primary" id="startChatWithUser" data-user-id="' + escapeHtml(user.id) + '">Начать чат</button>' +
      '</div>';

      $('#startChatWithUser').addEventListener('click', async () => {
        try {
          const res = await apiPost('/api/chats/open', { with_user_id: user.id });
          modal.classList.remove('active');
          state.currentChat = {
            id: res.chat.id,
            otherUserId: user.id,
            otherUserName: user.display_name || user.name,
            otherUserAvatar: user.avatar_url
          };
          loadChats();
        } catch (e) { showToast('Ошибка: ' + e.message, 'error'); }
      });
    } catch (e) {
      result.innerHTML = '<div style="color:var(--danger);font-size:13px;">Пользователь не найден</div>';
    }
  };

  $('#confirmNewChat').onclick = findUser;
  $('#newChatUsername').onkeypress = (e) => { if (e.key === 'Enter') findUser(); };
}

async function openChatWith(username) {
  if (!state.user) {
    showToast('Нужно войти, чтобы общаться', 'error');
    return;
  }
  if (username === state.user.username || username === state.user.name) {
    showToast('Это вы сами 😅', 'error');
    return;
  }

  showToast('🔎 Ищу пользователя @' + username + '...', 'success');

  try {
    const user = await apiGet('/api/users/by-username/' + encodeURIComponent(username));
    const res = await apiPost('/api/chats/open', { with_user_id: user.id });

    showToast('💬 Открываю чат с ' + (user.display_name || user.name), 'success');

    state.currentChat = {
      id: res.chat.id,
      otherUserId: user.id,
      otherUserName: user.display_name || user.name,
      otherUserAvatar: user.avatar_url
    };

    switchSection('chats');
  } catch (e) {
    if (e.message && e.message.includes('user_not_found')) {
      showToast('Пользователь @' + username + ' не найден', 'error');
    } else {
      showToast('Ошибка: ' + e.message, 'error');
    }
  }
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
    '<div class="chat-messages" id="chatMessages"></div>' +
    '<div class="chat-input-area">' +
      '<input type="text" class="chat-input" id="chatInput" placeholder="Напишите сообщение..." maxlength="2000">' +
      '<button class="btn btn-primary" id="sendMessageBtn">➤</button>' +
    '</div>' +
  '</div>';

  $('#backToChats').addEventListener('click', () => {
    state.currentChat = null;
    if (state.chatPollInterval) clearInterval(state.chatPollInterval);
    loadChats();
  });

  await loadMessages();
  state.chatPollInterval = setInterval(loadMessages, 3000);

  $('#sendMessageBtn').addEventListener('click', sendMessage);
  $('#chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

async function loadMessages() {
  if (!state.currentChat) return;
  try {
    const data = await apiGet('/api/chats/' + state.currentChat.id + '/messages');
    const messagesEl = $('#chatMessages');
    if (!messagesEl) return;
    if (!data.items || data.items.length === 0) {
      messagesEl.innerHTML = '<div class="empty-state" style="padding:20px;"><div class="empty-text">Нет сообщений. Начните разговор!</div></div>';
      return;
    }
    messagesEl.innerHTML = data.items.map(m =>
      '<div class="message ' + (m.sender_id === state.user.user_id ? 'sent' : 'received') + '">' +
        '<div>' + escapeHtml(m.text) + '</div>' +
        '<div class="message-time">' + timeAgo(m.created_at) + '</div>' +
      '</div>'
    ).join('');
    messagesEl.scrollTop = messagesEl.scrollHeight;
  } catch (e) {}
}

async function sendMessage() {
  const input = $('#chatInput');
  const text = input.value.trim();
  if (!text || !state.currentChat) return;
  try {
    await apiPost('/api/chats/' + state.currentChat.id + '/messages', { text });
    input.value = '';
    await loadMessages();
  } catch (e) { showToast('Ошибка: ' + e.message, 'error'); }
}

// ============================================
// ПРОФИЛЬ
// ============================================
async function loadMyProfile() {
  const container = $('#profile-container');
  if (!state.user) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">👤</div><div class="empty-text">Войдите через GitHub</div><a href="/auth/github" class="btn btn-primary mt-4">Войти</a></div>';
    return;
  }
  container.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';
  try {
    const profile = await apiGet('/api/profile/me');
    state.user = profile;
    updateAuthUI();
    container.innerHTML = renderProfile(profile, true);
    initProfileActions(profile);
    setTimeout(initScrollReveal, 100);
    loadUserMedia(profile.user_id);
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><div class="empty-text">Ошибка: ' + escapeHtml(e.message) + '</div></div>';
  }
}

function renderProfile(profile, isMe) {
  const bgColor = profile.bg_color && /^#[0-9A-Fa-f]{6}$/.test(profile.bg_color)
    ? profile.bg_color
    : '#1a1a2e';
  const bgStyle = profile.bg_image_url
    ? 'background-image:url(' + escapeHtml(profile.bg_image_url) + ');'
    : 'background-color:' + bgColor + ';';

  const avatarUrl = profile.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  const displayName = (profile.profile_emoji || '') + ' ' + (profile.display_name || profile.username || '');

  const tabsHtml = isMe
    ? '<div class="profile-tabs">' +
        '<button class="btn btn-primary profile-tab" data-tab="posts">📝 Посты</button>' +
        '<button class="btn btn-secondary profile-tab" data-tab="saves">🔖 Сохранённые</button>' +
      '</div>'
    : '';

  return '<div class="profile-header" style="' + bgStyle + '">' +
    '<div class="profile-bg" style="' + bgStyle + '"></div>' +
    '<div class="profile-content">' +
      '<img class="profile-avatar" src="' + escapeHtml(avatarUrl) + '" alt="avatar">' +
      '<div class="profile-name">' + escapeHtml(displayName.trim()) + '</div>' +
      '<div class="profile-username">@' + escapeHtml(profile.username || '') + '</div>' +
      (profile.bio ? '<div class="profile-bio">' + escapeHtml(profile.bio) + '</div>' : '') +
      '<div class="profile-stats">' +
        '<div class="profile-stat"><div class="profile-stat-value">' + (profile.media_count || 0) + '</div><div class="profile-stat-label">постов</div></div>' +
        '<div class="profile-stat"><div class="profile-stat-value">' + (profile.followers_count || 0) + '</div><div class="profile-stat-label">подписчиков</div></div>' +
        '<div class="profile-stat"><div class="profile-stat-value">' + (profile.following_count || 0) + '</div><div class="profile-stat-label">подписок</div></div>' +
      '</div>' +
      (isMe
        ? '<div class="profile-actions"><button class="btn btn-primary" id="editProfileBtn">✏️ Редактировать</button></div>'
        : '<div class="profile-actions"><button class="btn btn-follow" id="followBtn">' + (profile.is_following ? 'Отписаться' : 'Подписаться') + '</button></div>') +
    '</div>' +
  '</div>' +
  tabsHtml +
  '<div id="profile-posts"><div id="profile-media"></div></div>' +
  '<div id="profile-saves" style="display:none;"><div id="saves-media"></div></div>';
}

function initProfileActions(profile) {
  const editBtn = $('#editProfileBtn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      $('#editDisplayName').value = profile.display_name || '';
      $('#editUsername').value = profile.username || '';
      $('#editBio').value = profile.bio || '';
      $('#editProfileEmoji').value = profile.profile_emoji || '👻';
      $('#editBgColor').value = profile.bg_color || '#1a1a2e';
      $('#editBgImageUrl').value = profile.bg_image_url || '';
      $('#editAvatarUrl').value = profile.avatar_url || '';
      openModal('profileModal');
    });
  }

  const followBtn = $('#followBtn');
  if (followBtn) {
    followBtn.addEventListener('click', async () => {
      if (!state.user) { showToast('Нужно войти', 'error'); return; }
      try {
        const data = await apiPost('/api/profile/' + profile.user_id + '/follow');
        followBtn.textContent = data.following ? 'Отписаться' : 'Подписаться';
        followBtn.className = 'btn ' + (data.following ? 'btn-following' : 'btn-follow');
      } catch (e) { showToast('Ошибка: ' + e.message, 'error'); }
    });
  }

  $$('.profile-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.profile-tab').forEach(t => {
        t.classList.remove('btn-primary');
        t.classList.add('btn-secondary');
      });
      tab.classList.remove('btn-secondary');
      tab.classList.add('btn-primary');
      const tabName = tab.dataset.tab;
      $('#profile-posts').style.display = tabName === 'posts' ? 'block' : 'none';
      $('#profile-saves').style.display = tabName === 'saves' ? 'block' : 'none';
      if (tabName === 'saves') loadUserSaves();
    });
  });
}

async function loadUserMedia(userId) {
  const container = $('#profile-media');
  if (!container) return;
  container.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';
  try {
    const data = await apiGet('/api/media/feed?user_id=' + userId + '&limit=30');
    if (!data.items || data.items.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">Пока нет постов</div></div>';
      return;
    }
    container.innerHTML = '<div class="media-grid">' + data.items.map(renderMediaCard).join('') + '</div>';
    initMediaActions();
    initMediaVideoHover();
    setTimeout(initScrollReveal, 50);
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><div class="empty-text">Ошибка загрузки</div></div>';
  }
}

async function loadUserSaves() {
  const container = $('#saves-media');
  if (!container) return;
  container.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';
  try {
    const data = await apiGet('/api/media/saved');
    if (!data.items || data.items.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔖</div><div class="empty-text">Нет сохранённых постов</div></div>';
      return;
    }
    container.innerHTML = '<div class="media-grid">' + data.items.map(renderMediaCard).join('') + '</div>';
    initMediaActions();
    setTimeout(initScrollReveal, 50);
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><div class="empty-text">Ошибка: ' + escapeHtml(e.message) + '</div></div>';
  }
}

$('#saveProfile').addEventListener('click', async () => {
  try {
    await apiPut('/api/profile', {
      display_name: $('#editDisplayName').value.trim(),
      bio: $('#editBio').value.trim(),
      avatar_url: $('#editAvatarUrl').value.trim(),
      profile_emoji: $('#editProfileEmoji').value,
      bg_color: $('#editBgColor').value,
      bg_image_url: $('#editBgImageUrl').value.trim()
    });

    const newUsername = $('#editUsername').value.trim();
    if (newUsername && state.user && newUsername !== state.user.username) {
      await apiPut('/api/profile/username', { username: newUsername });
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
    const data = await apiGet('/api/search?q=' + encodeURIComponent(q));
    let html = '';
    if (data.users && data.users.length > 0) {
      html += '<h3 class="mt-4 mb-2" style="color:var(--accent-purple);">👥 Пользователи</h3>';
      html += '<div class="chat-list">' + data.users.map(u => {
        const name = u.display_name || u.name;
        const avatar = u.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
        return '<div class="chat-item">' +
          '<img class="chat-avatar" src="' + escapeHtml(avatar) + '">' +
          '<div class="chat-info">' +
            '<div class="chat-name">' + escapeHtml(name) + '</div>' +
            '<div class="chat-preview">@' + escapeHtml(u.name) + '</div>' +
          '</div>' +
        '</div>';
      }).join('') + '</div>';
    }
    if (data.media && data.media.length > 0) {
      html += '<h3 class="mt-4 mb-2" style="color:var(--accent-purple);">🎬 Контент</h3>';
      html += '<div class="media-grid">' + data.media.map(renderMediaCard).join('') + '</div>';
    }
    if (!html) html = '<div class="empty-state mt-4"><div class="empty-text">Ничего не найдено</div></div>';
    results.innerHTML = html;
    initMediaActions();
    setTimeout(initScrollReveal, 100);
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
    showToast(document.body.classList.contains('easter-egg')
      ? '🎃 Пасхалка активирована!'
      : '🔄 Возвращаем в нормальный режим');
  }
  setTimeout(() => {
    state.easterEggClicks = Math.max(0, state.easterEggClicks - 1);
  }, 2000);
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
    glitchTimeout = setTimeout(() => {
      document.body.style.filter = '';
    }, 100);
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
checkAuth();
initScrollReveal();

if (window.location.hash && window.location.hash.startsWith('#')) {
  const section = window.location.hash.substring(1);
  if (['feed', 'streams', 'chats', 'profile'].includes(section)) {
    setTimeout(() => switchSection(section), 100);
  }
}

console.log('%c🎃 SpookyTok', 'font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #f97316); color: white; padding: 10px 20px; border-radius: 10px;');
console.log('%cЖуткие истории в TikTok-стиле', 'font-size: 14px; color: #a0a0c0;');
</script>
</body>
</html>`;

export default INDEX_HTML;
