const INDEX_HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#0d0714">
<title>HalloweenTok</title>
<style>
  :root {
    --bg: #0d0714;
    --card: #1a0f26;
    --card-hover: #231538;
    --orange: #ff7518;
    --orange-glow: rgba(255,117,24,0.4);
    --purple: #7b2ff7;
    --purple-glow: rgba(123,47,247,0.4);
    --green: #6dff8f;
    --red: #ff4444;
    --text: #f3e9ff;
    --text-dim: #a89bb8;
    --border: #2a1a3a;
  }
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 10%, var(--purple-glow), transparent 40%),
      radial-gradient(circle at 80% 90%, var(--orange-glow), transparent 40%);
    pointer-events: none;
    z-index: 0;
    animation: bgPulse 8s ease-in-out infinite;
  }
  
  @keyframes bgPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  #particleLayer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  }
  
  .particle {
    position: absolute;
    pointer-events: none;
    border-radius: 50%;
    animation: particleFly 1s ease-out forwards;
  }
  
  .emoji-particle {
    position: absolute;
    pointer-events: none;
    font-size: 28px;
    animation: emojiFly 1.5s ease-out forwards;
  }
  
  @keyframes particleFly {
    0% { opacity: 1; transform: translate(0,0) scale(1); }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0); }
  }
  
  @keyframes emojiFly {
    0% { opacity: 1; transform: translate(0,0) scale(0.5) rotate(0deg); }
    30% { opacity: 1; transform: translate(calc(var(--dx)*0.3), calc(var(--dy)*0.3)) scale(1.5) rotate(90deg); }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.2) rotate(360deg); }
  }
  
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 2px solid var(--purple);
    position: sticky;
    top: 0;
    background: rgba(13,7,20,0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 100;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  
  header h1 {
    font-size: 24px;
    font-weight: 800;
    background: linear-gradient(135deg, var(--orange), var(--purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    white-space: nowrap;
    animation: titleGlow 3s ease-in-out infinite;
    cursor: pointer;
    user-select: none;
  }
  
  @keyframes titleGlow {
    0%, 100% { filter: brightness(1) drop-shadow(0 0 8px var(--orange-glow)); }
    50% { filter: brightness(1.3) drop-shadow(0 0 16px var(--orange-glow)); }
  }
  
  header input {
    flex: 1;
    max-width: 300px;
    background: var(--card);
    border: 2px solid var(--border);
    color: var(--text);
    border-radius: 24px;
    padding: 10px 18px;
    font-size: 14px;
    transition: all 0.3s;
    outline: none;
  }
  
  header input:focus {
    border-color: var(--purple);
    box-shadow: 0 0 0 3px var(--purple-glow);
  }
  
  header input::placeholder { color: var(--text-dim); }
  
  #authArea { display: flex; align-items: center; gap: 8px; }
  
  button, .btn {
    background: linear-gradient(135deg, var(--purple), var(--orange));
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 24px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s;
    box-shadow: 0 4px 16px rgba(123,47,247,0.3);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }
  
  button:hover, .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(123,47,247,0.5);
  }
  
  button:active, .btn:active { transform: scale(0.95); }
  
  .btn-logout {
    background: linear-gradient(135deg, #444, #333);
    padding: 8px 14px;
    font-size: 12px;
    box-shadow: none;
  }
  
  .user-badge {
    color: var(--orange);
    font-weight: 700;
    font-size: 14px;
    background: rgba(255,117,24,0.1);
    padding: 6px 12px;
    border-radius: 16px;
    border: 1px solid rgba(255,117,24,0.3);
  }
  
  #feed {
    max-width: 540px;
    margin: 0 auto;
    padding: 20px 16px 100px;
    position: relative;
    z-index: 1;
  }
  
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    margin-bottom: 24px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    transition: all 0.3s;
    animation: fadeInUp 0.5s ease;
    position: relative;
  }
  
  .card::after {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    transition: left 0.6s;
    pointer-events: none;
    z-index: 2;
  }
  
  .card:hover::after { left: 100%; }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 48px rgba(123,47,247,0.3);
    border-color: var(--purple);
  }
  
  .card video, .card img {
    width: 100%;
    display: block;
    background: #000;
    max-height: 640px;
    object-fit: contain;
    position: relative;
    z-index: 1;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
  
  .card-body { padding: 16px 20px; position: relative; z-index: 1; }
  
  .author {
    font-weight: 700;
    color: var(--orange);
    font-size: 15px;
    display: block;
    margin-bottom: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .author:hover {
    color: var(--purple);
    text-shadow: 0 0 12px var(--purple-glow);
  }
  
  .card-caption {
    color: var(--text-dim);
    font-size: 14px;
    line-height: 1.5;
  }
  
  .actions {
    display: flex;
    gap: 20px;
    padding: 12px 20px;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    position: relative;
    z-index: 1;
  }
  
  .action-btn {
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 12px;
    background: transparent;
    color: var(--text);
    font-weight: 600;
    box-shadow: none;
    border: none;
  }
  
  .action-btn:hover {
    background: rgba(255,255,255,0.05);
    transform: scale(1.1);
  }
  
  .action-btn:active { 
    transform: scale(0.9);
    animation: clickRipple 0.4s ease;
  }
  
  @keyframes clickRipple {
    0% { box-shadow: 0 0 0 0 rgba(255,117,24,0.7); }
    100% { box-shadow: 0 0 0 20px rgba(255,117,24,0); }
  }
  
  .action-btn.liked {
    animation: likePulse 0.4s ease;
  }
  
  @keyframes likePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.4); }
    100% { transform: scale(1); }
  }
  
  .comments {
    padding: 12px 20px;
    font-size: 14px;
    color: var(--text-dim);
    position: relative;
    z-index: 1;
  }
  
  .comments div { padding: 6px 0; line-height: 1.5; }
  .comments b { color: var(--orange); font-weight: 600; }
  
  .comment-input {
    display: flex;
    gap: 8px;
    padding: 12px 20px 16px;
    position: relative;
    z-index: 1;
  }
  
  .comment-input input {
    flex: 1;
    border-radius: 20px;
    border: 2px solid var(--border);
    background: var(--bg);
    color: var(--text);
    padding: 10px 16px;
    font-size: 14px;
    outline: none;
    transition: all 0.3s;
  }
  
  .comment-input input:focus {
    border-color: var(--purple);
    box-shadow: 0 0 0 3px var(--purple-glow);
  }
  
  .delete-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255,68,68,0.95);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 700;
    font-size: 14px;
    z-index: 20;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 20px rgba(255,68,68,0.5);
    transition: all 0.3s;
    display: none;
  }
  
  .delete-btn.show { display: flex; }
  
  .delete-btn:hover {
    background: var(--red);
    transform: scale(1.1);
  }
  
  .fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    font-size: 32px;
    padding: 16px 20px;
    border-radius: 50%;
    box-shadow: 0 8px 32px rgba(255,117,24,0.5);
    z-index: 50;
    animation: fabFloat 3s ease-in-out infinite;
  }
  
  @keyframes fabFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .fab:hover {
    animation: none;
    transform: scale(1.1) rotate(10deg);
    box-shadow: 0 12px 40px rgba(255,117,24,0.7);
  }
  
  #uploadModal, #chatModal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.92);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
  }
  
  #uploadModal .box, #chatModal .box {
    background: var(--card);
    padding: 28px;
    border-radius: 24px;
    width: 100%;
    max-width: 440px;
    border: 2px solid var(--purple);
    box-shadow: 0 16px 64px rgba(123,47,247,0.5);
    animation: modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  
  #chatModal .box {
    max-width: 500px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }
  
  @keyframes modalPop {
    from { opacity: 0; transform: scale(0.8) translateY(30px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  
  #uploadModal h3, #chatModal h3 {
    color: var(--orange);
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: 700;
    padding: 20px 20px 0;
  }
  
  #chatModal .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    background: rgba(13,7,20,0.5);
  }
  
  #chatModal .chat-header h3 {
    margin: 0;
    padding: 0;
  }
  
  #chatModal .close-chat {
    background: #333;
    padding: 8px 14px;
    font-size: 12px;
  }
  
  #chatMessages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
    min-height: 300px;
    max-height: 50vh;
  }
  
  .chat-message {
    margin-bottom: 12px;
    padding: 10px 14px;
    border-radius: 16px;
    max-width: 80%;
    animation: msgSlide 0.3s ease;
  }
  
  @keyframes msgSlide {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .chat-message.mine {
    background: linear-gradient(135deg, var(--purple), var(--orange));
    margin-left: auto;
    border-bottom-right-radius: 4px;
  }
  
  .chat-message.other {
    background: var(--bg);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
  }
  
  .chat-message .msg-author {
    font-size: 11px;
    color: var(--text-dim);
    margin-bottom: 4px;
  }
  
  .chat-message .msg-text {
    font-size: 14px;
    line-height: 1.4;
  }
  
  .chat-input-area {
    display: flex;
    gap: 8px;
    padding: 16px 20px;
    border-top: 1px solid var(--border);
    background: rgba(13,7,20,0.5);
  }
  
  .chat-input-area input {
    flex: 1;
    border-radius: 20px;
    border: 2px solid var(--border);
    background: var(--bg);
    color: var(--text);
    padding: 10px 16px;
    font-size: 14px;
    outline: none;
  }
  
  .chat-input-area input:focus {
    border-color: var(--purple);
  }
  
  #uploadModal input[type="file"] {
    width: 100%;
    padding: 14px;
    background: var(--bg);
    border: 2px dashed var(--purple);
    border-radius: 16px;
    color: var(--text);
    cursor: pointer;
    transition: all 0.3s;
    margin: 0 20px;
    width: calc(100% - 40px);
  }
  
  #uploadModal input[type="file"]:hover {
    border-color: var(--orange);
    background: rgba(255,117,24,0.05);
  }
  
  #uploadModal input[type="text"] {
    width: calc(100% - 40px);
    margin: 12px 20px 0;
    padding: 12px 16px;
    border-radius: 16px;
    border: 2px solid var(--border);
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    outline: none;
    transition: all 0.3s;
  }
  
  #uploadModal input[type="text"]:focus {
    border-color: var(--purple);
    box-shadow: 0 0 0 3px var(--purple-glow);
  }
  
  .modal-buttons {
    margin: 16px 20px 0;
    display: flex;
    gap: 10px;
  }
  
  .modal-buttons button { flex: 1; }
  
  #progressLog {
    font-size: 13px;
    color: var(--text-dim);
    max-height: 150px;
    overflow-y: auto;
    margin: 16px 20px 20px;
    padding: 12px;
    background: var(--bg);
    border-radius: 12px;
    border: 1px solid var(--border);
  }
  
  #progressLog div { padding: 4px 0; }
  
  @media (max-width: 640px) {
    header { padding: 12px 16px; flex-wrap: wrap; }
    header h1 { font-size: 20px; order: 1; }
    #authArea { order: 2; margin-left: auto; }
    header input { order: 3; width: 100%; max-width: 100%; margin-top: 10px; }
    #feed { padding: 16px 12px 100px; }
    .card { margin-bottom: 20px; border-radius: 16px; }
    .fab { bottom: 20px; right: 20px; font-size: 28px; padding: 14px 18px; }
  }
  
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--purple); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--orange); }
  
  .loading { text-align: center; padding: 60px 20px; color: var(--text-dim); font-size: 18px; }
  
  .spinner {
    display: inline-block;
    animation: spin 1.5s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .easter-egg-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.5s ease;
  }
  
  .easter-egg-content {
    text-align: center;
    font-size: 48px;
    animation: easterEggPop 1s cubic-bezier(0.34,1.56,0.64,1);
  }
  
  @keyframes easterEggPop {
    from { transform: scale(0) rotate(-180deg); }
    to { transform: scale(1) rotate(0deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
</head>
<body>

<div id="particleLayer"></div>

<header>
  <h1 id="siteTitle">HalloweenTok</h1>
  <input id="searchInput" placeholder="Поиск...">
  <div id="authArea"><span style="color:var(--text-dim)">...</span></div>
</header>

<div id="feed"></div>
<button class="fab" onclick="openUploadModal()">+</button>

<div id="uploadModal">
  <div class="box">
    <h3>Загрузить контент</h3>
    <input type="file" id="fileInput" accept="video/*,image/*">
    <input type="text" id="captionInput" placeholder="Подпись...">
    <div class="modal-buttons">
      <button onclick="startUpload()">Загрузить</button>
      <button onclick="closeUploadModal()" style="background:#333;">Отмена</button>
    </div>
    <div id="progressLog"></div>
  </div>
</div>

<div id="chatModal">
  <div class="box">
    <div class="chat-header">
      <h3 id="chatTitle">Чат</h3>
      <button class="close-chat" onclick="closeChat()">Закрыть</button>
    </div>
    <div id="chatMessages"></div>
    <div class="chat-input-area">
      <input id="chatInput" placeholder="Написать сообщение...">
      <button onclick="sendChatMessage()">Отправить</button>
    </div>
  </div>
</div>

<script>
const MAX_VIDEO_BYTES = 3 * 1024 * 1024;
const MAX_PHOTO_BYTES = 0.5 * 1024 * 1024;
const ADMIN_NICK = 'vrema7760-cyber';
const EMOJIS = ['','','','','','','','','','','','',''];
const COLORS = ['#ff7518','#7b2ff7','#6dff8f','#ff1493','#00ffff','#ffeb3b','#ff5722'];
const COMPRESS_LADDER = [
  { height: 720, fps: 60, kbps: 800 },
  { height: 720, fps: 60, kbps: 400 },
  { height: 720, fps: 30, kbps: 400 },
  { height: 480, fps: 30, kbps: 400 },
  { height: 480, fps: 30, kbps: 100 },
];

let currentUser = null;
let currentUserLoaded = false;
let currentChatUserId = null;
const pLayer = document.getElementById('particleLayer');

// ========== PARTICLES ==========
function spawnParticles(x, y) {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 4 + Math.random() * 10;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 140;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    p.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;background:' + color + ';box-shadow:0 0 ' + (size*2) + 'px ' + color + ';--dx:' + dx + 'px;--dy:' + dy + 'px;';
    pLayer.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const e = document.createElement('div');
      e.className = 'emoji-particle';
      e.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const dx = -80 + Math.random() * 160;
      const dy = -120 - Math.random() * 180;
      e.style.cssText = 'left:' + x + 'px;top:' + y + 'px;--dx:' + dx + 'px;--dy:' + dy + 'px;';
      pLayer.appendChild(e);
      setTimeout(() => e.remove(), 1500);
    }, i * 60);
  }
}

