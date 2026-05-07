/* ============================================================
   chargeFUZE Open House 2026 — interactive components
   ============================================================ */

// ===== Slide 04: Rent · Charge · Return stepper =====
const RCR_STEPS = [
  { num: '01', title: 'Locate', desc: 'Guest finds a chargeFUZE station via the app or on-site wayfinding signage.', icon: 'pin' },
  { num: '02', title: 'Rent',   desc: 'Guest receives a portable power bank through flexible, frictionless payment options.', icon: 'card' },
  { num: '03', title: 'Charge', desc: 'Compatible cord powers any device — guest is free to roam while charging anywhere.', icon: 'bolt' },
  { num: '04', title: 'Return', desc: 'When charged, guest returns the power bank to any chargeFUZE station nationwide.', icon: 'check' },
];

let rcrIdx = 0;
let rcrTimer = null;

function rcrIcon(name) {
  const stroke = 'currentColor';
  const sw = 2;
  const common = `width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
  switch (name) {
    case 'pin':   return `<svg ${common}><path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
    case 'card':  return `<svg ${common}><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 16h4"/></svg>`;
    case 'bolt':  return `<svg ${common}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>`;
    case 'check': return `<svg ${common}><path d="M20 6 9 17l-5-5"/></svg>`;
  }
}

function rcrRender() {
  const rail = document.getElementById('rcr-rail');
  if (!rail) return;
  // Render rail steps
  rail.querySelectorAll('.rcr-step').forEach(n => n.remove());
  RCR_STEPS.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'rcr-step' + (i === rcrIdx ? ' active' : i < rcrIdx ? ' done' : '');
    el.innerHTML = `
      <div class="rcr-dot">${s.num}</div>
      <div class="rcr-step-title">${s.title}</div>
      <div class="rcr-step-sub">Step ${i + 1} of 4</div>
    `;
    el.onclick = () => { rcrIdx = i; rcrRender(); };
    rail.appendChild(el);
  });
  // progress bar
  const prog = document.getElementById('rcr-progress');
  if (prog) prog.style.width = `calc((100% - 92px) * ${rcrIdx / (RCR_STEPS.length - 1)})`;

  // Detail
  const s = RCR_STEPS[rcrIdx];
  document.getElementById('rcr-num').textContent = s.num;
  document.getElementById('rcr-title').textContent = s.title;
  document.getElementById('rcr-desc').textContent = s.desc;
  const visual = document.getElementById('rcr-visual');
  visual.style.color = 'var(--charge-blue)';
  visual.innerHTML = `
    <div style="position:absolute; inset:0; background:
      radial-gradient(circle at 50% 50%, rgba(0,158,250,0.10), transparent 60%);"></div>
    <div style="position: relative;">${rcrIcon(s.icon)}</div>
  `;
}

function rcrNext() { rcrIdx = (rcrIdx + 1) % RCR_STEPS.length; rcrRender(); }
function rcrPrev() { rcrIdx = (rcrIdx - 1 + RCR_STEPS.length) % RCR_STEPS.length; rcrRender(); }
function rcrAuto() {
  if (rcrTimer) { clearInterval(rcrTimer); rcrTimer = null; return; }
  rcrTimer = setInterval(rcrNext, 1800);
}

// ===== Slide 05: hardware is now static, no JS needed =====
function setHw() { /* no-op, kept for any leftover handlers */ }

// ===== Slide 09: Tier explorer =====
const TIERS = {
  A: {
    color: 'var(--charge-blue)',
    name: 'Tier A · Premier venues',
    pay60: 500, payAfter: 400,
    qual: '500+ Google reviews · key metro markets · top-flow venue types',
    types: ['Bars', 'Hotels', 'Casinos', 'Music venues', 'Major restaurants'],
    examples: ['MSG Madison Square Garden', 'Bellagio Las Vegas', 'The Bowery Hotel', 'Jazz at Lincoln Center'],
    why: 'High footfall, long dwell time, premium clientele. These venues turn power banks faster than anywhere else on the network.',
  },
  B: {
    color: 'var(--connect-blue)',
    name: 'Tier B · Standard venues',
    pay60: 400, payAfter: 300,
    qual: '< 500 Google reviews · established footprint · steady traffic',
    types: ['Local restaurants', 'Boutique hotels', 'Coffee shops', 'Mid-size venues'],
    examples: ['Neighborhood gastropubs', 'Independent hotels', 'Co-working spaces', 'Art galleries'],
    why: 'The volume of the network. Reliable placements that stack quickly to build market density.',
  },
  C: {
    color: '#6B8FB8',
    name: 'Tier C · Experimental',
    pay60: 300, payAfter: 200,
    qual: 'Net-new venue categories · test markets · partner trials',
    types: ['Gyms', 'Salons', 'Pop-ups', 'Universities', 'Medical waiting rooms'],
    examples: ['Boutique fitness studios', 'Festival villages', 'Hospital lobbies', 'Campus student unions'],
    why: 'New ground. Where reps prove a category can work — early movers get first claim on the territory.',
  },
};

