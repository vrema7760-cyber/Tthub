const INDEX_HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#0d0714">
<title>SpookyTok</title>
<style>
  /* ===== БАЗОВЫЕ ПЕРЕМЕННЫЕ ===== */
  :root {
    --bg: #0d0714;
    --card: #1a0f26;
    --orange: #ff7518;
    --orange-glow: rgba(255,117,24,0.4);
    --purple: #7b2ff7;
    --purple-glow: rgba(123,47,247,0.4);
    --red: #ff4444;
    --text: #f3e9ff;
    --text-dim: #a89bb8;
    --border: #2a1a3a;
    --nav-height: 70px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  
  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    padding-bottom: var(--nav-height);
    position: relative;
  }

  /* ===== AURORA BACKGROUND ===== */
  .aurora-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .aurora-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
    animation: auroraFloat 15s ease-in-out infinite alternate;
  }
  .aurora-blob:nth-child(1) { width: 60vw; height: 60vw; background: var(--purple); top: -10%; left: -10%; }
  .aurora-blob:nth-child(2) { width: 50vw; height: 50vw; background: var(--orange); bottom: -10%; right: -10%; animation-delay: -5s; }
  .aurora-blob:nth-child(3) { width: 40vw; height: 40vw; background: #00ffff; top: 40%; left: 40%; animation-delay: -10s; opacity: 0.3; }
  
  @keyframes auroraFloat {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(50px, 50px) scale(1.2); }
  }

  /* ===== PARTICLE CANVAS ===== */
  #particleCanvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
  }

  /* ===== MAGNETIC CURSOR (Desktop only) ===== */
  @media (pointer: fine) {
    .magnetic-cursor {
      position: fixed;
      width: 20px;
      height: 20px;
      border: 2px solid var(--orange);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, background 0.2s;
      mix-blend-mode: difference;
    }
    .magnetic-cursor.hovering {
      width: 50px;
      height: 50px;
      background: rgba(255,117,24,0.2);
    }
  }

  /* ===== LAYOUT ===== */
  header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(13,7,20,0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  header h1 {
    font-size: 22px;
    font-weight: 800;
    background: linear-gradient(135deg, var(--orange), var(--purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    cursor: pointer;
  }

  header input {
    flex: 1;
    max-width: 300px;
    background: var(--card);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 20px;
    padding: 8px 14px;
    font-size: 14px;
    outline: none;
  }

  .main-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 16px;
  }

  .page { display: none; }
  .page.active { display: block; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* ===== BOTTOM NAV ===== */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    background: rgba(13,7,20,0.95);
    backdrop-filter: blur(16px);
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 100;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: var(--text-dim);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    padding: 8px;
    transition: color 0.2s;
  }
  .nav-item.active { color: var(--orange); }
  .nav-icon { font-size: 24px; }

  /* ===== CARDS (Feed & Streams) ===== */
  .card, .stream-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    margin-bottom: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  .card-media { width: 100%; aspect-ratio: 9/16; background: #000; object-fit: cover; }
  .stream-media { width: 100%; aspect-ratio: 16/9; background: #000; }
  .card-body { padding: 14px; }
  .author { color: var(--orange); font-weight: 700; cursor: pointer; text-decoration: none; }
  .author:hover { text-decoration: underline; }

  .actions { display: flex; gap: 16px; padding: 10px 14px; border-top: 1px solid var(--border); }
  .action-btn { background: none; border: none; color: var(--text); font-size: 16px; cursor: pointer; }

  /* ===== PROFILE ===== */
  .profile-header {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    margin-bottom: 20px;
  }
  .profile-avatar {
    width: 100px; height: 100px; border-radius: 50%;
    background: linear-gradient(135deg, var(--purple), var(--orange));
    margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 48px;
  }
  .profile-name { font-size: 24px; font-weight: 800; color: var(--orange); }
  .profile-username { color: var(--text-dim); margin-bottom: 12px; }
  .profile-bio { color: var(--text); margin-bottom: 20px; line-height: 1.5; }
  .profile-stats { display: flex; justify-content: space-around; margin-bottom: 20px; }
  .stat-val { font-size: 20px; font-weight: 800; color: var(--orange); }
  .stat-lbl { font-size: 12px; color: var(--text-dim); }

  /* ===== CHATS ===== */
  .chat-list-item {
    background: var(--card); border: 1px solid var(--border); border-radius: 12px;
    padding: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; cursor: pointer;
  }
  .chat-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--purple); display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .chat-info { flex: 1; }
  .chat-name { font-weight: 700; color: var(--orange); }
  .chat-preview { font-size: 13px; color: var(--text-dim); }

  .chat-view { display: flex; flex-direction: column; height: 70vh; background: var(--card); border-radius: 16px; overflow: hidden; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 16px; }
  .msg { padding: 10px 14px; border-radius: 16px; margin-bottom: 8px; max-width: 75%; word-wrap: break-word; }
  .msg.mine { background: var(--purple); color: white; margin-left: auto; border-bottom-right-radius: 4px; }
  .msg.other { background: var(--bg); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
  .chat-input-row { display: flex; gap: 8px; padding: 12px; border-top: 1px solid var(--border); }
  .chat-input-row input { flex: 1; background: var(--bg); border: 1px solid var(--border); color: var(--text); border-radius: 20px; padding: 10px 16px; outline: none; }

  /* ===== MODALS ===== */
  .modal {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
    display: none; align-items: center; justify-content: center; z-index: 200; padding: 20px;
  }
  .modal.active { display: flex; }
  .modal-box {
    background: var(--card); border: 1px solid var(--border); border-radius: 20px;
    padding: 24px; width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto;
  }
  .modal-box h3 { color: var(--orange); margin-bottom: 16px; }
  .modal-box input, .modal-box textarea {
    width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text);
    border-radius: 12px; padding: 12px; margin-bottom: 12px; font-size: 14px; outline: none;
  }
  .modal-box input:focus, .modal-box textarea:focus { border-color: var(--purple); }
  .btn {
    background: linear-gradient(135deg, var(--purple), var(--orange)); color: white; border: none;
    padding: 12px 20px; border-radius: 24px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 8px;
  }
  .btn-secondary { background: #333; }

  /* =========================================
     АДАПТАЦИЯ ПОД УСТРОЙСТВА
     ========================================= */
  
  /* Мобильные (до 600px) */
  @media (max-width: 600px) {
    header { padding: 10px 12px; }
    header h1 { font-size: 18px; }
    .main-content { padding: 12px; }
    .profile-header { padding: 16px; }
    .profile-name { font-size: 20px; }
  }

  /* Планшеты (600px - 1024px) */
  @media (min-width: 600px) and (max-width: 1024px) {
    .main-content { max-width: 800px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .card, .stream-card { margin-bottom: 0; }
  }

  /* ПК (1024px - 1920px) */
  @media (min-width: 1024px) {
    .main-content { max-width: 1000px; }
    .magnetic-cursor { display: block; }
  }

  /* Телевизоры (1920px+) */
  @media (min-width: 1920px) {
    :root { --nav-height: 90px; }
    body { font-size: 18px; }
    header h1 { font-size: 32px; }
    .nav-icon { font-size: 32px; }
    .nav-item { font-size: 16px; }
    .card-media { aspect-ratio: 16/9; }
  }

  /* =========================================
     РЕТРО-РЕЖИМ ДЛЯ КНОПОЧНЫХ ТЕЛЕФОНОВ
     ========================================= */
  body.retro-mode {
    background: #ffffff !important;
    color: #000000 !important;
    font-family: Arial, sans-serif;
    font-size: 14px;
  }
  body.retro-mode .aurora-bg,
  body.retro-mode #particleCanvas,
  body.retro-mode .magnetic-cursor { display: none !important; }
  body.retro-mode header { background: #000080; color: white; border-bottom: 2px solid #000; }
  body.retro-mode header h1 { background: none; -webkit-text-fill-color: white; font-size: 16px; }
  body.retro-mode header input { background: white; color: black; border: 1px solid #888; border-radius: 0; }
  body.retro-mode .main-content { padding: 5px; }
  body.retro-mode .card, body.retro-mode .stream-card, body.retro-mode .profile-header, body.retro-mode .chat-list-item, body.retro-mode .chat-view, body.retro-mode .modal-box {
    background: #f0f0f0 !important; color: black !important; border: 2px solid #000 !important; border-radius: 0 !important; box-shadow: none !important;
  }
  body.retro-mode .author, body.retro-mode .chat-name, body.retro-mode .profile-name, body.retro-mode .stat-val, body.retro-mode .modal-box h3 { color: #000080 !important; }
  body.retro-mode .bottom-nav { background: #c0c0c0 !important; border-top: 2px solid #fff; height: 60px; }
  body.retro-mode .nav-item { color: black !important; font-size: 10px; }
  body.retro-mode .btn { background: #c0c0c0 !important; color: black !important; border: 2px outset #fff !important; border-radius: 0 !important; }
  body.retro-mode .btn:active { border-style: inset !important; }
  body.retro-mode .msg.mine { background: #ffffcc !important; color: black !important; border: 1px solid #000; }
  body.retro-mode .msg.other { background: #e0e0e0 !important; color: black !important; border: 1px solid #000; }
  body.retro-mode .modal { background: rgba(0,0,0,0.5) !important; backdrop-filter: none !important; }
</style>
</head>
<body>

<!-- Визуальные эффекты -->
<div class="aurora-bg">
  <div class="aurora-blob"></div>
  <div class="aurora-blob"></div>
  <div class="aurora-blob"></div>
</div>
<canvas id="particleCanvas"></canvas>
<div class="magnetic-cursor" id="magneticCursor"></div>

<!-- Шапка -->
<header>
  <h1 id="siteTitle"> SpookyTok</h1>
  <input id="searchInput" placeholder="Поиск...">
  <div id="authArea"></div>
</header>

<!-- Контент -->
<div class="main-content">
  <!-- ЛЕНТА -->
  <div id="page-feed" class="page active">
    <div id="feed"></div>
  </div>
  
  <!-- СТРИМЫ -->
  <div id="page-streams" class="page">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <h2 style="color:var(--orange);">📺 Стримы</h2>
      <button class="btn" style="width:auto;padding:8px 16px;" onclick="openModal('streamModal')" id="startStreamBtn">+ Стрим</button>
    </div>
    <div id="streamsList"></div>
  </div>
  
  <!-- ЧАТЫ -->
  <div id="page-chats" class="page">
    <h2 style="color:var(--orange);margin-bottom:16px;">💬 Чаты</h2>
    <div id="chatsList"></div>
    <div id="chatViewContainer" style="display:none;"></div>
  </div>
  
  <!-- ПРОФИЛЬ -->
  <div id="page-profile" class="page">
    <div id="profileContent"></div>
  </div>
</div>

<!-- Нижняя навигация -->
<nav class="bottom-nav">
  <button class="nav-item active" data-page="feed"><span class="nav-icon">🏠</span><span>Лента</span></button>
  <button class="nav-item" data-page="streams"><span class="nav-icon">📺</span><span>Стримы</span></button>
  <button class="nav-item" data-page="chats"><span class="nav-icon">💬</span><span>Чаты</span></button>
  <button class="nav-item" data-page="profile"><span class="nav-icon">👤</span><span>Профиль</span></button>
</nav>

<!-- Модалки -->
<div id="uploadModal" class="modal">
  <div class="modal-box">
    <h3>👻 Загрузить</h3>
    <input type="file" id="fileInput" accept="video/*,image/*">
    <input type="text" id="captionInput" placeholder="Подпись...">
    <button class="btn" onclick="startUpload()">Загрузить</button>
    <button class="btn btn-secondary" onclick="closeModal('uploadModal')">Отмена</button>
  </div>
</div>

<div id="editProfileModal" class="modal">
  <div class="modal-box">
    <h3>✏️ Редактировать</h3>
    <label style="font-size:12px;color:var(--text-dim);">Имя</label>
    <input type="text" id="editDisplayName" maxlength="50">
    <label style="font-size:12px;color:var(--text-dim);">Ник (латиница, _)</label>
    <input type="text" id="editUsername" maxlength="30">
    <label style="font-size:12px;color:var(--text-dim);">О себе</label>
    <textarea id="editBio" rows="3" maxlength="500"></textarea>
    <button class="btn" onclick="saveProfile()">Сохранить</button>
    <button class="btn btn-secondary" onclick="closeModal('editProfileModal')">Отмена</button>
  </div>
</div>

<div id="streamModal" class="modal">
  <div class="modal-box">
    <h3> Начать стрим</h3>
    <input type="text" id="streamTitle" placeholder="Название">
    <textarea id="streamDesc" rows="2" placeholder="Описание"></textarea>
    <input type="text" id="streamUrl" placeholder="URL (YouTube embed)">
    <button class="btn" onclick="createStream()">Запустить</button>
    <button class="btn btn-secondary" onclick="closeModal('streamModal')">Отмена</button>
  </div>
</div>

<script>
// ===== ДЕТЕКТОР КНОПОЧНЫХ ТЕЛЕФОНОВ =====
if (/Nokia|Samsung|Opera Mini|J2ME|Android.*Mobile.*Opera|BlackBerry|IEMobile/i.test(navigator.userAgent) || window.innerWidth < 240) {
  document.body.classList.add('retro-mode');
}

// ===== ПЕРЕМЕННЫЕ =====
const ADMIN_NICK = 'vrema7760-cyber';
let currentUser = null;
let currentProfile = null;
let currentChatId = null;

// ===== ЧАСТИЦЫ (Canvas) =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function spawnParticles(x, y) {
  if (document.body.classList.contains('retro-mode')) return; // Отключаем на кнопочных
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1,
      color: ['#ff7518', '#7b2ff7', '#6dff8f', '#ff1493'][Math.floor(Math.random() * 4)],
      size: Math.random() * 4 + 2
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx; p.y += p.vy; p.life -= 0.02;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('pointerdown', e => {
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') spawnParticles(e.clientX, e.clientY);
});

// ===== МАГНИТНЫЙ КУРСОР =====
const cursor = document.getElementById('magneticCursor');
if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('button, a, .author, .chat-list-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

// ===== НАВИГАЦИЯ =====
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector('.nav-item[data-page="'+page+'"]').classList.add('active');
  
  if (page === 'feed') loadFeed();
  if (page === 'streams') loadStreams();
  if (page === 'chats') loadChats();
  if (page === 'profile') loadMyProfile();
}

document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.page)));

// ===== МОДАЛКИ =====
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// ===== АВТОРИЗАЦИЯ =====
async function init() {
  try {
    const res = await fetch('/api/me');
    if (res.ok) {
      currentUser = await res.json();
      document.getElementById('authArea').innerHTML = '<span style="color:var(--orange);font-weight:700;">@'+currentUser.name+'</span>';
    } else {
      document.getElementById('authArea').innerHTML = '<a href="/auth/github" style="color:var(--orange);text-decoration:none;">Войти</a>';
    }
  } catch(e) {}
  loadFeed();
}

// ===== ЛЕНТА =====
async function loadFeed() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim);">Загрузка...</div>';
  // Здесь должен быть fetch('/api/feed')
  // Для превью:
  feed.innerHTML = '<div style="text-align:center;padding:40px;">Лента пуста. Загрузи первое видео!</div>';
}

// ===== ПРОФИЛЬ =====
async function loadMyProfile() {
  if (!currentUser) {
    document.getElementById('profileContent').innerHTML = '<div style="text-align:center;padding:40px;">Войди, чтобы увидеть профиль</div>';
    return;
  }
  await showProfile(currentUser.id, true);
}

async function viewProfile(userId) {
  navigate('profile');
  await showProfile(userId, false);
}

async function showProfile(userId, isMe) {
  const el = document.getElementById('profileContent');
  el.innerHTML = '<div style="text-align:center;padding:40px;">Загрузка...</div>';
  
  // Здесь должен быть fetch('/api/profile/me') или '/api/profile/'+userId
  // Мок для превью:
  const p = { username: currentUser ? currentUser.name : 'user', display_name: 'Spooky User', bio: 'Люблю ужастики!', media_count: 12, streams_count: 2, is_me: isMe, user_id: userId };
  currentProfile = p;
  
  const actions = p.is_me 
    ? '<button class="btn" onclick="openModal(\'editProfileModal\')">✏️ Редактировать</button>'
    : '<button class="btn" onclick="openChatWithUser(\\\''+p.user_id+'\\\',\\\''+p.username+'\\\')">💬 Написать</button>';
  
  el.innerHTML = 
    '<div class="profile-header">'+
      '<div class="profile-avatar">👻</div>'+
      '<div class="profile-name">'+(p.display_name||p.username)+'</div>'+
      '<div class="profile-username">@'+p.username+'</div>'+
      '<div class="profile-bio">'+(p.bio||'')+'</div>'+
      '<div class="profile-stats">'+
        '<div><div class="stat-val">'+p.media_count+'</div><div class="stat-lbl">Постов</div></div>'+
        '<div><div class="stat-val">'+p.streams_count+'</div><div class="stat-lbl">Стримов</div></div>'+
      '</div>'+
      '<div style="display:flex;gap:10px;justify-content:center;">'+actions+'</div>'+
    '</div>'+
    '<h3 style="color:var(--orange);margin:20px 0 12px;">Контент</h3>'+
    '<div style="text-align:center;color:var(--text-dim);">Здесь будут посты пользователя</div>';
}

async function saveProfile() {
  const displayName = document.getElementById('editDisplayName').value.trim();
  const username = document.getElementById('editUsername').value.trim();
  const bio = document.getElementById('editBio').value.trim();
  
  // Здесь fetch('/api/profile/update') и fetch('/api/profile/username')
  alert('Профиль сохранён! (Нужен бэкенд)');
  closeModal('editProfileModal');
  loadMyProfile();
}

// ===== ЧАТЫ =====
async function loadChats() {
  if (!currentUser) {
    document.getElementById('chatsList').innerHTML = '<div style="text-align:center;padding:40px;">Войди для чатов</div>';
    return;
  }
  document.getElementById('chatsList').style.display = 'block';
  document.getElementById('chatViewContainer').style.display = 'none';
  document.getElementById('chatsList').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim);">Нет чатов. Кликни на ник в ленте!</div>';
}

async function openChatWithUser(userId, userName) {
  if (!currentUser) { alert('Войди сначала'); return; }
  // Здесь fetch('/api/chats/open')
  currentChatId = 'mock_chat_' + userId;
  document.getElementById('chatsList').style.display = 'none';
  const container = document.getElementById('chatViewContainer');
  container.style.display = 'block';
  container.innerHTML = 
    '<div class="chat-view">'+
      '<div style="padding:12px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">'+
        '<h3 style="color:var(--orange);margin:0;">@'+userName+'</h3>'+
        '<button class="btn btn-secondary" style="width:auto;padding:6px 12px;" onclick="loadChats()">← Назад</button>'+
      '</div>'+
      '<div class="chat-messages" id="chatMessages"><div style="text-align:center;color:var(--text-dim);padding:20px;">Начни разговор!</div></div>'+
      '<div class="chat-input-row">'+
        '<input id="chatInput" placeholder="Сообщение..." onkeydown="if(event.key===\'Enter\')sendMessage()">'+
        '<button class="btn" style="width:auto;margin:0;" onclick="sendMessage()"></button>'+
      '</div>'+
    '</div>';
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || !currentChatId) return;
  // Здесь fetch('/api/chats/'+currentChatId+'/messages')
  const el = document.getElementById('chatMessages');
  el.innerHTML += '<div class="msg mine">'+text+'</div>';
  input.value = '';
  el.scrollTop = el.scrollHeight;
}

// ===== СТРИМЫ =====
async function loadStreams() {
  document.getElementById('streamsList').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim);">Стримов пока нет</div>';
}

async function createStream() {
  const title = document.getElementById('streamTitle').value.trim();
  const url = document.getElementById('streamUrl').value.trim();
  if (!title || !url) { alert('Заполни поля'); return; }
  // Здесь fetch('/api/streams')
  alert('Стрим создан! (Нужен бэкенд)');
  closeModal('streamModal');
  loadStreams();
}

// ===== ЗАГРУЗКА МЕДИА =====
async function startUpload() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) return alert('Выбери файл');
  // Здесь логика сжатия и fetch('/api/upload')
  alert('Загрузка... (Нужен бэкенд)');
  closeModal('uploadModal');
}

// ===== ПАСХАЛКА =====
let clicks = 0;
document.getElementById('siteTitle').addEventListener('click', () => {
  clicks++;
  if (clicks === 5) {
    document.body.style.filter = 'hue-rotate(180deg)';
    for(let i=0; i<50; i++) spawnParticles(Math.random()*innerWidth, Math.random()*innerHeight);
    setTimeout(() => document.body.style.filter = '', 5000);
    clicks = 0;
  }
});

init();
</script>
</body>
</html>`;

export default INDEX_HTML;