document.addEventListener('pointerdown', function(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'VIDEO') return;
  spawnParticles(e.clientX, e.clientY);
}, {passive: true});

// ========== SWIPE EASTER EGG ==========
let swipeSequence = [];
const SWIPE_PATTERN = ['up','up','down','down','left','right','left','right'];
let lastSwipeTime = 0;

document.addEventListener('touchstart', function(e) {
  if (e.touches.length !== 1) return;
  const touch = e.touches[0];
  this._swipeStart = { x: touch.clientX, y: touch.clientY, time: Date.now() };
}, {passive: true});

document.addEventListener('touchend', function(e) {
  if (!this._swipeStart) return;
  const touch = e.changedTouches[0];
  const dx = touch.clientX - this._swipeStart.x;
  const dy = touch.clientY - this._swipeStart.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  
  if (dist < 50) return;
  
  let direction;
  if (Math.abs(dx) > Math.abs(dy)) {
    direction = dx > 0 ? 'right' : 'left';
  } else {
    direction = dy > 0 ? 'down' : 'up';
  }
  
  const now = Date.now();
  if (now - lastSwipeTime > 2000) swipeSequence = [];
  lastSwipeTime = now;
  
  swipeSequence.push(direction);
  
  if (swipeSequence.length > SWIPE_PATTERN.length) {
    swipeSequence.shift();
  }
  
  if (JSON.stringify(swipeSequence) === JSON.stringify(SWIPE_PATTERN)) {
    showEasterEgg('👻', 'Секретный код активирован!');
    for (let i = 0; i < 30; i++) {
      setTimeout(() => spawnParticles(Math.random() * window.innerWidth, Math.random() * window.innerHeight), i * 30);
    }
    swipeSequence = [];
  }
}, {passive: true});

