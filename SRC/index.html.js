// SRC/index.html.js
const INDEX_HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HalloweenTok 🎃</title>
  <style>
    :root {
      --bg: #0a0a0c; --bg-card: #121216; --bg-input: #1a1a20;
      --text: #e4e4e8; --text-muted: #8b8b96; --accent: #ff6b35; --accent-hover: #ff8c5a;
      --danger: #ff3b3b; --success: #2ecc71; --border: #2a2a30;
      --glass: rgba(18, 18, 22, 0.85); --shadow: 0 4px 20px rgba(0,0,0,0.4);
      --radius: 12px; --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.5; min-height: 100vh; overflow-x: hidden; }
    .container { max-width: 720px; margin: 0 auto; padding: 20px 16px 80px; }
    
    /* HEADER */
    header { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
    h1 { font-size: 24px; font-weight: 700; background: linear-gradient(135deg, var(--accent), #ff9e6d); -webkit-background-clip: text; background-clip: text; color: transparent; }
    h2 { font-size: 18px; font-weight: 600; margin: 24px 0 12px; display: flex; align-items: center; gap: 8px; }
    
    /* BUTTONS */
    .btn { padding: 10px 18px; border: none; border-radius: var(--radius); cursor: pointer; font-weight: 500; transition: var(--transition); display: inline-flex; align-items: center; gap: 6px; }
    .btn-primary { background: var(--accent); color: #fff; box-shadow: 0 2px 10px rgba(255,107,53,0.3); }
    .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
    .btn-danger { background: var(--danger); color: #fff; }
    .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--text); }
    .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .hidden { display: none !important; }
    
    /* AUTH MODAL */
    .auth-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; opacity: 0; pointer-events: none; transition: var(--transition); }
    .auth-modal.active { opacity: 1; pointer-events: auto; }
    .auth-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; width: 90%; max-width: 380px; box-shadow: var(--shadow); transform: translateY(20px); transition: var(--transition); }
    .auth-modal.active .auth-box { transform: translateY(0); }
    .auth-box h3 { margin-bottom: 20px; text-align: center; }
    .input { width: 100%; padding: 12px 14px; background: var(--bg-input); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-size: 15px; outline: none; transition: var(--transition); margin-bottom: 12px; }
    .input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(255,107,53,0.2); }
    .auth-actions { display: flex; gap: 10px; margin-top: 8px; }
    
    /* STREAMS */
    .stream-controls { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
    .stream-preview { position: relative; background: #000; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); margin-top: 12px; }
    #localVideo { width: 100%; display: block; aspect-ratio: 16/9; object-fit: cover; }
    .stream-badge { position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); padding: 6px 10px; border-radius: 6px; font-size: 13px; display: flex; align-items: center; gap: 6px; backdrop-filter: blur(4px); }
    .live-dot { width: 8px; height: 8px; background: #ff3b3b; border-radius: 50%; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    .stream-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
    .stream-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; transition: var(--transition); }
    .stream-item:hover { border-color: var(--accent); background: var(--bg-input); }
    .stream-icon { font-size: 22px; }
    .stream-info { flex: 1; }
    .stream-info strong { display: block; margin-bottom: 2px; }
    .stream-info small { color: var(--text-muted); }
    
    /* FEED */
    .feed-grid { display: flex; flex-direction: column; gap: 16px; }
    .media-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: var(--transition); }
    .media-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); border-color: #333; }
    .media-wrapper { position: relative; width: 100%; background: #000; }
    .media-wrapper video, .media-wrapper img { width: 100%; display: block; max-height: 70vh; object-fit: contain; }
    .media-meta { padding: 12px; }
    .media-caption { margin-bottom: 8px; font-size: 15px; line-height: 1.4; }
    .media-actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .action-btn { background: transparent; border: 1px solid var(--border); color: var(--text); padding: 6px 10px; border-radius: 8px; cursor: pointer; transition: var(--transition); display: inline-flex; align-items: center; gap: 6px; font-size: 14px; }
    .action-btn:hover { border-color: var(--accent); color: var(--accent); }
    .action-btn.active { color: var(--danger); border-color: var(--danger); }
    .action-btn.active:hover { background: rgba(255,59,59,0.1); }
    .delete-btn { color: var(--text-muted); }
    .delete-btn:hover { color: var(--danger); border-color: var(--danger); }
    
    /* TOAST & UTILS */
    .toast { position: fixed; bottom: 24px; right: 24px; background: var(--bg-card); border: 1px solid var(--border); padding: 12px 18px; border-radius: 10px; box-shadow: var(--shadow); z-index: 2000; transform: translateY(20px); opacity: 0; transition: var(--transition); pointer-events: none; max-width: 320px; }
    .toast.show { transform: translateY(0); opacity: 1; pointer-events: auto; }
    .toast.success { border-left: 4px solid var(--success); }
    .toast.error { border-left: 4px solid var(--danger); }
    .toast.info { border-left: 4px solid var(--accent); }
    .loader { text-align: center; padding: 40px; color: var(--text-muted); }
    .empty-state { text-align: center; padding: 40px 20px; color: var(--text-muted); }
    @media (max-width: 600px) {
      .container { padding: 16px 12px 70px; }
      header { flex-direction: column; gap: 12px; text-align: center; }
      .stream-controls { justify-content: center; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🎃 HalloweenTok</h1>
      <div id="auth-header">
        <button class="btn btn-primary" onclick="showAuth()">Войти</button>
      </div>
      <div id="user-header" class="hidden">
        <span id="user-name" style="font-weight:500; margin-right:8px;"></span>
        <button class="btn btn-ghost" onclick="logout()">Выйти</button>
      </div>
    </header>

    <!-- Auth Modal -->
    <div id="auth-modal" class="auth-modal">
      <div class="auth-box">
        <h3>Вход в аккаунт</h3>
        <input type="text" id="auth-name" class="input" placeholder="Имя пользователя">
        <input type="password" id="auth-pass" class="input" placeholder="Пароль">
        <div class="auth-actions">
          <button class="btn btn-primary" onclick="login()">Войти</button>
          <button class="btn btn-ghost" onclick="register()">Регистрация</button>
          <button class="btn btn-ghost" onclick="hideAuth()" style="margin-left:auto;">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Streams -->
    <section>
      <h2>📺 Прямые эфиры</h2>
      <div class="stream-controls">
        <button id="startScreenStream" class="btn btn-primary">🖥️ Стрим экрана</button>
        <button id="startCameraStream" class="btn btn-primary">📹 Стрим камеры</button>
        <button id="stopStream" class="btn btn-danger hidden">⏹️ Остановить</button>
      </div>
      <div id="stream-preview" class="stream-preview hidden">
        <video id="localVideo" autoplay muted playsinline></video>
        <div class="stream-badge"><span class="live-dot"></span> LIVE | <span id="stream-viewers">👁️ 0</span></div>
      </div>
      <div id="activeStreams" class="stream-list"></div>
    </section>

    <!-- Feed -->
    <section>
      <h2>🔥 Лента</h2>
      <button id="uploadBtn" class="btn btn-primary" style="margin-bottom:16px;">📤 Загрузить фото/видео</button>
      <div id="feed-container" class="feed-grid">
        <div class="loader">Загрузка...</div>
      </div>
    </section>
  </div>

  <div id="toast" class="toast"></div>

  <script>
    let token = localStorage.getItem('session_token') || null;
    let localStream = null;
    let currentStreamId = null;
    const $ = id => document.getElementById(id);
    
    const toast = (msg, type='info') => {
      const el = $('toast');
      el.textContent = msg;
      el.className = 'toast show ' + type;
      setTimeout(() => el.classList.remove('show'), 3000);
    };
    
    const api = async (url, opts={}) => {
      const res = await fetch(url, { ...opts, headers: { ...opts.headers, 'Content-Type': 'application/json', ...(token ? { 'Authorization': 'Bearer '+token } : {}) } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
      return data;
    };

    // === AUTH ===
    const showAuth = () => $('auth-modal').classList.add('active');
    const hideAuth = () => $('auth-modal').classList.remove('active');
    const updateAuthUI = () => {
      const has = !!token;
      $('auth-header').classList.toggle('hidden', has);
      $('user-header').classList.toggle('hidden', !has);
      if (has) $('user-name').textContent = '👤 ' + (JSON.parse(localStorage.getItem('user_data')||'{}').name || 'User');
    };
    const login = async () => {
      const n = $('auth-name').value.trim(), p = $('auth-pass').value.trim();
      if (!n || !p) return toast('Заполните все поля', 'error');
      try {
        const d = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ name: n, password: p }) });
        token = d.session_token; localStorage.setItem('session_token', token); localStorage.setItem('user_data', JSON.stringify(d.user));
        hideAuth(); updateAuthUI(); toast('✅ Успешный вход', 'success'); loadFeed(); loadStreams();
      } catch(e) { toast('❌ '+e.message, 'error'); }
    };
    const register = async () => {
      const n = $('auth-name').value.trim(), p = $('auth-pass').value.trim();
      if (!n || !p) return toast('Заполните все поля', 'error');
      try {
        await api('/api/auth/register', { method: 'POST', body: JSON.stringify({ name: n, password: p }) });
        toast('✅ Регистрация успешна. Войдите.', 'success');
      } catch(e) { toast('❌ '+e.message, 'error'); }
    };
    const logout = async () => {
      try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
      token = null; localStorage.clear(); updateAuthUI(); toast('👋 Выход выполнен', 'info');
    };

    // === MEDIA ===
    const loadFeed = async () => {
      const c = $('feed-container'); c.innerHTML = '<div class="loader">Загрузка...</div>';
      try {
        const d = await api('/api/media/feed');
        c.innerHTML = '';
        if (!d.items?.length) { c.innerHTML = '<div class="empty-state">Лента пуста 🎃</div>'; return; }
        const uid = JSON.parse(localStorage.getItem('user_data')||'{}').id;
        d.items.forEach(it => {
          const isVid = it.type === 'video';
          const isOwn = uid === it.user_id;
          const card = document.createElement('div'); card.className = 'media-card';
          card.innerHTML = \`
            <div class="media-wrapper">
              \${isVid ? \`<video src="/api/media/\${it.id}" controls playsinline></video>\` : \`<img src="/api/media/\${it.id}" alt="media">\`}
            </div>
            <div class="media-meta">
              <div class="media-caption">\${it.caption || ''}</div>
              <div class="media-actions">
                <button class="action-btn like-btn" data-id="\${it.id}">❤️ \${it.likes_count||0}</button>
                <button class="action-btn save-btn" data-id="\${it.id}">🔖 \${it.saves_count||0}</button>
                \${isOwn ? \`<button class="action-btn delete-btn" data-id="\${it.id}">🗑️ Удалить</button>\` : ''}
              </div>
            </div>
          \`;
          c.appendChild(card);
        });
        bindActions();
      } catch(e) { c.innerHTML = \`<div class="empty-state">❌ \${e.message}</div>\`; }
    };
    $('uploadBtn').onclick = () => {
      if (!token) return toast('🔒 Войдите в аккаунт', 'error');
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'video/*,image/*';
      inp.onchange = async e => {
        const f = e.target.files[0]; if (!f) return;
        if (f.size > 3*1024*1024) return toast('❌ Лимит файла: 3MB', 'error');
        const r = new FileReader();
        r.onload = async ev => {
          const b64 = ev.target.result.split(',')[1];
          try {
            toast('⏳ Загрузка...', 'info');
            await api('/api/media/upload', { method: 'POST', body: JSON.stringify({ type: f.type.startsWith('video')?'video':'photo', mime: f.type, base64: b64, caption: f.name }) });
            toast('✅ Загружено!', 'success'); loadFeed();
          } catch(err) { toast('❌ '+err.message, 'error'); }
        };
        r.readAsDataURL(f);
      };
      inp.click();
    };
    const bindActions = () => {
      document.querySelectorAll('.like-btn').forEach(b => b.onclick = async () => {
        if (!token) return toast('🔒 Войдите', 'error');
        try { await api('/api/media/'+b.dataset.id+'/like', {method:'POST'}); loadFeed(); } catch(e){ toast(e.message,'error'); }
      });
      document.querySelectorAll('.save-btn').forEach(b => b.onclick = async () => {
        if (!token) return toast('🔒 Войдите', 'error');
        try { await api('/api/media/'+b.dataset.id+'/save', {method:'POST'}); loadFeed(); } catch(e){ toast(e.message,'error'); }
      });
      document.querySelectorAll('.delete-btn').forEach(b => b.onclick = async () => {
        if (!confirm('Удалить медиа?')) return;
        try { await api('/api/media/'+b.dataset.id, {method:'DELETE'}); loadFeed(); toast('🗑️ Удалено','info'); } catch(e){ toast(e.message,'error'); }
      });
    };

    // === STREAMS ===
    const loadStreams = async () => {
      const c = $('activeStreams'); c.innerHTML = '';
      try {
        const d = await api('/api/streams');
        if (!d.items?.length) { c.innerHTML = '<div class="empty-state">Нет активных стримов</div>'; return; }
        d.items.forEach(s => {
          const el = document.createElement('div'); el.className = 'stream-item';
          el.innerHTML = \`
            <div class="stream-icon">\${s.type==='screen'?'🖥️':'📹'}</div>
            <div class="stream-info"><strong>\${s.title}</strong><small>Автор: \${s.author_name} | 👁️ \${s.viewers||0}</small></div>
          \`;
          c.appendChild(el);
        });
      } catch {}
    };
    const startStream = async type => {
      if (!token) return toast('🔒 Войдите', 'error');
      try {
        const opts = type==='screen' ? { video:{cursor:'always'}, audio:true } : { video:true, audio:true };
        const stream = type==='screen' ? await navigator.mediaDevices.getDisplayMedia(opts) : await navigator.mediaDevices.getUserMedia(opts);
        localStream = stream; $('localVideo').srcObject = stream; $('stream-preview').classList.remove('hidden'); $('stopStream').classList.remove('hidden');
        ['startScreenStream','startCameraStream'].forEach(id => $(id).classList.add('hidden'));
        const d = await api('/api/streams', { method:'POST', body: JSON.stringify({ type, title: type==='screen'?'🖥️ Экран':'📹 Камера' }) });
        currentStreamId = d.stream_id; toast('🔴 Стрим запущен', 'success'); loadStreams();
      } catch(e) { toast('❌ '+(e.name==='NotAllowedError'?'Разрешите доступ':'Не удалось запустить'), 'error'); }
    };
    const stopStream = async () => {
      if (localStream) localStream.getTracks().forEach(t=>t.stop()); localStream = null;
      if (currentStreamId) { try { await api('/api/streams/'+currentStreamId+'/end', {method:'POST'}); } catch {} currentStreamId = null; }
      $('stream-preview').classList.add('hidden'); $('stopStream').classList.add('hidden');
      ['startScreenStream','startCameraStream'].forEach(id => $(id).classList.remove('hidden'));
      toast('⏹️ Стрим остановлен', 'info'); loadStreams();
    };
    $('startScreenStream').onclick = () => startStream('screen');
    $('startCameraStream').onclick = () => startStream('camera');
    $('stopStream').onclick = stopStream;

    // === INIT ===
    document.addEventListener('DOMContentLoaded', () => {
      updateAuthUI(); loadFeed(); loadStreams(); setInterval(loadStreams, 30000);
    });
  </script>
</body>
</html>`;

export default INDEX_HTML;
