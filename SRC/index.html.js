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
    --bg-gradient: linear-gradient(135deg, #0d0714 0%, #1a0f26 100%);
    --card: #1a0f26;
    --card-hover: #231538;
    --orange: #ff7518;
    --orange-glow: rgba(255, 117, 24, 0.4);
    --purple: #7b2ff7;
    --purple-glow: rgba(123, 47, 247, 0.4);
    --green: #6dff8f;
    --text: #f3e9ff;
    --text-dim: #a89bb8;
    --border: #2a1a3a;
    --shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    --shadow-hover: 0 12px 48px rgba(123, 47, 247, 0.3);
  }
  
  * { 
    box-sizing: border-box; 
    margin: 0;
    padding: 0;
  }
  
  *::before, *::after {
    box-sizing: border-box;
  }
  
  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }
  
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 10%, var(--purple-glow), transparent 40%),
      radial-gradient(circle at 80% 90%, var(--orange-glow), transparent 40%);
    pointer-events: none;
    z-index: 0;
  }
  
  /* Particle Effects */
  .particle {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    animation: particleFloat 1.5s ease-out forwards;
  }
  
  .emoji-particle {
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    font-size: 24px;
    animation: emojiFloat 2s ease-out forwards;
  }
  
  @keyframes particleFloat {
    0% {
      opacity: 1;
      transform: translate(0, 0) scale(1) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg);
    }
  }
  
  @keyframes emojiFloat {
    0% {
      opacity: 1;
      transform: translate(0, 0) scale(0) rotate(0deg);
    }
    10% {
      transform: translate(0, 0) scale(1.5) rotate(36deg);
    }
    100% {
      opacity: 0;
      transform: translate(var(--tx), calc(var(--ty) - 100px)) scale(0.5) rotate(360deg);
    }
  }
  
  /* Header */
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: rgba(13, 7, 20, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 100;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  header h1 {
    font-size: 24px;
    font-weight: 800;
    color: var(--orange);
    text-shadow: 0 0 20px var(--orange-glow);
    white-space: nowrap;
    letter-spacing: -0.5px;
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
  
  header input::placeholder {
    color: var(--text-dim);
  }
  
  #authArea {
    display: flex;
    align-items: center;
  }
  
  /* Buttons */
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
    box-shadow: 0 4px 16px rgba(123, 47, 247, 0.3);
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
    box-shadow: 0 6px 24px rgba(123, 47, 247, 0.5);
  }
  
  button:active, .btn:active {
    transform: translateY(0);
  }
  
  /* Feed */
  #feed {
    max-width: 540px;
    margin: 0 auto;
    padding: 20px 16px 100px;
    position: relative;
    z-index: 1;
  }
  
  /* Cards */
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    margin-bottom: 24px;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
    animation: fadeInUp 0.5s ease;
  }
  
  .card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
    border-color: var(--purple);
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .card video, .card img {
    width: 100%;
    display: block;
    background: black;
    max-height: 640px;
    object-fit: contain;
  }
  
  .card-body {
    padding: 16px 20px;
  }
  
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
  
  /* Actions */
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
  
  .actions span:active {
    transform: scale(0.95);
  }
  
  /* Comments */
  .comments {
    padding: 12px 20px;
    font-size: 14px;
    color: var(--text-dim);
  }
  
  .comments div {
    padding: 6px 0;
    line-height: 1.5;
  }
  
  .comments b {
    color: var(--orange);
    font-weight: 600;
  }
  
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
  
  /* Upload Modal */
  #uploadModal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
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
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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
  
  #uploadModal button {
    margin-top: 16px;
    width: 100%;
  }
  
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
  
  /* FAB */
  .fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    font-size: 32px;
    padding: 16px 20px;
    border-radius: 50%;
    box-shadow: 0 8px 32px rgba(255, 117, 24, 0.5);
    z-index: 50;
    transition: all 0.3s ease;
  }
  
  .fab:hover {
    transform: scale(1.1) rotate(10deg);
    box-shadow: 0 12px 40px rgba(255, 117, 24, 0.7);
  }
  
  /* Mobile Optimizations */
  @media (max-width: 640px) {
    header {
      padding: 12px 16px;
      flex-wrap: wrap;
    }
    
    header h1 {
      font-size: 20px;
      order: 1;
    }
    
    #authArea {
      order: 2;
      margin-left: auto;
    }
    
    header input {
      order: 3;
      width: 100%;
      max-width: 100%;
      margin-top: 10px;
    }
    
    #feed {
      padding: 16px 12px 100px;
    }
    
    .card {
      margin-bottom: 20px;
      border-radius: 16px;
    }
    
    .card-body {
      padding: 14px 16px;
    }
    
    .actions {
      padding: 12px 16px;
      gap: 16px;
    }
    
    .comments {
      padding: 12px 16px;
    }
    
    .comment-input {
      padding: 12px 16px 16px;
    }
    
    .fab {
      bottom: 20px;
      right: 20px;
      font-size: 28px;
      padding: 14px 18px;
    }
    
    #uploadModal .box {
      padding: 24px 20px;
    }
  }
  
  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--bg);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--purple);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--orange);
  }
  
  /* Loading state */
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