// ========== LOGGING ==========
function log(msg) {
  const el = document.getElementById('progressLog');
  el.innerHTML += '<div>' + msg + '</div>';
  el.scrollTop = el.scrollHeight;
}

function openUploadModal() { document.getElementById('uploadModal').style.display = 'flex'; }
function closeUploadModal() { document.getElementById('uploadModal').style.display = 'none'; document.getElementById('progressLog').innerHTML = ''; }

// ========== COMPRESS ==========
async function compressPhoto(file) {
  if (file.size <= MAX_PHOTO_BYTES) {
    log('Фото уже влезает, пропускаю сжатие');
    return file;
  }
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 1080 / Math.max(img.width, img.height));
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.75));
}

async function compressVideo(file) {
  if (file.size <= MAX_VIDEO_BYTES) {
    log('Видео уже влезает, пропускаю сжатие');
    return { blob: file, resolution: 'original', fps: 30, bitrate_kbps: Math.round(file.size * 8 / (file.duration || 10) / 1000) };
  }
  const video = await loadVideo(file);
  const duration = video.duration || 10;
  log('Оригинал: ' + (file.size/1024/1024).toFixed(2) + 'MB, ' + duration.toFixed(1) + 'с');
  for (let i = 0; i < COMPRESS_LADDER.length; i++) {
    const s = COMPRESS_LADDER[i];
    log(s.height + 'p @ ' + s.fps + 'fps @ ' + s.kbps + 'kbps...');
    const blob = await recodeVideo(video, s.height, s.fps, s.kbps * 1000);
    log('  -> ' + (blob.size/1024/1024).toFixed(2) + 'MB');
    if (blob.size <= MAX_VIDEO_BYTES) {
      return { blob, resolution: s.height + 'p', fps: s.fps, bitrate_kbps: s.kbps };
    }
  }
  const last = COMPRESS_LADDER[COMPRESS_LADDER.length - 1];
  const blob = await recodeVideo(video, last.height, last.fps, last.kbps * 1000);
  return { blob, resolution: last.height + 'p', fps: last.fps, bitrate_kbps: last.kbps };
}

