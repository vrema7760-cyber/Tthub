const INDEX_HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>🎃 HalloweenTok</title>
<style>
  :root {
    --bg: #0d0714;
    --card: #1a0f26;
    --orange: #ff7518;
    --purple: #7b2ff7;
    --green: #6dff8f;
    --text: #f3e9ff;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--text);
    font-family: 'Segoe UI', system-ui, sans-serif;
    background-image:
      radial-gradient(circle at 20% 10%, rgba(123,47,247,0.25), transparent 40%),
      radial-gradient(circle at 80% 90%, rgba(255,117,24,0.2), transparent 40%);
  }
  header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border-bottom: 1px solid #2a1a3a; position: sticky; top: 0;
    background: rgba(13,7,20,0.9); backdrop-filter: blur(6px); z-index: 10;
  }
  header h1 { font-size: 20px; margin: 0; color: var(--orange); text-shadow: 0 0 8px rgba(255,117,24,0.6); }
  header input {
    background: var(--card); border: 1px solid var(--purple); color: var(--text);
    border-radius: 20px; padding: 6px 14px; width: 40%;
  }
  button, .btn {
    background: linear-gradient(135deg, var(--purple), var(--orange));
    border: none; color: white; padding: 8px 16px; border-radius: 20px;
    cursor: pointer; font-weight: 600;
  }
  #feed { max-width: 480px; margin: 0 auto; padding: 12px; }
  .card {
    background: var(--card); border: 1px solid #2a1a3a; border-radius: 16px;
    margin-bottom: 16px; overflow: hidden;
  }
  .card video, .card img { width: 100%; display: block; background: black; max-height: 640px; object-fit: contain; }
  .card-body { padding: 10px 14px; }
  .author { font-weight: 600; color: var(--orange); }
  .actions { display: flex; gap: 16px; padding: 8px 14px; }
  .actions span { cursor: pointer; }
  .comments { padding: 0 14px 10px; font-size: 14px; opacity: 0.9; }
  .comment-input { display: flex; gap: 6px; padding: 0 14px 12px; }
  .comment-input input { flex: 1; border-radius: 12px; border: 1px solid var(--purple); background: #120a1c; color: var(--text); padding: 6px 10px; }
  #uploadModal {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none;
    align-items: center; justify-content: center; z-index: 50;
  }
  #uploadModal .box { background: var(--card); padding: 20px; border-radius: 16px; width: 90%; max-width: 420px; }
  #progressLog { font-size: 12px; opacity: 0.8; max-height: 120px; overflow-y: auto; margin-top: 8px; }
  .fab { position: fixed; bottom: 20px; right: 20px; font-size: 28px; padding: 14px 18px; border-radius: 50%; }
</style>
</head>
<body>
<header>
  <h1>🎃 HalloweenTok</h1>
  <input id="searchInput" placeholder="Поиск жутких видео...">
  <div id="authArea"></div>
</header>

<div id="feed"></div>
<button class="fab" onclick="openUploadModal()">👻+</button>

<div id="uploadModal">
  <div class="box">
    <h3>Загрузить видео/фото</h3>
    <input type="file" id="fileInput" accept="video/*,image/*">
    <input type="text" id="captionInput" placeholder="Подпись..." style="width:100%;margin-top:8px;padding:6px;border-radius:8px;border:1px solid var(--purple);background:#120a1c;color:var(--text);">
    <div style="margin-top:10px;display:flex;gap:8px;">
      <button onclick="startUpload()">Сжать и загрузить</button>
      <button onclick="closeUploadModal()" style="background:#333;">Отмена</button>
    </div>
    <div id="progressLog"></div>
  </div>
</div>

<script>
const MAX_VIDEO_BYTES = 3 * 1024 * 1024;
const MAX_PHOTO_BYTES = 0.5 * 1024 * 1024;

function log(msg) {
  const el = document.getElementById('progressLog');
  el.innerHTML += '<div>' + msg + '</div>';
  el.scrollTop = el.scrollHeight;
}

function openUploadModal() { document.getElementById('uploadModal').style.display = 'flex'; }
function closeUploadModal() { document.getElementById('uploadModal').style.display = 'none'; document.getElementById('progressLog').innerHTML = ''; }