// Halloween emojis for particles
const HALLOWEEN_EMOJIS = ['🎃', '👻', '🦇', '🕷️', '🕸️', '💀', '🧟', '', '', '', '✨', '💜', '🧡'];
const PARTICLE_COLORS = ['#ff7518', '#7b2ff7', '#6dff8f', '#ff1493', '#00ffff', '#ffff00'];

function log(msg) {
  const el = document.getElementById('progressLog');
  el.innerHTML += '<div>' + msg + '</div>';
  el.scrollTop = el.scrollHeight;
}

// Particle Effects System
function createParticle(x, y) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 8 + 4;
  const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
  const tx = (Math.random() - 0.5) * 200;
  const ty = (Math.random() - 0.5) * 200;
  
  particle.style.cssText = \`
    left: \${x}px;
    top: \${y}px;
    width: \${size}px;
    height: \${size}px;
    background: \${color};
    border-radius: 50%;
    box-shadow: 0 0 \${size * 2}px \${color};
    --tx: \${tx}px;
    --ty: \${ty}px;
  \`;
  
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 1500);
}

function createEmojiParticle(x, y) {
  const emoji = document.createElement('div');
  emoji.className = 'emoji-particle';
  emoji.textContent = HALLOWEEN_EMOJIS[Math.floor(Math.random() * HALLOWEEN_EMOJIS.length)];
  
  const tx = (Math.random() - 0.5) * 150;
  const ty = -Math.random() * 200 - 100;
  
  emoji.style.cssText = \`
    left: \${x}px;
    top: \${y}px;
    --tx: \${tx}px;
    --ty: \${ty}px;
  \`;
  
  document.body.appendChild(emoji);
  setTimeout(() => emoji.remove(), 2000);
}

function spawnParticles(x, y, count = 8) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => createParticle(x, y), i * 50);
  }
  
  // Spawn 2-3 emojis
  const emojiCount = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < emojiCount; i++) {
    setTimeout(() => createEmojiParticle(x, y), i * 100);
  }
}

// Click/Touch handler for particles
function handleInteraction(e) {
  const touches = e.touches || [e];
  
  for (const touch of touches) {
    const x = touch.clientX;
    const y = touch.clientY;
    spawnParticles(x, y, 6);
  }
}

// Add event listeners
document.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', handleInteraction, { passive: true });

function openUploadModal() { 
  document.getElementById('uploadModal').style.display = 'flex'; 
}

function closeUploadModal() { 
  document.getElementById('uploadModal').style.display = 'none'; 
  document.getElementById('progressLog').innerHTML = ''; 
}

// ---------- Сжатие фото ----------
async function compressPhoto(file) {
  const img = await loadImage(file);
  let quality = 0.85, maxDim = 1280;
  for (let attempt = 0; attempt < 8; attempt++) {
    const blob = await drawAndExport(img, maxDim, quality);
    log('📸 Фото: ' + maxDim + 'px, качество ' + quality.toFixed(2) + ' → ' + (blob.size/1024).toFixed(0) + 'KB');
    if (blob.size <= MAX_PHOTO_BYTES) return blob;
    quality -= 0.15;
    if (quality < 0.35) { quality = 0.85; maxDim = Math.floor(maxDim * 0.75); }
  }
  return await drawAndExport(img, 480, 0.4);
}

function loadImage(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

function drawAndExport(img, maxDim, quality) {
  return new Promise((res) => {
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => res(blob), 'image/jpeg', quality);
  });
}

// ---------- Сжатие видео ----------
const RES_LADDER = [720, 480];
const BITRATE_LADDER = [800, 400, 100];

async function compressVideo(file) {
  const video = await loadVideo(file);
  for (const targetHeight of RES_LADDER) {
    for (const kbps of BITRATE_LADDER) {
      log('🎬 Видео: пробую ' + targetHeight + 'p @ ' + kbps + 'kbps...');
      const blob = await recodeVideo(video, targetHeight, kbps * 1000);
      log('  → получилось ' + (blob.size/1024/1024).toFixed(2) + 'MB');
      if (blob.size <= MAX_VIDEO_BYTES) {
        return { blob, resolution: targetHeight + 'p', bitrate_kbps: kbps };
      }
    }
  }
  const blob = await recodeVideo(video, 480, 100000);
  return { blob, resolution: '480p', bitrate_kbps: 100 };
}

function loadVideo(file) {
  return new Promise((res, rej) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.onloadedmetadata = () => res(video);
    video.onerror = rej;
    video.src = URL.createObjectURL(file);
  });
}

function recodeVideo(video, targetHeight, videoBitsPerSecond) {
  return new Promise(async (resolve, reject) => {
    const scale = targetHeight / video.videoHeight;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(30);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond });
    const chunks = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    recorder.onerror = reject;

    video.currentTime = 0;
    await video.play().catch(()=>{});
    recorder.start();

    function drawFrame() {
      if (video.paused || video.ended) { recorder.stop(); return; }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawFrame);
    }
    drawFrame();

    video.onended = () => { try { recorder.stop(); } catch(e){} };
  });
}

function blobToBase64(blob) {
  return new Promise((res) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
}

async function startUpload() {
  const file = document.getElementById('fileInput').files[0];
  const caption = document.getElementById('captionInput').value;
  if (!file) return alert('Выбери файл');

  const isVideo = file.type.startsWith('video/');
  let payload;

  if (isVideo) {
    const { blob, resolution, bitrate_kbps } = await compressVideo(file);
    if (blob.size > MAX_VIDEO_BYTES) log('⚠️ Не удалось уложиться в 3MB, грузим как есть.');
    payload = {
      type: 'video', mime: blob.type, base64: await blobToBase64(blob),
      caption, resolution, bitrate_kbps,
    };
  } else {
    const blob = await compressPhoto(file);
    payload = { type: 'photo', mime: 'image/jpeg', base64: await blobToBase64(blob), caption };
  }

  log('🚀 Загружаю на сервер...');
  const res = await fetch('/api/upload', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (data.error) { log('❌ Ошибка: ' + data.error); return; }
  log('✅ Готово!');
  closeUploadModal();
  loadFeed();
}

// ---------- Лента ----------
async function loadFeed() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '<div class="loading">Загружаю ленту...</div>';
  
  try {
    const res = await fetch('/api/feed');
    const data = await res.json();
    feed.innerHTML = '';
    
    if (!data.items || data.items.length === 0) {
      feed.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--text-dim);">👻 Пока пусто. Будь первым, кто загрузит контент!</div>';
      return;
    }
    
    for (const item of data.items) {
      feed.appendChild(renderCard(item));
    }
  } catch (err) {
    feed.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--orange);">❌ Ошибка загрузки</div>';
  }
}

function renderCard(item) {
  const div = document.createElement('div');
  div.className = 'card';
  const media = item.type === 'video'
    ? '<video src="/api/media/' + item.id + '/content" controls loop playsinline></video>'
    : '<img src="/api/media/' + item.id + '/content" loading="lazy">';
  div.innerHTML = \`
    \${media}
    <div class="card-body">
      <span class="author">@\${item.author_name}</span>
      <div>\${item.caption || ''}</div>
    </div>
    <div class="actions">
      <span onclick="toggleLike('\${item.id}', this)">❤️ \${item.likes_count}</span>
      <span onclick="toggleSave('\${item.id}', this)">🔖 \${item.saves_count}</span>
      <span>💬 \${item.comments_count}</span>
    </div>
    <div class="comments" id="comments-\${item.id}"></div>
    <div class="comment-input">
      <input placeholder="Оставь жуткий коммент..." onkeydown="if(event.key==='Enter') sendComment('\${item.id}', this)">
    </div>
  \`;
  loadComments(item.id);
  return div;
}

async function toggleLike(id, el) {
  const res = await fetch('/api/media/' + id + '/like', { method: 'POST' });
  const data = await res.json();
  el.textContent = (data.liked ? '❤️‍🔥 ' : '❤️ ') + data.likes_count;
}

async function toggleSave(id, el) {
  await fetch('/api/media/' + id + '/save', { method: 'POST' });
  const res = await fetch('/api/media/' + id + '/content');
  loadFeed();
}

async function loadComments(mediaId) {
  const res = await fetch('/api/media/' + mediaId + '/comments');
  const data = await res.json();
  const el = document.getElementById('comments-' + mediaId);
  if (!el) return;
  if (!data.items || data.items.length === 0) {
    el.innerHTML = '<div style="color:var(--text-dim);font-style:italic;">Пока нет комментариев...</div>';
    return;
  }
  el.innerHTML = data.items.map(c => '<div><b>@' + c.author_name + ':</b> ' + c.text + '</div>').join('');
}

async function sendComment(mediaId, input) {
  const text = input.value.trim();
  if (!text) return;
  await fetch('/api/media/' + mediaId + '/comments', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }),
  });
  input.value = '';
  loadComments(mediaId);
}

// ---------- Поиск ----------
document.getElementById('searchInput').addEventListener('input', debounce(async (e) => {
  const q = e.target.value.trim();
  if (!q) return loadFeed();
  const res = await fetch('/api/search?q=' + encodeURIComponent(q));
  const data = await res.json();
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  if (!data.media || data.media.length === 0) {
    feed.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--text-dim);">🔍 Ничего не найдено</div>';
    return;
  }
  for (const item of data.media) feed.appendChild(renderCard(item));
}, 400));

function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ---------- Auth ----------
document.getElementById('authArea').innerHTML = '<a class="btn" href="/auth/github">🐙 Войти через GitHub</a>';

loadFeed();
</script>
</body>
</html>`;

export default INDEX_HTML;