function loadImage(file) {
  return new Promise((res, rej) => {
    const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = URL.createObjectURL(file);
  });
}

function loadVideo(file) {
  return new Promise((res, rej) => {
    const v = document.createElement('video'); v.muted = true; v.playsInline = true;
    v.onloadedmetadata = () => res(v); v.onerror = rej; v.src = URL.createObjectURL(file);
  });
}

function recodeVideo(video, height, fps, bits) {
  return new Promise(async (resolve) => {
    const scale = height / video.videoHeight;
    const c = document.createElement('canvas');
    c.width = Math.round(video.videoWidth * scale); c.height = height;
    const ctx = c.getContext('2d');
    const stream = c.captureStream(fps);
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: bits });
    const chunks = [];
    rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    rec.onstop = () => resolve(new Blob(chunks, {type: mime}));
    video.currentTime = 0;
    await video.play();
    rec.start();
    let last = 0;
    const interval = 1000 / fps;
    function draw(now) {
      if (video.paused || video.ended) { rec.stop(); return; }
      if (now - last >= interval) { ctx.drawImage(video, 0, 0, c.width, c.height); last = now; }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    video.onended = () => { try { rec.stop(); } catch(e){} };
  });
}

function blobToBase64(blob) {
  return new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.readAsDataURL(blob); });
}

