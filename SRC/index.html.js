const INDEX_HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#0d0714">
<title>🎃 HalloweenTok</title>
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
    --shadow: 0 8px 32px rgba(0,0,0,0.4);
    --shadow-hover: 0 12px 48px rgba(123,47,247,0.3);
  }
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  *::before, *::after { box-sizing: border-box; }
  
  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    -webkit-tap-highlight-color: transparent;
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
  
  .particle {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    animation: particleFloat 1.2s ease-out forwards;
  }
  
  .emoji-particle {
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    font-size: 28px;
    animation: emojiFloat 1.8s ease-out forwards;
  }
  
  @keyframes particleFloat {
    0% { opacity: 1; transform: translate(0,0) scale(1) rotate(0deg); }
    100% { opacity: 0; transform: translate(var(--tx),var(--ty)) scale(0) rotate(360deg); }
  }
  
  @keyframes emojiFloat {
    0% { opacity: 1; transform: translate(0,0) scale(0) rotate(0deg); }
    20% { transform: translate(0,0) scale(1.8) rotate(72deg); }
    100% { opacity: 0; transform: translate(var(--tx),calc(var(--ty) - 120px)) scale(0.3) rotate(360deg); }
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
    text-shadow: 0 0 20px var(--orange-glow);
    white-space: nowrap;
    letter-spacing: -0.5px;
    animation: titleGlow 3s ease-in-out infinite;
  }
  
  @keyframes titleGlow {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.3); }
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
    transition: all 0.3s ease;
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
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(123,47,247,0.3);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }
  
  button:hover, .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(123,47,247,0.5);
  }
  
  button:active, .btn:active { transform: translateY(0); }
  
  .btn-logout {
    background: #333;
    padding: 8px 14px;
    font-size: 12px;
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
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
    animation: fadeInUp 0.5s ease;
    position: relative;
  }
  
  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
    transition: left 0.6s;
    pointer-events: none;
    z-index: 1;
  }
  
  .card:hover::before { left: 100%; }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
    border-color: var(--purple);
  }
  
  .card video, .card img {
    width: 100%;
    display: block;
    background: black;
    max-height: 640px;
    object-fit: contain;
  }
  
  .card-body { padding: 16px 20px; }
  
  .author {
    font-weight: 700;
    color: var(--orange);
    font-size: 15px;
    display: block;
    margin-bottom: 6px;
  }
  
  .card-body div:last-child {
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
  }
  
  .actions span {
    cursor: pointer;
    font-size: 15px;
    transition: all 0.2s ease;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .actions span:hover {
    transform: scale(1.1);
  }
  
  .actions span:active { transform: scale(0.95); }
  
  .actions span.liked {
    color: var(--red);
    animation: likePulse 0.4s ease;
  }
  
  @keyframes likePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.5); }
    100% { transform: scale(1); }
  }
  
  .comments {
    padding: 12px 20px;
    font-size: 14px;
    color: var(--text-dim);
  }
  
  .comments div { padding: 6px 0; line-height: 1.5; }
  .comments b { color: var(--orange); font-weight: 600; }
  
  .comment-input {
    display: flex;
    gap: 8px;
    padding: 12px 20px 16px;
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
    transition: all 0.3s ease;
  }
  
  .comment-input input:focus {
    border-color: var(--purple);
    box-shadow: 0 0 0 3px var(--purple-glow);
  }
  
  .delete-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255,68,68,0.9);
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 700;
    font-size: 13px;
    z-index: 10;
    opacity: 0;
    transition: all 0.3s;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 16px rgba(255,68,68,0.4);
  }
  
  .card:hover .delete-btn { opacity: 1; }
  
  .delete-btn:hover {
    background: var(--red);
    transform: scale(1.1);
    box-shadow: 0 4px 20px rgba(255,68,68,0.6);
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
    transition: all 0.3s ease;
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
  
  #uploadModal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.9);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  #uploadModal .box {
    background: var(--card);
    padding: 28px;
    border-radius: 24px;
    width: 100%;
    max-width: 440px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-hover);
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  #uploadModal h3 {
    color: var(--orange);
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: 700;
  }
  
  #uploadModal input[type="file"] {
    width: 100%;
    padding: 12px;
    background: var(--bg);
    border: 2px dashed var(--purple);
    border-radius: 16px;
    color: var(--text);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  #uploadModal input[type="file"]:hover {
    border-color: var(--orange);
    background: var(--card-hover);
  }
  
  #uploadModal input[type="text"] {
    width: 100%;
    margin-top: 12px;
    padding: 12px 16px;
    border-radius: 16px;
    border: 2px solid var(--border);
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    outline: none;
    transition: all 0.3s ease;
  }
  
  #uploadModal input[type="text"]:focus {
    border-color: var(--purple);
    box-shadow: 0 0 0 3px var(--purple-glow);
  }
  
  #uploadModal button { margin-top: 16px; width: 100%; }
  
  #progressLog {
    font-size: 13px;
    color: var(--text-dim);
    max-height: 150px;
    overflow-y: auto;
    margin-top: 16px;
    padding: 12px;
    background: var(--bg);
    border-radius: 12px;
    border: 1px solid var(--border);
  }
  
  #progressLog div {
    padding: 4px 0;
    animation: fadeIn 0.3s ease;
  }
  
  @media (max-width: 640px) {
    header { padding: 12px 16px; flex-wrap: wrap; }
    header h1 { font-size: 20px; order: 1; }
    #authArea { order: 2; margin-left: auto; }
    header input { order: 3; width: 100%; max-width: 100%; margin-top: 10px; }
    #feed { padding: 16px 12px 100px; }
    .card { margin-bottom: 20px; border-radius: 16px; }
    .card-body { padding: 14px 16px; }
    .actions { padding: 12px 16px; gap: 16px; }
    .comments { padding: 12px 16px; }
    .comment-input { padding: 12px 16px 16px; }
    .fab { bottom: 20px; right: 20px; font-size: 28px; padding: 14px 18px; }
    #uploadModal .box { padding: 24px 20px; }
    .delete-btn { opacity: 1; }
  }
  
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--purple); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--orange); }
  
  .loading {
    text-align: center;
    padding: 40px;
    color: var(--text-dim);
  }
  
  .loading::after {
    content: '🎃';
    display: inline-block;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
</head>
<body>
<header>
  <h1>🎃 HalloweenTok</h1>
  <input id="searchInput" placeholder="🔍 Поиск жутких видео...">
  <div id="authArea"></div>
</header>

<div id="feed"></div>
<button class="fab" onclick="openUploadModal()" title="Загрузить">👻</button>

<div id="uploadModal">
  <div class="box">
    <h3>👻 Загрузить контент</h3>
    <input type="file" id="fileInput" accept="video/*,image/*">
    <input type="text" id="captionInput" placeholder="✨ Подпись к контенту...">
    <div style="margin-top:16px;display:flex;gap:10px;">
      <button onclick="startUpload()" style="flex:1;">🚀 Загрузить</button>
      <button onclick="closeUploadModal()" style="flex:1;background:#333;">❌ Отмена</button>
    </div>
    <div id="progressLog"></div>
  </div>
</div>

<script>
const MAX_VIDEO_BYTES = 3 * 1024 * 1024;
const MAX_PHOTO_BYTES = 0.5 * 1024 * 1024;
const ADMIN_NICK = 'vrema7760-cyber';
const HALLOWEEN_EMOJIS = ['','👻','🦇','️','💀','🧟','✨','💜','🧡'];
const PARTICLE_COLORS = ['#ff7518','#7b2ff7','#6dff8f','#ff1493','#00ffff'];

const COMPRESS_LADDER = [
  { height: 720, fps: 60, kbps: 800 },
  { height: 720, fps: 60, kbps: 400 },
  { height: 720, fps: 30, kbps: 400 },
  { height: 480, fps: 30, kbps: 400 },
  { height: 480, fps: 30, kbps: 100 },
];

let currentUser = null;

function createParticle(x, y) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 10 + 5;
  const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
  p.style.cssText = \`left:\${x}px;top:\${y}px;width:\${size}px;height:\${size}px;background:\${color};border-radius:50%;box-shadow:0 0 \${size*2}px \${color};--tx:\${(Math.random()-0.5)*250}px;--ty:\${(Math.random()-0.5)*250}px;\`;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 1200);
}

function createEmoji(x, y) {
  const e = document.createElement('div');
  e.className = 'emoji-particle';
  e.textContent = HALLOWEEN_EMOJIS[Math.floor(Math.random() * HALLOWEEN_EMOJIS.length)];
  e.style.cssText = \`left:\${x}px;top:\${y}px;--tx:\${(Math.random()-0.5)*200}px;--ty:\${-Math.random()*250-150}px;\`;
  document.body.appendChild(e);
  setTimeout(() => e.remove(), 1800);
}

function spawn(x, y) {
  for(let i=0; i<10; i++) setTimeout(() => createParticle(x, y), i*40);
  for(let i=0; i<3; i++) setTimeout(() => createEmoji(x, y), i*80);
}

document.addEventListener('click', e => spawn(e.clientX, e.clientY));
document.addEventListener('touchstart', e => {
  for(let t of e.touches) spawn(t.clientX, t.clientY);
}, {passive:true});

function log(msg) {
  const el = document.getElementById('progressLog');
  el.innerHTML += '<div>' + msg + '</div>';
  el.scrollTop = el.scrollHeight;
}

function openUploadModal() { document.getElementById('uploadModal').style.display = 'flex'; }
function closeUploadModal() { document.getElementById('uploadModal').style.display = 'none'; document.getElementById('progressLog').innerHTML = ''; }

async function compressPhoto(file) {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 1080 / Math.max(img.width, img.height));
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.75));
}

async function compressVideo(file) {
  const video = await loadVideo(file);
  const duration = video.duration || 10;
  log('🎬 Оригинал: ' + (file.size/1024/1024).toFixed(2) + 'MB, ' + duration.toFixed(1) + 'с');
  for (let i = 0; i < COMPRESS_LADDER.length; i++) {
    const step = COMPRESS_LADDER[i];
    log('🎬 ' + step.height + 'p @ ' + step.fps + 'fps @ ' + step.kbps + 'kbps...');
    const blob = await recodeVideo(video, step.height, step.fps, step.kbps * 1000);
    log('  → ' + (blob.size/1024/1024).toFixed(2) + 'MB');
    if (blob.size <= MAX_VIDEO_BYTES) {
      return { blob, resolution: step.height + 'p', fps: step.fps, bitrate_kbps: step.kbps };
    }
  }
  const last = COMPRESS_LADDER[COMPRESS_LADDER.length - 1];
  const blob = await recodeVideo(video, last.height, last.fps, last.kbps * 1000);
  return { blob, resolution: last.height + 'p', fps: last.fps, bitrate_kbps: last.kbps };
}

function loadImage(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

function loadVideo(file) {
  return new Promise((res, rej) => {
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.onloadedmetadata = () => res(v);
    v.onerror = rej;
    v.src = URL.createObjectURL(file);
  });
}

function recodeVideo(video, height, fps, videoBitsPerSecond) {
  return new Promise(async (resolve) => {
    const scale = height / video.videoHeight;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const stream = canvas.captureStream(fps);
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond });
    const chunks = [];
    rec.ondataavailable = e => { if(e.data.size>0) chunks.push(e.data); };
    rec.onstop = () => resolve(new Blob(chunks, {type:mime}));
    video.currentTime = 0;
    await video.play();
    rec.start();
    let lastFrame = 0;
    const frameInterval = 1000 / fps;
    function draw(now) {
      if(video.paused || video.ended) { rec.stop(); return; }
      if(now - lastFrame >= frameInterval) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        lastFrame = now;
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    video.onended = () => { try{rec.stop();}catch(e){} };
  });
}

function blobToBase64(blob) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(',')[1]);
    r.readAsDataURL(blob);
  });
}

async function startUpload() {
  const file = document.getElementById('fileInput').files[0];
  const caption = document.getElementById('captionInput').value;
  if(!file) return alert('Выбери файл');
  log(' Начинаю сжатие...');
  const isVideo = file.type.startsWith('video/');
  let payload;
  if(isVideo) {
    const { blob, resolution, fps, bitrate_kbps } = await compressVideo(file);
    payload = { type:'video', mime:blob.type, base64:await blobToBase64(blob), caption, resolution, fps, bitrate_kbps };
    log('✅ Видео сжато: ' + (blob.size/1024/1024).toFixed(2) + 'MB');
  } else {
    const blob = await compressPhoto(file);
    payload = { type:'photo', mime:'image/jpeg', base64:await blobToBase64(blob), caption };
    log('✅ Фото сжато: ' + (blob.size/1024).toFixed(0) + 'KB');
  }
  log('📤 Загрузка...');
  const res = await fetch('/api/upload', {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)
  });
  const data = await res.json();
  if(data.error) { log('❌ ' + data.error); return; }
  log('✅ Готово!');
  closeUploadModal();
  loadFeed();
}

async function loadFeed() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '<div class="loading">Загружаю ленту...</div>';
  try {
    const res = await fetch('/api/feed');
    const data = await res.json();
    feed.innerHTML = '';
    if(!data.items || data.items.length === 0) {
      feed.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--text-dim);">👻 Пока пусто. Будь первым, кто загрузит контент!</div>';
      return;
    }
    for(const item of data.items) feed.appendChild(renderCard(item));
  } catch(e) {
    feed.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--red);">❌ Ошибка загрузки</div>';
  }
}

function renderCard(item) {
  const div = document.createElement('div');
  div.className = 'card';
  const isOwner = currentUser && (item.author_name === currentUser || item.author_name === ADMIN_NICK);
  const deleteBtn = isOwner ? '<button class="delete-btn" onclick="event.stopPropagation();deleteMedia(\\\'' + item.id + '\\\')">🗑️ Удалить</button>' : '';
  const media = item.type === 'video' 
    ? '<video src="/api/media/' + item.id + '/content" controls loop playsinline></video>'
    : '<img src="/api/media/' + item.id + '/content" loading="lazy">';
  div.innerHTML = \`
    \${deleteBtn}
    \${media}
    <div class="card-body">
      <span class="author">@\${item.author_name}</span>
      <div>\${item.caption || ''}</div>
    </div>
    <div class="actions">
      <span onclick="event.stopPropagation();toggleLike('\${item.id}', this)" data-liked="\${item.is_liked || false}">❤️ \${item.likes_count || 0}</span>
      <span onclick="event.stopPropagation();toggleSave('\${item.id}', this)">🔖 \${item.saves_count || 0}</span>
      <span>💬 \${item.comments_count || 0}</span>
    </div>
    <div class="comments" id="comments-\${item.id}"></div>
    <div class="comment-input">
      <input placeholder="Оставь жуткий коммент..." onkeydown="event.stopPropagation();if(event.key==='Enter')sendComment('\${item.id}',this)">
    </div>
  \`;
  loadComments(item.id);
  return div;
}

async function toggleLike(id, el) {
  const wasLiked = el.dataset.liked === 'true';
  const res = await fetch('/api/media/' + id + '/like', {method:'POST'});
  const data = await res.json();
  el.dataset.liked = data.liked;
  el.textContent = (data.liked ? '❤️' : '❤️ ') + data.likes_count;
  if(data.liked && !wasLiked) {
    el.classList.add('liked');
    setTimeout(() => el.classList.remove('liked'), 400);
  }
}

async function toggleSave(id, el) {
  await fetch('/api/media/' + id + '/save', {method:'POST'});
  loadFeed();
}

async function deleteMedia(id) {
  if(!confirm('Удалить это видео?')) return;
  const res = await fetch('/api/media/' + id, {method:'DELETE'});
  if(res.ok) { loadFeed(); }
  else { const data = await res.json(); alert('Ошибка: ' + (data.error || 'неизвестная')); }
}

async function loadComments(mediaId) {
  const res = await fetch('/api/media/' + mediaId + '/comments');
  const data = await res.json();
  const el = document.getElementById('comments-' + mediaId);
  if(!el) return;
  if(!data.items || data.items.length === 0) {
    el.innerHTML = '<div style="color:var(--text-dim);font-style:italic;">Пока нет комментариев...</div>';
    return;
  }
  el.innerHTML = data.items.map(c => '<div><b>@' + c.author_name + ':</b> ' + c.text + '</div>').join('');
}

async function sendComment(mediaId, input) {
  const text = input.value.trim();
  if(!text) return;
  await fetch('/api/media/' + mediaId + '/comments', {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text})
  });
  input.value = '';
  loadComments(mediaId);
}

document.getElementById('searchInput').addEventListener('input', debounce(async e => {
  const q = e.target.value.trim();
  if(!q) return loadFeed();
  const res = await fetch('/api/search?q=' + encodeURIComponent(q));
  const data = await res.json();
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  if(!data.media || data.media.length === 0) {
    feed.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--text-dim);"> Ничего не найдено</div>';
    return;
  }
  for(const item of data.media) feed.appendChild(renderCard(item));
}, 400));

function debounce(fn, ms) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

async function initAuth() {
  try {
    const res = await fetch('/api/me');
    if(res.ok) {
      const user = await res.json();
      currentUser = user.name;
      document.getElementById('authArea').innerHTML = 
        '<span style="color:var(--orange);font-weight:700;font-size:14px;">👤 @' + user.name + '</span>' +
        '<button class="btn-logout" onclick="logout()">Выйти</button>';
    } else {
      document.getElementById('authArea').innerHTML = '<a class="btn" href="/auth/github"> Войти</a>';
    }
  } catch(e) {
    document.getElementById('authArea').innerHTML = '<a class="btn" href="/auth/github">🐙 Войти</a>';
  }
  loadFeed();
}

function logout() {
  document.cookie = 'session=; Max-Age=0; path=/';
  location.reload();
}

initAuth();
</script>
</body>
</html>`;

export default INDEX_HTML;
