// brand-fx.js — drives lightning strikes, sparks, slide entry timing
(function() {
  function init() {
    const stage = document.querySelector('deck-stage');
    if (!stage) { setTimeout(init, 100); return; }

    const sections = Array.from(stage.querySelectorAll('section'));

    // Inject FX layers into every section
    sections.forEach((sec) => {
      // Skip if already injected
      if (sec.querySelector('.fx-strike-layer')) return;

      const strikeLayer = document.createElement('div');
      strikeLayer.className = 'fx-strike-layer';
      sec.insertBefore(strikeLayer, sec.firstChild);

      const sparkLayer = document.createElement('div');
      sparkLayer.className = 'fx-sparks';
      sec.insertBefore(sparkLayer, sec.firstChild);

      const flash = document.createElement('div');
      flash.className = 'fx-flash';
      sec.insertBefore(flash, sec.firstChild);

      const tracer = document.createElement('div');
      tracer.className = 'fx-tracer';
      sec.appendChild(tracer);

      // Add 6-9 ambient sparks per slide
      const sparkCount = 7;
      for (let i = 0; i < sparkCount; i++) {
        const s = document.createElement('div');
        s.className = 'fx-spark';
        s.style.left = (Math.random() * 100) + '%';
        s.style.top = (60 + Math.random() * 50) + '%';
        s.style.animationDelay = (Math.random() * 8) + 's';
        s.style.animationDuration = (6 + Math.random() * 6) + 's';
        sparkLayer.appendChild(s);
      }
    });

    // Track active slide
    function setActive(idx) {
      sections.forEach((s, i) => {
        if (i === idx) {
          s.classList.add('is-active');
          // Restart any animations
          s.querySelectorAll('.fx-tracer').forEach(t => {
            t.style.animation = 'none';
            void t.offsetWidth;
            t.style.animation = '';
          });
          // Trigger lightning sequence
          setTimeout(() => fireStrike(s), 120);
          // Schedule sporadic strikes while active
          scheduleSporadic(s, i);
        } else {
          s.classList.remove('is-active');
          clearSporadic(s);
        }
      });
    }

    // Remove unused observer scaffold
    const _observer = null;
    // Listen to deck-stage 'slidechange' CustomEvent (bubbles + composed)
    stage.addEventListener('slidechange', (e) => {
      const idx = (e.detail && typeof e.detail.index === 'number') ? e.detail.index : 0;
      setActive(idx);
    });
    // Initial activation in case slidechange already fired before listener
    setTimeout(() => {
      const cur = stage.currentIndex || 0;
      setActive(cur);
    }, 80);

    // ---------- LIGHTNING STRIKE ----------
    function fireStrike(sec) {
      const layer = sec.querySelector('.fx-strike-layer');
      const flash = sec.querySelector('.fx-flash');
      if (!layer) return;

      // Clear any old strikes
      layer.querySelectorAll('.fx-strike, .fx-strike-branch').forEach(n => n.remove());

      // Main bolt
      const x = 30 + Math.random() * 50; // 30%-80%
      const skew = (Math.random() - 0.5) * 8; // -4 to +4 deg
      const bolt = document.createElement('div');
      bolt.className = 'fx-strike';
      bolt.style.left = x + '%';
      bolt.style.transform = `rotate(${skew}deg)`;
      bolt.style.height = '100%';
      layer.appendChild(bolt);
      requestAnimationFrame(() => bolt.classList.add('animate'));

      // Add 1-2 zigzag branches as SVG
      const branches = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < branches; i++) {
        const branch = document.createElement('div');
        branch.className = 'fx-strike-branch';
        const by = 25 + Math.random() * 50;
        const bxOff = (Math.random() - 0.5) * 12;
        branch.style.left = `calc(${x}% + ${bxOff}%)`;
        branch.style.top = by + '%';
        branch.innerHTML = `
          <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:drop-shadow(0 0 8px rgba(67,244,254,1)) drop-shadow(0 0 18px rgba(0,158,250,0.7));">
            <path d="M40 0 L20 50 L38 52 L18 110 L60 45 L42 43 L60 0 Z" fill="url(#gZ${i})"/>
            <defs>
              <linearGradient id="gZ${i}" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stop-color="#43F4FE"/>
                <stop offset="1" stop-color="#009EFA"/>
              </linearGradient>
            </defs>
          </svg>
        `;
        layer.appendChild(branch);
        requestAnimationFrame(() => {
          branch.style.animationDelay = (60 + Math.random() * 80) + 'ms';
          branch.classList.add('animate');
        });
      }

      // Flash
      if (flash) {
        flash.style.setProperty('--flash-x', x + '%');
        flash.style.setProperty('--flash-y', '20%');
        flash.classList.remove('animate');
        void flash.offsetWidth;
        flash.classList.add('animate');
      }

      // Cleanup
      setTimeout(() => {
        layer.querySelectorAll('.fx-strike, .fx-strike-branch').forEach(n => n.remove());
      }, 900);
    }

    // ---------- SPORADIC STRIKES while slide is active ----------
    const timers = new WeakMap();
    function scheduleSporadic(sec) {
      clearSporadic(sec);
      const tick = () => {
        if (!sec.classList.contains('is-active')) return;
        // ~5-12s between strikes; lighter chance
        if (Math.random() < 0.7) {
          fireStrike(sec);
        }
        const next = 6000 + Math.random() * 7000;
        const t = setTimeout(tick, next);
        timers.set(sec, t);
      };
      const first = setTimeout(tick, 5000 + Math.random() * 4000);
      timers.set(sec, first);
    }
    function clearSporadic(sec) {
      const t = timers.get(sec);
      if (t) clearTimeout(t);
      timers.delete(sec);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