function setTier(letter) {
  document.querySelectorAll('.tier-card').forEach(c => c.classList.toggle('active', c.dataset.tier === letter));
  const t = TIERS[letter];
  const out = document.getElementById('tier-detail');
  out.innerHTML = `
    <div style="display:flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <div style="font-family:'Inter Tight'; font-weight:700; font-size: 22px; letter-spacing:0.16em; color: ${t.color};">${t.name.split(' · ')[0].toUpperCase()}</div>
        <h2 class="subtitle" style="margin-top: 8px; font-size: 56px;">${t.name.split(' · ')[1]}</h2>
      </div>
      <div style="text-align: right;">
        <div style="font-family:'Inter Tight'; font-weight:700; font-size: 80px; line-height:1; color: ${t.color}; letter-spacing:-0.03em;">$${t.pay60}<span style="font-size:24px; font-weight:500; opacity:0.6; letter-spacing:0;"> / station</span></div>
        <div style="font-size: 16px; letter-spacing: 0.14em; opacity: 0.55; text-transform: uppercase; margin-top: 6px;">First 60 days · then $${t.payAfter}/station</div>
      </div>
    </div>

    <div class="td-section">
      <div class="td-label">Qualifies as</div>
      <p style="margin-top: 12px; font-size: 22px; line-height: 1.45; color: var(--ink-700);">${t.qual}</p>
    </div>

    <div class="td-section">
      <div class="td-label">Venue types</div>
      <div class="td-list">${t.types.map(x => `<div class="td-chip">${x}</div>`).join('')}</div>
    </div>

    <div class="td-section">
      <div class="td-label">Real-world examples</div>
      <div class="td-list">${t.examples.map(x => `<div class="td-chip" style="background: rgba(0,158,250,0.08); border-color: rgba(0,158,250,0.20); color: var(--connect-blue);">${x}</div>`).join('')}</div>
    </div>
  `;
}

document.querySelectorAll('.tier-card').forEach(c => {
  c.addEventListener('click', () => setTier(c.dataset.tier));
});

// ===== Slide 10: Commission Estimator =====
let estState = { spw: 5, mix: { A: 40, B: 40, C: 20 }, hor: 4 };
const RATE_FIRST = { A: 500, B: 400, C: 300 };

function fmt(n) { return '$' + Math.round(n).toLocaleString(); }

function estCalc() {
  const total = estState.mix.A + estState.mix.B + estState.mix.C || 1;
  const aPct = estState.mix.A / total;
  const bPct = estState.mix.B / total;
  const cPct = estState.mix.C / total;
  const avgPer = aPct * RATE_FIRST.A + bPct * RATE_FIRST.B + cPct * RATE_FIRST.C;
  const weekly = estState.spw * avgPer;
  const period = weekly * estState.hor;
  return { avgPer, weekly, period, annual: weekly * 52, stations: estState.spw * estState.hor };
}

const HOR_LABEL = { 1: '1 week', 4: '1 month', 12: '3 months', 26: '6 months', 52: '1 year' };

function estRender() {
  const r = estCalc();
  document.getElementById('est-spw-val').textContent = estState.spw;
  document.getElementById('est-stations').textContent = Math.round(r.stations).toLocaleString();
  document.getElementById('est-avg').textContent = fmt(r.avgPer);
  document.getElementById('est-weekly').textContent = fmt(r.weekly);
  document.getElementById('est-annual').textContent = fmt(r.annual);
  document.getElementById('est-total').textContent = fmt(r.period);
  document.getElementById('est-period').textContent = 'over ' + HOR_LABEL[estState.hor];

  const total = estState.mix.A + estState.mix.B + estState.mix.C || 1;
  ['A','B','C'].forEach(t => {
    const pct = Math.round((estState.mix[t] / total) * 100);
    document.getElementById('mix-' + t.toLowerCase() + '-pct').textContent = pct + '%';
  });
}