// ========== UPLOAD ==========
async function startUpload() {
  const file = document.getElementById('fileInput').files[0];
  const caption = document.getElementById('captionInput').value;
  if (!file) return alert('Выбери файл');
  log('Начинаю...');
  const isVideo = file.type.startsWith('video/');
  let payload;
  if (isVideo) {
    const r = await compressVideo(file);
    payload = { type:'video', mime:r.blob.type, base64:await blobToBase64(r.blob), caption, resolution:r.resolution, fps:r.fps, bitrate_kbps:r.bitrate_kbps };
    log('Видео: ' + (r.blob.size/1024/1024).toFixed(2) + 'MB');
  } else {
    const blob = await compressPhoto(file);
    payload = { type:'photo', mime:'image/jpeg', base64:await blobToBase64(blob), caption };
    log('Фото: ' + (blob.size/1024).toFixed(0) + 'KB');
  }
  log('Загрузка на сервер...');
  const res = await fetch('/api/upload', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
  const data = await res.json();
  if (data.error) { log('Ошибка: ' + data.error); return; }
  log('Готово!');
  closeUploadModal();
  loadFeed();
}

// ========== FEED ==========
async function loadFeed() {
  if (!currentUserLoaded) return;
  const feed = document.getElementById('feed');
  feed.innerHTML = '<div class="loading"><span class="spinner"></span> Загрузка...</div>';
  try {
    const res = await fetch('/api/feed');
    const data = await res.json();
    feed.innerHTML = '';
    if (!data.items || data.items.length === 0) {
      feed.innerHTML = '<div style="text-align:center;padding:80px 20px;color:var(--text-dim);font-size:18px;">Пока пусто</div>';
      return;
    }
    for (const item of data.items) feed.appendChild(renderCard(item));
  } catch(e) {
    feed.innerHTML = '<div style="text-align:center;padding:60px;color:var(--red);">Ошибка</div>';
  }
}

function renderCard(item) {
  const div = document.createElement('div');
  div.className = 'card';
  
  const canDelete = currentUser && (item.author_name === currentUser || currentUser === ADMIN_NICK);
  
  const media = item.type === 'video'
    ? '<video src="/api/media/' + item.id + '/content" controls loop playsinline></video>'
    : '<img src="/api/media/' + item.id + '/content" loading="lazy">';

  div.innerHTML = media +
    '<button class="delete-btn' + (canDelete ? ' show' : '') + '" data-id="' + item.id + '">Удалить</button>' +
    '<div class="card-body">' +
      '<span class="author" data-user="' + item.user_id + '" data-name="' + (item.author_name || 'anon') + '">@' + (item.author_name || 'anon') + '</span>' +
      '<div class="card-caption">' + (item.caption || '') + '</div>' +
    '</div>' +
    '<div class="actions">' +
      '<button class="action-btn" data-action="like" data-id="' + item.id + '">❤️ ' + (item.likes_count || 0) + '</button>' +
      '<button class="action-btn" data-action="save" data-id="' + item.id + '">🔖 ' + (item.saves_count || 0) + '</button>' +
      '<span class="action-btn">💬 ' + (item.comments_count || 0) + '</span>' +
    '</div>' +
    '<div class="comments" id="comments-' + item.id + '"></div>' +
    '<div class="comment-input">' +
      '<input placeholder="Комментарий..." data-media="' + item.id + '">' +
    '</div>';

  div.querySelector('.delete-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    deleteMedia(this.dataset.id);
  });

  div.querySelector('[data-action="like"]').addEventListener('click', function(e) {
    e.stopPropagation();
    toggleLike(this.dataset.id, this);
  });

  div.querySelector('[data-action="save"]').addEventListener('click', function(e) {
    e.stopPropagation();
    toggleSave(this.dataset.id);
  });

  div.querySelector('.author').addEventListener('click', function(e) {
    e.stopPropagation();
    openChat(this.dataset.user, this.dataset.name);
  });

  const commentInput = div.querySelector('.comment-input input');
  commentInput.addEventListener('keydown', function(e) {
    e.stopPropagation();
    if (e.key === 'Enter') sendComment(this.dataset.media, this);
  });

  loadComments(item.id);
  return div;
}