// ---------- Лестница сжатия фото ----------
async function compressPhoto(file) {
  const img = await loadImage(file);
  let quality = 0.85, maxDim = 1280;
  for (let attempt = 0; attempt < 8; attempt++) {
    const blob = await drawAndExport(img, maxDim, quality);
    log('Фото: ' + maxDim + 'px, качество ' + quality.toFixed(2) + ' → ' + (blob.size/1024).toFixed(0) + 'KB');
    if (blob.size <= MAX_PHOTO_BYTES) return blob;
    quality -= 0.15;
    if (quality < 0.35) { quality = 0.85; maxDim = Math.floor(maxDim * 0.75); }
  }
  return await drawAndExport(img, 480, 0.4); // финальный фолбэк
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

// ---------- Лестница сжатия видео ----------
// Схема: разрешение 720p -> 480p; для каждого разрешения битрейт 800 -> 400 -> 100 kbps.
// Т.к. в Worker нет ffmpeg, перекодируем в браузере: рисуем кадры видео на canvas
// нужного разрешения и записываем через MediaRecorder с заданным videoBitsPerSecond.
const RES_LADDER = [720, 480];
const BITRATE_LADDER = [800, 400, 100]; // kbps

async function compressVideo(file) {
  const video = await loadVideo(file);
  for (const targetHeight of RES_LADDER) {
    for (const kbps of BITRATE_LADDER) {
      log('Видео: пробую ' + targetHeight + 'p @ ' + kbps + 'kbps...');
      const blob = await recodeVideo(video, targetHeight, kbps * 1000);
      log('  → получилось ' + (blob.size/1024/1024).toFixed(2) + 'MB');
      if (blob.size <= MAX_VIDEO_BYTES) {
        return { blob, resolution: targetHeight + 'p', bitrate_kbps: kbps };
      }
    }
  }
  // Финальный фолбэк — самое агрессивное сжатие из лестницы
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
    if (blob.size > MAX_VIDEO_BYTES) log('⚠️ Не удалось уложиться в 3MB даже на минимальном профиле, грузим как есть.');
    payload = {
      type: 'video', mime: blob.type, base64: await blobToBase64(blob),
      caption, resolution, bitrate_kbps,
    };
  } else {
    const blob = await compressPhoto(file);
    payload = { type: 'photo', mime: 'image/jpeg', base64: await blobToBase64(blob), caption };
  }

  log('Загружаю на сервер...');
  const res = await fetch('/api/upload', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (data.error) { log('Ошибка: ' + data.error); return; }
  log('✅ Готово!');
  closeUploadModal();
  loadFeed();
}

// ---------- Лента ----------
async function loadFeed() {
  const res = await fetch('/api/feed');
  const data = await res.json();
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  for (const item of data.items) {
    feed.appendChild(renderCard(item));
  }
}

function renderCard(item) {
  const div = document.createElement('div');
  div.className = 'card';
  const media = item.type === 'video'
    ? '<video src="/api/media/' + item.id + '/content" controls loop></video>'
    : '<img src="/api/media/' + item.id + '/content">';
  div.innerHTML = \`
    \${media}
    <div class="card-body">
      <span class="author">\${item.author_name}</span>
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
  el.textContent = (data.liked ? '❤️‍🔥 ' : '❤️ ') + (data.liked ? '+1' : '');
  loadFeed();
}

async function toggleSave(id, el) {
  await fetch('/api/media/' + id + '/save', { method: 'POST' });
  loadFeed();
}

async function loadComments(mediaId) {
  const res = await fetch('/api/media/' + mediaId + '/comments');
  const data = await res.json();
  const el = document.getElementById('comments-' + mediaId);
  if (!el) return;
  el.innerHTML = data.items.map(c => '<div><b>' + c.author_name + ':</b> ' + c.text + '</div>').join('');
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
  for (const item of data.media) feed.appendChild(renderCard(item));
}, 400));

function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ---------- Auth ----------
document.getElementById('authArea').innerHTML = '<a class="btn" href="/auth/google">Войти через Google</a>';

loadFeed();
</script>
</body>
</html>`;

export default INDEX_HTML;