document.getElementById('est-spw').addEventListener('input', e => {
  estState.spw = +e.target.value; estRender();
});
['A','B','C'].forEach(t => {
  document.getElementById('mix-' + t.toLowerCase()).addEventListener('input', e => {
    estState.mix[t] = +e.target.value; estRender();
  });
});
document.querySelectorAll('.hor-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.hor-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    estState.hor = +b.dataset.hor;
    estRender();
  });
});

// ===== Slide 10: Vetted venue hit list =====
const HIT_LIST = {
  la: {
    label: 'Los Angeles',
    sub: 'Hermosa / Manhattan Beach · Hollywood · WeHo · BH · West LA · DTLA · Long Beach · OC',
    venues: [
      { name: 'Lazy Dog Restaurant & Bar',        hood: 'Torrance',          tier: 'A', meta: '1.2K reviews · Bar / Restaurant' },
      { name: 'Urban Plates',                     hood: 'Manhattan Beach',   tier: 'A', meta: '720 reviews · Casual dining' },
      { name: 'Good Stuff — Hermosa Beach',       hood: 'Hermosa Beach',     tier: 'A', meta: '900 reviews · Bar / Restaurant' },
      { name: 'The Strand House',                 hood: 'Manhattan Beach',   tier: 'A', meta: '1.8K reviews · Upscale dining' },
      { name: 'Rock & Brews',                     hood: 'Redondo Beach',     tier: 'A', meta: '1.4K reviews · Sports bar' },
      { name: 'Kincaid\'s Fish, Chop & Steakhouse', hood: 'Redondo Beach',   tier: 'A', meta: '2.0K reviews · Steakhouse' },
      { name: 'Tin Roof Bistro',                  hood: 'Manhattan Beach',   tier: 'A', meta: '1.6K reviews · Bistro' },
      { name: 'NORMS Restaurant',                 hood: 'Torrance',          tier: 'A', meta: '900 reviews · 24/7 diner' },
      { name: 'SteelCraft Long Beach',            hood: 'Long Beach',        tier: 'A', meta: '2.2K reviews · Food hall' },
      { name: 'Islands Restaurant',               hood: 'Manhattan Beach',   tier: 'A', meta: '550 reviews · Casual' },
      { name: 'Nick\'s Manhattan Beach',          hood: 'Manhattan Beach',   tier: 'A', meta: '780 reviews · Mexican' },
      { name: 'The Kettle',                       hood: 'Manhattan Beach',   tier: 'A', meta: '1.3K reviews · 24/7 diner' },
    ],
  },
  nyc: {
    label: 'New York',
    sub: 'Manhattan · Brooklyn · Queens · Bronx · Borough Map view',
    venues: [
      { name: 'The River Café',          hood: 'DUMBO / Brooklyn Heights', tier: 'A', meta: 'Iconic waterfront · Sun 5pm open' },
      { name: 'Manhatta',                hood: 'Lower Manhattan / FiDi',   tier: 'A', meta: 'Sun 11:30am open' },
      { name: 'Gramercy Tavern',         hood: 'Lower Manhattan',          tier: 'A', meta: 'Sun 11:30am open' },
      { name: 'Clinton St. Baking Co.',  hood: 'SoHo / NoLiTa / LES',      tier: 'A', meta: 'Sun 8:30am open' },
      { name: 'The Smith',               hood: 'DUMBO / Brooklyn Heights', tier: 'A', meta: 'Sun 9:00am open' },
      { name: 'Sweet Chick',             hood: 'DUMBO / Brooklyn Heights', tier: 'A', meta: 'Sun 10:00am open' },
      { name: 'Peaches',                 hood: 'Bushwick',                 tier: 'A', meta: 'Sun 9:00am open' },
      { name: 'The Blue Dog Cookhouse',  hood: 'Midtown West / Hell\'s Kitchen', tier: 'A', meta: 'Sun 8:30am open' },
      { name: 'Five Leaves',             hood: 'Greenpoint',               tier: 'A', meta: 'Sun 10:00am open' },
      { name: 'The Smith',               hood: 'Upper West Side',          tier: 'A', meta: 'Sun 11:30am open' },
      { name: 'Sanford\'s',              hood: 'Astoria',                  tier: 'B', meta: 'Sun closed (M-Sa open)' },
      { name: 'Angel of Harlem',         hood: 'Harlem',                   tier: 'A', meta: 'Sun 12:00pm open' },
      { name: 'Junior\'s Restaurant',    hood: 'DUMBO / Brooklyn Heights', tier: 'A', meta: 'Sun 7:00am open' },
      { name: 'Sunday in Brooklyn',      hood: 'Williamsburg',             tier: 'A', meta: 'Sun 8:00am open' },
    ],
  },
  more: {
    label: '+ 16 metros',
    sub: 'SF · Chicago · Miami · Austin · Vegas · Nashville · Dallas · Boston · DC · Philly · Seattle · Denver · ATL · Houston · Phoenix · SD',
    venues: [
      { name: 'House of Blues',          hood: 'Chicago, IL',     tier: 'A', meta: 'Live music · 1.8K reviews' },
      { name: 'The Joint',               hood: 'Las Vegas, NV',   tier: 'A', meta: 'Hard Rock · 2.4K reviews' },
      { name: 'Robert\'s Western World', hood: 'Nashville, TN',   tier: 'A', meta: 'Honky-tonk · 2.0K reviews' },
      { name: 'The Continental Club',    hood: 'Austin, TX',      tier: 'A', meta: 'Live music · 1.2K reviews' },
      { name: 'The Tipsy Cow',           hood: 'San Francisco, CA', tier: 'B', meta: '420 reviews · Burger bar' },
      { name: 'Wynwood Walls Café',      hood: 'Miami, FL',       tier: 'B', meta: '380 reviews · Arts district' },
      { name: 'The Bitter End',          hood: 'NYC (overflow)',  tier: 'C', meta: 'Live venue · niche' },
      { name: 'Vinyl Tap Brewing',       hood: 'Denver, CO',      tier: 'C', meta: 'Brewery · niche' },
    ],
  },
};
const HL_TIER_COPY = {
  A: 'Premier',
  B: 'Standard',
  C: 'Experimental',
};
function hlSetCity(city) {
  document.querySelectorAll('.hl-tab').forEach(b => {
    const on = b.dataset.city === city;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  hlRender(city);
}
function hlRender(city) {
  const list = document.getElementById('hl-list');
  if (!list) return;
  const data = HIT_LIST[city];
  if (!data) return;
  const rows = data.venues.map((v, i) => `
    <div class="hl-row" style="animation-delay: ${i * 35}ms;">
      <div class="hl-row-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="hl-row-main">
        <div class="hl-row-name">${v.name}</div>
        <div class="hl-row-meta">${v.hood} · ${v.meta}</div>
      </div>
      <div class="hl-row-tier"><span class="tier-badge tier-${v.tier}">${v.tier}</span></div>
      <div class="hl-row-status">
        <span class="hl-stage">Prospecting</span>
      </div>
    </div>
  `).join('');
  list.innerHTML = `
    <div class="hl-list-head">
      <div class="hl-list-title">
        <span class="hl-list-city">${data.label}</span>
        <span class="hl-list-sub">${data.sub}</span>
      </div>
      <div class="hl-list-cols">
        <span>VENUE</span>
        <span>TIER</span>
        <span>STATUS</span>
      </div>
    </div>
    <div class="hl-rows">
      ${rows}
    </div>
  `;
}
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.hl-tab');
  if (tab) hlSetCity(tab.dataset.city);
});

