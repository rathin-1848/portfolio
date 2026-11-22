/* Round 4: pinned sideways projects, warp intro, scroll-speed stars */
(function () {
  var doc = document, root = doc.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function (v) { return String(v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- projects: build cards from the data file ---------- */
  var sec = doc.getElementById('projects');
  var track = doc.getElementById('hpTrack');
  var data = window.portfolioProjects;
  if (sec && track && data && data.length) {
    track.innerHTML = data.map(function (p, i) {
      var prog = ['In Development', 'Learning Project'].indexOf(p.status) > -1 ? 'progress' : '';
      return '<article data-cursor="Open" class="project-card hcard ' + ['', 'm2', 'm3'][i % 3] + '">' +
        '<div class="project-media" data-art="' + esc(p.id) + '"><span class="project-symbol">' + esc(p.symbol) + '</span></div>' +
        '<div class="project-body"><div class="meta-row"><span class="project-category">' + esc(p.category) + '</span><span class="project-status ' + prog + '">' + esc(p.status) + '</span></div>' +
        '<h3>' + esc(p.name) + '</h3><p>' + esc(p.description) + '</p>' +
        '<div class="tech-row">' + p.technologies.slice(0, 4).map(function (t) { return '<span class="tech-pill">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<div class="project-actions"><a class="btn btn-primary btn-sm" href="project-details/' + encodeURIComponent(p.id) + '.html">View details</a>' +
        (p.demo ? '<a class="btn btn-sm" href="' + esc(p.demo) + '" target="_blank" rel="noopener noreferrer">Live / view</a>' : '') + '</div></div></article>';
    }).join('');
    if (window.poArt) window.poArt(track);
    var tot = doc.getElementById('hpTot'); if (tot) tot.textContent = data.length;
  }

  var cards = track ? [].slice.call(track.querySelectorAll('.hcard')) : [];
  var cur = doc.getElementById('hpCur'), bar = doc.getElementById('hpBar');
  var dist = 0, pinned = false;
  function setup() {
    if (!sec || !track) return;
    pinned = innerWidth > 900 && innerHeight >= 640;
    sec.classList.toggle('swipe', !pinned);
    if (!pinned) { sec.style.height = ''; track.style.transform = ''; return; }
    dist = Math.max(0, track.scrollWidth - innerWidth);
    sec.style.height = (innerHeight + dist) + 'px';
    update();
  }
  function update() {
    if (!pinned) return;
    var r = sec.getBoundingClientRect();
    var p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight)));
    track.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
    if (bar) bar.style.setProperty('--p', p.toFixed(4));
    if (cur) cur.textContent = Math.min(cards.length, Math.round(p * (cards.length - 1)) + 1);
    if (!reduce) {
      var cx = innerWidth / 2;
      cards.forEach(function (c) {
        var b = c.getBoundingClientRect();
        var d = Math.abs(b.left + b.width / 2 - cx) / innerWidth;
        c.style.scale = (1 - Math.min(0.1, d * 0.12)).toFixed(3);
      });
    }
  }
  setup();
  addEventListener('resize', setup);
  addEventListener('load', setup);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(setup);

  /* ---------- scroll speed -> star streaks ---------- */
  var last = scrollY, boost = 0;
  window.poBoost = 0;
  (function raf() {
    var y = scrollY, d = y - last; last = y;
    boost += (Math.max(-40, Math.min(40, d)) - boost) * 0.12;
    window.poBoost = Math.abs(boost) < 0.4 ? 0 : boost;
    update();
    requestAnimationFrame(raf);
  })();

  /* ---------- warp jump after the loader ---------- */
  if (reduce || !doc.getElementById('loader')) return;
  var started = false;
  function warp() {
    if (started) return; started = true;
    var cv = doc.createElement('canvas'); cv.id = 'warp'; cv.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(cv);
    var dpr = Math.min(devicePixelRatio || 1, 2), W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr, ctx = cv.getContext('2d');
    var cx = W * 0.5, cy = H * 0.5, max = Math.hypot(W, H) * 0.6, st = [];
    for (var i = 0; i < 200; i++) st.push({ a: Math.random() * 6.283, r: Math.random() * 80 * dpr, s: 0.5 + Math.random(), g: Math.random() < 0.18 });
    var t0 = performance.now(), D = 2200;
    (function f(now) {
      var t = (now - t0) / D;
      if (t >= 1) { cv.remove(); return; }
      ctx.clearRect(0, 0, W, H);
      var v = Math.pow(1 - t, 2.2) * 46 + 0.6, alpha = 1 - Math.pow(t, 1.6);
      ctx.lineCap = 'round';
      st.forEach(function (s) {
        var r0 = s.r; s.r += v * s.s * dpr * (0.3 + s.r / max * 1.8);
        if (s.r > max) { s.r = Math.random() * 40 * dpr; r0 = s.r; }
        var len = v * 3.4 * dpr * s.s * (s.r / max + 0.2);
        ctx.strokeStyle = s.g ? 'rgba(226,185,59,' + alpha + ')' : 'rgba(236,232,220,' + alpha * 0.85 + ')';
        ctx.lineWidth = (0.8 + s.r / max * 2) * dpr;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(s.a) * Math.max(0, s.r - len), cy + Math.sin(s.a) * Math.max(0, s.r - len));
        ctx.lineTo(cx + Math.cos(s.a) * s.r, cy + Math.sin(s.a) * s.r);
        ctx.stroke();
      });
      requestAnimationFrame(f);
    })(t0);
  }
  var mo = new MutationObserver(function () { if (root.classList.contains('loaded')) { mo.disconnect(); warp(); } });
  if (root.classList.contains('loaded')) warp(); else mo.observe(root, { attributes: true, attributeFilter: ['class'] });
})();