async function toggleLike(id, el) {
  const res = await fetch('/api/media/' + id + '/like', {method:'POST'});
  const data = await res.json();
  el.innerHTML = (data.liked ? '❤️' : '❤️ ') + ' ' + data.likes_count;
  el.classList.add('liked');
  setTimeout(() => el.classList.remove('liked'), 400);
  spawnParticles(el.getBoundingClientRect().left + 20, el.getBoundingClientRect().top);
}

async function toggleSave(id) {
  await fetch('/api/media/' + id + '/save', {method:'POST'});
  loadFeed();
}

async function deleteMedia(id) {
  if (!confirm('Удалить?')) return;
  const res = await fetch('/api/media/' + id, {method:'DELETE'});
  if (res.ok) loadFeed();
  else alert('Ошибка удаления');
}

async function loadComments(mediaId) {
  try {
    const res = await fetch('/api/media/' + mediaId + '/comments');
    const data = await res.json();
    const el = document.getElementById('comments-' + mediaId);
    if (!el) return;
    if (!data.items || data.items.length === 0) {
      el.innerHTML = '<div style="color:var(--text-dim);font-style:italic;">Нет комментариев</div>';
      return;
    }
    el.innerHTML = data.items.map(c => '<div><b>@' + c.author_name + ':</b> ' + c.text + '</div>').join('');
  } catch(e) {}
}

async function sendComment(mediaId, input) {
  const text = input.value.trim();
  if (!text) return;
  await fetch('/api/media/' + mediaId + '/comments', {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text})
  });
  input.value = '';
  loadComments(mediaId);
}