// ===== Slide 11: Leaderboard ===== (legacy — kept guarded)
const LEADERS = [
  { rank: 1, name: 'Top Closer',    city: 'Los Angeles',    placed: 14, mix: '8A · 4B · 2C', pay: 6200 },
  { rank: 2, name: 'Runner-up',     city: 'New York',       placed: 12, mix: '7A · 4B · 1C', pay: 5400 },
  { rank: 3, name: 'Third place',   city: 'Miami',          placed: 11, mix: '5A · 5B · 1C', pay: 4800 },
  { rank: 4, name: 'Fourth',        city: 'San Francisco',  placed: 10, mix: '6A · 3B · 1C', pay: 4500 },
  { rank: 5, name: 'Fifth',         city: 'Chicago',        placed:  9, mix: '4A · 4B · 1C', pay: 3900 },
];

function lbRender() {
  const list = document.getElementById('lb-list');
  if (!list) return;
  list.innerHTML = LEADERS.map(r => `
    <div class="lb-row">
      <div class="lb-rank">${String(r.rank).padStart(2,'0')}</div>
      <div>
        <div class="lb-name">${r.name}</div>
        <div class="lb-city">${r.city}</div>
      </div>
      <div class="lb-stat">${r.placed}<span class="lb-stat-sub">Placed</span></div>
      <div class="lb-stat" style="font-size:22px; opacity:0.85;">${r.mix}<span class="lb-stat-sub">Tier mix</span></div>
      <div class="lb-pay">$${r.pay.toLocaleString()}</div>
    </div>
  `).join('');
}

