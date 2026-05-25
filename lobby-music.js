/* ============================================================
   Lobby music player — pre-show audio
   Drop audio files, plays in a floating bottom-left widget.
   ============================================================ */
(function() {
  const ICONS = {
    play:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    prev:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zM9.5 12l8.5 6V6z"/></svg>',
    next:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    note:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l8-2v15a3 3 0 1 1-2-2.83V5l-4 1v13a3 3 0 1 1-2-2.83V3z"/></svg>',
    upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    volume:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
    close: '×',
  };

  function fmtTime(s) {
    if (!s || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function init() {
    if (document.getElementById('lobby-player')) return;

    // Build markup
    const wrap = document.createElement('div');
    wrap.id = 'lobby-player';
    wrap.className = 'lobby-player';
    wrap.innerHTML = `
      <div class="lobby-fab" id="lobby-fab">
        <span class="lobby-fab-icon">${ICONS.note}</span>
        <span class="lobby-fab-label">
          <span class="lobby-fab-now" id="lobby-fab-now">Lobby</span>
          <span id="lobby-fab-status">Add music</span>
        </span>
      </div>
      <div class="lobby-panel">
        <div class="lobby-panel-head">
          <span class="lobby-panel-title">Lobby Music</span>
          <button class="lobby-close" id="lobby-close" title="Close">${ICONS.close}</button>
        </div>
        <div class="lobby-now">
          <span class="lobby-now-art">${ICONS.note}</span>
          <div class="lobby-now-text">
            <span class="lobby-now-track" id="lobby-now-track">No track loaded</span>
            <span class="lobby-now-sub" id="lobby-now-sub">Upload to start</span>
          </div>
        </div>
        <div class="lobby-progress">
          <div class="lobby-progress-bar" id="lobby-bar">
            <div class="lobby-progress-fill" id="lobby-fill"></div>
          </div>
          <div class="lobby-progress-times">
            <span id="lobby-time-cur">0:00</span>
            <span id="lobby-time-dur">0:00</span>
          </div>
        </div>
        <div class="lobby-controls">
          <button class="lobby-btn" id="lobby-shuffle" title="Shuffle">${ICONS.shuffle}</button>
          <button class="lobby-btn" id="lobby-prev" title="Previous">${ICONS.prev}</button>
          <button class="lobby-btn lobby-play" id="lobby-play" title="Play / Pause">${ICONS.play}</button>
          <button class="lobby-btn" id="lobby-next" title="Next">${ICONS.next}</button>
          <button class="lobby-btn is-on" id="lobby-loop" title="Loop playlist">${ICONS.repeat}</button>
        </div>
        <div class="lobby-volume">
          ${ICONS.volume}
          <input type="range" id="lobby-vol" min="0" max="100" value="60" />
        </div>
        <ul class="lobby-playlist" id="lobby-playlist"></ul>
        <label class="lobby-upload" id="lobby-drop">
          ${ICONS.upload}
          <span>Drop audio files or click to choose</span>
          <input type="file" id="lobby-file" accept="audio/*" multiple />
        </label>
      </div>
    `;
    document.body.appendChild(wrap);

    // State
    const audio = new Audio();
    audio.volume = 0.6;
    const state = {
      tracks: [], // {name, url, file}
      idx: -1,
      playing: false,
      shuffle: false,
      loop: true,
    };

    // Helpers
    const $ = (id) => document.getElementById(id);
    const els = {
      fab: $('lobby-fab'),
      close: $('lobby-close'),
      panel: wrap.querySelector('.lobby-panel'),
      nowTrack: $('lobby-now-track'),
      nowSub: $('lobby-now-sub'),
      fabNow: $('lobby-fab-now'),
      fabStatus: $('lobby-fab-status'),
      bar: $('lobby-bar'),
      fill: $('lobby-fill'),
      timeCur: $('lobby-time-cur'),
      timeDur: $('lobby-time-dur'),
      play: $('lobby-play'),
      prev: $('lobby-prev'),
      next: $('lobby-next'),
      shuffle: $('lobby-shuffle'),
      loop: $('lobby-loop'),
      vol: $('lobby-vol'),
      playlist: $('lobby-playlist'),
      drop: $('lobby-drop'),
      file: $('lobby-file'),
    };

    // Open/close
    function setOpen(open) {
      wrap.classList.toggle('is-open', open);
    }
    els.fab.addEventListener('click', () => setOpen(!wrap.classList.contains('is-open')));
    els.close.addEventListener('click', (e) => { e.stopPropagation(); setOpen(false); });

    // Rendering
    function renderPlaylist() {
      if (!state.tracks.length) {
        els.playlist.innerHTML = '<li class="lobby-empty">No tracks yet — drop audio files below to get started.</li>';
        return;
      }
      els.playlist.innerHTML = state.tracks.map((t, i) => `
        <li class="lobby-track ${i === state.idx ? 'is-current' : ''}" data-i="${i}">
          <span class="lobby-track-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="lobby-track-name" title="${escapeHtml(t.name)}">${escapeHtml(t.name)}</span>
          <button class="lobby-track-remove" data-remove="${i}" title="Remove">×</button>
        </li>
      `).join('');
    }
    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
    function renderNow() {
      const t = state.tracks[state.idx];
      if (t) {
        els.nowTrack.textContent = t.name;
        els.nowSub.textContent = state.playing ? 'Now playing' : 'Paused';
        els.fabStatus.textContent = t.name.length > 24 ? t.name.slice(0, 22) + '…' : t.name;
        els.fabNow.textContent = state.playing ? 'Playing' : 'Paused';
      } else {
        els.nowTrack.textContent = 'No track loaded';
        els.nowSub.textContent = 'Upload to start';
        els.fabStatus.textContent = state.tracks.length ? 'Ready' : 'Add music';
        els.fabNow.textContent = 'Lobby';
      }
      els.play.innerHTML = state.playing ? ICONS.pause : ICONS.play;
      wrap.classList.toggle('is-playing', state.playing);
    }

    // Track management
    function addFiles(files) {
      const added = [];
      for (const f of files) {
        if (!f.type.startsWith('audio/')) continue;
        const url = URL.createObjectURL(f);
        const name = f.name.replace(/\.[a-z0-9]+$/i, '');
        state.tracks.push({ name, url, file: f });
        added.push(name);
      }
      renderPlaylist();
      if (state.idx < 0 && state.tracks.length) {
        loadTrack(0, false);
      }
    }
    function removeTrack(i) {
      const wasCurrent = i === state.idx;
      URL.revokeObjectURL(state.tracks[i].url);
      state.tracks.splice(i, 1);
      if (wasCurrent) {
        audio.pause();
        state.playing = false;
        if (state.tracks.length) {
          loadTrack(Math.min(i, state.tracks.length - 1), false);
        } else {
          state.idx = -1;
          audio.src = '';
        }
      } else if (i < state.idx) {
        state.idx--;
      }
      renderPlaylist();
      renderNow();
    }
    function loadTrack(i, autoplay) {
      if (i < 0 || i >= state.tracks.length) return;
      state.idx = i;
      audio.src = state.tracks[i].url;
      audio.load();
      if (autoplay) {
        audio.play().then(() => { state.playing = true; renderNow(); renderPlaylist(); })
          .catch(() => { state.playing = false; renderNow(); });
      } else {
        renderNow();
        renderPlaylist();
      }
    }

    function togglePlay() {
      if (state.idx < 0) return;
      if (audio.paused) {
        audio.play().then(() => { state.playing = true; renderNow(); })
          .catch(() => { state.playing = false; renderNow(); });
      } else {
        audio.pause();
        state.playing = false;
        renderNow();
      }
    }
    function next() {
      if (!state.tracks.length) return;
      let i;
      if (state.shuffle && state.tracks.length > 1) {
        do { i = Math.floor(Math.random() * state.tracks.length); } while (i === state.idx);
      } else {
        i = state.idx + 1;
        if (i >= state.tracks.length) {
          if (state.loop) i = 0;
          else { audio.pause(); state.playing = false; renderNow(); return; }
        }
      }
      loadTrack(i, true);
    }
    function prev() {
      if (!state.tracks.length) return;
      if (audio.currentTime > 3) { audio.currentTime = 0; return; }
      let i = state.idx - 1;
      if (i < 0) i = state.loop ? state.tracks.length - 1 : 0;
      loadTrack(i, state.playing);
    }

    // Wire controls
    els.play.addEventListener('click', togglePlay);
    els.next.addEventListener('click', next);
    els.prev.addEventListener('click', prev);
    els.shuffle.addEventListener('click', () => {
      state.shuffle = !state.shuffle;
      els.shuffle.classList.toggle('is-on', state.shuffle);
    });
    els.loop.addEventListener('click', () => {
      state.loop = !state.loop;
      els.loop.classList.toggle('is-on', state.loop);
    });
    els.vol.addEventListener('input', () => {
      audio.volume = els.vol.value / 100;
    });
    els.bar.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const r = els.bar.getBoundingClientRect();
      audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
    });

    // Playlist clicks
    els.playlist.addEventListener('click', (e) => {
      const rem = e.target.closest('[data-remove]');
      if (rem) {
        e.stopPropagation();
        removeTrack(parseInt(rem.dataset.remove, 10));
        return;
      }
      const row = e.target.closest('.lobby-track');
      if (row) loadTrack(parseInt(row.dataset.i, 10), true);
    });

    // File picker + drag-drop
    els.file.addEventListener('change', (e) => {
      addFiles(e.target.files);
      e.target.value = '';
    });
    ['dragenter','dragover'].forEach(ev =>
      els.drop.addEventListener(ev, (e) => { e.preventDefault(); els.drop.classList.add('is-drag'); })
    );
    ['dragleave','drop'].forEach(ev =>
      els.drop.addEventListener(ev, (e) => { e.preventDefault(); els.drop.classList.remove('is-drag'); })
    );
    els.drop.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
    });

    // Audio events
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      els.fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
      els.timeCur.textContent = fmtTime(audio.currentTime);
    });
    audio.addEventListener('loadedmetadata', () => {
      els.timeDur.textContent = fmtTime(audio.duration);
    });
    audio.addEventListener('ended', next);
    audio.addEventListener('play', () => { state.playing = true; renderNow(); renderPlaylist(); });
    audio.addEventListener('pause', () => { state.playing = false; renderNow(); });

    // Initial render
    renderPlaylist();
    renderNow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