// ========== CHAT ==========
async function openChat(userId, userName) {
  if (!currentUser) {
    alert('Войди чтобы писать в чат');
    return;
  }
  if (userName === currentUser) {
    alert('Нельзя писать себе');
    return;
  }
  
  currentChatUserId = userId;
  document.getElementById('chatTitle').textContent = 'Чат с @' + userName;
  document.getElementById('chatModal').style.display = 'flex';
  document.getElementById('chatMessages').innerHTML = '<div class="loading"><span class="spinner"></span></div>';
  
  await loadChatMessages(userId);
  
  document.getElementById('chatInput').onkeydown = function(e) {
    if (e.key === 'Enter') sendChatMessage();
  };
}

function closeChat() {
  document.getElementById('chatModal').style.display = 'none';
  currentChatUserId = null;
}

async function loadChatMessages(userId) {
  try {
    const res = await fetch('/api/chats/open', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: userId})
    });
    const data = await res.json();
    if (data.error) {
      document.getElementById('chatMessages').innerHTML = '<div style="color:var(--red);">' + data.error + '</div>';
      return;
    }
    
    const chatId = data.chat_id;
    const msgRes = await fetch('/api/chats/' + chatId + '/messages');
    const msgData = await msgRes.json();
    
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    
    if (!msgData.items || msgData.items.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:var(--text-dim);padding:40px;">Начни разговор!</div>';
      return;
    }
    
    for (const msg of msgData.items) {
      const div = document.createElement('div');
      div.className = 'chat-message ' + (msg.sender_id === data.my_id ? 'mine' : 'other');
      div.innerHTML = '<div class="msg-author">@' + msg.sender_name + '</div><div class="msg-text">' + msg.text + '</div>';
      container.appendChild(div);
    }
    
    container.scrollTop = container.scrollHeight;
  } catch(e) {
    document.getElementById('chatMessages').innerHTML = '<div style="color:var(--red);">Ошибка загрузки</div>';
  }
}

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || !currentChatUserId) return;
  
  try {
    const res = await fetch('/api/chats/' + currentChatUserId + '/messages', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({text: text})
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    input.value = '';
    await loadChatMessages(currentChatUserId);
  } catch(e) {
    alert('Ошибка отправки');
  }
}

// ========== SEARCH ==========
let searchTimer;
document.getElementById('searchInput').addEventListener('input', function(e) {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    const q = e.target.value.trim();
    if (!q) return loadFeed();
    const res = await fetch('/api/search?q=' + encodeURIComponent(q));
    const data = await res.json();
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    if (!data.media || data.media.length === 0) {
      feed.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-dim);">Ничего не найдено</div>';
      return;
    }
    for (const item of data.media) feed.appendChild(renderCard(item));
  }, 400);
});

// ========== AUTH ==========
async function init() {
  try {
    const res = await fetch('/api/me');
    if (res.ok) {
      const user = await res.json();
      currentUser = user.name;
      document.getElementById('authArea').innerHTML =
        '<span class="user-badge">@' + user.name + '</span>' +
        '<button class="btn-logout" onclick="logout()">Выйти</button>';
    } else {
      document.getElementById('authArea').innerHTML = '<a class="btn" href="/auth/github">Войти</a>';
    }
  } catch(e) {
    document.getElementById('authArea').innerHTML = '<a class="btn" href="/auth/github">Войти</a>';
  }
  currentUserLoaded = true;
  loadFeed();
}

function logout() {
  document.cookie = 'session=; Max-Age=0; path=/';
  location.reload();
}

// ========== EASTER EGGS ==========
let titleClicks = 0;
let lastTitleClick = 0;

document.getElementById('siteTitle').addEventListener('click', function() {
  titleClicks++;
  const now = Date.now();
  if (now - lastTitleClick > 2000) titleClicks = 1;
  lastTitleClick = now;
  
  if (titleClicks === 5) {
    showEasterEgg('🎃', 'Секретный режим!');
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => document.body.style.filter = '', 5000);
  }
});

function showEasterEgg(emoji, text) {
  const overlay = document.createElement('div');
  overlay.className = 'easter-egg-overlay';
  overlay.innerHTML = '<div class="easter-egg-content">' + emoji + '<br><span style="font-size:24px;">' + text + '</span></div>';
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 3000);
}

init();
</script>
</body>
</html>`;

export default INDEX_HTML;
