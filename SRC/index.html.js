const INDEX_HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#0d0714">
<title>SpookyTok</title>
<style>
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
  html { scroll-behavior: smooth; }
  
  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    padding-bottom: var(--nav-height);
    position: relative;
  }

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

  #particleCanvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
  }

  .magnetic-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--orange);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, background 0.2s, border-color 0.2s;
    mix-blend-mode: difference;
    display: none;
  }
  @media (pointer: fine) {
    .magnetic-cursor { display: block; }
  }
  .magnetic-cursor.hovering {
    width: 60px;
    height: 60px;
    background: rgba(255,117,24,0.15);
    border-color: var(--purple);
  }

  header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(13,7,20,0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
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
    white-space: nowrap;
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
    transition: all 0.3s;
  }
  header input:focus {
    border-color: var(--purple);
    box-shadow: 0 0 0 3px var(--purple-glow);
  }

  .kinetic-title {
    font-size: clamp(48px, 12vw, 120px);
    font-weight: 900;
    line-height: 0.9;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, var(--orange) 0%, var(--purple) 50%, var(--orange) 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 5s ease infinite;
    text-transform: uppercase;
    margin-bottom: 20px;
    user-select: none;
  }
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .kinetic-word {
    display: inline-block;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .kinetic-word:hover {
    transform: scale(1.1) rotate(-2deg);
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

  .scroll-reveal {
    opacity: 0;
    transform: translateY(60px);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .scroll-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(140px, auto);
    gap: 16px;
    margin-bottom: 24px;
  }
  .bento-item {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 20px;
    overflow: hidden;
    position: relative;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: pointer;
  }
  .bento-item:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: var(--purple);
    box-shadow: 0 12px 40px rgba(123,47,247,0.3);
  }
  
  .bento-large { grid-column: span 2; grid-row: span 2; }
  .bento-wide { grid-column: span 2; }
  
  @media (max-width: 768px) {
    .bento-grid { grid-template-columns: repeat(2, 1fr); }
    .bento-large { grid-column: span 2; grid-row: span 1; }
    .bento-wide { grid-column: span 2; }
  }
  @media (max-width: 480px) {
    .bento-grid { grid-template-columns: 1fr; }
    .bento-large, .bento-wide { grid-column: span 1; }
  }

  .horizontal-scroll-section {
    margin: 40px 0;
  }
  .horizontal-scroll-section h2 {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 20px;
    color: var(--orange);
  }
  .horizontal-scroll {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 10px 0 20px;
    scrollbar-width: thin;
    scrollbar-color: var(--purple) var(--bg);
  }
  .horizontal-scroll::-webkit-scrollbar { height: 6px; }
  .horizontal-scroll::-webkit-scrollbar-track { background: var(--bg); border-radius: 3px; }
  .horizontal-scroll::-webkit-scrollbar-thumb { background: var(--purple); border-radius: 3px; }
  .horizontal-scroll-item {
    flex: 0 0 280px;
    scroll-snap-align: start;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s;
  }
  .horizontal-scroll-item:hover {
    transform: scale(1.03);
    border-color: var(--purple);
  }
  .horizontal-scroll-item .thumb {
    width: 100%;
    aspect-ratio: 16/9;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
  }
  .horizontal-scroll-item .info { padding: 14px; }
  .horizontal-scroll-item .title { font-weight: 700; margin-bottom: 6px; font-size: 15px; }
  .horizontal-scroll-item .author { color: var(--orange); font-size: 13px; cursor: pointer; }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    background: rgba(13,7,20,0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
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
    transition: all 0.3s;
  }
  .nav-item.active {
    color: var(--orange);
    transform: translateY(-4px);
  }
  .nav-icon { font-size: 24px; }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    margin-bottom: 24px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: fadeInUp 0.5s ease;
    position: relative;
    transition: all 0.3s;
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 48px rgba(123,47,247,0.3);
    border-color: var(--purple);
  }
  .card-media { width: 100%; aspect-ratio: 9/16; background: #000; object-fit: cover; }
  .card-body { padding: 14px; }
  .author {
    color: var(--orange);
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
  }
  .author:hover {
    text-decoration: underline;
    text-shadow: 0 0 12px var(--orange-glow);
  }

  .actions {
    display: flex;
    gap: 16px;
    padding: 10px 14px;
    border-top: 1px solid var(--border);
  }
  .action-btn {
    background: none;
    border: none;
    color: var(--text);
    font-size: 16px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 12px;
    transition: all 0.2s;
  }
  .action-btn:hover { background: rgba(255,255,255,0.05); transform: scale(1.1); }
  .action-btn:active { transform: scale(0.9); }
  .action-btn.liked { animation: likePulse 0.4s ease; }
  @keyframes likePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.4); }
    100% { transform: scale(1); }
  }

  .comments { padding: 12px 14px; font-size: 14px; color: var(--text-dim); }
  .comments b { color: var(--orange); cursor: pointer; }
  .comment-input { display: flex; gap: 8px; padding: 12px 14px 16px; }
  .comment-input input {
    flex: 1;
    border-radius: 20px;
    border: 2px solid var(--border);
    background: var(--bg);
    color: var(--text);
    padding: 10px 16px;
    font-size: 14px;
    outline: none;
  }
  .comment-input input:focus { border-color: var(--purple); }

  .profile-header {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    margin-bottom: 20px;
  }
  .profile-avatar {
    width: 100px; height: 100px; border-radius: 50%;
    background: linear-gradient(135deg, var(--purple), var(--orange));
    margin: 0 auto 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 48px;
    box-shadow: 0 0 30px var(--purple-glow);
  }
  .profile-name { font-size: 24px; font-weight: 800; color: var(--orange); }
  .profile-username { color: var(--text-dim); margin-bottom: 12px; }
  .profile-bio { color: var(--text); margin-bottom: 20px; line-height: 1.5; }
  .profile-stats { display: flex; justify-content: space-around; margin-bottom: 20px; }
  .stat-val { font-size: 20px; font-weight: 800; color: var(--orange); }
  .stat-lbl { font-size: 12px; color: var(--text-dim); }

  .chat-list-item {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 14px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .chat-list-item:hover {
    border-color: var(--purple);
    transform: translateX(4px);
  }
  .chat-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, var(--purple), var(--orange));
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .chat-info { flex: 1; }
  .chat-name { font-weight: 700; color: var(--orange); }
  .chat-preview { font-size: 13px; color: var(--text-dim); }

  .chat-view {
    display: flex; flex-direction: column;
    height: 70vh;
    background: var(--card);
    border-radius: 16px;
    overflow: hidden;
  }
  .chat-messages { flex: 1; overflow-y: auto; padding: 16px; }
  .msg {
    padding: 10px 14px;
    border-radius: 16px;
    margin-bottom: 8px;
    max-width: 75%;
    word-wrap: break-word;
    animation: msgSlide 0.3s ease;
  }
  @keyframes msgSlide {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .msg.mine {
    background: linear-gradient(135deg, var(--purple), var(--orange));
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  }
  .msg.other {
    background: var(--bg);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
  }
  .chat-input-row { display: flex; gap: 8px; padding: 12px; border-top: 1px solid var(--border); }
  .chat-input-row input {
    flex: 1;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 20px;
    padding: 10px 16px;
    outline: none;
  }

  .modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
  }
  .modal.active { display: flex; }
  .modal-box {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 24px;
    width: 100%;
    max-width: 440px;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes modalPop {
    from { opacity: 0; transform: scale(0.8) translateY(30px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .modal-box h3 { color: var(--orange); margin-bottom: 16px; }
  .modal-box input, .modal-box textarea {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 12px;
    font-size: 14px;
    outline: none;
    font-family: inherit;
  }
  .modal-box input:focus, .modal-box textarea:focus { border-color: var(--purple); }
  .btn {
    background: linear-gradient(135deg, var(--purple), var(--orange));
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 24px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    margin-top: 8px;
    transition: all 0.3s;
  }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(123,47,247,0.4); }
  .btn:active { transform: scale(0.95); }
  .btn-secondary { background: #333; }

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
  body.retro-mode .card,
  body.retro-mode .profile-header,
  body.retro-mode .chat-list-item,
  body.retro-mode .chat-view,
  body.retro-mode .modal-box,
  body.retro-mode .bento-item,
  body.retro-mode .horizontal-scroll-item {
    background: #f0f0f0 !important;
    color: black !important;
    border: 2px solid #000 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  body.retro-mode .author,
  body.retro-mode .chat-name,
  body.retro-mode .profile-name,
  body.retro-mode .stat-val,
  body.retro-mode .modal-box h3,
  body.retro-mode .horizontal-scroll-section h2 {
    color: #000080 !important;
  }
  body.retro-mode .bottom-nav { background: #c0c0c0 !important; border-top: 2px solid #fff; height: 60px; }
  body.retro-mode .nav-item { color: black !important; font-size: 10px; }
  body.retro-mode .btn {
    background: #c0c0c0 !important;
    color: black !important;
    border: 2px outset #fff !important;
    border-radius: 0 !important;
  }
  body.retro-mode .btn:active { border-style: inset !important; }
  body.retro-mode .msg.mine { background: #ffffcc !important; color: black !important; border: 1px solid #000; }
  body.retro-mode .msg.other { background: #e0e0e0 !important; color: black !important; border: 1px solid #000; }
  body.retro-mode .modal { background: rgba(0,0,0,0.5) !important; backdrop-filter: none !important; }

  @media (max-width: 600px) {
    header { padding: 10px 12px; }
    header h1 { font-size: 18px; }
    .main-content { padding: 12px; }
    .profile-header { padding: 16px; }
    .profile-name { font-size: 20px; }
    .kinetic-title { font-size: 48px; }
  }
  @media (min-width: 1920px) {
    :root { --nav-height: 90px; }
    body { font-size: 18px; }
    header h1 { font-size: 32px; }
    .nav-icon { font-size: 32px; }
    .nav-item { font-size: 16px; }
    .horizontal-scroll-item { flex: 0 0 360px; }
  }
</style>
</head>
<body>

<div class="aurora-bg">
  <div class="aurora-blob"></div>
  <div class="aurora-blob"></div>
  <div class="aurora-blob"></div>
</div>
<canvas id="particleCanvas"></canvas>
<div class="magnetic-cursor" id="magneticCursor"></div>

<header>
  <h1 id="siteTitle">🎃 SpookyTok</h1>
  <input id="searchInput" placeholder="🔍 Поиск...">
  <div id="authArea"></div>
</header>

<div class="main-content">
  <div id="page-feed" class="page active">
    <div class="scroll-reveal">
      <div class="kinetic-title">
        <span class="kinetic-word">Жуткие</span><br>
        <span class="kinetic-word">Истории</span>
      </div>
    </div>
    <div id="feed"></div>
  </div>
  
  <div id="page-streams" class="page">
    <div class="scroll-reveal">
      <h2 style="color:var(--orange);font-size:32px;font-weight:800;margin-bottom:20px;">📺 Стримы</h2>
    </div>
    
    <div class="bento-grid scroll-reveal">
      <div class="bento-item bento-large">
        <div style="font-size:48px;margin-bottom:10px;">🔴</div>
        <div style="font-size:24px;font-weight:800;">LIVE</div>
        <div style="color:var(--text-dim);margin-top:8px;">Сейчас в эфире</div>
        <div id="liveCount" style="font-size:36px;font-weight:900;color:var(--red);margin-top:10px;">0</div>
      </div>
      <div class="bento-item">
        <div style="font-size:32px;">👁️</div>
        <div style="font-size:20px;font-weight:800;margin-top:8px;" id="totalViewers">0</div>
        <div style="color:var(--text-dim);font-size:12px;">зрителей</div>
      </div>
      <div class="bento-item">
        <div style="font-size:32px;">📡</div>
        <div style="font-size:20px;font-weight:800;margin-top:8px;" id="totalStreams">0</div>
        <div style="color:var(--text-dim);font-size:12px;">стримов</div>
      </div>
      <div class="bento-item bento-wide">
        <div style="font-size:24px;font-weight:800;margin-bottom:10px;">🎯 Популярное</div>
        <div style="color:var(--text-dim);font-size:13px;">Топ стримеры недели</div>
        <div id="topStreamers" style="margin-top:12px;font-size:14px;"></div>
      </div>
    </div>

    <div class="horizontal-scroll-section scroll-reveal">
      <h2>🔥 Сейчас смотрят</h2>
      <div class="horizontal-scroll" id="streamsScroll"></div>
    </div>

    <button class="btn" style="max-width:300px;margin:20px auto;display:block;" id="startStreamBtn">+ Начать стрим</button>
  </div>
  
  <div id="page-chats" class="page">
    <div class="scroll-reveal">
      <h2 style="color:var(--orange);font-size:32px;font-weight:800;margin-bottom:20px;">💬 Чаты</h2>
    </div>
    <div id="chatsList"></div>
    <div id="chatViewContainer" style="display:none;"></div>
  </div>
  
  <div id="page-profile" class="page">
    <div id="profileContent"></div>
  </div>
</div>

<nav class="bottom-nav">
  <button class="nav-item active" data-page="feed"><span class="nav-icon">🏠</span><span>Лента</span></button>
  <button class="nav-item" data-page="streams"><span class="nav-icon">📺</span><span>Стримы</span></button>
  <button class="nav-item" data-page="chats"><span class="nav-icon">💬</span><span>Чаты</span></button>
  <button class="nav-item" data-page="profile"><span class="nav-icon">👤</span><span>Профиль</span></button>
</nav>

<div id="uploadModal" class="modal">
  <div class="modal-box">
    <h3>👻 Загрузить</h3>
    <input type="file" id="fileInput" accept="video/*,image/*">
    <input type="text" id="captionInput" placeholder="Подпись...">
    <button class="btn" id="uploadBtn">Загрузить</button>
    <button class="btn btn-secondary" id="closeUploadBtn">Отмена</button>
  </div>
</div>

<div id="editProfileModal" class="modal">
  <div class="modal-box">
    <h3>️ Редактировать</h3>
    <label style="font-size:12px;color:var(--text-dim);">Имя</label>
    <input type="text" id="editDisplayName" maxlength="50">
    <label style="font-size:12px;color:var(--text-dim);">Ник (латиница, _)</label>
    <input type="text" id="editUsername" maxlength="30">
    <label style="font-size:12px;color:var(--text-dim);">О себе</label>
    <textarea id="editBio" rows="3" maxlength="500"></textarea>
    <button class="btn" id="saveProfileBtn">Сохранить</button>
    <button class="btn btn-secondary" id="closeEditBtn">Отмена</button>
  </div>
</div>

<div id="streamModal" class="modal">
  <div class="modal-box">
    <h3> Начать стрим</h3>
    <input type="text" id="streamTitle" placeholder="Название">
    <textarea id="streamDesc" rows="2" placeholder="Описание"></textarea>
    <input type="text" id="streamUrl" placeholder="URL (YouTube embed)">
    <input type="text" id="streamThumb" placeholder="Превью (URL картинки)">
    <button class="btn" id="createStreamBtn">Запустить</button>
    <button class="btn btn-secondary" id="closeStreamBtn">Отмена</button>
  </div>
</div>

<script>
(function() {
  'use strict';
  
  if (/Nokia|Samsung|Opera Mini|J2ME|Android.*Mobile.*Opera|BlackBerry|IEMobile/i.test(navigator.userAgent) || window.innerWidth < 240) {
    document.body.classList.add('retro-mode');
  }

  const ADMIN_NICK = 'vrema7760-cyber';
  let currentUser = null;
  let currentProfile = null;
  let currentChatId = null;
  let currentPage = 'feed';

  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function spawnParticles(x, y) {
    if (document.body.classList.contains('retro-mode')) return;
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color: ['#ff7518', '#7b2ff7', '#6dff8f', '#ff1493', '#00ffff'][Math.floor(Math.random() * 5)],
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

  const cursor = document.getElementById('magneticCursor');
  let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
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
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  function observeElements() {
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  }

  function navigate(page) {
    currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navBtn = document.querySelector('.nav-item[data-page="'+page+'"]');
    if (navBtn) navBtn.classList.add('active');
    
    if (page === 'feed') loadFeed();
    if (page === 'streams') loadStreams();
    if (page === 'chats') loadChats();
    if (page === 'profile') loadMyProfile();
    
    setTimeout(observeElements, 100);
  }

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate(btn.dataset.page);
    });
  });

  function openModal(id) { 
    const m = document.getElementById(id);
    if (m) m.classList.add('active'); 
  }
  function closeModal(id) { 
    const m = document.getElementById(id);
    if (m) m.classList.remove('active'); 
  }

  document.getElementById('startStreamBtn').addEventListener('click', () => {
    if (!currentUser) { alert('Войди сначала'); return; }
    openModal('streamModal');
  });
  document.getElementById('closeStreamBtn').addEventListener('click', () => closeModal('streamModal'));

  async function init() {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        currentUser = await res.json();
        document.getElementById('authArea').innerHTML = '<span style="color:var(--orange);font-weight:700;">@'+currentUser.name+'</span>';
      } else {
        document.getElementById('authArea').innerHTML = '<a href="/auth/github" style="color:var(--orange);text-decoration:none;">Войти</a>';
      }
    } catch(e) {
      document.getElementById('authArea').innerHTML = '<a href="/auth/github" style="color:var(--orange);text-decoration:none;">Войти</a>';
    }
    loadFeed();
    setTimeout(observeElements, 200);
  }

  async function loadFeed() {
    const feed = document.getElementById('feed');
    if (!feed) return;
    feed.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim);">Загрузка...</div>';
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      feed.innerHTML = '';
      if (!data.items || data.items.length === 0) {
        feed.innerHTML = '<div class="scroll-reveal" style="text-align:center;padding:60px;"><div style="font-size:64px;margin-bottom:16px;"></div><div style="font-size:18px;">Пока пусто. Будь первым!</div></div>';
        setTimeout(observeElements, 100);
        return;
      }
      data.items.forEach((item, i) => {
        const card = renderCard(item);
        card.classList.add('scroll-reveal');
        card.style.transitionDelay = (i * 0.1) + 's';
        feed.appendChild(card);
      });
      setTimeout(observeElements, 100);
    } catch(e) {
      feed.innerHTML = '<div style="text-align:center;padding:40px;color:var(--red);">Ошибка загрузки</div>';
    }
  }

  function renderCard(item) {
    const div = document.createElement('div');
    div.className = 'card';
    const canDelete = currentUser && (item.author_name === currentUser.name || currentUser.name === ADMIN_NICK);
    const media = item.type === 'video' 
      ? '<video class="card-media" src="/api/media/'+item.id+'/content" controls loop playsinline></video>'
      : '<img class="card-media" src="/api/media/'+item.id+'/content" loading="lazy">';
    
    let html = '';
    if (canDelete) {
      const delBtn = document.createElement('button');
      delBtn.className = 'btn';
      delBtn.style.cssText = 'position:absolute;top:12px;right:12px;width:auto;padding:8px 14px;font-size:12px;z-index:10;background:var(--red);';
      delBtn.textContent = '🗑️';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteMedia(item.id);
      });
      div.appendChild(delBtn);
    }
    
    div.innerHTML += media;
    
    const body = document.createElement('div');
    body.className = 'card-body';
    const authorLink = document.createElement('a');
    authorLink.className = 'author';
    authorLink.textContent = '@' + (item.author_name || 'anon');
    authorLink.addEventListener('click', () => viewProfile(item.user_id, item.author_name));
    body.appendChild(authorLink);
    const caption = document.createElement('div');
    caption.style.marginTop = '6px';
    caption.textContent = item.caption || '';
    body.appendChild(caption);
    div.appendChild(body);
    
    const actions = document.createElement('div');
    actions.className = 'actions';
    
    const likeBtn = document.createElement('button');
    likeBtn.className = 'action-btn';
    likeBtn.innerHTML = '❤️ <span class="like-count">'+(item.likes_count||0)+'</span>';
    likeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLike(item.id, likeBtn);
    });
    actions.appendChild(likeBtn);
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'action-btn';
    saveBtn.textContent = '🔖 ' + (item.saves_count||0);
    saveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSave(item.id);
    });
    actions.appendChild(saveBtn);
    
    const commentCount = document.createElement('span');
    commentCount.className = 'action-btn';
    commentCount.textContent = '💬 ' + (item.comments_count||0);
    actions.appendChild(commentCount);
    
    div.appendChild(actions);
    
    const comments = document.createElement('div');
    comments.className = 'comments';
    comments.id = 'comments-' + item.id;
    div.appendChild(comments);
    
    const commentInput = document.createElement('div');
    commentInput.className = 'comment-input';
    const input = document.createElement('input');
    input.placeholder = 'Комментарий...';
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendComment(item.id, input);
    });
    commentInput.appendChild(input);
    div.appendChild(commentInput);
    
    loadComments(item.id);
    return div;
  }

  async function toggleLike(id, el) {
    const res = await fetch('/api/media/'+id+'/like', {method:'POST'});
    const data = await res.json();
    const countSpan = el.querySelector('.like-count');
    if (countSpan) countSpan.textContent = data.likes_count;
    el.classList.add('liked');
    setTimeout(() => el.classList.remove('liked'), 400);
    spawnParticles(el.getBoundingClientRect().left + 20, el.getBoundingClientRect().top);
  }

  async function toggleSave(id) {
    await fetch('/api/media/'+id+'/save', {method:'POST'});
    alert('Сохранено!');
  }

  async function deleteMedia(id) {
    if (!confirm('Удалить?')) return;
    const res = await fetch('/api/media/'+id, {method:'DELETE'});
    if (res.ok) loadFeed(); else alert('Ошибка');
  }

  async function loadComments(id) {
    try {
      const res = await fetch('/api/media/'+id+'/comments');
      const data = await res.json();
      const el = document.getElementById('comments-'+id);
      if (!el) return;
      if (!data.items || data.items.length === 0) {
        el.innerHTML = '<div style="font-style:italic;">Нет комментариев</div>';
        return;
      }
      el.innerHTML = '';
      data.items.forEach(c => {
        const div = document.createElement('div');
        const b = document.createElement('b');
        b.textContent = '@' + c.author_name;
        b.style.cursor = 'pointer';
        b.addEventListener('click', () => viewProfile(c.user_id, c.author_name));
        div.appendChild(b);
        div.appendChild(document.createTextNode(': ' + c.text));
        el.appendChild(div);
      });
    } catch(e){}
  }

  async function sendComment(id, input) {
    if (!currentUser) { alert('Войди сначала'); return; }
    const text = input.value.trim();
    if (!text) return;
    await fetch('/api/media/'+id+'/comments', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text})});
    input.value = '';
    loadComments(id);
  }

  async function loadStreams() {
    const scroll = document.getElementById('streamsScroll');
    if (!scroll) return;
    scroll.innerHTML = '<div style="padding:40px;color:var(--text-dim);">Загрузка...</div>';
    try {
      const res = await fetch('/api/streams');
      const data = await res.json();
      scroll.innerHTML = '';
      
      const liveCount = (data.items || []).filter(s => s.is_live).length;
      const liveEl = document.getElementById('liveCount');
      if (liveEl) liveEl.textContent = liveCount;
      const streamsEl = document.getElementById('totalStreams');
      if (streamsEl) streamsEl.textContent = (data.items || []).length;
      const viewersEl = document.getElementById('totalViewers');
      if (viewersEl) viewersEl.textContent = (data.items || []).reduce((sum, s) => sum + (s.viewers || 0), 0);
      
      if (!data.items || data.items.length === 0) {
        scroll.innerHTML = '<div style="padding:40px;color:var(--text-dim);">Стримов пока нет</div>';
        return;
      }
      
      data.items.forEach(s => {
        const div = document.createElement('div');
        div.className = 'horizontal-scroll-item';
        const thumb = document.createElement('div');
        thumb.className = 'thumb';
        thumb.style.position = 'relative';
        if (s.thumbnail_url) {
          const img = document.createElement('img');
          img.src = s.thumbnail_url;
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
          thumb.appendChild(img);
        } else {
          thumb.textContent = '📺';
        }
        if (s.is_live) {
          const badge = document.createElement('div');
          badge.style.cssText = 'position:absolute;top:10px;left:10px;background:var(--red);color:white;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:800;';
          badge.textContent = '🔴 LIVE';
          thumb.appendChild(badge);
        }
        div.appendChild(thumb);
        
        const info = document.createElement('div');
        info.className = 'info';
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = s.title;
        info.appendChild(title);
        const author = document.createElement('div');
        author.className = 'author';
        author.textContent = '@' + (s.author_name || 'anon');
        author.addEventListener('click', () => viewProfile(s.user_id, s.author_name));
        info.appendChild(author);
        div.appendChild(info);
        
        scroll.appendChild(div);
      });
    } catch(e) {
      scroll.innerHTML = '<div style="padding:40px;color:var(--red);">Ошибка</div>';
    }
  }

  document.getElementById('createStreamBtn').addEventListener('click', async () => {
    if (!currentUser) { alert('Войди сначала'); return; }
    const title = document.getElementById('streamTitle').value.trim();
    const desc = document.getElementById('streamDesc').value.trim();
    const url = document.getElementById('streamUrl').value.trim();
    const thumb = document.getElementById('streamThumb').value.trim();
    if (!title || !url) { alert('Название и URL обязательны'); return; }
    const res = await fetch('/api/streams', {method:'POST', headers:{'Content-Type':'application/json'}, 
      body:JSON.stringify({title, description:desc, stream_url:url, thumbnail_url:thumb})});
    const data = await res.json();
    if (data.ok) {
      closeModal('streamModal');
      document.getElementById('streamTitle').value = '';
      document.getElementById('streamDesc').value = '';
      document.getElementById('streamUrl').value = '';
      document.getElementById('streamThumb').value = '';
      loadStreams();
    } else alert('Ошибка: '+data.error);
  });

  async function loadChats() {
    if (!currentUser) {
      const list = document.getElementById('chatsList');
      if (list) list.innerHTML = '<div style="text-align:center;padding:40px;">Войди для чатов</div>';
      return;
    }
    const list = document.getElementById('chatsList');
    const container = document.getElementById('chatViewContainer');
    if (list) list.style.display = 'block';
    if (container) container.style.display = 'none';
    if (list) list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim);">Нет чатов. Кликни на ник в ленте!</div>';
  }

  async function openChatWithUser(userId, userName) {
    if (!currentUser) { alert('Войди сначала'); return; }
    const res = await fetch('/api/chats/open', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({user_id:userId})});
    const data = await res.json();
    if (data.chat_id) {
      currentChatId = data.chat_id;
      navigate('chats');
      setTimeout(() => showChatView(userName), 300);
    } else alert('Ошибка: '+data.error);
  }

  function showChatView(userName) {
    const list = document.getElementById('chatsList');
    const container = document.getElementById('chatViewContainer');
    if (list) list.style.display = 'none';
    if (container) {
      container.style.display = 'block';
      container.innerHTML = 
        '<div class="chat-view">'+
          '<div style="padding:12px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">'+
            '<h3 style="color:var(--orange);margin:0;">@'+userName+'</h3>'+
            '<button class="btn btn-secondary" style="width:auto;padding:6px 12px;" id="backToChatsBtn">← Назад</button>'+
          '</div>'+
          '<div class="chat-messages" id="chatMessages"><div style="text-align:center;color:var(--text-dim);padding:20px;">Начни разговор!</div></div>'+
          '<div class="chat-input-row">'+
            '<input id="chatInput" placeholder="Сообщение...">'+
            '<button class="btn" style="width:auto;margin:0;" id="sendMsgBtn">📤</button>'+
          '</div>'+
        '</div>';
      
      document.getElementById('backToChatsBtn').addEventListener('click', loadChats);
      document.getElementById('sendMsgBtn').addEventListener('click', sendMessage);
      document.getElementById('chatInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
      loadChatMessages();
    }
  }

  async function loadChatMessages() {
    if (!currentChatId) return;
    const res = await fetch('/api/chats/'+currentChatId+'/messages');
    const data = await res.json();
    const el = document.getElementById('chatMessages');
    if (!el) return;
    if (!data.items || data.items.length === 0) {
      el.innerHTML = '<div style="text-align:center;color:var(--text-dim);padding:20px;">Начни разговор!</div>';
      return;
    }
    el.innerHTML = '';
    data.items.forEach(m => {
      const div = document.createElement('div');
      div.className = 'msg ' + (m.sender_id === currentUser.id ? 'mine' : 'other');
      div.textContent = m.text;
      el.appendChild(div);
    });
    el.scrollTop = el.scrollHeight;
  }

  async function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text || !currentChatId) return;
    await fetch('/api/chats/'+currentChatId+'/messages', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text})});
    input.value = '';
    loadChatMessages();
  }

  async function loadMyProfile() {
    if (!currentUser) {
      const el = document.getElementById('profileContent');
      if (el) el.innerHTML = '<div style="text-align:center;padding:40px;">Войди чтобы увидеть профиль</div>';
      return;
    }
    await showProfile(currentUser.id, currentUser.name, true);
  }

  async function viewProfile(userId, userName) {
    navigate('profile');
    await showProfile(userId, userName, false);
  }

  async function showProfile(userId, userName, isMe) {
    const el = document.getElementById('profileContent');
    if (!el) return;
    el.innerHTML = '<div style="text-align:center;padding:40px;">Загрузка...</div>';
    
    try {
      const url = isMe ? '/api/profile/me' : '/api/profile/'+userId;
      const res = await fetch(url);
      const p = await res.json();
      if (p.error) { el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--red);">❌ '+p.error+'</div>'; return; }
      currentProfile = p;
      
      const header = document.createElement('div');
      header.className = 'scroll-reveal';
      const profileHeader = document.createElement('div');
      profileHeader.className = 'profile-header';
      
      const avatar = document.createElement('div');
      avatar.className = 'profile-avatar';
      avatar.textContent = '👻';
      profileHeader.appendChild(avatar);
      
      const name = document.createElement('div');
      name.className = 'profile-name';
      name.textContent = p.display_name || p.username;
      profileHeader.appendChild(name);
      
      const username = document.createElement('div');
      username.className = 'profile-username';
      username.textContent = '@' + p.username;
      profileHeader.appendChild(username);
      
      const bio = document.createElement('div');
      bio.className = 'profile-bio';
      bio.textContent = p.bio || 'Нет описания';
      profileHeader.appendChild(bio);
      
      const actionsDiv = document.createElement('div');
      actionsDiv.style.cssText = 'display:flex;gap:10px;justify-content:center;';
      if (p.is_me) {
        const editBtn = document.createElement('button');
        editBtn.className = 'btn';
        editBtn.textContent = '✏️ Редактировать';
        editBtn.addEventListener('click', () => openEditProfile());
        actionsDiv.appendChild(editBtn);
      } else {
        const chatBtn = document.createElement('button');
        chatBtn.className = 'btn';
        chatBtn.textContent = '💬 Написать';
        chatBtn.addEventListener('click', () => openChatWithUser(p.user_id, p.username));
        actionsDiv.appendChild(chatBtn);
      }
      profileHeader.appendChild(actionsDiv);
      header.appendChild(profileHeader);
      el.appendChild(header);
      
      const bentoGrid = document.createElement('div');
      bentoGrid.className = 'bento-grid scroll-reveal';
      
      const largeItem = document.createElement('div');
      largeItem.className = 'bento-item bento-large';
      largeItem.innerHTML = '<div style="font-size:48px;margin-bottom:10px;"></div><div style="font-size:32px;font-weight:900;color:var(--orange);">'+p.media_count+'</div><div style="color:var(--text-dim);margin-top:8px;">Постов</div>';
      bentoGrid.appendChild(largeItem);
      
      const streamItem = document.createElement('div');
      streamItem.className = 'bento-item';
      streamItem.innerHTML = '<div style="font-size:32px;"></div><div style="font-size:24px;font-weight:800;color:var(--orange);margin-top:8px;">'+p.streams_count+'</div><div style="color:var(--text-dim);font-size:12px;">Стримов</div>';
      bentoGrid.appendChild(streamItem);
      
      const dateItem = document.createElement('div');
      dateItem.className = 'bento-item';
      dateItem.innerHTML = '<div style="font-size:32px;">📅</div><div style="font-size:14px;font-weight:700;color:var(--orange);margin-top:8px;">'+new Date(p.created_at).toLocaleDateString('ru-RU')+'</div><div style="color:var(--text-dim);font-size:12px;">С нами с</div>';
      bentoGrid.appendChild(dateItem);
      
      el.appendChild(bentoGrid);
      
      const contentSection = document.createElement('div');
      contentSection.className = 'scroll-reveal';
      const h3 = document.createElement('h3');
      h3.style.cssText = 'color:var(--orange);margin:20px 0 12px;';
      h3.textContent = '📷 Контент';
      contentSection.appendChild(h3);
      const mediaDiv = document.createElement('div');
      mediaDiv.id = 'profileMedia';
      contentSection.appendChild(mediaDiv);
      el.appendChild(contentSection);
      
      loadProfileMedia(p.user_id);
      setTimeout(observeElements, 100);
    } catch(e) {
      el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--red);">Ошибка</div>';
    }
  }

  async function loadProfileMedia(userId) {
    const el = document.getElementById('profileMedia');
    if (!el) return;
    try {
      const res = await fetch('/api/feed?user_id='+userId);
      const data = await res.json();
      if (!data.items || data.items.length === 0) {
        el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim);">Контента пока нет</div>';
        return;
      }
      el.innerHTML = '';
      data.items.forEach(item => el.appendChild(renderCard(item)));
      setTimeout(observeElements, 100);
    } catch(e){}
  }

  function openEditProfile() {
    if (!currentProfile) return;
    document.getElementById('editDisplayName').value = currentProfile.display_name || '';
    document.getElementById('editUsername').value = currentProfile.username || '';
    document.getElementById('editBio').value = currentProfile.bio || '';
    openModal('editProfileModal');
  }

  document.getElementById('saveProfileBtn').addEventListener('click', async () => {
    const displayName = document.getElementById('editDisplayName').value.trim();
    const username = document.getElementById('editUsername').value.trim();
    const bio = document.getElementById('editBio').value.trim();
    
    try {
      const res1 = await fetch('/api/profile/update', {method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({display_name:displayName, bio})});
      const d1 = await res1.json();
      if (!d1.ok) { alert('Ошибка профиля: '+d1.error); return; }
      
      if (username && username !== currentProfile.username) {
        const res2 = await fetch('/api/profile/username', {method:'POST', headers:{'Content-Type':'application/json'},
          body:JSON.stringify({username})});
        const d2 = await res2.json();
        if (!d2.ok) { alert('Ошибка ника: '+d2.error); return; }
        currentUser.name = d2.new_username;
      }
      
      closeModal('editProfileModal');
      loadMyProfile();
    } catch(e) { alert('Ошибка: '+e.message); }
  });

  document.getElementById('closeEditBtn').addEventListener('click', () => closeModal('editProfileModal'));

  document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(window.searchTimer);
    window.searchTimer = setTimeout(async () => {
      const q = e.target.value.trim();
      if (!q) return loadFeed();
      if (currentPage !== 'feed') navigate('feed');
      const res = await fetch('/api/search?q='+encodeURIComponent(q));
      const data = await res.json();
      const feed = document.getElementById('feed');
      if (!feed) return;
      feed.innerHTML = '';
      if (!data.media || data.media.length === 0) {
        feed.innerHTML = '<div style="text-align:center;padding:60px;">Ничего не найдено</div>';
        return;
      }
      data.media.forEach(item => feed.appendChild(renderCard(item)));
    }, 400);
  });

  let titleClicks = 0;
  document.getElementById('siteTitle').addEventListener('click', () => {
    titleClicks++;
    if (titleClicks === 5) {
      document.body.style.filter = 'hue-rotate(180deg)';
      for(let i=0; i<50; i++) spawnParticles(Math.random()*innerWidth, Math.random()*innerHeight);
      setTimeout(() => document.body.style.filter = '', 5000);
      titleClicks = 0;
    }
  });

  init();
})();
</script>
</body>
</html>`;

export default INDEX_HTML;