// ===== Slide 05: F10 / F15 photo swap =====
const HW_CAPTIONS = {
  F10: { label: 'F10 · IN THE WILD', venue: 'Fat Tuesday · Bar / Restaurant' },
  F15: { label: 'F15 · IN THE WILD', venue: 'House of Cocotte · Lounge' },
};
function setHwModel(model) {
  document.querySelectorAll('.hw-card-btn').forEach(b => {
    b.classList.toggle('is-active', b.dataset.model === model);
  });
  document.querySelectorAll('.hw-photo').forEach(img => {
    img.classList.toggle('is-active', img.dataset.model === model);
  });
  const cap = HW_CAPTIONS[model];
  if (cap) {
    const lbl = document.getElementById('hw-photo-label');
    const ven = document.getElementById('hw-photo-venue');
    if (lbl) lbl.textContent = cap.label;
    if (ven) ven.textContent = cap.venue;
  }
}
document.querySelectorAll('.hw-card-btn').forEach(b => {
  b.addEventListener('click', () => setHwModel(b.dataset.model));
});

// Slide 05 — lightbox: click photo frame → enlarge active image
const HW_PHOTO_SRC = {
  F10: 'assets/photos/station-fattuesday.jpg',
  F15: 'assets/photos/station-f15.jpg',
};
function openHwLightbox() {
  const active = document.querySelector('.hw-card-btn.is-active');
  const model = active ? active.dataset.model : 'F10';
  const cap = HW_CAPTIONS[model];
  const lb = document.getElementById('hw-lightbox');
  const img = document.getElementById('hw-lightbox-img');
  const capEl = document.getElementById('hw-lightbox-cap');
  if (!lb || !img || !capEl) return;
  img.src = HW_PHOTO_SRC[model];
  capEl.innerHTML = `<span class="lb-label">${cap.label}</span><span class="lb-venue">${cap.venue}</span>`;
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeHwLightbox() {
  const lb = document.getElementById('hw-lightbox');
  if (!lb) return;
  lb.classList.remove('is-open');
  lb.setAttribute('aria-hidden', 'true');
  const img = document.getElementById('hw-lightbox-img');
  if (img) img.classList.remove('is-map');
  document.body.style.overflow = '';
}
const hwFrame = document.getElementById('hw-photo-frame');
if (hwFrame) {
  hwFrame.addEventListener('click', openHwLightbox);
  hwFrame.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openHwLightbox();
    }
  });
}
document.querySelectorAll('#hw-lightbox [data-close]').forEach(el => {
  el.addEventListener('click', closeHwLightbox);
});
// Slide 07 — map lightbox
const MAP_PHOTOS = {
  competitor: { src: 'assets/photos/map-competitor.png', label: 'THE COMPETITION', venue: 'Lyte · LA · ~10 visible stations' },
  chargefuze: { src: 'assets/photos/map-chargefuze.png', label: 'CHARGEFUZE', venue: 'Same map, same city · 200+ active stations' },
};
function openMapLightbox(key) {
  const m = MAP_PHOTOS[key];
  if (!m) return;
  const lb = document.getElementById('hw-lightbox');
  const img = document.getElementById('hw-lightbox-img');
  const capEl = document.getElementById('hw-lightbox-cap');
  if (!lb || !img || !capEl) return;
  img.src = m.src;
  img.classList.add('is-map');
  capEl.innerHTML = `<span class="lb-label">${m.label}</span><span class="lb-venue">${m.venue}</span>`;
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
document.querySelectorAll('.map-photo-btn').forEach(b => {
  b.addEventListener('click', () => openMapLightbox(b.dataset.map));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeHwLightbox();
});

// ===== INIT =====
function initAll() {
  rcrRender();
  setTier('A');
  estRender();
  lbRender();
  setHwModel('F10');
  hlSetCity('la');
}

// Replay leaderboard animation when its slide is shown (legacy guard).
window.addEventListener('message', (e) => {
  const idx = e.data && e.data.slideIndexChanged;
  if (typeof idx !== 'number') return;
  // Hit list slide is index 9 (slide 10) — replay row entrance.
  if (idx === 9) {
    document.querySelectorAll('#hl-list .hl-row').forEach(r => {
      r.style.animation = 'none';
      void r.offsetWidth;
      r.style.animation = '';
    });
  }
});

// Wait for DOM, but components may also be reachable before deck-stage upgrade.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
